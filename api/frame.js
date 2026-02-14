import OpenAI from "openai";

export const config = { maxDuration: 60 };

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
  // DO NOT add the 'project:' line here anymore. 
  // The new key you just made will find it automatically.
});

export default async function handler(req, res) {
  try {
    const { prompt } = JSON.parse(req.body);
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Analyze zoning for: ${prompt}`
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: "asst_cvTmq7kmfAlV9icLbUJBrxhX", // Your Assistant ID
    });

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      res.status(200).json({ analysis: messages.data[0].content[0].text.value });
    } else {
      res.status(500).json({ error: "Run failed: " + run.status });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
