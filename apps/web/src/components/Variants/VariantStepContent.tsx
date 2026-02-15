import React, { memo, useState, useEffect } from 'react';
import { Box, Flex, Text, InputText, Textarea, Search, Field } from '@wraft/ui';
import { Controller } from 'react-hook-form';
import {
  ArrowRight,
  FileText,
  FileDoc,
  FrameCorners,
  Layout,
  PaintBrush,
  Check,
} from '@phosphor-icons/react';

import FieldColor from 'common/FieldColor';

import FieldEditor from './FieldEditor';

const STATE_TYPE_COLORS: Record<string, string> = {
  reviewer: 'var(--theme-ui-colors-blue-600)',
  editor: 'var(--theme-ui-colors-green-600)',
  sign: 'var(--theme-ui-colors-purple-600)',
};

const TYPES = [
  {
    value: 'document',
    label: 'Document',
    description: 'Letters, reports, and other structured documents',
    icon: FileText,
  },
  {
    value: 'contract',
    label: 'Contract',
    description: 'Agreements that need review and signatures',
    icon: FileDoc,
  },
  {
    value: 'frame',
    label: 'Frame',
    description: 'Reusable layout templates with placeholders',
    icon: FrameCorners,
    disabled: true,
  },
];

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
  coloeCode?: string;
  flowStates?: any[];
  onChangeFields?: () => void;
  onSearchLayouts?: () => Promise<any[]>;
  onSearchFlows?: () => Promise<any[]>;
  onSearchThemes?: () => Promise<any[]>;
}

// --- Shared primitives ---

const SectionLabel = ({
  children,
  description,
}: {
  children: React.ReactNode;
  description?: string;
}) => (
  <Box mb="md">
    <Text fontSize="md" fontWeight="600" color="text-primary">
      {children}
    </Text>
    {description && (
      <Text fontSize="sm2" color="text-secondary" mt="xxs">
        {description}
      </Text>
    )}
  </Box>
);

const ResourceCard = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <Box
    border="1px solid"
    borderColor="border"
    borderRadius="md"
    bg="background-primary"
    p="md">
    <Flex align="center" gap="sm">
      {/*<Icon size={16} color="var(--theme-ui-colors-text-secondary)" />*/}
      <Text fontSize="sm2" fontWeight="600" color="text-primary">
        {label}
      </Text>
    </Flex>
    {children}
  </Box>
);

// --- Preview components ---

const LayoutPreview = ({ layout }: { layout: any }) => {
  if (!layout?.id) return null;
  const hasFrame = layout.frame?.fields?.length > 0;
  return (
    <Box mt="sm" p="md" bg="background-secondary" borderRadius="md">
      <Flex justify="space-between" align="center">
        <Text fontSize="sm" fontWeight="500" color="text-primary">
          {layout.name}
        </Text>
        {layout.slug && (
          <Text fontSize="xxs" color="text-secondary">
            {layout.slug.toUpperCase()} &middot; {layout.width}&times;
            {layout.height}
            {layout.unit}
          </Text>
        )}
      </Flex>
      {layout.description && (
        <Text fontSize="xs" color="text-secondary" mt="xxs">
          {layout.description}
        </Text>
      )}
      {hasFrame && (
        <Box mt="sm">
          <Text fontSize="xxs" color="text-secondary" mb="xs">
            Frame fields
          </Text>
          <Flex gap="xs" flexWrap="wrap">
            {layout.frame.fields.map((f: any) => (
              <Text
                key={f.name}
                fontSize="xxs"
                px="xs"
                py="xxs"
                bg="background-primary"
                borderRadius="sm"
                border="1px solid"
                borderColor="border"
                color="text-secondary"
                fontWeight="500">
                {f.name}
              </Text>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

const ThemePreview = ({ theme }: { theme: any }) => {
  if (!theme?.id) return null;
  const colors = [
    theme.primary_color,
    theme.secondary_color,
    theme.body_color,
  ].filter(Boolean);
  const scaleEntries = theme.typescale ? Object.entries(theme.typescale) : [];

  return (
    <Box mt="sm" p="md" bg="background-secondary" borderRadius="md">
      <Text fontSize="sm" fontWeight="500" color="text-primary">
        {theme.name}
      </Text>
      <Flex gap="md" mt="sm" align="center">
        {theme.font && (
          <Text fontSize="xs" color="text-secondary">
            {theme.font}
          </Text>
        )}
        {colors.length > 0 && (
          <Flex gap="xs" align="center">
            {colors.map((color: string, i: number) => (
              <Box
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: '1px solid var(--theme-ui-colors-border)',
                }}
              />
            ))}
          </Flex>
        )}
        {scaleEntries.length > 0 && (
          <Text fontSize="xxs" color="text-secondary">
            {scaleEntries
              .slice(0, 4)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' · ')}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

// --- Step 0: Basics ---

export const StepBasics: React.FC<StepContentProps> = memo(function StepBasics({
  register,
  control,
  errors,
  coloeCode,
  onChangeFields,
}) {
  return (
    <Flex direction="column" gap="lg">
      <SectionLabel description="Give your variant a name and tell your team what it's for.">
        Basics
      </SectionLabel>

      <Flex direction="column" gap="md">
        <Flex gap="md">
          <Box flex={1}>
            <Field label="Name" required error={errors?.name?.message}>
              <InputText
                {...register('name')}
                placeholder="e.g. Marketing Brief"
              />
            </Field>
          </Box>
          <Box style={{ width: 140 }}>
            <Field
              label="Prefix"
              required
              error={errors.prefix?.message}
              hint="2-4 chars">
              <InputText {...register('prefix')} placeholder="e.g. MB" />
            </Field>
          </Box>
        </Flex>
        <Field
          label="Description"
          required
          error={errors?.description?.message}>
          <Textarea
            {...register('description')}
            placeholder="What is this variant used for?"
            rows={2}
            style={{ resize: 'none', overflow: 'hidden', minHeight: '4rem' }}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.currentTarget;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </Field>
      </Flex>

      <Box>
        <Text fontSize="sm2" fontWeight="600" color="text-primary" mb="xs">
          Type
        </Text>
        <Text fontSize="xs" color="text-secondary" mb="sm">
          What kind of output will this variant produce?
        </Text>
        <Controller
          name="type"
          control={control}
          render={({ field }: { field: any }) => (
            <Box>
              <Flex gap="sm">
                {TYPES.map((t) => {
                  const selected = field.value === t.value;
                  const isDisabled = !!(t as any).disabled;
                  const Icon = t.icon;
                  return (
                    <Box
                      key={t.value}
                      flex={1}
                      border={selected ? '2px solid' : '1px solid'}
                      borderColor={
                        selected
                          ? 'gray.1000'
                          : isDisabled
                            ? 'gray.300'
                            : 'border'
                      }
                      borderRadius="md"
                      bg="background-primary"
                      px="md"
                      py="md"
                      cursor={isDisabled ? 'default' : 'pointer'}
                      onClick={() => {
                        if (!isDisabled) field.onChange(t.value);
                      }}
                      style={{
                        transition: 'border-color 120ms ease',
                        opacity: isDisabled ? 0.45 : 1,
                      }}>
                      <Flex align="center" gap="sm" mb="xs">
                        <Icon
                          size={18}
                          weight={selected ? 'fill' : 'regular'}
                          color={
                            selected
                              ? 'var(--theme-ui-colors-gray-1200)'
                              : 'var(--theme-ui-colors-text-secondary)'
                          }
                        />
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color={selected ? 'text-primary' : 'text-secondary'}>
                          {t.label}
                        </Text>
                        {isDisabled && (
                          <Text
                            fontSize="xxs"
                            color="text-secondary"
                            bg="background-secondary"
                            px="xs"
                            py="xxs"
                            borderRadius="sm"
                            fontWeight="500"
                            style={{ marginLeft: 'auto' }}>
                            Soon
                          </Text>
                        )}
                      </Flex>
                      <Text fontSize="xs" color="text-secondary">
                        {t.description}
                      </Text>
                    </Box>
                  );
                })}
              </Flex>
              {errors.type?.message && (
                <Text fontSize="xs" color="red.700" mt="xs">
                  {errors.type.message}
                </Text>
              )}
            </Box>
          )}
        />
      </Box>

      <FieldColor
        register={register}
        label="Color"
        name="color"
        defaultValue={coloeCode || '#000000'}
        onChangeColor={onChangeFields || (() => {})}
      />
    </Flex>
  );
});

// --- Step 1: Template (Layout + Theme) ---

export const StepTemplate: React.FC<StepContentProps> = memo(
  function StepTemplate({
    control,
    errors,
    watch,
    onSearchLayouts = () => Promise.resolve([]),
    onSearchThemes = () => Promise.resolve([]),
  }) {
    const selectedLayout = watch('layout');
    const selectedTheme = watch('theme');

    return (
      <Flex direction="column" gap="lg">
        <SectionLabel description="Pick a layout for structure and a theme for styling. Together they define how your documents look.">
          Template
        </SectionLabel>

        <Flex direction="column" gap="md">
          <ResourceCard icon={Layout} label="Layout">
            <Text fontSize="sm" color="text-secondary" mb="sm">
              Sets the page size, margins, and content placeholders for your
              document.
            </Text>
            <Controller
              name="layout"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Field error={errors?.layout?.message}>
                  <Search
                    itemToString={(item: any) => item && item.name}
                    name={name}
                    placeholder="Search layouts..."
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
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm">{item.name}</Text>
                        {item.frame && (
                          <Text
                            fontSize="xxs"
                            color="text-secondary"
                            bg="background-secondary"
                            px="xs"
                            py="xxs"
                            borderRadius="sm"
                            fontWeight="500">
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
            <LayoutPreview layout={selectedLayout} />
          </ResourceCard>

          <ResourceCard icon={PaintBrush} label="Theme">
            <Text fontSize="sm" color="text-secondary" mb="sm">
              Controls fonts, colors, and typescale applied across your
              document.
            </Text>
            <Controller
              name="theme"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Field error={errors?.theme?.message}>
                  <Search
                    itemToString={(item: any) => item && item.name}
                    name={name}
                    placeholder="Search themes..."
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
                      <Text fontSize="sm">{item.name}</Text>
                    )}
                    search={onSearchThemes}
                  />
                </Field>
              )}
            />
            <ThemePreview theme={selectedTheme} />
          </ResourceCard>
        </Flex>
      </Flex>
    );
  },
);

// --- Step 2: Workflow ---

export const StepWorkflow: React.FC<StepContentProps> = memo(
  function StepWorkflow({
    control,
    errors,
    watch,
    onSearchFlows = () => Promise.resolve([]),
  }) {
    const [flows, setFlows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      onSearchFlows()
        .then((data) => setFlows(data || []))
        .finally(() => setLoading(false));
    }, []);

    return (
      <Flex direction="column" gap="lg">
        <SectionLabel description="Each document follows a workflow — a series of states like Draft, Review, and Approved. Pick one to define that path.">
          Workflow
        </SectionLabel>

        <Controller
          name="flow"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Box>
              {loading ? (
                <Text fontSize="sm" color="text-secondary">
                  Loading workflows...
                </Text>
              ) : flows.length === 0 ? (
                <Box
                  p="lg"
                  border="1px solid"
                  borderColor="border"
                  borderRadius="md"
                  bg="background-primary"
                  style={{ textAlign: 'center' }}>
                  <Text fontSize="sm" color="text-secondary">
                    No workflows available
                  </Text>
                  <Text fontSize="xs" color="text-secondary" mt="xxs">
                    Create one in Settings &rarr; Flows
                  </Text>
                </Box>
              ) : (
                <Flex direction="column" gap="sm">
                  {flows.map((flow) => {
                    const isSelected = value?.id === flow.id;
                    return (
                      <Box
                        key={flow.id}
                        border={isSelected ? '2px solid' : '1px solid'}
                        borderColor={isSelected ? 'gray.1000' : 'border'}
                        borderRadius="md"
                        bg="background-primary"
                        cursor="pointer"
                        onClick={() => onChange(flow)}
                        style={{
                          transition: 'border-color 120ms ease',
                        }}>
                        <Flex
                          justify="space-between"
                          align="center"
                          px="md"
                          py="md">
                          <Box style={{ minWidth: 0, flex: 1 }}>
                            <Text
                              fontSize="sm2"
                              fontWeight="heading"
                              color={
                                isSelected ? 'text-primary' : 'text-secondary'
                              }>
                              {flow.name}
                            </Text>
                            {flow.states?.length > 0 && (
                              <Flex
                                gap="sm"
                                mt="xs"
                                align="center"
                                flexWrap="wrap">
                                {flow.states.map((s: any) => (
                                  <Flex key={s.id} align="center" gap="xxs">
                                    <Box
                                      style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor:
                                          STATE_TYPE_COLORS[s.type] ||
                                          'var(--theme-ui-colors-gray-600)',
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Text fontSize="xxs" color="text-secondary">
                                      {s.state}
                                    </Text>
                                  </Flex>
                                ))}
                              </Flex>
                            )}
                          </Box>
                          {isSelected && (
                            <Box
                              bg="gray.1000"
                              borderRadius="full"
                              style={{
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}>
                              <Check
                                size={12}
                                weight="bold"
                                color="var(--theme-ui-colors-background-primary)"
                              />
                            </Box>
                          )}
                        </Flex>
                      </Box>
                    );
                  })}
                </Flex>
              )}
              {errors?.flow?.message && (
                <Text fontSize="xs" color="red.700" mt="xs">
                  {errors.flow.message}
                </Text>
              )}

              {/* Search fallback (kept for reference)
              <ResourceCard icon={GitBranch} label="Flow">
                <Controller
                  name="flow"
                  control={control}
                  render={({ field: { onChange, name, value } }) => (
                    <Field error={errors?.flow?.message}>
                      <Search
                        itemToString={(item: any) => item && item.name}
                        name={name}
                        placeholder="Search flows..."
                        minChars={0}
                        value={value}
                        onChange={(item: any) => {
                          if (!item) { onChange(''); return; }
                          onChange(item);
                        }}
                        renderItem={(item: any) => (
                          <Text fontSize="sm">{item?.name}</Text>
                        )}
                        search={onSearchFlows}
                      />
                    </Field>
                  )}
                />
              </ResourceCard>
              */}
            </Box>
          )}
        />
      </Flex>
    );
  },
);

// --- Step 3: Fields ---

export const StepFields: React.FC<StepContentProps> = memo(function StepFields({
  control,
  register,
  errors,
  fieldtypes,
  trigger,
}) {
  return (
    <Box>
      <SectionLabel description="Add the fields your team will fill in when creating a document — like title, date, or recipient.">
        Content Fields
      </SectionLabel>
      <FieldEditor
        control={control}
        register={register}
        fieldtypes={fieldtypes}
        errors={errors}
        trigger={trigger}
      />
    </Box>
  );
});

// --- Step 4: Mapping (conditional) ---

export const StepMapping: React.FC<StepContentProps> = memo(
  function StepMapping({
    frameFields,
    fieldMappings,
    variantFields,
    setFieldMappings,
    setValue,
    watch,
    errors,
  }) {
    return (
      <Box>
        <SectionLabel description="Map each content field to a placeholder in your layout. This tells the document where to put each piece of data.">
          Field Mapping
        </SectionLabel>

        {errors.frame_mapping && (
          <Box mb="md" p="sm" bg="red.100" color="red.700" borderRadius="md">
            <Text fontSize="sm">
              Select a content field for each frame field
            </Text>
          </Box>
        )}

        <Flex direction="column" gap="sm">
          {frameFields.map((frameField, index) => {
            const contentFieldValue =
              fieldMappings.find((m) => m.frameField === frameField.name)
                ?.variantField || '';

            return (
              <Flex
                key={frameField.name}
                align="center"
                gap="sm"
                p="sm"
                border="1px solid"
                borderColor="border"
                borderRadius="md"
                bg="background-primary">
                <Box
                  flex={1}
                  bg="background-secondary"
                  px="md"
                  py="sm"
                  borderRadius="sm">
                  <Text fontSize="sm" fontWeight="500">
                    {frameField.name}
                  </Text>
                </Box>

                <ArrowRight
                  size={16}
                  color="var(--theme-ui-colors-text-secondary)"
                />

                <Box flex={1}>
                  <Field
                    error={
                      errors?.frame_mapping?.[index]?.variantField?.message
                    }>
                    <Search
                      itemToString={(item: any) => item && item}
                      name={`frame_mapping.${index}.variantField`}
                      placeholder="Select field"
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
                        <Text fontSize="sm">{item}</Text>
                      )}
                      search={() => {
                        return Promise.resolve(
                          watch('fields')?.map((field: any) => field.name) ||
                            [],
                        );
                      }}
                    />
                  </Field>
                </Box>
              </Flex>
            );
          })}
        </Flex>

        {frameFields.length === 0 && (
          <Text fontSize="sm" color="text-secondary">
            No frame fields available for mapping
          </Text>
        )}
      </Box>
    );
  },
);

// --- Router ---

export const VariantStepContent: React.FC<
  StepContentProps & { currentStep: number }
> = (props) => {
  switch (props.currentStep) {
    case 0:
      return <StepBasics {...props} />;
    case 1:
      return <StepTemplate {...props} />;
    case 2:
      return <StepWorkflow {...props} />;
    case 3:
      return <StepFields {...props} />;
    case 4:
      return <StepMapping {...props} />;
    default:
      return null;
  }
};

export default VariantStepContent;
