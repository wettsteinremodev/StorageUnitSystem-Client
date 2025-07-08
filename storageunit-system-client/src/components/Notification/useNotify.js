import { useSnackbar } from "notistack";

export default function useNotify() {
  const { enqueueSnackbar } = useSnackbar();

  return {
    // First rendering the message form my Component, than the variant messase
    success: (msg) => enqueueSnackbar(msg, { variant: "success" }),
    error: (msg) => enqueueSnackbar(msg, { variant: "error" }),
    info: (msg) => enqueueSnackbar(msg, { variant: "info" }),
    warning: (msg) => enqueueSnackbar(msg, { variant: "warning" }),
  };
}
