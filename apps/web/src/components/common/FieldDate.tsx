import React, { useEffect, useState, useRef } from 'react';
import { format, parse, isValid } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Box, Text, Label } from '@wraft/ui';
import { Calendar } from '@phosphor-icons/react';

import 'react-day-picker/dist/style.css';

interface Props {
  register: any;
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
}

const Field: React.FC<Props> = ({
  name,
  label,
  // placeholder,
  register,
  defaultValue,
  onChange,
  required = false,
  mr,
  sub,
}) => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<number>(0);
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const inputId = `date-field-${name}`;

  const FORMAT = 'yyyy-MM-dd';

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
      setInputValue(formatDate(date));
      onChange && onChange(formatDate(date));
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
    }
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // Handle clicks outside the calendar
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
    if (defaultValue) {
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
  }, [defaultValue]);

  return (
    <Box pb="sm" mr={mr} position="relative" w="100%">
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
          <div ref={inputRef}>
            <input
              id={inputId}
              name={name}
              value={inputValue}
              onChange={handleInputChange}
              onClick={toggleCalendar}
              {...register(name, { required: required })}
              aria-label={`Date field for ${label}`}
              aria-required={required}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
              }}
            />
            {sub && (
              <Box
                position="absolute"
                right="8px"
                top="8px"
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
                <Calendar size={20} weight="regular" />
              </Box>
            )}
          </div>

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
    </Box>
  );
};

export default Field;
