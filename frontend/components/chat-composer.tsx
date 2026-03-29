"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface ChatComposerProps {
  value: string;
  disabled?: boolean;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChatComposer({
  value,
  disabled = false,
  isLoading,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.05 }}
      className="px-4 pb-4"
    >
      <div
        className={cn(
          "border-2 border-neon-green bg-black p-3",
          "shadow-pixel-sm",
          "focus-within:border-neon-cyan"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-pixel text-[8px] text-neon-yellow">{">"}</span>
          <span className="font-pixel text-[8px] text-neon-green">INPUT</span>
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
          placeholder="TYPE YOUR MESSAGE..."
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
            ) : (
              <span>SEND {">>"}</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
