import React, { useEffect, useState, useRef } from 'react';
import { format, parse, isValid } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Box, Text, Label } from '@wraft/ui';
import { CalendarIcon } from '@phosphor-icons/react';
import styled from '@emotion/styled';

import 'react-day-picker/dist/style.css';

import { IconFrame } from './Atoms';

const DateInputWrapper = styled(Box)`
  .rdp-root {
    --rdp-accent-color: var(--theme-ui-colors-green-800);
    padding: 10px 10px;
  }

  input::placeholder {
    color: var(--theme-ui-colors-gray-800);
  }
`;

interface Props {
  register?: any;
  label: string;
  name: string;
  defaultValue?: string;
  mr?: number;
  placeholder?: string;
  sub?: string;
  onClick?: any;
  onChange: any;
  required?: boolean;
  value?: any;
  error?: string;
  dateFormat?: string;
}

const Field: React.FC<Props> = ({
  name,
  label,
  placeholder = 'Select a date',
  register,
  defaultValue,
  value: controlledValue,
  onChange,
  required = false,
  mr,
  sub,
  error,
  dateFormat = 'yyyy-MM-dd',
}) => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<number>(0);
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const inputId = `date-field-${name}`;

  const FORMAT = dateFormat;

  const formatDate = (date: Date): string => {
    return format(date, FORMAT);
  };

  const parseDate = (str: string): Date | undefined => {
    const parsed = parse(str, FORMAT, new Date());
    return isValid(parsed) ? parsed : undefined;
  };

  const handleDaySelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      const formattedDate = formatDate(date);
      setInputValue(formattedDate);
      onChange && onChange(formattedDate);
    }
    setIsCalendarOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const parsedDate = parseDate(value);
    if (parsedDate) {
      setSelected(parsedDate);
      onChange && onChange(value);
    } else {
      onChange && onChange(value);
    }
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setStatus(2);
      const dx = parseDate(controlledValue);
      setSelected(dx);
      setInputValue(controlledValue || '');
    } else if (defaultValue) {
      setStatus(2);
      const dx = parseDate(defaultValue);
      setSelected(dx);
      setInputValue(defaultValue);
    } else {
      const defaultDate = parseDate('1989-01-02');
      setSelected(defaultDate);
      setInputValue(defaultDate ? formatDate(defaultDate) : '');
      setStatus(2);
    }
  }, [controlledValue, defaultValue]);

  return (
    <DateInputWrapper pb="sm" mr={mr} position="relative" w="100%">
      <Label htmlFor={inputId} mb="0">
        {label}
        {required && (
          <Text as="span" color="error" ml="xs">
            *
          </Text>
        )}
      </Label>
      {status > 1 && (
        <Box position="relative" mt="xs">
          <Box ref={inputRef}>
            <Box
              as="input"
              id={inputId}
              name={name}
              value={
                controlledValue !== undefined ? controlledValue : inputValue
              }
              onChange={handleInputChange}
              onClick={toggleCalendar}
              placeholder={placeholder}
              {...(register ? register(name, { required: required }) : {})}
              aria-label={`Date field for ${label}`}
              aria-required={required}
              w="100%"
              py="md"
              px="md"
              borderRadius="md"
              border="1px solid"
              borderColor={error ? 'error' : 'border'}
              fontSize="14px"
            />
            {error && (
              <Text fontSize="sm" color="error" mt="sm">
                {error}
              </Text>
            )}
            {sub && (
              <Box
                position="absolute"
                right="10px"
                top="10px"
                cursor="pointer"
                onClick={toggleCalendar}
                aria-label="Open calendar"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleCalendar();
                  }
                }}>
                <IconFrame color="icon">
                  <CalendarIcon size={20} />
                </IconFrame>
              </Box>
            )}
          </Box>

          {isCalendarOpen && (
            <Box
              ref={calendarRef}
              position="absolute"
              zIndex={10}
              bg="white"
              boxShadow="md"
              mt="xs"
              borderRadius="sm"
              border="1px solid"
              borderColor="border">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleDaySelect}
                defaultMonth={selected}
              />
            </Box>
          )}
        </Box>
      )}
    </DateInputWrapper>
  );
};

export default Field;
