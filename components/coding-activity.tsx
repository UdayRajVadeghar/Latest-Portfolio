"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Code,
  GitFork,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

interface CodeforcesUser {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
}

interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  submissionCalendar?: { [timestamp: string]: number };
}

interface CodeforcesSubmission {
  creationTimeSeconds: number;
  verdict: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
}

export default function CodingActivity() {
  const [cfData, setCfData] = useState<CodeforcesUser | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeStats | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [cfSubmissions, setCfSubmissions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlatform, setCurrentPlatform] = useState(0);

  const GITHUB_USERNAME = "udayrajvadeghar";
  const CODEFORCES_HANDLE = "udayrajvadeghar";
  const LEETCODE_USERNAME = "_UdayRaj_";

  const platforms = [
    { name: "GitHub" },
    { name: "LeetCode" },
    { name: "Codeforces" },
  ];

  const processCodeforcesSubmissions = (
    submissions: CodeforcesSubmission[]
  ): ContributionDay[] => {
    const dailyCount: { [date: string]: number } = {};

    submissions.forEach((sub) => {
      if (sub.verdict === "OK") {
        const date = new Date(sub.creationTimeSeconds * 1000)
          .toISOString()
          .split("T")[0];
        dailyCount[date] = (dailyCount[date] || 0) + 1;
      }
    });

    const result: ContributionDay[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const count = dailyCount[dateStr] || 0;
      const level =
        count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

      result.push({
        date: dateStr,
        count,
        level,
      });
    }

    return result;
  };

  const processLeetCodeCalendar = (submissionCalendar?: {
    [timestamp: string]: number;
  }): ContributionDay[] => {
    if (!submissionCalendar) return [];

    const result: ContributionDay[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const timestamp = Math.floor(d.getTime() / 1000).toString();
      const count = submissionCalendar[timestamp] || 0;
      const level =
        count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

      result.push({
        date: d.toISOString().split("T")[0],
        count,
        level,
      });
    }

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GitHub data
        const ghUserResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}`
        );
        const ghUserData = await ghUserResponse.json();

        // Fetch GitHub repos to calculate total stars
        const ghReposResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
        );
        const ghReposData = await ghReposResponse.json();
        const totalStars = Array.isArray(ghReposData)
          ? ghReposData.reduce(
              (sum: number, repo: any) => sum + (repo.stargazers_count || 0),
              0
            )
          : 0;

        setGithubStats({
          publicRepos: ghUserData.public_repos || 0,
          followers: ghUserData.followers || 0,
          following: ghUserData.following || 0,
          totalStars,
        });

        // Fetch Codeforces data
        const cfResponse = await fetch(
          `https://codeforces.com/api/user.info?handles=${CODEFORCES_HANDLE}`
        );
        const cfJson = await cfResponse.json();
        if (cfJson.status === "OK" && cfJson.result.length > 0) {
          const user = cfJson.result[0];
          setCfData({
            handle: user.handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || "Unrated",
            maxRank: user.maxRank || "Unrated",
          });
        }

        // Fetch Codeforces submissions
        const cfSubsResponse = await fetch(
          `https://codeforces.com/api/user.status?handle=${CODEFORCES_HANDLE}&from=1&count=10000`
        );
        const cfSubsJson = await cfSubsResponse.json();
        if (cfSubsJson.status === "OK") {
          const processedSubmissions = processCodeforcesSubmissions(
            cfSubsJson.result
          );
          setCfSubmissions(processedSubmissions);
        }

        // Fetch LeetCode data
        const lcResponse = await fetch(
          `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`
        );
        const lcJson = await lcResponse.json();
        setLeetcodeData({
          totalSolved: lcJson.totalSolved || 0,
          totalQuestions: lcJson.totalQuestions || 0,
          easySolved: lcJson.easySolved || 0,
          mediumSolved: lcJson.mediumSolved || 0,
          hardSolved: lcJson.hardSolved || 0,
          ranking: lcJson.ranking || 0,
          submissionCalendar: lcJson.submissionCalendar || {},
        });
      } catch (error) {
        console.error("Error fetching coding stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRankColor = (rank: string) => {
    const rankColors: { [key: string]: string } = {
      newbie: "text-gray-500",
      pupil: "text-green-500",
      specialist: "text-cyan-500",
      expert: "text-blue-500",
      "candidate master": "text-purple-500",
      master: "text-orange-500",
      "international master": "text-orange-600",
      grandmaster: "text-red-500",
      "international grandmaster": "text-red-600",
      "legendary grandmaster": "text-red-700",
    };
    return rankColors[rank.toLowerCase()] || "text-muted-foreground";
  };

  const ContributionCalendar = ({ data }: { data: ContributionDay[] }) => {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    data.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();

      if (index === 0 && dayOfWeek !== 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: "", count: 0, level: 0 });
        }
      }

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const getLevelColor = (level: number) => {
      const colors = [
        "bg-muted/30",
        "bg-[#ea580c]/30",
        "bg-[#ea580c]/50",
        "bg-[#ea580c]/70",
        "bg-[#ea580c]",
      ];
      return colors[level];
    };

    return (
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-[11px] h-[11px] rounded-sm ${
                  day.date ? getLevelColor(day.level) : "bg-transparent"
                } transition-all hover:ring-2 hover:ring-[#ea580c] cursor-pointer`}
                title={
                  day.date
                    ? `${day.date}: ${day.count} submission${
                        day.count !== 1 ? "s" : ""
                      }`
                    : ""
                }
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <section id="coding-activity" className="py-20 w-full">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Coding Journey
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Tracking my progress across competitive programming platforms
                and open source contributions
              </p>
            </div>

            <div className="relative mt-12">
              <div className="flex items-center justify-center gap-4 mb-8">
                <button
                  onClick={() =>
                    setCurrentPlatform(
                      (prev) => (prev - 1 + platforms.length) % platforms.length
                    )
                  }
                  className="p-3 rounded-lg bg-card border hover:bg-[#ea580c]/20 transition-all active:scale-95"
                  aria-label="Previous platform"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-2">
                  {platforms.map((platform, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPlatform(index)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        currentPlatform === index
                          ? "bg-[#ea580c] text-white shadow-lg shadow-[#ea580c]/25"
                          : "bg-card border hover:bg-[#ea580c]/10"
                      }`}
                    >
                      {platform.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPlatform((prev) => (prev + 1) % platforms.length)
                  }
                  className="p-3 rounded-lg bg-card border hover:bg-[#ea580c]/20 transition-all active:scale-95"
                  aria-label="Next platform"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="relative overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-pulse text-muted-foreground text-lg">
                      Loading...
                    </div>
                  </div>
                ) : (
                  <>
                    {/* GitHub Slide */}
                    <div
                      className={`space-y-6 ${
                        currentPlatform === 0 ? "block" : "hidden"
                      }`}
                    >
                      {githubStats && (
                        <>
                          {/* GitHub Contribution Calendar */}
                          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                            <CardContent className="p-8">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-[#ea580c]/10">
                                  <Code className="h-8 w-8 text-[#ea580c]" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold">
                                    GitHub Contributions
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    @{GITHUB_USERNAME}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-center overflow-x-auto pb-4 mb-6">
                                <GitHubCalendar
                                  username={GITHUB_USERNAME}
                                  colorScheme="dark"
                                  blockSize={11}
                                  blockMargin={4}
                                  fontSize={14}
                                  theme={{
                                    dark: [
                                      "rgba(255, 255, 255, 0.05)",
                                      "rgba(234, 88, 12, 0.3)",
                                      "rgba(234, 88, 12, 0.5)",
                                      "rgba(234, 88, 12, 0.7)",
                                      "rgba(234, 88, 12, 1)",
                                    ],
                                  }}
                                />
                              </div>

                              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                                <span>Less</span>
                                <div className="flex gap-1">
                                  {[0, 1, 2, 3, 4].map((level) => (
                                    <div
                                      key={level}
                                      className={`w-3 h-3 rounded-sm ${
                                        level === 0
                                          ? "bg-muted/30"
                                          : level === 1
                                          ? "bg-[#ea580c]/30"
                                          : level === 2
                                          ? "bg-[#ea580c]/50"
                                          : level === 3
                                          ? "bg-[#ea580c]/70"
                                          : "bg-[#ea580c]"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span>More</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* GitHub Stats */}
                          <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-gray-500/5 to-slate-500/5">
                            <CardContent className="p-8">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="flex justify-center mb-2">
                                    <GitFork className="h-5 w-5 text-[#ea580c]" />
                                  </div>
                                  <div className="text-3xl font-bold text-[#ea580c] mb-1">
                                    {githubStats.publicRepos}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Repositories
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="flex justify-center mb-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                  </div>
                                  <div className="text-3xl font-bold text-yellow-500 mb-1">
                                    {githubStats.totalStars}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Total Stars
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="flex justify-center mb-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                  </div>
                                  <div className="text-3xl font-bold text-blue-500 mb-1">
                                    {githubStats.followers}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Followers
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="flex justify-center mb-2">
                                    <Users className="h-5 w-5 text-green-500" />
                                  </div>
                                  <div className="text-3xl font-bold text-green-500 mb-1">
                                    {githubStats.following}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Following
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>

                    {/* LeetCode Slide */}
                    <div
                      className={`space-y-6 ${
                        currentPlatform === 1 ? "block" : "hidden"
                      }`}
                    >
                      {leetcodeData && (
                        <>
                          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                            <CardContent className="p-8">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-[#ea580c]/10">
                                  <Zap className="h-8 w-8 text-[#ea580c]" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold">
                                    LeetCode Submissions
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {LEETCODE_USERNAME}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-center overflow-x-auto pb-4 mb-6">
                                {leetcodeData?.submissionCalendar &&
                                Object.keys(leetcodeData.submissionCalendar)
                                  .length > 0 ? (
                                  <ContributionCalendar
                                    data={processLeetCodeCalendar(
                                      leetcodeData.submissionCalendar
                                    )}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-[150px] text-sm text-muted-foreground">
                                    No submission data available
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                                <span>Less</span>
                                <div className="flex gap-1">
                                  {[0, 1, 2, 3, 4].map((level) => (
                                    <div
                                      key={level}
                                      className={`w-3 h-3 rounded-sm ${
                                        level === 0
                                          ? "bg-muted/30"
                                          : level === 1
                                          ? "bg-[#ea580c]/30"
                                          : level === 2
                                          ? "bg-[#ea580c]/50"
                                          : level === 3
                                          ? "bg-[#ea580c]/70"
                                          : "bg-[#ea580c]"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span>More</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-[#ea580c]/5 to-yellow-500/5">
                            <CardContent className="p-8">
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="text-3xl font-bold text-[#ea580c] mb-1">
                                    {leetcodeData.totalSolved}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Total Solved
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    of {leetcodeData.totalQuestions}
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="text-3xl font-bold text-green-500 mb-1">
                                    {leetcodeData.easySolved}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Easy
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="text-3xl font-bold text-yellow-500 mb-1">
                                    {leetcodeData.mediumSolved}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Medium
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="text-3xl font-bold text-red-500 mb-1">
                                    {leetcodeData.hardSolved}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Hard
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-card border text-center">
                                  <div className="text-3xl font-bold text-purple-500 mb-1">
                                    {leetcodeData.ranking > 0
                                      ? `#${leetcodeData.ranking.toLocaleString()}`
                                      : "N/A"}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Global Rank
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>

                    {/* Codeforces Slide */}
                    <div
                      className={`space-y-6 ${
                        currentPlatform === 2 ? "block" : "hidden"
                      }`}
                    >
                      {cfData && (
                        <>
                          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                            <CardContent className="p-8">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-[#ea580c]/10">
                                  <Trophy className="h-8 w-8 text-[#ea580c]" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold">
                                    Codeforces Submissions
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {CODEFORCES_HANDLE}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-center overflow-x-auto pb-4 mb-6">
                                {cfSubmissions.length > 0 ? (
                                  <ContributionCalendar data={cfSubmissions} />
                                ) : (
                                  <div className="flex items-center justify-center h-[150px] text-sm text-muted-foreground">
                                    No submission data available
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                                <span>Less</span>
                                <div className="flex gap-1">
                                  {[0, 1, 2, 3, 4].map((level) => (
                                    <div
                                      key={level}
                                      className={`w-3 h-3 rounded-sm ${
                                        level === 0
                                          ? "bg-muted/30"
                                          : level === 1
                                          ? "bg-[#ea580c]/30"
                                          : level === 2
                                          ? "bg-[#ea580c]/50"
                                          : level === 3
                                          ? "bg-[#ea580c]/70"
                                          : "bg-[#ea580c]"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span>More</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                            <CardContent className="p-8">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
                                  <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="font-medium">
                                      Current Rating
                                    </span>
                                  </div>
                                  <span className="text-2xl font-bold text-[#ea580c]">
                                    {cfData.rating}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
                                  <div className="flex items-center gap-3">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    <span className="font-medium">
                                      Max Rating
                                    </span>
                                  </div>
                                  <span className="text-2xl font-bold">
                                    {cfData.maxRating}
                                  </span>
                                </div>

                                <div className="p-4 rounded-lg bg-card border">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Award className="h-5 w-5 text-purple-500" />
                                    <span className="font-medium">Rank</span>
                                  </div>
                                  <div className="space-y-1">
                                    <div
                                      className={`text-xl font-bold capitalize ${getRankColor(
                                        cfData.rank
                                      )}`}
                                    >
                                      {cfData.rank}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Highest:{" "}
                                      <span
                                        className={`font-semibold capitalize ${getRankColor(
                                          cfData.maxRank
                                        )}`}
                                      >
                                        {cfData.maxRank}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
