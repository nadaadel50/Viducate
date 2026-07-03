import { useNavigate } from "react-router-dom";
import { useLearningSession } from "../../core/hooks/useLearningContent";

type Props = {
  to?: string;
  children: React.ReactNode;
  className?: string;
  onBeforeNavigate?: () => void;
};

export function SafeNavLink({
  to,
  children,
  className,
  onBeforeNavigate,
}: Props) {
  const navigate = useNavigate();
  const { hasUnsavedChanges } = useLearningSession();

  const handleClick = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!confirmLeave) return;
    }

    onBeforeNavigate?.();
    if (to) navigate(to);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
