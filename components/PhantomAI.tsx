
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

const PhantomAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Welcome, seeker. I am the Phantom Oracle. How may I guide your style journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
      setMessages(prev => [...prev,
      { role: 'user', content: userMsg },
      { role: 'model', content: "The Oracle's power is missing (API Key not found). Please ensure your Vercel Environment Variables are set." }
      ]);
      setInput('');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are the 'Phantom Oracle', a mysterious and cool fashion consultant for 'Phantom Wears'. Your tone is poetic, cryptic but helpful, and sophisticated. You help users choose dark, techwear, or avant-garde outfits. Keep responses concise and atmospheric.",
        },
      });

      const aiText = response.text || "The shadows are silent. Try again later.";
      setMessages(prev => [...prev, { role: 'model', content: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Connection to the void lost. The shadows are restless..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-[#0a0a0a] border border-zinc-800 w-80 h-96 flex flex-col rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
            <span className="font-cinzel text-zinc-300 tracking-widest text-sm uppercase">Phantom Oracle</span>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-[11px] leading-relaxed ${m.role === 'user'
                  ? 'bg-zinc-800 text-zinc-200 rounded-br-none'
                  : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 rounded-bl-none'
                  }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 text-zinc-500 p-2 rounded-lg text-[10px] animate-pulse">
                  Oracle is deciphering...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask the Oracle..."
                className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-black border border-white/10 hover:border-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-110 shadow-2xl group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-50"></div>
          <svg viewBox="0 0 100 100" className="h-8 w-8 text-white relative z-10 fill-current group-hover:rotate-12 transition-transform duration-500">
            <path d="M50 10L10 50L50 90L90 50L50 10ZM50 25L75 50L50 75L25 50L50 25Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PhantomAI;
