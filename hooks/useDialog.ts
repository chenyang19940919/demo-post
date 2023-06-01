import { useState } from "react";

export default function useDialog() {
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    setOpen,
    onClose: () => setOpen(false),
  };
}
