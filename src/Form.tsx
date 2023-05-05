import React, { useState } from "react";
import styled from "styled-components";
import { useIdea } from "./useIdea";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 500px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #008cba;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 100%;
`;

const ResultBox = styled.div`
  padding: 10px;
  background-color: #f1f1f1;
  margin-bottom: 10px;
  height: 200px;
`;

interface FormProps {
  onSubmit: (input1: string, input2: string) => void;
}

const Form: React.FC<any> = () => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [title, setTitleResponse] = useState<string>("")
  const [scope, setScopeResponse] = useState<string>("")

  const {getTitleResponse, getScopeResponse} = useIdea()

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(input1){
        const titleResponse = await getTitleResponse(input1)
        setTitleResponse(titleResponse)
    }
    if(input2){
        const scopeResponse = await getScopeResponse(input2)
        setScopeResponse(scopeResponse)
    }
  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="text"
            placeholder="Enter title"
            value={input1}
            onChange={(e: any) => setInput1(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter scope"
            value={input2}
            onChange={(e: any) => setInput2(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </InputContainer>
        <ResultContainer>
          <ResultBox>{title}</ResultBox>
          <ResultBox>{scope}</ResultBox>
        </ResultContainer>
      </FormContainer>
    </Container>
  );
};

export default Form;
