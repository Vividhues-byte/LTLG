"use client";

import { useState } from "react";
import { Brain, ChevronRight } from "lucide-react";
import { quizPacks } from "@/data/quizzes";
import { useProgressContext } from "@/contexts/progress-context";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizPage() {
  const { progress } = useProgressContext();
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const activeQuiz = activeQuizId ? quizPacks.find((q) => q.id === activeQuizId) : null;

  if (activeQuiz) {
    return <QuizPlayer quiz={activeQuiz} onExit={() => setActiveQuizId(null)} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 lg:p-8">
      <div>
        <div className="flex items-center gap-2">
          <Brain className="size-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Quiz Center</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Test your knowledge with scored quizzes. Results are saved in localStorage.
        </p>
      </div>

      <div className="space-y-4">
        {quizPacks.map((pack) => {
          const best = progress.quizAttempts
            .filter((a) => a.quizId === pack.id)
            .sort((a, b) => b.score / b.total - a.score / a.total)[0];

          return (
            <Card
              key={pack.id}
              className="cursor-pointer border-border/60 transition-colors hover:border-border hover:bg-card/80"
              onClick={() => setActiveQuizId(pack.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{pack.title}</CardTitle>
                    <CardDescription className="mt-1">{pack.description}</CardDescription>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{pack.difficulty}</Badge>
                <Badge variant="outline">{pack.questions.length} questions</Badge>
                {best && (
                  <Badge>
                    Best: {best.score}/{best.total} (
                    {Math.round((best.score / best.total) * 100)}%)
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
