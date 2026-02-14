import { FC, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Flex, Text } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import StepsIndicator from 'common/Form/StepsIndicator';
import Page from 'common/PageFrameInner';
import { VariantSchema } from 'schemas/variant';
import { postAPI } from 'utils/models';

const steps = ['Details', 'Configure', 'Fields', 'Preview'];

const Index: FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Variant>({
    defaultValues: {
      name: '',
      prefix: '',
      type: 'document' as const,
      color: '#555555',
      description: '',
      layout_id: '',
      theme_id: '',
      flow_id: '',
    },
    resolver: zodResolver(VariantSchema),
    mode: 'onBlur',
  });

  const handleStepChange = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await postAPI('content_types', data);
      toast.success('Variant created successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      router.push('/variants');
    } catch (error) {
      console.error('Error creating variant:', error);
      toast.error('Failed to create variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = useCallback(() => {
    router.push('/variants');
  }, [router]);

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
              <StepsIndicator
                titles={steps}
                currentStep={currentStep + 1}
                onStepClick={handleStepChange}
              />

              {/* Step Content - Placeholder for now */}
              <Box mt="xl">
                {currentStep === 0 && (
                  <Text color="text-tertiary" fontSize="lg">
                    Step 1: Details
                  </Text>
                )}
                {currentStep === 1 && (
                  <Text color="text-tertiary" fontSize="lg">
                    Step 2: Configure
                  </Text>
                )}
                {currentStep === 2 && (
                  <Text color="text-tertiary" fontSize="lg">
                    Step 3: Fields
                  </Text>
                )}
                {currentStep === 3 && (
                  <Text color="text-tertiary" fontSize="lg">
                    Step 4: Preview
                  </Text>
                )}
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar (25%) */}
          <Box w="25%" px="lg" bg="background-secondary">
            <Flex flexDirection="column" gap="lg">
              <StepsIndicator
                titles={steps}
                currentStep={currentStep + 1}
                onStepClick={handleStepChange}
              />

              <Box>
                <Text as="h4" fontWeight="heading" color="text-primary">
                  Step {currentStep + 1}: {steps[currentStep]}
                </Text>
                <Text color="text-secondary" mt="sm">
                  {currentStep === 0 &&
                    'Configure basic variant information like name, prefix, type, and color.'}
                  {currentStep === 1 &&
                    'Select layout, theme, and flow for this variant.'}
                  {currentStep === 2 && 'Define and manage variant fields.'}
                  {currentStep === 3 &&
                    'Review all configured settings before creating.'}
                </Text>
              </Box>

              {currentStep > 0 && (
                <Flex justifyContent="flex-end">
                  <Text
                    variant="secondary"
                    fontSize="sm"
                    onClick={handleCancel}>
                    Cancel
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default Index;
