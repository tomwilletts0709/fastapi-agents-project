"use client";

import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

interface ChatThreadProps {
  messages: ChatMessage[];
  isLoading: boolean;
  suggestions: string[];
  onSuggestionClick: (value: string) => void;
}

export function ChatThread({
  messages,
  isLoading,
  suggestions,
  onSuggestionClick,
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
            ~ HISTORY ARENA ~
          </p>
          <h2 className="mt-4 font-pixel text-sm text-neon-green leading-relaxed">
            INSERT COIN TO BEGIN
          </h2>
          <p className="mt-3 font-pixel text-[8px] text-neon-cyan leading-loose">
            SELECT YOUR QUEST BELOW
          </p>
          <p className="mt-1 font-pixel text-[8px] text-neon-green animate-blink">
            _
          </p>

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
        </div>
      </motion.section>
    );
  }

  return (
    <section className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center border-2",
                  message.role === "user"
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                )}
              >
                <span className="font-pixel text-[8px]">
                  {message.role === "user" ? "P1" : "AI"}
                </span>
              </div>
              <div
                className={cn(
                  "max-w-[85%] border-2 px-4 py-3 shadow-pixel-sm",
                  message.role === "user"
                    ? "border-neon-green bg-neon-green/5"
                    : "border-neon-cyan bg-neon-cyan/5"
                )}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={cn(
                      "font-pixel text-[8px]",
                      message.role === "user"
                        ? "text-neon-green"
                        : "text-neon-cyan"
                    )}
                  >
                    {message.role === "assistant" ? "CPU" : "P1"}
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
          ))}

          {isLoading && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-neon-cyan bg-neon-cyan/10">
                <span className="font-pixel text-[8px] text-neon-cyan">AI</span>
              </div>
              <div className="border-2 border-neon-cyan bg-neon-cyan/5 px-4 py-3 shadow-pixel-sm">
                <span className="font-pixel text-[8px] text-neon-cyan">
                  PROCESSING
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
