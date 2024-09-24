import type { ComponentType, FC } from "react";
import React, { useEffect } from "react";
import { cx, isEmptyArray } from "@remirror/core";
import { ReactComponentMessages as Messages } from "@remirror/messages";
import { useCommands, useI18n } from "@remirror/react-core";
import { ExtensionMentionAtomTheme as Theme } from "@remirror/theme";
import { FloatingWrapper } from "./floating-menu";
import type {
  HolderAtomNodeAttributes,
  HolderAtomState,
  UseHolderAtomProps,
  UseHolderAtomReturn,
} from "./mention-hooks";
import { useHolderAtom } from "./mention-hooks";

interface HolderAtomPopupComponentProps<
  Data extends HolderAtomNodeAttributes = HolderAtomNodeAttributes,
> extends UseHolderAtomProps<Data> {
  /**
   * Called whenever the query state changes.
   */
  onChange: (holderAtomState: HolderAtomState<Data> | null) => void;

  /**
   * The component to be used for rendering each item.
   */
  ItemComponent?: ComponentType<HolderAtomPopupItemComponentProps<Data>>;

  /**
   * The message that is displayed when there are no items to display.
   */
  ZeroItemsComponent?: ComponentType<object>;
}

interface UseHolderAtomChangeHandlerProps<
  Data extends HolderAtomNodeAttributes = HolderAtomNodeAttributes,
> {
  state: UseHolderAtomReturn<Data>["state"];
  onChange: HolderAtomPopupComponentProps<Data>["onChange"];
}

function useHolderAtomChangeHandler<
  Data extends HolderAtomNodeAttributes = HolderAtomNodeAttributes,
>(props: UseHolderAtomChangeHandlerProps<Data>) {
  const { onChange, state } = props;

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);
}

/**
 * This component renders the emoji suggestion dropdown for the user.
 */
export function HolderAtomPopupComponent<
  Data extends HolderAtomNodeAttributes = HolderAtomNodeAttributes,
>(props: HolderAtomPopupComponentProps<Data>): JSX.Element {
  const { focus } = useCommands();
  const {
    onChange,
    ItemComponent = DefaultItemComponent,
    ZeroItemsComponent = DefaultZeroItemsComponent,
    ...hookProps
  } = props;
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useHolderAtom(hookProps);
  useHolderAtomChangeHandler({ state, onChange });

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={Boolean(state)}
      placement="auto-end"
      renderOutsideEditor
    >
      <div {...getMenuProps()} className={cx(Theme.MENTION_ATOM_POPUP_WRAPPER)}>
        {Boolean(state) && isEmptyArray(hookProps.items) ? (
          <ZeroItemsComponent />
        ) : (
          hookProps.items.map((item, index) => {
            const isHighlighted = indexIsSelected(index);
            const isHovered = indexIsHovered(index);

            return (
              <div
                key={item.id}
                className={cx(
                  Theme.MENTION_ATOM_POPUP_ITEM,
                  isHighlighted && Theme.MENTION_ATOM_POPUP_HIGHLIGHT,
                  isHovered && Theme.MENTION_ATOM_POPUP_HOVERED,
                )}
                {...getItemProps({
                  onClick: () => {
                    state?.command(item);
                    focus();
                  },
                  item,
                  index,
                })}
              >
                <ItemComponent item={item} state={state} />
              </div>
            );
          })
        )}
      </div>
    </FloatingWrapper>
  );
}

interface HolderAtomPopupItemComponentProps<
  Data extends HolderAtomNodeAttributes = HolderAtomNodeAttributes,
> {
  item: Data;
  state: UseHolderAtomReturn<Data>["state"];
}

function DefaultItemComponent<
  Data extends HolderAtomNodeAttributes = HolderAtomNodeAttributes,
>(props: HolderAtomPopupItemComponentProps<Data>) {
  return (
    <span className={Theme.MENTION_ATOM_POPUP_NAME}>{props.item.label}</span>
  );
}

const DefaultZeroItemsComponent: FC = () => {
  const { t } = useI18n();
  return (
    <span className={Theme.MENTION_ATOM_ZERO_ITEMS}>
      {t(Messages.NO_ITEMS_AVAILABLE)}
    </span>
  );
};
