export default async function handler(req, res) {
  try {
    const { prompt, mode } = JSON.parse(req.body);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a Senior Architect. Return ONLY a JSON object with these EXACT keys: district, max_height, parking_exemptions, ibc_occupancy, strategic_play. Provide specific architectural data."
          },
          { role: "user", content: `Analyze: ${prompt} in ${mode} mode.` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();

    // SAFETY CHECK: This prevents the 'reading 0' error from your logs
    if (!data.choices || data.choices.length === 0) {
      console.error("OpenAI Error Response:", data);
      return res.status(200).json({ 
        district: "Check API Key/Credits", 
        max_height: "Error", 
        parking_exemptions: "Error", 
        ibc_occupancy: "Error", 
        strategic_play: "OpenAI account might be empty." 
      });
    }

    const aiContent = JSON.parse(data.choices[0].message.content);
    res.status(200).json(aiContent);
  } catch (error) {
    console.error("CRASH ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
}
