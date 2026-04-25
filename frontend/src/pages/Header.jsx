import { Link, useLocation } from "react-router-dom";
import { Group, Box, Text, ThemeIcon, Container } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";

const Header = () => {
  const { pathname } = useLocation();

  return (
    <Container size="lg" h="100%">
      <Group justify="space-between" h="100%" align="center">
        {/* Logo Section */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <ThemeIcon
            size={36}
            radius="md"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-paper)",
            }}
          >
            <IconBook size={20} />
          </ThemeIcon>
          <Box style={{ lineHeight: 1.1 }}>
            <Text
              className="font-serif-display"
              size="xl"
              fw={600}
              c="var(--ink)"
            >
              Ace
            </Text>
            <Text
              tt="uppercase"
              lts="0.1em"
              style={{ fontSize: 11 }}
              c="dimmed"
            >
              Study, considered.
            </Text>
          </Box>
        </Link>

        {/* Navigation */}
        <Group gap={4} visibleFrom="md">
          {[
            { to: "/onboarding", label: "Onboarding" },
            { to: "/upload", label: "Syllabus" },
            { to: "/dashboard", label: "Dashboard" },
          ].map((l) => {
            const active = pathname === l.to;
            return (
              <Text
                key={l.to}
                component={Link}
                to={l.to}
                px="md"
                py={6}
                size="sm"
                fw={500}
                style={{
                  borderRadius: "var(--radius)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                  backgroundColor: active ? "var(--secondary)" : "transparent",
                  color: active
                    ? "var(--secondary-foreground)"
                    : "var(--muted-foreground)",
                }}
              >
                {l.label}
              </Text>
            );
          })}
        </Group>
      </Group>
    </Container>
  );
};

export default Header;
