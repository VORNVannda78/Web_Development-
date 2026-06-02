import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ChevronDown, Headphones, AlertTriangle } from "lucide-react";

const PINK = "#D70F64";

interface Message {
  id: number;
  from: "user" | "support";
  text: string;
  time: string;
}

const getTime = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const QUICK_REPLIES = [
  "My order is late 🕐",
  "Wrong item received 🍽️",
  "Rider can't find me 📍",
  "I want to cancel 🚫",
  "Payment issue 💳",
];

const BOT_RESPONSES: Record<string, string> = {
  "My order is late 🕐": "I understand that's frustrating! Let me check your order status right away. Your order #ORD-2026-001 is currently with your rider Dara — ETA is about 5 more minutes. 🏍️",
  "Wrong item received 🍽️": "Oh no, I'm sorry to hear that! Please keep the incorrect item and take a photo. We'll issue a full refund or send the correct item within 20 minutes. 📸",
  "Rider can't find me 📍": "Please share your live location with your rider. You can also call Dara directly from the Tracking page. If the issue persists, we'll have a supervisor call you back! 📞",
  "I want to cancel 🚫": "I can help with that. If the restaurant hasn't started cooking yet, we can cancel for a full refund. Let me check — please hold for a moment... ⏳",
  "Payment issue 💳": "For payment issues, please ensure your bank account has sufficient balance. If you were charged but didn't receive your order, we'll reverse the charge within 24 hours. 💰",
};

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "support",
      text: "👋 Hi! I'm Maya from EatZone Support. How can I help you today?",
      time: getTime(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); setUnread(0); }
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: text.trim(), time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const replyText = BOT_RESPONSES[text] ??
      "Thank you for reaching out! One of our agents will assist you shortly. In the meantime, you can also call us at +855 23 123 456. 🙏";

    setTimeout(() => {
      setTyping(false);
      const botMsg: Message = { id: Date.now() + 1, from: "support", text: replyText, time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
      if (!open) setUnread((u) => u + 1);
    }, 1200 + Math.random() * 800);
  };

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[9998] flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: 320,
            height: minimized ? 56 : 460,
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            transition: "height 0.3s ease",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${PINK} 0%, #ff5ca0 100%)` }}>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm">EatZone Support</div>
              <div className="text-white/70 text-xs">● Online now</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(!minimized)} className="p-1 rounded hover:bg-white/20 transition-colors">
                <ChevronDown className="w-4 h-4 text-white transition-transform"
                  style={{ transform: minimized ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20 transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Dispute banner */}
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border-b border-amber-100 flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-xs text-amber-700 font-semibold">Report order issue</span>
                <button className="ml-auto text-xs font-bold underline" style={{ color: PINK }}>Dispute</button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.from === "support" && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 mr-1.5 mt-auto"
                        style={{ backgroundColor: PINK }}>M</div>
                    )}
                    <div>
                      <div className={`max-w-52 text-xs leading-relaxed px-3 py-2 rounded-2xl ${
                        msg.from === "user"
                          ? "text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                        }`}
                        style={msg.from === "user" ? { backgroundColor: PINK } : {}}>
                        {msg.text}
                      </div>
                      <div className={`text-gray-300 mt-0.5 text-xs ${msg.from === "user" ? "text-right" : ""}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: PINK }}>M</div>
                    <div className="bg-white rounded-2xl px-3 py-2 shadow-sm flex gap-1">
                      {[0,1,2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              <div className="px-3 py-2 flex gap-1.5 overflow-x-auto no-scrollbar bg-gray-50 border-t border-gray-100 flex-shrink-0">
                {QUICK_REPLIES.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="flex-shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-full border-2 bg-white transition-colors hover:bg-pink-50 whitespace-nowrap"
                    style={{ borderColor: "#fce7f3", color: PINK }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-100 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  className="flex-1 text-sm bg-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: PINK }}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating button ── */}
      <button
        onClick={() => { setOpen(!open); setUnread(0); }}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[9997] w-13 h-13 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: PINK,
          width: 52,
          height: 52,
          boxShadow: `0 4px 20px rgba(215,15,100,0.45)`,
          display: open ? "none" : "flex",
        }}
      >
        <MessageCircle className="w-5 h-5 text-white" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-black">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
