import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Award } from "lucide-react"

export default function Achievements() {
  const achievements = [
    {
      title: "Top 1% in IICPC",
      org: "IICPC (InterCollegiate Informatic and Competitive Programming Camp)",
      date: "Issued Mar 2025",
      description: "Merit certificate — secured a rank of 751 out of 45,000 contestants."
    },
    {
      title: "LeetCode — Top 5%",
      org: "LeetCode",
      date: "Ongoing",
      description: "Consistently rank in the top 5% of problem solvers on LeetCode (Knight).",
      tags: ["Algorithms", "Problem Solving"],
    },
    {
      title: "Codeforces — Specialist",
      org: "Codeforces",
      date: "Ongoing",
      description: "Achieved the " +
        "Specialist" +
        " rating on Codeforces through regular participation in contests.",
      tags: ["Competitive Programming", "Contests"],
    },
    {
      title: "Meta Hacker Cup — Rank 2100",
      org: "Meta Hacker Cup",
      date: "2025",
      description: "Achieved a global rank of 2100 in the Meta Hacker Cup qualification rounds.",
      tags: ["Algorithms", "Global Contest"],
    },
  ]

  return (
    <section id="achievements" className="py-12">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">Achievements</h3>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed">
            Selected accomplishments from programming contests and certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((a, idx) => (
            <Card key={idx} className="h-full">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold">{a.title}</h4>
                      <p className="text-sm text-muted-foreground">{a.org}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{a.date}</div>
                  </div>

                  <div className="mt-3 flex items-start gap-4">
                  

                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{a.description}</p>

                      {a.tags ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {a.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
