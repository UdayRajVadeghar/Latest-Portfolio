import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Skills from "./skills-content"

export default function Experience() {
  const experiences = [
    {
      title: "Software Engineer",
      company: "WNS",
      roleNote: "Full-time",
      period: "Jun 2025 - Present",
      relative: "5 mos",
      location: "On-site",
      achievements: [
        "Working as a Software Engineer building scalable business solutions.",
      ],
    },
    {
      title: "Founder",
      company: "MyCPTrainer",
      period: "Jun 2025 - Present",
      relative: "5 mos",
      location: "India",
      achievements: [
        "Built and launched MyCPTrainer — a platform that helps programmers master competitive programming through personalized training and smart problem recommendations.",
        "Implemented personalized learning paths, problem recommendation algorithms, and progress tracking.",
      ],
    },
    {
      title: "Competitive Programming Coach",
      company: "Amrita Vishwa Vidyapeetham",
      roleNote: "Part-time",
      period: "Apr 2025 - Jun 2025",
      relative: "3 mos",
      location: "India",
      achievements: [
        "Coached students on algorithms, data structures, and contest strategies for competitive programming events.",
      ],
    },
    {
      title: "IEEE Apprenticeship",
      company: "IEEE",
      roleNote: "Trainee",
      period: "Mar 2024 - Jul 2024",
      relative: "5 mos",
      location: "India · Remote",
      achievements: [
        "Contributed to apprenticeship projects focused on microservices and distributed systems.",
        "Worked on designing and implementing small, production-focused services.",
      ],
      tags: ["Microservices"],
    },
    {
      title: "Full-stack Developer",
      company: "DeepDive Labs",
      roleNote: "Internship",
      period: "Apr 2024 - Jun 2024",
      relative: "3 mos",
      location: "Singapore · Remote",
      achievements: [
        "Built RegAdmin V1 using React for the frontend and implemented CRUD operations on the backend.",
        "Leveraged AWS services, handled APIs and HTTP requests, and managed deployments for the app.",
      ],
      tags: ["Next.js", "AWS Lambda"],
    },
  ]

  return (
    <section id="experience" className="py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Experience</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              My professional journey and key accomplishments
            </p>
          </div>

          <div className="space-y-8 mt-12">
            {experiences.map((experience, index) => (
              <div key={index} className="timeline-item">
                <Card className="border-l-4 border-l-primary transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{experience.title}</h3>
                        <p className="text-muted-foreground">{experience.company}</p>
                      </div>
                      <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                        <Badge variant="outline" className="mb-1 md:mb-0">
                          {experience.period}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{experience.location}</span>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {experience.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="mt-20" id="skills">
            <Skills />
          </div>
        </div>
      </div>
    </section>
  )
}
