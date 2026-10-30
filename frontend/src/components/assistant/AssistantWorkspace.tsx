import React, { useEffect, useRef, useState } from "react";
import {
  fetchAssistantChat,
  checkBackendHealth,
  type AssistantChatResponse,
} from "@/services/astronomy-api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  BookOpen,
  Bot,
  CheckCircle,
  Globe,
  HelpCircle,
  MessageSquare,
  Mic,
  MicOff,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  User,
  Volume2,
} from "lucide-react";

type VoiceLanguage = "auto" | "english" | "hindi";
type VoiceState =
  "idle" | "listening" | "processing" | "permission-denied" | "unsupported" | "error";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  model?: string;
  provider?: string;
  fallbackUsed?: boolean;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string; confidence?: number }>>;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

const WELCOME_MESSAGE =
  "नमस्ते! Welcome to KalaGanaka's Astronomical Assistant. You can ask me questions about traditional Indian astronomy (Siddhanta Jyotisha), Sanskrit mathematical traditions, Panchang calculations, or the Konark Sun Temple Chakra in English or हिन्दी (Hindi). How may I assist your exploration of time?";

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

const FAQ_ITEMS = [
  {
    question: "What is KalaGanaka?",
    answer:
      "KalaGanaka is an educational platform for exploring traditional Indian astronomy, Sanskrit mathematical ideas, Panchang concepts, and comparisons with modern astronomical calculations. It is designed for learning and interpretation rather than replacing a professional astronomical service.",
  },
  {
    question: "What is a Panchang?",
    answer:
      "A Panchang is a daily almanac built from five traditional limbs: Tithi (lunar day), Vara (weekday), Nakshatra (lunar mansion), Yoga (combined solar-lunar condition), and Karana (half-tithi subdivision). These are used to structure timekeeping and ritual timing in traditional Indian calendars.",
  },
  {
    question: "What is Tithi, and how is it calculated?",
    answer:
      "Tithi is the lunar phase as measured by the angular separation between the Sun and Moon. In traditional practice, a Tithi is often treated as a roughly 12-degree interval of elongation, but the exact result depends on the chosen calculation method and astronomical inputs. Different schools or software may therefore calculate the same moment slightly differently.",
  },
  {
    question: "What is the difference between Sayana and Nirayana?",
    answer:
      "Sayana refers to tropical longitudes measured relative to the moving equinox, while Nirayana refers to sidereal longitudes relative to a fixed reference frame. The difference between them is often expressed using an ayanamsha, which is not a universal constant and may vary by convention or tradition.",
  },
  {
    question: "What is Ayanamsha?",
    answer:
      "Ayanamsha describes the angular offset between tropical and sidereal longitude systems. It is used to convert between reference frameworks when comparing traditional and modern astronomical positions, but different conventions and historical values can produce different numerical amounts.",
  },
  {
    question: "What are Nakshatras?",
    answer:
      "Nakshatras are the traditional 27 lunar mansions used in Indian astronomy and timekeeping. They divide the sidereal zodiac into a set of sectors with symbolic and calendrical significance. Traditional interpretation is not the same thing as measuring the exact physical position of a modern ephemeris object.",
  },
  {
    question: "What are Tithi, Nakshatra, Yoga, and Karana used for in Panchang?",
    answer:
      "Tithi marks the lunar phase, Nakshatra identifies the star-based lunar segment, Yoga measures the combined solar and lunar longitude, and Karana subdivides the lunar day. Together, they organize the Panchang into a practical framework for ritual timing, daily observance, and astronomical interpretation.",
  },
  {
    question: "What is the difference between Amanta and Purnimanta lunar months?",
    answer:
      "In the Amanta convention, a lunar month ends at the new moon, while in the Purnimanta convention it ends at the full moon. Different regional traditions prefer one or the other, so the same festival may be labeled or dated differently depending on the calendar system used.",
  },
  {
    question: "How does the Samrat Yantra work?",
    answer:
      "The Samrat Yantra is a large sundial that uses the Sun's shadow and the geometry of a gnomon to indicate apparent solar time. It is an instrument for reading solar shadows and local sun position; it does not directly measure ecliptic longitude in the way a modern ephemeris does.",
  },
  {
    question: "What is the Konark Sun Temple Chakra's relationship to timekeeping?",
    answer:
      "The Konark Sun Temple's giant wheel is popularly associated with timekeeping because its carved spokes and geometry resemble a calendrical or solar instrument. Historically and interpretively, it may symbolize time, light, and seasonal cycles; however, any claim that it directly measures astronomical quantities must be distinguished from independently verified measurement accuracy.",
  },
  {
    question: "How does traditional Indian astronomy differ from modern ephemeris calculations?",
    answer:
      "Traditional Indian astronomy uses symbolic, geometrical, and historical frameworks, often with sidereal reference systems and different conventions. Modern ephemerides use precise models of solar and planetary motion, usually expressed in tropical coordinates and tied to a defined reference frame. Differences are meaningful only when the same inputs and conventions are being compared.",
  },
  {
    question: "Can KalaGanaka calculate today's Panchang or planetary positions?",
    answer:
      "Yes, when the required date, location, timezone, and a functioning backend are available, the project can calculate Panchang information and compare traditional/modern values. The backend must be running and the relevant location/time inputs must be provided; a raw answer is not produced without that context.",
  },
  {
    question: "How does KalaGanaka compare traditional and modern calculations?",
    answer:
      "The project compares traditional calculation methods with modern astronomical data by using a common date/time and a consistent reference framework where possible. It can show differences in longitude or reasoning, but it does not claim universal accuracy or make unsupported numerical assertions.",
  },
  {
    question: "Can I ask questions in Hindi or English?",
    answer:
      "Yes. The assistant supports bilingual interaction, and the language selector lets you choose auto, English, or Hindi mode. In practice, the browser and backend can handle mixed-language questions, but the response remains guided by the selected language and the model's interpretation of the request.",
  },
];

export function AssistantWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      model: "KalaGanaka Engine",
      provider: "Assistant Core",
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>("auto");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [lastFailedQuestion, setLastFailedQuestion] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState<string>("");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceStatus, setVoiceStatus] = useState<string>("Voice input is ready.");
  const [voiceLanguage, setVoiceLanguage] = useState<VoiceLanguage>("auto");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    checkBackendHealth().then(setIsBackendOnline);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Silent cleanup: ignore browser-specific stop errors during unmount.
        }
      }
    };
  }, []);

  const stopVoiceRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setVoiceState("idle");
      setVoiceStatus("Voice input is ready.");
      return;
    }

    try {
      recognition.stop();
    } catch {
      // Ignore stop errors, then clear the local listener.
    }
    recognitionRef.current = null;
    setVoiceState("idle");
    setVoiceStatus("Voice input stopped.");
  };

  const getVoiceRecognitionLanguage = (lang: VoiceLanguage): string => {
    if (lang === "hindi") return "hi-IN";
    if (lang === "english") return "en-IN";
    return selectedLanguage === "hindi" ? "hi-IN" : "en-IN";
  };

  const startVoiceInput = () => {
    if (voiceState === "listening" || voiceState === "processing") {
      stopVoiceRecognition();
      return;
    }

    const recognitionConstructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!recognitionConstructor) {
      setVoiceState("unsupported");
      setVoiceStatus(
        "Voice input is unavailable in this browser. You can still type your question.",
      );
      return;
    }

    const recognition = new recognitionConstructor();
    recognitionRef.current = recognition;
    recognition.lang = getVoiceRecognitionLanguage(voiceLanguage);
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState("listening");
      setVoiceStatus("Listening for your question…");
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result) continue;
        const text = Array.from(result)
          .map((candidate) => candidate.transcript)
          .join(" ");
        transcript += `${text} `;
      }

      const cleaned = transcript.trim();
      if (!cleaned) return;

      const latestResult = event.results[event.results.length - 1] as
        | (ArrayLike<{ transcript: string; confidence?: number }> & { isFinal?: boolean })
        | undefined;

      if (latestResult?.isFinal) {
        setVoiceState("processing");
        setVoiceStatus("Transcript captured. Review the text and send when ready.");
      }

      setInputQuestion(cleaned);
    };

    recognition.onerror = (event: { error: string }) => {
      const errorType = event?.error ?? "unknown";
      if (errorType === "not-allowed" || errorType === "service-not-allowed") {
        setVoiceState("permission-denied");
        setVoiceStatus("Microphone permission was denied. Please allow access to use voice input.");
      } else {
        setVoiceState("error");
        setVoiceStatus(
          `Speech recognition error: ${errorType}. Please try again or type your question.`,
        );
      }
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setVoiceState((current) =>
        current === "listening" || current === "processing" ? "idle" : current,
      );
      setVoiceStatus((current) =>
        current === "Listening for your question…" ||
        current === "Transcript captured. Review the text and send when ready."
          ? "Voice input is ready."
          : current,
      );
    };

    try {
      recognition.start();
    } catch {
      setVoiceState("error");
      setVoiceStatus(
        "A recognition session is already active. Please stop the current recording and try again.",
      );
      recognitionRef.current = null;
    }
  };

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
    setLastFailedQuestion(null);
    stopVoiceRecognition();

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
      setLastFailedQuestion(q);

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

  const handleClearChat = () => {
    if (
      messages.length > 1 &&
      !window.confirm("Discard the current conversation and start a new one?")
    ) {
      return;
    }

    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text: WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: "KalaGanaka Engine",
        provider: "Assistant Core",
      },
    ]);
    setInputQuestion("");
    setBackendError(null);
    setLastFailedQuestion(null);
    stopVoiceRecognition();
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const query = faqSearch.trim().toLowerCase();
    if (!query) return true;
    return item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
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

      {isBackendOnline === false && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div className="flex-1">
            <strong className="font-semibold text-amber-300">Backend API Notice:</strong>{" "}
            {backendError || "Offline"}
            <p className="mt-0.5 text-muted-foreground">
              Run &lsquo;python -m uvicorn app.main:app --port 8000&rsquo; in backend/ to enable
              live AI responses.
            </p>
            {lastFailedQuestion && (
              <button
                type="button"
                onClick={() => handleSend(lastFailedQuestion)}
                className="mt-2 inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-200 transition hover:bg-amber-500/20"
              >
                <RefreshCw className="h-3 w-3" />
                Retry last question
              </button>
            )}
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

      <div className="flex flex-col h-[560px] rounded-2xl border border-gold/25 bg-background/85 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-gold/20 bg-background/95 px-4 py-3 text-[11px] text-gold-soft">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Conversation</span>
          </div>
          <button
            type="button"
            onClick={handleClearChat}
            className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition hover:border-gold/40 hover:text-gold-soft"
            aria-label="Clear the current conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear chat
          </button>
        </div>

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
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-medium text-[10px] uppercase tracking-[0.14em] text-gold-soft/80">
                      {isUser ? "You" : "AI explanation"}
                    </span>
                    {msg.fallbackUsed !== undefined && msg.fallbackUsed && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] text-amber-200">
                        Fallback response
                      </span>
                    )}
                  </div>
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

        <div className="border-t border-gold/20 bg-background/95 p-3 sm:p-4">
          <div className="mb-2 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
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
                    aria-pressed={selectedLanguage === lang}
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
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gold/20 bg-background/70 px-2 py-1.5">
                <button
                  type="button"
                  onClick={startVoiceInput}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                    voiceState === "listening"
                      ? "border-rose-500/40 bg-rose-500/15 text-rose-200"
                      : voiceState === "permission-denied" ||
                          voiceState === "unsupported" ||
                          voiceState === "error"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                        : "border-gold/25 bg-gold/5 text-gold-soft hover:border-gold/40 hover:text-gold"
                  }`}
                  aria-label={
                    voiceState === "listening" ? "Stop voice recording" : "Start voice input"
                  }
                  aria-pressed={voiceState === "listening"}
                >
                  {voiceState === "listening" ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>

                <div className="flex items-center gap-1">
                  {(["auto", "english", "hindi"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setVoiceLanguage(lang)}
                      className={`rounded px-2 py-0.5 text-[10px] transition-colors ${
                        voiceLanguage === lang
                          ? "bg-gold/20 text-gold font-bold border border-gold/30"
                          : "text-muted-foreground hover:text-gold-soft"
                      }`}
                      aria-label={`Use ${lang === "auto" ? "automatic" : lang === "english" ? "English" : "Hindi"} voice recognition`}
                    >
                      {lang === "auto" ? "Auto" : lang === "english" ? "EN" : "हिं"}
                    </button>
                  ))}
                </div>

                <div className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Volume2 className="h-3.5 w-3.5 text-gold-soft" />
                  <span>
                    {voiceState === "listening"
                      ? "Listening"
                      : voiceState === "processing"
                        ? "Processing"
                        : voiceState === "unsupported"
                          ? "Unsupported"
                          : voiceState === "permission-denied"
                            ? "Permission denied"
                            : voiceState === "error"
                              ? "Recognition error"
                              : "Idle"}
                  </span>
                </div>
              </div>

              <div className="min-h-8 rounded-lg border border-gold/15 bg-background/70 px-2 py-1.5 text-[10px] text-muted-foreground">
                {voiceStatus}
              </div>
            </div>

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

          <textarea
            rows={2}
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Question input"
            placeholder="Ask an astronomical or historical question (e.g. 'What is the role of Ayanamsha in Panchang?')..."
            className="mt-3 w-full rounded-xl border border-gold/25 bg-background/70 p-3 text-xs text-gold-light placeholder:text-muted-foreground focus:border-gold focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gold/20 bg-background/80 p-4 shadow-lg backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gold-soft">
          <BookOpen className="h-4 w-4" />
          <span>Educational FAQ</span>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gold/20 bg-background/70 px-3 py-2">
          <Search className="h-4 w-4 text-gold-soft" />
          <input
            type="search"
            value={faqSearch}
            onChange={(event) => setFaqSearch(event.target.value)}
            placeholder="Search FAQs by keyword"
            aria-label="Search FAQ"
            className="w-full bg-transparent text-xs text-gold-light placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {filteredFaqs.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="rounded-xl border border-gold/15 bg-background/70 px-3"
            >
              <AccordionTrigger className="text-left text-sm text-gold-soft hover:text-gold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                <div className="space-y-2 pb-2">
                  <p>{item.answer}</p>
                  <button
                    type="button"
                    onClick={() => handleSend(item.question)}
                    className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-2.5 py-1 text-[10px] font-medium text-gold-soft transition hover:border-gold/40 hover:text-gold"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Ask in chat
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredFaqs.length === 0 && (
          <div className="rounded-xl border border-dashed border-gold/20 bg-background/60 px-3 py-4 text-center text-xs text-muted-foreground">
            No FAQs match your search term.
          </div>
        )}
      </div>
    </div>
  );
}
