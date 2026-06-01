export type ArticlePart = string;

export interface ConstitutionArticle {
  id: string;
  number: string;
  title: string;
  part: ArticlePart;
  summary: string;
  content: string;
  keywords: string[];
}

export interface QuizQuestion {
  id: string;
  articleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizPack {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  total: number;
  completedAt: string;
}

export interface SavedCase {
  id: string;
  articleId: string;
  articleNumber: string;
  name: string;
  year: string;
  summary: string;
}

export interface UserProgress {
  articlesRead: string[];
  bookmarks: string[];
  bookmarkedCases: SavedCase[];
  quizAttempts: QuizAttempt[];
  chatMessagesCount: number;
  lastVisited: string;
}

export interface LandmarkCase {
  name: string;
  year: string;
  summary: string;
}

export interface ArticleLearning {
  explanation: string;
  keyPoints: string[];
  whyItMatters: string;
  landmarkCases: LandmarkCase[];
  relatedArticleIds: string[];
  quizQuestions: QuizQuestion[];
}

export type ChatPayload =
  | { type: "text"; text: string }
  | {
      type: "article";
      article: ConstitutionArticle;
      learning: ArticleLearning;
      relatedArticles: Pick<ConstitutionArticle, "id" | "number" | "title" | "part">[];
    }
  | {
      type: "articles-list";
      intro: string;
      items: Array<{
        article: ConstitutionArticle;
        learning: ArticleLearning;
      }>;
    };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  payload?: ChatPayload;
  relatedArticleIds?: string[];
}
