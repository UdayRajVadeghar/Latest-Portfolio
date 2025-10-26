import { Card, CardContent } from "@/components/ui/card"
import { Code2, Globe, Server, Users } from "lucide-react"

export default function About() {
  const features = [
    {
      icon: <Code2 className="h-10 w-10 text-primary" />,
      title: "Full Stack Development",
      description: "Expertise in JavaScript, TypeScript, React.js, Node.js, and Java",
    },
    {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: "Cloud Solutions",
      description: "Proficient with GCP including Vertex AI, Lambda, Compute Engine, Cloud Run and etc",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Team Leadership",
      description: "Led diverse teams of 15+ members across development, design, DevOps, and QA",
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "CP Coach",
      description: "Organized a coding camp for 80+ students, helping them build strong problem-solving skills and confidence.",
    },
  ]

  return (
    <div className="w-full bg-muted/30">
      <section id="about" className="py-20 w-full">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Me</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                As a full-stack engineer, I’ve designed and developed application from the ground up , everything from backend architecture and frontend experience to database design, scalability, and intelligent automation.
              </p>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Skilled in designing and developing scalable full-stack applications, with expertise across Next.js, Node.js, PostgreSQL, and Cloudflare. Experienced in building intelligent recommendation systems, real-time analytics, and interactive learning platforms. Adept at optimizing performance, implementing secure authentication, and managing end-to-end infrastructure with Redis, Sentry, and cloud-based services. Passionate about creating impactful developer tools that blend data, design, and engineering to enhance learning and productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="animate-in">
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="p-2 rounded-full bg-primary/10">{feature.icon}</div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
