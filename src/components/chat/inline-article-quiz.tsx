"use client";

import { useState } from "react";
import { CheckCircle2, GraduationCap, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InlineArticleQuizProps {
  questions: QuizQuestion[];
  articleNumber: string;
}

export function InlineArticleQuiz({ questions, articleNumber }: InlineArticleQuizProps) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = questions[index];

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
  };

  const handleSelect = (optionIndex: number) => {
    if (revealed || done) return;
    setSelected(optionIndex);
    setRevealed(true);
    if (optionIndex === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setDone(true);
    }
  };

  if (!active) {
    return (
      <Button variant="secondary" size="sm" className="w-full sm:w-auto" onClick={() => setActive(true)}>
        <GraduationCap className="size-4" />
        Quiz Me on {articleNumber}
      </Button>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium">Quiz complete — {score}/{questions.length} ({pct}%)</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={reset}>
              Try again
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setActive(false); reset(); }}>
              Close quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Quick quiz — Question {index + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm leading-relaxed">{question.question}</p>
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
                "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                !revealed && "hover:bg-muted/50",
                revealed && isCorrect && "border-emerald-500/50 bg-emerald-500/10",
                revealed && isSelected && !isCorrect && "border-red-500/50 bg-red-500/10"
              )}
            >
              <span className="flex-1">{option}</span>
              {revealed && isCorrect && <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />}
              {revealed && isSelected && !isCorrect && (
                <XCircle className="size-4 shrink-0 text-red-500" />
              )}
            </button>
          );
        })}
        {revealed && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Explanation: </span>
            {question.explanation}
          </div>
        )}
        {revealed && (
          <Button size="sm" className="mt-2" onClick={handleNext}>
            {index < questions.length - 1 ? "Next" : "Finish quiz"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
