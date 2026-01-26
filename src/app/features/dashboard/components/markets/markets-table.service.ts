import { computed, inject, Injectable, signal } from '@angular/core';
import { MarketService } from '../../service/market.service';

/**
 * Markets Table Store
 *
 * Manages UI state for the Markets table component:
 * - Search filtering
 * - Category selection
 * - View mode (list/grid)
 * - Pagination
 *
 * This store follows the presentational component pattern,
 * separating UI state from domain logic (MarketService).
 */
@Injectable({
  providedIn: 'root',
})
export class MarketsTableStore {
  private readonly marketService = inject(MarketService);

  // ========================================
  // STATE
  // ========================================

  /**
   * Table UI state (mutable signal)
   */
  private readonly _state = signal({
    searchTerm: '',
    selectedCategory: 'all',
    viewMode: 'list' as 'list' | 'grid',
    currentPage: 1,
    itemsPerPage: 5,
  });

  /**
   * Public readonly state accessor
   */
  readonly state = this._state.asReadonly();

  // ========================================
  // COMPUTED SIGNALS (Derived State)
  // ========================================

  /**
   * Assets filtered by search term and category
   */
  readonly filteredAssets = computed(() => {
    const state = this._state();
    const term = state.searchTerm.toLowerCase();
    const category = state.selectedCategory;
    let assets = this.marketService.assets();

    // Filter by search (name or symbol)
    if (term) {
      assets = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(term) ||
          asset.symbol.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (category === 'trending') {
      assets = [...assets].sort((a, b) => b.change24h - a.change24h);
    }

    return assets;
  });

  /**
   * Paginated assets for current page
   */
  readonly paginatedAssets = computed(() => {
    const state = this._state();
    const assets = this.filteredAssets();
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    return assets.slice(start, end);
  });

  /**
   * Total number of pages
   */
  readonly totalPages = computed(() => {
    const state = this._state();
    return Math.ceil(this.filteredAssets().length / state.itemsPerPage);
  });

  /**
   * Visible page numbers with ellipsis support
   */
  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this._state().currentPage;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('...');
      }

      pages.push(total);
    }

    return pages;
  });

  /**
   * Complete pagination data for UI
   */
  readonly paginationData = computed(() => {
    const state = this._state();
    const filtered = this.filteredAssets();

    return {
      currentPage: state.currentPage,
      totalPages: this.totalPages(),
      visiblePages: this.visiblePages(),
      showingFrom: filtered.length === 0 ? 0 : (state.currentPage - 1) * state.itemsPerPage + 1,
      showingTo: Math.min(state.currentPage * state.itemsPerPage, filtered.length),
      totalEntries: filtered.length,
    };
  });

  // ========================================
  // METHODS (State Updates)
  // ========================================

  /**
   * Update search term and reset to first page
   */
  updateSearchTerm(term: string): void {
    this._state.update((state) => ({
      ...state,
      searchTerm: term,
      currentPage: 1, // Reset pagination
    }));
  }

  /**
   * Update category filter and reset to first page
   */
  updateCategory(category: string): void {
    this._state.update((state) => ({
      ...state,
      selectedCategory: category,
      currentPage: 1, // Reset pagination
    }));
  }

  /**
   * Toggle between list and grid view modes
   */
  updateViewMode(mode: 'list' | 'grid'): void {
    this._state.update((state) => ({
      ...state,
      viewMode: mode,
    }));
  }

  /**
   * Navigate to specific page
   */
  goToPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this._state.update((state) => ({
        ...state,
        currentPage: page,
      }));
    }
  }

  /**
   * Navigate to next page
   */
  nextPage(): void {
    const state = this._state();
    const total = this.totalPages();
    if (state.currentPage < total) {
      this._state.update((s) => ({
        ...s,
        currentPage: s.currentPage + 1,
      }));
    }
  }

  /**
   * Navigate to previous page
   */
  previousPage(): void {
    const state = this._state();
    if (state.currentPage > 1) {
      this._state.update((s) => ({
        ...s,
        currentPage: s.currentPage - 1,
      }));
    }
  }
}
