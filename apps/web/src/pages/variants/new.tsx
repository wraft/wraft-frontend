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
import { ArrowLeft } from '@phosphor-icons/react';

import VariantStepContent from 'components/Variants/VariantStepContent';
import VariantSidebar from 'components/Variants/VariantSidebar';
import Page from 'common/PageFrameInner';
import { VariantSchema } from 'schemas/variant';
import { postAPI, fetchAPI } from 'utils/models';

const steps = ['Details', 'Configure', 'Fields', 'Preview'];

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
    unregister,
    getValues,
  } = form;
  const watchLayout = watch('layout');
  const watchFields = watch('fields');

  // Generate random color
  const coloeCode = useMemo(() => {
    const randomValue = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${randomValue()}${randomValue()}${randomValue()}`;
  }, []);

  // Load field types
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

  // Handle layout changes and frame fields
  useEffect(() => {
    if (typeof watchLayout === 'object' && watchLayout?.frame?.fields) {
      const newFrameId = watchLayout.id;
      const frameChanged =
        prevFrameIdRef.current && prevFrameIdRef.current !== newFrameId;
      prevFrameIdRef.current = newFrameId;

      setFrameFields(watchLayout.frame.fields);
      setIsFrameSelected(true);

      // If frame changed, remove fields from previous frame
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

      // Create default mappings
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

      // Add frame fields to content fields
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
      // No frame selected
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

  // Update variant fields when watchFields changes
  useEffect(() => {
    if (watchFields) {
      const updatedVariantFields = watchFields.map((field: any) => ({
        id: field.id,
        name: field.name,
      }));
      setVariantFields(updatedVariantFields);
    }
  }, [watchFields]);

  // Track form dirty state
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change') {
        setIsDirty(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle beforeunload
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

  // Keyboard shortcuts
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
      return flows || [];
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

      await postAPI('content_types', payload);
      toast.success('Variant created successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      setIsDirty(false);
      router.push('/variants');
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

  const handleConfirmCancel = useCallback(() => {
    setShowUnsavedWarning(false);
    setIsDirty(false);
    router.push('/variants');
  }, [router]);

  const showMappingStep = isFrameSelected && frameFields.length > 0;
  const displaySteps = showMappingStep ? steps : steps.slice(0, 3);
  const isLastStep = currentStep === displaySteps.length - 1;

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
      <Page>
        <Flex h="calc(100vh - 100px)" direction="row">
          {/* Main Content (75%) */}
          <Box flexGrow={1} overflow="auto">
            <Box px="lg" py="md">
              {/* Header */}
              <Flex justifyContent="space-between" alignItems="center" mb="xl">
                <Text as="h1" fontSize="xl" fontWeight="heading">
                  Create New Variant
                </Text>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <ArrowLeft size={16} />
                  Cancel
                </Button>
              </Flex>

              {/* Step Content */}
              <Box>
                <VariantStepContent {...stepContentProps} />
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar (25%) */}
          <Box w="25%">
            <VariantSidebar
              currentStep={currentStep}
              onStepChange={handleStepChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              steps={steps}
              showMappingStep={showMappingStep}
              formData={getValues()}
            />
          </Box>
        </Flex>
      </Page>

      {/* Unsaved Changes Warning Modal */}
      <Modal
        open={showUnsavedWarning}
        onClose={() => setShowUnsavedWarning(false)}>
        <Modal.Header>
          <Text fontWeight="heading">Unsaved Changes</Text>
        </Modal.Header>
        <Modal.Content>
          <Text>
            You have unsaved changes. Are you sure you want to leave without
            saving?
          </Text>
        </Modal.Content>
        <Modal.Footer>
          <Flex gap="sm">
            <Button
              variant="secondary"
              onClick={() => setShowUnsavedWarning(false)}>
              Stay on Page
            </Button>
            <Button danger onClick={handleConfirmCancel}>
              Leave Without Saving
            </Button>
          </Flex>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Index;
