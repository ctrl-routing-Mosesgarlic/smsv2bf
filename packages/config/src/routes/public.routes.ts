export const PUBLIC_ROUTES = {
  home: "/",
  about: "/about",
  modules: "/modules",
  pricing: "/pricing",
  contact: "/contact",
  whyCbcSms: "/why-cbc-sms",
  testimonials: "/testimonials",
} as const;

export const PUBLIC_ROUTE_PATHS = Object.values(PUBLIC_ROUTES);
