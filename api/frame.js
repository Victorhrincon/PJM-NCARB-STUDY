import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    const { prompt } = JSON.parse(req.body);

    // 1. Create a Thread (a private conversation for this specific search)
    const thread = await openai.beta.threads.create();

    // 2. Send the address to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Analyze this address using the uploaded zoning PDFs: ${prompt}`
    });

    // 3. Run the Assistant (REPLACE 'asst_YOUR_ID' WITH YOUR ACTUAL ID)
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: "asst_YOUR_ID_HERE",
      instructions: "Return the results as a JSON object with these keys: district, max_height, parking_exemptions, ibc_occupancy, strategic_play. Ensure you cite specific sections from the PDF."
    });

    // 4. Retrieve the Assistant's expert answer
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const aiResponse = messages.data[0].content[0].text.value;
      
      // We parse the AI's text back into a format your website's tables can read
      const cleanJson = JSON.parse(aiResponse.replace(/```json|```/g, ''));
      res.status(200).json(cleanJson);
    } else {
      res.status(500).json({ error: "Assistant timeout" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
