import React, { useState } from "react";
import { OpenAI } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";

// Set OpenAI API key
import styled from "styled-components";
import { API_KEY } from "./apikey";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;
export const FormLabel = styled.label`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #f8f8f8;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 80%;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  label {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: none;
    font-size: 1rem;
    margin-bottom: 1rem;
    resize: none;
  }

  textarea {
    height: 10rem;
  }

  button[type="submit"] {
    background-color: #0077ff;
    color: #fff;
    font-size: 1.1rem;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #0052cc;
    }
  }
`;
export const FormButton = styled.button`
  padding: 10px 20px;
  background-color: #008cba;
  color: white;
  border: none;
  cursor: pointer;
`;
export const FormInput = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
`;

const RfpForm = () => {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [scope, setScope] = useState("");
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState("");

  // Create llm instance
  const llm = new OpenAI({ openAIApiKey: API_KEY, temperature: 0.9 });

  // Create prompt templates
  const titleTemplate = new PromptTemplate({
    inputVariables: ["topic"],
    template:
      "What are the absolute coolest, most mind-blowing, out of the box, ChatGPT prompts that will really show off the power of ChatGPT? Give me 5 ideas about {topic}",
  });

  const scopeTemplate = new PromptTemplate({
    inputVariables: ["title"],
    template: "Create a scope of work for this idea: {title}",
  });

  const requirementsTemplate = new PromptTemplate({
    inputVariables: ["title"],
    template: "Create a requirements for this idea: {title}",
  });

  // Create llm chains
  const titleChain = new LLMChain({
    llm,
    prompt: titleTemplate,
    outputKey: "title",
  });

  const scopeChain = new LLMChain({
    llm,
    prompt: scopeTemplate,
    outputKey: "scope",
  });

  const requirementsChain = new LLMChain({
    llm,
    prompt: requirementsTemplate,
    outputKey: "requirements",
  });

  // Create sequential chain
  const sequentialChain = new SequentialChain({
    chains: [titleChain, scopeChain],
    inputVariables: ["topic"],
    outputVariables: ["title", "scope"],
  });

  // Handle form submission
  const handleSubmit = async(e: any) => {
    try {
      if (!prompt) {
        setError("Please enter a prompt")
        return
      }
      // const response = await sequentialChain.call({ topic: prompt })
      // console.log({ response })
      // setTitle(response.title)
      // setScope(response.scope)
      // setRequirements(response.requirements)
      sequentialChain.call({ topic: prompt }).then((response)=>{
      console.log({ response })
      setTitle(response.title)
      setScope(response.scope)
      setRequirements(response.requirements)
      })
    } catch (err) {
      console.error("handleSubmit",error)
      setError("An error occurred");
    }
  };

  return (
    <FormContainer>
      <FormLabel htmlFor="prompt">Enter your prompt:</FormLabel>
      <FormInput
        type="text"
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      {error && <p>{error}</p>}
      <FormButton type="submit" onClick={() => handleSubmit(prompt)}>
        Submit
      </FormButton>
      {title && <h2>{title}</h2>}
      {scope && <p>{scope}</p>}
      {requirements && <p>{requirements}</p>}
    </FormContainer>
  );
};

export default RfpForm;
