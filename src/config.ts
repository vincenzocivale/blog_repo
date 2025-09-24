export const SITE = {
  website: "https://biomedical-engineering-log.netlify.app",
  base: "/",
  author: "Vincenzo Yuto Civale",
  profile: "www.linkedin.com/in/vincenzo-civale",
  desc: "A biomedical engineer's notes on interesting insights.",
  title: "Biomedical Engineering's Log",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Rome", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
