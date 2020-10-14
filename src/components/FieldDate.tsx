import React, { useEffect, useState } from 'react';
import { Label, Input, Text, Box } from 'theme-ui';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

import { Calendar } from '@styled-icons/boxicons-regular';

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
  placeholder,
  register,
  defaultValue,
  onClick,
  value,
  onChange,
  required = false,
  mr,
  sub,
}) => {
  const [selected, setSelect] = useState<any>();

  const onChangeDate = (
    _selectedDay: any,
    _modifiers: any,
    dayPickerInput: any,
  ) => {
    const input = dayPickerInput.getInput();
    // this.setState({
    //   selectedDay,
    //   isEmpty: !input.value.trim(),
    //   isValidDay: typeof selectedDay !== 'undefined',
    //   isDisabled: modifiers.disabled === true,
    // });
    console.log('date', _selectedDay, _modifiers, dayPickerInput);
    if (input) {
      setSelect(!input.value.trim());
    }
    // // onChange(date);
  };

  const formatDate = (date: any, format: string, locale: any) => {
    console.log('frm', date);
    return dateFnsFormat(date, format, { locale });
  };

  const parseDate = (str: string, format: string, locale: any) => {
    console.log('str', str);
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };

  const FORMAT = 'yyyy-MM-dd';

  useEffect(() => {    
    if (defaultValue) {

      console.log('defaultValue', defaultValue, value);

      const dx = parseDate(defaultValue, FORMAT, 'en');
      console.log('parseDate', dx);
      // const dd:any = parseDate(defaultValue, FORMAT, 'en')
      setSelect(dx);
    }
  }, [defaultValue]);

  return (
    <Box pb={2} mr={mr} sx={{ position: 'relative' }}>
      {sub && (
        <Text color="#444" sx={{ position: 'absolute', right: 16, top: 40 }}>
          <Calendar width="20" />
        </Text>
      )}
      <Label htmlFor="description" mb={0}>
        {label}
      </Label>
        <DayPickerInput
          formatDate={formatDate}
          parseDate={parseDate}
          format={FORMAT}
          onDayChange={onChangeDate}
          selectedDay={selected}
          component={(_props: any) => (
            <>
              <Input
                name={name}
                // placeholder={placeholder ? placeholder: ''}
                ref={register()}
                {..._props}
                // value={value || defaultValue}
              />
            </>
          )}
        />
    </Box>
  );
};

export default Field;
