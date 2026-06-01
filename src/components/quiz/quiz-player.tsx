"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { QuizPack } from "@/types";
import { useProgressContext } from "@/contexts/progress-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
  quiz: QuizPack;
  onExit: () => void;
}

export function QuizPlayer({ quiz, onExit }: QuizPlayerProps) {
  const { recordQuizAttempt } = useProgressContext();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[index];
  const progressPct = finished
    ? 100
    : ((index + (revealed ? 1 : 0)) / quiz.questions.length) * 100;

  const handleSelect = (optionIndex: number) => {
    if (revealed || finished) return;
    setSelected(optionIndex);
    setRevealed(true);
    if (optionIndex === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const completeQuiz = (finalScore: number) => {
    recordQuizAttempt({
      quizId: quiz.id,
      score: finalScore,
      total: quiz.questions.length,
      completedAt: new Date().toISOString(),
    });
    setFinished(true);
  };

  const goNext = () => {
    if (index < quiz.questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      completeQuiz(score);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <Card className="mx-auto max-w-lg border-border/60">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <p className="text-muted-foreground">{quiz.title}</p>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="text-5xl font-bold tabular-nums text-primary">
            {score}/{quiz.questions.length}
          </div>
          <p className="text-sm text-muted-foreground">
            You scored {pct}% —{" "}
            {pct >= 80
              ? "Excellent work!"
              : pct >= 50
                ? "Good effort, keep practicing!"
                : "Review the articles and try again."}
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="size-4" />
              Retry
            </Button>
            <Button onClick={onExit}>Back to quizzes</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{quiz.difficulty}</Badge>
          <span className="text-xs text-muted-foreground">
            Question {index + 1} of {quiz.questions.length}
          </span>
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-snug">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = i === selected;
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => handleSelect(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  !revealed && "hover:bg-muted/50",
                  revealed && isCorrect && "border-emerald-500/50 bg-emerald-500/10",
                  revealed && isSelected && !isCorrect && "border-red-500/50 bg-red-500/10",
                  !revealed && isSelected && "border-primary bg-primary/5"
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {revealed && isCorrect && (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                )}
                {revealed && isSelected && !isCorrect && (
                  <XCircle className="size-4 text-red-500" />
                )}
              </button>
            );
          })}

          {revealed && (
            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium text-foreground">Explanation</p>
              <p className="mt-1 text-muted-foreground">{question.explanation}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={onExit}>
              Exit
            </Button>
            {revealed && (
              <Button onClick={goNext}>
                {index < quiz.questions.length - 1 ? "Next question" : "See results"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
