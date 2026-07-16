import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font, layout } from '../theme/theme';

type Props = {
  value?: string;
  placeholder?: string;
  onChangeText?: (t: string) => void;
  onBack?: () => void;
  onSubmit?: () => void;
  onPressField?: () => void; // treat the field as a button (Home screen)
  editable?: boolean;
  autoFocus?: boolean;
  /** Home screen has no back button and no horizontal padding of its own. */
  bare?: boolean;
};

/**
 * Search bar — Figma: height 48, padding 12px 16px, gap 12, radius 99,
 * border 1px #9A9A9A, placeholder Raleway 16/20 #9A9A9A, magnifier 24x24.
 */
export function SearchField({
  value,
  placeholder = 'Search for Products',
  onChangeText,
  onBack,
  onSubmit,
  onPressField,
  editable = true,
  autoFocus,
  bare,
}: Props) {
  const Field = onPressField ? Pressable : View;
  return (
    <View style={[styles.row, bare && { paddingHorizontal: 0 }]}>
      {onBack && (
        <Pressable hitSlop={10} onPress={onBack} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </Pressable>
      )}

      {/* Only a real button when it acts as one — a disabled Pressable wrapper
          would mark the whole field aria-disabled to assistive tech. */}
      <Field style={styles.field} onPress={onPressField}>
        <Ionicons name="search" size={24} color={colors.textMuted} />
        {onPressField ? (
          <Text style={[styles.input, !value && styles.placeholder]} numberOfLines={1}>
            {value || placeholder}
          </Text>
        ) : (
          <TextInput
            style={styles.input}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            editable={editable}
            autoFocus={autoFocus}
            returnKeyType="search"
          />
        )}
      </Field>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.gutter, gap: 4 },
  back: { paddingRight: 2, marginLeft: -4 },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: layout.searchBarHeight,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.textMuted,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: font.raleway,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textDark,
    padding: 0,
  },
  placeholder: { color: colors.textMuted },
});
