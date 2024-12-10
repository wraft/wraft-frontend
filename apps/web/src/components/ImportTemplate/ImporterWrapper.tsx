'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, File as Github } from '@phosphor-icons/react';
import * as Tab from '@ariakit/react/tab';
import { Alert, Box, Flex, Text, Box as BoxBase } from 'theme-ui';
import styled from '@emotion/styled';
import { Button } from '@wraft/ui';
import toast from 'react-hot-toast';

import { fetchAPI, postAPI } from 'utils/models';
import { Asset } from 'utils/types';

import TemplateUploader from './TemplateUploader';
import TemplatePreview from './TemplatePreview';
// import { Box as BoxBase } from './Box';

type Step = {
  id: number;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    id: 1,
    title: 'Select Source',
    description: 'Choose your template source',
  },
  {
    id: 2,
    title: 'Configure',
    description: 'Set template options',
  },
  {
    id: 3,
    title: 'Import',
    description: 'Start the import process',
  },
];

const Container = styled(Box)`
  background: transparent;
  .rest-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .line {
    height: 1px;
    flex: 1;
    background: #cbe5d1e6;
    margin-left: 12px;
  }
`;

const Circle = styled(Box)`
  width: 24px;
  height: 24px;
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  font-weight: 500;
`;

interface StepSectionProps {
  step?: any;
  currentStep: number;
}
const StepSection = ({ currentStep, step }: StepSectionProps) => {
  return (
    <Flex key={step.id} sx={{ flex: 1 }}>
      <Flex
        as={motion.div}
        initial={{ scale: 0.8 }}
        animate={{ scale: currentStep === step.id ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}>
        {currentStep > step.id ? (
          <Circle
            sx={{
              bg: 'green.900', //currentStep === step.id ? 'green.700' : 'blue.400',
              mt: '-2px',
              color: 'green.100',
              svg: {
                fill: 'green.100',
              },
            }}>
            <Check size={12} weight="bold" />
          </Circle>
        ) : (
          <Circle
            sx={{
              bg: currentStep === step.id ? '#f3922b' : 'gray.400',
              color: currentStep === step.id ? 'green.100' : 'gray.1100',
            }}>
            {step.id}
          </Circle>
        )}
      </Flex>
      <Box sx={{ pl: 3, pt: 0, flex: 1 }}>
        <Box className="rest-line" sx={{ pr: 1 }}>
          <Text variant="pR">{step.title}</Text>
          <Box className="line" />
        </Box>
        <Text as="p" variant="subR">
          {step.description}
        </Text>
      </Box>
      {step.id !== steps.length && <Box />}
    </Flex>
  );
};

function ImporterApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState<any>();
  const tab = Tab.useTabStore();
  const [assets, setAssets] = useState<Array<Asset>>([]);

  const [errors, setErrors] = useState<any>([]);

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source);
    simulateProgress();
  };

  const simulateProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setCurrentStep(2);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /**
   * when upload is done
   */

  const onUploadDone = (end: any) => {
    setUploaded(end);
    handleSourceSelect(end?.id);
  };

  /*
   * Initiate Import process
   * @param id string
   * import templates from uploaded template aset
   */

  const importNow = (id: string, _onDone?: any) => {
    postAPI(`template_assets/${id}/import`, {})
      .then((res) => {
        console.log('res', res);
        toast.success('Importing ...' + id);
        handleNext();
        _onDone && _onDone(res);
      })
      .catch((error: any) => {
        setErrors(error);
        toast.success('something wrong');
      });
  };

  /*
   * Validate Import input
   * @param id string
   * import templates from uploaded template aset
   */

  const validateNow = (id: string, _onDone?: any) => {
    fetchAPI(`template_assets/${id}/pre_import`)
      .then((res) => {
        console.log('res', res);

        if (!res?.missing_items?.length) {
          toast.success('Verified and good to go');
        }
        _onDone && _onDone(res);
      })
      .catch((error: any) => {
        setErrors(error);
        toast.success('something wrong');
      });
  };

  /**
   * Render errors
   */

  const renderErrors = (errs: any) => {
    if (!errs?.errors) return false;
    const rKeys = Object.keys(errs?.errors) || [];

    return rKeys.map((key) => (
      <Alert key={key} variant="error">
        {errs.errors[key]}
      </Alert>
    ));
  };

  /**
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => [...prevArray, data]);
    setSelectedSource(data);
    handleNext();
  };

  return (
    <Container>
      <Box sx={{ py: 3, px: 5 }}>
        <BoxBase variant="outerframe">
          <Box>
            <Flex sx={{ py: 3 }}>
              {steps.map((step) => (
                <StepSection
                  key={step.id}
                  step={step}
                  currentStep={currentStep}
                />
              ))}
            </Flex>
          </Box>

          <BoxBase variant="innerframe">
            {currentStep === 1 && (
              <Box>
                <TemplateUploader onUpload={addUploads} assets={assets} />
              </Box>
            )}

            {currentStep === 2 && (
              <Box>
                <TemplatePreview
                  assets={assets}
                  onImport={importNow}
                  onValidate={validateNow}
                />
                {renderErrors(errors)}
              </Box>
            )}

            {currentStep === 3 && (
              <Box>
                <Text as="h4" variant="sectiontitle" sx={{ pb: 2, mb: 2 }}>
                  Import Success
                </Text>
                <Box sx={{ py: 2 }}>
                  <Flex sx={{ mb: 1 }}>
                    <Check size={20} color="#22C55E" />
                    <Text sx={{ ml: 2 }}>
                      Template source uploaded successfully
                    </Text>
                  </Flex>
                  <Flex sx={{ mb: 1 }}>
                    <Check size={20} color="#22C55E" />
                    <Text sx={{ ml: 2 }}>Template configuration validated</Text>
                  </Flex>
                  <Flex sx={{ mb: 1 }}>
                    <Check size={20} color="#22C55E" />
                    <Text sx={{ ml: 2 }}>
                      Import completed - templates are ready to use
                    </Text>
                  </Flex>
                  <Box sx={{ py: 3 }}>
                    <Link href="/variand/id">View Created Variant</Link>
                  </Box>
                </Box>
              </Box>
            )}
          </BoxBase>
        </BoxBase>

        <Flex sx={{ gap: 2, py: 3 }}>
          {currentStep > 1 && (
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1}>
              Back
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleNext}
            disabled={currentStep === 1 && !selectedSource}>
            {currentStep === steps.length ? 'Finish' : 'Continue'}
          </Button>
        </Flex>
      </Box>
    </Container>
  );
}

export default ImporterApp;
