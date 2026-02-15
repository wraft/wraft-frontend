import React, {
  FC,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Flex, Text, Button, Modal } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';

import FlowStatesPreview from 'components/Flow/FlowStatesPreview';
import TemplatePreview from 'components/Variants/TemplatePreview';
import VariantStepContent from 'components/Variants/VariantStepContent';
import VariantSidebar from 'components/Variants/VariantSidebar';
import { VariantSchema } from 'schemas/variant';
import { postAPI, fetchAPI } from 'utils/models';

const steps = ['Basics', 'Template', 'Workflow', 'Fields', 'Mapping'];

interface FieldTypeOption {
  value: string;
  label: string;
}

interface FieldMapping {
  frameField: string;
  frameFieldName: string;
  variantField: string;
  variantFieldId?: string;
  variantFieldName?: string;
}

const Index: FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [fieldtypes, setFieldtypes] = useState<FieldTypeOption[]>([]);
  const [frameFields, setFrameFields] = useState<any[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [variantFields, setVariantFields] = useState<any[]>([]);
  const [isFrameSelected, setIsFrameSelected] = useState(false);
  const [flowStates, setFlowStates] = useState<any[]>([]);

  const prevFrameIdRef = useRef<string | null>(null);
  const mappingsRef = useRef<FieldMapping[]>([]);

  const form = useForm({
    defaultValues: {
      name: '',
      prefix: '',
      type: 'document' as const,
      color: '#555555',
      description: '',
      layout: null as any,
      theme: null as any,
      flow: null as any,
      fields: [{ name: '', type: '', fromFrame: false }],
      frame_mapping: [],
    },
    resolver: zodResolver(VariantSchema),
    mode: 'onBlur',
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
    getValues,
  } = form;
  const watchLayout = watch('layout');
  const watchTheme = watch('theme');
  const watchFields = watch('fields');

  const coloeCode = useMemo(() => {
    const randomValue = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${randomValue()}${randomValue()}${randomValue()}`;
  }, []);

  useEffect(() => {
    fetchAPI('field_types?page_size=200').then((data: any) => {
      const fieldTypesRemap: FieldTypeOption[] = data?.field_types.map(
        (field: any) => ({
          label: field.name,
          value: field.id,
        }),
      );
      setFieldtypes(fieldTypesRemap);
    });
  }, []);

  useEffect(() => {
    if (typeof watchLayout === 'object' && watchLayout?.frame?.fields) {
      const newFrameId = watchLayout.id;
      const frameChanged =
        prevFrameIdRef.current && prevFrameIdRef.current !== newFrameId;
      prevFrameIdRef.current = newFrameId;

      setFrameFields(watchLayout.frame.fields);
      setIsFrameSelected(true);

      if (frameChanged && watchFields) {
        const updatedFields = watchFields.filter(
          (field: any) => !(field as any).fromFrame,
        );
        setValue(
          'fields',
          updatedFields.length
            ? updatedFields
            : [{ name: '', type: '', fromFrame: false }],
        );
        setFieldMappings([]);
        mappingsRef.current = [];
      }

      const defaultMappings = watchLayout.frame.fields.map(
        (frameField: any) => {
          const matchingVariantField = watchFields?.find(
            (field: any) =>
              field.name.toLowerCase() === frameField.name.toLowerCase(),
          );
          return {
            frameField: frameField.name,
            frameFieldName: frameField.name,
            variantField: matchingVariantField?.name || '',
            variantFieldId: matchingVariantField?.id || '',
            variantFieldName: matchingVariantField?.name || '',
          };
        },
      );

      if (fieldMappings.length === 0 || frameChanged) {
        setFieldMappings(defaultMappings);
        mappingsRef.current = defaultMappings;
        defaultMappings.forEach((mapping, index) => {
          setValue(`frame_mapping.${index}.frameField`, mapping.frameField);
          setValue(`frame_mapping.${index}.variantField`, mapping.variantField);
        });
      }

      const existingFieldNames = new Set(
        watchFields.map((field: any) => field.name.toLowerCase()),
      );
      const frameFieldsToAdd = watchLayout.frame.fields
        .filter(
          (frameField: any) =>
            !existingFieldNames.has(frameField.name.toLowerCase()),
        )
        .map((frameField: any) => ({
          name: frameField.name,
          type: fieldtypes.length > 0 ? fieldtypes[0].value : '',
          fromFrame: true,
        }));

      if (frameFieldsToAdd.length > 0) {
        const updatedFields = frameChanged
          ? frameFieldsToAdd
          : [...watchFields, ...frameFieldsToAdd];
        setValue('fields', updatedFields);
      }
    } else {
      if (watchFields) {
        const updatedFields = watchFields.filter(
          (field: any) => !(field as any).fromFrame,
        );
        setValue(
          'fields',
          updatedFields.length
            ? updatedFields
            : [{ name: '', type: '', fromFrame: false }],
        );
      }
      setFrameFields([]);
      setFieldMappings([]);
      mappingsRef.current = [];
      setIsFrameSelected(false);
    }
  }, [
    watchLayout?.id,
    watchFields?.length,
    fieldtypes.length > 0 ? fieldtypes[0].value : '',
    setValue,
  ]);

  useEffect(() => {
    if (watchFields) {
      const updatedVariantFields = watchFields.map((field: any) => ({
        id: field.id,
        name: field.name,
      }));
      setVariantFields(updatedVariantFields);
    }
  }, [watchFields]);

  const watchFlow = watch('flow');
  useEffect(() => {
    if (watchFlow?.id) {
      setFlowStates([]);
      fetchAPI(`flows/${watchFlow.id}`).then((data: any) => {
        const sorted = (data?.states || []).sort(
          (a: any, b: any) => a.order - b.order,
        );
        setFlowStates(sorted);
      });
    } else {
      setFlowStates([]);
    }
  }, [watchFlow?.id]);

  useEffect(() => {
    const subscription = form.watch((_value, { type }) => {
      if (type === 'change') {
        setIsDirty(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDirty) {
        setShowUnsavedWarning(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, handleSubmit]);

  const onSearchLayouts = async () => {
    try {
      const response: any = await fetchAPI('layouts');
      return response?.layouts || [];
    } catch (error) {
      console.error('Error fetching layouts:', error);
      return [];
    }
  };

  const onSearchFlows = async () => {
    try {
      const response: any = await fetchAPI('flows');
      const flows = response?.flows?.map((item: any) => ({
        ...item.flow,
        creator: item.creator,
      }));
      const enriched = await Promise.all(
        (flows || []).map(async (flow: any) => {
          try {
            const detail: any = await fetchAPI(`flows/${flow.id}`);
            return {
              ...flow,
              states: (detail?.states || []).sort(
                (a: any, b: any) => a.order - b.order,
              ),
            };
          } catch {
            return { ...flow, states: [] };
          }
        }),
      );
      return enriched;
    } catch (error) {
      console.error('Error fetching flow:', error);
      return [];
    }
  };

  const onSearchThemes = async () => {
    try {
      const response: any = await fetchAPI('themes');
      return response?.themes || [];
    } catch (error) {
      console.error('Error fetching themes:', error);
      return [];
    }
  };

  const formatFields = (formFields: any) => {
    if (!formFields || formFields.length === 0) return [];
    return formFields.reduce((formattedFields: any, field: any) => {
      const { name, type, fromFrame } = field;
      const isFieldValid =
        isNaN(Number(name)) &&
        name !== '0' &&
        name.trim() !== '' &&
        name !== null &&
        name !== undefined;

      if (isFieldValid) {
        formattedFields.push({
          name,
          key: name,
          field_type_id: type,
          fromFrame: fromFrame || false,
        });
      }
      return formattedFields;
    }, []);
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      const formattedFields = formatFields(data.fields);
      const frameMappings = data.frame_mapping || [];

      const payload = {
        name: data.name,
        prefix: data.prefix,
        type: data.type,
        color: data.color,
        description: data.description,
        layout_id: data.layout?.id,
        theme_id: data.theme?.id,
        flow_id: data.flow?.id,
        fields: formattedFields,
        frame_mapping: frameMappings,
      };

      const response: any = await postAPI('content_types', payload);
      toast.success('Variant created successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      setIsDirty(false);
      const newId = response?.content_type?.id || response?.id;
      router.push(newId ? `/variants/${newId}` : '/variants');
    } catch (error) {
      console.error('Error creating variant:', error);
      toast.error('Failed to create variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepChange = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      setShowUnsavedWarning(true);
    } else {
      router.push('/variants');
    }
  }, [isDirty, router]);

  const showMappingStep = isFrameSelected && frameFields.length > 0;
  const displaySteps = showMappingStep ? steps : steps.slice(0, 4);
  const isLastStep = currentStep === displaySteps.length - 1;

  const stepErrors = useMemo(() => {
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) return [];
    return [
      !!(
        errors.name ||
        errors.description ||
        errors.type ||
        errors.prefix ||
        errors.color
      ),
      !!(errors.layout || errors.theme),
      !!errors.flow,
      !!errors.fields,
      !!errors.frame_mapping,
    ];
  }, [errors]);

  const stepContentProps = {
    currentStep,
    register,
    control,
    errors,
    fieldtypes,
    watch,
    trigger,
    setValue,
    getValues,
    frameFields,
    fieldMappings,
    variantFields,
    setFieldMappings: (mappings: FieldMapping[]) => {
      setFieldMappings(mappings);
      mappingsRef.current = mappings;
    },
    showMappingStep,
    content: null,
    coloeCode,
    flowStates,
    onChangeFields: () => {},
    onSearchLayouts,
    onSearchFlows,
    onSearchThemes,
  };

  return (
    <>
      <Head>
        <title>New Variant | Wraft</title>
        <meta name="description" content="Create a new variant" />
      </Head>
      <Flex direction="column" h="100vh">
        {/* Full-width header */}
        <Flex
          align="center"
          justify="space-between"
          px="lg"
          py="sm"
          borderBottom="1px solid"
          borderColor="border"
          bg="background-primary"
          flexShrink={0}
          style={{ minHeight: 48 }}>
          <Flex align="center" gap="sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              style={{ padding: '4px 8px' }}>
              <X size={16} />
            </Button>
            <Text fontSize="sm" fontWeight="600" color="text-primary">
              New Variant
            </Text>
          </Flex>
          <Text fontSize="xs" color="text-secondary">
            {currentStep + 1} of {displaySteps.length}
          </Text>
        </Flex>

        {/* Body: sidebar + content */}
        <Flex flex={1} overflow="hidden">
          {/* Left stepper sidebar */}
          <VariantSidebar
            currentStep={currentStep}
            onStepChange={handleStepChange}
            steps={steps}
            showMappingStep={showMappingStep}
            stepErrors={stepErrors}
          />

          {/* Main scrollable content */}
          <Box flex={1} overflow="auto" bg="background-secondary">
            <Box px="xl" py="lg" style={{ maxWidth: 640, margin: '0 auto' }}>
              <VariantStepContent {...stepContentProps} />
            </Box>

            {/* Bottom navigation inside scroll area */}
            <Box
              px="xl"
              py="md"
              borderTop="1px solid"
              borderColor="border"
              bg="background-primary"
              style={{
                maxWidth: 640,
                margin: '0 auto',
                position: 'sticky',
                bottom: 0,
              }}>
              <Flex justify="space-between" align="center">
                <Box>
                  {currentStep > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStepChange(currentStep - 1)}>
                      <ArrowLeft size={14} />
                      {displaySteps[currentStep - 1]}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      color="text-secondary">
                      Cancel
                    </Button>
                  )}
                </Box>
                <Flex align="center" gap="md">
                  <Text fontSize="xs" color="text-secondary">
                    {currentStep + 1} / {displaySteps.length}
                  </Text>
                  {isLastStep ? (
                    <Button
                      size="sm"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      loading={isSubmitting}>
                      Create Variant
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleStepChange(currentStep + 1)}>
                      Continue
                      <ArrowRight size={14} />
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Box>
          </Box>

          {/* Right sidebar: template preview */}
          {currentStep === 1 && (watchLayout?.id || watchTheme?.id) && (
            <TemplatePreview layout={watchLayout} theme={watchTheme} />
          )}

          {/* Right sidebar: flow states preview */}
          {currentStep === 2 && watchFlow?.id && flowStates.length > 0 && (
            <FlowStatesPreview states={flowStates} flowName={watchFlow.name} />
          )}
        </Flex>
      </Flex>

      <Modal
        ariaLabel="Discard unsaved changes"
        open={showUnsavedWarning}
        onClose={() => setShowUnsavedWarning(false)}>
        <Box w="400px">
          <Modal.Header>Discard unsaved changes?</Modal.Header>
          <Text my="md" color="text-secondary" fontSize="sm">
            You have unsaved changes in this variant. If you leave now, these
            changes will be lost.
          </Text>
          <Flex gap="sm" mt="xl" justify="flex-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowUnsavedWarning(false)}>
              Keep editing
            </Button>
            <Button
              danger
              size="sm"
              onClick={() => {
                setIsDirty(false);
                router.push('/variants');
              }}>
              Discard changes
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
};

export default Index;
