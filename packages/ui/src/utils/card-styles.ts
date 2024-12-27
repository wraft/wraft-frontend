import { css, th } from "@xstyled/emotion";

export const cardStyles = (): ReturnType<typeof css> =>
  `
    ${th("defaultCards")};
  ` as any;
