import { useToastContext } from "../contexts/toast_message_context/toast_message_context";

export function useToast() {
  const toast = useToastContext();
  if (!toast) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return toast;
}
