import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Globe2,
  User,
  Info,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { sendAssistantChat } from '../services/api';
import { useToast } from '../components/Toast';

export default function AssistantPage() {
  const { addToast } = useToast();
  const messagesEndRef = useRef(null);

  const [language, setLanguage] = useState('en'); // 'en' or 'kn'
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Namaskara! I am AgriMitra AI, your autonomous crop health assistant. Ask me questions about leaf diseases, weather recovery, organic bio-control practices, or soil health in English or Kannada.',
      sources: ['ICAR Agronomic Compendium'],
      timestamp: 'Just now'
    }
  ]);

  const quickQuestionsEn = [
    'Why are my tomato leaves turning yellow?',
    'How can I prevent fungal diseases after rain?',
    'What should I do after heavy rainfall?',
    'How can I improve soil health naturally?',
    'How do I protect my crops during hot weather?'
  ];

  const quickQuestionsKn = [
    'ಟೊಮೆಟೊ ಎಲೆಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಲು ಕಾರಣವೇನು?',
    'ಮಳೆಯ ನಂತರ ಬೆಳೆಗಳಿಗೆ ಶಿಲೀಂಧ್ರ ರೋಗ ತಡೆಯುವುದು ಹೇಗೆ?',
    'ಭಾರೀ ಮಳೆಯ ನಂತರ ಹೊಲದಲ್ಲಿ ಏನು ಮಾಡಬೇಕು?',
    'ಮಣ್ಣಿನ ಫಲವತ್ತತೆಯನ್ನು ಸಾವಯವವಾಗಿ ಹೆಚ್ಚಿಸುವುದು ಹೇಗೆ?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await sendAssistantChat(text.trim(), language);
      const botMsg = {
        sender: 'assistant',
        text: response.reply,
        sources: response.sources || ['ICAR Agricultural Knowledge Compendium'],
        is_simulated: response.is_simulated,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      addToast('Assistant could not respond. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSwitch = (newLang) => {
    setLanguage(newLang);
    const greeting =
      newLang === 'kn'
        ? 'ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಮಿತ್ರ ಕೃಷಿ AI ಸಹಾಯಕ. ಬೆಳೆ ರೋಗ, ಹವಾಮಾನ ನಿರ್ವಹಣೆ ಅಥವಾ ಸಾವಯವ ಪರಿಹಾರಗಳ ಕುರಿತು ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.'
        : 'Welcome! I am AgriMitra AI. Ask me any farming questions about crop health, weather impacts, or soil management in English.';

    setMessages((prev) => [
      ...prev,
      {
        sender: 'assistant',
        text: greeting,
        sources: ['ICAR-IIHR ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 shrink-0">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold mb-1">
            <BotMessageSquare className="w-3.5 h-3.5" />
            Agronomic Decision Support Chat
          </div>
          <h1 className="text-2xl font-black text-forest-900 tracking-tight">
            Agricultural AI Assistant
          </h1>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => handleLanguageSwitch('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              language === 'en'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English (EN)
          </button>
          <button
            onClick={() => handleLanguageSwitch('kn')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              language === 'kn'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ಕನ್ನಡ (KN)
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Informational Advisory:</strong> Suggestions are grounded in agricultural research compendiums and do not replace local agronomic officer inspections.
          </span>
        </div>
      </div>

      {/* Messages Chat Box */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm overflow-y-auto space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-forest-800 text-white' : 'bg-emerald-100 text-forest-900'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-forest-800 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                    <BookOpen className="w-3 h-3 text-amber-600" />
                    <span>References: {msg.sources.join(', ')}</span>
                  </div>
                )}

                <span
                  className={`text-[9px] block text-right pt-0.5 ${
                    isUser ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-forest-900 flex items-center justify-center">
              <BotMessageSquare className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest-600 animate-ping" />
              AgriMitra AI is analyzing agricultural compendiums...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 shrink-0">
        {(language === 'kn' ? quickQuestionsKn : quickQuestionsEn).map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white hover:bg-forest-50 text-slate-700 hover:text-forest-900 border border-slate-200 transition shadow-sm"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Chat Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            language === 'kn'
              ? 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
              : 'Ask any crop health or agronomic question...'
          }
          className="flex-1 px-4 py-2 text-sm focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="p-3 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-40 text-white transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
