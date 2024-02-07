/** @jsxImportSource theme-ui */
import { useEffect, useRef } from 'react';

import { Checkbox as AriakitCheckbox, CheckboxOptions } from '@ariakit/react';
import { TickIcon, DashIcon } from '@wraft/icon';
import { renderToString } from 'react-dom/server';

interface IndeterminateCheckboxProps extends CheckboxOptions<'input'> {
  indeterminate?: boolean;
  className?: string;
  variant?: 'dark' | 'white';
  size?: 'small' | 'medium' | 'large';
}

const Checkbox = ({
  indeterminate,
  className = '',
  variant = 'dark',
  size = 'medium',
  ...rest
}: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null!);
  const checkboxSize = size === 'large' ? 24 : size === 'small' ? 16 : 20;
  const tickSize = size === 'large' ? 20 : size === 'small' ? 12 : 16;
  const dashSize = size === 'large' ? 20 : size === 'small' ? 12 : 16;
  const paddingTop =
    size === 'large' ? '4.5px' : size === 'small' ? '3.5px' : '4px';

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <AriakitCheckbox
      sx={{
        appearance: 'none',
        border: `1px solid #D4D7DA`,
        backgroundColor: 'transparent',
        borderRadius: '4px',
        height: `${checkboxSize}px`,
        width: `${checkboxSize}px`,
        '&:checked': {
          display: 'flex',
          justifyContent: 'center',
          borderColor: variant === 'dark' ? '#343E49' : '#343E49',
          backgroundColor: variant === 'dark' ? '#343E49' : 'transparent',
          alignItems: 'center',
          '&:after': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: paddingTop,
            content: `url("data:image/svg+xml,${encodeURIComponent(
              renderToString(
                <TickIcon
                  color={variant === 'dark' ? '#FFFFFF' : '#343E49'}
                  width={tickSize}
                  height={tickSize}
                  viewBox="0 0 24 24"
                />,
              ),
            )}")`,
          },
        },
        '&:indeterminate': {
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          alignItems: 'center',
          '&:after': {
            display: 'block',
            mt: paddingTop,
            content: `url("data:image/svg+xml,${encodeURIComponent(
              renderToString(
                <DashIcon
                  sx={{ my: 'auto' }}
                  width={dashSize}
                  height={dashSize}
                  color={'#343E49'}
                  viewBox="0 0 24 24"
                />,
              ),
            )}")`,
          },
        },
      }}
      type="checkbox"
      name="parent"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
};

export default Checkbox;
