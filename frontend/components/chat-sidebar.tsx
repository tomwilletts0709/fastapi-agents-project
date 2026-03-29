"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  conversationId: number | null;
  onNewChat: () => void;
}

export function ChatSidebar({
  conversationId,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.1 }}
      className="flex flex-col gap-4 border-2 border-neon-green bg-black p-4 shadow-pixel"
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

      <div className="border-t border-neon-green/30 pt-4">
        <button
          onClick={onNewChat}
          className={cn(
            "w-full border-2 border-neon-yellow bg-neon-yellow/10 px-3 py-3",
            "font-pixel text-[8px] text-neon-yellow shadow-pixel-sm",
            "transition-colors hover:bg-neon-yellow/20",
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          )}
        >
          {">> "}NEW GAME
        </button>
      </div>

      <div className="flex-1 border-2 border-neon-cyan/50 bg-neon-cyan/5 p-3">
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
          ALL DATA IS SAVED TO YOUR BACKEND SERVER.
          GAME PROGRESS PERSISTS ACROSS SESSIONS.
        </p>
      </div>
    </motion.aside>
  );
}
