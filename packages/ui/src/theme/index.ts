import basic from "./basic";
import colors from "./colors";
import styles from "./styles";
import alerts from "./variants/alerts";
import { borderWidths } from "./variants/borders";
import buttons from "./variants/buttons";
import { getDefaultFields } from "./variants/defaultFields";
import { getFocus } from "./variants/focus";
import forms from "./variants/forms";
import { getIcons } from "./variants/icons";
import layout from "./variants/layout";
import links from "./variants/links";
import { getRadii } from "./variants/radii";
import { getSpace } from "./variants/space";
import text from "./variants/text";
import { fontWeights, getFontSizes } from "./variants/typography";

export { GlobalStyle } from "./GlobalStyle";

const DEFAULT_FONT_SIZE = 16;

export type Options = {
  [param: string]: unknown;
  defaultFontSize?: number;
};

const createTheme = (options: Options = {}) => {
  const { defaultFontSize = DEFAULT_FONT_SIZE } = options;

  let theme: any = basic;

  theme.toEm = (px) => `${px / defaultFontSize}em`;
  theme.toRem = (px) => `${px / defaultFontSize}rem`;
  theme.toPx = (rem) => `${rem * defaultFontSize}px`;

  theme.colors = colors;

  theme.fontSizes = getFontSizes("rem", theme);
  theme.fontWeights = fontWeights;

  theme.borderWidths = borderWidths;
  theme.focus = getFocus(theme);
  theme.spaceV2 = getSpace(theme);
  theme.buttons = buttons;
  theme.forms = forms;
  theme.text = text;
  theme.links = links;
  theme.layout = layout;
  theme.alerts = alerts;
  theme.styles = styles;
  // theme.tags = getTags(theme);
  theme.icons = getIcons(theme);
  theme.radii = getRadii(theme);
  // theme.tables = getTables(theme);
  theme.defaultFields = getDefaultFields(theme);

  return theme;
};

export const theme = createTheme();

// export const theme = {
//   ...basic,
//   colors,
//   buttons,
//   forms,
//   text,
//   links,
//   layout,
//   alerts,
//   styles,
// };
