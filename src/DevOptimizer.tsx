import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_KEY } from './apikey';
import * as openai from 'openai';

const DevOptimizer: React.FC = () => {
  const [commitFrequency, setCommitFrequency] = useState<number>(0);
  const [codeQuality, setCodeQuality] = useState<string>('');

  const accessToken = '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';
 

  useEffect(() => {
    const username = 'himanshudevrani96';
    const repo = 'langchain';
    const fileExtension = 'RFP.tsx'; // Specify the file extension of the code files you want to analyze
    const fetchCommits = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${username}/${repo}/commits`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const commits = response.data;
        const frequency: any = calculateCommitFrequency(commits, 30);
        setCommitFrequency(frequency);

        const latestCommit = commits[0];
        console.log({latestCommit});
        
        const code = await fetchCodeFromCommit(latestCommit.sha, fileExtension);
        console.log({code});
        
        const codeQuality = await analyzeCodeQuality(openai, API_KEY, code);
        setCodeQuality(codeQuality);
      } catch (error : any) {
        console.error('An error occurred:', error.message);
      }
    };

    const calculateCommitFrequency = (commits: any[], periodInDays: number) => {
      const commitCount = commits.length;
      const periodInMs = periodInDays * 24 * 60 * 60 * 1000;
      const firstCommitDate = new Date(commits[commitCount - 1].commit.author.date);
      const lastCommitDate = new Date(commits[0].commit.author.date);
      const durationInMs = lastCommitDate.getTime() - firstCommitDate.getTime();
      const frequency = commitCount / (durationInMs / periodInMs);

      return frequency.toFixed(2);
    };

    const fetchCodeFromCommit = async (commitSha: string, fileExtension: string) => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${username}/${repo}/git/trees/${commitSha}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        const tree = response.data.tree;
        const srcFolder = tree.find((entry: any) => entry.path === 'src');
        
        if (!srcFolder || srcFolder.type !== 'tree') {
          throw new Error('The "src" folder was not found in the commit.');
        }
    
        const srcFolderSha = srcFolder.sha;
        const srcFolderResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/git/trees/${srcFolderSha}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        const codeFile = srcFolderResponse.data.tree.find((file: any) => file.path.endsWith(fileExtension));
        if (codeFile) {
          const codeResponse = await axios.get(codeFile.url);
          const codeContent = atob(codeResponse.data.content);
          console.log(codeContent);
          
          return codeContent;
        } else {
          throw new Error(`Code file with extension '${fileExtension}' not found in the commit.`);
        }
      } catch (error: any) {
        console.error('An error occurred while fetching code:', error.message);
        throw error;
      }
    };
    
    
    

    const analyzeCodeQuality = async (openai: any , apiKey: string, code: string) => {
      try {
        // const openaiInstance = new openai.OpenAI(apiKey);
        console.log({code});
        
        const response = await openai?.complete({
          apiKey,
          engine: 'davinci-codex',
          prompt: `Evaluate the code quality:\n\`\`\`\n${code}\n\`\`\``,
          maxTokens: 100,
          temperature: 0.5,
          topP: 1,
          n: 1,
          stop: ['\n'],
        });
console.log(response.data.choices[0].text.trim());

        return response.data.choices[0].text.trim();
      } catch (error: any) {
        console.error('Error analyzing code quality:', error.message);
        throw error;
      }
    };

    fetchCommits();
  }, []);

  return (
    <div>
      <h2>Commit Frequency (last 30 days): {commitFrequency}</h2>
      <h2>Code Quality: {codeQuality}</h2>
    </div>
  );
};

export default DevOptimizer;