/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FC, forwardRef } from 'react';

// import { RemirrorInterpolation } from '@remirror/core';
import { useRemirrorTheme } from '@remirror/ui';
// import { ResetButton } from '@remirror/ui-buttons';

import { ButtonProps } from './wysiwyg-types';

import { Button, Box } from 'theme-ui'

export const Menu = forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>((props, ref) => {
  const { sx } = useRemirrorTheme();

  return (
    <div
      {...props}
      ref={ref}
      css={sx({
        '& > button': {
          display: 'inline-block',
        },
      })}
    />
  );
});

Menu.displayName = 'Menu';

export const Toolbar: FC = props => {
  const { sx } = useRemirrorTheme();

  return (
    <Menu
      {...props}
      css={sx({
        width: '100%',
        // bg: 'white',
        border: 'solid 1px #ddd',
        borderBottom: 0,
        position: 'relative',
        // padding: '1px 28px 17px',
        ml: 0,
        mt: 3,
        // mb: 1,
      })}
    />
  );
};

export interface WithPaddingProps {
  withPadding: 'horizontal' | 'right';
}

interface IconButtonProps extends ButtonProps, Partial<WithPaddingProps> {
  /**
   * The position in the menu
   */
  index?: number;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { sx } = useRemirrorTheme();

  return (
    <Button
      type="button"
      variant="base"
      {...props}
      ref={ref}
      sx={{ mr: 0, bg: 'gray.2', 'svg': { fill: 'gray.8' }, color: 'gray.2', borderRadius: 0, borderRight: 'solid 1px #eee' }}
      css={sx(
        {
          marginLeft: props.index !== 0 ? 3 : 0,
        },
        // props.css as RemirrorInterpolation,
      )}
    />
  );
});

IconButton.displayName = 'IconButton';

/**
 * Allows positioners to work.
 */
export const EditorWrapper = forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>((props, ref) => {
  const { sx } = useRemirrorTheme();

  return <Box {...props} bg="red" ref={ref} css={sx({ position: 'relative' })} />;
});

EditorWrapper.displayName = 'EditorWrapper';

type BubbleMenuTooltipProps = { bottom: number; left: number } & JSX.IntrinsicElements['span'];

export const BubbleMenuTooltip = forwardRef<HTMLSpanElement, BubbleMenuTooltipProps>((props, ref) => {
  const { css } = useRemirrorTheme();

  return (
    <span
      {...props}
      ref={ref}
      css={css`
        z-index: 10;
        position: absolute;
        bottom: ${props.bottom}px;
        left: ${props.left}px;
        padding-bottom: 9px;
        transform: translateX(-50%);
      `}
    />
  );
});

BubbleMenuTooltip.displayName = 'BubbleMenuTooltip';

export const BubbleContent = forwardRef<HTMLSpanElement, JSX.IntrinsicElements['span']>((props, ref) => {
  const { css } = useRemirrorTheme();

  return (
    <span
      {...props}
      ref={ref}
      css={css`
        background: black;
        border-radius: 3px;
        color: white;
        font-size: 0.75rem;
        line-height: 1.4;
        padding: 0.75em;
        text-align: center;
        display: flex;
      `}
    />
  );
});

BubbleContent.displayName = 'BubbleContent';
