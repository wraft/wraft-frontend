/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  ChangeEventHandler,
  ComponentType,
  DOMAttributes,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { keyName } from 'w3c-keyname';

import {
  ActionNames,
  AnyFunction,
  Attrs,
  KeyOfThemeVariant,
  getMarkAttrs,
} from '@remirror/core';
import { bubblePositioner, useRemirrorContext } from '@remirror/react';
import { useRemirrorTheme } from '@remirror/ui';
import {
  BoldIcon,
  // CodeIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  IconProps,
  ItalicIcon,
  LinkIcon,
  ListOlIcon,
  ListUlIcon,
  QuoteRightIcon,
  RedoAltIcon,
  RulerHorizontalIcon,
  StrikethroughIcon,
  TimesIcon,
  UnderlineIcon,
  UndoAltIcon,
  ImagesRegularIcon,
} from '@remirror/ui-icons';

// import { TypeH1 } from '@styled-icons/bootstrap'

import { ButtonState, WysiwygExtensions } from './wysiwyg-types';

import {
  BubbleContent,
  BubbleMenuTooltip,
  IconButton,
  Toolbar,
  WithPaddingProps,
} from './wysiwyg-components';

// import {
//   // WysiwygExtensions,
//   Toolbar,
//   WithPaddingProps,
//   // ButtonState,
//   IconButton,
//   BubbleMenuTooltip,
//   BubbleContent,
// } from "@remirror/editor-wysiwyg";

const menuItems: Array<[
  ActionNames<WysiwygExtensions>,
  [ComponentType<IconProps>, string?],
  Attrs?,
]> = [
  ['bold', [BoldIcon]],
  ['italic', [ItalicIcon]],  
  ['underline', [UnderlineIcon]],
  ['strike', [StrikethroughIcon]],
  ['toggleHeading', [H1Icon, '1'], { level: 1 }],
  ['toggleHeading', [H2Icon, '2'], { level: 2 }],
  ['toggleHeading', [H3Icon, '3'], { level: 3 }],  
  ['toggleBulletList', [ListUlIcon]],
  ['toggleOrderedList', [ListOlIcon]],
  ['blockquote', [QuoteRightIcon]],
  // ['toggleCodeBlock', [CodeIcon]],
  ['horizontalRule', [RulerHorizontalIcon]],
  ['insertImage', [ImagesRegularIcon]],
  ['undo', [UndoAltIcon]],
  ['redo', [RedoAltIcon]],
];

const runAction = (
  method: AnyFunction,
  attrs?: Attrs,
): MouseEventHandler<HTMLElement> => e => {
  e.preventDefault();
  method(attrs);
};

/**
 * Retrieve the state for the button
 */
const getButtonState = (active: boolean, inverse = false): ButtonState =>
  active
    ? inverse
      ? 'active-inverse'
      : 'active-default'
    : inverse
    ? 'inverse'
    : 'default';

interface MenuBarProps extends Pick<BubbleMenuProps, 'activateLink'> {
  inverse?: boolean;
}

/**
 * The MenuBar component which renders the actions that can be taken on the text within the editor.
 */
export const MenuBar: FC<MenuBarProps> = ({ inverse, activateLink }) => {
  const { actions } = useRemirrorContext<WysiwygExtensions>();

  const actionNow = (actions: any, name:string) => {
    runAction(actions[name])
  }

  return (
    <Toolbar>
      {actions &&
        menuItems.map(([name, [Icon, subText], attrs], index) => {        
          try {
            const buttonState = getButtonState(
              actions[name].isActive(attrs),
              inverse,
            );
            // console.log('buttonState', buttonState);
            return (
              <MenuItem
                index={index}
                key={index}
                Icon={Icon}
                subText={subText}
                state="inverse"
                name={name}
                {...{ tx: buttonState}}
                // disabled={!actions[name].isEnabled()}
                // onClick={name => console.log('x', name, actions)}
                // onClick={runAction(actions[name], attrs)}
                onClick={() => actionNow(actions, name)}
              />
            );
          } catch (err) {
            return (<></>)
          }        
        })}
      <MenuItem
        Icon={LinkIcon}
        state={getButtonState(actions.updateLink.isActive(), inverse)}
        disabled={!actions.updateLink.isEnabled()}
        onClick={activateLink}
      />
    </Toolbar>
  );
};

interface MenuItemProps extends Partial<WithPaddingProps> {
  state: ButtonState;
  onClick: DOMAttributes<HTMLButtonElement>['onClick'];
  Icon: ComponentType<IconProps>;
  variant?: KeyOfThemeVariant<'remirror:icons'>;
  disabled?: boolean;
  subText?: string;
  index?: number;
  name?: string;
}

/**
 * A single clickable menu item for editing the styling and format of the text.
 */
const MenuItem: FC<MenuItemProps> = ({
  state,
  onClick,
  Icon,
  variant,
  disabled = false,
  index,
  name = 'x',
}) => {
  return (
    <IconButton
      onClick={onClick}
      state={state}
      disabled={disabled}
      data-rel={name}      
      index={index}
      sx={{ bg: 'gray.1'}}
      >
      <Icon
        variant={variant}
        styles={{ color: disabled ? 'gray.1' : 'gray.2' }}
      />
    </IconButton>
  );
};

export interface BubbleMenuProps {
  linkActivated: boolean;
  deactivateLink(): void;
  activateLink(): void;
}

const bubbleMenuItems: Array<[
  ActionNames<WysiwygExtensions>,
  [ComponentType<IconProps>, string?],
  Attrs?,
]> = [
  ['bold', [BoldIcon]],
  ['italic', [ItalicIcon]],
  ['underline', [UnderlineIcon]],
];

export const BubbleMenu: FC<BubbleMenuProps> = ({
  linkActivated = false,
  deactivateLink,
  // activateLink,
}) => {
  const {
    actions,
    getPositionerProps,
    helpers,
    state,
    manager,
  } = useRemirrorContext<WysiwygExtensions>();

  const positionerProps = getPositionerProps({
    ...bubblePositioner,
    hasChanged: () => true,
    isActive: params => {
      const answer =
        (bubblePositioner.isActive(params) || linkActivated) &&
        !actions.toggleCodeBlock.isActive() &&
        !helpers.isDragging();
      return answer;
    },
    positionerId: 'bubbleMenu',
  });

  const { bottom, ref, left } = positionerProps;

  const updateLink = (href: string) => actions.updateLink({ href });
  const removeLink = () => actions.removeLink();
  const canRemove = () => actions.removeLink.isActive();

  const activatedLinkHref = useMemo<string | undefined>(() => {
    return getMarkAttrs(state.newState, manager.schema.marks.link).href;
  }, [manager, state]);

  return (
    <BubbleMenuTooltip ref={ref} bottom={bottom + 5} left={left}>
      {linkActivated ? (
        <LinkInput
          {...{ deactivateLink, updateLink, removeLink, canRemove }}
          defaultValue={activatedLinkHref}
        />
      ) : (
        <BubbleContent>
          {bubbleMenuItems.map(([name, [Icon, subText], attrs], index) => {
            const buttonState = getButtonState(actions[name].isActive(attrs), true);

            return (
              <MenuItem
                key={index}
                index={index}
                Icon={Icon}
                subText={subText}
                state={buttonState}
                disabled={!actions[name].isEnabled()}
                onClick={runAction(actions[name], attrs)}
                variant='inverse'
              />
            );
          })}
          {/* <MenuItem
            Icon={LinkIcon}
            state={getButtonState(actions.updateLink.isActive(), true)}
            onClick={activateLink}
            variant="inverse"
          /> */}
        </BubbleContent>
      )}
    </BubbleMenuTooltip>
  );
};

interface LinkInputProps extends Pick<BubbleMenuProps, 'deactivateLink'> {
  defaultValue?: string;
  updateLink(href: string): void;
  removeLink(): void;
  canRemove(): boolean;
}

const LinkInput: FC<LinkInputProps> = ({
  defaultValue,
  deactivateLink,
  updateLink,
  removeLink,
  canRemove,
}) => {
  const [href, setHref] = useState('');
  const { css } = useRemirrorTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    setHref(event.target.value);
  };

  const submitLink = () => {
    updateLink(href);
    deactivateLink();
  };

  const onKeyPress: KeyboardEventHandler<HTMLInputElement> = event => {
    const key = keyName(event.nativeEvent);
    if (key === 'Escape') {
      event.preventDefault();
      deactivateLink();
    }

    if (key === 'Enter') {
      event.preventDefault();
      submitLink();
    }
  };

  const onClickRemoveLink: DOMAttributes<
    HTMLButtonElement
  >['onClick'] = event => {
    event.preventDefault();
    removeLink();
    deactivateLink();
  };

  const handleClick = (event: MouseEvent) => {
    if (
      !wrapperRef.current ||
      wrapperRef.current.contains(event.target as Node)
    ) {
      return;
    }
    deactivateLink();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick, false);
    return () => {
      document.removeEventListener('mousedown', handleClick, false);
    };
  });

  return (
    <BubbleContent ref={wrapperRef}>
      <input
        defaultValue={defaultValue}
        placeholder="Enter URL..."
        autoFocus={true}
        onChange={onChange}
        // onBlur={deactivateLink}
        onSubmit={submitLink}
        onKeyPress={onKeyPress}
        css={css`
          border: none;
          color: white;
          background-color: transparent;
          min-width: 150px;
          padding: 0 10px;
        `}
      />
      {canRemove() && (
        <MenuItem
          Icon={TimesIcon}
          state="active-inverse"
          onClick={onClickRemoveLink}
          variant="inverse"
        />
      )}
    </BubbleContent>
  );
};
