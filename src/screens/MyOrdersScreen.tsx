import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { BottomSheet } from '../components/BottomSheet';
import { orders, Order, OrderStatus } from '../data/orders';

type Props = NativeStackScreenProps<RootStackParamList, 'MyOrders'>;

const WHOLESALE_PURPLE = '#8B46E6'; // same coding as the search-result badges
const GREEN_TXT = '#16A34A';
const CHECK_GREEN = '#01966A'; // Positive #02BC7D under the design's 20% black overlay

const STATUS: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
  placed: { label: 'Order Placed', bg: '#F9E8E8', fg: colors.mrpRed },
  out_for_delivery: { label: 'Out for delivery', bg: '#DCFCE7', fg: GREEN_TXT },
  delivered: { label: 'Delivered', bg: '#F1F1F1', fg: colors.textMuted },
};

type SellerFilter = 'all' | 'distributor' | 'wholesaler';
const FILTER_LABEL: Record<SellerFilter, string> = {
  all: 'All',
  distributor: 'Distributors',
  wholesaler: 'Wholesalers',
};

/** Tracking timeline stages + how far each order status has progressed. */
const STAGES = ['Placed', 'Confirmed', 'In Progress', 'Out for Delivery', 'Delivered'];
const STAGES_DONE: Record<OrderStatus, number> = {
  placed: 1,
  out_for_delivery: 3, // Placed/Confirmed/In Progress done, now heading out
  delivered: 5,
};

/**
 * My Orders (Figma "My Orders - Distributors") — a single order list. The
 * nav's filter icon opens the seller-type bottom sheet; a chip above the list
 * appears only while a specific seller type is applied. Track Order opens the
 * "Tracking Details" sheet (Figma "Track Order") with the order's timeline.
 */
export function MyOrdersScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<SellerFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  /** Selection inside the sheet; committed on Apply. */
  const [draft, setDraft] = useState<SellerFilter>('all');
  const [tracking, setTracking] = useState<Order | null>(null);

  const list = useMemo(
    () => (filter === 'all' ? orders : orders.filter((o) => o.source === filter)),
    [filter]
  );

  const openFilter = () => { setDraft(filter); setFilterOpen(true); };
  const applyDraft = () => { setFilter(draft); setFilterOpen(false); };

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>My Orders</Text>
          <Pressable style={styles.iconBtn} onPress={openFilter}>
            <Ionicons name="options-outline" size={22} color={colors.textDark} />
          </Pressable>
        </View>
      </View>

      {/* ── Applied filter chip — only when a specific seller type is on ── */}
      {filter !== 'all' && (
        <View style={styles.chipRow}>
          <View style={styles.filterChip}>
            <Ionicons name="funnel" size={12} color={colors.primary} />
            <Text style={styles.filterChipTxt}>{FILTER_LABEL[filter]}</Text>
            <Pressable onPress={() => setFilter('all')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.textDark2} />
            </Pressable>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {list.map((o) => (
          <OrderCard key={o.id} order={o} onTrack={() => setTracking(o)} />
        ))}
      </ScrollView>

      <HomeIndicator />

      {/* ── Filter bottom sheet ── */}
      <BottomSheet visible={filterOpen} title="Filter by seller type" onClose={() => setFilterOpen(false)}>
        <View style={styles.filterBody}>
          {(Object.keys(FILTER_LABEL) as SellerFilter[]).map((f) => {
            const on = f === draft;
            return (
              <Pressable key={f} style={styles.optionRow} onPress={() => setDraft(f)}>
                <Text style={on ? styles.optionTxtOn : styles.optionTxt}>{FILTER_LABEL[f]}</Text>
                <Ionicons
                  name={on ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={on ? colors.primary : colors.textDark2}
                />
              </Pressable>
            );
          })}
          <Pressable style={styles.applyBtn} onPress={applyDraft}>
            <Text style={styles.applyTxt}>Apply Filter</Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* ── Tracking Details bottom sheet (Figma "Track Order") ── */}
      <BottomSheet visible={!!tracking} title="Tracking Details" onClose={() => setTracking(null)}>
        <View style={styles.trackBody}>
          {STAGES.map((stage, i) => {
            const done = !!tracking && i < STAGES_DONE[tracking.status];
            return (
              <React.Fragment key={stage}>
                {i > 0 && <View style={styles.connector} />}
                <View style={styles.stageRow}>
                  <Ionicons
                    name={done ? 'checkmark-circle' : 'radio-button-on'}
                    size={24}
                    color={done ? CHECK_GREEN : colors.textMuted}
                  />
                  <Text style={styles.stageTxt}>{stage}</Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

/** One "Order Card" from the design; the source badge sits under the seller name. */
function OrderCard({ order, onTrack }: { order: Order; onTrack: () => void }) {
  const st = STATUS[order.status];
  const active = order.status !== 'delivered';
  const isDist = order.source === 'distributor';

  return (
    <View style={styles.card}>
      {/* seller (+ source badge below) | status */}
      <View style={styles.rowTop}>
        <View style={styles.sellerWrap}>
          <Text style={styles.seller} numberOfLines={2}>{order.seller}</Text>
          <View style={[styles.sourceBadge, { backgroundColor: isDist ? colors.primary : WHOLESALE_PURPLE }]}>
            <Ionicons name={isDist ? 'storefront' : 'business'} size={10} color={colors.white} />
            <Text style={styles.sourceTxt}>{isDist ? 'Distributor' : 'Wholesaler'}</Text>
          </View>
        </View>
        <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
          <Text style={[styles.statusTxt, { color: st.fg }]}>{st.label}</Text>
        </View>
      </View>

      {/* items/date + order number chip */}
      <View style={styles.rowBetween}>
        <Text style={styles.meta}>{order.items} items - Placed {order.placed}</Text>
        <Pressable style={styles.numberChip}>
          <Text style={styles.numberTxt}>{order.number}</Text>
          <Ionicons name="copy-outline" size={12} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* grand total / expected delivery band */}
      <View style={styles.band}>
        <View style={{ gap: 8 }}>
          <Text style={styles.bandLabel}>Grand Total</Text>
          <Text style={styles.bandValue}>₹ {order.total}</Text>
        </View>
        <View style={{ gap: 8, alignItems: 'flex-end' }}>
          <Text style={styles.bandLabel}>Expected Delivery</Text>
          <Text style={styles.bandValue}>{order.expected}</Text>
        </View>
      </View>

      {/* actions */}
      {active ? (
        <>
          <View style={styles.btnRow}>
            <Pressable style={styles.cancelBtn}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.trackBtn} onPress={onTrack}>
              <Text style={styles.trackTxt}>Track Order</Text>
            </Pressable>
          </View>
          {!!order.cancelBefore && (
            <Text style={styles.cancelNote}>
              You can cancel this order before {order.cancelBefore}
            </Text>
          )}
        </>
      ) : (
        <Pressable style={styles.invoiceBtn}>
          <Ionicons name="receipt-outline" size={16} color={colors.primary} />
          <Text style={styles.invoiceTxt}>Invoice</Text>
        </Pressable>
      )}
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

  // Applied filter — same chip construction as the search scope chip
  chipRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 2 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.lightBlue, borderRadius: radii.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  filterChipTxt: { fontFamily: font.medium, fontSize: 12, color: colors.primary },

  scroll: { paddingHorizontal: 12, paddingVertical: 12, gap: 16 },

  // Order Card: #FBFBFB, radius 8, shadow 0 0 10 rgba(0,0,0,0.1), padding 12, gap 9
  card: {
    backgroundColor: '#FBFBFB', borderRadius: radii.md,
    padding: 12, gap: 9,
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
  },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },

  // Badge stacked under the name so long seller names never fight it for width
  sellerWrap: { flex: 1, gap: 6, alignItems: 'flex-start' },
  seller: { fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.primary },
  sourceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: radii.sm,
  },
  sourceTxt: { fontFamily: font.bold, fontSize: 9.5, color: colors.white },

  statusPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.pill },
  statusTxt: { fontFamily: font.medium, fontSize: 12, lineHeight: 12 },

  meta: { fontFamily: font.regular, fontSize: 12, lineHeight: 20, color: colors.textMuted },
  numberChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: colors.lightBlue, borderRadius: radii.pill,
  },
  numberTxt: { fontFamily: font.medium, fontSize: 12, lineHeight: 12, color: colors.primary },

  band: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F1F1F1', borderRadius: radii.md, padding: 12,
  },
  bandLabel: { fontFamily: font.medium, fontSize: 10, lineHeight: 10, color: colors.textDark2 },
  bandValue: { fontFamily: font.medium, fontSize: 14, lineHeight: 14, color: colors.primary },

  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cancelBtn: {
    flex: 1, height: 36, borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.mrpRed,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelTxt: { fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.mrpRed },
  trackBtn: {
    flex: 1, height: 36, borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  trackTxt: { fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: '#FBFBFB' },
  cancelNote: {
    fontFamily: font.medium, fontSize: 11, lineHeight: 20,
    color: colors.textMuted, textAlign: 'center',
  },

  invoiceBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 36, borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.primary,
  },
  invoiceTxt: { fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.primary },

  // ── Filter sheet body ──
  filterBody: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.grey,
  },
  optionTxt: { fontFamily: font.regular, fontSize: 15, color: colors.textDark },
  optionTxtOn: { fontFamily: font.semibold, fontSize: 15, color: colors.primary },
  applyBtn: {
    height: 48, borderRadius: radii.md, marginTop: 16,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  applyTxt: { fontFamily: font.semibold, fontSize: 16, color: colors.white },

  // ── Tracking sheet body (Frame 7160: padding 24, gap 8) ──
  trackBody: { padding: 24, gap: 8 },
  stageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    height: 40, paddingHorizontal: 8,
    backgroundColor: colors.bgGrey, borderRadius: radii.md,
  },
  stageTxt: { fontFamily: font.medium, fontSize: 18, lineHeight: 20, color: colors.textDark },
  // 32px vertical link under the icon column
  connector: { width: 2, height: 32, marginLeft: 19, backgroundColor: '#888888' },
});
