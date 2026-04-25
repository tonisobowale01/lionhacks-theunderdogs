import {
	ActionIcon,
	Button,
	Group,
	Container,
	Stack,
	Text,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconBook } from "@tabler/icons-react";

function Header() {
	const navigate = useNavigate();

	return (
		<Container size="lg" h="100%">
			<Group h="100%" justify="space-between">
				<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
					<Group gap="sm">
						<ActionIcon size={40} variant="filled" radius="md">
							<IconBook size={24} />
						</ActionIcon>
						<Stack gap={0}>
							<Text fw={700} size="xl" style={{ lineHeight: 1 }}>
								Ace
							</Text>
							<Text
								size="xs"
								c="dimmed"
								lts={1.5}
								style={{ textTransform: "uppercase" }}
							>
								Study, considered.
							</Text>
						</Stack>
					</Group>
				</Link>

				<Group gap="xs" visibleFrom="sm">
					<Button
						size="sm"
						variant="subtle"
						onClick={() => navigate("/onboarding")}
					>
						Onboarding
					</Button>
					<Button size="sm" variant="subtle">
						Syllabus
					</Button>
					<Button size="sm" variant="subtle">
						Dashboard
					</Button>
				</Group>
			</Group>
		</Container>
	);
}

export default Header;
