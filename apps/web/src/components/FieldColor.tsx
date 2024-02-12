import React, { useEffect, useState } from 'react';

import { PopoverProvider, Popover, PopoverDisclosure } from '@ariakit/react';
import { Chrome } from '@uiw/react-color';
import { InkIcon } from '@wraft/icon';
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
  variant?: 'inside' | 'outside';
  border?: string;
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
  variant = 'outside',
  border,
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

  const isInside = variant === 'inside';

  return (
    <PopoverProvider>
      <Box mr={mr} sx={{ position: 'relative' }}>
        <Box sx={{ ml: 0 }}>
          {sub && (
            <Text sx={{ position: 'absolute', right: 16, top: 32 }}>{sub}</Text>
          )}
          {!isInside && <Label htmlFor="description">{label}</Label>}
          <Flex sx={{ position: 'relative' }}>
            {isInside && (
              <Text
                as={'p'}
                variant="pR"
                sx={{
                  position: 'absolute',
                  left: 3,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}>
                {label}
              </Text>
            )}
            <Input
              placeholder={placeholder ? placeholder : ''}
              id={name}
              type={ftype}
              defaultValue={valx || defaultValue || ''}
              sx={{
                pl: '40px',
                pr: '70px',
                variant: 'texts.subR',
                textTransform: 'uppercase',
                color: 'gray.900',
                textAlign: `${isInside ? 'right' : 'left'}`,
                border: border,
              }}
              {...register(name, { required: required })}
              onChange={(e) => {
                handleHexInputChange(e);
              }}
            />
            <Box sx={{ pt: 0 }}>
              <Box
                as={PopoverDisclosure}
                sx={{
                  bg: 'transparent',
                  border: 0,
                }}>
                <Box
                  id="colorBox"
                  bg={valx}
                  sx={{
                    width: '18px',
                    height: '18px',
                    border: 'solid 1px',
                    borderColor: 'border',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isInside ? 'right' : 'left']:
                      `${isInside ? '50px' : '16px'}`,
                    padding: '5px',
                    borderRadius: '99px',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: '20px',
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
              <Popover aria-label="Edit color" style={{ zIndex: 1000 }}>
                <Box>
                  <Chrome color={valx} onChange={(e: any) => changeColor(e)} />
                  {/* <ChromePicker
                    color={valx}
                    disableAlpha
                    onChangeComplete={(e: any) => changeColor(e)}
                  /> */}
                </Box>
              </Popover>
            </Box>
          </Flex>
        </Box>
      </Box>
    </PopoverProvider>
  );
};

export default FieldColor;
