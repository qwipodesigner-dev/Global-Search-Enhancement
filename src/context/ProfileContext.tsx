import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * The retailer's business profile — single source of truth so the Profile
 * screen and Business Details always show the same owner/number, and saving
 * an edit propagates everywhere.
 */

export type BusinessProfile = {
  shop: string;
  owner: string;
  mobile: string;
  address: string;
  gstin: string;
};

const seed: BusinessProfile = {
  shop: 'Tirumala Traders',
  owner: 'Venu Gopal',
  mobile: '9876543210',
  address: '7, Sri Shyam Nagar, Telecom Nagar Extension, Gachibowli, Hyderabad, Telangana 500032',
  gstin: '9876543210',
};

type ProfileApi = {
  profile: BusinessProfile;
  updateProfile: (patch: Partial<BusinessProfile>) => void;
};

const ProfileContext = createContext<ProfileApi | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(seed);
  const api = useMemo<ProfileApi>(() => ({
    profile,
    updateProfile: (patch) => setProfile((p) => ({ ...p, ...patch })),
  }), [profile]);
  return <ProfileContext.Provider value={api}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileApi {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
