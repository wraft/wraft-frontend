/** @jsxImportSource theme-ui */
import { useEffect, useRef } from 'react';

import { Checkbox, CheckboxOptions } from '@ariakit/react';

import { svgDataUriDash, svgDataUriTickWhite } from './UriSvgs';

const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: {
  indeterminate?: boolean;
  className?: string;
} & CheckboxOptions<'input'>) => {
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
        border: '1px solid #D4D7DA',
        borderRadius: '4px',
        height: '20px',
        width: '20px',
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
