"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-xl",
        "shadow-xl shadow-black/20"
      )}
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20"
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Chat Agent
          </p>
          <h1 className="text-lg font-semibold tracking-tight">
            Research Assistant
          </h1>
        </div>
      </div>

      <Button
        onClick={onNewChat}
        className="w-full gap-2 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        size="lg"
      >
        <MessageSquarePlus className="h-4 w-4" />
        New chat
      </Button>

      <Card className="flex-1 border-border/50 bg-muted/30">
        <CardHeader className="pb-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current session
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm font-medium">
            {conversationId
              ? `Conversation #${conversationId}`
              : "Not started yet"}
          </p>
        </CardContent>
        <CardFooter className="border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Messages are stored in your backend and persist across sessions.
          </p>
        </CardFooter>
      </Card>
    </motion.aside>
  );
}
