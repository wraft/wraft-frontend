import React, { useEffect, useState } from 'react';
import { Text, Box, Label, Input, Flex } from 'theme-ui';
import { ChromePicker } from 'react-color';

import { PopoverProvider, Popover, PopoverDisclosure } from '@ariakit/react';

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

/**
 * Basic Color Picker
 * @param param0
 * @returns
 */

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
  console.log(defaultValue);
  const [valx, setVal] = useState<string>(defaultValue);

  /**
   * On Color selected
   * @param _e
   */
  const changeColor = (_e: any) => {
    const colr = _e && _e.hex;
    setVal(colr);

    // if (typeof onChangeColor.onChange === 'undefined') {
    if (onChangeColor) {
      onChangeColor(colr, name);
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHexColor = e.target.value;
    setVal(newHexColor);
    if (onChangeColor) {
      onChangeColor(newHexColor, name);
    }
  };

  useEffect(() => {
    const vX: string = defaultValue || '';
    setVal(vX);
  }, [defaultValue]);

  return (
    <PopoverProvider>
      <Box pb={2} mr={mr} sx={{ position: 'relative' }}>
        <Box sx={{ ml: 0 }}>
          {sub && (
            <Text sx={{ position: 'absolute', right: 16, top: 32 }}>{sub}</Text>
          )}
          <Label htmlFor="description" sx={{ color: '#333', pb: 1 }}>
            {label}
          </Label>
          <Flex sx={{ position: 'relative' }}>
            <Input
              placeholder={placeholder ? placeholder : ''}
              id={name}
              // name={name}
              type={ftype}
              defaultValue={valx || defaultValue || ''}
              sx={{ pl: '40px' }}
              // ref={register({ required: required })}
              {...register(name, { required: required })}
              onChange={(e) => {
                handleHexInputChange(e);
                // changeColor(e.target.value);
              }}
            />
            <Box sx={{ pt: 0 }}>
              <Box as={PopoverDisclosure} sx={{ bg: 'transparent', border: 0 }}>
                <Box id="colorBox" bg={valx} variant="layout.squareButton" />
              </Box>
              <Popover aria-label="Edit color">
                <ChromePicker
                  color={valx}
                  disableAlpha
                  onChangeComplete={(e: any) => changeColor(e)}
                />
              </Popover>
            </Box>
          </Flex>
        </Box>
      </Box>
    </PopoverProvider>
  );
};

export default FieldColor;
