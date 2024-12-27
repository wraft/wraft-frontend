import { CSSObject } from "@xstyled/emotion";

export type ThemeFocus = (color?: string) => {
  boxShadow: CSSObject["boxShadow"];
};

export const getFocus = ({ colors }: { colors: any }) => {
  function focus(color = colors["primary-40"]) {
    return {
      boxShadow: `0 0 0 2px ${color}`,
    };
  }

  return focus;
};
