import styled, { css, system, th } from "@xstyled/emotion";

import { TextOptions } from "./index";

const getBlockHeight = (lines: number) => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lines || "none"};
  line-height: normal;
  overflow: hidden;
  word-break: ${lines === 1 ? "break-all" : null};
`;

export const Text = styled.div<TextOptions>`
  ${({ lines, theme, variant, withDash }) => {
    const isHeading = variant?.startsWith("h");

    const shouldFixHeadingsLineHeight =
      lines && lines !== Infinity && variant.startsWith("h");
    return css`
      margin: 0px;
      ${th(`texts.${variant}`) as any};

      /* Start fallback for non-webkit */
      display: block;

      ${lines && lines !== Infinity && (getBlockHeight(lines) as any)};
      /* End fallback for non-webkit */

      ${withDash &&
      isHeading &&
      (css`
        display: flex;

        &:before {
          content: "";
          width: 16;
          height: 4;
          display: flex;
          align-self: center;
          flex-shrink: 0;
          background-color: primary-40;
          margin-right: md;
        }
      ` as any)}

      @media (min-width: lg) {
        ${th(`texts.${variant}`) as any};
        ${system as any};
      }

      ${shouldFixHeadingsLineHeight &&
      (css`
        & {
          line-height: 1.4;
        }
      ` as any)}

      ${system as any};
    `;
  }}
`;
