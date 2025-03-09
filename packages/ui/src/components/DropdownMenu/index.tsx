import * as Ariakit from "@ariakit/react";
import { forwardRef } from "react";

import * as S from "./styled";

export interface DropdownMenuOptions extends Omit<Ariakit.MenuProps, "gutter"> {
  innerProps?: any;
}

const DropdownMenuComponent = forwardRef<HTMLDivElement, DropdownMenuOptions>(
  ({ children, ...rest }, ref) => {
    return (
      <Ariakit.Menu
        aria-label="dropdown-menu"
        ref={ref}
        tabIndex={0}
        render={(props) => <S.Inner {...props} />}
        {...rest}
      >
        {children}
      </Ariakit.Menu>
    );
  },
);

DropdownMenuComponent.displayName = "DropdownMenu";

export const Provider = Ariakit.MenuProvider;

export const Trigger = forwardRef<HTMLDivElement, Ariakit.MenuButtonProps>(
  ({ store, ...rest }, ref) => {
    return (
      <Ariakit.MenuButton
        render={(props) => <S.Trigger {...props} />}
        ref={ref}
        store={store}
        {...rest}
      />
    );
  },
);

Trigger.displayName = "DropdownMenu.Trigger";

export const Item = forwardRef<HTMLDivElement, any>(({ as, ...rest }, ref) => {
  return (
    <Ariakit.MenuItem
      ref={ref}
      render={(props) => <S.Item {...props} />}
      {...rest}
    />
  );
});

Item.displayName = "DropdownMenu.Item";

export const Separator = forwardRef<HTMLHRElement, any>((props, ref) => {
  return (
    <Ariakit.MenuSeparator
      ref={ref}
      render={(menuProps) => <S.Separator {...menuProps} {...props} />}
    />
  );
});

Separator.displayName = "DropdownMenu.Separator";

export const DropdownMenu = Object.assign(DropdownMenuComponent, {
  Provider,
  Item,
  Trigger,
  Separator,
});
