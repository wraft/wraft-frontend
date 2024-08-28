import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PopoverProvider, Popover, PopoverDisclosure } from '@ariakit/react';
// import Chrome from '@uiw/react-color-chrome';
const Chrome = dynamic(() => import('@uiw/react-color-chrome'), { ssr: false });
import { InkIcon } from '@wraft/icon';
import { Text, Box, Label, Input, Flex, useThemeUI } from 'theme-ui';

interface FieldColorProps {
  register: any;
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  sub?: string;
  required?: boolean;
  ftype?: string;
  onChangeColor?: any;
  variant?: 'inside' | 'outside';
  border?: string;
  disable?: boolean;
  view?: boolean;
}

/**
 * Basic Color Picker
 * @param param0
 * @returns
 */

const FieldColor: React.FC<FieldColorProps> = ({
  disable,
  name,
  label,
  placeholder,
  register,
  defaultValue,
  sub,
  ftype = 'text',
  onChangeColor,
  required = true,
  variant = 'outside',
  border,
  view = false,
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
    console.log('newHexColor', newHexColor);
    setVal(newHexColor);
    if (onChangeColor) {
      onChangeColor(newHexColor, name);
    }
  };

  useEffect(() => {
    const vX: string = defaultValue || generateRandomColor();
    setVal(vX);
    if (onChangeColor) {
      onChangeColor(vX, name);
    }
  }, [defaultValue]);

  const isInside = variant === 'inside';

  const generateRandomColor = (): string => {
    const randomValue = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${randomValue()}${randomValue()}${randomValue()}`;
  };

  return (
    <PopoverProvider>
      <Box sx={{ position: 'relative' }}>
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
              value={valx || defaultValue || ''}
              sx={{
                pl: '40px',
                pr: '80px',
                variant: 'texts.subR',
                textTransform: 'uppercase',
                color: 'gray.900',
                textAlign: `${isInside ? 'right' : 'left'}`,
                border: border,
                ':disabled': {
                  [view ? 'color' : '']: 'text',
                },
              }}
              {...register(name, { required: required })}
              onChange={(e) => {
                handleHexInputChange(e);
              }}
              disabled={disable || view}
            />
            <Box sx={{ width: 0, bg: 'transparent' }}>
              <PopoverDisclosure
                aria-disabled={disable || view}
                as={Box}
                sx={{ bg: 'transparent', border: 'none' }}>
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
                    right: '12px',
                    borderRadius: '4px',
                    display: 'flex',
                    cursor: 'pointer',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <InkIcon
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    color={
                      useThemeUI().theme?.colors?.gray?.[
                        disable || view ? 200 : 600
                      ]
                    }
                  />
                </Box>
              </PopoverDisclosure>
              <Popover aria-label="Edit color" style={{ zIndex: 1000 }}>
                <Box>
                  <Chrome
                    color={valx}
                    onChange={(color: any) => changeColor(color)}
                  />
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
