// src/hooks/useConfirmation.js
import { useState } from "react";

function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    if (resolvePromise) {
      resolvePromise(false);
      setIsOpen(false);
    }
  };

  return { confirm, isOpen, handleConfirm, handleClose };
}

export default useConfirmation;