import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, font, layout } from '../theme/theme';

const ITEMS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'reorder', label: 'Reorder', icon: 'repeat' },
  { key: 'cart', label: 'Cart', icon: 'cart-outline' },
];

/**
 * "Menu Bar" — height 63, padding 12px 40px, space-between, shadow 0 -2px 4 rgba(0,0,0,0.15),
 * 48px vertical dividers (#F4F4F4), labels Inter 12/18. Active #2781E7, inactive #9A9A9A.
 * Followed by the 14px home indicator ("Bottom Nav Bar").
 */
export function BottomNav({ active = 'home' }: { active?: string }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const go = (key: string) => {
    if (key === active) return;
    if (key === 'home') navigation.popToTop();
    if (key === 'reorder') navigation.navigate('Reorder');
    if (key === 'cart') navigation.navigate('Cart');
  };
  return (
    <View>
      <View style={styles.bar}>
        {ITEMS.map((it, i) => {
          const on = it.key === active;
          const color = on ? colors.primary : colors.textMuted;
          return (
            <React.Fragment key={it.key}>
              {i > 0 && <View style={styles.divider} />}
              <Pressable style={styles.item} onPress={() => go(it.key)}>
                <Ionicons name={it.icon} size={24} color={color} />
                <Text style={[styles.label, { color, fontFamily: on ? font.medium : font.regular }]}>
                  {it.label}
                </Text>
              </Pressable>
            </React.Fragment>
          );
        })}
      </View>

      {/* Home indicator */}
      <View style={styles.indicatorBar}>
        <View style={styles.indicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.menuBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: colors.white,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 8,
    },
  },
  item: { alignItems: 'center', gap: 8 },
  label: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  divider: { width: 1, height: 48, backgroundColor: colors.bgGrey },

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
