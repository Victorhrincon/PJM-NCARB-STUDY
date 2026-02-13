import OpenAI from "openai";

// Set Vercel timeout to 60 seconds to allow time for PDF scanning
export const config = {
  maxDuration: 60,
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    const { prompt } = JSON.parse(req.body);

    // 1. Create a Thread
    const thread = await openai.beta.threads.create();

    // 2. Add the address to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Analyze the technical feasibility for: ${prompt}`
    });

    // 3. Run the Assistant (using your specific ID from the screenshot)
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: "asst_cvTmq7kmfAlV9icLbUJBrxhX", 
    });

    // 4. Get the response
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const aiResponse = messages.data[0].content[0].text.value;
      res.status(200).json({ analysis: aiResponse });
    } else {
      res.status(500).json({ error: "Assistant timeout or failure" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
