import { Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Paper,
  Box,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBook,
  IconSparkles,
  IconCalendar,
} from "@tabler/icons-react";

const Index = () => {
  return (
    <Container size="lg" pt={80} pb={96}>
      <Box style={{ maxWidth: 800 }}>
        <Group gap={8} mb={24}>
          <Box w={32} h={1} bg="var(--border)" />
          <Text size="xs" tt="uppercase" lts="0.2em" c="dimmed">
            A study companion
          </Text>
        </Group>

        <Title
          order={1}
          className="font-serif-display"
          style={{ fontSize: "clamp(3rem, 8vw, 4.5rem)", lineHeight: 1.05 }}
          
        >
          The quiet method for{" "}
          <Text
            component="em"
            inherit
            fs="normal"
            style={{ position: "relative", color: "var(--accent)" }}
          >
            learning deeply
            <Box
              component="span"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 4,
                height: 8,
                backgroundColor: "var(--highlight)",
                opacity: 0.4,
                zIndex: -1,
              }}
            />
          </Text>
          .
        </Title>

        <Text
          size="xl"
          mt={32}
          c="dimmed"
          style={{ maxWidth: 640, lineHeight: 1.6 }}
        >
          Upload your syllabus. Answer a few honest questions. Receive a study
          plan shaped to how{" "}
          <Text component="em" inherit>
            you
          </Text>{" "}
          actually learn — not how you wish you did.
        </Text>

        <Group mt={40} gap="md">
          <Button
            component={Link}
            to="/onboarding"
            size="lg"
            h={48}
            px={24}
            rightSection={<IconArrowRight size={16} />}
          >
            Begin onboarding
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            variant="outline"
            size="lg"
            h={48}
            px={24}
          >
            View sample dashboard
          </Button>
        </Group>
      </Box>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={96}>
        {[
          {
            icon: IconSparkles,
            title: "A persona, not a label",
            body: "We surface how you learn — visual, dialectical, architectural — and design around it.",
          },
          {
            icon: IconBook,
            title: "Syllabus, decoded",
            body: "Drop in any PDF or text. We extract topics, exam dates, and reading weight.",
          },
          {
            icon: IconCalendar,
            title: "A plan you'll keep",
            body: "Weekly study sessions sized to your hours, your courses, your rhythm.",
          },
        ].map((f) => (
          <Paper
            key={f.title}
            withBorder
            p="xl"
            radius="md"
            className="shadow-paper"
          >
            <f.icon
              size={20}
              color="var(--accent)"
              style={{ marginBottom: 16 }}
            />
            <Title order={3} className="font-serif-display" mb={8}>
              {f.title}
            </Title>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
              {f.body}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Index;
