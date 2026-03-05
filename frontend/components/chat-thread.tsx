"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
        transition={{ duration: 0.4 }}
        className="flex flex-1 items-center justify-center overflow-y-auto px-8 py-12"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Start a conversation
            </p>
          </motion.div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Ask about politics, history, or anything thoughtful.
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground"
          >
            Get nuanced answers from an AI research assistant. Try one of the
            suggestions below to get started.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            {suggestions.map((suggestion, i) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSuggestionClick(suggestion)}
                className={cn(
                  "rounded-xl border border-border/50 bg-card/50 px-5 py-4 text-left text-sm",
                  "transition-colors hover:border-primary/30 hover:bg-primary/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <section className="flex flex-1 flex-col overflow-y-auto px-8 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                layout: { type: "spring", stiffness: 350, damping: 30 },
              }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Card
                className={cn(
                  "max-w-[85%] border-border/50",
                  message.role === "user"
                    ? "bg-primary/15 text-foreground"
                    : "bg-muted/30"
                )}
              >
                <CardContent className="flex flex-col gap-1 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">
                      {message.role === "assistant" ? "Assistant" : "You"}
                    </span>
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="flex items-center gap-2 px-4 py-3">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                    ))}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
