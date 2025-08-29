import styled, { css } from "@xstyled/emotion";

const dynamicLabelStyles = ({ required }: { required: boolean }) => css`
  position: relative;
  display: flex;
  flex-shrink: 0;
  max-width: 100%;
  align-items: center;
  line-height: lg;
  user-select: none;
  font-size: 14px;
  color: gray.900;

  > * {
    &:not(:last-child) {
      margin-right: sm;
    }

    :last-child {
      ${required && requiredStyles};
    }
  }
`;

export const Label = styled("label")<{ required: boolean }>`
  ${dynamicLabelStyles}
`;

export const requiredStyles: any = css`
  &::after {
    content: "*";
    margin-left: xs;
    /* It prevents the element to shift the layout and it allows us to put it properly on top with super */
    line-height: 0;
    vertical-align: super;
    font-size: xs;
    font-weight: bold;
    color: red.300;
  }
`;

export const Disabled = styled.div`
  display: inline-flex;
  margin-right: xs;
`;
