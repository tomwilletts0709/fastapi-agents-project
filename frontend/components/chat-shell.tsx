"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { createConversation, sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

import { ChatComposer } from "./chat-composer";
import { ChatSidebar } from "./chat-sidebar";
import { ChatThread } from "./chat-thread";
import { Alert, AlertDescription } from "./ui/alert";

const SUGGESTIONS = [
  "Summarize the major causes of World War I.",
  "Compare liberalism and conservatism in modern politics.",
  "Explain why the Roman Republic fell.",
  "What can we learn from the Cold War today?",
];

function makeMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function ChatShell() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  async function submitMessage(prefilled?: string) {
    const text = (prefilled ?? input).trim();
    if (!text || isLoading) return;

    const optimisticUserMessage = makeMessage("user", text);
    setMessages((current) => [...current, optimisticUserMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      let nextConversationId = conversationId;
      if (!nextConversationId) {
        nextConversationId = await createConversation();
        setConversationId(nextConversationId);
      }
      const responseText = await sendChatMessage(nextConversationId, text);
      setMessages((current) => [
        ...current,
        makeMessage("assistant", responseText),
      ]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while contacting the backend.";
      setError(message);
      setMessages((current) =>
        current.filter((m) => m.id !== optimisticUserMessage.id)
      );
      setInput(text);
    } finally {
      setIsLoading(false);
    }
  }

  function resetChat() {
    setConversationId(null);
    setMessages([]);
    setInput("");
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-0 p-4 md:grid-cols-[280px_1fr] md:gap-4">
      <ChatSidebar conversationId={conversationId} onNewChat={resetChat} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="flex min-h-[calc(100vh-32px)] flex-col overflow-hidden border-2 border-neon-green bg-black shadow-pixel"
      >
        <header className="border-b-2 border-neon-green px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-neon-magenta font-pixel text-xs">{">>>"}</span>
            <h2 className="font-pixel text-xs text-neon-green tracking-wider uppercase">
              CHAT QUEST
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-pixel text-[8px] text-neon-yellow">
              HP [████████░░] 80%
            </span>
            <span className="font-pixel text-[8px] text-neon-cyan">
              LVL 01
            </span>
          </div>
        </header>

        <ChatThread
          isLoading={isLoading}
          messages={messages}
          onSuggestionClick={(s) => void submitMessage(s)}
          suggestions={SUGGESTIONS}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05 }}
            className="mx-4 mb-3"
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <ChatComposer
          disabled={false}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={() => void submitMessage()}
          value={input}
        />

        {!hasMessages && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05, delay: 0.3 }}
            className="px-4 pb-4 text-center font-pixel text-[8px] text-neon-magenta"
          >
            BUILT ON NEXT.JS // POWERED BY Tom Willetts // (C) 2026
          </motion.p>
        )}
      </motion.main>
    </div>
  );
}
