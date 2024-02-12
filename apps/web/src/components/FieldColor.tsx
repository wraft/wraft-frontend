import React, { useEffect, useState } from 'react';

import { PopoverProvider, Popover, PopoverDisclosure } from '@ariakit/react';
import { InkIcon } from '@wraft/icon';
import { ChromePicker } from 'react-color';
import { Text, Box, Label, Input, Flex, useThemeUI } from 'theme-ui';

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
          <Label htmlFor="description">{label}</Label>
          <Flex sx={{ position: 'relative' }}>
            <Input
              placeholder={placeholder ? placeholder : ''}
              id={name}
              type={ftype}
              defaultValue={valx || defaultValue || ''}
              sx={{
                pl: '44px',
                variant: 'texts.subR',
                textTransform: 'uppercase',
                color: 'gray.900',
              }}
              {...register(name, { required: required })}
              onChange={(e) => {
                handleHexInputChange(e);
              }}
            />
            <Box sx={{ pt: 0, zIndex: 1000 }}>
              <Box as={PopoverDisclosure} sx={{ bg: 'transparent', border: 0 }}>
                <Box
                  id="colorBox"
                  bg={valx}
                  sx={{
                    width: '24px',
                    height: '24px',
                    border: 'solid 1px',
                    borderColor: 'border',
                    position: 'absolute',
                    top: '8px',
                    left: '10px',
                    padding: '5px',
                    borderRadius: '99px',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '7px',
                    right: '18px',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}>
                  <InkIcon
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    color={useThemeUI().theme?.colors?.gray?.[600]}
                  />
                </Box>
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
