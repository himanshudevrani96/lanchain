import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { useEffect } from "react";
import { API_KEY, SERP_API_KEY } from "./apikey";

export const Agents = () => {
  useEffect(() => {
    agents();
  }, []);

  const agents = async () => {
    try {
      const model = new OpenAI({ openAIApiKey: API_KEY, temperature: 0 });
      const tools = [
        new SerpAPI(
          SERP_API_KEY,
          {
            location: "Austin,Texas,United States",
            hl: "en",
            gl: "us",
          },
          "http://localhost:3001/serpapi"
        ),
        new Calculator(),
      ];

      const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "zero-shot-react-description",
        verbose: true,
      });

      const input = `Who is Olivia Wilde's boyfriend? What is his current age raised to the 0.23 power?`;

      const result = await executor.call({ input });
      console.log("agents", { result });
    } catch (err) {
      console.log(err);
    }
  };

  return <>jdsbkjf</>;
};
