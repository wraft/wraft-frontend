/** @jsxImportSource theme-ui */
import { useEffect, useRef } from 'react';

import { Checkbox, CheckboxOptions } from '@ariakit/react';

import { svgDataUriDash, svgDataUriTick, svgDataUriTickWhite } from './UriSvgs';

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
      sx={
        variant === 'dark'
          ? {
              appearance: 'none',
              border: '1px solid #D4D7DA',
              borderRadius: '4px',
              height: `${size}px`,
              width: `${size}px`,
              '&:checked': {
                display: 'flex',
                justifyContent: 'center',
                borderColor: '#343E49',
                backgroundColor: '#343E49',
                alignItems: 'center',
                '&:after': {
                  display: 'block',
                  mt: '4px',
                  content: `url("data:image/svg+xml,${svgDataUriTickWhite}")`,
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
                  content: `url("data:image/svg+xml,${svgDataUriDash}")`,
                },
              },
            }
          : {
              appearance: 'none',
              border: '1px solid #D4D7DA',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              height: '20px',
              width: '20px',
              '&:checked': {
                display: 'flex',
                justifyContent: 'center',
                borderColor: '#D4D7DA',
                backgroundColor: 'transparent',
                alignItems: 'center',
                '&:after': {
                  display: 'block',
                  mt: '4px',
                  content: `url("data:image/svg+xml,${svgDataUriTick}")`,
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
                  content: `url("data:image/svg+xml,${svgDataUriDash}")`,
                },
              },
            }
      }
      type="checkbox"
      name="parent"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
};

export default IndeterminateCheckbox;
