import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text } from 'theme-ui';
import { Input } from 'theme-ui';

import { FieldType, FieldTypeList } from 'components/Variants/VariantForm';
import Field from 'common/Field';
import PageHeader from 'common/PageHeader';
import { isNumeric } from 'utils';
import { postAPI, fetchAPI, putAPI } from 'utils/models';

import FieldEditor from './FieldEditor';

export interface FieldTypeItem {
  key: string;
  title?: string;
  field_type_id: string;
}

const CollectionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [isEdit, setIsEdit] = useState(false);
  const [theme, setTheme] = useState<any>(null);

  const [fields, setFields] = useState([]);
  const [fieldtypes, setFieldtypes] = useState<Array<FieldType>>([]);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  const loadFieldTypes = () => {
    fetchAPI('field_types').then((data: any) => {
      const res: FieldTypeList = data;
      setFieldtypes(res.field_types);
    });
  };

  const formatFields = (formFields: any) => {
    const fieldsMap: any = [];

    formFields &&
      formFields.length > 0 &&
      formFields.map((item: any) => {
        const fid: string = item && item.value && item.value.field_type.id;
        const it: FieldTypeItem = {
          key: item.name,
          field_type_id: fid,
        };

        if (!isNumeric(item.name)) {
          fieldsMap.push(it);
        }
      });
    return fieldsMap;
  };

  /**
   * On Form Created
   */
  const onDone = (_d: any) => {
    toast.success('Saved Successfully', {
      duration: 1000,
      position: 'top-right',
    });
    Router.push(`/forms/edit/${_d?.id}`);
  };

  const onSubmit = (data: any) => {
    const sampleD = {
      title: data.title,
      fields: formatFields(fields),
      description: 'collection form',
    };

    const isUpdate = data.edit != 0 ? true : false;
    if (isUpdate) {
      putAPI(`content_types/${data.edit}`, sampleD).then((d: any) => {
        onDone(d);
      });
    } else {
      postAPI('content_types', sampleD).then((d: any) => {
        onDone(d);
      });
    }
  };

  /**
   * Entity Loader
   */
  const loadDataDetalis = (id: string) => {
    fetchAPI(`collection_forms/${id}?page=1`);
    return false;
  };

  /**
   * Load Entity details to prefill form
   */

  useEffect(() => {
    if (cId) {
      setIsEdit(true);
      loadDataDetalis(cId);
      setValue('edit', cId);
      setTheme('x');
    }
  }, [cId]);

  const addFieldVal = (val: any) =>
    setFields((currentFields) => {
      const outputState: any = currentFields.slice(0);
      outputState.push({ name: val.name, value: val.value });
      return outputState;
    });

  const removeField = (did: number) =>
    setFields((currentFields) => {
      const outputState = currentFields.slice(0);
      delete outputState[did];
      return outputState;
    });

  const onFieldsSave = (fds: any) => {
    setFields([]);

    fds?.data?.fields?.forEach((el: any) => {
      const ff = fieldtypes.find((f: any) => f.id === el.type);
      const fff = { field_type: ff, name: el.name };
      const fieldType = { value: fff, name: el.name };
      addFieldVal(fieldType);
    });
  };

  const addField = () => {
    setFields((currentFields) => {
      const outputState: any = currentFields.slice(0);
      outputState.push('');
      return outputState;
    });
  };

  useEffect(() => {
    loadFieldTypes();
  }, []);

  return (
    <Box>
      <PageHeader
        title={`${cId ? 'Edit' : 'New '} Collection Form`}
        desc="Manage Custom Forms">
        <Box />
      </PageHeader>
      <Flex>
        <Box sx={{ minWidth: '60ch' }}>
          <Box mx={0} mb={3} as="form" onSubmit={handleSubmit(onSubmit)}>
            <Flex variant="layout.pageFrame">
              <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
                <Box mx={0} mb={3}>
                  <Flex>
                    <Box>
                      <Input
                        // name="edit"
                        type="hidden"
                        // ref={register}
                        {...register('edit', { required: true })}
                      />
                      <Field
                        name="title"
                        label="Name"
                        defaultValue="New Theme"
                        register={register}
                      />
                    </Box>

                    {errors.name && <Text>This field is required</Text>}
                  </Flex>

                  {theme?.file && (
                    <Box sx={{ p: 3, bg: 'teal.700' }}>
                      <Text>{theme?.file}</Text>
                    </Box>
                  )}
                </Box>
                <Button ml={1}>{isEdit ? 'Update' : 'Create Form'}</Button>
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box>
          <FieldEditor
            fields={fields}
            fieldtypes={fieldtypes}
            removeField={removeField}
            addField={addField}
            onSave={onFieldsSave}
          />
        </Box>
      </Flex>
    </Box>
  );
};
export default CollectionForm;
