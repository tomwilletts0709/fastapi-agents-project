"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createConversation, fetchModels, sendChatMessage, startDebate } from "@/lib/api";
import type { AppMode, ChatMessage } from "@/lib/types";

import { ChatComposer } from "./chat-composer";
import { ChatSidebar } from "./chat-sidebar";
import { ChatThread } from "./chat-thread";
import { Alert, AlertDescription } from "./ui/alert";

const FALLBACK_MODELS = ["anthropic", "openai", "groq", "ollama", "google", "mistral"];

const SUGGESTIONS = [
  "What are the biggest breakthroughs in AI this year?",
  "Explain quantum computing like I'm five.",
  "Compare the pros and cons of remote work.",
  "What makes a great engineering culture?",
];

function makeMessage(
  role: ChatMessage["role"],
  content: string,
  model?: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
    model,
  };
}

export function ChatShell() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [mode, setMode] = useState<AppMode>("chat");
  const [models, setModels] = useState<string[]>(FALLBACK_MODELS);
  const [selectedModel, setSelectedModel] = useState("anthropic");
  const [debateModels, setDebateModels] = useState<string[]>([]);
  const [debateRounds, setDebateRounds] = useState(1);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  useEffect(() => {
    fetchModels()
      .then((m) => {
        if (m.length > 0) {
          setModels(m);
          if (!m.includes(selectedModel)) {
            setSelectedModel(m[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const toggleDebateModel = useCallback((model: string) => {
    setDebateModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  }, []);

  async function submitMessage(prefilled?: string) {
    const text = (prefilled ?? input).trim();
    if (!text || isLoading) return;

    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      let nextConversationId = conversationId;
      if (!nextConversationId) {
        nextConversationId = await createConversation();
        setConversationId(nextConversationId);
      }

      if (mode === "debate") {
        if (debateModels.length < 2) {
          setError("Select at least 2 fighters for debate mode!");
          setInput(text);
          setIsLoading(false);
          return;
        }

        const topicMessage = makeMessage("user", `[DEBATE] ${text}`);
        setMessages((current) => [...current, topicMessage]);

        const turns = await startDebate(nextConversationId, text, debateModels, debateRounds);
        const turnMessages = turns.map((turn) =>
          makeMessage("assistant", turn.content, turn.model)
        );
        setMessages((current) => [...current, ...turnMessages]);
      } else {
        const optimisticUserMessage = makeMessage("user", text);
        setMessages((current) => [...current, optimisticUserMessage]);

        const responseText = await sendChatMessage(nextConversationId, text, selectedModel);
        setMessages((current) => [
          ...current,
          makeMessage("assistant", responseText, selectedModel),
        ]);
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while contacting the backend.";
      setError(message);
      if (mode !== "debate") {
        setMessages((current) => current.slice(0, -1));
      }
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
    <div className="flex min-h-screen flex-col md:flex-row gap-0 p-4 md:gap-4">
      <div className="w-full md:w-[280px] shrink-0 mb-4 md:mb-0">
        <ChatSidebar
          conversationId={conversationId}
          onNewChat={resetChat}
          mode={mode}
          onModeChange={setMode}
          models={models}
          debateModels={debateModels}
          onToggleDebateModel={toggleDebateModel}
          debateRounds={debateRounds}
          onDebateRoundsChange={setDebateRounds}
        />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="flex flex-1 min-h-[calc(100vh-32px)] flex-col overflow-hidden border-2 border-neon-green bg-black shadow-pixel"
      >
        <header className="border-b-2 border-neon-green px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-neon-magenta font-pixel text-xs">{">>>"}</span>
            <h2 className="font-pixel text-xs text-neon-green tracking-wider uppercase">
              {mode === "debate" ? "DEBATE ARENA" : "CHAT QUEST"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {mode === "chat" && (
              <span className="font-pixel text-[8px] text-neon-cyan uppercase">
                [{selectedModel}]
              </span>
            )}
            {mode === "debate" && debateModels.length >= 2 && (
              <span className="font-pixel text-[8px] text-neon-magenta">
                {debateModels.length} FIGHTERS // {debateRounds} RND{debateRounds > 1 ? "S" : ""}
              </span>
            )}
            <span className="font-pixel text-[8px] text-neon-yellow">
              {mode === "debate" ? "VS MODE" : "1P MODE"}
            </span>
          </div>
        </header>

        <ChatThread
          isLoading={isLoading}
          messages={messages}
          onSuggestionClick={(s) => void submitMessage(s)}
          suggestions={SUGGESTIONS}
          mode={mode}
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
          models={models}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          mode={mode}
        />

        {!hasMessages && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05, delay: 0.3 }}
            className="px-4 pb-4 text-center font-pixel text-[8px] text-neon-magenta"
          >
            BUILT ON NEXT.JS // POWERED BY PYDANTIC AI // (C) 2026
          </motion.p>
        )}
      </motion.main>
    </div>
  );
}
