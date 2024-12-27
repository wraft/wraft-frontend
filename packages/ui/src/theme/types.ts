import {
  CSSScalar,
  ITheme as StyledComponentDefaultTheme,
  DefaultTheme as XStyledDefaultTheme,
} from "@xstyled/emotion";

type OverrideKeys =
  | "colors"
  | "radii"
  | "borderWidths"
  | "fontSizes"
  | "lineHeights"
  | "fontWeights"
  | "letterSpacings"
  | "fonts"
  | "sizes"
  | "screens"
  | "space"
  | "shadows"
  | "texts";

type XStyledTheme = Omit<XStyledDefaultTheme, OverrideKeys>;
type StyledComponentsTheme = Omit<StyledComponentDefaultTheme, OverrideKeys>;

export interface WuiTheme extends XStyledTheme, StyledComponentsTheme {
  transformers: {
    px: (value: CSSScalar) => CSSScalar;
    border: (value: CSSScalar) => CSSScalar;
  };
  toEm: (int: number) => string;
  toRem: (int?: number) => string;
  toPx: (int?: number) => string;
}
