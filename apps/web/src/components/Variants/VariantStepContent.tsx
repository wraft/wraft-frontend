import React, { memo } from 'react';
import { Box, Flex, Text, InputText, Textarea, Search, Select, Field } from '@wraft/ui';
import { Controller } from 'react-hook-form';
import FieldColor from 'common/FieldColor';
import FieldEditor from '../FieldEditor';
import { TYPES } from '../../schemas/variant';

interface StepContentProps {
  currentStep: number;
  register: any;
  control: any;
  errors: any;
  fieldtypes: any[];
  watch: any;
  trigger: any;
  setValue: any;
  getValues: any;
  frameFields: any[];
  fieldMappings: any[];
  variantFields: any[];
  setFieldMappings: any;
  showMappingStep: boolean;
  content: any;
}

// Step 0: Details
export const StepDetails: React.FC<StepContentProps> = memo(({
  register,
  errors,
}) => (
  <Flex direction="column" gap="md">
    <Field label="Name" required error={errors?.name?.message}>
      <InputText
        {...register('name')}
        placeholder="Enter a Variant Name"
      />
    </Field>

    <Field
      label="Description"
      required
      error={errors?.description?.message}>
      <Textarea
        {...register('description')}
        placeholder="Enter a description"
      />
    </Field>

    <Controller
      name="type"
      render={({ field }) => (
        <Field
          label="Document Type"
          required
          error={errors.type?.message}>
          <Select
            {...field}
            options={TYPES}
            placeholder="Select Document Type"
            required
          />
        </Field>
      )}
    />

    <Field
      label="Prefix"
      required
      error={errors.prefix?.message}
      hint="Enter a unique prefix for identification (e.g., SDM)">
      <InputText {...register('prefix')} placeholder="Enter a prefix" />
    </Field>
  </Flex>
));

// Step 1: Configure
export const StepConfigure: React.FC<StepContentProps> = memo(({
  register,
  control,
  errors,
  onSearchLayouts,
  onSearchFlows,
  onSearchThemes,
  coloeCode,
  onChangeFields,
  content,
}) => (
  <Flex direction="column" gap="md">
    <FieldColor
      register={register}
      label="Color"
      name="color"
      defaultValue={coloeCode}
      onChangeColor={onChangeFields}
    />

    <Controller
      name="layout"
      render={({ field: { onChange, name, value } }) => (
        <Field label="Layout" required error={errors?.layout?.message}>
          <Search
            itemToString={(item: any) => item && item.name}
            name={name}
            placeholder="Search and Select a layout templete"
            minChars={0}
            value={value}
            onChange={(item: any) => {
              if (!item) {
                onChange('');
                return;
              }
              onChange(item);
            }}
            renderItem={(item: any) => (
              <Flex justify="space-between">
                <Text>{item.name}</Text>
                {item.frame && (
                  <Text bg="green.400" fontSize="xs" px="sm">
                    Frame
                  </Text>
                )}
              </Flex>
            )}
            search={onSearchLayouts}
          />
        </Field>
      )}
    />

    <Controller
      name="flow"
      render={({ field: { onChange, name, value } }) => (
        <Field label="Flow" required error={errors?.flow?.message}>
          <Search
            itemToString={(item: any) => item && item.name}
            name={name}
            placeholder="Search and Select a flow templete"
            minChars={0}
            value={value}
            onChange={(item: any) => {
              if (!item) {
                onChange('');
                return;
              }
              onChange(item);
            }}
            renderItem={(item: any) => (
              <Box>
                <Text>{item?.name}</Text>
              </Box>
            )}
            search={onSearchFlows}
          />
        </Field>
      )}
    />

    <Controller
      name="theme"
      render={({ field: { onChange, name, value } }) => (
        <Field label="Theme" required error={errors?.theme?.message}>
          <Search
            itemToString={(item: any) => item && item.name}
            name={name}
            placeholder="Search and Select a theme templete"
            minChars={0}
            value={value}
            onChange={(item: any) => {
              if (!item) {
                onChange('');
                return;
              }
              onChange(item);
            }}
            renderItem={(item: any) => (
              <Box>
                <Text>{item.name}</Text>
              </Box>
            )}
            search={onSearchThemes}
          />
        </Field>
      )}
    />
  </Flex>
));

// Step 2: Fields
export const StepFields: React.FC<StepContentProps> = memo(({
  control,
  register,
  errors,
  fieldtypes,
  trigger,
}) => (
  <Box>
    <FieldEditor
      control={control}
      register={register}
      fieldtypes={fieldtypes}
      errors={errors}
      trigger={trigger}
    />
  </Box>
));

// Step 3: Map Properties (conditional)
export const StepMapProperties: React.FC<StepContentProps> = memo(({
  frameFields,
  fieldMappings,
  variantFields,
  setFieldMappings,
  setValue,
  watch,
  errors,
}) => (
  <Box>
    <Text mb="md" color="text-secondary">
      Ensure proper mapping of variant fields to the frame field
    </Text>

    {errors.frame_mapping && (
      <Box
        mb="md"
        p="sm"
        bg="red.100"
        color="red.700"
        borderRadius="md">
        <Text>Please select a content field for each frame field</Text>
      </Box>
    )}

    {frameFields.map((frameField, index) => {
      const contentFieldValue =
        fieldMappings.find((m) => m.frameField === frameField.name)
          ?.variantField || '';

      return (
        <Box key={frameField.name} mb="md">
          <Flex alignItems="center" gap="sm">
            <Box
              flex={1}
              bg="gray.400"
              px="md"
              py="sm"
              borderRadius="sm">
              <Text>{frameField.name}</Text>
            </Box>

            <ArrowLeft size={20} />

            <Box flex={1}>
              <Field
                error={
                  errors?.frame_mapping?.[index]?.variantField?.message
                }>
                <Search
                  itemToString={(item: any) => item && item}
                  name={`frame_mapping.${index}.variantField`}
                  placeholder="Search content field"
                  minChars={0}
                  value={contentFieldValue}
                  onChange={(selectedValue: string) => {
                    const newMappings = [...fieldMappings];
                    const existingIndex = newMappings.findIndex(
                      (m) => m.frameField === frameField.name,
                    );

                    if (existingIndex >= 0) {
                      newMappings[existingIndex] = {
                        frameField: frameField.name,
                        frameFieldName: frameField.name,
                        variantField: selectedValue,
                        variantFieldId: variantFields.find(
                          (f) => f.name === selectedValue,
                        )?.id,
                        variantFieldName: selectedValue,
                      };
                    } else {
                      newMappings.push({
                        frameField: frameField.name,
                        frameFieldName: frameField.name,
                        variantField: selectedValue,
                        variantFieldId: variantFields.find(
                          (f) => f.name === selectedValue,
                        )?.id,
                        variantFieldName: selectedValue,
                      });
                    }

                    setFieldMappings(newMappings);
                    setValue(
                      `frame_mapping.${index}.frameField`,
                      frameField.name,
                    );
                    setValue(
                      `frame_mapping.${index}.variantField`,
                      selectedValue,
                    );
                  }}
                  renderItem={(item: string) => (
                    <Box>
                      <Text>{item}</Text>
                    </Box>
                  )}
                  search={() => {
                    return Promise.resolve(
                      watch('fields')?.map((field) => field.name) || [],
                    );
                  }}
                />
              </Field>
            </Box>
          </Flex>
        </Box>
      );
    })}

    {frameFields.length === 0 && (
      <Text color="text-secondary">
        No frame fields available for mapping
      </Text>
    )}
  </Box>
));

export const VariantStepContent: React.FC<StepContentProps & { currentStep: number }> = (props) => {
  switch (props.currentStep) {
    case 0:
      return <StepDetails {...props} />;
    case 1:
      return <StepConfigure {...props} />;
    case 2:
      return <StepFields {...props} />;
    case 3:
      return <StepMapProperties {...props} />;
    default:
      return null;
  }
};

export default VariantStepContent;
