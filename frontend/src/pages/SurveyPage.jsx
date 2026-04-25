import { QUESTIONS } from "../onboarding/onboarding";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, Button, Input, Textarea } from "@mantine/core";
import { IconCheck, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

const Onboarding = () => {
  const navigate = useNavigate();
  // const { setUserData } = useApp(); // Note: useApp is not defined in provided context
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[step];
  const value = answers[q.key] || "";
  const canAdvance = value.length > 0;
  const isLast = step === QUESTIONS.length - 1;

  const setVal = (v) => setAnswers((a) => ({ ...a, [q.key]: v }));

  const next = () => {
    if (!canAdvance) return;
    if (isLast) {
      navigate("/upload");
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <AppShell>
      <section className="container max-w-2xl pt-12 pb-24">
        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-12">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Question {step + 1} of {QUESTIONS.length}
        </div>

        <div key={step} className="animate-fade-up">
          <h1 className="font-serif-display text-4xl md:text-5xl font-semibold text-ink leading-tight">
            {q.label}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">{q.helper}</p>

          <div className="mt-10">
            {q.type === "input" && (
              <Input
                autoFocus
                value={value}
                placeholder={q.placeholder}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                className="h-14 text-lg bg-card border-border"
              />
            )}
            {q.type === "textarea" && (
              <Textarea
                autoFocus
                value={value}
                placeholder={q.placeholder}
                onChange={(e) => setVal(e.target.value)}
                rows={4}
                className="text-lg bg-card border-border resize-none"
              />
            )}
            {q.type === "choice" && (
              <div className="grid gap-2.5">
                {q.options.map((opt) => {
                  const selected = value === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setVal(opt)}
                      className={`group flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                        selected
                          ? "border-accent bg-accent/5 shadow-paper"
                          : "border-border bg-card hover:border-foreground/20"
                      }`}
                    >
                      <span
                        className={`text-base ${selected ? "text-foreground font-medium" : "text-foreground/80"}`}
                      >
                        {opt}
                      </span>
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition ${
                          selected ? "border-accent bg-accent" : "border-border"
                        }`}
                      >
                        {selected && <IconCheck size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className="gap-2"
          >
            <IconArrowLeft size={16} /> Back
          </Button>
          <Button
            onClick={next}
            disabled={!canAdvance}
            size="lg"
            className="gap-2 h-12 px-6"
          >
            {isLast ? "Continue to syllabus" : "Next"}{" "}
            <IconArrowRight size={16} />
          </Button>
        </div>
      </section>
    </AppShell>
  );
};

export default Onboarding;
