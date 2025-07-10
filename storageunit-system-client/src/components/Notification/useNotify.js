import { useSnackbar } from "notistack";

export default function useNotify() {
  const { enqueueSnackbar } = useSnackbar();

  // Helper to display a message with a variant
  const notify = (msg, variant) => {
    if (!msg) return; // safeguard empty messages
    enqueueSnackbar(msg, { variant });
  };

  return {
    success: (msg) => notify(msg, "success"),
    error: (msg) => notify(msg, "error"),
    info: (msg) => notify(msg, "info"),
    warning: (msg) => notify(msg, "warning"),
  };
}
