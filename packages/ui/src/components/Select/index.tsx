import { DownIcon } from "@wraft/icon";
import DownshiftImport, {
  ControllerStateAndHelpers,
  DownshiftProps,
  GetRootPropsOptions,
} from "downshift";
import { matchSorter } from "match-sorter";
import React, { Fragment, useEffect, useMemo, useState } from "react";

import { CreateWuiProps, forwardRef } from "@/system";
import {
  createEvent,
  CreateEvent,
  DefaultFieldStylesProps,
  FIELD_ICON_SIZE,
} from "@/utils";

import { ClearButton } from "../ClearButton";

import { multipleSelections } from "./multipleSelections";
import * as S from "./styles";
import {
  getInputValue,
  getNewOptions,
  getOptionsFromSelected,
  getSpacer,
  getUniqueValue,
  getValuesFromOptions,
  isValueSelected,
  itemToString,
  kebabCase,
} from "./utils";

export type OptionValue = string | number;
export type SeletOption = {
  disabled?: boolean;
  icon?: React.ReactElement;
  label: string;
  value: OptionValue;
};
export type SelectOptionGroup = { label: string; options: SeletOption[] };
export type OptionItem = SeletOption | SelectOptionGroup;
export type SeletOptions = Array<SeletOption | SelectOptionGroup>;
export type SelectValue =
  | string
  | number
  | string[]
  | SeletOption
  | (string | number | SeletOption)[];

export interface SelectOptions extends DefaultFieldStylesProps {
  allowUnselectFromList?: boolean;
  /** We need to add `autoComplete` off to avoid select UI issues when is an input */
  autoComplete?: string;
  autoFocus?: boolean;
  disableCloseOnSelect?: boolean;
  disabled?: boolean;
  groupsEnabled?: boolean;
  icon?: React.ReactElement;
  id?: string;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMultiple?: boolean;
  isSearchable?: boolean;
  name?: string;
  onBlur?: () => void;
  onChange?: (value: OptionValue | OptionValue[], event?: CreateEvent) => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onCreate?: (option: string, event: CreateEvent) => void;
  onFocus?: () => void;
  options: SeletOptions;
  placeholder?: string;
  renderCreateItem?: (inputValue: SelectValue) => void | any;
  renderGroupHeader?: (option: SelectOptionGroup) => React.ReactNode;
  renderItem?: (
    item: SeletOption | unknown,
    isItemSelected?: boolean,
  ) => string | React.ReactElement;
  renderMultiple?: (
    values: SeletOption[],
    handleRemove: (value: string) => void,
  ) => React.ReactElement;
  transparent?: boolean;
  value?: SelectValue;
}
export type SelectProps = CreateWuiProps<
  "input",
  SelectOptions &
    Omit<DownshiftProps<SeletOption>, keyof SelectOptions | "children">
>;

// because of this issue: https://github.com/downshift-js/downshift/issues/1505
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

const Downshift: typeof DownshiftImport =
  // @ts-ignore
  DownshiftImport.default || DownshiftImport;

/** We need to add autoComplete off to avoid select UI issues when is an input */
export const Select = forwardRef<"input", SelectProps>(
  (
    {
      allowUnselectFromList,
      autoComplete = "off",
      autoFocus,
      dataTestId,
      disableCloseOnSelect,
      disabled,
      groupsEnabled,
      icon,
      id,
      isClearable,
      isCreatable,
      isMultiple,
      isSearchable,
      name,
      onBlur,
      onChange,
      onClick,
      onCreate,
      onFocus,
      options: defaultOptions = [],
      placeholder = "Choose from…",
      renderCreateItem = (inputValue: string) => `Create "${inputValue}"`,
      renderGroupHeader,
      renderItem = itemToString,
      renderMultiple = multipleSelections,
      size = "md",
      transparent,
      value: defaultSelected,
      variant,
      ...rest
    }: SelectProps,
    ref: React.MutableRefObject<HTMLInputElement>,
  ): JSX.Element => {
    const defaultSelecteds = useMemo(
      () =>
        getOptionsFromSelected(defaultSelected, defaultOptions, groupsEnabled),
      [defaultSelected, defaultOptions, groupsEnabled],
    );
    const selectedItem = (!isMultiple && defaultSelecteds[0]) || null;
    const defaultInputValue = selectedItem ? selectedItem.label : "";

    // We keep 3 things in state:
    // a. selected = currently selected item(s)
    // b. inputValue = text in the select/search box
    // c. options = options in the dropdown
    // d. isOpen = the state of the dropdown menu
    const [selected, setSelected] = useState(defaultSelecteds);
    const [inputValue, setInputValue] = useState(defaultInputValue);
    const [options, setOptions] = useState(defaultOptions);
    const [isOpen, setIsOpen] = useState(false);

    // Set default isSearchable
    isSearchable = isCreatable || isSearchable;

    // Autofocus
    useEffect(() => {
      if (autoFocus) {
        ref?.current?.focus();
        isSearchable && setIsOpen(true);
      }
    }, [isSearchable, autoFocus, ref]);

    // Ensure values are controlled by parent
    useEffect(() => {
      setSelected(defaultSelecteds);
      setInputValue(defaultInputValue);
      setOptions(defaultOptions);
    }, [defaultInputValue, defaultOptions, defaultSelecteds]);

    // Update options when searching
    const handleInputChange = (value: string) => {
      // Update
      if (isSearchable && value !== inputValue) {
        let options: (SeletOption | SelectOptionGroup)[] = [];

        if (groupsEnabled) {
          options = matchSorter(defaultOptions as SelectOptionGroup[], value, {
            // should match on group.label OR group.options.label
            keys: [
              (item) => item.label,
              (item) => item.options.map((option) => option.label),
            ],
          });
        } else {
          options = matchSorter(defaultOptions, value, { keys: ["label"] });
        }

        setInputValue(value);
        setOptions(options);
      }
    };

    const handleInputKeyDown = () => {
      if (isSearchable && !isOpen) {
        setIsOpen(true);
      }
    };

    // Send event to parent when value(s) changes
    const handleChange = (options: SeletOption[]) => {
      let values: OptionValue[] = [];

      if (groupsEnabled) {
        values = getValuesFromOptions(
          options,
          defaultOptions.flatMap((group: SelectOptionGroup) => group.options),
        );
      } else {
        values = getValuesFromOptions(options, defaultOptions);
      }

      const value = isMultiple ? values : values[0];
      const event = createEvent({
        name,
        value: isMultiple ? options : options[0],
      });

      onChange && onChange(value, event);

      // If there are newly-created options, call `onCreate`
      if (isCreatable) {
        const newOptions = getNewOptions(options, defaultOptions);
        if (newOptions.length) {
          onCreate && onCreate(newOptions[0].label, event);
        }
      }
    };

    // Update internal state when clicking/adding a select item
    const handleSelect = (option: SeletOption) => {
      let newItems;
      let isClearInput;

      if (!option || option?.disabled) {
        // If removing option
        newItems = isMultiple ? selected : [];
        isClearInput = true;
      } else {
        // If adding option
        newItems = isMultiple
          ? getUniqueValue(option, selected, allowUnselectFromList)
          : [option];
        isClearInput = isMultiple;
      }

      isClearInput && setInputValue("");
      setOptions(defaultOptions);
      setSelected(newItems);
      handleChange(newItems);
      if (!disableCloseOnSelect) {
        setIsOpen(false);
      }
    };

    const handleRemove = (value: string) => {
      const newItems = selected.filter((item) => item.value !== value);
      setSelected(newItems);
      handleChange(newItems);
    };

    const handleOuterClick = (e: ControllerStateAndHelpers<SeletOption>) => {
      // Reset input value if not selecting a new item
      if (isMultiple && e.selectedItem) {
        setInputValue("");
      } else if (isSearchable && e.selectedItem) {
        setInputValue(e.selectedItem.label);
      }
      setOptions(defaultOptions);
      setIsOpen(false);
    };

    const spacer = getSpacer(defaultOptions);

    const inputContent = getInputValue({
      inputValue,
      isMultiple,
      isSearchable,
      options: defaultOptions as SeletOption[],
      renderItem,
    });

    return (
      <Downshift
        id={id}
        inputValue={isSearchable ? (inputContent as string) : ""}
        isOpen={isOpen}
        itemToString={itemToString}
        onInputValueChange={handleInputChange}
        onOuterClick={handleOuterClick}
        onSelect={handleSelect}
        selectedItem={selectedItem}
      >
        {({
          clearSelection,
          getInputProps,
          getItemProps,
          getMenuProps,
          getRootProps,
          getToggleButtonProps,
          highlightedIndex,
        }) => {
          const isShowCreate = !!(
            isCreatable &&
            inputValue &&
            !isValueSelected(inputValue, selected)
          );
          const isShowMenu = isOpen && (options.length || isShowCreate);
          const isShowDeleteIcon = isClearable && inputValue;

          const DeleteIcon = (
            <S.DropDownIndicator as="div">
              <ClearButton
                onClick={
                  clearSelection as unknown as React.MouseEventHandler<HTMLButtonElement>
                }
              />
            </S.DropDownIndicator>
          );
          const ArrowIcon = (
            <S.DropDownIndicator
              data-testid={dataTestId && `${dataTestId}-arrow-icon`}
              disabled={disabled}
              isOpen={isOpen}
              size={size}
              tabIndex={-1}
              {...getToggleButtonProps({
                onClick: () => setIsOpen(!isOpen),
              })}
            >
              <DownIcon width={14} />
            </S.DropDownIndicator>
          );

          const handleInputClick = (e: React.MouseEvent<HTMLElement>) => {
            onClick && onClick(e);
            setIsOpen(!isOpen);
          };

          const rootProps = getRootProps(rest as GetRootPropsOptions);

          const inputProps = getInputProps({
            autoComplete,
            autoFocus,
            "data-spacer": spacer || placeholder,
            "data-testid": dataTestId,
            disabled,
            iconPlacement: icon ? "both" : "right",
            id,
            name,
            onBlur,
            onClick: disabled ? undefined : handleInputClick,
            onFocus,
            onKeyDown: handleInputKeyDown,
            placeholder,
            ref,
            tabIndex: 0,
            variant: isOpen ? "focused" : variant,
            isClearable,
            transparent,
          }) as any;
          const iconSize = FIELD_ICON_SIZE[size];

          return (
            <S.Wrapper {...rootProps} disabled={disabled}>
              <S.InputWrapper>
                {isSearchable ? (
                  <S.Input
                    as="input"
                    type="text"
                    {...inputProps}
                    size={size}
                    {...rest}
                  />
                ) : (
                  <S.Input {...inputProps} size={size} {...rest}>
                    {inputContent}
                  </S.Input>
                )}
                {icon && (
                  <S.IconWrapper iconPlacement="left" size={iconSize}>
                    {React.cloneElement(icon, {
                      ...icon.props,
                      size: iconSize,
                    })}
                  </S.IconWrapper>
                )}
                <S.Indicators size={size}>
                  {isShowDeleteIcon && DeleteIcon}
                  {ArrowIcon}
                </S.Indicators>
              </S.InputWrapper>
              {isShowMenu && (
                <S.Menu {...getMenuProps()}>
                  {
                    options.reduce(
                      (
                        acc: {
                          itemIndex: number;
                          itemsToRender: React.ReactElement[];
                        },
                        result: OptionItem,
                        resultIndex: number,
                      ) => {
                        if (groupsEnabled && "options" in result) {
                          acc.itemsToRender.push(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            <Fragment key={result.label}>
                              {renderGroupHeader(result)}
                              {result.options &&
                                result.options.map((option) => {
                                  const index = acc.itemIndex++;
                                  const isItemSelected = isValueSelected(
                                    option.value,
                                    selected,
                                  );
                                  return (
                                    <S.Item
                                      allowUnselectFromList={
                                        allowUnselectFromList
                                      }
                                      isDisabled={option.disabled}
                                      isHighlighted={highlightedIndex === index}
                                      isMultiple={isMultiple}
                                      key={option.value}
                                      {...getItemProps({
                                        index,
                                        isSelected: isItemSelected,
                                        item: option,
                                      })}
                                    >
                                      {renderItem(option, isItemSelected)}
                                    </S.Item>
                                  );
                                })}
                            </Fragment>,
                          );
                        } else if ("value" in result) {
                          const isItemSelected = isValueSelected(
                            result.value,
                            selected,
                          );
                          acc.itemsToRender.push(
                            <S.Item
                              allowUnselectFromList={allowUnselectFromList}
                              isDisabled={result.disabled}
                              isHighlighted={highlightedIndex === resultIndex}
                              isMultiple={isMultiple}
                              key={result.value}
                              {...getItemProps({
                                index: resultIndex,
                                isSelected: isItemSelected,
                                item: result,
                              })}
                            >
                              {renderItem(result, isItemSelected)}
                            </S.Item>,
                          );
                        }

                        return acc;
                      },
                      { itemsToRender: [], itemIndex: 0 },
                    ).itemsToRender
                  }
                  {isShowCreate && inputValue.length && (
                    <S.Item
                      isHighlighted={highlightedIndex === options.length}
                      key="add"
                      {...getItemProps({
                        index: options.length,
                        item: {
                          value: kebabCase(inputValue),
                          label: inputValue,
                        },
                      })}
                    >
                      {renderCreateItem(inputValue)}
                    </S.Item>
                  )}
                </S.Menu>
              )}
              {isMultiple && renderMultiple(selected, handleRemove)}
            </S.Wrapper>
          );
        }}
      </Downshift>
    );
  },
);

export const StyledSelect = S.Wrapper;
