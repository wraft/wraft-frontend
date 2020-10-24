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
  const [selected, setSelect] = useState<Date|undefined>();
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
    console.log('date', _selectedDay, _modifiers, dayPickerInput, input);
    if (input) {
      const inptfrm = !input.value.trim();
      if(inptfrm) {
        console.log('inptfrm muneef x10', inptfrm);
        // setstatus(2);
        // const result:any = parseDate(inptfrm, '', 'en');
        // setSelect(result);
      }
    }
    // // onChange(date);
  };

  const formatDate = (date: any, format: string, locale: any) => {
    // console.log('frm', date);
    return dateFnsFormat(date, format, { locale });
  };

  const parseDate = (str: string, format: string, locale: any) => {
    // console.log('str', str);
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };

  const FORMAT = 'yyyy-MM-dd';

  useEffect(() => {
    if (defaultValue) {
      setstatus(2);
      // console.log('defaultValue', defaultValue, value);

      const dx = parseDate(defaultValue, FORMAT, 'en');
      console.log('parseDate', 'fida vs muneef', dx);
      // const dd:any = parseDate(defaultValue, FORMAT, 'en')
      setSelect(dx);
    } else {
      const dx = parseDate("1989-01-02", FORMAT, 'en');
      setSelect(dx);
      console.log('parseDate', 'fida vs muneef', dx);
      setstatus(2);
    }
  }, [defaultValue]);

  return (
    <Box pb={2} mr={mr} sx={{ position: 'relative', width: '100%' }}>
      {/* {value} */}
      {sub && (
        <Text color="#444" sx={{ position: 'absolute', right: 1, top: 40 }}>
          <Calendar width="20" />
        </Text>
      )}
      <Label htmlFor="description" mb={0}>
        {label}
        {/* {selected} */}
      </Label>
      { status > 1 &&  selected &&
        <DayPickerInput
          formatDate={formatDate}
          parseDate={parseDate}
          format={FORMAT}
          onDayChange={onChangeDate}
          value={selected}
          hideOnDayClick={true}
          // selectedDay={selected}
          component={(_props: any) => (
            <>
              <Input
                name={name}
                sx={{ bg: 'white' }}
                // placeholder={placeholder ? placeholder: ''}
                ref={register({ required })}
                {..._props}
                // value={value || selected}
              />
            </>
          )}
        />
          }
    </Box>
  );
};

export default Field;
