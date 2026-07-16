export type ScopeParam = { kind: 'all' | 'category' | 'offer'; id?: string; label?: string };

/**
 * Everything the Product List page needs to render its header.
 * The screen derives the product count + subheading from `filter`, so any
 * entry point (brand / distributor / category, from Home or Search) lands on
 * the same screen with the right heading, subheading and breadcrumbs.
 */
export type ListContext = {
  /** Top-line heading, e.g. "Shri Sai Krishna Traders". */
  title: string;
  /** Breadcrumb trail, e.g. ["Distributors", "Shri Sai Krishna Traders", "Freedom"]. */
  crumbs: string[];
  /** What to list. Any combination is allowed. */
  filter: {
    distributor?: string;
    brand?: string;
    category?: string;
    source?: 'distributor' | 'wholesaler';
  };
  /** Optional lead-in for the subheading; defaults to brand → category. */
  subtitleLabel?: string;
};

export type RootStackParamList = {
  Home: undefined;
  SearchInitial: { scope?: ScopeParam } | undefined;
  SearchResults: {
    query: string;
    scope?: ScopeParam;
    tab?: 'distributors' | 'wholesalers';
  };
  ProductList: ListContext;
};
