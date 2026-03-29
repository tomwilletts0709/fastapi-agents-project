"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { AppMode } from "@/lib/types";

const MODEL_COLORS: Record<string, string> = {
  anthropic: "border-neon-magenta text-neon-magenta",
  openai: "border-neon-green text-neon-green",
  groq: "border-neon-yellow text-neon-yellow",
  ollama: "border-neon-cyan text-neon-cyan",
  google: "border-neon-yellow text-neon-yellow",
  mistral: "border-neon-magenta text-neon-magenta",
};

interface ChatSidebarProps {
  conversationId: number | null;
  onNewChat: () => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  models: string[];
  debateModels: string[];
  onToggleDebateModel: (model: string) => void;
  debateRounds: number;
  onDebateRoundsChange: (rounds: number) => void;
}

export function ChatSidebar({
  conversationId,
  onNewChat,
  mode,
  onModeChange,
  models,
  debateModels,
  onToggleDebateModel,
  debateRounds,
  onDebateRoundsChange,
}: ChatSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.1 }}
      className="flex flex-col gap-3 border-2 border-neon-green bg-black p-4 shadow-pixel overflow-y-auto max-h-[calc(100vh-32px)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-neon-magenta bg-neon-magenta/10">
          <span className="font-pixel text-[10px] text-neon-magenta">
            {"*"}
          </span>
        </div>
        <div>
          <p className="font-pixel text-[7px] uppercase tracking-widest text-neon-yellow">
            SYSTEM
          </p>
          <h1 className="font-pixel text-[9px] text-neon-green tracking-wider">
            CHAT QUEST
          </h1>
        </div>
      </div>

      <div className="border-t border-neon-green/30 pt-3">
        <p className="font-pixel text-[7px] text-neon-yellow mb-2">GAME MODE</p>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange("chat")}
            className={cn(
              "flex-1 border-2 px-2 py-2 font-pixel text-[8px] shadow-pixel-sm transition-colors",
              "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              mode === "chat"
                ? "border-neon-green bg-neon-green/20 text-neon-green"
                : "border-neon-green/30 bg-transparent text-neon-green/40 hover:text-neon-green/70"
            )}
          >
            1P CHAT
          </button>
          <button
            onClick={() => onModeChange("debate")}
            className={cn(
              "flex-1 border-2 px-2 py-2 font-pixel text-[8px] shadow-pixel-sm transition-colors",
              "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              mode === "debate"
                ? "border-neon-magenta bg-neon-magenta/20 text-neon-magenta"
                : "border-neon-magenta/30 bg-transparent text-neon-magenta/40 hover:text-neon-magenta/70"
            )}
          >
            VS MODE
          </button>
        </div>
      </div>

      <div className="border-t border-neon-green/30 pt-3">
        <button
          onClick={onNewChat}
          className={cn(
            "w-full border-2 border-neon-yellow bg-neon-yellow/10 px-3 py-2",
            "font-pixel text-[8px] text-neon-yellow shadow-pixel-sm",
            "transition-colors hover:bg-neon-yellow/20",
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          )}
        >
          {">> "}NEW GAME
        </button>
      </div>

      {mode === "debate" && (
        <div className="border-t border-neon-green/30 pt-3">
          <p className="font-pixel text-[7px] text-neon-magenta mb-2">
            SELECT FIGHTERS ({debateModels.length}/{models.length})
          </p>
          <div className="flex flex-col gap-1">
            {models.map((model) => {
              const isSelected = debateModels.includes(model);
              const colorClass = MODEL_COLORS[model] ?? "border-neon-green text-neon-green";
              return (
                <button
                  key={model}
                  onClick={() => onToggleDebateModel(model)}
                  className={cn(
                    "border-2 px-3 py-1.5 text-left font-pixel text-[7px] uppercase transition-colors",
                    "active:translate-x-[1px] active:translate-y-[1px]",
                    isSelected
                      ? cn(colorClass, "bg-white/5 shadow-pixel-sm")
                      : "border-neon-green/20 text-neon-green/30 hover:text-neon-green/60 hover:border-neon-green/40"
                  )}
                >
                  {isSelected ? "[X] " : "[ ] "}
                  {model}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="font-pixel text-[7px] text-neon-yellow">ROUNDS:</span>
            <button
              onClick={() => onDebateRoundsChange(Math.max(1, debateRounds - 1))}
              className="font-pixel text-[10px] text-neon-cyan hover:text-white px-1"
              type="button"
            >
              {"<"}
            </button>
            <span className="font-pixel text-[8px] text-neon-cyan border border-neon-cyan px-2 py-1 min-w-[30px] text-center">
              {debateRounds}
            </span>
            <button
              onClick={() => onDebateRoundsChange(Math.min(5, debateRounds + 1))}
              className="font-pixel text-[10px] text-neon-cyan hover:text-white px-1"
              type="button"
            >
              {">"}
            </button>
          </div>

          {debateModels.length < 2 && (
            <p className="mt-2 font-pixel text-[6px] text-neon-red animate-blink">
              PICK AT LEAST 2 TO FIGHT!
            </p>
          )}
        </div>
      )}

      <div className="border-2 border-neon-cyan/50 bg-neon-cyan/5 p-3 mt-1">
        <p className="font-pixel text-[7px] uppercase tracking-widest text-neon-cyan mb-2">
          SAVE SLOT
        </p>
        <div className="border-b border-neon-cyan/20 pb-2 mb-2">
          <p className="font-pixel text-[8px] text-neon-green">
            {conversationId
              ? `SLOT #${String(conversationId).padStart(3, "0")}`
              : "- EMPTY -"}
          </p>
        </div>
        {conversationId && (
          <p className="font-pixel text-[7px] text-neon-yellow">
            STATUS: ACTIVE
          </p>
        )}
      </div>

      <div className="border-t border-neon-green/30 pt-3">
        <p className="font-pixel text-[6px] text-neon-green/40 leading-loose">
          DATA SAVED TO BACKEND.
          PROGRESS PERSISTS.
        </p>
      </div>
    </motion.aside>
  );
}
