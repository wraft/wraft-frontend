import DownshiftImport, {
  DownshiftProps,
  GetRootPropsOptions,
} from "downshift";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { CreateWuiProps, forwardRef } from "@/system";
import {
  createEvent,
  DefaultFieldStylesProps,
  FIELD_ICON_SIZE,
  throttle as handleThrottle,
} from "@/utils";

import { ClearButton } from "../ClearButton";
import { IconWrapper } from "../Field/styles";

import * as S from "./styles";

const EMPTY_STRING = "";

export type SearchOption = { label: string; value: string };
export type OptionGroup = { label: string; options: SearchOption[] };
export type Item = SearchOption | OptionGroup | string | unknown;

export interface SearchOptions extends DefaultFieldStylesProps {
  groupsEnabled?: boolean;
  icon?: React.ReactElement;
  itemToString: (item: Item) => string;
  minChars?: number;
  onChange?: (item: Item, event: ReturnType<typeof createEvent>) => void;
  renderGroupHeader?: (result: OptionGroup) => React.ReactElement;
  renderItem: (item: Item) => React.ReactElement | string;
  search: (query: string) => Promise<unknown>;
  throttle?: number;
  value?: Item;
}

export type SearchProps = CreateWuiProps<
  "input",
  SearchOptions & Omit<DownshiftProps<SearchOption>, keyof SearchOptions>
>;

const Downshift: typeof DownshiftImport =
  // @ts-ignore
  DownshiftImport.default || DownshiftImport;

export const Search = forwardRef<"input", SearchProps>(
  (
    {
      autoComplete = "off",
      autoFocus,
      dataTestId,
      disabled,
      groupsEnabled,
      icon,
      id,
      itemToString,
      minChars = 3,
      name,
      onBlur,
      onChange,
      onClick,
      onFocus,
      placeholder = "Search…",
      renderGroupHeader,
      renderItem,
      search,
      size = "md",
      throttle = 500,
      // value: selected = EMPTY_STRING,
      value: selected,
      variant,
      ...rest
    },
    ref,
  ) => {
    // Get initial value from selected value(s)
    const initialInputValue = selected ? itemToString(selected) : EMPTY_STRING;

    // Keep results in state
    const [results, setResults] = useState<SearchOption[] | OptionGroup[]>([]);

    // Update results when searching
    const searchResults = useCallback(
      async (value: string) => {
        if (minChars === 0 || value?.length >= minChars) {
          try {
            const data = await search(value);
            setResults((data as SearchOption[] | OptionGroup[]) || []);
          } catch (error) {
            setResults([]);
          }
        } else {
          setResults([]);
        }
      },
      [minChars, search],
    );

    const handleInputChange = useMemo(
      // @ts-ignore
      () => handleThrottle(searchResults, throttle, false),
      [searchResults, throttle],
    );

    // Send event to parent when value(s) changes
    const handleChange = (value?: Item) => {
      const event = createEvent({ name, value });
      onChange && onChange(value, event);
    };

    const handleSelect = (result?: Item) => {
      if (result) {
        // If selecting result
        handleChange(result);
      } else {
        // If removing result
        handleChange();
        setResults([]);
      }
    };

    const handleOuterClick = () => {
      // Reset input value if not selecting a new item
      if (!selected) {
        handleSelect();
      }
      setResults([]);
    };

    // prevents controlled to uncontrolled switch when itemToString returns falsy value
    const handleItemToString = (item: Item) => itemToString(item) || "";

    return (
      <Downshift
        initialInputValue={initialInputValue}
        itemToString={handleItemToString}
        onInputValueChange={handleInputChange}
        onOuterClick={handleOuterClick}
        onSelect={handleSelect}
        selectedItem={selected}
        {...(rest as DownshiftProps<Item>)}
      >
        {({
          clearSelection,
          getInputProps,
          getItemProps,
          getMenuProps,
          getRootProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
          toggleMenu,
        }) => {
          const handleClearClick = () => {
            setResults([]);
            handleChange();
            clearSelection();
          };
          const isShowMenu = isOpen && results.length > 0;

          const DeleteIcon = (
            <S.DropDownIndicator as="div" size={size}>
              <ClearButton onClick={handleClearClick} />
            </S.DropDownIndicator>
          );
          const handleInputFocus = (
            event: React.FocusEvent<HTMLInputElement>,
          ) => {
            onFocus && onFocus(event);
            handleInputChange("");
            toggleMenu();
          };

          const inputProps = getInputProps({
            autoComplete,
            autoFocus,
            "data-testid": dataTestId,
            disabled,
            iconPlacement: !!icon && "left",
            id,
            name,
            onBlur,
            onClick: onClick,
            onFocus: handleInputFocus,
            placeholder,
            ref,
            size,
            tabIndex: 0,
            variant: isOpen ? "focused" : variant,
            ...rest,
          }) as any;
          const iconSize = FIELD_ICON_SIZE[size];

          return (
            <S.Wrapper {...getRootProps(rest as GetRootPropsOptions)}>
              <S.InputWrapper>
                <S.Input {...inputProps} />
                {icon && (
                  <IconWrapper iconPlacement="left" size={iconSize}>
                    {React.cloneElement(icon, {
                      ...icon.props,
                      size: iconSize,
                    })}
                  </IconWrapper>
                )}
                <S.Indicators>{inputValue && DeleteIcon}</S.Indicators>
                {/* {isLoading && <Spinner color="#000" />} */}
              </S.InputWrapper>
              {isShowMenu && (
                <S.Menu {...getMenuProps()}>
                  {
                    (results as OptionGroup[]).reduce(
                      (acc, result, resultIndex) => {
                        if (groupsEnabled) {
                          acc.itemsToRender.push(
                            // @ts-ignore
                            <Fragment key={resultIndex}>
                              {renderGroupHeader(result as OptionGroup)}
                              {(result as OptionGroup).options &&
                                (result as OptionGroup).options.map(
                                  (option, optionIndex) => {
                                    const index = acc.itemIndex++;
                                    return (
                                      // @ts-ignore
                                      <S.Item
                                        key={optionIndex}
                                        {...getItemProps({
                                          index,
                                          // @ts-ignore
                                          isSelected:
                                            selectedItem &&
                                            itemToString(selectedItem) ===
                                              itemToString(option),
                                          item: option,
                                        })}
                                        isHighlighted={
                                          highlightedIndex === index
                                        }
                                      >
                                        {renderItem(option)}
                                      </S.Item>
                                    );
                                  },
                                )}
                            </Fragment>,
                          );
                        } else {
                          acc.itemsToRender.push(
                            // @ts-ignore
                            <S.Item
                              key={resultIndex}
                              {...getItemProps({
                                index: resultIndex,
                                // @ts-ignore
                                isSelected:
                                  selectedItem &&
                                  itemToString(selectedItem) ===
                                    itemToString(result),
                                item: result,
                              })}
                              isHighlighted={highlightedIndex === resultIndex}
                            >
                              {renderItem(result)}
                            </S.Item>,
                          );
                        }

                        return acc;
                      },
                      { itemsToRender: [], itemIndex: 0 },
                    ).itemsToRender
                  }
                </S.Menu>
              )}
            </S.Wrapper>
          );
        }}
      </Downshift>
    );
  },
);

Search.displayName = "Search";

export const StyledSearch = S.Wrapper;
