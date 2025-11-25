"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, BookOpen, FileText, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'module' | 'lesson';
  title: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  const getIcon = () => {
    return type === 'module' ? (
      <BookOpen className="h-5 w-5 text-destructive" />
    ) : (
      <FileText className="h-5 w-5 text-destructive" />
    );
  };

  const getDescription = () => {
    if (type === 'module') {
      return `Are you sure you want to delete the module "${title}"? This will also delete all lessons within this module. This action cannot be undone.`;
    } else {
      return `Are you sure you want to delete the lesson "${title}"? This action cannot be undone.`;
    }
  };

  const getConfirmText = () => {
    if (isDeleting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </>
      );
    }
    return (
      <>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {type === 'module' ? 'Module' : 'Lesson'}
      </>
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {getIcon()}
            Delete {type === 'module' ? 'Module' : 'Lesson'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {getConfirmText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
