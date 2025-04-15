import { useToast as useVueToast } from 'vue-toastification';
import type { ToastOptions } from "vue-toastification/dist/types/types";

export const useToast = () => {
  const toast = useVueToast();

  const success = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    toast.success(message, options);
  };

  const error = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    toast.error(message, options);
  };

  const info = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    toast.info(message, options);
  };

  const warning = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    toast.warning(message, options);
  };

  return {
    success,
    error,
    info,
    warning,
    toast,
  };
};
