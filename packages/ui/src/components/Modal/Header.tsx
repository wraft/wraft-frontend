import * as Ariakit from '@ariakit/react';

export interface HeaderProps {
  children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  return <Ariakit.DialogHeading className="heading">{children}</Ariakit.DialogHeading>;
};

Header.displayName = 'Header';
