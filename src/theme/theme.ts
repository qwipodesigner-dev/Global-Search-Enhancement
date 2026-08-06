/**
 * Qwipo Retailer App — Global Search
 * Design tokens taken verbatim from the Figma CSS export.
 */

export const colors = {
  // ── Named tokens from Figma ──
  primary: '#2781E7', // Primary
  brand: '#BB77FF', // Brand Color (Qwipo "Q" mark)
  textDark: '#231F1F', // Text Dark
  textDark2: '#4F4F4F', // Text Dark 2
  textMuted: '#9A9A9A', // Text Muted
  grey: '#D3D3D3', // Grey
  bgGrey: '#F4F4F4', // Background Grey
  lightBlue: '#EFF6FF', // Light Blue
  white: '#FFFFFF', // White

  // ── Additional literals used in the export ──
  heading: '#1D2025', // card heading (Heading 3)
  subText: '#6B7280', // card sub-label
  cardBorder: '#E2E4E9', // card border
  logoBorder: 'rgba(128, 128, 128, 0.55)', // logo box border
  tileBg: '#FBFBFB', // brand circle background
  yellow: '#FBEE2F', // Sneha tile background

  // ── Product card tokens (from the Figma export) ──
  marginGreen: '#029664', // margin badge text + border, "Free Delivery"
  discountGreen: '#02BC7D', // Discounts button fill / receipt icon
  mrpRed: '#EE404C', // struck MRP

  // ── Semantic aliases (search UI) ──
  green: '#029664',
  greenSoft: '#E4F6EC',
  greenText: '#029664',
  danger: '#EE404C',

  // Back-compat aliases
  ink: '#231F1F',
  inkMuted: '#4F4F4F',
  inkFaint: '#9A9A9A',
  line: '#E2E4E9',
  lineStrong: '#D3D3D3',
  fieldBorder: '#9A9A9A',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F4F4',
  surfaceChip: '#F4F4F4',
  primarySoft: '#EFF6FF',
  primaryDark: '#1F66C4',
  brandPurple: '#BB77FF',
  brandPurpleBright: '#BB77FF',
};

/** Figma frame is 412px wide; layout constants come straight from the export. */
export const layout = {
  frameWidth: 412,
  gutter: 16, // padding: 0 16px
  statusBarHeight: 41,
  topNavHeight: 232,
  menuBarHeight: 63,
  homeIndicatorHeight: 14,
  bannerWidth: 300,
  bannerHeight: 150,
  distCardWidth: 126,
  distCardHeight: 138,
  logoBox: 64,
  brandTileWidth: 89,
  brandTileHeight: 108,
  brandCircle: 64,
  searchBarHeight: 48,
  sourceCardHeight: 72,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, gutter: 16 };

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 99, // border-radius: 99px
  full: 9999,
};

/** Inter is the Figma type family; Raleway is used for the search placeholder. */
export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  raleway: 'Raleway_400Regular',
  ralewaySemibold: 'Raleway_600SemiBold',
};

export const typography = {
  sectionTitle: { fontFamily: font.medium, fontSize: 14, lineHeight: 24, color: colors.textDark },
  seeAll: { fontFamily: font.medium, fontSize: 12, lineHeight: 24, color: colors.primary },
  cardHeading: { fontFamily: font.medium, fontSize: 14, lineHeight: 20, color: colors.heading },
  cardSub: { fontFamily: font.regular, fontSize: 12, lineHeight: 16, color: colors.subText },
  brandLabel: { fontFamily: font.medium, fontSize: 14, lineHeight: 18, color: colors.textDark2 },
  navLabel: { fontFamily: font.medium, fontSize: 12, lineHeight: 18 },
  body: { fontFamily: font.regular, fontSize: 14, color: colors.textDark },
  caption: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted },
};

export const shadow = {
  /** box-shadow: 0px 1px 4px rgba(0,0,0,0.1) — top nav */
  topNav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  /** box-shadow: 0px -2px 4px rgba(0,0,0,0.15) — bottom menu bar */
  menuBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  /** box-shadow: 0px 0px 6px rgba(0,0,0,0.15) — brand circles */
  circle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
};

export const theme = { colors, layout, spacing, radii, typography, shadow, font };
export type Theme = typeof theme;
