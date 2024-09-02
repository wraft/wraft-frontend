import React, { useEffect, useState } from 'react';
import { Box, Flex, Input, Label, Spinner, Text, Textarea } from 'theme-ui';
import { Button } from '@wraft/ui';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import Field from 'components/Field';
import { fetchAPI, postAPI } from 'utils/models';

const PipelineFormEntry = ({
  formId,
  pipelineId,
  setIsOpen,
  setFormName,
}: any) => {
  const [items, setItems] = useState<any>([]);
  const [initial, setInitial] = useState<any>([]);
  const [formdata, setFormdata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = (id: string) => {
    setLoading(true);
    fetchAPI(`forms/${id}`)
      .then((data: any) => {
        setFormdata(data);
        formId && setFormName(data.name);
        const fields = data.fields.map((i: any) => {
          return {
            id: i.id,
            name: i.name,
            type: i.field_type.name,
            fieldTypeId: i.field_type.id,
            required: i.validations.some(
              (val: any) =>
                val.validation.rule === 'required' &&
                val.validation.value === true,
            ),
            value: '',
          };
        });
        setInitial(fields);
        setItems(fields);
        setLoading(false);
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  const onClear = () => {
    setItems(initial);
  };

  const onValueChange = (e: any, item: any) => {
    const newVal = e.target.value;
    const newItem = {
      ...item,
      value: newVal,
      error: newVal === '' ? 'This field is required' : undefined,
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

  const onSave = () => {
    if (items.some((i: any) => !i.value && i.required == true)) {
      const errorsAdded = items.map((i: any) => {
        if (!i.value && i.required == true) {
          return { ...i, error: 'This field is required' };
        } else {
          return i;
        }
      });
      setItems(errorsAdded);
      return;
    }
    const fields = items.map((i: any) => {
      return {
        value: i.value,
        field_id: i.id,
      };
    });
    const data = {
      ...(pipelineId && { pipeline_id: pipelineId }),
      data: fields,
    };

    postAPI(`forms/${formId}/entries`, data)
      .then(() => {
        toast.success('Submitted Successfully');
        setIsOpen(false);
        onClear();
      })
      .catch((err) => {
        if (err.errors == 'No mappings found') {
          toast.error('Pipeline configuration incompleted');
          return;
        }

        toast.error(JSON.stringify(err), {
          duration: 3000,
          position: 'top-right',
        });
      });
  };

  const {
    // formState: { errors },
    register,
  } = useForm<any>({
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (formId) loadData(formId);
  }, [formId]);

  useEffect(() => {
    console.table(items);
  }, [items]);

  if (loading) {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
        <Spinner width={32} />
      </Flex>
    );
  }

  return (
    <Box>
      <Box
        variant="styles.scrollbarY"
        sx={{
          p: '32px',
          height: 'calc(100vh - 170px)',
        }}>
        {items.map((item: any) => (
          <Box key={item.id} sx={{ pb: 2 }}>
            <Label sx={{ color: '#000b08a1' }}>{item.name}</Label>
            {item.type === 'Text' && (
              <Textarea
                value={item.value}
                onChange={(e) => onValueChange(e, item)}
              />
            )}
            {item.type === 'String' && (
              <Input
                sx={{ bg: 'transparent' }}
                name={`contentFields[${item.id}]`}
                onChange={(e) => onValueChange(e, item)}
              />
            )}
            {item.type === 'File Input' && (
              <Input
                type="file"
                value={item.value}
                onChange={(e) => onValueChange(e, item)}
              />
            )}
            {item.type === 'Date' && (
              <Field
                name={`contentFields[${item.id}]`}
                label={item.name}
                defaultValue=""
                register={register}
              />
            )}
            {item.error && <Text variant="error">{item.error}</Text>}
          </Box>
        ))}
      </Box>
      <Flex p="32px" sx={{ gap: 2 }}>
        <Button onClick={onSave}>Run</Button>
        <Button variant="secondary" onClick={onClear}>
          Clear
        </Button>
      </Flex>
    </Box>
  );
};

export default PipelineFormEntry;
