import type { MobileNavbar, ThemeOption } from "@/types";

export const themes: ThemeOption[] = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const mobileNavbar: MobileNavbar[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/location.svg",
    route: "/rent-parking",
    label: "Rent parking",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/list-parking",
    label: "List parking",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
];
