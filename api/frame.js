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
            content: "You are a Senior Architect. Return ONLY a JSON object with these EXACT keys: district, max_height, parking_exemptions, ibc_occupancy, strategic_play. Do not include any other text."
          },
          { role: "user", content: `Analyze: ${prompt} in ${mode} mode.` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    res.status(200).json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
