import { useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';

/**
 * Custom hook for toast notifications
 * Simplifies the toast API from context
 * @returns {Function} showToast - Function to display toast message
 */
export const useToast = () => {
  const { showToast } = useFinance();

  const toast = useCallback(
    (message, type = 'info') => {
      showToast(message, type);
    },
    [showToast]
  );

  return toast;
};
