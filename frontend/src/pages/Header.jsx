import {
  ActionIcon,
  Button,
  Container,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconBook } from "@tabler/icons-react";

function Header() {
  const navigate = useNavigate();

  return (
    <Group justify="space-between">
      <Group>
        <ActionIcon>
          <IconBook />
        </ActionIcon>
        <Stack>
          <Text size="md" fs="italic">
            Ace
          </Text>
          <Text size="sm" color="dimmed">
            STUDY, CONSIDERED
          </Text>
        </Stack>
      </Group>
      <Group>
        <Button variant="subtle" onClick={() => navigate("/onboarding")}>
          Onboarding
        </Button>
        <Button variant="subtle">Syllabus</Button>
        <Button variant="subtle">Dashboard</Button>
      </Group>
    </Group>
  );
}

export default Header;
