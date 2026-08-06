import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, layout } from '../theme/theme';
import { useCart, rupees } from '../context/CartContext';

/**
 * "Cart CTA" — Figma: 72 tall, padding 12, radius 16 16 0 0, shadow 0 -2px 4.
 * Left: Total Cart Value ₹1,245.45 + green "+ ₹12 Fees". Right: blue button —
 * "Cart" (opens the Cart Summary) everywhere except the cart itself, where it
 * reads "Checkout". Followed by the 14px home-indicator strip. Static values.
 */
export function CartBar({ checkout }: { checkout?: boolean }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { grandTotal } = useCart();
  return (
    <View>
      <View style={styles.bar}>
        <View style={styles.row}>
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Total Cart Value:</Text>
            <View style={styles.valueRow}>
              <Text style={styles.value}>₹{rupees(grandTotal)}</Text>
              <View style={styles.feeRow}>
                <Ionicons name="cube-outline" size={14} color={colors.marginGreen} />
                <Text style={styles.feeText}>+ ₹12 Fees</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.btn} onPress={checkout ? undefined : () => navigation.navigate('Cart')}>
            {!checkout && <Ionicons name="cart" size={20} color={colors.white} />}
            <Text style={styles.btnText}>{checkout ? 'Checkout' : 'Cart'}</Text>
          </Pressable>
        </View>
      </View>

      <HomeIndicator />
    </View>
  );
}

/** The 14px home-indicator strip on its own — for screens without the cart CTA. */
export function HomeIndicator() {
  return (
    <View style={styles.indicatorBar}>
      <View style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 72,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 },
  label: { fontFamily: font.regular, fontSize: 12, lineHeight: 16, color: colors.textMuted },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontFamily: font.regular, fontSize: 20, lineHeight: 20, color: colors.textDark },
  feeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  feeText: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.marginGreen },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    height: 48, paddingHorizontal: 12,
    backgroundColor: colors.primary, borderRadius: radii.lg,
  },
  btnText: { fontFamily: font.regular, fontSize: 20, lineHeight: 24, color: colors.white },

  indicatorBar: {
    height: layout.homeIndicatorHeight,
    backgroundColor: colors.white,
    borderTopWidth: 0.667,
    borderTopColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: { width: 64, height: 4, borderRadius: 6, backgroundColor: colors.grey },
});
