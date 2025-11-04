import { Card, CardContent } from "@/components/ui/card";
import { Award, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export default function Achievements() {
  const achievements = [
    {
      title: "Top 1% in IICPC",
      org: "IICPC (InterCollegiate Informatic and Competitive Programming Camp)",
      description:
        "Merit certificate — secured a rank of 751 out of 45,000 contestants.",
      link: "",
    },
    {
      title: "LeetCode Knight - Top 5%",
      org: "LeetCode",
      description:
        "Consistently rank in the top 5% of problem solvers on LeetCode (Knight).",
      link: "https://leetcode.com/u/_UdayRaj_/",
    },
    {
      title: "Codeforces - Specialist",
      org: "Codeforces",
      description:
        "Achieved the   Specialist rating on Codeforces through regular participation in contests.",
      link: "https://codeforces.com/profile/UdayRajVadeghar",
    },
    {
      title: "Meta Hacker Cup - Rank 2103",
      org: "Meta Hacker Cup",
      description:
        "Achieved a global rank of 2100 in the Meta Hacker Cup qualification rounds.",
    },
  ];

  return (
    <section id="achievements" className="py-12">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
            Achievements
          </h3>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed">
            Selected accomplishments from programming contests and
            certifications.
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

                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold">{a.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{a.org}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {a.description}
                  </p>

                  {a.link && (
                    <Button size="sm" variant="outline" className="mt-2" asChild>
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" /> View
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
