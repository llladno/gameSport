import { useToast as useVueToast } from 'vue-toastification';
import type { ToastOptions } from 'vue-toastification';

export const useToast = () => {
  const toast = useVueToast();

  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  };

  const info = (message: string, options?: ToastOptions) => {
    toast.info(message, options);
  };

  const warning = (message: string, options?: ToastOptions) => {
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
