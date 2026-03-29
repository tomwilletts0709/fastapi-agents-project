"use client";

import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import type { AppMode, ChatMessage } from "@/lib/types";

const MODEL_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  anthropic: { border: "border-neon-magenta", bg: "bg-neon-magenta/5", text: "text-neon-magenta" },
  openai: { border: "border-neon-green", bg: "bg-neon-green/5", text: "text-neon-green" },
  groq: { border: "border-neon-yellow", bg: "bg-neon-yellow/5", text: "text-neon-yellow" },
  ollama: { border: "border-neon-cyan", bg: "bg-neon-cyan/5", text: "text-neon-cyan" },
  google: { border: "border-neon-yellow", bg: "bg-neon-yellow/5", text: "text-neon-yellow" },
  mistral: { border: "border-neon-magenta", bg: "bg-neon-magenta/5", text: "text-neon-magenta" },
};

const DEFAULT_COLORS = { border: "border-neon-cyan", bg: "bg-neon-cyan/5", text: "text-neon-cyan" };

interface ChatThreadProps {
  messages: ChatMessage[];
  isLoading: boolean;
  suggestions: string[];
  onSuggestionClick: (value: string) => void;
  mode: AppMode;
}

export function ChatThread({
  messages,
  isLoading,
  suggestions,
  onSuggestionClick,
  mode,
}: ChatThreadProps) {
  if (messages.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-pixel text-[8px] uppercase tracking-widest text-neon-magenta">
            {mode === "debate" ? "~ DEBATE ARENA ~" : "~ CHAT QUEST ~"}
          </p>
          <h2 className="mt-4 font-pixel text-sm text-neon-green leading-relaxed">
            {mode === "debate" ? "SELECT FIGHTERS" : "INSERT COIN TO BEGIN"}
          </h2>
          <p className="mt-3 font-pixel text-[8px] text-neon-cyan leading-loose">
            {mode === "debate"
              ? "PICK 2+ MODELS IN SIDEBAR THEN ENTER A TOPIC"
              : "SELECT YOUR QUEST BELOW"}
          </p>
          <p className="mt-1 font-pixel text-[8px] text-neon-green animate-blink">
            _
          </p>

          {mode === "chat" && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {suggestions.map((suggestion, i) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05, delay: 0.1 + i * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSuggestionClick(suggestion)}
                  className={cn(
                    "border-2 border-neon-green bg-black px-4 py-3 text-left font-pixel text-[8px] text-neon-green",
                    "shadow-pixel-sm transition-colors",
                    "hover:border-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/5",
                    "focus-visible:outline-none focus-visible:border-neon-magenta"
                  )}
                >
                  <span className="text-neon-yellow mr-2">{">>"}</span>
                  {suggestion}
                </motion.button>
              ))}
            </div>
          )}

          {mode === "debate" && (
            <div className="mt-8 border-2 border-neon-yellow/50 bg-neon-yellow/5 p-4">
              <p className="font-pixel text-[8px] text-neon-yellow leading-loose">
                {"1)"} SELECT MODELS FROM THE SIDEBAR{"\n"}
                {"2)"} TYPE A DEBATE TOPIC BELOW{"\n"}
                {"3)"} HIT FIGHT!! TO START
              </p>
            </div>
          )}
        </div>
      </motion.section>
    );
  }

  return (
    <section className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            const isUser = message.role === "user";
            const modelKey = message.model ?? "";
            const colors = isUser
              ? { border: "border-neon-green", bg: "bg-neon-green/5", text: "text-neon-green" }
              : MODEL_COLORS[modelKey] ?? DEFAULT_COLORS;

            const avatarLabel = isUser
              ? "P1"
              : message.model
                ? message.model.slice(0, 3).toUpperCase()
                : "AI";

            return (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className={cn(
                  "flex gap-3",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center border-2",
                    colors.border,
                    colors.bg,
                    colors.text
                  )}
                >
                  <span className="font-pixel text-[6px]">{avatarLabel}</span>
                </div>
                <div
                  className={cn(
                    "max-w-[85%] border-2 px-4 py-3 shadow-pixel-sm",
                    colors.border,
                    colors.bg
                  )}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className={cn("font-pixel text-[8px]", colors.text)}>
                      {isUser ? "P1" : message.model?.toUpperCase() ?? "CPU"}
                    </span>
                    <span className="font-pixel text-[7px] text-neon-yellow">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-neon-green">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-neon-cyan bg-neon-cyan/10">
                <span className="font-pixel text-[6px] text-neon-cyan">
                  {mode === "debate" ? "VS" : "AI"}
                </span>
              </div>
              <div className="border-2 border-neon-cyan bg-neon-cyan/5 px-4 py-3 shadow-pixel-sm">
                <span className="font-pixel text-[8px] text-neon-cyan">
                  {mode === "debate" ? "DEBATING" : "PROCESSING"}
                </span>
                <span className="font-pixel text-[8px] text-neon-magenta animate-blink ml-1">
                  {">>>"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
