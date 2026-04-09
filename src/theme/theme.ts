export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  purple: string;
  lavender: string;
  lavenderDeep: string;
  white: string;
  black: string;
  danger: string;
};

export const lightTheme: ThemeColors = {
  background: '#F7F6EE',
  surface: '#F6EEFF',
  card: '#DADCD6',
  border: '#2A2A2A',
  text: '#1A1A2A',
  muted: '#6A6A6A',
  purple: '#6B1FB4',
  lavender: '#D7C4EA',
  lavenderDeep: '#CDB4E6',
  white: '#FFFFFF',
  black: '#111111',
  danger: '#E04444',
};

export const darkTheme: ThemeColors = {
  background: '#0F0F13',
  surface: '#151521',
  card: '#1E1E2A',
  border: '#3A3A4A',
  text: '#F2F2F7',
  muted: '#B0B0B8',
  purple: '#C9A3FF',
  lavender: '#2B2040',
  lavenderDeep: '#3B2B5A',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#FF6B6B',
};
