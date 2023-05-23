import React, { useState } from "react";
// import {LangChain} from "langchain"

export const DevOpt = () => {
  const [data, setData] = useState([]);
  const [report, setReport] = useState({
    efficiency:"",
    strengths:[],
    weaknesses:[],
    areasForImprovement:[],
  });
  const [repository, setRepository] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const fetchData = async () => {
    const response = await fetch(
      `https://api.github.com/users/<YOUR_USERNAME>/repos?visibility=all`
    );
    const data = await response.json();
    setData(data);
  };

  const analyzeData = async () => {
    // const langChain = new LangChain();

    const commits = data.filter(
      (repo: any) => repo.name === repository
    ).flatMap((repo: any) => repo.commits);
    const linesOfCode = data.filter(
      (repo: any) => repo.name === repository
    ).flatMap((repo: any) => repo.linesOfCode);
    const pullRequests = data.filter(
      (repo: any) => repo.name === repository
    ).flatMap((repo: any) => repo.pullRequests);
    const stars = data.filter(
      (repo: any) => repo.name === repository
    ).flatMap((repo: any) => repo.stars);
    const forks = data.filter(
      (repo: any) => repo.name === repository
    ).flatMap((repo: any) => repo.forks);

    // const efficiency = langChain.analyze(commits, linesOfCode, pullRequests, stars, forks);
    // const strengths = langChain.identifyStrengths(efficiency);
    // const weaknesses = langChain.identifyWeaknesses(efficiency);
    // const areasForImprovement = langChain.identifyAreasForImprovement(efficiency);

    // setReport({
    //   efficiency,
    //   strengths,
    //   weaknesses,
    //   areasForImprovement,
    // });
  };

  const renderReport = () => {
    if (!report) {
      return null;
    }

    return (
      <div>
        <h1>Efficiency Report</h1>
        <h2>Overall Efficiency</h2>
        <p>{report?.efficiency}</p>
        <h2>Strengths</h2>
        <ul>
          {report.strengths.map((strength: any) => (
            <li key={strength}>{strength}</li>
          ))}
        </ul>
        <h2>Weaknesses</h2>
        <ul>
          {report.weaknesses.map((weakness: any) => (
            <li key={weakness}>{weakness}</li>
          ))}
        </ul>
        <h2>Areas for Improvement</h2>
        <ul>
          {report.areasForImprovement.map((areaForImprovement) => (
            <li key={areaForImprovement}>{areaForImprovement}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <select name="repository" onChange={(e) => setRepository(e.target.value)}>
        {data.map((repo: any) => (
          <option key={repo.name} value={repo.name}>{repo.name}</option>
        ))}
      </select>
      <input type="text" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={analyzeData}>Analyze Data</button>
      {renderReport()}
    </div>
  );
};