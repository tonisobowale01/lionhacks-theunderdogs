import { QUESTIONS } from "../onboarding/onboarding";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  TextInput,
  Textarea,
  Text,
  Title,
  Stack,
  Group,
  Box,
  UnstyledButton,
  Loader,
} from "@mantine/core";
import { IconCheck, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useApp } from "../context/AppContext";
import { submitSurvey } from "../services/api";
import { notifications } from "@mantine/notifications";

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUserData, setPlan } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const q = QUESTIONS[step];
  const value = answers[q.key] || "";
  const canAdvance = value.length > 0;
  const isLast = step === QUESTIONS.length - 1;

  const setVal = (v) => setAnswers((a) => ({ ...a, [q.key]: v }));

  const next = async () => {
    if (!canAdvance || loading) return;
    if (isLast) {
      setLoading(true);
      try {
        const { data } = await submitSurvey(answers);
        setUserData(answers);
        if (data.plan) setPlan(data.plan);
        navigate("/upload");
      } catch (err) {
        notifications.show({
          title: "Onboarding Error",
          message: err.response?.data?.message || err.message,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Container size="sm" pt={48} pb={96}>
      {/* Progress Bar */}
      <Group gap={6} mb={48}>
        {QUESTIONS.map((_, i) => (
          <Box
            key={i}
            flex={1}
            h={4}
            style={(theme) => ({
              borderRadius: theme.radius.xl,
              backgroundColor:
                i <= step
                  ? "var(--mantine-color-blue-filled)"
                  : "var(--mantine-color-gray-2)",
              transition: "background-color 0.3s ease",
            })}
          />
        ))}
      </Group>

      <Text size="xs" tt="uppercase" lts="0.2em" c="dimmed" mb="xs">
        Question {step + 1} of {QUESTIONS.length}
      </Text>

      <Box key={step}>
        <Title order={1} fw={600} style={{ lineHeight: 1.1 }}>
          {q.label}
        </Title>
        <Text mt="md" c="dimmed" size="lg">
          {q.helper}
        </Text>

        <Box mt={40}>
          {q.type === "input" && (
            <TextInput
              autoFocus
              size="lg"
              value={value}
              placeholder={q.placeholder}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              styles={{ input: { height: 56, fontSize: "1.125rem" } }}
            />
          )}
          {q.type === "textarea" && (
            <Textarea
              autoFocus
              size="lg"
              value={value}
              placeholder={q.placeholder}
              onChange={(e) => setVal(e.target.value)}
              rows={4}
              styles={{ input: { fontSize: "1.125rem" } }}
            />
          )}
          {q.type === "choice" && (
            <Stack gap="sm">
              {q.options.map((opt) => {
                const selected = value === opt;
                return (
                  <UnstyledButton
                    key={opt}
                    onClick={() => setVal(opt)}
                    p="md"
                    radius="md"
                    style={(theme) => ({
                      border: `1px solid ${
                        selected
                          ? "var(--mantine-color-blue-filled)"
                          : "var(--mantine-color-gray-3)"
                      }`,
                      backgroundColor: selected
                        ? "var(--mantine-color-blue-light)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: selected
                          ? "var(--mantine-color-blue-filled)"
                          : "var(--mantine-color-gray-5)",
                      },
                    })}
                  >
                    <Text fw={selected ? 500 : 400}>{opt}</Text>
                    <Box
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: "50%",
                        border: `2px solid ${
                          selected
                            ? "var(--mantine-color-blue-filled)"
                            : "var(--mantine-color-gray-3)"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: selected
                          ? "var(--mantine-color-blue-filled)"
                          : "transparent",
                        color: "white",
                      }}
                    >
                      {selected && <IconCheck size={12} />}
                    </Box>
                  </UnstyledButton>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      <Group justify="space-between" mt={48}>
        <Button
          variant="subtle"
          onClick={back}
          disabled={step === 0}
          leftSection={<IconArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          onClick={next}
          disabled={!canAdvance || loading}
          size="lg"
          rightSection={
            loading ? <Loader size={16} /> : <IconArrowRight size={16} />
          }
        >
          {isLast ? "Continue to syllabus" : "Next"}
        </Button>
      </Group>
    </Container>
  );
};

export default Onboarding;
