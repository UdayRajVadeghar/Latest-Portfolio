import About from "@/components/about";
import Blog from "@/components/blog";
import CodingActivity from "@/components/coding-activity";
import Contact from "@/components/contact";
import Education from "@/components/education";
import Experience from "@/components/experience";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uday Raj Vadeghar | Software Engineer",
  description:
    "Portfolio of Uday Raj Vadeghar — B. Tech CSE. Skills: Java, JavaScript, TypeScript, React, Next.js, Node.js, AWS, Docker, PostgreSQL.",
};

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <About />
      <CodingActivity />
      <Experience />
      <Projects />
      <Education />
      <Blog />
      <Contact />
    </div>
  );
}
