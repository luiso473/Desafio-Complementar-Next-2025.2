import OpenAI from "openai";

const systemMessage = `
Você é um assistente virtual especializado em suporte técnico e navegação de um site de psicologia.
Você só deve responder perguntas relacionadas ao site e suporte técnico. 
Se a pergunta estiver fora do tema, informe isso educadamente.
O tom é formal, porém leve.
`;

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ reply: "Nenhuma mensagem recebida." });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
    });

    return Response.json({
      reply: completion.output_text,
    });

  } catch (err) {
    console.error("Erro no /api/chat:", err);
    return Response.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
