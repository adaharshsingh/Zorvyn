import { useState, useMemo } from 'react';
import { ITEMS_PER_PAGE } from '../config/constants';

/**
 * Custom hook to manage transaction pagination and filtering
 * @param {Array} transactions - Array of transaction objects
 * @param {String} searchTerm - Filter by search term
 * @param {String} filterType - Filter by transaction type
 * @param {String} filterCategory - Filter by category
 * @param {String} sortOrder - Sort order ('newest', 'oldest', 'highest', 'lowest')
 * @returns {Object} { paginatedData, currentPage, totalPages, setCurrentPage }
 */
export const useTransactionPagination = (
  transactions,
  searchTerm,
  filterType,
  filterCategory,
  sortOrder
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedData = useMemo(() => {
    let data = [...transactions];

    // Apply search filter
    if (searchTerm) {
      data = data.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      data = data.filter((t) => t.type === filterType);
    }

    // Apply category filter
    if (filterCategory !== 'All Categories') {
      data = data.filter((t) => t.category === filterCategory);
    }

    // Apply sorting
    if (sortOrder === 'highest') {
      data.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (sortOrder === 'lowest') {
      data.sort((a, b) => Number(a.amount) - Number(b.amount));
    } else if (sortOrder === 'oldest') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      // newest (default)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return data;
  }, [transactions, searchTerm, filterType, filterCategory, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage]);

  return {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredCount: filteredAndSortedData.length,
  };
};
