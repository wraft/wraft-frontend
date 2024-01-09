import { Inter } from 'next/font/google';
import { Theme, ThemeUIStyleObject } from 'theme-ui';

type Variant = ThemeUIStyleObject;

type CustomVariantGroups = {
  variants: {
    onboardingFormPage: Variant;
    onboardingForms: Variant;
  };
};

const inter = Inter({
  weight: ['400', '500', '700'],
  display: 'block',
  subsets: ['latin'],
  preload: true,
});

// const brandColors = {
//   complimentary: '#f4f3f3',
//   main: '#292C2a',
//   darkNeutral: '#325C82',
//   accent: '#0469E3',
//   lightNeutral: '#F8F8F8',
// };

// const coreColors = {
//   ...brandColors,
//   gray100: '#f9f9f9',
//   gray200: '#dedede',
//   gray300: '#c4c4c4',
//   gray400: '#ababab',
//   gray500: '#929292',
//   gray600: '#7a7a7a',
//   gray700: '#626262',
//   gray800: '#4c4c4c',
//   gray900: '#323232',
//   black: '#000000',
//   red100: '#ffebeb',
//   red200: '#fdbfbf',
//   red300: '#f99595',
//   red400: '#f56c6c',
//   red500: '#ef4444',
//   red600: '#e42828',
//   red700: '#c62121',
//   white: '#ffffff',
//   amber600: '#d97706',
//   teal600: '#0d9488',
// };

export const coreBorders = {
  none: '0px solid',
  thin: '1px solid',
  medium: '2px solid',
  thick: '4px solid',
};

// const coreRadii = {
//   sharp: '0px',
//   xs: '2px',
//   sm: '4px',
//   md: '6px',
//   lg: '8px',
//   xl: '12px',
//   '2xl': '16px',
//   '3xl': '24px',
//   circle: '9999px',
// };

const theme: Theme & CustomVariantGroups = {
  // printColorModeName: 'wraft',
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: `${inter.style.fontFamily}, sans-serif`,
    heading: 'inherit',
    editor1: `${inter.style.fontFamily}, sans-serif`,
    editor2: `${inter.style.fontFamily} , system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`, //"'IBM Plex Mono', monospace",
    // font-family:
    monospace: 'Menlo, monospace',
    satoshi:
      '\'Satoshi\', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  initialColorModeName: 'light',
  useColorSchemeMediaQuery: true,
  fontSizes: [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48],
  fontWeights: {
    body: 400,
    heading: 500,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  images: {
    profile: {
      width: '128px',
      height: '128px',
      borderRadius: '50%',
      objectFit: 'contain',
      bg: 'background',
    },
  },
  variants: {
    onboardingForms: {
      padding: '32px',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: '4px',
      backgroundColor: 'backgroundWhite',
      width: '574px',
      height: '629px',
      flexDirection: 'column',
    },
    onboardingFormPage: {
      padding: '80px',
      backgroundColor: 'background',
      justifyContent: 'center',
    },
  },
};

export default theme;
