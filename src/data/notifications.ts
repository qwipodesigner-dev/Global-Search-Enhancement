/**
 * Reference data for the Notifications screen — promo pushes with the
 * emoji-heavy copy from the design, newest first.
 */
export type AppNotification = {
  id: string;
  title: string;
  timestamp: string;
  message: string;
  unread: boolean;
};

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: '🌾 Atta Savings',
    timestamp: '6, August 2026 | 12 : 51 PM',
    message: '🥖🌾💰 Stock up & save on Flours!',
    unread: true,
  },
  {
    id: 'n2',
    title: '⭐ Top Everyday Deals🛒',
    timestamp: '6, August 2026 | 9 : 47 AM',
    message: '✨ Upto 20% OFF on FMCG Essentials! 🤩',
    unread: true,
  },
  {
    id: 'n3',
    title: '🌧️ Monsoon Delights',
    timestamp: '5, August 2026 | 11 : 48 AM',
    message: '☕🌽🍜 Upto 15% OFF on Monsoon Favorites! 🤩',
    unread: true,
  },
  {
    id: 'n4',
    title: '🛒 Best Urad Deals🍚',
    timestamp: '5, August 2026 | 10 : 36 AM',
    message: '🌾🔥 Grab your Double Horse Urad at great prices!',
    unread: true,
  },
];
