import {
  constitutionArticles,
  getArticleById,
  getArticlesByPart,
} from "@/data/constitution-loader";
import type { ArticleLearning, ConstitutionArticle, QuizQuestion } from "@/types";

function q(
  articleId: string,
  n: number,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string
): QuizQuestion {
  return {
    id: `${articleId}-chat-q${n}`,
    articleId,
    question,
    options,
    correctIndex,
    explanation,
  };
}

const learningById: Record<string, ArticleLearning> = {
  preamble: {
    explanation:
      "The Preamble is the introduction to the Constitution. It states who made the Constitution (We, the People of India), what kind of nation India is (sovereign, socialist, secular, democratic republic), and the goals the State must pursue: justice, liberty, equality, and fraternity. While not enforceable by itself in court, the Supreme Court has held it guides interpretation of the Constitution.",
    keyPoints: [
      "Adopted on 26 November 1949; it reflects the philosophy of the Constitution.",
      "Declares India a sovereign, socialist, secular, democratic republic.",
      "Lists four cardinal objectives: Justice, Liberty, Equality, and Fraternity.",
      "The 42nd Amendment (1976) added 'socialist' and 'secular' to the Preamble.",
      "Kesavananda Bharati (1973) held the Preamble is part of the Constitution.",
    ],
    whyItMatters:
      "The Preamble is often the first text students and citizens read. It expresses national values and helps courts interpret ambiguous constitutional provisions in line with constitutional philosophy.",
    landmarkCases: [
      {
        name: "Kesavananda Bharati v. State of Kerala",
        year: "1973",
        summary:
          "Held that the Preamble is part of the Constitution and that Parliament cannot amend the basic structure, which draws from Preamble values.",
      },
      {
        name: "S.R. Bommai v. Union of India",
        year: "1994",
        summary:
          "Relied on secularism as part of the basic structure reflected in the Preamble while examining President's Rule.",
      },
    ],
    relatedArticleIds: ["art-14", "art-19", "art-21", "art-39"],
    quizQuestions: [
      q("preamble", 1, "The Preamble declares India to be which of the following?", ["A monarchy", "A sovereign democratic republic", "A confederation", "A theocratic state"], 1, "The Preamble describes India as a sovereign socialist secular democratic republic."),
      q("preamble", 2, "Which pair was inserted into the Preamble by the 42nd Amendment?", ["Federal and Republican", "Socialist and Secular", "Liberty and Justice", "Equality and Fraternity"], 1, "The words 'socialist' and 'secular' were added in 1976."),
      q("preamble", 3, "Which objective is NOT listed in the Preamble?", ["Justice", "Liberty", "Fraternity", "Federalism"], 3, "Federalism is a constitutional feature but not a Preamble ideal."),
    ],
  },
  "art-1": {
    explanation:
      "Article 1 defines the name and territorial structure of the country. India is described as 'Bharat' and as a 'Union of States' — not merely a federation of independent states. This means states do not have the right to secede, and the Union can reorganise states. Territory includes states, union territories, and any acquired land.",
    keyPoints: [
      "India is officially 'India, that is Bharat'.",
      "India is a Union of States, emphasising unity and indestructibility of the Union.",
      "Territory includes States, Union territories, and acquired territories.",
      "State boundaries may change by constitutional amendment (e.g., new states).",
    ],
    whyItMatters:
      "Article 1 answers foundational questions about national identity and territorial integrity. It underpins debates on federalism, statehood demands, and integration of territories.",
    landmarkCases: [
      {
        name: "State of West Bengal v. Union of India",
        year: "1963",
        summary: "Examined federal features while affirming the Union's supremacy under the constitutional scheme.",
      },
      {
        name: "Berubari Union (Re, Article 143)",
        year: "1960",
        summary: "Advisory opinion on cession of territory — Parliament's power to alter boundaries requires constitutional amendment.",
      },
    ],
    relatedArticleIds: ["art-153", "art-168", "preamble"],
    quizQuestions: [
      q("art-1", 1, "Article 1 describes India as:", ["A federation of States", "A Union of States", "A confederation", "A unitary State only"], 1, "The Constitution uses 'Union of States' to stress unity."),
      q("art-1", 2, "Territory of India under Article 1 includes:", ["Only States", "States, UTs, and acquired territory", "Only mainland states", "Foreign territories"], 1, "Clause (3) lists states, UTs, and acquired territories."),
      q("art-1", 3, "The alternative name for India in Article 1 is:", ["Hindustan", "Bharat", "Aryavarta", "India only with no alternative"], 1, "Article 1 says 'India, that is Bharat'."),
    ],
  },
  "art-14": {
    explanation:
      "Article 14 guarantees that the State will treat every person equally before the law and provide equal protection of laws. 'Equality before law' is a British concept (no special privileges). 'Equal protection of laws' allows reasonable classification — the State may treat different groups differently if the classification is reasonable and not arbitrary.",
    keyPoints: [
      "Applies to any 'person' — citizens and non-citizens.",
      "Covers both equality before law and equal protection of laws.",
      "Reasonable classification is permitted if based on intelligible differentia with rational nexus to object.",
      "Arbitrary state action violates Article 14.",
      "Foundation for rule of law and non-discrimination.",
    ],
    whyItMatters:
      "Article 14 is the bedrock of constitutional equality. It is invoked in challenges to discriminatory laws, arbitrary executive action, and unfair administrative procedure affecting millions daily.",
    landmarkCases: [
      {
        name: "E.P. Royappa v. State of Tamil Nadu",
        year: "1974",
        summary: "Held that equality is antithetical to arbitrariness; arbitrary action violates Article 14.",
      },
      {
        name: "Maneka Gandhi v. Union of India",
        year: "1978",
        summary: "Expanded Article 14 to require fair, just, and reasonable procedure — linked with Articles 19 and 21.",
      },
      {
        name: "Ajaypal Singh v. State of Punjab",
        year: "2024",
        summary: "Recent reaffirmation of non-arbitrariness standard in service law and classification tests.",
      },
    ],
    relatedArticleIds: ["art-15", "art-16", "art-21"],
    quizQuestions: [
      q("art-14", 1, "Article 14 guarantees:", ["Equality of outcome", "Equality before law and equal protection of laws", "Uniform income", "Same treatment in all private disputes"], 1, "These are the two limbs of Article 14."),
      q("art-14", 2, "Reasonable classification under Article 14 requires:", ["Random grouping", "Intelligible differentia and rational nexus", "No differences ever", "Majority approval only"], 1, "Classic two-part test from case law."),
      q("art-14", 3, "Article 14 applies to:", ["Citizens only", "Any person within India", "Government employees only", "Voters only"], 1, "The text says 'any person'."),
    ],
  },
  "art-19": {
    explanation:
      "Article 19(1) lists six freedoms for citizens: speech, assembly, association, movement, residence, and profession. These are not absolute — Article 19(2)–(6) allow reasonable restrictions on grounds such as sovereignty, public order, decency, contempt of court, and defamation. The State must balance liberty with collective interests.",
    keyPoints: [
      "Rights apply to citizens only (not all persons).",
      "Six freedoms under clause (1) including speech and movement.",
      "Reasonable restrictions permitted on specified grounds.",
      "Internet freedom linked to Art. 19 in Anuradha Bhasin (2020).",
      "Closely connected to democracy and dissent.",
    ],
    whyItMatters:
      "Article 19 protects democracy itself — press freedom, protests, unions, and mobility. Most free speech and protest litigation in India engages Article 19.",
    landmarkCases: [
      {
        name: "Romesh Thappar v. State of Madras",
        year: "1950",
        summary: "Early case on freedom of press as part of freedom of speech under Article 19(1)(a).",
      },
      {
        name: "Shreya Singhal v. Union of India",
        year: "2015",
        summary: "Struck down Section 66A of IT Act; clarified vagueness and overbreadth in speech restrictions.",
      },
      {
        name: "Anuradha Bhasin v. Union of India",
        year: "2020",
        summary: "Held internet access is protected; restrictions must be necessary, proportionate, and temporary.",
      },
    ],
    relatedArticleIds: ["art-14", "art-21", "art-32"],
    quizQuestions: [
      q("art-19", 1, "Which freedom is guaranteed under Article 19(1)(a)?", ["Right to property", "Freedom of speech and expression", "Right to education", "Right to religion"], 1, "Sub-clause (a) protects speech and expression."),
      q("art-19", 2, "Restrictions on speech under Article 19(2) must be:", ["Absolute", "Reasonable and on specified grounds", "Banned entirely", "Decided by police only"], 1, "Only reasonable restrictions on listed grounds are allowed."),
      q("art-19", 3, "Article 19 freedoms apply to:", ["All persons", "Citizens only", "Foreigners only", "Judges only"], 1, "Article 19 uses 'citizens'."),
    ],
  },
  "art-21": {
    explanation:
      "Article 21 protects life and personal liberty. Originally read narrowly as 'procedure established by law', the Supreme Court in Maneka Gandhi expanded it to require fair, just, and reasonable procedure. Today it includes dignity, privacy, health, livelihood, speedy trial, and a clean environment — making it one of the most dynamic articles.",
    keyPoints: [
      "No deprivation of life or personal liberty except by procedure established by law.",
      "Expanded to substantive due process after Maneka Gandhi (1978).",
      "Includes right to live with human dignity.",
      "Privacy recognised as intrinsic to life (Puttaswamy, 2017).",
      "Drives PILs on health, environment, and prisoners' rights.",
    ],
    whyItMatters:
      "Article 21 affects everyday life: hospital care, pollution, police custody, trial delays, and data privacy. It is among the most litigated fundamental rights.",
    landmarkCases: [
      {
        name: "Maneka Gandhi v. Union of India",
        year: "1978",
        summary: "Procedure must be fair, just, and reasonable; Articles 14, 19, and 21 are connected.",
      },
      {
        name: "K.S. Puttaswamy v. Union of India",
        year: "2017",
        summary: "Nine-judge bench held privacy is a fundamental right under Article 21.",
      },
      {
        name: "Paschim Banga Khet Mazdoor Samity v. State of W.B.",
        year: "1996",
        summary: "Right to emergency medical care is part of right to life.",
      },
    ],
    relatedArticleIds: ["art-14", "art-19", "art-32", "art-21a"],
    quizQuestions: [
      q("art-21", 1, "Article 21 protects:", ["Property only", "Life and personal liberty", "Freedom of religion", "Right to vote"], 1, "The text explicitly mentions life and personal liberty."),
      q("art-21", 2, "Privacy was recognised under Article 21 in:", ["Golaknath case", "Puttaswamy case", "Berubari case", "Kesavananda case only"], 1, "Puttaswamy (2017) affirmed privacy as a fundamental right."),
      q("art-21", 3, "Deprivation of liberty under Article 21 requires:", ["Police permission only", "Procedure established by law", "No procedure", "Executive whim"], 1, "Only procedure established by valid law can justify deprivation."),
    ],
  },
  "art-32": {
    explanation:
      "Article 32 guarantees the right to approach the Supreme Court directly for enforcement of Fundamental Rights. The Court can issue writs — habeas corpus, mandamus, prohibition, quo warranto, and certiorari. Dr. Ambedkar called it the heart and soul of the Constitution because rights without remedy are meaningless.",
    keyPoints: [
      "Right to move Supreme Court for enforcement of Part III rights.",
      "Court may issue five types of writs.",
      "Article 32 itself is a fundamental right (L. Chandra Kumar).",
      "High Courts have similar power under Article 226.",
      "PILs often filed under Articles 32 and 226.",
    ],
    whyItMatters:
      "Article 32 is the citizen's direct door to the Supreme Court when the State violates fundamental rights — from illegal detention to systemic discrimination.",
    landmarkCases: [
      {
        name: "Romesh Thappar / early writ cases",
        year: "1950",
        summary: "Established Supreme Court's role as guardian of fundamental rights from the republic's early years.",
      },
      {
        name: "L. Chandra Kumar v. Union of India",
        year: "1997",
        summary: "Held judicial review under Articles 32/226 is part of the basic structure; tribunals cannot oust it entirely.",
      },
      {
        name: "Bandhua Mukti Morcha v. Union of India",
        year: "1984",
        summary: "Expanded locus standi for PILs on bonded labour using Article 32.",
      },
    ],
    relatedArticleIds: ["art-14", "art-19", "art-21", "art-124"],
    quizQuestions: [
      q("art-32", 1, "Article 32 allows citizens to approach:", ["District Court", "Supreme Court for fundamental rights", "Gram Panchayat", "Parliament"], 1, "Direct access to the Supreme Court is guaranteed."),
      q("art-32", 2, "Which writ is NOT listed in Article 32?", ["Habeas corpus", "Mandamus", "Injunction as primary writ", "Certiorari"], 2, "The five writs are habeas corpus, mandamus, prohibition, quo warranto, certiorari."),
      q("art-32", 3, "Dr. Ambedkar described Article 32 as:", ["Optional guideline", "Heart and soul of the Constitution", "Directive principle", "State policy only"], 1, "Famous quote from Constituent Assembly debates."),
    ],
  },
};

function defaultLearning(article: ConstitutionArticle): ArticleLearning {
  const related = getArticlesByPart(article.part)
    .filter((a) => a.id !== article.id)
      .map((a) => a.id);

    const keywordRelated = article.keywords
      .flatMap((kw) => {
        const match = constitutionArticles.find(
          (a) =>
            a.id !== article.id &&
            a.keywords.some((k) => k.includes(kw.split(" ")[0]) || kw.includes(k.split(" ")[0]))
        );
        return match ? [match.id] : [];
      });

    const relatedIds = [...new Set([...related, ...keywordRelated])];

    return {
      explanation: `### 1. Plain English Explanation\n${article.summary}\n\n### 2. Practical Example\nSuppose a situation involves ${article.keywords[0] || 'your rights'} or a similar context. This article provides the overarching constitutional framework to address such matters fairly and strictly according to law.\n\n### 3. Why It Matters\nThis is essential for citizens and the state because it guarantees that proper procedures, rights, and constitutional protections are followed regarding ${article.title.toLowerCase()}.\n\n### 4. Exam Relevance\n**Highly relevant** for CLAT, UPSC, and Judiciary exams. Students should focus on understanding the core concepts around ${article.keywords.slice(0, 3).join(", ")}.\n\n### 5. Common Questions\n- What is the fundamental scope of ${article.number}?\n- How is this provision applied by courts in modern scenarios?`,
    keyPoints: [
      article.summary,
      `Part of the Constitution: ${article.part}`,
      `Key themes: ${article.keywords.join(", ")}`,
      "Study the full text to understand exact constitutional language.",
      "Compare with related articles listed below for broader context.",
    ],
    whyItMatters: `${article.number} shapes how citizens, courts, and governments understand constitutional obligations in ${article.part}. Understanding the complete text helps you connect constitutional ideals to real governance and rights.`,
    landmarkCases: [
      {
        name: "Constitutional interpretation",
        year: "—",
        summary: `Courts interpret ${article.number} alongside other provisions in ${article.part} when deciding cases involving ${article.keywords[0] ?? "constitutional rights"}.`,
      },
    ],
    relatedArticleIds: relatedIds,
    quizQuestions: [
      q(
        article.id,
        1,
        `What is the main subject of ${article.number}?`,
        [article.title, "Unrelated tax law", "Election schedule only", "International treaty"],
        0,
        `${article.number} is titled "${article.title}".`
      ),
      q(
        article.id,
        2,
        `${article.number} belongs to which part of the Constitution?`,
        [article.part, "Part IX only", "Schedules only", "Not part of Constitution"],
        0,
        `It is listed under ${article.part}.`
      ),
      q(
        article.id,
        3,
        `Which theme is associated with ${article.number}?`,
        [article.keywords[0] ?? article.title, "Moon landing", "Currency design only", "Sports policy only"],
        0,
        `Keywords include: ${article.keywords.join(", ")}.`
      ),
    ],
  };
}

// Rich overrides for remaining key articles
const extraLearning: Record<string, Partial<ArticleLearning>> = {
  "art-12": {
    explanation:
      "Article 12 defines 'the State' for Part III (Fundamental Rights). The State includes Central and State governments, Parliament and legislatures, and local authorities. This broad definition ensures fundamental rights bind not only the Union executive but also municipalities, panchayats, and other bodies under government control.",
    landmarkCases: [
      { name: "Rajasthan State Electricity Board v. Mohan Lal", year: "1967", summary: "Clarified when statutory bodies act as 'State' under Article 12." },
      { name: "R.D. Shetty v. International Airport Authority", year: "1979", summary: "Developed tests for identifying 'other authorities' as State." },
    ],
    relatedArticleIds: ["art-14", "art-19", "art-21"],
  },
  "art-15": {
    explanation:
      "Article 15 prohibits discrimination by the State against citizens on grounds only of religion, race, caste, sex, or place of birth. It also allows special provisions for women, children, and socially/educationally backward classes (including SCs/STs). It works with Article 14 to secure substantive equality.",
    landmarkCases: [
      { name: "Indra Sawhney v. Union of India", year: "1992", summary: "Upheld OBC reservations with 50% ceiling and creamy layer concept under equality provisions." },
      { name: "Navtej Singh Johar v. Union of India", year: "2018", summary: "Decriminalised consensual same-sex relations; dignity and non-discrimination under constitutional equality." },
    ],
    relatedArticleIds: ["art-14", "art-19", "art-21"],
  },
  "art-21a": {
    explanation:
      "Article 21A makes free and compulsory education a constitutional right for children aged 6–14. Inserted by the 86th Amendment (2002) and implemented through the Right of Children to Free and Compulsory Education Act, 2009 (RTE Act).",
    landmarkCases: [
      { name: "Mohini Jain v. State of Karnataka", year: "1992", summary: "Held capitation fees violate right to education before 21A was added." },
      { name: "Society for Unaided Schools v. State of Rajasthan", year: "2012", summary: "Upheld RTE Act validity with reasonable restrictions on private schools." },
    ],
    relatedArticleIds: ["art-21", "art-39", "art-51a"],
  },
  "art-39": {
    explanation:
      "Article 39 lists Directive Principles directing the State to secure livelihood, distribute resources for common good, prevent wealth concentration, ensure equal pay, protect workers and children, and promote childhood free from exploitation.",
    landmarkCases: [
      { name: "Minerva Mills v. Union of India", year: "1980", summary: "Balanced Fundamental Rights and Directive Principles; neither can destroy the other." },
    ],
    relatedArticleIds: ["art-14", "art-21", "art-44", "preamble"],
  },
  "art-44": {
    explanation:
      "Article 44 is a Directive Principle asking the State to endeavour toward a uniform civil code (UCC) nationwide. It is not enforceable in court but informs legislative debate on personal laws governing marriage, divorce, and inheritance.",
    landmarkCases: [
      { name: "Mohd. Ahmed Khan v. Shah Bano Begum", year: "1985", summary: "Highlighted tension between personal laws and gender justice; sparked UCC debate." },
    ],
    relatedArticleIds: ["art-14", "art-15", "art-39"],
  },
  "art-51a": {
    explanation:
      "Article 51A lists Fundamental Duties of every citizen — added by the 42nd Amendment (1976). Duties include respecting the Constitution, promoting harmony, protecting the environment, developing scientific temper, and safeguarding public property.",
    landmarkCases: [
      { name: "M.C. Mehta v. Union of India", year: "1988", summary: "Invoked duty to protect environment alongside Article 21 in pollution cases." },
    ],
    relatedArticleIds: ["preamble", "art-21", "art-39"],
  },
  "art-53": {
    explanation:
      "Article 53 vests executive power of the Union in the President, exercisable directly or through subordinate officers. Real executive power is exercised by the Council of Ministers headed by the Prime Minister under Article 74.",
    landmarkCases: [
      { name: "Shamsher Singh v. State of Punjab", year: "1974", summary: "President acts on aid and advice of Council of Ministers in most matters." },
    ],
    relatedArticleIds: ["art-52", "art-79", "art-124"],
  },
  "art-79": {
    explanation:
      "Article 79 establishes Parliament comprising the President and two Houses — Rajya Sabha (Council of States) and Lok Sabha (House of the People). Laws require passage by both Houses (with exceptions) and Presidential assent.",
    landmarkCases: [
      { name: "Keshavananda Bharati v. State of Kerala", year: "1973", summary: "Parliament's amending power subject to basic structure — defines limits on legislative supremacy." },
    ],
    relatedArticleIds: ["art-52", "art-53", "art-124"],
  },
  "art-124": {
    explanation:
      "Article 124 establishes the Supreme Court of India with a Chief Justice and other judges appointed by the President after consultation. It is the apex court for constitutional interpretation and guardian of fundamental rights.",
    landmarkCases: [
      { name: "Supreme Court Advocates-on-Record Assn. v. Union of India", year: "2015", summary: "NJAC struck down; collegium system for judicial appointments upheld with reforms direction." },
    ],
    relatedArticleIds: ["art-32", "art-21", "art-14"],
  },
};

export function getArticleLearning(articleId: string): ArticleLearning | undefined {
  const article = getArticleById(articleId);
  if (!article) return undefined;

  const base = learningById[articleId] ?? defaultLearning(article);
  const extra = extraLearning[articleId];

  if (!extra) return base;

  return {
    ...base,
    ...extra,
    keyPoints: extra.keyPoints ?? base.keyPoints,
    landmarkCases: extra.landmarkCases ?? base.landmarkCases,
    relatedArticleIds: extra.relatedArticleIds ?? base.relatedArticleIds,
    quizQuestions: extra.quizQuestions ?? base.quizQuestions,
  };
}

export function getRelatedArticles(articleId: string) {
  const learning = getArticleLearning(articleId);
  if (!learning) return [];

  return learning.relatedArticleIds
    .map((id) => getArticleById(id))
    .filter((a): a is ConstitutionArticle => Boolean(a))
    .map((a) => ({ id: a.id, number: a.number, title: a.title, part: a.part }));
}
