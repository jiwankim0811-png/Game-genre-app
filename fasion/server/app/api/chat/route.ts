import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, OUT_OF_SCOPE_REFUSAL } from '@/lib/gemini';
import { ChatMessage } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: '메시지를 입력해 주세요.' }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.content.length > 300) {
      return NextResponse.json({
        reply: '질문이 너무 깁니다. 300자 이내로 입력해 주세요.'
      });
    }

    const reply = await generateChatResponse(messages);
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { reply: OUT_OF_SCOPE_REFUSAL },
      { status: 200 }
    );
  }
}
