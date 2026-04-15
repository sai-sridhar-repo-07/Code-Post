import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";
import type {
  GitHubData,
  GitHubUser,
  Repository,
  LanguageStat,
  ContributionCalendar,
  GitHubStats,
} from "@/types";

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  "C#": "#178600",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  R: "#198CE7",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  MATLAB: "#e16737",
  Perl: "#0298c3",
  Zig: "#ec915c",
};

export async function fetchGitHubData(
  accessToken: string,
  username: string
): Promise<GitHubData> {
  const octokit = new Octokit({ auth: accessToken });
  const graphqlWithAuth = graphql.defaults({
    headers: { authorization: `token ${accessToken}` },
  });

  const [userResponse, reposResponse] = await Promise.all([
    octokit.users.getAuthenticated(),
    octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
      type: "owner",
    }),
  ]);

  const user = userResponse.data as GitHubUser;
  const repos = reposResponse.data as Repository[];

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  const [languages, contributions] = await Promise.all([
    fetchLanguageStats(octokit, repos),
    fetchContributions(graphqlWithAuth, username),
  ]);

  const prCount = await fetchPRCount(octokit, username);

  const stats: GitHubStats = {
    totalCommits: contributions.totalContributions,
    totalPRs: prCount,
    totalIssues: 0,
    totalStars,
    currentStreak: calculateCurrentStreak(contributions),
    longestStreak: calculateLongestStreak(contributions),
    totalRepos: user.public_repos,
    followers: user.followers,
  };

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  return {
    user,
    stats,
    languages,
    topRepos,
    contributionCalendar: contributions,
    lastSynced: new Date().toISOString(),
  };
}

async function fetchLanguageStats(
  octokit: Octokit,
  repos: Repository[]
): Promise<LanguageStat[]> {
  const languageCounts: Record<string, number> = {};

  const languagePromises = repos.slice(0, 30).map(async (repo) => {
    try {
      const { data } = await octokit.repos.listLanguages({
        owner: repo.full_name.split("/")[0],
        repo: repo.name,
      });
      return data;
    } catch {
      return {};
    }
  });

  const results = await Promise.all(languagePromises);
  results.forEach((langData) => {
    Object.entries(langData).forEach(([lang, bytes]) => {
      languageCounts[lang] = (languageCounts[lang] || 0) + (bytes as number);
    });
  });

  const total = Object.values(languageCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / total) * 100),
      color: LANGUAGE_COLORS[name] || "#8b949e",
    }));
}

async function fetchPRCount(
  octokit: Octokit,
  username: string
): Promise<number> {
  try {
    const { data } = await octokit.search.issuesAndPullRequests({
      q: `type:pr author:${username} is:merged`,
      per_page: 1,
    });
    return data.total_count;
  } catch {
    return 0;
  }
}

async function fetchContributions(
  graphqlWithAuth: typeof graphql,
  username: string
): Promise<ContributionCalendar> {
  try {
    const data = await graphqlWithAuth<{
      user: {
        contributionsCollection: {
          contributionCalendar: ContributionCalendar;
        };
      };
    }>(
      `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `,
      { username }
    );
    return data.user.contributionsCollection.contributionCalendar;
  } catch {
    return { totalContributions: 0, weeks: [] };
  }
}

function calculateCurrentStreak(calendar: ContributionCalendar): number {
  const days = calendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];

  for (const day of days) {
    if (day.date > today) continue;
    if (day.contributionCount > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateLongestStreak(calendar: ContributionCalendar): number {
  const days = calendar.weeks.flatMap((w) => w.contributionDays);
  let longest = 0;
  let current = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

export function getMockGitHubData(): GitHubData {
  const weeks = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 364);

  for (let w = 0; w < 53; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      days.push({
        contributionCount: Math.random() > 0.35 ? Math.floor(Math.random() * 12) : 0,
        date: date.toISOString().split("T")[0],
      });
    }
    weeks.push({ contributionDays: days });
  }

  return {
    user: {
      login: "johndoe",
      name: "John Doe",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      bio: "Full-Stack Developer | Open Source Enthusiast",
      location: "San Francisco, CA",
      html_url: "https://github.com/johndoe",
      public_repos: 48,
      followers: 512,
      following: 128,
      twitter_username: "johndoe",
      company: "@acme",
    },
    stats: {
      totalCommits: 1847,
      totalPRs: 94,
      totalIssues: 38,
      totalStars: 2341,
      currentStreak: 42,
      longestStreak: 87,
      totalRepos: 48,
      followers: 512,
    },
    languages: [
      { name: "TypeScript", percentage: 42, color: "#3178c6" },
      { name: "Python", percentage: 28, color: "#3572A5" },
      { name: "Go", percentage: 15, color: "#00ADD8" },
      { name: "Rust", percentage: 8, color: "#dea584" },
      { name: "Shell", percentage: 7, color: "#89e051" },
    ],
    topRepos: [
      {
        id: 1,
        name: "awesome-cli",
        full_name: "johndoe/awesome-cli",
        description: "A blazing fast CLI tool written in Go",
        html_url: "https://github.com/johndoe/awesome-cli",
        stargazers_count: 1204,
        forks_count: 89,
        language: "Go",
        topics: ["cli", "go", "tools"],
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "react-hooks-lib",
        full_name: "johndoe/react-hooks-lib",
        description: "Collection of useful React hooks",
        html_url: "https://github.com/johndoe/react-hooks-lib",
        stargazers_count: 876,
        forks_count: 64,
        language: "TypeScript",
        topics: ["react", "hooks", "typescript"],
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: "ml-toolkit",
        full_name: "johndoe/ml-toolkit",
        description: "Machine learning utilities and pipelines",
        html_url: "https://github.com/johndoe/ml-toolkit",
        stargazers_count: 261,
        forks_count: 31,
        language: "Python",
        topics: ["ml", "python", "data-science"],
        updated_at: new Date().toISOString(),
      },
    ],
    contributionCalendar: {
      totalContributions: 1847,
      weeks,
    },
    lastSynced: new Date().toISOString(),
  };
}
