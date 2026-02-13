import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    const { prompt } = JSON.parse(req.body);

    // 1. Create a Thread for this unique user session
    const thread = await openai.beta.threads.create();

    // 2. Add the address to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Analyze the technical feasibility for: ${prompt}`
    });

    // 3. Run the Assistant using your specific ID
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: "asst_cvTmq7kmfAlV9icLbUJBrxhX", 
    });

    // 4. Get the response from the Assistant
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const aiResponse = messages.data[0].content[0].text.value;
      
      // Send the professional analysis back to your dashboard
      res.status(200).json({ analysis: aiResponse });
    } else {
      res.status(500).json({ error: "Assistant did not complete in time." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
