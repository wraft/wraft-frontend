import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Flex,
  Text,
  InputText,
  Field,
  Button,
  Select,
  Spinner,
} from '@wraft/ui';
import { XIcon, ArrowRightIcon, CheckCircleIcon } from '@phosphor-icons/react';

import { vendorService } from 'components/Vendor/vendorService';
import FieldDate from 'common/FieldDate';
import { VendorResponse } from 'schemas/vendor';
import { capitalizeFirst, convertToVariableName } from 'utils/index';
import { fetchAPI } from 'utils/models';
import { Field as FieldT } from 'utils/types';
import contentStore from 'store/content.store';

// ─── Types ──────────────────────────────────────────────────
interface DocumentFieldsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
}

type FormValues = {
  contentFields: any;
  meta?: any;
  vendor_id?: string;
};

const metaFields = [
  {
    label: 'Contract Start Date',
    name: 'start_date',
    type: 'date',
  },
  {
    label: 'Contract Expiry Date',
    name: 'expiry_date',
    type: 'date',
  },
  {
    label: 'Contract Value $',
    name: 'contract_value',
    type: 'number',
  },
];

// ─── Component ──────────────────────────────────────────────
const DocumentFieldsDrawer = ({
  isOpen,
  onClose,
  template,
}: DocumentFieldsDrawerProps) => {
  const [fields, setFields] = useState<FieldT[]>([]);
  const [vendors, setVendors] = useState<VendorResponse[]>([]);
  const [documentType, setDocumentType] = useState<'contract' | 'document'>(
    'document',
  );
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const setNewContent = contentStore((state) => state.addNewContent);
  const existingContent = contentStore((state) => state.newContents);

  const {
    formState: { errors },
    register,
    control,
    handleSubmit,
  } = useForm<FormValues>({ mode: 'onSubmit' });

  const totalSteps = documentType === 'contract' ? 2 : 1;
  const isLastStep = step === totalSteps;

  // ─── Fetch fields for the template's content type ───────
  useEffect(() => {
    if (isOpen && template?.content_type?.id) {
      setLoading(true);
      setStep(1);

      fetchAPI(`content_types/${template.content_type.id}`)
        .then((data: any) => {
          const tFields = data?.content_type?.fields;
          if (tFields) setFields(tFields);
          if (data?.content_type?.type) setDocumentType(data.content_type.type);
        })
        .catch(() => setFields([]))
        .finally(() => setLoading(false));

      vendorService
        .getVendors(1)
        .then((res) => setVendors(res.vendors))
        .catch(() => setVendors([]));
    }
  }, [isOpen, template?.content_type?.id]);

  // ─── Submit handler ─────────────────────────────────────
  const onSubmit = (data: FormValues) => {
    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }

    // Merge field data into the content store
    setNewContent({
      id: existingContent?.id || template.id,
      template,
      contentFields: data.contentFields,
      meta: data.meta,
      vendor_id: data.vendor_id,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        inset={0}
        bg="rgba(0,0,0,0.3)"
        zIndex={9998}
        onClick={onClose}
        sx={{
          animation: 'drawerFadeIn 120ms ease-out',
          '@keyframes drawerFadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      />

      {/* Drawer Panel */}
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        direction="column"
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        w="480px"
        bg="background-primary"
        zIndex={9999}
        sx={{
          boxShadow: '-8px 0 30px rgba(0,0,0,0.1)',
          animation: 'drawerSlideIn 200ms ease-out',
          '@keyframes drawerSlideIn': {
            from: { transform: 'translateX(100%)' },
            to: { transform: 'translateX(0)' },
          },
        }}>
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          px="xl"
          py="md"
          borderBottom="1px solid"
          borderColor="border"
          flexShrink={0}>
          <Flex direction="column" gap="2px">
            <Text fontSize="md" fontWeight="heading" color="text-primary">
              Complete Details
            </Text>
            <Text fontSize="xs" color="text-secondary">
              {template?.title}
            </Text>
          </Flex>
          <Flex
            as="button"
            type="button"
            align="center"
            justify="center"
            onClick={onClose}
            cursor="pointer"
            p="xs"
            borderRadius="sm"
            border="none"
            bg="transparent"
            sx={{ '&:hover': { bg: 'background-secondary' } }}>
            <XIcon size={18} weight="bold" />
          </Flex>
        </Flex>

        {/* Progress indicator */}
        {totalSteps > 1 && (
          <Flex
            px="xl"
            py="sm"
            gap="sm"
            borderBottom="1px solid"
            borderColor="border">
            {Array.from({ length: totalSteps }, (_, i) => (
              <Flex key={i} align="center" gap="xs" flex={1}>
                <Flex
                  w="20px"
                  h="20px"
                  justify="center"
                  align="center"
                  borderRadius="full"
                  bg={
                    step > i
                      ? 'green.600'
                      : step === i + 1
                        ? 'green.400'
                        : 'gray.300'
                  }
                  flexShrink={0}>
                  {step > i ? (
                    <CheckCircleIcon size={12} weight="fill" color="white" />
                  ) : (
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color={step === i + 1 ? 'green.1100' : 'gray.800'}>
                      {i + 1}
                    </Text>
                  )}
                </Flex>
                <Text
                  fontSize="xs"
                  fontWeight="500"
                  color={step >= i + 1 ? 'text-primary' : 'text-secondary'}>
                  {i === 0 ? 'Content Fields' : 'Contract Meta'}
                </Text>
                {i < totalSteps - 1 && (
                  <Box
                    flex={1}
                    h="1px"
                    bg={step > i + 1 ? 'green.600' : 'border'}
                  />
                )}
              </Flex>
            ))}
          </Flex>
        )}

        {/* Scrollable content */}
        <Box flex={1} overflowY="auto" px="xl" py="lg">
          {loading ? (
            <Flex justify="center" align="center" py="xxl">
              <Spinner size={20} />
            </Flex>
          ) : step === 1 ? (
            /* ─── Step 1: Content Fields ────────────────── */
            <Flex direction="column" gap="md">
              {/* Vendor selector */}
              {vendors.length > 0 && (
                <Controller
                  control={control}
                  name="vendor_id"
                  render={({ field }) => (
                    <Field label="Vendor" error={errors?.vendor_id?.message}>
                      <Select
                        {...field}
                        placeholder="Select a vendor (optional)"
                        isClearable
                        options={vendors.map((v) => ({
                          value: v.id,
                          label: v.name,
                        }))}
                      />
                    </Field>
                  )}
                />
              )}

              {/* Dynamic content fields */}
              {fields.length > 0 ? (
                fields.map((f: FieldT) => (
                  <Box key={f.id}>
                    {f.field_type.name === 'date' ? (
                      <FieldDate
                        name={`contentFields[${convertToVariableName(f.name)}]`}
                        label={capitalizeFirst(f.name)}
                        register={register}
                        sub="Date"
                        onChange={() => {}}
                      />
                    ) : (
                      <Field
                        label={capitalizeFirst(f.name)}
                        required
                        error={
                          //@ts-expect-error Dynamic key access
                          errors?.contentFields?.[convertToVariableName(f.name)]
                            ?.message || ''
                        }>
                        <InputText
                          placeholder={`Enter ${f.name}`}
                          {...register(
                            `contentFields.${convertToVariableName(f.name)}`,
                            {
                              required: {
                                value: true,
                                message: `${capitalizeFirst(f.name)} is required`,
                              },
                            },
                          )}
                        />
                      </Field>
                    )}
                  </Box>
                ))
              ) : (
                <Flex
                  direction="column"
                  align="center"
                  py="xl"
                  gap="sm"
                  color="text-secondary">
                  <CheckCircleIcon size={32} weight="duotone" />
                  <Text fontSize="sm">
                    No additional fields required for this template.
                  </Text>
                </Flex>
              )}
            </Flex>
          ) : (
            /* ─── Step 2: Contract Meta ─────────────────── */
            <Flex direction="column" gap="md">
              <Text fontSize="sm" color="text-secondary" mb="xs">
                Add contract-specific metadata
              </Text>
              {metaFields.map((mf, i) => (
                <Field key={i} label={capitalizeFirst(mf.label)}>
                  <InputText
                    type={mf.type}
                    placeholder={`Enter ${mf.label.toLowerCase()}`}
                    {...register(`meta.${convertToVariableName(mf.name)}`)}
                  />
                </Field>
              ))}
            </Flex>
          )}
        </Box>

        {/* Footer actions */}
        <Flex
          px="xl"
          py="md"
          gap="sm"
          borderTop="1px solid"
          borderColor="border"
          flexShrink={0}
          bg="background-primary">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Skip
          </Button>
          <Button type="submit" variant="primary" ml="auto">
            <Flex align="center" gap="xs">
              {isLastStep ? 'Start Editing' : 'Next'}
              <ArrowRightIcon size={14} />
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default DocumentFieldsDrawer;
