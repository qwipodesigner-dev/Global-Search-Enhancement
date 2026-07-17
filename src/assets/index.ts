/**
 * Real image assets exported from the Qwipo Figma file.
 * (Downscaled to ~3x display size; originals were up to 3508px.)
 */

/** Authorised Distributors home — hero banners. */
export const banners = [
  require('../../assets/qwipo/banners/hero1.png'),
  require('../../assets/qwipo/banners/hero2.png'),
  require('../../assets/qwipo/banners/hero3.png'),
  require('../../assets/qwipo/banners/hero4.png'),
];

/** Wholesalers home — promotional hero banners. */
export const wholesalerBanners = [
  require('../../assets/qwipo/banners/whol1-snack.png'),
  require('../../assets/qwipo/banners/whol2-rice.png'),
  require('../../assets/qwipo/banners/whol3-cooking.png'),
  require('../../assets/qwipo/banners/whol4-personal.png'),
];

export const ui = {
  /** Compact 2-line lockup (header). */
  digidukaanBlue: require('../../assets/qwipo/ui/digidukaan-blue.png'),
  /** Same compact lockup, greyscaled — used for the footer watermark. */
  digidukaanGrey: require('../../assets/qwipo/ui/digidukaan-grey.png'),
  /** Wide single-line variant from the export (kept for reference). */
  digidukaanWhite: require('../../assets/qwipo/ui/digidukaan-white.png'),
  tileDistributors: require('../../assets/qwipo/ui/tile-distributors.png'),
  tileWholesalers: require('../../assets/qwipo/ui/tile-wholesalers.png'),
};

/** Home-screen category cards (Groceries / FMCG big tiles). */
export const homeCards = {
  groceries: require('../../assets/qwipo/home/groceries-card.png'),
  fmcg: require('../../assets/qwipo/home/fmcg-card.png'),
};

export const products = {
  freedomSunflower1L: require('../../assets/qwipo/products/freedom-sunflower-1l.png'),
};

export const brandLogos = {
  freedom: require('../../assets/qwipo/brands/freedom.png'),
  nescafe: require('../../assets/qwipo/brands/nescafe.png'),
  ruchiGold: require('../../assets/qwipo/brands/ruchi-gold.png'),
  ajay: require('../../assets/qwipo/brands/ajay.png'),
  mysoreSandal: require('../../assets/qwipo/brands/mysore-sandal.png'),
  cycle: require('../../assets/qwipo/brands/cycle.png'),
  vicco: require('../../assets/qwipo/brands/vicco.png'),
  gdHing: require('../../assets/qwipo/brands/gd-hing.png'),
  asBrand: require('../../assets/qwipo/brands/as-brand.png'),
  madhurSugar: require('../../assets/qwipo/brands/madhur-sugar.png'),
  sneha: require('../../assets/qwipo/brands/sneha.png'),
  grb: require('../../assets/qwipo/brands/grb.png'),
  mtr: require('../../assets/qwipo/brands/mtr.png'),
  sriLalitha: require('../../assets/qwipo/brands/sri-lalitha.png'),
  fortune: require('../../assets/qwipo/brands/fortune.png'),
  zindaTilismath: require('../../assets/qwipo/brands/zinda-tilismath.png'),
  dwibhashi: require('../../assets/qwipo/brands/dwibhashi.png'),
  blackRose: require('../../assets/qwipo/brands/black-rose.png'),
  // Phase-one brand logos (clean single-mark artwork) — replace Nescafe on the home rails.
  aashirvaad: require('../../assets/qwipo/brands/aashirvaad.png'),
  tata: require('../../assets/qwipo/brands/tata.png'),
  himalaya: require('../../assets/qwipo/brands/himalaya.png'),
  doubleHorse: require('../../assets/qwipo/brands/double-horse.png'),
  eastern: require('../../assets/qwipo/brands/eastern.png'),
  priyaFoods: require('../../assets/qwipo/brands/priya-foods.png'),
  priyaGold: require('../../assets/qwipo/brands/priya-gold.png'),
  goldDrop: require('../../assets/qwipo/brands/gold-drop.png'),
  parrySugar: require('../../assets/qwipo/brands/parry-sugar.png'),
  nippo: require('../../assets/qwipo/brands/nippo.png'),
};

export type BrandKey = keyof typeof brandLogos;

/** Category artwork (Seller Store → Category Images 2), 42 categories. */
export const categoryImages = {
  attaFloursAndSooji: require('../../assets/qwipo/categories/atta-flours-and-sooji.jpg'),
  ayurvedic: require('../../assets/qwipo/categories/ayurvedic.jpg'),
  babyCare: require('../../assets/qwipo/categories/baby-care.jpg'),
  bakeryCakesDairy: require('../../assets/qwipo/categories/bakery-cakes-dairy.jpg'),
  beautyHygiene: require('../../assets/qwipo/categories/beauty-hygiene.jpg'),
  beverages: require('../../assets/qwipo/categories/beverages.jpg'),
  binsAndBathrooms: require('../../assets/qwipo/categories/bins-and-bathrooms.jpg'),
  cerealsAndBreakfast: require('../../assets/qwipo/categories/cereals-and-breakfast.jpg'),
  chocolatesAndBiscuits: require('../../assets/qwipo/categories/chocolates-and-biscuits.jpg'),
  cookingAndBakingNeeds: require('../../assets/qwipo/categories/cooking-and-baking-needs.jpg'),
  dairyAndCheese: require('../../assets/qwipo/categories/dairy-and-cheese.jpg'),
  dalsAndPulses: require('../../assets/qwipo/categories/dals-and-pulses.jpg'),
  detergentsAndDishwash: require('../../assets/qwipo/categories/detergents-and-dishwash.jpg'),
  eggsMeatFish: require('../../assets/qwipo/categories/eggs-meat-fish.jpg'),
  energyAndSoftDrinks: require('../../assets/qwipo/categories/energy-and-soft-drinks.jpg'),
  foodgrains: require('../../assets/qwipo/categories/foodgrains.jpg'),
  frozenSnacks: require('../../assets/qwipo/categories/frozen-snacks.jpg'),
  frozenVegetables: require('../../assets/qwipo/categories/frozen-vegetables.jpg'),
  fruitJuicesAndFruitDrinks: require('../../assets/qwipo/categories/fruit-juices-and-fruit-drinks.jpg'),
  fruitsAndVegetables: require('../../assets/qwipo/categories/fruits-and-vegetables.jpg'),
  giftVoucher: require('../../assets/qwipo/categories/gift-voucher.jpg'),
  gourmetWorldFoods: require('../../assets/qwipo/categories/gourmet-world-foods.jpg'),
  healthAndSafety: require('../../assets/qwipo/categories/health-and-safety.jpg'),
  indianSweets: require('../../assets/qwipo/categories/indian-sweets.jpg'),
  kitchenAccessories: require('../../assets/qwipo/categories/kitchen-accessories.jpg'),
  masalaSeasoning: require('../../assets/qwipo/categories/masala-seasoning.jpg'),
  oilGhee: require('../../assets/qwipo/categories/oil-ghee.jpg'),
  oralCare: require('../../assets/qwipo/categories/oral-care.jpg'),
  pastaSoupAndNoodles: require('../../assets/qwipo/categories/pasta-soup-and-noodles.jpg'),
  petCare: require('../../assets/qwipo/categories/pet-care.jpg'),
  picklesAndChutney: require('../../assets/qwipo/categories/pickles-and-chutney.jpg'),
  poojaNeeds: require('../../assets/qwipo/categories/pooja-needs.jpg'),
  readyToCookAndEat: require('../../assets/qwipo/categories/ready-to-cook-and-eat.jpg'),
  riceAndRiceProducts: require('../../assets/qwipo/categories/rice-and-rice-products.jpg'),
  saltSugarAndJaggery: require('../../assets/qwipo/categories/salt-sugar-and-jaggery.jpg'),
  saucesSpreadsAndDips: require('../../assets/qwipo/categories/sauces-spreads-and-dips.jpg'),
  snacksBrandedFoods: require('../../assets/qwipo/categories/snacks-branded-foods.jpg'),
  snacksAndNamkeen: require('../../assets/qwipo/categories/snacks-and-namkeen.jpg'),
  snacksDryFruitsNuts: require('../../assets/qwipo/categories/snacks-dry-fruits-nuts.jpg'),
  teaAndCoffee: require('../../assets/qwipo/categories/tea-and-coffee.jpg'),
  tinnedAndProcessedFood: require('../../assets/qwipo/categories/tinned-and-processed-food.jpg'),
  water: require('../../assets/qwipo/categories/water.jpg'),
};

export type CategoryImageKey = keyof typeof categoryImages;

