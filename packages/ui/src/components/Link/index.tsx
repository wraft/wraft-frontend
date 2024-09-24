import styled, { th, x } from '@xstyled/emotion';
import { forwardRef } from 'react';

export type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'full';
export type Variant = 'primary' | 'secondary' | 'outlined' | 'disabled' | 'googleLogin';
export type Type = 'button' | 'link';

export interface LinkOptions {
  disabled?: boolean;
  children?: React.ReactNode;
  size?: Size;
  variant?: Variant;
  Icon?: React.ElementType;
  type: Type;
}

const AnchorStyled =
  styled.a <
  LinkOptions >
  `
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  display: inline-block;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  ${({ type }) =>
    type === 'button' &&
    `
    display: flex;
    justify-content: center;
  `}

  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  ${({ variant }) => th(`buttons.${variant}`)};

  ${({ size }) =>
    size === 'full' &&
    `
    padding-top: 20px;
  `}
  &:hover {
    color: #fff;
  }
  width: ${({ size }) => size === 'full' && '100%'};
`;

export const Link = forwardRef<HTMLAnchorElement, LinkOptions>(
  ({ variant = 'primary', Icon, type = 'link', children, ...rest }, ref) => {
    return (
      <AnchorStyled variant={variant} type={type} {...rest} ref={ref}>
        <x.div display="flex">
          {Icon && (
            <x.div flex="0 1 auto">
              <Icon />
            </x.div>
          )}
          <x.div flex="0 1 auto">{children}</x.div>
        </x.div>
      </AnchorStyled>
    );
  },
);

Link.displayName = 'Link';
