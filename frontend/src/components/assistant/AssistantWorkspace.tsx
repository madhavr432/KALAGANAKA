import React, { useState, useRef, useEffect } from "react";
import {
  fetchAssistantChat,
  checkBackendHealth,
  type AssistantChatResponse,
  AstronomyApiError,
} from "@/services/astronomy-api";
import {
  Sparkles,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Bot,
  User,
  HelpCircle,
  Globe,
  BookOpen,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  model?: string;
  provider?: string;
  fallbackUsed?: boolean;
}

const SUGGESTED_QUESTIONS = [
  {
    q: "What is the difference between Sayana and Nirayana in Indian astronomy?",
    label: "Sayana vs Nirayana (सायण बनाम निरयण)",
  },
  {
    q: "Why does Ayanamsha cancel out identically when calculating a Tithi?",
    label: "Tithi Ayanamsha Invariance (तिथि अयनांश अलोप)",
  },
  {
    q: "How does the Konark Sun Temple Chakra measure time down to minutes using 30 stone beads?",
    label: "Konark Wheel Timekeeping (कोणार्क चक्र काल-गणना)",
  },
  {
    q: "Explain the difference between Purnimanta and Amanta lunar month conventions.",
    label: "Purnimanta vs Amanta (पूर्णिमान्त एवं अमान्त)",
  },
  {
    q: "Why does Makara Sankranti not coincide with the physical Winter Solstice today?",
    label: "Makara Sankranti & Solstice (मकर सङ्क्रान्ति अयन)",
  },
  {
    q: "What are the 7 repeating mobile Karanas and 4 fixed stationary Karanas in Panchanga?",
    label: "60 Karanas Structure (६० करण वर्गीकरण)",
  },
];

export function AssistantWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "नमस्ते! Welcome to KalaGanaka's Astronomical Assistant. You can ask me questions about traditional Indian astronomy (Siddhanta Jyotisha), Sanskrit mathematical traditions, Panchang calculations, or the Konark Sun Temple Chakra in English or हिन्दी (Hindi). How may I assist your exploration of time?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      model: "KalaGanaka Engine",
      provider: "Assistant Core",
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<"auto" | "english" | "hindi">("auto");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    checkBackendHealth().then(setIsBackendOnline);
  }, []);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsLoading(true);
    setBackendError(null);

    try {
      const res: AssistantChatResponse = await fetchAssistantChat({
        question: q,
        language: selectedLanguage,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: res.model,
        provider: res.provider,
        fallbackUsed: res.fallback_used,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsBackendOnline(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unable to reach KalaGanaka Assistant.";
      setBackendError(errMsg);

      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: "assistant",
        text: `Error connecting to Assistant: ${errMsg}. Please ensure that the FastAPI backend is running and valid AI credentials (such as OPENROUTER_API_KEY, GEMINI_API_KEY, or XAI_API_KEY) are configured in backend/.env.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Title Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold-soft">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span>Feature 6 • काल-संवाद सहायक (Educational Astronomy AI Assistant)</span>
        </div>
        <h1 className="font-deva text-4xl text-gold-gradient drop-shadow-gold sm:text-5xl lg:text-6xl">
          काल-संवाद सहायक
        </h1>
        <h2 className="font-serif text-xl text-gold-soft sm:text-2xl">
          Ask KalaGanaka — Bilingual AI Astronomy Assistant
        </h2>
        <p className="max-w-3xl font-sans text-sm text-muted-foreground leading-relaxed">
          Ask educational and astronomical questions about Indian astronomy, mathematical
          traditions, Panchang algorithms, or observational geometry in English and हिन्दी.
        </p>
      </div>

      {/* Backend Status Alert */}
      {isBackendOnline === false && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <strong className="font-semibold text-amber-300">Backend API Notice:</strong>{" "}
            {backendError || "Offline"}
            <p className="mt-0.5 text-muted-foreground">
              Run &lsquo;python -m uvicorn app.main:app --port 8000&rsquo; in backend/ to enable
              live AI responses.
            </p>
          </div>
        </div>
      )}

      {isBackendOnline === true && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>KalaGanaka AI Assistant Online • Multi-Provider Fallback Active</span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">
            127.0.0.1:8000/assistant/chat
          </span>
        </div>
      )}

      {/* Suggested Questions Bar */}
      <div className="rounded-xl border border-gold/20 bg-background/80 p-4 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-gold font-semibold mb-3">
          <HelpCircle className="h-4 w-4" />
          <span>सुझाए गए प्रश्न (Suggested Astronomy Questions):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(item.q)}
              className="rounded-full border border-gold/25 bg-gold/5 px-3 py-1.5 text-left text-xs text-gold-soft hover:bg-gold/15 hover:text-gold hover:border-gold/40 transition-colors disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Workspace Container */}
      <div className="flex flex-col h-[560px] rounded-2xl border border-gold/25 bg-background/85 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-full border border-gold/30 bg-gold/10 grid place-items-center shrink-0 text-gold">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? "bg-gold/15 border border-gold/30 text-gold-light"
                      : "bg-background/90 border border-gold/20 text-foreground"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  <div className="mt-2 flex items-center justify-between gap-4 border-t border-gold/10 pt-2 text-[10px] text-muted-foreground font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.provider && (
                      <span className="text-gold-soft/70">
                        {msg.provider} ({msg.model})
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="h-8 w-8 rounded-full border border-gold/30 bg-gold/20 grid place-items-center shrink-0 text-gold">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full border border-gold/30 bg-gold/10 grid place-items-center shrink-0 text-gold">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl border border-gold/20 bg-background/90 p-4 text-xs text-gold-soft flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-gold" />
                <span>KalaGanaka AI is consulting traditional & ephemeris sources...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input & Controls Bar */}
        <div className="border-t border-gold/20 bg-background/95 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 mb-2 text-xs">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-gold-soft" />
              <span className="text-muted-foreground text-[11px]">Language:</span>
              <div className="flex gap-1">
                {(["auto", "english", "hindi"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`rounded px-2 py-0.5 text-[10px] font-sans transition-colors ${
                      selectedLanguage === lang
                        ? "bg-gold/20 text-gold font-bold border border-gold/30"
                        : "text-muted-foreground hover:text-gold-soft"
                    }`}
                  >
                    {lang === "auto" ? "Auto / मिश्रित" : lang === "english" ? "English" : "हिन्दी"}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              Press Enter to send, Shift + Enter for new line
            </span>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask an astronomical or historical question (e.g. 'What is the role of Ayanamsha in Panchang?')..."
              className="flex-1 rounded-xl border border-gold/25 bg-background/70 p-3 text-xs text-gold-light placeholder:text-muted-foreground focus:border-gold focus:outline-none resize-none"
            />
            <button
              type="button"
              disabled={isLoading || !inputQuestion.trim()}
              onClick={() => handleSend()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient text-slate-950 font-bold shadow-md hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
