import { extractJSON } from "./format";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function callGroq(prompt, maxTokens=2000) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not found in .env");

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a WFH setup advisor for India. Output ONLY valid JSON. No markdown. No explanation. No code fences. Start with { and end with }."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(()=>"");
    throw new Error(`Groq API error ${response.status}: ${errBody.slice(0,120)}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(`Groq: ${data.error.message}`);
  const raw = data?.choices?.[0]?.message?.content || "";
  if (!raw) throw new Error("Empty response from Groq");
  return raw;
}

export async function callAI(answers) {
  const fmt = v => Array.isArray(v) ? v.join(", ") : String(v||"Not specified");
  const budget = Number(answers.budget) || 30000;
  const existing = fmt(answers.existing);
  const isFromScratch = existing.toLowerCase().includes("fresh start") || existing.toLowerCase().includes("nothing");

  const prompt = `You are SetupGenie, a WFH setup advisor for India. Output ONLY valid JSON. No markdown. No explanation. Start with { end with }.

USER:
Role: ${fmt(answers.role)}
Budget: Rs ${budget} total (do not exceed)
Hours/day: ${answers.hours||6}
${isFromScratch?"Fresh start — recommend everything needed":"Already has: "+existing+" — do NOT recommend these"}
Room: ${answers.room||"Medium"}
Lighting: ${answers.lighting||"Dim"}
Pain points: ${fmt(answers.pain)}
Priority: ${fmt(answers.priority)}
Vibe: ${answers.vibe||"Minimal"}
Special: ${fmt(answers.extras)}

Output this exact JSON structure:
{"headline":"Creative 5 word setup name","tagline":"One punchy line","summary":"2-3 sentences about this setup","totalEstimate":0,"budgetBreakdown":"e.g. 35% display, 30% seating","savingsNote":"What to do with leftover budget","setupScore":{"ergonomics":85,"productivity":85,"aesthetics":80,"value":90},"items":[{"categoryId":"display","category":"Display","categoryIcon":"🖥️","name":"Exact product name","price":0,"priority":"Must Have","why":"Why this for this user","solves":"Pain point solved","vibeNote":"How it matches vibe","amazonSearch":"search query","flipkartSearch":"search query","alternatives":[{"name":"Alternative product","price":0,"tradeoff":"What you gain or lose"}]}],"whatToSkip":"What to avoid buying","easyWins":"Free improvements today","proTips":["Tip 1","Tip 2","Tip 3"],"upgradeNext":"First upgrade when budget allows"}

Rules:
- 5 to 8 items covering: display, chair, keyboard+mouse, lighting, audio, connectivity
- Total of all prices MUST be under Rs ${budget}
- Skip categories user already owns: ${existing}
- Use real Indian 2025 products with real brand names
- Priority must be exactly: "Must Have" or "Highly Recommended" or "Nice to Have"`;

  const raw = await callGroq(prompt, 2000);
  const parsed = extractJSON(raw);
  if (!parsed) throw new Error(`Parse failed. Response: ${raw.slice(0,120)}`);
  if (!Array.isArray(parsed.items) || parsed.items.length === 0) throw new Error("No items in response");

  const total = parsed.items.reduce((s,i)=>s+(Number(i.price)||0), 0);
  if (total > budget * 1.05) {
    const factor = (budget * 0.95) / total;
    parsed.items = parsed.items.map(i=>({...i, price: Math.round((Number(i.price)||0)*factor/100)*100}));
  }

  parsed.items = parsed.items.map(i=>({
    categoryId:    i.categoryId    || "general",
    category:      i.category      || "Accessory",
    categoryIcon:  i.categoryIcon  || "📦",
    name:          i.name          || "Item",
    price:         Number(i.price) || 0,
    priority:      ["Must Have","Highly Recommended","Nice to Have"].includes(i.priority)
                     ? i.priority : "Highly Recommended",
    why:           i.why           || "",
    solves:        i.solves        || "",
    vibeNote:      i.vibeNote      || "",
    amazonSearch:  i.amazonSearch  || i.name || "",
    flipkartSearch:i.flipkartSearch|| i.name || "",
    alternatives:  Array.isArray(i.alternatives) ? i.alternatives : [],
  }));

  parsed.totalEstimate = parsed.items.reduce((s,i)=>s+i.price, 0);
  return parsed;
}