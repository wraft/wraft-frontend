import React, { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';
import { DateUtils } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Label, Input, Text, Box } from 'theme-ui';
import { CalendarDots } from '@phosphor-icons/react';

import 'react-day-picker/lib/style.css';

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
  // onClick,
  // onChange,
  // value,
  required = false,
  mr,
  sub,
}) => {
  const [selected, setSelect] = useState<Date | undefined>();
  const [status, setstatus] = useState<number>(0);

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
    if (input) {
      const inptfrm = !input.value.trim();
      if (inptfrm) {
        // setstatus(2);
        // const result:any = parseDate(inptfrm, '', 'en');
        // setSelect(result);
      }
    }
    // // onChange(date);
  };

  const formatDate = (date: any, formatStr: string, locale: any) => {
    return format(date, formatStr, { locale });
  };

  const parseDate = (str: string, dateFormat: string, locale: any) => {
    const parsed = parse(str, dateFormat, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };

  const FORMAT = 'yyyy-MM-dd';

  useEffect(() => {
    if (defaultValue) {
      setstatus(2);

      const dx = parseDate(defaultValue, FORMAT, 'en');
      // const dd:any = parseDate(defaultValue, FORMAT, 'en')
      setSelect(dx);
    } else {
      const dx = parseDate('1989-01-02', FORMAT, 'en');
      setSelect(dx);
      setstatus(2);
    }
  }, [defaultValue]);

  return (
    <Box pb={2} mr={mr} sx={{ position: 'relative', width: '100%' }}>
      {/* {value} */}
      <Label htmlFor="description" mb={0}>
        {label}
        {/* {selected} */}
      </Label>
      {status > 1 && selected && (
        <DayPickerInput
          formatDate={formatDate}
          parseDate={parseDate}
          format={FORMAT}
          onDayChange={onChangeDate}
          value={selected}
          hideOnDayClick={true}
          // selectedDay={selected}
          component={(_props: any) => (
            <Box sx={{ position: 'relative' }}>
              <Input
                // name={name}
                // placeholder={placeholder ? placeholder: ''}
                // ref={register({ required })}
                {...register(name, { required: required })}
                {..._props}
                // value={value || selected}
              />
              {sub && (
                <Text
                  color="gray.4"
                  sx={{ position: 'absolute', right: 2, top: 2 }}>
                  <CalendarDots width={20} height={20} />
                </Text>
              )}
            </Box>
          )}
        />
      )}
    </Box>
  );
};

export default Field;
