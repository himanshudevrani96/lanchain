import { useState } from 'react';
import styled from 'styled-components';
import { OpenAI } from 'langchain';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain, SequentialChain } from 'langchain/chains';
import { API_KEY } from './apikey';

// Set OpenAI API key

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  height: 30px;
  font-size: 16px;
  padding: 5px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  font-size: 18px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: #3e8e41;
  }
`;

function RFPTemplate() {
  const [projectName, setProjectName] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [projectRequirements, setProjectRequirements] = useState('');

  // Create llm instance
  const llm = new OpenAI({openAIApiKey: API_KEY, temperature: 0.9 });

  // Create prompt templates
  const scopeTemplate = new PromptTemplate({
    inputVariables: ['projectName'],
    template: 'Create a scope of work for {projectName}:'
  });

  const budgetTemplate = new PromptTemplate({
    inputVariables: ['projectName', 'projectScope'],
    template: 'What is the budget for {projectName} project with {projectScope}?'
  });

  const deadlineTemplate = new PromptTemplate({
    inputVariables: ['projectName'],
    template: 'What is the deadline for {projectName} project?'
  });

  const requirementsTemplate = new PromptTemplate({
    inputVariables: ['projectName'],
    template: 'What are the requirements for {projectName} project?'
  });

  // Create llm chains
  const scopeChain = new LLMChain({
    llm,
    prompt: scopeTemplate,
    outputKey: 'projectScope',
    verbose: true
  });

  const budgetChain = new LLMChain({
    llm,
    prompt: budgetTemplate,
    outputKey: 'projectBudget',
    verbose: true
  });

  const deadlineChain = new LLMChain({
    llm,
    prompt: deadlineTemplate,
    outputKey: 'projectDeadline',
    verbose: true
  });

  const requirementsChain = new LLMChain({
    llm,
    prompt: requirementsTemplate,
    outputKey: 'projectRequirements',
    verbose: true
  });

  // Create sequential chain
  const sequentialChain = new SequentialChain({
    chains: [scopeChain, budgetChain, deadlineChain, requirementsChain],
    inputVariables: ['projectName'],
    outputVariables: ['projectScope', 'projectBudget', 'projectDeadline', 'projectRequirements'],
    verbose: true
  });

   // Handle form submission
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   const response = await  sequentialChain.call({ topic: projectName })
   console.log("response",{response});
   
  };

  return (
    <FormContainer>
      <h1>🦜🔗 Idea Creator</h1>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="prompt">Enter a topic for your RFP:</Label>
        <Input type="text" id="prompt" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        <Button type="submit">Create RFP</Button>
      </form>
      {projectName && (
        <div>
          <div>{projectBudget}</div>
          <div>{projectDeadline}</div>
          <div>{projectRequirements}</div>
        </div>
      )}
    </FormContainer>
  );
}

export default RFPTemplate
