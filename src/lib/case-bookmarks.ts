import type { LandmarkCase, SavedCase } from "@/types";

export function caseBookmarkId(articleId: string, caseName: string): string {
  return `${articleId}::${caseName}`;
}

export function toSavedCase(
  articleId: string,
  articleNumber: string,
  landmark: LandmarkCase
): SavedCase {
  return {
    id: caseBookmarkId(articleId, landmark.name),
    articleId,
    articleNumber,
    name: landmark.name,
    year: landmark.year,
    summary: landmark.summary,
  };
}
