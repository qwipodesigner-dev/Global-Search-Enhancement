import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { useLocations } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLocation'>;

/**
 * Add New Location (reference screen). The locate icon stands in for the
 * device GPS + reverse geocoding: it fills the coordinates and every address
 * field, all of which stay editable. "Send Approval Request" submits the
 * address to the backend; it appears under Saved Addresses as pending and
 * becomes selectable once approved.
 */
export function AddLocationScreen({ navigation }: Props) {
  const { submitForApproval } = useLocations();
  const [coords, setCoords] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [touched, setTouched] = useState(false);

  /** Reference geodata (Figma flow) — a real build would call the GPS here. */
  const detect = () => {
    setCoords('17.4856111, 78.3979607');
    setStreet('Road Number 2');
    setArea('Kukatpally');
    setCity('Hyderabad');
    setState('Telangana');
    setPincode('500072');
  };

  const complete = !!(coords && street && area && city && state && pincode);

  const submit = () => {
    setTouched(true);
    if (!complete) return;
    submitForApproval({ coords, street, area, city, state, pincode });
    navigation.goBack(); // back to Your Location, where it lists as pending
  };

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>Add New Location</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Field label="Location" required missing={touched && !coords}>
          <TextInput
            style={styles.input}
            value={coords}
            onChangeText={setCoords}
            placeholder=""
          />
          <Pressable onPress={detect} hitSlop={10}>
            <Ionicons name="navigate" size={22} color={coords ? colors.primary : colors.grey} />
          </Pressable>
        </Field>

        <Field label="D.No & Street" required missing={touched && !street}>
          <TextInput style={styles.input} value={street} onChangeText={setStreet} />
        </Field>

        <Field label="Area" required missing={touched && !area}>
          <TextInput style={styles.input} value={area} onChangeText={setArea} />
        </Field>

        <Field label="City" required missing={touched && !city}>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        </Field>

        <Field label="State" required missing={touched && !state}>
          <TextInput style={styles.input} value={state} onChangeText={setState} />
          <Ionicons name="chevron-forward" size={18} color={colors.textDark2} />
        </Field>

        <Field label="Pincode" required missing={touched && !pincode}>
          <TextInput
            style={styles.input}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />
        </Field>
      </ScrollView>

      {/* ── Send Approval Request ── */}
      <View style={styles.footer}>
        <Pressable style={[styles.sendBtn, !complete && touched && styles.sendBtnDim]} onPress={submit}>
          <Text style={styles.sendTxt}>Send Approval Request</Text>
        </Pressable>
      </View>
      <HomeIndicator />
    </View>
  );
}

/** White rounded field card: floating label + red asterisk, content row below. */
function Field({
  label, required, missing, children,
}: { label: string; required?: boolean; missing?: boolean; children: React.ReactNode }) {
  return (
    <View style={[styles.field, missing && styles.fieldMissing]}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.asterisk}>*</Text>}
      </Text>
      <View style={styles.fieldRow}>{children}</View>
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

  scroll: { padding: 16, gap: 16 },

  field: {
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.grey, borderRadius: radii.lg,
    paddingHorizontal: 16, paddingVertical: 12, gap: 6,
    minHeight: 76,
  },
  fieldMissing: { borderColor: colors.mrpRed },
  fieldLabel: { fontFamily: font.regular, fontSize: 14, color: colors.textDark2 },
  asterisk: { color: colors.mrpRed },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, fontFamily: font.medium, fontSize: 16, color: colors.textDark, padding: 0 },

  footer: { padding: 16, backgroundColor: colors.bgGrey },
  sendBtn: {
    height: 48, borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDim: { opacity: 0.6 },
  sendTxt: { fontFamily: font.semibold, fontSize: 16, color: colors.white },
});
