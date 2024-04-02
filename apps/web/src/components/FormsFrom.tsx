import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Flex, Input, Label, Text } from 'theme-ui';

// type Props = {};

const FormsFrom = () => {
  const [items, setItems] = useState<any>();
  const onAddField = (type: 'email' | 'date' | 'time' | 'text' | 'options') => {
    const newItem: any = {
      name: '',
      type: type,
      id: Math.random().toString(),
      required: false,
    };
    if (type === 'text') {
      newItem.long = false;
    } else if (type === 'options') {
      newItem.multiple = false;
      newItem.values = [];
    }
    if (items) {
      setItems([...items, newItem]);
    } else {
      setItems([newItem]);
    }
  };

  const onAddOption = (id: string) => {
    const newItem = items.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          values: [...item.values, { name: '', id: Math.random().toString() }],
        };
      }
      return item;
    });
    setItems(newItem);
  };

  const onRequiredChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].required === checked) {
      data[index].required = false;
    } else {
      data[index].required = checked;
    }
    setItems(data);
  };

  const onLongChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].long === checked) {
      data[index].long = false;
    } else {
      data[index].long = checked;
    }
    setItems(data);
  };

  const onMultipleChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].multiple === checked) {
      data[index].multiple = false;
    } else {
      data[index].multiple = checked;
    }
    setItems(data);
  };

  const onNameChange = (e: any, item: any) => {
    const newName = e.target.value;
    const newItem = {
      ...item,
      name: newName,
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  const onOptionNameChange = (e: any, item: any, value: any) => {
    const newName = e.target.value;
    const newValue = {
      ...value,
      name: newName,
    };
    const newItem = {
      ...item,
      values: item.values.map((s: any) => {
        if (s.id === value.id) {
          return newValue;
        } else {
          return s;
        }
      }),
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  useEffect(() => {
    console.table(items);
  }, [items]);

  return (
    <div>
      <Box>
        {items &&
          items.map((item: any, index: number) => (
            <Box key={item.id} sx={{ mt: 3 }}>
              <Label>Field Name</Label>
              <Input
                defaultValue={item.name}
                placeholder="Name"
                onChange={(e) => onNameChange(e, item)}></Input>
              {item.type === 'options' && (
                <Box mt={3}>
                  <Label>Options</Label>
                  <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                    {item.values.map((value: any, index: number) => (
                      <Box key={index}>
                        <Input
                          defaultValue={value.name}
                          placeholder="Option Name"
                          onChange={(e) =>
                            onOptionNameChange(e, item, value)
                          }></Input>
                      </Box>
                    ))}
                  </Flex>
                  <Box mt={3}>
                    <Button
                      variant="secondary"
                      onClick={() => onAddOption(item.id)}>
                      Add Option
                    </Button>
                  </Box>
                </Box>
              )}
              <Flex sx={{ gap: 3, mt: 3 }}>
                <Box>
                  <Label sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Checkbox
                      checked={item.required}
                      onChange={(e) => onRequiredChecked(e, index)}></Checkbox>
                    <Text> Required</Text>
                  </Label>
                </Box>
                {item.type === 'text' && (
                  <Box>
                    <Label
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}>
                      <Checkbox
                        checked={item.long}
                        onChange={(e) => onLongChecked(e, index)}></Checkbox>
                      <Text>Long Answer</Text>
                    </Label>
                  </Box>
                )}
                {item.type === 'options' && (
                  <Box>
                    <Label
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}>
                      <Checkbox
                        checked={item.long}
                        onChange={(e) =>
                          onMultipleChecked(e, index)
                        }></Checkbox>
                      <Text>Multiple Answers</Text>
                    </Label>
                  </Box>
                )}
              </Flex>
            </Box>
          ))}
      </Box>
      <Flex sx={{ gap: 3, mt: 4 }}>
        <Button onClick={() => onAddField('text')}>Text</Button>
        <Button onClick={() => onAddField('options')}>Options</Button>
        <Button onClick={() => onAddField('date')}>Date</Button>
        <Button onClick={() => onAddField('time')}>Time</Button>
        <Button onClick={() => onAddField('email')}>Email</Button>
      </Flex>
    </div>
  );
};

export default FormsFrom;
