import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Paper,
  Badge,
  Progress,
  Accordion,
  Loader,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { useApp } from "../context/AppContext";
import { generateStudyPlan } from "./mockApi";
import {
  IconSparkles,
  IconCalendar,
  IconClock,
  IconTarget,
  IconBook,
  IconTrendingUp,
  IconAlertCircle,
} from "@tabler/icons-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { plan, userData, setPlan } = useApp();
  const [loading, setLoading] = useState(false);

  // Sample fallback if user lands here directly
  useEffect(() => {
    if (!plan) {
      setLoading(true);
      generateStudyPlan({
        name: "Friend",
        major: "your studies",
        yearLevel: "Third year",
        studyStyle: "Reading & writing",
        hoursPerWeek: "10–15",
        goals: "",
        challenges: "",
      }).then((p) => {
        setPlan(p);
        setLoading(false);
      });
    }
  }, [plan, setPlan]);

  if (loading || !plan) {
    return (
      <Container py={120} style={{ textAlign: "center" }}>
        <Loader size="lg" mx="auto" />
        <Text mt="md" c="dimmed">
          Composing your dashboard…
        </Text>
      </Container>
    );
  }

  const greeting = userData.name ? `Welcome, ${userData.name}` : "Welcome back";

  return (
    <Container size="lg" pt={40} pb={96}>
      {/* Header */}
      <Group justify="space-between" align="flex-end" mb={40}>
        <Box>
          <Text size="xs" tt="uppercase" lts="0.2em" c="dimmed" mb={8}>
            Your study room
          </Text>
          <Title
            order={1}
            fw={600}
            style={{ fontSize: "var(--mantine-font-size-xl) * 2" }}
          >
            {greeting}.
          </Title>
          <Text mt={8} c="dimmed">
            {plan.courses.length} courses · {totalSessions(plan)} weekly
            sessions planned
          </Text>
        </Box>
        <Button
          variant="outline"
          onClick={() => navigate("/upload")}
          leftSection={<IconBook size={16} />}
        >
          Add another syllabus
        </Button>
      </Group>

      {/* Persona + Stats */}
      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" mb={40}>
        <PersonaCard plan={plan} />
        <StatCard
          icon={IconTarget}
          label="Active courses"
          value={plan.courses.length.toString()}
          sub="this term"
        />
        <StatCard
          icon={IconCalendar}
          label="Next deadline"
          value={nextDeadline(plan).label}
          sub={nextDeadline(plan).date}
        />
      </SimpleGrid>

      {/* Recommendations */}
      <Box mb={48}>
        <SectionHeader
          icon={IconSparkles}
          title="Recommendations"
          subtitle="Shaped by your answers and syllabus"
        />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
          {plan.recommendations.map((r, i) => (
            <Paper
              key={i}
              withBorder
              p="md"
              radius="md"
              className="shadow-paper"
            >
              <Group align="flex-start" wrap="nowrap" gap="md">
                <ThemeIcon variant="light" size="lg" radius="md">
                  <Text fw={700} size="sm">
                    {i + 1}
                  </Text>
                </ThemeIcon>
                <Text size="sm" style={{ lineHeight: 1.5 }}>
                  {r}
                </Text>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>

      {/* Courses */}
      <Box>
        <SectionHeader
          icon={IconBook}
          title="Your courses"
          subtitle="Click to expand topics, dates, and your weekly plan"
        />
        <Paper withBorder radius="xl" style={{ overflow: "hidden" }}>
          <Accordion variant="separated" defaultValue={plan.courses[0]?.id}>
            {plan.courses.map((course) => (
              <CourseRow key={course.id} course={course} />
            ))}
          </Accordion>
        </Paper>
      </Box>
    </Container>
  );
};

function PersonaCard({ plan }) {
  return (
    <Paper
      p="xl"
      radius="xl"
      withBorder
      className="shadow-paper"
      style={{
        position: "relative",
        background: "var(--gradient-warm)",
        border: "none",
      }}
    >
      <Text
        size="xs"
        tt="uppercase"
        lts="0.1em"
        c="dimmed"
        style={{ position: "absolute", top: 20, right: 24 }}
      >
        Persona
      </Text>
      <IconSparkles size={20} color="var(--primary)" />
      <Title order={3} mt="sm">
        {plan.persona.archetype}
      </Title>
      <Text size="sm" mt="xs" fs="italic" c="dimmed">
        "{plan.persona.summary}"
      </Text>
      <SimpleGrid cols={2} mt="xl">
        <Box>
          <Group gap={4} mb={6}>
            <IconTrendingUp size={14} color="gray" />
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Strengths
            </Text>
          </Group>
          <Stack gap={4}>
            {plan.persona.strengths.map((s) => (
              <Text key={s} size="xs">
                · {s}
              </Text>
            ))}
          </Stack>
        </Box>
        <Box>
          <Group gap={4} mb={6}>
            <IconAlertCircle size={14} color="gray" />
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Watch for
            </Text>
          </Group>
          <Stack gap={4}>
            {plan.persona.watchouts.map((s) => (
              <Text key={s} size="xs">
                · {s}
              </Text>
            ))}
          </Stack>
        </Box>
      </SimpleGrid>
    </Paper>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Paper withBorder p="xl" radius="xl" className="shadow-paper">
      <Group justify="space-between" mb="xl">
        <Text size="xs" tt="uppercase" lts="0.1em" c="dimmed" fw={700}>
          {label}
        </Text>
        <Icon size={18} color="gray" />
      </Group>
      <Title order={2} fw={600}>
        {value}
      </Title>
      <Text size="sm" c="dimmed" mt={4}>
        {sub}
      </Text>
    </Paper>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <Box mb="lg">
      <Group gap={8} mb={4}>
        <Icon size={14} color="var(--mantine-color-dimmed)" />
        <Text size="xs" tt="uppercase" lts="0.2em" fw={700} c="dimmed">
          {title}
        </Text>
      </Group>
      <Text size="sm" c="dimmed">
        {subtitle}
      </Text>
    </Box>
  );
}

function CourseRow({ course }) {
  return (
    <Accordion.Item value={course.id}>
      <Accordion.Control p="lg">
        <Group wrap="nowrap" gap="xl">
          <Box w={4} h={40} bg="brand" style={{ borderRadius: 4 }} />
          <Box style={{ flex: 1 }}>
            <Group gap={8} mb={4}>
              <Text size="xs" ff="monospace" c="dimmed">
                {course.code}
              </Text>
              <Text size="xs" c="dimmed">
                ·
              </Text>
              <Text size="xs" c="dimmed">
                {course.instructor}
              </Text>
            </Group>
            <Text fw={600} size="lg">
              {course.title}
            </Text>
          </Box>
          <Group visibleFrom="md" gap="xs">
            {course.examDates.slice(0, 1).map((d) => (
              <Badge key={d.label} variant="secondary" className="font-normal">
                {d.label} · {d.date}
              </Badge>
            ))}
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel pb="xl" px="xl">
        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={40}>
          {/* Topics */}
          <Box>
            <Group gap={6} mb="md">
              <IconTarget size={14} color="gray" />
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Topics
              </Text>
            </Group>
            <Stack gap="lg">
              {course.topics.map((t) => (
                <Box key={t.title}>
                  <Group justify="space-between" mb={6}>
                    <Text size="sm">{t.title}</Text>
                    <StatusDot status={t.status} />
                  </Group>
                  <Progress value={t.weight} size="xs" radius="xl" />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Exam dates */}
          <Box>
            <Group gap={6} mb="md">
              <IconCalendar size={14} color="gray" />
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Key dates
              </Text>
            </Group>
            <Stack gap="xs">
              {course.examDates.map((d) => (
                <Paper
                  key={d.label}
                  withBorder
                  p="xs"
                  radius="md"
                  bg="var(--mantine-color-gray-0)"
                >
                  <Group justify="space-between">
                    <Text size="sm">{d.label}</Text>
                    <Text size="sm" ff="monospace" c="brand" fw={500}>
                      {d.date}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* Study plan */}
          <Box>
            <Group gap={6} mb="md">
              <IconClock size={14} color="gray" />
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Weekly plan
              </Text>
            </Group>
            <Stack gap="xs">
              {course.studyPlan.map((s, i) => (
                <Paper key={i} withBorder p="xs" radius="md">
                  <Group wrap="nowrap" align="flex-start" gap="md">
                    <Text fw={700} c="brand" size="sm" w={32}>
                      {s.day}
                    </Text>
                    <Box>
                      <Text size="sm" style={{ lineHeight: 1.2 }}>
                        {s.focus}
                      </Text>
                      <Text size="xs" c="dimmed" mt={2}>
                        {s.durationMin} min
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Box>
        </SimpleGrid>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function StatusDot({ status }) {
  const map = {
    "not-started": { label: "—", color: "gray" },
    "in-progress": { label: "in progress", color: "orange" },
    mastered: { label: "mastered", color: "blue" },
  };
  const config = map[status] || map["not-started"];

  return (
    <Badge variant="light" color={config.color} size="xs" radius="sm">
      {config.label}
    </Badge>
  );
}

function totalSessions(plan) {
  return plan.courses.reduce((sum, c) => sum + c.studyPlan.length, 0);
}

function nextDeadline(plan) {
  const all = plan.courses.flatMap((c) => c.examDates);
  return all[0] || { label: "None", date: "—" };
}

export default Dashboard;
