import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Saved delivery locations + the active one. Each address carries its own
 * serviceability: which seller types operate there. The Home screen reads the
 * active address to decide whether the Authorised Distributors / Wholesalers
 * cards are live or "Coming Soon". New addresses go to the backend for
 * approval — until approved they are listed but not selectable.
 */

export type SavedAddress = {
  id: string;
  /** Short label for the Deliver-to pill. */
  label: string;
  /** Full address line shown on the location screen. */
  full: string;
  /** Geo coordinates, when captured. */
  coords?: string;
  status: 'approved' | 'pending';
  /** Seller-type serviceability at this location. */
  distributors: boolean;
  wholesalers: boolean;
};

/** Reference data: one fully served, one wholesaler-only, one distributor-only. */
const seedAddresses: SavedAddress[] = [
  {
    id: 'addr_hitech',
    label: 'Lit box, Rai Durg, Hitech City',
    full: 'Lit box, Rai Durg, Hitech City, Hyderabad, Telangana, INDIA, 500081',
    status: 'approved',
    distributors: true,
    wholesalers: true,
  },
  {
    id: 'addr_kukatpally',
    label: 'Kukatpally, Hyderabad',
    full: 'Unnamed Road, Kukatpally, Hyderabad, Telangana, INDIA, 500072',
    status: 'approved',
    distributors: false, // no authorised distributors here yet -> Coming Soon
    wholesalers: true,
  },
  {
    id: 'addr_kphb',
    label: 'KPHB Colony, Hyderabad',
    full: 'MIG 214, KPHB Colony, Hyderabad, Telangana, INDIA, 500085',
    status: 'approved',
    distributors: true,
    wholesalers: false, // wholesalers not serving this area yet -> Coming Soon
  },
];

export type NewAddressInput = {
  coords: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
};

type LocationApi = {
  addresses: SavedAddress[];
  active: SavedAddress;
  applyLocation: (id: string) => void;
  /** Sends the address for approval; it lists as pending until approved. */
  submitForApproval: (input: NewAddressInput) => void;
};

const LocationContext = createContext<LocationApi | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(seedAddresses);
  const [activeId, setActiveId] = useState(seedAddresses[0].id);

  const api = useMemo<LocationApi>(() => ({
    addresses,
    active: addresses.find((a) => a.id === activeId) ?? addresses[0],
    applyLocation: (id) => {
      const a = addresses.find((x) => x.id === id);
      if (a && a.status === 'approved') setActiveId(id);
    },
    submitForApproval: (input) => {
      const full = [input.street, input.area, input.city, input.state, 'INDIA', input.pincode]
        .filter(Boolean).join(', ');
      setAddresses((prev) => [
        ...prev,
        {
          id: `addr_${Date.now()}`,
          label: [input.area, input.city].filter(Boolean).join(', ') || input.street,
          full,
          coords: input.coords || undefined,
          status: 'pending',
          // A new location starts fully serviceable by default.
          distributors: true,
          wholesalers: true,
        },
      ]);
    },
  }), [addresses, activeId]);

  return <LocationContext.Provider value={api}>{children}</LocationContext.Provider>;
}

export function useLocations(): LocationApi {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocations must be used inside LocationProvider');
  return ctx;
}
