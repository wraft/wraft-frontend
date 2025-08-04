import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Sketch = dynamic(
  () => import('@uiw/react-color').then((mod) => ({ default: mod.Sketch })),
  { ssr: false },
);
import { InkIcon } from '@wraft/icon';
import { Text, Box, InputText, Flex, DropdownMenu } from '@wraft/ui';
import styled from '@emotion/styled';

const ColorInput = styled(InputText)`
  width: 100px;
  padding: 4px 16px;
  height: 28px;
  font-size: 12px;
`;

interface FieldColorProps {
  register: any;
  label: React.ReactNode;
  name: string;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
  onChangeColor?: (color: string, fieldName: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Color Picker Component
 * @param props - Component props
 * @returns Color picker component
 */
const FieldColor: React.FC<FieldColorProps> = ({
  disabled,
  name,
  label,
  placeholder,
  register,
  defaultValue,
  onChangeColor,
  required = true,
  readOnly = false,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(defaultValue);

  const handleColorChange = (color: any) => {
    const hexColor = color && color.hex;
    setSelectedColor(hexColor);

    if (onChangeColor) {
      onChangeColor(hexColor, name);
    }
  };

  const isInside = variant === 'inside';

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHexColor = e.target.value;
    setSelectedColor(newHexColor);
    if (onChangeColor) {
      onChangeColor(newHexColor, name);
    }
  };

  useEffect(() => {
    const initialColor: string = defaultValue || generateRandomColor();
    setSelectedColor(initialColor);
    if (onChangeColor) {
      onChangeColor(initialColor, name);
    }
  }, [defaultValue]);

  const generateRandomColor = (): string => {
    const randomValue = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${randomValue()}${randomValue()}${randomValue()}`;
  };

  return (
    <Flex
      alignItems="center"
      gap="sm"
      px="md"
      py="md"
      justifyContent="space-between">
      <Text>{label}</Text>
      <Flex gap="sm" alignItems="center">
        {readOnly ? (
          <Text color="text-secondary" textTransform="uppercase">
            {defaultValue}
          </Text>
        ) : (
          <ColorInput
            placeholder={placeholder || ''}
            id={name}
            type="text"
            value={selectedColor || defaultValue || ''}
            pl="40px"
            pr="80px"
            textTransform="uppercase"
            color="gray.900"
            textAlign="left"
            {...register(name, { required })}
            onChange={handleHexInputChange}
            disabled={disabled || readOnly}
          />
        )}

        <DropdownMenu.Provider>
          <DropdownMenu.Trigger>
            <Box
              bg={selectedColor}
              w="18px"
              h="18px"
              border="solid 1px"
              borderColor="border"
              borderRadius="full"
              cursor={readOnly ? 'default' : 'pointer'}
            />
          </DropdownMenu.Trigger>
          {!readOnly && (
            <DropdownMenu aria-label="color picker">
              <Sketch color={selectedColor} onChange={handleColorChange} />
            </DropdownMenu>
          )}
        </DropdownMenu.Provider>

        {!readOnly && (
          <Box right="12px">
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <Box
                  borderRadius="4px"
                  display="flex"
                  cursor={readOnly ? 'default' : 'pointer'}>
                  <InkIcon
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    color="#d6dad9"
                  />
                </Box>
              </DropdownMenu.Trigger>

              <DropdownMenu aria-label="color picker">
                <Sketch color={selectedColor} onChange={handleColorChange} />
              </DropdownMenu>
            </DropdownMenu.Provider>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default FieldColor;
