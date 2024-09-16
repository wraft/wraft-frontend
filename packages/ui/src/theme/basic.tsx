export const coreBorders = {
  none: '0px solid',
  thin: '1px solid',
  medium: '2px solid',
  thick: '4px solid',
};

const theme: any = {
  // printColorModeName: 'wraft',
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: `inter, sans-serif`,
    heading: 'inherit',
    editor1: `inter, sans-serif`,
    editor2: `inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`, //"'IBM Plex Mono', monospace",
    // font-family:
    monospace: 'Menlo, monospace',
    satoshi:
      '\'Satoshi\', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  initialColorModeName: 'light',
  useColorSchemeMediaQuery: true,
  fontSizes: {
    xxs: '0.625rem',
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
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
      objectFit: 'cover',
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
      minHeight: '600px',
      height: 'fit-content',
      flexDirection: 'column',
    },
    onboardingFormPage: {
      height: '100vh',
      padding: '80px',
      backgroundColor: 'background',
      justifyContent: 'center',
    },
  },
};

export default theme;
