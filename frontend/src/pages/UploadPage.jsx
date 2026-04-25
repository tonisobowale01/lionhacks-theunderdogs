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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconFileText,
  IconUpload,
  IconCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import { useApp } from "../context/AppContext";
import { processSyllabus, generateStudyPlan } from "../services/api";

const Upload = () => {
  const navigate = useNavigate();
  const { userData, setSyllabusTitle, setPlan } = useApp();
  const [file, setFile] = useState(null);
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
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const analyze = async () => {
    if (!file) return;
    try {
      setStage("uploading");
      await new Promise((r) => setTimeout(r, 600));
      setStage("analyzing");
      const {
        data: { extractedTitle },
      } = await processSyllabus(file);
      setSyllabusTitle(extractedTitle);
      setStage("planning");
      const { data: planData } = await generateStudyPlan(
        userData,
        extractedTitle,
      );
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
        PDF or plain text. We'll extract topics, exam dates, and reading weight.
      </Text>

      <Paper
        withBorder
        p={48}
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
        {file ? (
          <Group justify="center">
            <IconFileText size={40} color="var(--mantine-color-blue-filled)" />
            <Box style={{ textAlign: "left" }}>
              <Text fw={500}>{file.name}</Text>
              <Text size="sm" c="dimmed">
                {(file.size / 1024).toFixed(1)} KB
              </Text>
            </Box>
          </Group>
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
          disabled={!file || busy}
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
