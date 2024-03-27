export interface ThemeOption {
  label: string;
  value: string;
  icon: string;
}

export interface MobileNavbar {
  imgURL: string;
  route: string;
  label: string;
}

export interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface FilterProps {
  name: string;
  value: string;
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface ParamsProps {
  params: { id: string };
}
