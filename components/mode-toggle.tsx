"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const activeTheme = resolvedTheme ?? theme ?? "light";
  const nextTheme = activeTheme === "dark" ? "light" : "dark";

  const toggleTheme = () => {
    setTheme(nextTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      type="button"
      aria-label={`Activate ${nextTheme} mode`}
      aria-pressed={activeTheme === "dark"}
      onClick={toggleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform transition-opacity dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform transition-opacity dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
