import {
  WysiwygExtensions,
  // Toolbar,
  WithPaddingProps,
  ButtonState,
  // IconButton,
  BubbleMenuTooltip,
  BubbleContent,
} from '@remirror/editor-wysiwyg';
import {
  FC,
  DOMAttributes,
  ComponentType,
  MouseEventHandler,
  useMemo,
  useState,
  ChangeEventHandler,
  useRef,
  KeyboardEventHandler,
  useEffect,
} from 'react';
import { useRemirrorContext, bubblePositioner } from '@remirror/react';
import { KeyOfThemeVariant } from '@remirror/core';

import { Button, Box } from 'rebass';
import { useRemirrorTheme } from '@remirror/ui';

import { keyName } from 'w3c-keyname';

import {
  BoldIcon,
  CodeIcon,
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
  // ImagesSolidIcon,
} from '@remirror/ui-icons';
import { ActionNames, AnyFunction, Attrs, getMarkAttrs } from '@remirror/core';
import styled from '@emotion/styled';

const ToolBox = styled(Box)`
  border: solid 1px #eee;
  padding-left: 24px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0px 0px 3px #ddd;
  position: fixed;
  top: 0;
  z-index: 1000;
  background: #fff;
  left: 0;
  right: 0;
  svg {
    color: #000;
    background: #fff;
    width: 16px;
    color: #444;
  }
`;

const ToolBubble = styled(Box)`
  background: #fff;
  border: solid 1px #ddd;
  svg {
    color: #000;
    background: #fff;
  }
`;

interface MenuBarProps extends Pick<BubbleMenuProps, 'activateLink'> {
  inverse?: boolean;
  onImage?: any;
}

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
  ['undo', [UndoAltIcon]],
  ['redo', [RedoAltIcon]],
  ['toggleBulletList', [ListUlIcon]],
  ['toggleOrderedList', [ListOlIcon]],
  ['blockquote', [QuoteRightIcon]],
  ['toggleCodeBlock', [CodeIcon]],
  ['horizontalRule', [RulerHorizontalIcon]],
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

/**
 * The MenuBar component which renders the actions that can be taken on the text within the editor.
 */
export const MenuBar: FC<MenuBarProps> = ({ inverse, activateLink }) => {
  const { actions } = useRemirrorContext<WysiwygExtensions>();
  return (
    <ToolBox>
      {menuItems.map(([name, [Icon, subText], attrs], index) => {
        // console.log('attrs', name, attrs)
        let buttonState: any;
        if (attrs) {
          buttonState = getButtonState(actions[name].isActive(attrs), true);
        } else {
          buttonState = 'default';
        }

        return (
          <MenuItem
            index={index}
            key={index}
            Icon={Icon}
            subText={subText}
            state={buttonState}
            disabled={false}
            onClick={runAction(actions[name])}
          />
        );
      })}
      <MenuItem
        Icon={LinkIcon}
        state={getButtonState(actions.updateLink.isActive(), inverse)}
        disabled={!actions.updateLink.isEnabled()}
        onClick={activateLink}
      />
      {/* <MenuItem
        Icon={ImagesSolidIcon}
        state={getButtonState(actions.insertBlockr.isActive(), inverse)}
        disabled={false}
        onClick={InsertBlockr}
      /> */}
    </ToolBox>
  );
};

interface MenuItemProps extends Partial<WithPaddingProps> {
  state?: ButtonState;
  onClick: DOMAttributes<HTMLButtonElement>['onClick'];
  Icon: ComponentType<IconProps>;
  variant?: KeyOfThemeVariant<'remirror:icons'>;
  disabled?: boolean;
  subText?: string;
  index?: number;
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
}) => {
  console.log('state', state);
  console.log('index={index}', index)
  return (
    <Button
      onClick={onClick}      
      disabled={disabled}      
      sx={{ borderRadius: 0 }}>
      <Icon
        variant={variant}
        styles={{ color: disabled ? 'gray' : undefined }}
      />
    </Button>
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
  activateLink,
}) => {
  const {
    actions,
    getPositionerProps,
    // helpers,
    state,
    manager,
  } = useRemirrorContext<WysiwygExtensions>();

  const positionerProps = getPositionerProps({
    ...bubblePositioner,
    hasChanged: () => true,
    isActive: params => {
      // return true;
      const answer =
        (bubblePositioner.isActive(params) || linkActivated) &&
        !actions.toggleCodeBlock.isActive();
      // !helpers.isDragging();
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
    <BubbleMenuTooltip ref={ref} bottom={bottom + 5} left={left} translate={0}>
      {linkActivated ? (
        <LinkInput
          {...{ deactivateLink, updateLink, removeLink, canRemove }}
          defaultValue={activatedLinkHref}
        />
      ) : (
        <ToolBubble>
          {bubbleMenuItems.map(([name, [Icon, subText], attrs], index) => {
            let buttonState: any;
            if (attrs) {
              buttonState = getButtonState(actions[name].isActive(attrs), true);
            } else {
              buttonState = 'default';
            }
            // const buttonState = getButtonState(actions[name].isActive(attrs), true);

            return (
              <MenuItem
                key={index}
                index={index}
                Icon={Icon}
                subText={subText}
                state={buttonState}
                disabled={false}
                onClick={runAction(actions[name], attrs)}
                variant="inverse"
              />
            );
          })}
          <MenuItem
            Icon={LinkIcon}
            state={getButtonState(actions.updateLink.isActive(), true)}
            onClick={activateLink}
            variant="inverse"
          />
        </ToolBubble>
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
    const key = keyName.keyName(event.nativeEvent);
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
    <BubbleContent ref={wrapperRef} translate={0}>
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
