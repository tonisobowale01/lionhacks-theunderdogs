import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Text,
  Title,
  Stack,
  Group,
  Paper,
  Loader,
  Box,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconFileText,
  IconUpload,
  IconCheck,
  IconArrowRight,
  IconX,
  IconPlus,
} from "@tabler/icons-react";
import { useApp } from "../context/AppContext";
import { processSyllabus, generateStudyPlan } from "../services/api";

const Upload = () => {
  const navigate = useNavigate();
  const { userData, plan, setSyllabusTitle, setPlan } = useApp();
  const [files, setFiles] = useState([]);
  const [stage, setStage] = useState("idle");
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!/\.(pdf|txt)$/i.test(f.name)) {
      notifications.show({
        color: "red",
        message: "Please upload a PDF or TXT file.",
      });
      return;
    }
    setFiles((prev) => [...prev, f]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const analyze = async () => {
    if (files.length === 0) return;
    try {
      setStage("uploading");
      const processedSyllabi = [];

      // 1. Recover existing syllabi from the current plan to prevent overwriting
      if (plan?.courses && plan?.aiContext?.syllabus) {
        plan.courses.forEach((course, i) => {
          // We use the stored AI response as the 'text' for re-processing
          processedSyllabi.push({
            title: course.title,
            text: plan.aiContext.syllabus[i],
          });
        });
      }
      
      setStage("analyzing");
      for (const file of files) {
        const { data } = await processSyllabus(file);
        processedSyllabi.push({ title: data.extractedTitle, text: data.extractedText });
      }

      if (processedSyllabi.length > 0) setSyllabusTitle(processedSyllabi[0].title);
      
      setStage("planning");
      const { data: planData } = await generateStudyPlan(userData, processedSyllabi);
      
      setPlan(planData);
      setStage("done");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (e) {
      notifications.show({
        color: "red",
        message: "Something went wrong. Please try again.",
      });
      setStage("idle");
    }
  };

  const skip = async () => {
    setStage("planning");
    const { data: planData } = await generateStudyPlan(userData);
    setPlan(planData);
    setStage("done");
    setTimeout(() => navigate("/dashboard"), 500);
  };

  const busy = stage !== "idle" && stage !== "done";

  return (
    <Container size="sm" pt={48} pb={96}>
      <Text size="xs" tt="uppercase" lts="0.2em" c="dimmed" mb="xs">
        Step 2 — Syllabus
      </Text>
      <Title order={1} fw={600} style={{ lineHeight: 1.1 }}>
        Hand us your syllabus.
      </Title>
      <Text mt="md" c="dimmed" size="lg">
        PDF or plain text. Add as many as you need for this term.
      </Text>

      <Paper
        withBorder
        p={files.length > 0 ? "xl" : 48}
        mt={40}
        radius="xl"
        style={{
          borderStyle: "dashed",
          cursor: busy ? "not-allowed" : "pointer",
          opacity: busy ? 0.6 : 1,
          textAlign: "center",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !busy && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {files.length > 0 || plan?.courses?.length > 0 ? (
          <Stack gap="sm">
            {/* Existing courses already in the plan */}
            {plan?.courses?.map((c, i) => (
              <Group 
                key={`existing-${i}`} 
                justify="space-between" 
                p="sm" 
                bg="var(--mantine-color-blue-0)" 
                style={{ borderRadius: 8, border: '1px solid var(--mantine-color-blue-2)' }}
              >
                <Group gap="sm">
                  <IconCheck size={24} color="var(--mantine-color-blue-filled)" />
                  <Box style={{ textAlign: "left" }}>
                    <Text size="sm" fw={500}>{c.title}</Text>
                    <Text size="xs" c="dimmed">Already in your plan</Text>
                  </Box>
                </Group>
              </Group>
            ))}

            {files.map((f, i) => (
              <Group key={i} justify="space-between" p="sm" bg="var(--mantine-color-gray-0)" style={{ borderRadius: 8 }}>
                <Group gap="sm">
                  <IconFileText size={24} color="var(--mantine-color-blue-filled)" />
                  <Box style={{ textAlign: "left" }}>
                    <Text size="sm" fw={500}>{f.name}</Text>
                    <Text size="xs" c="dimmed">{(f.size / 1024).toFixed(1)} KB</Text>
                  </Box>
                </Group>
                <ActionIcon 
                  variant="subtle" 
                  color="gray" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles(prev => prev.filter((_, idx) => idx !== i));
                  }}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            ))}
            <Button 
              variant="light" 
              leftSection={<IconPlus size={16} />} 
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              mt="sm"
            >
              Add another file
            </Button>
          </Stack>
        ) : (
          <Stack align="center" gap="xs">
            <IconUpload size={40} c="dimmed" />
            <Text fw={500}>Drop a syllabus here</Text>
            <Text size="sm" c="dimmed">
              or click to browse — PDF, TXT
            </Text>
          </Stack>
        )}
      </Paper>

      {busy && (
        <Paper withBorder p="md" mt="xl">
          <Stack gap="sm">
            <StatusLine
              label="Uploading file"
              done={stage !== "uploading"}
              active={stage === "uploading"}
              pending={false}
            />
            <StatusLine
              label="Analyzing syllabus…"
              done={stage === "planning" || stage === "done"}
              active={stage === "analyzing"}
              pending={stage === "uploading"}
            />
            <StatusLine
              label="Generating your study plan"
              done={stage === "done"}
              active={stage === "planning"}
              pending={stage === "uploading" || stage === "analyzing"}
            />
          </Stack>
        </Paper>
      )}

      <Group justify="space-between" mt="xl">
        <Button variant="subtle" onClick={skip} disabled={busy}>
          Skip — use a sample syllabus
        </Button>
        <Button
          onClick={analyze}
          disabled={files.length === 0 || busy}
          size="lg"
          rightSection={
            busy ? <Loader size={16} /> : <IconArrowRight size={16} />
          }
        >
          {busy ? "Working…" : "Analyze syllabus"}
        </Button>
      </Group>
    </Container>
  );
};

function StatusLine({ label, active, done, pending }) {
  return (
    <Group gap="sm">
      <Box
        style={{
          height: 20,
          width: 20,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: done
            ? "var(--mantine-color-blue-filled)"
            : active
              ? "var(--mantine-color-blue-light)"
              : "var(--mantine-color-gray-2)",
          color: done ? "white" : "inherit",
        }}
      >
        {done ? <IconCheck size={12} /> : active ? <Loader size={12} /> : null}
      </Box>
      <Text
        size="sm"
        fw={active ? 500 : 400}
        c={pending ? "dimmed" : "inherit"}
      >
        {label}
      </Text>
    </Group>
  );
}

export default Upload;
