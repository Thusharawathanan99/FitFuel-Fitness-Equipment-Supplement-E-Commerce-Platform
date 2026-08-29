const PATHS = {
  cart: <><path d="M3 4h2.2l2.3 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L21 8H6.2" /><circle cx="10" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.2-4.2" /></>,
  heart: <path d="M20.5 8.5c0 5-8.5 10.5-8.5 10.5S3.5 13.5 3.5 8.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  truck: <><path d="M2 7h11v10H2z" /><path d="M13 10h4.5l3.5 3.4V17H13z" /><circle cx="6.5" cy="18.5" r="1.8" /><circle cx="16.5" cy="18.5" r="1.8" /></>,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.6-3.1 8-7.5 9.5-4.4-1.5-7.5-4.9-7.5-9.5V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></>,
  card: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>,
  filter: <path d="M3 6h18M6 12h12M10 18h4" />,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  box: <><path d="M4 7l8-4 8 4v10l-8 4-8-4z" /><path d="M4 7l8 4 8-4M12 11v10" /></>,
  chart: <path d="M4 19V9M10 19V4M16 19v-7M22 19H2" />,
  users: <><circle cx="9" cy="8" r="3.4" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5.2a3.4 3.4 0 0 1 0 5.6M17.5 20a6.5 6.5 0 0 0-2.2-4.9" /></>,
  tag: <><path d="M20.6 13.3l-7.3 7.3a2 2 0 0 1-2.8 0l-7.1-7.1V3.2h10.1l7.1 7.1a2 2 0 0 1 0 2.9z" /><circle cx="8" cy="8" r="1.5" /></>,
  layers: <path d="M4 6h16M4 12h16M4 18h16" />,
  logout: <><path d="M15 17l5-5-5-5M20 12H9" /><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" /></>,
  scale: <><path d="M12 3v18M7 7h10" /><path d="M4 12l3-5 3 5a3 3 0 0 1-6 0zM14 12l3-5 3 5a3 3 0 0 1-6 0z" /></>,
  sparkle: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />,
  gift: <><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M3 12h18M12 8v13" /><path d="M12 8s-1-5-4-5a2.5 2.5 0 0 0 0 5zM12 8s1-5 4-5a2.5 2.5 0 0 1 0 5z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5l3 2" /></>,
  pin: <><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  edit: <><path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  trash: <><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  alert: <><path d="M12 3l9.5 17H2.5z" /><path d="M12 9.5v4M12 17h.01" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13.5" width="4" height="6" rx="2" /><rect x="17.5" y="13.5" width="4" height="6" rx="2" /></>,
  star: <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z" />
};

export default function Icon({ name, size = 20, stroke = 'currentColor', fill = 'none', strokeWidth = 1.7, className = '', ...rest }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true" focusable="false" {...rest}
    >
      {d}
    </svg>
  );
}
