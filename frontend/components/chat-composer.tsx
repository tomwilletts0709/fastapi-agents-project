"use client";

import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pb-6"
    >
      <div
        className={cn(
          "rounded-2xl border border-border/50 bg-muted/20 p-4 transition-all duration-200",
          "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10",
          "shadow-lg shadow-black/10"
        )}
      >
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Message the assistant..."
          disabled={disabled}
          rows={1}
          className={cn(
            "min-h-[28px] resize-none border-0 bg-transparent px-0 shadow-none",
            "placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Enter to send · Shift+Enter for new line
          </p>
          <Button
            onClick={onSubmit}
            disabled={disabled || isLoading || !value.trim()}
            size="sm"
            className="gap-2 rounded-xl px-5 transition-all duration-200 hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
