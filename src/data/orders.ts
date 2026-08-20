/**
 * Reference data for My Orders — a mix of distributor and wholesaler orders
 * across the three design states (placed / out for delivery / delivered), so
 * the source filter and every card variant are exercised.
 */
export type OrderStatus = 'placed' | 'out_for_delivery' | 'delivered';

export type Order = {
  id: string;
  /** Display order number, e.g. QWIP2402204. */
  number: string;
  seller: string;
  source: 'distributor' | 'wholesaler';
  items: number;
  placed: string;
  total: string;
  expected: string;
  status: OrderStatus;
  /** Last day the retailer can cancel (only while not delivered). */
  cancelBefore?: string;
};

export const orders: Order[] = [
  {
    id: 'o1', number: 'QWIP2402204',
    seller: 'Shri Sai Krishna Traders', source: 'distributor',
    items: 5, placed: '01 Aug 2026', total: '40,200.00',
    expected: '05 Aug 2026', status: 'placed', cancelBefore: '05 Aug 2026',
  },
  {
    id: 'o2', number: 'QWIP2402198',
    seller: 'Omkar Enterprises', source: 'wholesaler',
    items: 5, placed: '01 Aug 2026', total: '40,200.00',
    expected: '05 Aug 2026', status: 'out_for_delivery', cancelBefore: '05 Aug 2026',
  },
  {
    id: 'o3', number: 'QWIP2402161',
    seller: 'SR Enterprises', source: 'distributor',
    items: 5, placed: '01 Aug 2026', total: '40,200.00',
    expected: '04 Aug 2026', status: 'delivered',
  },
  {
    id: 'o4', number: 'QWIP2402117',
    seller: 'Sandeep Traders', source: 'wholesaler',
    items: 3, placed: '28 Jul 2026', total: '12,640.00',
    expected: '31 Jul 2026', status: 'delivered',
  },
  {
    id: 'o5', number: 'QWIP2402093',
    seller: 'Sri Sairam Enterprises', source: 'distributor',
    items: 8, placed: '25 Jul 2026', total: '22,850.00',
    expected: '28 Jul 2026', status: 'delivered',
  },
];
