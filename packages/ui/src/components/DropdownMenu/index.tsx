import * as Ariakit from "@ariakit/react";
import { forwardRef } from "react";

import * as S from "./styled";

export interface DropdownMenuOptions extends Omit<Ariakit.MenuProps, "gutter"> {
  innerProps?: any;
}

const DropdownMenuComponent = forwardRef<any, DropdownMenuOptions>(
  ({ children, ...rest }, ref) => {
    return (
      <Ariakit.Menu
        aria-label="dropdown-menu"
        ref={ref}
        tabIndex={0}
        render={<S.Inner />}
        {...rest}
      >
        {children}
      </Ariakit.Menu>
    );
  },
);

export const Provider = Ariakit.MenuProvider;

export const Trigger = forwardRef<"button", any>(
  ({ as, store, ...rest }, ref) => {
    return (
      <Ariakit.MenuButton
        as={as}
        render={<S.Trigger />}
        ref={ref}
        store={store}
        {...rest}
      />
    );
  },
);

export const Item = forwardRef<
  HTMLButtonElement,
  Omit<Ariakit.MenuItemProps, "as">
>(({ as, ...rest }: any, ref) => {
  return (
    <Ariakit.MenuItem
      as={as}
      ref={ref}
      type="button"
      render={<S.Item as={as} />}
      {...rest}
    />
  );
});

export const Separator = forwardRef<"div", any>((props, ref) => {
  return <Ariakit.MenuSeparator ref={ref} as={S.Separator} {...props} />;
});

export const DropdownMenu = Object.assign(DropdownMenuComponent, {
  Provider,
  Item,
  Trigger,
  Separator,
});
