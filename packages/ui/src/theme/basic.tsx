const theme: any = {
  fonts: {
    body: `inter, sans-serif`,
    heading: "inherit",
    editor1: `inter, sans-serif`,
    editor2: `inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`, //"'IBM Plex Mono', monospace",
    // font-family:
    monospace: "Menlo, monospace",
    satoshi:
      '\'Satoshi\', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  initialColorModeName: "light",
  useColorSchemeMediaQuery: true,
  images: {
    profile: {
      width: "128px",
      height: "128px",
      borderRadius: "50%",
      objectFit: "cover",
      bg: "background",
    },
  },
};

export default theme;
