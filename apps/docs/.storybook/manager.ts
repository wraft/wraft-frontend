import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

const theme = create({
  base: "dark",
  brandTitle: "Wraft UI Kit",
  brandUrl: "/",
  brandImage: "/assets/plate-ui.svg",
  colorPrimary: "#00471A",
  colorSecondary: "#00471A",
  appBorderColor: "rgb(0 0 0 / 10%)",
  inputBorderRadius: 0,
  appBg: "#1D252F",
});

addons.setConfig({
  theme,
});
