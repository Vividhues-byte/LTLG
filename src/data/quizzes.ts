import type { QuizPack } from "@/types";

export const quizPacks: QuizPack[] = [
  {
    id: "fundamentals-101",
    title: "Constitution Fundamentals",
    description: "Core ideas from the Preamble and basic structure of the Union.",
    difficulty: "Beginner",
    questions: [
      {
        id: "q1",
        articleId: "preamble",
        question: "Which of the following ideals is NOT explicitly mentioned in the Preamble?",
        options: ["Justice", "Liberty", "Fraternity", "Federalism"],
        correctIndex: 3,
        explanation:
          "The Preamble mentions Justice, Liberty, Equality, and Fraternity. 'Federalism' is a constitutional feature but not a Preamble ideal.",
      },
      {
        id: "q2",
        articleId: "art-1",
        question: "According to Article 1, India is described as:",
        options: [
          "A federation of States",
          "A Union of States",
          "A confederation of provinces",
          "A unitary republic",
        ],
        correctIndex: 1,
        explanation: "Article 1 declares that India, that is Bharat, shall be a Union of States.",
      },
      {
        id: "q3",
        articleId: "art-79",
        question: "Parliament of India consists of:",
        options: [
          "Lok Sabha and Rajya Sabha only",
          "President, Lok Sabha, and Rajya Sabha",
          "President and Lok Sabha only",
          "Prime Minister and both Houses",
        ],
        correctIndex: 1,
        explanation: "Article 79 provides that Parliament consists of the President and two Houses.",
      },
    ],
  },
  {
    id: "fundamental-rights",
    title: "Fundamental Rights Challenge",
    description: "Test your knowledge of Part III — the heart of civil liberties in India.",
    difficulty: "Intermediate",
    questions: [
      {
        id: "q4",
        articleId: "art-14",
        question: "Article 14 guarantees:",
        options: [
          "Equality of outcome",
          "Equality before law and equal protection of laws",
          "Equal wealth distribution",
          "Uniform civil code",
        ],
        correctIndex: 1,
        explanation:
          "Article 14 ensures equality before the law and equal protection of the laws within India.",
      },
      {
        id: "q5",
        articleId: "art-19",
        question: "Which freedom is NOT listed under Article 19(1)?",
        options: [
          "Freedom of speech and expression",
          "Freedom to form associations",
          "Freedom of religion",
          "Freedom to move freely throughout India",
        ],
        correctIndex: 2,
        explanation:
          "Freedom of religion is covered under Articles 25–28, not Article 19.",
      },
      {
        id: "q6",
        articleId: "art-21",
        question: "Article 21 protects:",
        options: [
          "Right to property only",
          "Life and personal liberty",
          "Freedom of press only",
          "Right to vote",
        ],
        correctIndex: 1,
        explanation:
          "Article 21 states that no person shall be deprived of life or personal liberty except according to procedure established by law.",
      },
      {
        id: "q7",
        articleId: "art-32",
        question: "Dr. B.R. Ambedkar called which Article the 'heart and soul' of the Constitution?",
        options: ["Article 14", "Article 19", "Article 21", "Article 32"],
        correctIndex: 3,
        explanation:
          "Article 32 provides the right to constitutional remedies through the Supreme Court for enforcement of Fundamental Rights.",
      },
    ],
  },
  {
    id: "governance-mastery",
    title: "Governance & Structure",
    description: "Union executive, judiciary, and state legislature — advanced level.",
    difficulty: "Advanced",
    questions: [
      {
        id: "q8",
        articleId: "art-53",
        question: "Executive power of the Union is vested in:",
        options: ["Prime Minister", "Parliament", "President", "Cabinet"],
        correctIndex: 2,
        explanation: "Article 53 vests the executive power of the Union in the President.",
      },
      {
        id: "q9",
        articleId: "art-124",
        question: "Judges of the Supreme Court are appointed by:",
        options: ["Chief Justice alone", "Parliament", "President", "Collegium directly without Presidential role"],
        correctIndex: 2,
        explanation: "Article 124 provides that every Judge of the Supreme Court shall be appointed by the President.",
      },
      {
        id: "q10",
        articleId: "art-51a",
        question: "Fundamental Duties were added to the Constitution by which Amendment?",
        options: ["42nd Amendment", "44th Amendment", "73rd Amendment", "86th Amendment"],
        correctIndex: 0,
        explanation: "Fundamental Duties under Article 51A were added by the 42nd Constitutional Amendment Act, 1976.",
      },
      {
        id: "q11",
        articleId: "art-39",
        question: "Directive Principles under Article 39 include the principle of:",
        options: [
          "Equal pay for equal work",
          "Right to constitutional remedies",
          "Freedom of speech",
          "Habeas corpus",
        ],
        correctIndex: 0,
        explanation: "Article 39(d) directs the State to secure equal pay for equal work for both men and women.",
      },
    ],
  },
];

export function getQuizById(id: string): QuizPack | undefined {
  return quizPacks.find((q) => q.id === id);
}
