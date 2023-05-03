import "./App.css";
import { OpenAI } from "langchain/llms/openai";
import { useEffect } from "react";

function App() {

  const openAi = async () => {
    try {
      const model = new OpenAI({
        openAIApiKey: "YOUR_API_KEY",
        temperature: 0.2,
      });
      const res = await model.call(
        "What would be a good company name a company that makes colorful socks?"
      )
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // openAi()
  }, [])

  return <div>app</div>;
}

export default App;
