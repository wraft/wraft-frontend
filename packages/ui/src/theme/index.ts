import { rpxTransformers } from "@xstyled/emotion";

import basic from "./basic";
import colors from "./colors";
import alerts from "./variants/alerts";
import { borderWidths } from "./variants/borders";
import boxVariant from "./variants/boxVariant";
// import buttons from "./variants/buttons";
import { getButtons } from "./variants/buttons";
import { getDefaultFields } from "./variants/defaultFields";
import { getFocus } from "./variants/focus";
import forms from "./variants/forms";
import { getIcons } from "./variants/icons";
import layout from "./variants/layout";
import links from "./variants/links";
import { getRadii } from "./variants/radii";
import { getSpace } from "./variants/space";
import { getTags } from "./variants/tags";
import { getTextareas } from "./variants/textareas";
import {
  fontWeights,
  getFontSizes,
  getLetterSpacings,
  getLineHeights,
  getTexts,
  getTextsFontFamily,
  getTextsFontWeights,
} from "./variants/typography";

export { GlobalStyle } from "./GlobalStyle";

const DEFAULT_FONT_SIZE = 16;

export type Options = {
  [param: string]: unknown;
  defaultFontSize?: number;
};

const createTheme = (options: Options = {}) => {
  const { defaultFontSize = DEFAULT_FONT_SIZE } = options;

  let theme: any = basic;

  theme.transformers = { ...rpxTransformers };

  theme.toEm = (px) => `${px / defaultFontSize}em`;
  theme.toRem = (px) => `${px / defaultFontSize}rem`;
  theme.toPx = (rem) => `${rem * defaultFontSize}px`;

  theme.colors = colors;
  theme.fontWeights = fontWeights;
  theme.letterSpacings = getLetterSpacings(theme);
  theme.fontSizes = getFontSizes("rem", theme);
  theme.lineHeights = getLineHeights(theme);
  theme.textsFontWeights = getTextsFontWeights(theme);
  theme.textsFontFamily = getTextsFontFamily(theme);
  theme.texts = getTexts(theme);

  theme.variants = boxVariant;

  theme.radii = getRadii(theme);

  theme.borderWidths = borderWidths;
  theme.focus = getFocus(theme);
  theme.spaceV2 = getSpace(theme);
  theme.space = getSpace(theme);
  // theme.buttons = buttons;
  theme.buttons = getButtons(theme);
  theme.forms = forms;
  theme.links = links;
  theme.layout = layout;
  theme.alerts = alerts;
  // theme.styles = styles;
  theme.tags = getTags(theme);
  theme.icons = getIcons(theme);
  // theme.tables = getTables(theme);

  // fields
  theme.defaultFields = getDefaultFields(theme);
  theme.textareas = getTextareas(theme);

  return theme;
};

export const theme = createTheme();
