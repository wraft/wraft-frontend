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
    body: `sans-serif`,
    heading: 'inherit',
    editor1: `sans-serif`,
    editor2: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`, //"'IBM Plex Mono', monospace",
    // font-family:
    monospace: 'Menlo, monospace',
    satoshi:
      '\'Satoshi\', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  initialColorModeName: 'light',
  useColorSchemeMediaQuery: true,
  fontSizes: [10, 12, 14, 16, 19, 23, 29, 37, 46],
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
      minHeight: '629px',
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
