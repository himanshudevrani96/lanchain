import axios from "axios";
import { LLMChain, OpenAI, PromptTemplate } from "langchain";
import { SequentialChain } from "langchain/chains";
import React, { useEffect, useState } from "react";
import { API_KEY } from "./apikey";

const DevOptimizer: React.FC = () => {
  const [commitFrequency, setCommitFrequency] = useState<number>(0);
  const [codeQuality, setCodeQuality] = useState<string>("");

  const accessToken = "token";

  useEffect(() => {
    const username = "himanshudevrani96";
    const repo = "langchain";
    const fileExtension = "RFP.tsx"; // Specify the file extension of the code files you want to analyze
    const fetchCommits = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/commits`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const commits = response.data;
        const frequency: any = calculateCommitFrequency(commits, 30);
        setCommitFrequency(frequency);

        const latestCommit = commits[0];
        console.log({ latestCommit });

        const code = await fetchCodeFromCommit(latestCommit.sha, fileExtension);
        console.log({ code });

        const codeQuality = await analyzeCodeQuality(API_KEY, code);
        setCodeQuality(codeQuality);
      } catch (error: any) {
        console.error("An error occurred:", error.message);
      }
    };

    const calculateCommitFrequency = (commits: any[], periodInDays: number) => {
      const commitCount = commits.length;
      const periodInMs = periodInDays * 24 * 60 * 60 * 1000;
      const firstCommitDate = new Date(
        commits[commitCount - 1].commit.author.date
      );
      const lastCommitDate = new Date(commits[0].commit.author.date);
      const durationInMs = lastCommitDate.getTime() - firstCommitDate.getTime();
      const frequency = commitCount / (durationInMs / periodInMs);

      return frequency.toFixed(2);
    };

    const fetchCodeFromCommit = async (
      commitSha: string,
      fileExtension: string
    ) => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/git/trees/${commitSha}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const tree = response.data.tree;
        const srcFolder = tree.find((entry: any) => entry.path === "src");

        if (!srcFolder || srcFolder.type !== "tree") {
          throw new Error('The "src" folder was not found in the commit.');
        }

        const srcFolderSha = srcFolder.sha;
        const srcFolderResponse = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/git/trees/${srcFolderSha}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const codeFile = srcFolderResponse.data.tree.find((file: any) =>
          file.path.endsWith(fileExtension)
        );
        if (codeFile) {
          const codeResponse = await axios.get(codeFile.url);
          const codeContent = atob(codeResponse.data.content);
          console.log(codeContent);

          return codeContent;
        } else {
          throw new Error(
            `Code file with extension '${fileExtension}' not found in the commit.`
          );
        }
      } catch (error: any) {
        console.error("An error occurred while fetching code:", error.message);
        throw error;
      }
    };

    const analyzeCodeQuality = async (apiKey: string, code: string) => {
      try {
        // const openaiInstance = new openai.OpenAI(apiKey);
        console.log({ code });
        const llm = new OpenAI({ openAIApiKey: API_KEY, temperature: 0.9 });
        const template = new PromptTemplate({
          inputVariables: ["code"],
          template: "Evaluate the code quality:\n```\n${code}\n```",
        });
        const codeChain = new LLMChain({
          llm,
          prompt: template,
          outputKey: "review",
        });
        // const response = await openai?.complete({
        //   apiKey,
        //   engine: 'davinci-codex',
        //   prompt: `Evaluate the code quality:\n\`\`\`\n${code}\n\`\`\``,
        //   maxTokens: 100,
        //   temperature: 0.5,
        //   topP: 1,
        //   n: 1,
        //   stop: ['\n'],
        // });
        const sequentialChain = new SequentialChain({
          chains: [codeChain],
          inputVariables: ["code"],
          outputVariables: ["review"],
        });
        const response = await sequentialChain.call({ code: code });

        console.log(response.review);

        return response.review;
      } catch (error: any) {
        console.error("Error analyzing code quality:", error.message);
        throw error;
      }
    };

    fetchCommits();
  }, []);

  const analyzeCodeQuality = (commits: any[]): string => {
    // Perform code quality analysis based on commits
    // You can implement your own code quality analysis logic here
    // For example, you can analyze code complexity, adherence to best practices, or code style consistency
    // Return a code quality assessment or rating
  
    // Custom code quality analysis logic
    const totalCommits = commits.length;
    const codeQualityRating = totalCommits > 100 ? 'High' : 'Low';
  
    return codeQualityRating;
  };
  
  const calculatePullRequestReviews = (commits: any[]): number => {
    // Perform calculation for pull request reviews based on commits
    // You can analyze the number of pull request reviews made by the developer
    // For example, you can count the number of pull request events related to the developer's commits
    // Return the number of pull request reviews
  
    // Custom calculation for pull request reviews
    let pullRequestReviews = 0;
    commits.forEach((commit: any) => {
      const pullRequests = commit.pull_requests;
      if (pullRequests && pullRequests.length > 0) {
        pullRequestReviews += pullRequests.length;
      }
    });
  
    return pullRequestReviews;
  };
  
  const calculateIssueResolution = (commits: any[]): number => {
    // Perform calculation for issue resolution based on commits
    // You can analyze the number of issues closed by the developer
    // For example, you can count the number of issue events related to the developer's commits
    // Return the number of issue resolutions
  
    // Custom calculation for issue resolution
    let issueResolutionCount = 0;
    commits.forEach((commit: any) => {
      const issuesClosed = commit.issues_closed;
      if (issuesClosed && issuesClosed.length > 0) {
        issueResolutionCount += issuesClosed.length;
      }
    });
  
    return issueResolutionCount;
  };

  const calculateFeatureImplementation = (commits: any[]): number => {
    // Perform calculation for feature implementation based on commits
    // You can analyze the number of features implemented by the developer
    // For example, you can count the number of commits that reference a feature or user story
    // Return the number of feature implementations
  
    // Custom calculation for feature implementation
    let featureImplementationCount = 0;
    commits.forEach((commit: any) => {
      // Check if commit message references a feature or user story
      if (commit.message.includes('feature') || commit.message.includes('user story')) {
        featureImplementationCount++;
      }
    });
  
    return featureImplementationCount;
  };
  
  const checkDocumentation = (commits: any[]): boolean => {
    // Check if the developer has made documentation-related commits
    // You can analyze the commit messages or specific files related to documentation
    // Return true if documentation commits are found, otherwise false
  
    // Custom logic to check documentation commits
    const documentationCommits = commits.filter((commit: any) => {
      // Check if commit message or file paths indicate documentation changes
      return (
        commit.message.includes('docs') || // Commit message includes 'docs'
        commit.files.some((file: any) => file.path.includes('docs')) // Files include 'docs' in their paths
      );
    });
  
    return documentationCommits.length > 0;
  };
  
  const calculateOpenSourceContributions = (commits: any[]): number => {
    // Perform calculation for open-source contributions based on commits
    // You can analyze the number of commits made to open-source projects
    // Return the number of open-source contributions
  
    // Custom calculation for open-source contributions
    let openSourceContributionCount = 0;
    commits.forEach((commit: any) => {
      // Check if commit is made to an open-source project
      if (commit.repository && commit.repository.is_open_source) {
        openSourceContributionCount++;
      }
    });
  
    return openSourceContributionCount;
  };
  
  const calculateCodeReviews = (commits: any[]): number => {
    // Perform calculation for code reviews based on commits
    // You can analyze the number of code reviews conducted by the developer
    // For example, you can count the number of code review-related comments in commit messages
    // Return the number of code reviews
  
    // Custom calculation for code reviews
    let codeReviewCount = 0;
    commits.forEach((commit: any) => {
      // Check if commit message indicates a code review
      if (commit.message.includes('code review')) {
        codeReviewCount++;
      }
    });
  
    return codeReviewCount;
  };
  
  

  return (
    <div>
      <h2>Commit Frequency (last 30 days): {commitFrequency}</h2>
      <h2>Code Quality: {codeQuality}</h2>
    </div>
  );
};

export default DevOptimizer;
