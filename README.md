# Qwipo — Global Search (React Native + TypeScript)

A pixel-faithful replication of the **Global Search** flow from the Qwipo Retailer
App redesign (Figma), built with **Expo + React Native + TypeScript**. This is the
UI foundation for the upcoming search MVPs.

## Screens replicated

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 1 | Home Page | `Home` | Header, location, search entry, Distributors/Wholesalers pills, promo banner, Distributors row, All Brands grid, bottom nav |
| 2 | Search (initial) | `SearchInitial` | Back + search field, empty body, autofocused input |
| 3 | Results – Distributors | `SearchResults` (tab 0) | Product cards: quantity chips, margin, price, Add, seller/delivery footer |
| 4 | Results – Wholesalers | `SearchResults` (tab 1) | Product cards with multiple seller options |
| 5 | Results – Empty state | `SearchResults` (no distributor results) | Open-box illustration + "Search in wholesaler" CTA |

## Flow

```
Home ──tap search──▶ SearchInitial ──type + enter──▶ SearchResults
                                                       ├─ Distributors tab
                                                       ├─ Wholesalers tab
                                                       └─ Empty state (when a tab has no results)
```

- Search **"Oil"** → distributor & wholesaler results (screens 3 & 4).
- Search **"Coffee"** (or anything without "oil"), Distributors tab → empty state (screen 5).

## Run it

```bash
cd QwipoSearchApp
npm run web      # opens in the browser (fastest to preview)
npm run ios      # iOS simulator (needs Xcode)
npm run android  # Android emulator
npm start        # Expo Dev Tools — scan QR with Expo Go
```

## Share a public link (for team feedback)

**Temporary link** — works only while your Mac stays awake and both commands run:

```bash
npx expo export -p web        # build static site into dist/
npx serve -s dist -l 8099     # serve it

# tunnel — prints "Forwarding HTTP traffic from https://….serveousercontent.com"
ssh -R 80:localhost:8099 serveo.net
```

> Note: `cloudflared --url` also works in general, but this network's DNS
> returns NXDOMAIN for `*.trycloudflare.com`, so use serveo here.

**Permanent link** — pick one (each needs a free account, log in as yourself):

```bash
# Expo's own hosting
npx eas login && npx eas deploy

# or Netlify — drag the dist/ folder onto https://app.netlify.com/drop
```

## Project structure

```
src/
  theme/theme.ts            Design tokens (colours, spacing, radii, typography)
  navigation/               React Navigation native stack + route types
  data/mock.ts              Mock products / brands / distributors
  components/
    DeviceStatusBar.tsx     iOS-style 9:41 status bar
    Logo.tsx                Qwipo wordmark
    SearchField.tsx         Rounded search input (button + editable modes)
    SegmentedTabs.tsx       Distributors / Wholesalers tabs
    QuantityChips.tsx       Scrollable quantity selector
    ProductCard.tsx         Distributor + wholesaler product card
    ProductThumb.tsx        Placeholder product image (see note below)
    EmptyState.tsx          "No products" body + CTA
    EmptyBox.tsx            Open-box SVG illustration
    BottomNav.tsx           Home / Reorder / Cart tab bar
    PhoneFrame.tsx          Centres the app in a device frame on wide screens
  screens/
    HomeScreen.tsx
    SearchInitialScreen.tsx
    SearchResultsScreen.tsx
```

## Notes on fidelity

- **Design tokens** live in `src/theme/theme.ts` — the single place to fine-tune
  exact colours/spacing once Figma Dev-Mode values are available.
- **Images are placeholders.** Brand logos and product photos are rendered as
  styled tiles / a stylised SVG (`ProductThumb`) because the raw assets couldn't be
  exported from the shared Figma view. Drop real assets into `assets/` and swap the
  placeholder components for `<Image />` when you have them.
- Layout, typography, colour language, and component structure follow the Figma
  frames closely; the token file makes any remaining pixel nudges trivial.

## Smart Search MVPs (built)

Four search MVPs are implemented on top of the mock catalog, mapping to the
Smart Global Search PRD:

| MVP | What it does | Where |
|-----|--------------|-------|
| **Autocomplete + zero-state** (Layer 4) | Recent searches & trending before typing; live suggestion dropdown (recent / terms / categories / brands / products) from 2 chars with a 300 ms debounce and match highlighting | `SearchInitialScreen`, `src/search/suggest.ts` |
| **Relevance + scoped search** (Layers 1–2) | Field-weighted scoring, typo/fuzzy tolerance, synonym & vernacular dictionary (`tel`→oil). Multi-token coverage so **“red label” returns Red Label tea, never red chilli**. Category/offer-scoped search with a context chip + “Search all products” fallback | `src/search/engine.ts`, `SearchResultsScreen` |
| **Personalized ranking** (Layer 5) | Existing retailer → previously-ordered boosted with a **“Your Usual”** badge + reorder subtitle; new retailer → **“Bestsellers in Your Area”**. Toggle personas via the demo switch on the search screen | `src/search/personalize.ts`, `src/context/SearchContext.tsx` |
| **Federated results** (Layer 3) | One query returns grouped **Brands / Categories / Offers / Distributors** alongside products | `src/search/engine.ts` (`federatedSearch`) |

### Try it
- Open search → toggle **Existing / New retailer** to see personalization change.
- Search **“oil”** → federated brands/categories + “Your Usual” Fortune Oil on top.
- Search **“red label”** → only Red Label tea (relevance fix).
- Search **“tel”** → oil (vernacular synonym).
- Tap the **Cooking Oil** category → scoped browse; search “shampoo” inside it → scoped fallback.

### Search module
```
src/search/
  engine.ts       relevance scoring, fuzzy match, synonyms, federated search, scoping
  suggest.ts      autocomplete suggestions (5 types)
  personalize.ts  Your Usual / Bestsellers ranking
src/context/
  SearchContext.tsx   recent searches + persona (demo)
src/data/catalog.ts   products, brands, categories, offers, distributors, order history, synonyms
```

The engine is a client-side mock of what a hosted search index (Typesense /
Meilisearch / Algolia / OpenSearch) would do server-side — swap `engine.ts`'s
functions for API calls to move to production.
