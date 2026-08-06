import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { CartBar, HomeIndicator } from '../components/CartBar';
import { EmptyBox } from '../components/EmptyBox';
import { useCart, CartSeller, rupees } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const GREEN = '#01771B'; // "Price dropped by" green from the design
/** Static reference value from the design (drops only exist on seeded lines). */
const PRICE_DROP = 50;

/**
 * Cart Summary (Figma "Cart") — one card per seller, fully dynamic: totals
 * follow line quantities, the MOV follows the selected delivery slot (beat
 * day = lower MOV), and a seller short of MOV gets the red "Add ₹ x More".
 * With nothing in the cart, the body is a centred empty state instead.
 */
export function CartScreen({ navigation }: Props) {
  const cart = useCart();
  const empty = cart.sellers.length === 0;

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar (Frame 7099) ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>Cart Summary</Text>
        </View>
      </View>

      {empty ? (
        <View style={styles.emptyWrap}>
          <EmptyBox />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Items you add will appear here.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {cart.sellers.map((s) => (
            <SellerCart
              key={s.id}
              seller={s}
              onSelectSlot={(i) => cart.selectSlot(s.id, i)}
              onViewItems={() => navigation.navigate('ViewItems', { sellerId: s.id })}
            />
          ))}
        </ScrollView>
      )}

      {empty ? <HomeIndicator /> : <CartBar checkout />}
    </View>
  );
}

/** One "Seller Level Combined cart" card. */
function SellerCart({
  seller, onSelectSlot, onViewItems,
}: { seller: CartSeller; onSelectSlot: (i: number) => void; onViewItems: () => void }) {
  const short = seller.shortfall > 0;
  return (
    <View style={styles.card}>
      {/* seller total row */}
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
          <View style={styles.inline4}>
            <Ionicons name="arrow-down-circle-outline" size={16} color={GREEN} />
            <Text style={styles.dim}>Price dropped by</Text>
            <Text style={styles.dropValue}>₹ {PRICE_DROP}</Text>
          </View>
        </View>
      </View>

      {/* Free Delivery + MOV | Add More / View items */}
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

        <View style={styles.btnRow}>
          <Pressable style={[styles.pillBtn, short && styles.pillBtnRed]}>
            <Ionicons name="add" size={12} color={short ? colors.mrpRed : colors.primary} />
            <Text style={[styles.pillTxt, short && styles.pillTxtRed]}>
              {short ? `Add ₹ ${rupees(seller.shortfall)} More` : 'Add More'}
            </Text>
          </Pressable>
          <Pressable style={styles.pillBtn} onPress={onViewItems}>
            <Text style={styles.pillTxt}>View items</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.divider} />

      {/* SKU strip — tile caption is (qty) + computed line total */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skuRow}>
        {seller.lines.map((l) => (
          <View key={l.id} style={styles.sku}>
            <View style={styles.skuFrame}>
              <Image source={l.image} style={styles.skuImg} resizeMode="contain" />
            </View>
            <Text style={styles.skuPrice}>({l.qty}){'\n'}₹ {rupees(l.qty * l.unitPrice)}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Delivery by — selecting a slot changes the MOV */}
      <Text style={styles.deliveryLabel}>Delivery by</Text>
      <View style={styles.slotRow}>
        {seller.slots.map((d, i) => {
          const single = seller.slots.length === 1;
          const on = i === seller.selectedSlot;
          return (
            <Pressable
              key={i}
              onPress={() => onSelectSlot(i)}
              style={[
                styles.slot,
                on ? styles.slotOn : styles.slotOff,
                single ? styles.slotSingle : { flex: 1 },
              ]}
            >
              {!single && (
                <Ionicons
                  name={on ? 'radio-button-on' : 'radio-button-off'}
                  size={14}
                  color={on ? colors.primary : colors.textDark2}
                />
              )}
              <Text style={on ? styles.slotTxtOn : styles.slotTxtOff}>{d.label}</Text>
            </Pressable>
          );
        })}
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

  // Frame 7345: padding 12 4, gap 16
  scroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 16 },

  // Seller card: white, radius 8, padding 12, gap 8
  card: { backgroundColor: colors.white, borderRadius: radii.md, padding: 12, gap: 8 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  inline4: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dim: { fontFamily: font.regular, fontSize: 10, lineHeight: 16, color: '#505050' },
  sellerName: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, color: colors.primary },
  totalValue: { fontFamily: font.medium, fontSize: 14, lineHeight: 16, color: colors.primary },
  dropValue: { fontFamily: font.semibold, fontSize: 10, lineHeight: 16, color: GREEN },

  movRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 },
  freeTxt: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.marginGreen },
  movLabel: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: '#505050' },
  movValue: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.marginGreen },

  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 24, paddingHorizontal: 8,
    borderWidth: 1, borderColor: colors.primary, borderRadius: 4,
  },
  pillBtnRed: { borderColor: colors.mrpRed },
  pillTxt: { fontFamily: font.semibold, fontSize: 10, lineHeight: 16, color: colors.primary },
  pillTxtRed: { color: colors.mrpRed },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.grey },

  skuRow: { gap: 8, paddingVertical: 4 },
  sku: { width: 80, alignItems: 'center', gap: 8 },
  skuFrame: {
    width: 80, height: 96,
    backgroundColor: '#FBFBFB',
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#B5B5B5',
    borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  skuImg: { width: 72, height: 72 },
  skuPrice: { fontFamily: font.regular, fontSize: 10, lineHeight: 16, color: '#1B1B1B', textAlign: 'center' },

  deliveryLabel: { fontFamily: font.medium, fontSize: 12, lineHeight: 20, color: colors.textDark2 },
  slotRow: { flexDirection: 'row', gap: 12 },
  slot: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    height: 30, paddingHorizontal: 8,
    borderWidth: 1, borderRadius: 4,
  },
  slotOn: { borderColor: colors.primary },
  slotOff: { borderColor: colors.textDark2 },
  slotSingle: { width: 167, alignSelf: 'flex-start' },
  slotTxtOn: { fontFamily: font.medium, fontSize: 12, color: colors.primary },
  slotTxtOff: { fontFamily: font.medium, fontSize: 12, color: colors.textDark2 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 4 },
  emptyTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.textDark, marginTop: 14 },
  emptySub: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted },
});
