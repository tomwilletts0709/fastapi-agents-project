"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import type { AppMode } from "@/lib/types";

const MODEL_COLORS: Record<string, string> = {
  anthropic: "text-neon-magenta border-neon-magenta",
  openai: "text-neon-green border-neon-green",
  groq: "text-neon-yellow border-neon-yellow",
  ollama: "text-neon-cyan border-neon-cyan",
  google: "text-neon-yellow border-neon-yellow",
  mistral: "text-neon-magenta border-neon-magenta",
};

interface ChatComposerProps {
  value: string;
  disabled?: boolean;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  mode: AppMode;
}

export function ChatComposer({
  value,
  disabled = false,
  isLoading,
  onChange,
  onSubmit,
  models,
  selectedModel,
  onModelChange,
  mode,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  function cycleModel(direction: 1 | -1) {
    if (models.length === 0) return;
    const currentIndex = models.indexOf(selectedModel);
    const nextIndex = (currentIndex + direction + models.length) % models.length;
    onModelChange(models[nextIndex]);
  }

  const colorClass = MODEL_COLORS[selectedModel] ?? "text-neon-green border-neon-green";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.05 }}
      className="px-4 pb-4"
    >
      {mode === "chat" && models.length > 0 && (
        <div className="mb-2 flex items-center gap-2">
          <span className="font-pixel text-[7px] text-neon-yellow">MODEL:</span>
          <button
            onClick={() => cycleModel(-1)}
            className="font-pixel text-[10px] text-neon-cyan hover:text-white px-1"
            type="button"
          >
            {"<"}
          </button>
          <span className={cn("font-pixel text-[8px] uppercase border px-2 py-1 min-w-[100px] text-center", colorClass)}>
            {selectedModel}
          </span>
          <button
            onClick={() => cycleModel(1)}
            className="font-pixel text-[10px] text-neon-cyan hover:text-white px-1"
            type="button"
          >
            {">"}
          </button>
        </div>
      )}

      <div
        className={cn(
          "border-2 border-neon-green bg-black p-3",
          "shadow-pixel-sm",
          "focus-within:border-neon-cyan"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-pixel text-[8px] text-neon-yellow">{">"}</span>
          <span className="font-pixel text-[8px] text-neon-green">
            {mode === "debate" ? "DEBATE TOPIC" : "INPUT"}
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder={mode === "debate" ? "ENTER DEBATE TOPIC..." : "TYPE YOUR MESSAGE..."}
          disabled={disabled}
          rows={1}
          className={cn(
            "min-h-[28px] w-full resize-none border-0 bg-transparent px-0 font-mono text-xs",
            "text-neon-green placeholder:text-neon-green/30",
            "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="font-pixel text-[7px] text-neon-yellow/60">
            ENTER = SEND // SHIFT+ENTER = NEW LINE
          </p>
          <button
            onClick={onSubmit}
            disabled={disabled || isLoading || !value.trim()}
            className={cn(
              "border-2 border-neon-magenta bg-neon-magenta/10 px-4 py-2",
              "font-pixel text-[8px] text-neon-magenta shadow-pixel-sm",
              "transition-colors hover:bg-neon-magenta/20 hover:text-white",
              "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neon-magenta/10"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-blink">...</span>
                WAIT
              </span>
            ) : mode === "debate" ? (
              <span>FIGHT! {">>"}</span>
            ) : (
              <span>SEND {">>"}</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
