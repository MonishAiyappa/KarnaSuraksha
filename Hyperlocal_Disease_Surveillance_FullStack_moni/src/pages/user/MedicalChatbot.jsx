import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Send,
  Loader2,
  ShieldCheck,
  Trash2,
  MessageSquareText,
  HeartPulse,
  Stethoscope,
  PlusSquare,
  Lightbulb,
  Syringe,
  Sparkles,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "../../api";

import heroRight from "../../assets/ui/medical-hero-right.png";
import robot from "../../assets/ui/medical-robot.png";
import doctor from "../../assets/ui/medical-doctor.png";
import botAvatar from "../../assets/ui/medical-bot.png";

const QUICK_QUESTIONS = [
  "How to prevent dengue?",
  "What causes headache?",
  "Tips for a healthy lifestyle",
  "Is fever always a sign of infection?",
];

const MOBILE_QUICK_CARDS = [
  {
    icon: ShieldCheck,
    title: "How to prevent dengue?",
  },
  {
    icon: PlusSquare,
    title: "What causes headache?",
  },
  {
    icon: Lightbulb,
    title: "Tips for a healthy lifestyle",
  },
  {
    icon: Syringe,
    title: "Is fever always a sign of infection?",
  },
];

const CATEGORY_TABS = [
  {
    label: "Precautions",
    icon: ShieldCheck,
    query: "What precautions should I take to prevent common infections?",
  },
  {
    label: "Diseases",
    icon: Stethoscope,
    query: "What are the common symptoms of infectious diseases?",
  },
  {
    label: "General Health",
    icon: HeartPulse,
    query: "Give me some practical tips for daily health and wellness.",
  },
];

function MedicalMarkdown({ content }) {
  return (
    <div className="break-words text-[13px] leading-[1.75] text-[#111820]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-2.5 ml-5 list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2.5 ml-5 list-decimal space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-[#102A43]">{children}</strong>
          ),
          h1: ({ children }) => (
            <h1 className="mb-2 mt-1 text-[18px] font-bold text-[#102A43]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-3 text-[16px] font-bold text-[#102A43]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-3 text-[14px] font-bold text-[#087A32]">
              {children}
            </h3>
          ),
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}

export default function MedicalChatbot({ username, selectedLocation }) {
  const displayUsername = String(username || "").trim() || "User";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Precautions");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const clearChat = () => {
    if (loading) return;
    setMessages([]);
    setInput("");
  };

  const sendMessage = async (value = input) => {
    const message = String(value || "").trim();

    if (!message || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await api.medicalChat({
        message,
        conversation: updatedMessages,
        location: selectedLocation || null,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            response?.response ||
            response?.message ||
            response?.answer ||
            "I couldn't generate a response right now.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error?.message ||
            "I'm currently unable to connect to the medical assistant. Please try again shortly.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <section className="relative min-h-[calc(100vh-56px)] w-full bg-white text-[#101A31]">
      {/* =========================================================
          MOBILE VIEW (< md)
          Follows the user-provided mobile reference design
          ========================================================= */}
      <div className="block md:hidden">
        {hasMessages ? (
          /* Active Chat Thread in Mobile */
          <div className="flex flex-col min-h-[calc(100dvh-130px)]">
            <div className="flex items-center justify-between border-b border-[#E5EBE7] pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#E5F5E9]">
                  <img
                    src={botAvatar}
                    alt=""
                    className="h-[28px] w-[28px] object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-[#102A43]">
                    Medical Assistant
                  </h2>
                  <p className="text-[10px] text-[#758496]">AI Health Guidance</p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearChat}
                disabled={loading}
                className="flex items-center gap-1 rounded-[8px] border border-[#DDE5E0] bg-white px-2.5 py-1.5 text-[10.5px] font-medium text-[#617182] hover:bg-[#F8FAF9]"
              >
                <Trash2 size={13} strokeWidth={1.8} />
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-3">
              {messages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={`${message.time}-${index}`}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-[12.5px] ${
                        isUser
                          ? "rounded-br-[4px] bg-[#087A32] text-white"
                          : "rounded-bl-[4px] border border-[#E0E9E3] bg-[#F8FBF9] text-[#111820]"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap break-words leading-[1.5]">
                          {message.content}
                        </p>
                      ) : (
                        <MedicalMarkdown content={message.content} />
                      )}
                      <div
                        className={`mt-1 text-[9px] ${
                          isUser ? "text-white/70" : "text-[#8A98A8]"
                        }`}
                      >
                        {message.time}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-[14px] rounded-bl-[4px] border border-[#E0E9E3] bg-[#F8FBF9] px-3.5 py-2.5 text-[11px] text-[#718096]">
                    <Loader2 size={14} className="animate-spin text-[#087A32]" />
                    Medical Assistant is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="pt-2 border-t border-[#E5EBE7]">
              <div className="flex items-center gap-2 rounded-[14px] border border-[#55BE79] bg-white px-3 py-1.5 shadow-[0_1px_4px_rgba(16,42,67,0.04)]">
                <Bot
                  size={18}
                  className="text-[#087A32] shrink-0"
                  strokeWidth={1.8}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your medical question here..."
                  className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#91A1B2]"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#9ED8B4] text-white transition hover:bg-[#087A32] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={14} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State strictly matching the user-uploaded image */
          <div className="space-y-3 pb-6">
            {/* 1. Header Banner */}
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#ECF8F1] via-[#E6F6EE] to-[#DBF3E5] p-4 border border-[#DCF1E3]">
              <div className="relative z-10 max-w-[62%]">
                <h1 className="text-[17px] font-bold text-[#111827] leading-tight">
                  Hello {displayUsername}! 👋
                </h1>
                <h2 className="mt-0.5 text-[17px] font-bold text-[#087A32] leading-tight">
                  I'm your Medical Assistant
                </h2>
                <p className="mt-2 text-[11.5px] leading-[1.45] text-[#4B5563]">
                  Ask my medical related issues and get reliable information and guidance.
                </p>
              </div>

              {/* Robot with floating pluses */}
              <img
                src={heroRight}
                alt=""
                className="pointer-events-none absolute -bottom-1 -right-3 h-[148px] w-[46%] object-contain object-right-bottom"
              />
            </div>

            {/* 2. Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.label;
                return (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => {
                      setActiveCategory(tab.label);
                      sendMessage(tab.query);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11.5px] font-medium shrink-0 transition ${
                      isActive
                        ? "border-[#BCE4CA] bg-[#EAF7EE] text-[#087A32] shadow-[0_1px_2px_rgba(8,122,50,0.08)] font-semibold"
                        : "border-[#E5EBE7] bg-white text-[#1E3A8A]"
                    }`}
                  >
                    <Icon size={14} strokeWidth={isActive ? 2 : 1.8} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Center Ask Card */}
            <div className="rounded-[20px] border border-[#E2EBE5] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              {/* Bot Avatar + Sparkles */}
              <div className="relative mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#EBF8F0]">
                <Sparkles
                  size={12}
                  className="absolute -left-2.5 top-1.5 text-[#A3DCB9]"
                />
                <Sparkles
                  size={10}
                  className="absolute -right-2.5 top-2.5 text-[#A3DCB9]"
                />
                <img
                  src={botAvatar}
                  alt=""
                  className="h-[40px] w-[40px] object-contain"
                />
              </div>

              <h2 className="mt-2 text-center text-[16px] font-bold text-[#111827]">
                Ask any medical related issues
              </h2>

              <p className="mx-auto mt-1 max-w-[270px] text-center text-[11.5px] leading-[1.45] text-[#4B5563]">
                Get information about symptoms, precautions, diseases, healthy habits and general wellness.
              </p>

              {/* 2x2 Question Grid */}
              <div className="mt-3.5 grid grid-cols-2 gap-2">
                {MOBILE_QUICK_CARDS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => sendMessage(item.title)}
                      className="flex items-center gap-2 rounded-[12px] border border-[#E5EBE6] bg-white p-2.5 text-left transition hover:bg-[#F7FAF8]"
                    >
                      <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#EAF8EF] text-[#087A32]">
                        <Icon size={16} strokeWidth={1.9} />
                      </span>
                      <span className="text-[11.5px] font-medium text-[#1F2937] leading-[1.25]">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Input Box */}
              <div className="mt-3.5 flex items-center gap-2 rounded-[14px] border border-[#55BE79] bg-white px-3 py-1.5 shadow-[0_1px_4px_rgba(16,42,67,0.04)]">
                <Bot
                  size={17}
                  className="shrink-0 text-[#087A32]"
                  strokeWidth={1.8}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your medical question here..."
                  className="min-w-0 flex-1 bg-transparent text-[12px] text-[#102A43] outline-none placeholder:text-[#91A1B2]"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#9ED8B4] text-white transition hover:bg-[#087A32] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send
                      size={14}
                      strokeWidth={2}
                      className="translate-x-[0.5px]"
                    />
                  )}
                </button>
              </div>

              <p className="mt-2 px-1 text-center text-[10px] text-[#8C98A4] leading-tight">
                Please note: I provide general information only and not a diagnosis or medical advice.
              </p>
            </div>

            {/* 4. Bottom Health Priority Card */}
            <div className="flex items-center gap-3 rounded-[18px] border border-[#DCF1E3] bg-[#EDF8F1] p-3">
              <img
                src={doctor}
                alt="Doctor"
                className="h-[80px] w-auto shrink-0 object-contain"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-[13.5px] font-bold text-[#087A32] leading-tight">
                  Your health, our priority
                </h3>
                <p className="mt-1 text-[11px] leading-[1.4] text-[#374151]">
                  I'm here to help you with reliable information and guidance for a healthier you and your family.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          ORIGINAL LAPTOP / DESKTOP VIEW (>= md)
          100% UNTOUCHED ORIGINAL CODE PRESERVED FOR LAPTOP
          ========================================================= */}
      <div className="hidden md:block">
        {/* HERO */}
        <div className="relative mx-auto h-[218px] max-w-[1250px] overflow-hidden rounded-[16px] bg-[#F4FBF6]">
          <img
            src={heroRight}
            alt=""
            className="absolute inset-y-0 right-0 h-full w-[62%] object-cover object-left"
          />

          {/* ROBOT */}
          <div className="absolute left-[18px] top-[12px] h-[190px] w-[148px] overflow-hidden rounded-[11px] bg-white/80">
            <img
              src={robot}
              alt="Medical assistant robot"
              className="h-full w-full object-contain object-bottom"
            />
          </div>

          {/* HERO TEXT */}
          <div className="absolute left-[183px] top-[36px] z-10">
            <h1 className="text-[25px] font-semibold tracking-[-0.02em] text-[#101A31]">
              Hello {displayUsername}! 👋
            </h1>

            <h2 className="mt-[5px] text-[24px] font-semibold text-[#078445]">
              I’m your Medical Assistant
            </h2>

            <p className="mt-[8px] text-[13px] leading-[1.65] text-[#13202A]">
              Ask any medical related issues and get reliable
              <br />
              information and guidance.
            </p>
          </div>

          {/* HERO TABS */}
          <div className="absolute bottom-[-1px] left-[42px] z-20 flex gap-[12px]">
            {[
              ["Precautions", ShieldCheck],
              ["Diseases", Stethoscope],
              ["General Health", HeartPulse],
            ].map(([label, Icon], index) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(QUICK_QUESTIONS[index])}
                className={`flex h-[37px] items-center gap-2 rounded-t-[18px] border border-b-0 border-[#DDE6E0] bg-white px-[18px] text-[13px] font-medium ${
                  index === 0 ? "text-[#078445]" : "text-[#174D9A]"
                }`}
              >
                <Icon size={17} strokeWidth={1.7} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {!hasMessages && (
          <div className="mx-auto mt-[32px] grid max-w-[1250px] grid-cols-[minmax(0,1fr)_280px] gap-[28px]">
            {/* MAIN CARD */}
            <section className="relative min-h-[554px] rounded-[17px] border border-[#E3E8E5] bg-white px-[40px] pt-[36px] shadow-[0_1px_4px_rgba(16,42,67,0.02)]">
              <div className="mx-auto flex max-w-[730px] flex-col items-center text-center">
                <div className="flex h-[63px] w-[63px] items-center justify-center overflow-hidden rounded-full bg-[#EAF8EF]">
                  <img
                    src={botAvatar}
                    alt=""
                    className="h-[53px] w-[53px] object-contain"
                  />
                </div>

                <h2 className="mt-[18px] text-[24px] font-medium tracking-[-0.02em] text-[#101A31]">
                  Ask any medical related issues
                </h2>

                <p className="mt-[10px] max-w-[620px] text-[15px] leading-[1.65] text-[#4C5B6C]">
                  Get information about symptoms, precautions, diseases,
                  <br />
                  healthy habits and general wellness.
                </p>

                {/* QUICK QUESTIONS */}
                <div className="mt-[32px] grid w-full max-w-[640px] grid-cols-2 gap-[14px]">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="flex min-h-[58px] items-center gap-[12px] rounded-[13px] border border-[#DDE8E1] bg-white px-[16px] text-left text-[13px] font-medium text-[#38516B] transition hover:border-[#A9D6B9] hover:bg-[#F7FCF8]"
                    >
                      <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#EDF8F0] text-[#087A32]">
                        <MessageSquareText size={15} strokeWidth={1.8} />
                      </span>
                      <span>{question}</span>
                    </button>
                  ))}
                </div>

                {/* INPUT */}
                <div className="mt-[30px] flex w-full max-w-[640px] items-center gap-[10px] rounded-[14px] border border-[#55BE79] bg-white px-[10px] py-[7px] shadow-[0_1px_5px_rgba(16,42,67,0.04)]">
                  <Bot
                    size={19}
                    strokeWidth={1.8}
                    className="ml-[5px] shrink-0 text-[#087A32]"
                  />
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your medical question here..."
                    className="min-w-0 flex-1 bg-transparent px-[4px] py-[10px] text-[13px] text-[#102A43] outline-none placeholder:text-[#91A1B2]"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full bg-[#9ED8B4] text-white transition hover:bg-[#087A32] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={19} className="animate-spin" />
                    ) : (
                      <Send size={19} strokeWidth={1.8} />
                    )}
                  </button>
                </div>

                <p className="mt-[18px] text-[10px] text-[#8A98A8]">
                  Please note: I provide general information only and not a
                  diagnosis or medical advice.
                </p>
              </div>
            </section>

            {/* RIGHT INFORMATION PANEL */}
            <aside className="flex flex-col gap-[20px]">
              <div className="flex justify-center overflow-hidden rounded-[17px] bg-[#F8FCF9]">
                <img
                  src={doctor}
                  alt="Medical guidance"
                  className="h-[285px] w-full object-contain"
                />
              </div>

              <div className="rounded-[17px] bg-[#F1FAF4] px-[25px] py-[22px] text-center">
                <div className="mx-auto flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#E0F3E6] text-[#087A32]">
                  <ShieldCheck size={18} strokeWidth={1.8} />
                </div>

                <h3 className="mt-[11px] text-[13px] font-semibold text-[#087A32]">
                  Your health, our priority
                </h3>

                <p className="mt-[9px] text-[11px] leading-[1.7] text-[#506273]">
                  I'm here to help you with reliable information and guidance
                  for a healthier you and your family.
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* CHAT STATE */}
        {hasMessages && (
          <div className="mx-auto mt-[32px] max-w-[1250px]">
            <section className="overflow-hidden rounded-[17px] border border-[#E3E8E5] bg-white shadow-[0_1px_4px_rgba(16,42,67,0.02)]">
              {/* CHAT HEADER */}
              <div className="flex items-center justify-between border-b border-[#E5EBE7] bg-[#F8FCF9] px-[24px] py-[16px]">
                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#E5F5E9]">
                    <img
                      src={botAvatar}
                      alt=""
                      className="h-[34px] w-[34px] object-contain"
                    />
                  </div>

                  <div>
                    <h2 className="text-[15px] font-semibold text-[#102A43]">
                      Medical Assistant
                    </h2>
                    <p className="mt-[2px] text-[10px] text-[#758496]">
                      General medical information and supportive guidance
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearChat}
                  disabled={loading}
                  className="flex items-center gap-[6px] rounded-[9px] border border-[#DDE5E0] bg-white px-[11px] py-[8px] text-[10px] font-medium text-[#617182] hover:bg-[#F8FAF9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={14} strokeWidth={1.7} />
                  Clear Chat
                </button>
              </div>

              {/* CHAT MESSAGES */}
              <div className="min-h-[480px] max-h-[560px] overflow-y-auto px-[28px] py-[25px]">
                <div className="mx-auto max-w-[850px] space-y-[18px]">
                  {messages.map((message, index) => {
                    const isUser = message.role === "user";

                    return (
                      <div
                        key={`${message.time}-${index}`}
                        className={`flex ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] ${
                            isUser
                              ? "rounded-[16px] rounded-br-[5px] bg-[#087A32] px-[17px] py-[12px] text-white"
                              : "rounded-[16px] rounded-bl-[5px] border border-[#E0E9E3] bg-[#F8FBF9] px-[17px] py-[12px]"
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap break-words text-[13px] leading-[1.65]">
                              {message.content}
                            </p>
                          ) : (
                            <MedicalMarkdown content={message.content} />
                          )}

                          <div
                            className={`mt-[6px] text-[9px] ${
                              isUser ? "text-white/70" : "text-[#8A98A8]"
                            }`}
                          >
                            {message.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-[9px] rounded-[16px] rounded-bl-[5px] border border-[#E0E9E3] bg-[#F8FBF9] px-[17px] py-[13px] text-[11px] text-[#718096]">
                        <Loader2
                          size={15}
                          className="animate-spin text-[#087A32]"
                        />
                        Medical Assistant is thinking...
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* CHAT INPUT */}
              <div className="border-t border-[#E5EBE7] bg-white px-[24px] py-[18px]">
                <div className="mx-auto flex max-w-[850px] items-center gap-[9px] rounded-[14px] border border-[#55BE79] bg-white px-[10px] py-[6px]">
                  <Bot size={18} className="ml-[5px] shrink-0 text-[#087A32]" />
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your medical question here..."
                    disabled={loading}
                    className="min-w-0 flex-1 bg-transparent px-[4px] py-[10px] text-[13px] outline-none placeholder:text-[#91A1B2]"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-full bg-[#9ED8B4] text-white transition hover:bg-[#087A32] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} strokeWidth={1.8} />
                    )}
                  </button>
                </div>

                <div className="mx-auto mt-[9px] flex max-w-[850px] items-center justify-center gap-[5px] text-center text-[9px] text-[#8A98A8]">
                  <ShieldCheck size={11} strokeWidth={1.7} />
                  General information only. Not a diagnosis or medical advice.
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
