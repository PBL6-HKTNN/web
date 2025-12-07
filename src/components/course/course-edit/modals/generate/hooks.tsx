import { useState } from "react";
import type { AttachedContextItem } from "@/types/ai";

export function useGenerateModals() {
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [attachedContext, setAttachedContext] = useState<AttachedContextItem[]>([]);

  const openMarkdownModal = () => setIsMarkdownModalOpen(true);
  const closeMarkdownModal = () => {
    setIsMarkdownModalOpen(false);
    setAttachedContext([]);
  };
  
  const openQuizModal = () => setIsQuizModalOpen(true);
  const closeQuizModal = () => {
    setIsQuizModalOpen(false);
    setAttachedContext([]);
  };

  const addContextItem = (item: AttachedContextItem) => {
    setAttachedContext(prev => [...prev, item]);
  };

  const removeContextItem = (index: number) => {
    setAttachedContext(prev => prev.filter((_, i) => i !== index));
  };

  const clearContext = () => {
    setAttachedContext([]);
  };

  return {
    // Markdown modal
    isMarkdownModalOpen,
    openMarkdownModal,
    closeMarkdownModal,
    
    // Quiz modal
    isQuizModalOpen,
    openQuizModal,
    closeQuizModal,

    // Context management
    attachedContext,
    addContextItem,
    removeContextItem,
    clearContext,
  };
}