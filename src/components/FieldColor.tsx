import React, { useEffect, useState } from 'react';
import { Text, Box, Label, Input } from 'theme-ui';
import { ChromePicker } from 'react-color';

import { usePopoverState, Popover, PopoverDisclosure } from 'reakit/Popover';

interface FieldColorProps {
  register: any;
  label: string;
  name: string;
  defaultValue: string;
  mr?: number;
  placeholder?: string;
  sub?: string;
  required?: boolean;
  ftype?: string;
  onChangeColor?: any;
}

const FieldColor: React.FC<FieldColorProps> = ({
  name,
  label,
  placeholder,
  register,
  defaultValue,
  mr,
  sub,
  ftype = 'text',
  onChangeColor,
  required = true,
}) => {
  const [valx, setVal] = useState<string>(defaultValue);
  const popover = usePopoverState();
  
  const changeColor = (_e: any) => {
    const colr = _e && _e.hex;
    setVal(colr);

    if (typeof onChangeColor.onChange === 'undefined') {
      onChangeColor(colr, name);
    }
  };

  useEffect(() => {
    const vX: string = defaultValue || '';
    setVal(vX);
  }, [defaultValue]);

  return (
    <Box pb={2} mr={mr} sx={{ position: 'relative' }}>
      <PopoverDisclosure
        {...popover}
        children={(disclosure) => (
          <Box
            sx={{
              bg: valx,
              width: '18px',
              height: '18px',
              border: 'solid 1px',
              borderColor: 'gray.3',
              position: 'absolute',
              top: '45%',
              right: 3,
              padding: '5px',
              // background: "#fff",
              borderRadius: '1px',
              boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
              display: 'inline-block',
              cursor: 'pointer',
            }}
            {...disclosure}
          />
        )}
      />

      <Box>
        {sub && (
          <Text color="#111" sx={{ position: 'absolute', right: 16, top: 32 }}>
            {sub}
          </Text>
        )}
        <Label htmlFor="description" sx={{ color: '#333', pb: 1 }}>
          {label}
        </Label>
        <Input
          placeholder={placeholder ? placeholder : ''}
          id={name}
          name={name}
          type={ftype}
          defaultValue={valx || defaultValue || ''}
          ref={register({ required: required })}
        />
      </Box>

      <Popover
        {...popover}
        aria-label="Edit color"
        sx={{
          outline: 'none',
        }}>
        <ChromePicker
          color={valx}
          disableAlpha
          onChangeComplete={(e: any) => changeColor(e)}
        />
      </Popover>
    </Box>
  );
};

export default FieldColor;
