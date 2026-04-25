import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { IconFileUploadFilled, IconCalendarEventFilled, IconSparkles, IconSparklesFilled } from "@tabler/icons-react";

function HomePage() {
  return (
    <Stack>
      <Stack align="flex-start">
        <Text size="sm">A STUDY COMPANION</Text>
        <Text size="xl" fw="bold">
          The quiet method for learning deeply
        </Text>
        <Text size="md" align="left">
          Upload your Syllabus. Answer a few questions. Receive a study plan
          <br />
          shaped to how you actually learn, not how you wish you did.
        </Text>
        <Group>
          <Button>Begin Onboarding</Button>
          <Button>View Dashboard</Button>
        </Group>
      </Stack>

      <Group>
        <Card align="left" shadow="sm" withBorder>
            <Stack>
                <IconSparklesFilled />
            </Stack>
            <Text>
                A persona, not a label
            </Text>
            <Text>
                We surface how you learn: visual, dialectical, architectural, and design around it.
            </Text>
        </Card>
        <Card align="left" shadow="sm" withBorder>
            <Stack>
                <IconFileUploadFilled/>
            </Stack>
            <Text>
                Syllabus, decoded
            </Text>
            <Text>
                Drop in any PDF of text. We extract topics, exam dates, and reading weight.
            </Text>
        </Card>
        <Card align="left" shadow="sm" withBorder>
            <Stack>
                <IconCalendarEventFilled />
            </Stack>
            <Text>
                A plan you'll keep
            </Text>
            <Text>
                Weekly study sessions sized to your hours, your courses, your rhythm.
            </Text>
        </Card>
      </Group>
    </Stack>
  );
}

export default HomePage;
