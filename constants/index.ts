import type { MobileNavbar, ThemeOption } from "@/types";

export const themes: ThemeOption[] = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const mobileNavbar: MobileNavbar[] = [
  {
    route: "/",
    label: "Home",
  },
  {
    route: "/rent-parking",
    label: "Rent a parking space",
  },
  {
    route: "/list-parking",
    label: "List your parking space",
  },
  {
    route: "/profile",
    label: "Profile",
  },
];
