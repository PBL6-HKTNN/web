import { useState } from "react";

export function useGenerateModals() {
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const openMarkdownModal = () => setIsMarkdownModalOpen(true);
  const closeMarkdownModal = () => setIsMarkdownModalOpen(false);
  
  const openQuizModal = () => setIsQuizModalOpen(true);
  const closeQuizModal = () => setIsQuizModalOpen(false);

  return {
    // Markdown modal
    isMarkdownModalOpen,
    openMarkdownModal,
    closeMarkdownModal,
    
    // Quiz modal
    isQuizModalOpen,
    openQuizModal,
    closeQuizModal,
  };
}