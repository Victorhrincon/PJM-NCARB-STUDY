export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
            content: `You are a Senior Architect and Commercial Strategist specializing in New Orleans. 
            Analyze the address/prompt. Return ONLY a JSON object.
            Required keys: district, max_height, yard_req, parking_exemptions, ibc_occupancy, strategic_play.
            Use technical depth similar to the New Orleans CZO (HU-MU rules) and IBC 2021.`
          },
          { role: "user", content: `Analyze this in ${mode} mode: ${prompt}` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const aiContent = JSON.parse(data.choices[0].message.content);
    
    res.status(200).json(aiContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
