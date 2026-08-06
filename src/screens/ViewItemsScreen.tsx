import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { EmptyBox } from '../components/EmptyBox';
import { useCart, rupees } from '../context/CartContext';
import { CartLine } from '../data/cartData';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewItems'>;

const GREEN = '#01771B';
const PRICE_DROP = 50;

/**
 * View Items (Figma "View Items - MOV Met" / "- MOV Not Met") — one seller's
 * cart lines with steppers and delete. All numbers are live: the header total,
 * item count, MOV (from the slot chosen on Cart Summary) and the Add More CTA
 * (blue when MOV is met, red "Add ₹ x More" when short) track every change.
 */
export function ViewItemsScreen({ navigation, route }: Props) {
  const cart = useCart();
  const seller = cart.sellerById(route.params.sellerId);
  const short = (seller?.shortfall ?? 0) > 0;
  const hasDrop = !!seller?.lines.some((l) => l.drop);

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar (Frame 7099) ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>View Items</Text>
        </View>
      </View>

      {!seller ? (
        /* Every line deleted — nothing left from this seller. */
        <View style={styles.emptyWrap}>
          <EmptyBox />
          <Text style={styles.emptyTitle}>No items from this seller</Text>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={styles.emptyLink}>Back to Cart Summary</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* ── Frame 40050 — seller header ── */}
          <View style={styles.sellerBlock}>
            <View style={styles.headerRow}>
              <View style={{ gap: 4 }}>
                <Text style={styles.dim}>Buying from</Text>
                <Text style={styles.sellerName}>{seller.name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View style={styles.inline4}>
                  <Text style={styles.dim}>Total:</Text>
                  <Text style={styles.totalValue}>₹ {rupees(seller.total)}</Text>
                </View>
                {hasDrop && (
                  <View style={styles.inline4}>
                    <Ionicons name="arrow-down-circle-outline" size={16} color={GREEN} />
                    <Text style={styles.dim}>Price dropped by</Text>
                    <Text style={styles.dropValue}>₹ {PRICE_DROP}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inline4}>
              <Text style={styles.movLabel}>Total Items:</Text>
              <Text style={styles.itemsCount}>{seller.lines.length}</Text>
            </View>

            <View style={styles.movRow}>
              <View style={{ gap: 4, paddingVertical: 4 }}>
                <View style={styles.inline4}>
                  <Ionicons name="cube-outline" size={12} color={colors.marginGreen} />
                  <Text style={styles.freeTxt}>Free Delivery</Text>
                </View>
                <View style={styles.inline4}>
                  <Text style={styles.movLabel}>Min. Order Value:</Text>
                  <Text style={styles.movValue}>₹ {rupees(seller.mov)}</Text>
                </View>
              </View>

              {/* MOV met → filled blue; short → red bordered with the gap amount */}
              {short ? (
                <Pressable style={styles.addMoreRed}>
                  <Ionicons name="add" size={14} color={colors.mrpRed} />
                  <Text style={styles.addMoreRedTxt}>Add ₹ {rupees(seller.shortfall)} More</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.addMoreBlue}>
                  <Ionicons name="add" size={14} color={colors.white} />
                  <Text style={styles.addMoreBlueTxt}>Add More</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* ── Frame 40049 — item cards ── */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {seller.lines.map((l) => (
              <ItemCard
                key={l.id}
                line={l}
                onQty={(q) => cart.setQty(seller.id, l.id, q)}
                onDelete={() => cart.removeLine(seller.id, l.id)}
              />
            ))}
          </ScrollView>
        </>
      )}

      <HomeIndicator />
    </View>
  );
}

/** One "View Items - Regular" card: image + name + delete, prices + stepper. */
function ItemCard({
  line, onQty, onDelete,
}: { line: CartLine; onQty: (q: number) => void; onDelete: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.imgFrame}>
          <Image source={line.image} style={styles.img} resizeMode="contain" />
        </View>
        <Text style={styles.name} numberOfLines={2}>{line.name}</Text>
        <Pressable style={styles.deleteBtn} onPress={onDelete} hitSlop={6}>
          <Ionicons name="trash" size={14} color={colors.mrpRed} />
        </Pressable>
      </View>

      <View style={styles.cardBottom}>
        <View style={{ gap: 8 }}>
          <View style={styles.inline4}>
            <Text style={styles.mrpTxt}>MRP</Text>
            <Text style={styles.mrpTxt}>₹ {rupees(line.mrp)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹ {rupees(line.unitPrice)}</Text>
            {!!line.drop && (
              <View style={styles.dropChip}>
                <Ionicons name="arrow-down-circle-outline" size={8} color={colors.white} />
                <Text style={styles.dropChipTxt}>₹ {line.drop}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stepper: minimum 1 — removing the line is the trash button's job */}
        <View style={styles.stepper}>
          <Pressable onPress={() => onQty(line.qty - 1)} hitSlop={6}>
            <Ionicons name="remove" size={20} color={colors.primary} />
          </Pressable>
          <Text style={styles.stepperQty}>{line.qty}</Text>
          <Pressable onPress={() => onQty(line.qty + 1)} hitSlop={6}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgGrey },

  topNav: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    ...shadow.topNav, zIndex: 10,
  },
  navBody: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 16, height: 56 },
  iconBtn: {
    width: 40, height: 40, borderRadius: radii.md,
    backgroundColor: colors.bgGrey, alignItems: 'center', justifyContent: 'center',
  },
  heading: { flex: 1, fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: colors.textDark },

  // Frame 40050 — white seller header, gap 2
  sellerBlock: { backgroundColor: colors.white, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16, gap: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  inline4: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dim: { fontFamily: font.regular, fontSize: 10, lineHeight: 16, color: '#505050' },
  sellerName: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, color: colors.primary },
  totalValue: { fontFamily: font.medium, fontSize: 14, lineHeight: 16, color: colors.primary },
  dropValue: { fontFamily: font.semibold, fontSize: 10, lineHeight: 16, color: GREEN },
  itemsCount: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.primary },

  movRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 },
  freeTxt: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.marginGreen },
  movLabel: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: '#505050' },
  movValue: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.marginGreen },

  addMoreBlue: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 32, paddingHorizontal: 16,
    backgroundColor: colors.primary, borderRadius: 4,
  },
  addMoreBlueTxt: { fontFamily: font.semibold, fontSize: 12, lineHeight: 16, color: colors.white },
  addMoreRed: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 32, paddingHorizontal: 16,
    borderWidth: 1, borderColor: colors.mrpRed, borderRadius: 4,
  },
  addMoreRedTxt: { fontFamily: font.semibold, fontSize: 12, lineHeight: 16, color: colors.mrpRed },

  // Frame 40049 — item cards, padding 12 16, gap 12
  scroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },

  // View Items - Regular: #FBFBFB, radius 8, shadow 0 0 4, padding 12, gap 12
  card: {
    backgroundColor: '#FBFBFB', borderRadius: radii.md, padding: 12, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  imgFrame: {
    width: 56, height: 56,
    backgroundColor: '#FBFBFB',
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#B5B5B5',
    borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  img: { width: 50, height: 50 },
  name: { flex: 1, fontFamily: font.medium, fontSize: 16, lineHeight: 21, color: colors.textDark },
  deleteBtn: {
    width: 25, height: 26, borderRadius: 4,
    backgroundColor: '#FFDFDF',
    alignItems: 'center', justifyContent: 'center',
  },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  mrpTxt: { fontFamily: font.regular, fontSize: 10, lineHeight: 12, color: colors.textMuted },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontFamily: font.semibold, fontSize: 16, letterSpacing: -0.48, color: colors.textDark },
  dropChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 3, height: 16,
    backgroundColor: GREEN, borderRadius: 2,
  },
  dropChipTxt: { fontFamily: font.regular, fontSize: 8, lineHeight: 10, color: colors.white },

  stepper: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    height: 36, paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.primary, borderRadius: radii.md,
  },
  stepperQty: {
    minWidth: 18, textAlign: 'center',
    fontFamily: font.semibold, fontSize: 16, lineHeight: 24, color: colors.primary,
  },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 4 },
  emptyTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.textDark, marginTop: 14 },
  emptyLink: { fontFamily: font.medium, fontSize: 13, color: colors.primary, marginTop: 6 },
});
