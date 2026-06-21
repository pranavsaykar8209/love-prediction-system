import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import FloatingHearts from '../../components/FloatingHearts/FloatingHearts';
import HeartIcon from '../../components/HeartIcon/HeartIcon';
import PinLock from './PinLock';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import aboutData from '../../data/aboutCalculation.json';
import styles from './HistoryPage.module.css';
import type { HistoryPageProps, LoveResultDbRow } from '../../types';
import { capitalizeName } from '../../utils';
import { fetchLoveResults, deleteLoveResults } from '../../services/historyService';

const HistoryPage: React.FC<HistoryPageProps> = ({ onHomeNavigate, onCalculateNavigate }) => {
  // Always require PIN on every visit
  const [authenticated, setAuthenticated] = useState(false);

  const [results, setResults] = useState<LoveResultDbRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Tracks which row's timestamp tooltip is open on mobile
  const [tooltipRowId, setTooltipRowId] = useState<number | null>(null);
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  // Refresh state — spins the icon without hiding the table
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch results on mount
  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await fetchLoveResults();
      setResults(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  // Manual refresh — spins the icon only, table stays visible
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const data = await fetchLoveResults();
      setResults(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error refreshing history:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Dismiss the score tooltip when clicking/tapping outside the score cell
  useEffect(() => {
    if (tooltipRowId === null) return;
    const dismiss = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.scoreCell}`)) {
        setTooltipRowId(null);
      }
    };
    document.addEventListener('mousedown', dismiss);
    document.addEventListener('touchstart', dismiss);
    return () => {
      document.removeEventListener('mousedown', dismiss);
      document.removeEventListener('touchstart', dismiss);
    };
  }, [tooltipRowId]);

  // Show a brief toast message on actions
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Perform search / filter application
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilter(searchTerm.trim().toLowerCase());
    setCurrentPage(1); // reset to first page on new search
  };

  // Clear search input & active filter
  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveFilter('');
    setCurrentPage(1);
  };


  // Open confirm modal instead of native confirm dialog
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal(true);
  };

  // Actual deletion — called when user confirms in modal
  const performBulkDelete = async () => {
    setConfirmModal(false);
    try {
      await deleteLoveResults(selectedIds);
      showToast(`${selectedIds.length} record${selectedIds.length > 1 ? 's' : ''} deleted successfully.`);
      setResults((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } catch (e) {
      console.error(e);
      showToast('Failed to delete selected records.');
    }
  };



  // Select/deselect a single row checkbox
  const handleRowSelectChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  // Toggle timestamp tooltip on mobile score tap
  const handleScoreTap = (id: number) => {
    setTooltipRowId((prev) => (prev === id ? null : id));
  };

  // Filter logic: match search query against your_name + crush_name.
  // Splits by spaces so order of names in filter query (e.g. "Juliet Romeo") doesn't matter.
  const filteredResults = results.filter((item) => {
    if (!activeFilter) return true;
    const yourName = item.your_name.toLowerCase();
    const crushName = item.crush_name.toLowerCase();
    const queryWords = activeFilter.split(/\s+/).filter(Boolean);
    return queryWords.every((word) => yourName.includes(word) || crushName.includes(word));
  });

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = filteredResults.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Helper to format date
  const formatDate = (isoString: string): string => {
    if (!isoString) return 'Unknown Time';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Unknown Time';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to color code compatibility score ranges
  const getScoreClass = (score: number): string => {
    if (score >= 90) return styles.scoreHigh;
    if (score >= 70) return styles.scoreMedium;
    return styles.scoreLow;
  };

  // "Select all" applies only to the current page
  const isAllSelected =
    paginatedResults.length > 0 &&
    paginatedResults.every((item) => selectedIds.includes(item.id));

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedResults.map((item) => item.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedResults.map((item) => item.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  return (
    <>
      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={confirmModal}
        title="Delete Records"
        message={`Are you sure you want to delete ${selectedIds.length} selected record${selectedIds.length > 1 ? 's' : ''}? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={performBulkDelete}
        onCancel={() => setConfirmModal(false)}
      />

      {/* Show PIN lock if not authenticated */}
      {!authenticated && <PinLock onUnlock={() => setAuthenticated(true)} />}

      {/* History content — hidden (not unmounted) until authenticated */}
      <div style={{ display: authenticated ? 'block' : 'none' }}>
    <div className={styles.page}>
      {/* Decorative background blobs */}
      <div className="blobContainer">
        <div className={`${styles.blob} ${styles.blobPink}`}></div>
        <div className={`${styles.blob} ${styles.blobPurple}`}></div>
        <div className={`${styles.blob} ${styles.blobLavender}`}></div>
      </div>

      {/* Floating hearts */}
      <FloatingHearts count={15} />

      {/* Navbar */}
      <Navbar 
        ctaText="Try Calculator" 
        onCtaClick={onCalculateNavigate} 
        onLogoClick={onHomeNavigate} 
        showNavLinks={true}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className={styles.toast}>
          <HeartIcon className={styles.toastIcon} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardBadge}>
              <HeartIcon className={styles.badgeHeart} />
              <span>COMPATIBILITY ARCHIVES</span>
              <HeartIcon className={styles.badgeHeart} />
            </div>
            <h1 className={styles.title}>Match History</h1>
            <p className={styles.subtitle}>
              Browse through previously calculated compatibility calculations.
            </p>
          </div>

          {/* Search/Filter and Bulk Actions Bar */}
          <div className={styles.actionBar}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Filter by Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className={styles.clearButton}
                    title="Clear filter"
                  >
                    &times;
                  </button>
                )}
              </div>
              <button type="submit" className={styles.searchButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Search
              </button>
            </form>

            {/* Refresh button */}
            <button
              type="button"
              onClick={handleRefresh}
              className={`${styles.refreshButton} ${isRefreshing ? styles.refreshSpin : ''}`}
              title="Refresh list"
              disabled={isRefreshing}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>

            {/* Bulk Delete button (Only visible if 1+ rows are selected) */}
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete} 
                className={styles.bulkDeleteButton}
                title="Delete selected records"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className={styles.tableWrapper}>
            {loading ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <p>Retrieving archives...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className={styles.emptyState}>
                <HeartIcon className={styles.emptyHeart} />
                <h3>No records found</h3>
                <p>
                  {activeFilter
                    ? 'No compatibility records match your search filter.'
                    : 'There are no calculations stored yet. Launch a new love calculation!'}
                </p>
                {activeFilter ? (
                  <button onClick={handleClearSearch} className={styles.emptyButton}>
                    Clear Filter
                  </button>
                ) : (
                  <button onClick={onCalculateNavigate} className={styles.emptyButton}>
                    Calculate Love Match
                  </button>
                )}
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.colCheck}>
                      <label className={styles.checkboxContainer}>
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAllChange}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </th>
                    <th className={styles.colMatch}>Crush Match</th>
                    <th className={styles.colScore}>Score</th>
                    <th className={styles.colTime}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.map((row) => {
                    const isSelected = selectedIds.includes(row.id);
                    return (
                      <tr key={row.id} className={isSelected ? styles.rowSelected : undefined}>
                        <td className={styles.colCheck}>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleRowSelectChange(row.id, e.target.checked)}
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                        </td>
                        <td className={styles.colMatch}>
                          <div className={styles.matchNames}>
                            <span className={styles.name}>{capitalizeName(row.your_name)}</span>
                            <span className={styles.heartConnector}>❤️</span>
                            <span className={styles.name}>{capitalizeName(row.crush_name)}</span>
                          </div>
                        </td>
                        <td className={styles.colScore}>
                          <div
                            className={styles.scoreCell}
                            onClick={() => handleScoreTap(row.id)}
                          >
                            <span className={`${styles.scoreBadge} ${getScoreClass(row.score)}`}>
                              {row.score}%
                            </span>
                            {/* Timestamp tooltip — mobile only */}
                            {tooltipRowId === row.id && (
                              <div className={styles.scoreTooltip}>
                                🕐 {formatDate(row.created_at)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={styles.colTime}>{formatDate(row.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination controls */}
          {!loading && filteredResults.length > PAGE_SIZE && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => goToPage(1)}
                disabled={safePage === 1}
                title="First page"
              >
                «
              </button>
              <button
                className={styles.pageBtn}
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                title="Previous page"
              >
                ‹
              </button>

              {/* Page number pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className={styles.pageEllipsis}>…</span>
                  ) : (
                    <button
                      key={item}
                      className={`${styles.pageBtn} ${safePage === item ? styles.pageBtnActive : ''}`}
                      onClick={() => goToPage(item as number)}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                className={styles.pageBtn}
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                title="Next page"
              >
                ›
              </button>
              <button
                className={styles.pageBtn}
                onClick={() => goToPage(totalPages)}
                disabled={safePage === totalPages}
                title="Last page"
              >
                »
              </button>

              <span className={styles.pageInfo}>
                Page {safePage} of {totalPages} &nbsp;·&nbsp; {filteredResults.length} record{filteredResults.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.disclaimerContainer}>
          <HeartIcon className={styles.disclaimerIcon} />
          <span className={styles.disclaimerTitle}>Disclaimer</span>
          <HeartIcon className={styles.disclaimerIcon} />
          <p className={styles.disclaimerText}>{aboutData.disclaimer}</p>
        </div>
      </footer>
    </div>
      </div>
    </>
  );
};

export default HistoryPage;
