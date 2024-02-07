/** @jsxImportSource theme-ui */
import { useEffect, useRef } from 'react';

import { Checkbox, CheckboxOptions } from '@ariakit/react';
import { TickIcon, DashIcon } from '@wraft/icon';
import { renderToString } from 'react-dom/server';

interface IndeterminateCheckboxProps extends CheckboxOptions<'input'> {
  indeterminate?: boolean;
  className?: string;
  variant?: 'dark' | 'white';
  size?: number;
}

const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  variant = 'dark',
  size = 20,
  ...rest
}: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <Checkbox
      sx={{
        appearance: 'none',
        border: `1px solid #D4D7DA`,
        backgroundColor: 'transparent',
        borderRadius: '4px',
        height: `${size}px`,
        width: `${size}px`,
        '&:checked': {
          display: 'flex',
          justifyContent: 'center',
          borderColor: variant === 'dark' ? '#343E49' : '#D4D7DA',
          backgroundColor: variant === 'dark' ? '#343E49' : 'transparent',
          alignItems: 'center',
          '&:after': {
            display: 'block',
            content: `url("data:image/svg+xml,${encodeURIComponent(renderToString(<TickIcon color={variant === 'dark' ? '#FFFFFF' : '#343E49'} width={'16px'} height={'16px'} />))}")`,
          },
        },
        '&:indeterminate': {
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          alignItems: 'center',
          '&:after': {
            display: 'block',
            mb: '5px',
            content: `url("data:image/svg+xml,${encodeURIComponent(renderToString(<DashIcon color={'#343E49'} />))}")`,
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

export default IndeterminateCheckbox;
