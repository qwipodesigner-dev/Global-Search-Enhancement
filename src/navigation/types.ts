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
  CategoryGrid: { group: 'groceries' | 'fmcg' };
  /** Authorised Distributors directory; pass sellerId to isolate one seller. */
  DistributorList: { sellerId?: string } | undefined;
  /** Previously-ordered items, split Wholesalers / Distributors. */
  Reorder: undefined;
  /** Cart Summary — seller-level combined carts. */
  Cart: undefined;
  /** One seller's cart lines with steppers + delete. */
  ViewItems: { sellerId: string };
  /** Saved delivery locations + apply. */
  YourLocation: undefined;
  /** New-address form; submits for backend approval. */
  AddLocation: undefined;
  /** Account menu: orders, payments, credit partners, notifications. */
  Profile: undefined;
  /** Retailer's shop profile (Figma "My Details"). */
  BusinessDetails: undefined;
  /** Promo pushes; from the Home bell or the Profile menu. */
  Notifications: undefined;
  /** Empty state — app is cash-on-delivery only for now. */
  Payments: undefined;
  /** Empty state — credit options not live yet. */
  CreditPartners: undefined;
  /** Support info + business advisor. */
  ContactUs: undefined;
};
