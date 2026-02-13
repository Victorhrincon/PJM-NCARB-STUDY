import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // 1. Tell Vercel to allow more time (Up to 60s on Hobby plan)
  export const config = { maxDuration: 60 }; 

  try {
    const { prompt } = JSON.parse(req.body);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use the fastest, smartest model
      messages: [
        {
          role: "system",
          content: `You are a Senior Architect. Analyze the technical feasibility for the provided address. 
          Focus on: District, Max Height, FAR, and Strategic Plays. 
          Be technical, concise, and professional.`
        },
        { role: "user", content: prompt }
      ],
    });

    res.status(200).json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
