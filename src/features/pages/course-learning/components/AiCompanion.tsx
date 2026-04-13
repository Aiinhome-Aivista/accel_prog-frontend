import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';

export const AiCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, bot: boolean}[]>([
    { text: "Hi! Ask me anything about this week's content.", bot: true }
  ]);
  const [inp, setInp] = useState('');

  const sendMsg = () => {
    if (!inp.trim()) return;
    const txt = inp.trim();
    setMessages(prev => [...prev, { text: txt, bot: false }]);
    setInp('');

    setTimeout(() => {
      const responses = [
        'The RACE framework helps structure prompts: Role, Action, Context, Expectation.',
        'CoT works by forcing step-by-step reasoning, reducing logical errors.',
        'Few-shot examples teach the model patterns through input→output pairs.',
        'System prompts set persistent constraints for the entire conversation.',
        'Try combining CoT with few-shot for maximum effectiveness.'
      ];
      const botRes = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: botRes, bot: true }]);
    }, 600);
  };

  return (
    <>
      <div 
        className="fixed bottom-4 right-4 w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#E87A2E] to-[#D06A20] text-white flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(232,122,46,0.35)] z-40 transition-transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot size={20} />
      </div>

      {isOpen && (
        <div className="fixed bottom-[4.5rem] right-4 w-[calc(100vw-2rem)] md:w-[310px] max-h-[400px] std-card shadow-[0_8px_24px_rgba(43,45,66,0.08)] z-40 flex flex-col overflow-hidden">
          <div className="px-3 py-2 bg-[#1A1B2E] text-white flex items-center justify-between">
            <h4 className="std-section-title text-white text-[0.76rem] m-0">AI Learning Companion</h4>
            <button className="bg-transparent border-none text-white/60 cursor-pointer pointer-events-auto" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 max-h-[260px]">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`chat-bubble ${
                  m.bot 
                    ? 'chat-bubble-bot' 
                    : 'chat-bubble-user'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 p-2 bg-white border-t border-[#E5DDD4]">
            <input 
              type="text" 
              value={inp}
              onChange={e => setInp(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Ask..."
              className="flex-1 px-2 py-1 border border-[#E5DDD4] rounded-[6px] text-[0.74rem] bg-[#F9F5F0] focus:outline-none focus:border-[#E87A2E] focus:bg-white"
            />
            <button 
              onClick={sendMsg}
              className="btn-std-primary px-2 py-1 text-[0.68rem]"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};
