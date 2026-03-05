"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { createConversation, sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

import { ChatComposer } from "./chat-composer";
import { ChatSidebar } from "./chat-sidebar";
import { ChatThread } from "./chat-thread";
import { Alert, AlertDescription } from "./ui/alert";
import { cn } from "@/lib/utils";

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
    <div className="grid min-h-screen grid-cols-1 gap-6 p-6 md:grid-cols-[320px_1fr]">
      <ChatSidebar conversationId={conversationId} onNewChat={resetChat} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex min-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-2xl",
          "border border-border/50 bg-card/80 backdrop-blur-xl",
          "shadow-xl shadow-black/20"
        )}
      >
        <header className="border-b border-border/50 px-8 py-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Research assistant
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Ask nuanced questions and explore ideas.
          </h2>
        </header>

        <ChatThread
          isLoading={isLoading}
          messages={messages}
          onSuggestionClick={(s) => void submitMessage(s)}
          suggestions={SUGGESTIONS}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mb-4"
          >
            <Alert variant="destructive" className="rounded-xl">
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
            transition={{ delay: 0.5 }}
            className="px-8 pb-6 text-center text-xs text-muted-foreground"
          >
            Built on Next.js · Powered by Claude
          </motion.p>
        )}
      </motion.main>
    </div>
  );
}
