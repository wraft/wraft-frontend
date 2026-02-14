import React, { memo } from 'react';
import { Box, Flex, Text, Button } from '@wraft/ui';
import {
  FileText,
  Upload,
  Info,
  Check,
  ArrowLeft,
} from '@phosphor-icons/react';

import StepsIndicator from 'common/Form/StepsIndicator';

interface SidebarProps {
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
  steps: string[];
  showMappingStep: boolean;
  formData: any;
}

// Step 1: Details Tips
const SidebarTips = memo(function SidebarTips() {
  return (
    <Box>
      <Text as="h4" fontWeight="heading" color="text-primary" mb="md">
        Tips for Creating Variants
      </Text>
      <Flex direction="column" gap="sm">
        <Flex alignItems="flex-start" gap="sm">
          <Info size={16} />
          <Text fontSize="sm" color="text-secondary">
            Use a descriptive name that clearly identifies the content type
            (e.g., Marketing Document).
          </Text>
        </Flex>
        <Flex alignItems="flex-start" gap="sm">
          <Info size={16} />
          <Text fontSize="sm" color="text-secondary">
            Choose a unique 2-4 character prefix (e.g., MD, CT) for document
            numbering.
          </Text>
        </Flex>
        <Flex alignItems="flex-start" gap="sm">
          <Info size={16} />
          <Text fontSize="sm" color="text-secondary">
            Contract types support additional features like approval workflows
            and signatures.
          </Text>
        </Flex>
      </Flex>

      <Box mt="xl" p="md" bg="background-primary" borderRadius="md">
        <Text as="h5" fontWeight="heading" mb="sm">
          Naming Conventions
        </Text>
        <Flex direction="column" gap="xs" fontSize="sm" color="text-secondary">
          <Text>Keep names concise but descriptive</Text>
          <Text>Use title case (e.g., Legal Contract)</Text>
          <Text>Avoid generic names like Type A</Text>
        </Flex>
      </Box>
    </Box>
  );
});

// Step 2: Configure Preview
const SidebarPreview = memo(function SidebarPreview({
  formData,
}: {
  formData: any;
}) {
  return (
    <Box>
      <Text as="h4" fontWeight="heading" color="text-primary" mb="md">
        Selected Configuration
      </Text>

      <Flex direction="column" gap="md">
        {formData?.color && (
          <Flex alignItems="center" gap="sm">
            <Box
              width="24px"
              height="24px"
              bg={formData.color}
              borderRadius="sm"
              border="1px solid"
              borderColor="border"
            />
            <Text fontSize="sm">Color: {formData.color}</Text>
          </Flex>
        )}

        {formData?.layout?.name && (
          <Box>
            <Text fontSize="sm" color="text-tertiary">
              Layout
            </Text>
            <Text fontSize="sm" fontWeight="heading">
              {formData.layout.name}
            </Text>
            {formData.layout.frame && (
              <Text
                fontSize="xs"
                bg="green.400"
                px="xs"
                display="inline-block"
                mt="xs">
                Has Frame Fields
              </Text>
            )}
          </Box>
        )}

        {formData?.flow?.name && (
          <Box>
            <Text fontSize="sm" color="text-tertiary">
              Flow
            </Text>
            <Text fontSize="sm" fontWeight="heading">
              {formData.flow.name}
            </Text>
          </Box>
        )}

        {formData?.theme?.name && (
          <Box>
            <Text fontSize="sm" color="text-tertiary">
              Theme
            </Text>
            <Text fontSize="sm" fontWeight="heading">
              {formData.theme.name}
            </Text>
          </Box>
        )}
      </Flex>

      <Box mt="xl">
        <Text as="h5" fontWeight="heading" mb="sm">
          Tips
        </Text>
        <Text fontSize="sm" color="text-secondary">
          Layouts with frame fields enable automatic field mapping in the final
          step.
        </Text>
      </Box>
    </Box>
  );
});

// Step 3: Fields Info
const SidebarFields = memo(function SidebarFields() {
  return (
    <Box>
      <Text as="h4" fontWeight="heading" color="text-primary" mb="md">
        Field Types
      </Text>

      <Flex direction="column" gap="md">
        <Box>
          <Text fontWeight="heading" fontSize="sm">
            Text Fields
          </Text>
          <Text fontSize="sm" color="text-secondary">
            For short text inputs like names, titles, or identifiers.
          </Text>
        </Box>

        <Box>
          <Text fontWeight="heading" fontSize="sm">
            Long Text
          </Text>
          <Text fontSize="sm" color="text-secondary">
            For descriptions, notes, or multi-line content.
          </Text>
        </Box>

        <Box>
          <Text fontWeight="heading" fontSize="sm">
            Number
          </Text>
          <Text fontSize="sm" color="text-secondary">
            For numeric values, quantities, or calculations.
          </Text>
        </Box>

        <Box>
          <Text fontWeight="heading" fontSize="sm">
            Date
          </Text>
          <Text fontSize="sm" color="text-secondary">
            For deadlines, start dates, or event dates.
          </Text>
        </Box>
      </Flex>

      <Box mt="xl" p="md" bg="background-primary" borderRadius="md">
        <Text as="h5" fontWeight="heading" mb="sm">
          Best Practices
        </Text>
        <Flex direction="column" gap="xs" fontSize="sm" color="text-secondary">
          <Text>Use clear, descriptive field names</Text>
          <Text>Group related fields together</Text>
          <Text>Add required fields for essential data</Text>
          <Text>Consider field order for user flow</Text>
        </Flex>
      </Box>
    </Box>
  );
});

// Step 4: Map Properties / Summary
const SidebarSummary = memo(function SidebarSummary({
  formData,
}: {
  formData: any;
}) {
  return (
    <Box>
      <Text as="h4" fontWeight="heading" color="text-primary" mb="md">
        Summary
      </Text>

      <Flex direction="column" gap="md">
        <Box>
          <Text fontSize="sm" color="text-tertiary">
            Name
          </Text>
          <Text fontSize="sm" fontWeight="heading">
            {formData?.name || '-'}
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="text-tertiary">
            Type
          </Text>
          <Text fontSize="sm" fontWeight="heading">
            {formData?.type || '-'}
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="text-tertiary">
            Prefix
          </Text>
          <Text fontSize="sm" fontWeight="heading">
            {formData?.prefix || '-'}
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="text-tertiary">
            Fields
          </Text>
          <Text fontSize="sm" fontWeight="heading">
            {formData?.fields?.length || 0} fields configured
          </Text>
        </Box>
      </Flex>

      <Box mt="xl" p="md" bg="green.100" borderRadius="md">
        <Flex alignItems="center" gap="sm" mb="sm">
          <Check size={16} color="green" />
          <Text fontWeight="heading" fontSize="sm" color="green.700">
            Ready to Create
          </Text>
        </Flex>
        <Text fontSize="sm" color="green.600">
          Review all settings and click Create to save your variant.
        </Text>
      </Box>
    </Box>
  );
});

const VariantSidebar: React.FC<SidebarProps> = memo(function VariantSidebar({
  currentStep,
  onStepChange,
  onCancel,
  onSubmit,
  isSubmitting,
  isDirty,
  steps,
  showMappingStep,
  formData,
}) {
  const getSidebarContent = () => {
    switch (currentStep) {
      case 0:
        return <SidebarTips />;
      case 1:
        return <SidebarPreview formData={formData} />;
      case 2:
        return <SidebarFields />;
      case 3:
        return <SidebarSummary formData={formData} />;
      default:
        return null;
    }
  };

  const displaySteps = showMappingStep ? steps : steps.slice(0, 3);
  const isLastStep = currentStep === displaySteps.length - 1;

  return (
    <Flex direction="column" h="100%" bg="background-secondary" px="lg" py="md">
      {/* Progress Indicator */}
      <Box mb="xl">
        <StepsIndicator
          titles={displaySteps}
          formStep={currentStep}
          goTo={onStepChange}
        />
      </Box>

      {/* Sidebar Content */}
      <Box flex={1} overflowY="auto">
        {getSidebarContent()}
      </Box>

      {/* Action Buttons */}
      <Flex direction="column" gap="sm" mt="auto" pt="md">
        {/* Import Placeholders (Future Features) */}
        <Flex gap="sm" mb="md">
          <Button
            variant="secondary"
            size="xs"
            disabled
            width="100%"
            title="Import from file - Coming soon">
            <Upload size={14} />
            Import File
          </Button>
          <Button
            variant="secondary"
            size="xs"
            disabled
            width="100%"
            title="Import from document - Coming soon">
            <FileText size={14} />
            Import Doc
          </Button>
        </Flex>

        {/* Navigation Buttons */}
        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
            width="100%">
            Create Variant
          </Button>
        ) : (
          <Button onClick={() => onStepChange(currentStep + 1)} width="100%">
            Next Step
          </Button>
        )}

        {currentStep > 0 && (
          <Button
            variant="secondary"
            onClick={() => onStepChange(currentStep - 1)}
            width="100%">
            <ArrowLeft size={14} />
            Previous
          </Button>
        )}

        {/* Cancel Button with Warning */}
        {isDirty && (
          <Button
            variant="ghost"
            onClick={onCancel}
            width="100%"
            color="text-secondary">
            Cancel
          </Button>
        )}
      </Flex>
    </Flex>
  );
});

export default VariantSidebar;
