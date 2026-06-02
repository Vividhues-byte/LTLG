import { getArticleLearning, getRelatedArticles } from "@/data/article-learning";
import {
  findArticleByQuery,
  getArticlesForPartKeyword,
  searchArticles,
} from "@/data/constitution-loader";
import type { ChatPayload, ConstitutionArticle } from "@/types";

const GREETING_PATTERNS = /^(hi|hello|hey|namaste|good\s+(morning|afternoon|evening))/i;

function buildArticlePayload(article: ConstitutionArticle): ChatPayload {
  const learning = getArticleLearning(article.id);
  if (!learning) {
    return {
      type: "text",
      text: `Found ${article.number} but could not generate learning content.`,
    };
  }

  return {
    type: "article",
    article,
    learning,
    relatedArticles: getRelatedArticles(article.id),
  };
}

function buildArticlesList(
  intro: string,
  articles: ConstitutionArticle[]
): ChatEngineResponse {
  const items = articles.map((article) => ({
    article,
    learning: getArticleLearning(article.id)!,
  }));

  return {
    payload: { type: "articles-list", intro, items },
    relatedArticleIds: articles.map((a) => a.id),
  };
}

export interface ChatEngineResponse {
  payload: ChatPayload;
  relatedArticleIds: string[];
}

export function generateChatResponse(userMessage: string): ChatEngineResponse {
  const trimmed = userMessage.trim();

  if (!trimmed) {
    return {
      payload: {
        type: "text",
        text: `Ask about any constitutional article — e.g. Article 25, Article 300A, or Article 51A. You'll receive the complete text plus a short explanation, landmark cases, and a quick quiz.`,
      },
      relatedArticleIds: [],
    };
  }

  if (GREETING_PATTERNS.test(trimmed)) {
    return {
      payload: {
        type: "text",
        text: `Namaste! Welcome to LTLG Constitution Chat — your legal learning assistant covering all ${searchArticles("").length} constitutional articles.

Ask an article number (Article 2, 51A, 300A), a keyword, or a topic. Responses include the full text (hidden by default), a short explanation, landmark cases, related articles, and a short quiz.`,
      },
      relatedArticleIds: [],
    };
  }

  const directArticle = findArticleByQuery(trimmed);
  if (directArticle) {
    const payload = buildArticlePayload(directArticle);
    return {
      payload,
      relatedArticleIds:
        payload.type === "article"
          ? [directArticle.id, ...payload.learning.relatedArticleIds]
          : [directArticle.id],
    };
  }

  const lower = trimmed.toLowerCase();

  const partArticles = getArticlesForPartKeyword(lower);
  if (partArticles.length > 0 && (lower.includes("fundamental") || lower.includes("directive") || lower.includes("duties"))) {
    return buildArticlesList(
      `Articles under this constitutional topic (${partArticles.length} shown):`,
      partArticles
    );
  }

  const tokens = lower.split(/\W+/).filter((t) => t.length > 2);
  const ranked = searchArticles(trimmed)
    .map((article) => {
      let score = 0;
      const haystack = [
        article.number,
        article.title,
        article.summary,
        article.content,
        article.part,
        ...article.keywords,
      ]
        .join(" ")
        .toLowerCase();
      for (const token of tokens) {
        if (haystack.includes(token)) score += 2;
        if (article.keywords.some((k) => k.toLowerCase().includes(token))) score += 3;
      }
      return { article, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    const top = ranked[0].article;
    if (ranked.length === 1 || ranked[0].score > (ranked[1]?.score ?? 0) * 1.5) {
      const payload = buildArticlePayload(top);
      return {
        payload,
        relatedArticleIds:
          payload.type === "article"
            ? [top.id, ...payload.learning.relatedArticleIds]
            : [top.id],
      };
    }
    return buildArticlesList(
      `Found ${ranked.length} matching articles. Top results:`,
      ranked.map((r) => r.article)
    );
  }

  const fallback = searchArticles(trimmed);
  if (fallback.length > 0) {
    if (fallback.length === 1) {
      const payload = buildArticlePayload(fallback[0]);
      return {
        payload,
        relatedArticleIds: payload.type === "article" ? [fallback[0].id] : [],
      };
    }
    return buildArticlesList("These articles match your search:", fallback);
  }

  return {
    payload: {
      type: "text",
      text: `No exact match found. Try:\n• Article [number] — e.g. Article 25 or Article 300A\n• Keywords — equality, education, emergency\n• Topics — Fundamental Rights, Directive Principles\n\nThis database contains all constitutional articles with full text.`,
    },
    relatedArticleIds: [],
  };
}
