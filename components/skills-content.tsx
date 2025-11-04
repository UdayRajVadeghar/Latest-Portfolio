import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function SkillsContent() {
  const skillCategories = [
    {
      category: "Frontend",
      skills: [
        "JavaScript",
        "TypeScript",
        "React.js",
        "Tanstack Query",
        "Zustand",
        "Tailwind CSS",
      ],
    },
    {
      category: "Backend",
      skills: ["Node.js", "FastAPI", "Express.js", "RESTful APIs", "GraphQL"],
    },
    {
      category: "Database",
      skills: ["MySQL", "PostgreSQL", "DynamoDB", "MongoDB", "Redis"],
    },
    {
      category: "Cloud & DevOps",
      skills: [
        "AWS",
        "GitHub Actions",
        "Vertex AI",
        "Cloud Run",
        "Docker",
        "CI/CD",
      ],
    },
    {
      category: "Competitive Programming",
      skills: ["Algorithms", "Data Structures", "Problem Solving"],
    },
    {
      category: "Agentic AI",
      skills: [
        "LangGraph",
        "Google-ADK",
        "MCP Agents",
        "A2A Protocol",
        "LangChain",
      ],
    },
  ];

  return (
    <div>
      <div className="space-y-4 text-center">
        <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
          Skills
        </h3>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed">
          My expertise and technical proficiencies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {skillCategories.map((category, index) => (
          <div key={index} className="skill-card">
            <Card className="h-full border-t-4 border-t-primary">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
