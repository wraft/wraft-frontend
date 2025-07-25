import React, { cloneElement, useRef, useState } from "react";
import reactFlattenChildren from "react-flatten-children";

import { CreateWuiProps, forwardRef } from "@/system";
import { useForkRef } from "@/utils";

import { ActiveBar } from "./ActiveBar";
import * as S from "./styles";

import { UseTab, UseTabState } from ".";

// because of the compatibility of esm standard. Since this lib is no longer maintained, no issue was created
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const flattenChildren = reactFlattenChildren.default || reactFlattenChildren;

function useTrackActiveTabs(
  selectedId: UseTabState["selectedId"],
  children: React.ReactNode,
): [ReturnType<typeof flattenChildren>, HTMLElement] {
  const [activeTab, setActiveTab] = useState<HTMLElement>(null);

  const tabs = flattenChildren(children).map((child: React.ReactElement) => {
    if (child.props.id === selectedId) {
      return cloneElement(child, { ref: setActiveTab });
    }
    return child;
  });
  return [tabs, activeTab];
}

export interface SizeOptions {
  size?: "sm" | "md";
}

export type TabListOptions = SizeOptions & {
  store: UseTab;
};
export type TabListProps = CreateWuiProps<"div", TabListOptions>;

/**
 * @name Tabs.TabList
 */
export const TabList = forwardRef<"div", TabListProps>(
  ({ children, size = "md", store, ...rest }, ref) => {
    const listRef = useRef();
    const listForkedRef = useForkRef(ref, listRef);
    const { orientation, selectedId } = store.useState();
    const [tabs, activeTab] = useTrackActiveTabs(selectedId, children);

    return (
      <S.TabList
        orientation={orientation}
        ref={listForkedRef}
        size={size}
        store={store}
        {...rest}
      >
        {tabs}
        {tabs.length > 1 && (
          <ActiveBar
            activeTab={activeTab}
            listRef={listRef}
            orientation={orientation}
          />
        )}
      </S.TabList>
    );
  },
);

TabList.displayName = "TabList";
