'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요! **장르나침반 AI 가이드**입니다.\n궁금하신 플레이 성향이나 장르(예: "한 판에 30분만 머리 비우고 할 만한 게임", "피지컬 없이 전략만 쓰는 장르")를 자유롭게 질문해 주세요.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userPrompt = input.trim();
    if (userPrompt.length > 300) {
      alert('질문은 300자 이내로 입력해 주세요.');
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: userPrompt }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
      } else if (data.error) {
        setMessages([
          ...nextMessages,
          { role: 'assistant', content: `오류가 발생했습니다: ${data.error}` },
        ]);
      }
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: '죄송합니다. 서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    '퇴근 후 30분만 머리 비우고 할 게임 추천해줘',
    '피지컬 없이 순수 뇌지컬로 하는 장르',
    '소울라이크랑 메트로배니아 차이가 뭐야?',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-primary to-secondary text-black font-semibold px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
            aria-label="AI 가이드 챗봇 열기"
          >
            <Bot className="w-5 h-5 text-[#0b0f17]" />
            <span className="font-display text-sm tracking-tight hidden sm:inline">AI 장르 큐레이터</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] bg-[#0f131c] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-[#141924] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white">AI 장르 큐레이터</h3>
                <span className="text-[10px] font-mono text-gray-500">Gemini Powered</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-black font-medium rounded-br-xs'
                      : 'bg-[#141924] text-gray-200 border border-white/5 rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>답변을 생성하고 있습니다...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-[#0b0f17] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[#141924] border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="장르나 플레이 성향 질문... (300자 이내)"
              maxLength={300}
              className="flex-1 bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-primary text-black hover:bg-cyan-400 disabled:opacity-40 transition flex items-center justify-center"
              aria-label="보내기"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
