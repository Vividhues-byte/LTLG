import { getArticleLearning, getRelatedArticles } from "@/data/article-learning";
import {
  findArticleByQuery,
  getArticleById,
  constitutionArticles,
} from "@/data/constitution-loader";
import type { ArticleQAContext, ArticleQAResponse } from "@/types";

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "what", "how", "why", "when", "where",
  "does", "do", "can", "could", "would", "should", "about", "this", "that",
  "under", "from", "with", "for", "and", "or", "in", "on", "at", "to", "of",
  "article", "art", "explain", "tell", "me", "please", "give", "related",
  "difference", "between", "cases", "case", "landmark", "clat", "upsc",
  "judiciary", "exam", "power", "powers", "clause", "minimum", "quorum",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function splitIntoClauses(content: string): string[] {
  const parts = content
    .split(/\n{2,}|(?=\(\d+\))|(?=\([a-z]\))/i)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [content];
}

function extractRelevantProvision(content: string, question: string): string {
  const qTokens = tokenize(question);
  const clauses = splitIntoClauses(content);

  const clauseMatch = question.match(/clause\s*(\d+)|\((\d+)\)/i);
  if (clauseMatch) {
    const num = clauseMatch[1] || clauseMatch[2];
    const found = clauses.find((c) => c.startsWith(`(${num})`) || c.includes(`(${num})`));
    if (found) return found.trim();
  }

  const subClauseMatch = question.match(/sub-?clause\s*\(?([a-g])\)?|\(([a-g])\)/i);
  if (subClauseMatch) {
    const letter = (subClauseMatch[1] || subClauseMatch[2]).toLowerCase();
    const found = clauses.find((c) => c.includes(`(${letter})`));
    if (found) return found.trim();
  }

  if (qTokens.length === 0) return content.trim();

  const scored = clauses
    .map((clause) => {
      const lower = clause.toLowerCase();
      let score = 0;
      for (const token of qTokens) {
        if (lower.includes(token)) score += 2;
      }
      return { clause, score };
    })
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score > 0) {
    const top = scored.filter((s) => s.score === scored[0].score).map((s) => s.clause);
    return top.join("\n\n").trim();
  }

  return content.trim();
}

function contextualizeQuestion(context: ArticleQAContext, question: string): string {
  const q = question.trim();
  const label = context.label;
  const hasArticleRef = /article\s*\d|art\.?\s*\d|preamble/i.test(q);
  if (hasArticleRef || q.toLowerCase().includes(label.toLowerCase())) return q;
  return `${q} (in the context of ${label}: ${context.title})`;
}

function parseCompareArticles(
  question: string,
  currentLabel: string
): { a: string; b: string } | null {
  const match = question.match(
    /difference\s+between\s+article\s*(\d+[a-z]?)\s+and\s+article\s*(\d+[a-z]?)/i
  );
  if (match) return { a: match[1], b: match[2] };

  const short = question.match(/article\s*(\d+[a-z]?)\s+(?:vs\.?|versus|and)\s+article\s*(\d+[a-z]?)/i);
  if (short) return { a: short[1], b: short[2] };

  const otherOnly = question.match(
    /difference\s+(?:between\s+)?(?:this\s+article\s+and\s+)?article\s*(\d+[a-z]?)/i
  );
  if (otherOnly && currentLabel) {
    const currentNum = currentLabel.replace(/article\s*/i, "").trim();
    return { a: currentNum, b: otherOnly[1] };
  }

  return null;
}

function buildCompareResponse(
  context: ArticleQAContext,
  question: string
): ArticleQAResponse | null {
  const pair = parseCompareArticles(question, context.label);
  if (!pair) return null;

  const artA = findArticleByQuery(`Article ${pair.a}`);
  const artB = findArticleByQuery(`Article ${pair.b}`);
  if (!artA || !artB) return null;

  const learnA = getArticleLearning(artA.id);
  const learnB = getArticleLearning(artB.id);

  return {
    directAnswer: `${artA.number} (${artA.title}) and ${artB.number} (${artB.title}) address different constitutional themes. ${artA.number} focuses on ${artA.title.toLowerCase()}, while ${artB.number} deals with ${artB.title.toLowerCase()}.`,
    provision: `${artA.number}:\n${extractRelevantProvision(artA.content, question)}\n\n${artB.number}:\n${extractRelevantProvision(artB.content, question)}`,
    explanation: `${learnA?.explanation ?? artA.summary}\n\nCompared with ${artB.number}: ${learnB?.explanation ?? artB.summary}`,
    examTip: "Comparison questions between neighbouring fundamental rights articles (e.g. 14 vs 15, 19 vs 21) are common in CLAT and UPSC Prelims.",
    relatedArticles: [
      { id: artA.id, number: artA.number, title: artA.title },
      { id: artB.id, number: artB.number, title: artB.title },
    ],
  };
}

function buildCasesResponse(
  context: ArticleQAContext,
  question: string
): ArticleQAResponse | null {
  if (!/case|cases|judgment|judgement|landmark|precedent/i.test(question)) return null;

  const articleId = context.kind === "article" ? context.id : undefined;
  const targetArticle = articleId
    ? getArticleById(articleId)
    : findArticleByQuery(question);

  if (!targetArticle) return null;

  const learning = getArticleLearning(targetArticle.id);
  const cases = learning?.landmarkCases.filter(
    (c) => !c.name.includes("Constitutional interpretation")
  ) ?? [];

  if (cases.length === 0) {
    return {
      directAnswer: `No curated landmark cases are listed for ${targetArticle.number} yet. Courts routinely interpret it alongside other provisions in ${targetArticle.part}.`,
      provision: extractRelevantProvision(targetArticle.content, question),
      explanation: learning?.explanation ?? targetArticle.summary,
      examTip: "For CLAT, focus on the article text and one leading case name if asked.",
      relatedArticles: getRelatedArticles(targetArticle.id).map((a) => ({
        id: a.id,
        number: a.number,
        title: a.title,
      })),
    };
  }

  const caseList = cases.map((c) => `• ${c.name} (${c.year}) — ${c.summary}`).join("\n");

  return {
    directAnswer: `Key landmark cases connected to ${targetArticle.number}:`,
    provision: extractRelevantProvision(targetArticle.content, question),
    explanation: `${caseList}\n\n${learning?.explanation ?? ""}`.trim(),
    examTip: "Judiciary and CLAT often ask case names with the constitutional article they interpret.",
    relatedArticles: getRelatedArticles(targetArticle.id).map((a) => ({
      id: a.id,
      number: a.number,
      title: a.title,
    })),
  };
}

function buildExamResponse(
  context: ArticleQAContext,
  question: string,
  provision: string
): string | undefined {
  const isExam = /clat|upsc|judiciary|exam|mock|prelims|mains/i.test(question);
  const part = context.category.toLowerCase();

  if (isExam || context.kind === "article") {
    if (part.includes("fundamental rights") || /21|19|14|32/.test(context.label)) {
      return "High-yield for CLAT Constitutional Law and UPSC Prelims — expect MCQs on scope, restrictions, and leading cases.";
    }
    if (part.includes("directive") || /39|44|51a/.test(context.label)) {
      return "UPSC often contrasts Fundamental Rights with Directive Principles. CLAT may test enforceability differences.";
    }
    if (/368|amendment/i.test(context.label + question)) {
      return "Judiciary and UPSC Mains favourite — know basic structure doctrine and amendment procedure.";
    }
    if (/100|quorum|parliament/i.test(context.label + question + provision)) {
      return "CLAT Constitutional Law occasionally tests quorum rules and parliamentary procedure under Part V.";
    }
    if (isExam) {
      return "Revise the exact constitutional wording and one practical example for exam answers.";
    }
  }
  return undefined;
}

function buildDirectAnswer(
  context: ArticleQAContext,
  question: string,
  provision: string,
  learning?: ReturnType<typeof getArticleLearning>
): string {
  const q = question.toLowerCase();

  if (/quorum/i.test(q) && /one-tenth|1\/10|tenth/i.test(provision)) {
    return `Under ${context.label}, the quorum to constitute a meeting of either House of Parliament is one-tenth (1/10) of the total membership of that House, unless Parliament provides otherwise by law.`;
  }

  if (/quorum/i.test(q)) {
    return `Quorum requirements for ${context.label} are set out in the constitutional text below. For Parliament, see clause (3) on minimum attendance.`;
  }

  if (/without quorum|no quorum/i.test(q)) {
    return `If there is no quorum during a House meeting, the Chairman or Speaker must adjourn the House or suspend the sitting until quorum is met — as stated in ${context.label}.`;
  }

  if (/power|powers|right|rights|remedy|remedies|writ/i.test(q) && learning) {
    return learning.keyPoints[0] ?? learning.explanation.split("\n")[0];
  }

  if (learning?.keyPoints[0]) {
    return learning.keyPoints[0];
  }

  const firstSentence = provision.split(/[.!?]/)[0]?.trim();
  if (firstSentence && firstSentence.length > 20) {
    return `Under ${context.label}, ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}.`;
  }

  return `${context.label} ("${context.title}") addresses your question in the provision below.`;
}

export function generateArticleQAResponse(
  context: ArticleQAContext,
  rawQuestion: string
): ArticleQAResponse {
  const question = contextualizeQuestion(context, rawQuestion);

  const compare = buildCompareResponse(context, question);
  if (compare) return compare;

  const cases = buildCasesResponse(context, question);
  if (cases) return cases;

  const provision = extractRelevantProvision(context.content, question);
  const learning =
    context.kind === "article" ? getArticleLearning(context.id) : undefined;

  const explanation =
    learning?.explanation ??
    `This provision under ${context.label} forms part of ${context.category}. ${context.title} — read the cited text for the exact constitutional language.`;

  let relatedArticles =
    context.kind === "article"
      ? getRelatedArticles(context.id).map((a) => ({
          id: a.id,
          number: a.number,
          title: a.title,
        }))
      : [];

  if (relatedArticles.length === 0 && context.kind === "article") {
    const keywords = context.keywords ?? [];
    relatedArticles = constitutionArticles
      .filter(
        (a) =>
          a.id !== context.id &&
          a.keywords.some((k) => keywords.includes(k))
      )
      .slice(0, 4)
      .map((a) => ({ id: a.id, number: a.number, title: a.title }));
  }

  const referenced = findArticleByQuery(question);
  if (referenced && !relatedArticles.some((r) => r.id === referenced.id)) {
    relatedArticles = [
      { id: referenced.id, number: referenced.number, title: referenced.title },
      ...relatedArticles,
    ].slice(0, 5);
  }

  return {
    directAnswer: buildDirectAnswer(context, question, provision, learning),
    provision,
    explanation: learning?.whyItMatters
      ? `${explanation}\n\nWhy it matters: ${learning.whyItMatters}`
      : explanation,
    examTip: buildExamResponse(context, question, provision),
    relatedArticles,
  };
}
