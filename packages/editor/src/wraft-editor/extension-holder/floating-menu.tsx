import type {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  Ref,
} from "react";
import React, { useCallback, useMemo } from "react";
import type {
  Alignment,
  Middleware,
  Placement as FloatingUIPlacement,
  Strategy,
} from "@floating-ui/react";
import {
  autoPlacement,
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  useFloating,
} from "@floating-ui/react";
import { cx, isObject } from "@remirror/core";
import type { PositionerParam } from "@remirror/extension-positioner";
import { getPositioner } from "@remirror/extension-positioner";
import { useHelpers } from "@remirror/react-core";
import type { UseEditorFocusProps } from "@remirror/react-hooks";
import { useEditorFocus, usePositioner } from "@remirror/react-hooks";
import { ComponentsTheme, ExtensionPositionerTheme } from "@remirror/theme";
// import composeRefs from '@seznam/compose-react-refs';
import { createPortal } from "react-dom";
import { composeRefs } from "./common-packages/seznam-compose-react-refs";
// import { Box } from 'theme-ui';

interface BaseFloatingPositioner extends UseEditorFocusProps {
  /**
   * The positioner used to determine the position of the relevant part of the
   * editor state.
   */
  positioner: PositionerParam;

  /**
   * When `true` will hide the popover element whenever the positioner is no
   * longer visible in the DOM.
   */
  hideWhenInvisible?: boolean;

  /**
   * Set animated as detailed [here](https://reakit.io/docs/popover/#animating).
   *
   * Currently this is turned off due to problems with an infinite loop.
   */
  animated?: boolean | number;

  /**
   * Set to false to make the positioner inactive.
   */
  enabled?: boolean;

  /**
   * Where to place the popover relative to the positioner.
   * @remarks
   * The floating-ui library has removed the auto- prefixed placement attribute types.
   * The type declaration you see here is for compatibility with Popper.js.
   *
   * https://floating-ui.com/docs/autoPlacement#conflict-with-flip
   */
  placement?: FloatingUIPlacement | "auto" | `auto-${Alignment}`;

  /**
   * When `true` the child component is rendered outside the `ProseMirror`
   * editor. Set this to `false` when you need to render special components
   * (like inputs) which capture events and conflict with the default
   * prosemirror editor.
   *
   * For toolbars which rely on clicks you can leave this as the default.
   *
   * Setting to true will also make scrolling less smooth since it will be using
   * JavaScript to keep track of the position of the element.
   *
   * @defaultValue false
   */
  renderOutsideEditor?: boolean;

  /**
   * Array of middleware objects to modify the positioning or provide data for
   * rendering.
   */
  middleware?: (Middleware | null | undefined | false)[];

  /**
   * The strategy to use when positioning the floating element.
   */
  strategy?: Strategy;

  /**
   * Portals the floating element into a given container element — by default,
   * outside of the app root and into the body.
   * @see https://floating-ui.com/docs/FloatingPortal
   * @defaultValue false
   * @remarks This is conflict to renderOutsideEditor, and renderOutsideEditor has high priority.
   * And this property will cause the loss of the css variable if you use remirror's internal style
   */
  useFloatingPortal?: boolean | Parameters<typeof FloatingPortal>[0];
}

interface FloatingWrapperProps extends BaseFloatingPositioner {
  /**
   * When true the arrow will be displayed.
   *
   * @defaultValue false
   */
  displayArrow?: boolean;

  animatedClass?: string;
  containerClass?: string;
  floatingLabel?: string;
}

interface UseMemoizedPositionProps {
  height: number;
  left: number;
  top: number;
  width: number;
}

function useMemoizedPosition(props: UseMemoizedPositionProps) {
  const { height, left, top, width } = props;
  return useMemo(
    () => ({ height, left, top, width }),
    [height, left, top, width],
  );
}

export const FloatingWrapper: FC<PropsWithChildren<FloatingWrapperProps>> = (
  props,
): JSX.Element => {
  const {
    containerClass,
    placement = "right-end",
    positioner,
    children,
    blurOnInactive = false,
    ignoredElements = [],
    enabled = true,
    floatingLabel,
    hideWhenInvisible = true,
    renderOutsideEditor = false,
    middleware: propsMiddleware,
    strategy,
    useFloatingPortal,
  } = props;

  const [isFocused] = useEditorFocus({ blurOnInactive, ignoredElements });
  const {
    ref,
    active,
    height,
    x: left,
    y: top,
    width,
    visible,
  } = usePositioner(() => {
    const active = isFocused && enabled;
    const refinedPositioner = getPositioner(positioner);
    return refinedPositioner.active(active);
  }, [isFocused, enabled, renderOutsideEditor]);

  const shouldShow = (hideWhenInvisible ? visible : true) && active;
  const position = useMemoizedPosition({ height, left, top, width });

  const _placement = isFloatingUIPlacement(placement) ? placement : undefined;

  const middleware = useMemo(() => {
    if (propsMiddleware) {
      return propsMiddleware;
    }

    return [
      _placement ? flip({ padding: 3 }) : autoPlacement({ padding: 3 }),
      offset({ mainAxis: 12 }),
    ];
  }, [_placement, propsMiddleware]);

  const { refs, floatingStyles } = useFloating({
    placement: _placement,
    open: visible,
    whileElementsMounted: autoUpdate,
    strategy,
    middleware,
  });

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (renderOutsideEditor || useFloatingPortal) {
        // Prevent blur events from being triggered
        e.preventDefault();
      }
    },
    [renderOutsideEditor, useFloatingPortal],
  );

  let floatingElement = (
    <span
      aria-label={floatingLabel}
      ref={refs.setFloating}
      style={floatingStyles}
      className={cx(ComponentsTheme.FLOATING_POPOVER, containerClass)}
      onMouseDown={handleMouseDown}
    >
      {shouldShow && children}
    </span>
  );

  if (!renderOutsideEditor && !useFloatingPortal) {
    floatingElement = <PositionerPortal>{floatingElement}</PositionerPortal>;
  } else if (useFloatingPortal) {
    const props = isObject(useFloatingPortal) ? useFloatingPortal : {};
    floatingElement = (
      <FloatingPortal {...props}>{floatingElement}</FloatingPortal>
    );
  }

  return (
    <>
      <PositionerPortal>
        <span
          className={ExtensionPositionerTheme.POSITIONER}
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
          }}
          ref={composeRefs(ref, refs.setReference) as Ref<any>}
        />
      </PositionerPortal>
      {floatingElement}
    </>
  );
};

export interface PositionerComponentProps {
  children: ReactNode;
}

/**
 * Render a component into the editors positioner widget using `createPortal`
 * from `react-dom`.
 */
export const PositionerPortal: FC<PositionerComponentProps> = (props) => {
  const container = useHelpers().getPositionerWidget();

  return createPortal(<>{props.children}</>, container);
};

function isFloatingUIPlacement(
  placement: BaseFloatingPositioner["placement"],
): placement is FloatingUIPlacement {
  // Compare to previous PopperJS, FloatingUI doesn't support "auto" placement anymore.
  return !placement?.startsWith("auto");
}

// interface FloatingActionsMenuProps extends Partial<FloatingWrapperProps> {
//   actions: MenuActionItemUnion[];
// }

/**
 * Respond to user queries in the editor.
 */
// export const FloatingActionsMenu = (props: FloatingActionsMenuProps): JSX.Element => {
//   const {
//     actions,
//     animated = false,
//     placement = 'right-end',
//     positioner = 'nearestWord',
//     blurOnInactive,
//     ignoredElements,
//     enabled = true,
//     ...floatingWrapperProps
//   } = props;
//   const { change } = useSuggest({ char: '/', name: 'actions-dropdown', matchOffset: 0 });
//   const query = change?.query.full;
//   const menuState = useMenuState({ unstable_virtual: true, wrap: true, loop: true });
//
//   const items = (
//     query
//       ? matchSorter(actions, query, {
//           keys: ['tags', 'description', (item) => item.description?.replace(/\W/g, '') ?? ''],
//           threshold: matchSorter.rankings.CONTAINS,
//         })
//       : actions
//   ).map<MenuPaneItem | MenuCommandPaneItem>((item) =>
//     item.type === ComponentItem.MenuAction
//       ? { ...item, type: ComponentItem.MenuPane }
//       : { ...item, type: ComponentItem.MenuCommandPane },
//   );
//
//   return (
//     <FloatingWrapper
//       enabled={!!query}
//       positioner={positioner}
//       placement={placement}
//       animated={animated}
//       blurOnInactive={blurOnInactive}
//       ignoredElements={ignoredElements}
//       {...floatingWrapperProps}
//     >
//       <div style={{ width: 50, height: 50, background: 'red' }} />
//       <MenuComponent open={!!query && enabled} items={items} menuState={menuState} />
//     </FloatingWrapper>
//   );
// };
