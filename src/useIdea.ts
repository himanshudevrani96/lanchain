// Bring in dependencies

import { OpenAI } from "langchain"; // gives us the OpenAI service to leverage a large language model
import { PromptTemplate, LLMChain } from "langchain";
import { API_KEY } from "./apikey";

export const useIdea = () => {

  const titleTemplate =
    "What are the absolute coolest, most mind-blowing, out of the box, ChatGPt prompts that will really show of the power of ChatGPT? Give me 5 ideas about {topic}"
  const scopeTemplate = "Create a scope of work for this idea Idea: {title}"

  const title_template = new PromptTemplate({
    template: titleTemplate,
    inputVariables: ["product"],
  })

  const scope_template = new PromptTemplate({
    template: scopeTemplate,
    inputVariables: ["title"],
  })

  const model = new OpenAI({ openAIApiKey: API_KEY, temperature: 0.9 });
  //seting up llm chains
  const chainForTitle = new LLMChain({ llm: model, prompt: title_template });
  const chainForScope = new LLMChain({ llm: model, prompt: scope_template });

  // Getting response
  const getTitleResponse = async (title: string) => {
    try {
      const reschainForTitle = await chainForTitle.call({
        product: title,
      });
      console.log({reschainForTitle});
      return "rsponse"
      
    } catch (err) {
        console.error(err);
        return ""
    }
  };

  const getScopeResponse = async (scope: string) => {
    try {
      const reschainForScope = await chainForScope.call({
        product: scope,
      });
      console.log({reschainForScope});
      return "rsponse"
      
    } catch (err) {
        console.error(err);
        return ""
    }
  };

  //   const sequential_chain = new SequentialChain({
  //     chains: [title_chain, scope_chain],
  //     input_variables: ["topic"],
  //     // Here we return multiple variables
  //     output_variables: ["title", "scope"],
  //     verbose: true,
  //   });

  return {
    getTitleResponse,
    getScopeResponse
  }
};
