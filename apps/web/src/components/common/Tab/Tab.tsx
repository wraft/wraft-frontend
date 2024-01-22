import React from 'react';

import { Tab as TabPrimitive } from 'ariakit/tab';
import type { TabProps as TabPrimitiveProps } from 'ariakit/tab';
import PropTypes from 'prop-types';

// import { Box } from '../../primitives/Box';

import { Box } from 'theme-ui';

export interface TabProps extends TabPrimitiveProps {
  /** The tab contents. */
  children: NonNullable<React.ReactNode>;
  /** Disables the tab. Same as the HTML attribute. */
  disabled?: boolean;
  /** The id of the tab. Same as the HTML attribute. */
  id?: string;
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ children, disabled, ...props }, ref) => {
    return (
      <Box.button
        appearance="none"
        as={TabPrimitive}
        background="none"
        border="none"
        borderBottomColor={{
          _: 'transparent',
          disabled: 'transparent',
          hover: 'colorBorderWeaker',
          selected: 'colorBorderPrimary',
        }}
        borderBottomStyle="borderStyleSolid"
        borderBottomWidth="borderWidth20"
        // There's a conflict with TabPrimitiveProps from Ariakit. We have to convert color to string here because Ariakit doesn't like our responsive/state-based colors.
        color={
          {
            _: 'colorTextStronger',
            disabled: 'colorText',
            hover: 'colorTextStrongest',
            selected: 'colorTextLink',
          } as unknown as string
        }
        cursor={{
          _: 'auto',
          disabled: 'not-allowed',
          hover: 'pointer',
        }}
        disabled={disabled}
        flexGrow={1}
        fontFamily="fontFamilyNotoSans"
        fontSize="fontSize30"
        fontWeight="fontWeightMedium"
        lineHeight="lineHeight30"
        outlineColor={{ focus: 'colorBorderPrimary' }}
        outlineOffset={{ focus: 'borderWidth20' }}
        outlineStyle={{ focus: 'borderStyleSolid' }}
        outlineWidth={{ focus: 'borderWidth20' }}
        paddingBottom="space20"
        paddingLeft="space40"
        paddingRight="space40"
        paddingTop="space20"
        position="relative"
        textDecoration="none"
        zIndex="zIndex10"
        {...props}
        ref={ref}>
        {children}
      </Box.button>
    );
  },
);

Tab.displayName = 'Tab';

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string,
};

export { Tab };
