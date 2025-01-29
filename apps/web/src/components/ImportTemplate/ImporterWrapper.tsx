'use client';
import { useState } from 'react';
import { Check, Checks } from '@phosphor-icons/react';
import * as Tab from '@ariakit/react/tab';
// import { Box, Flex, Text, Box as BoxBase } from 'theme-ui';;
import toast from 'react-hot-toast';
import styled, { th, x } from '@xstyled/emotion';
import { Button, Box, Text } from '@wraft/ui';

// import { Text } from 'common/Text';
import { fetchAPI, postAPI } from 'utils/models';
import { Asset } from 'utils/types';

import TemplateUploader from './TemplateUploader';
import TemplatePreview from './TemplatePreview';
import { ImportedItems } from './ImportedItems';
import { Circle, Container } from './Styled';
import { Alert } from './Alert';
import { ImportedList } from './Block';
import Stepper from './Stepper';

type Step = {
  id: number;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    id: 1,
    title: 'Upload',
    description: 'Upload custom structures',
  },
  {
    id: 2,
    title: 'Verify',
    description: 'Validate imported items',
  },
  {
    id: 3,
    title: 'Complete',
    description: 'Start the import process',
  },
];

/**
 * action states
 */

export enum ActionState {
  OPENING = 'OPENING',
  VALIDATING = 'VALIDATING',
  IMPORTING = 'IMPORTING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface ActionStateConfig {
  state: ActionState;
  progress?: number;
  message?: string;
  metadata?: Record<string, any>;
}

export const defaultActionState: ActionStateConfig = {
  state: ActionState.OPENING,
  progress: 0,
  message: '',
  metadata: {},
};

interface validateResp {
  missing_items: any;
}

function ImporterApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState<any>();
  const tab = Tab.useTabStore();
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [nextIsActive, setNextIsActive] = useState(false);

  const [actionState, setActionState] =
    useState<ActionStateConfig>(defaultActionState);

  const [imported, setImported] = useState<ImportedItems>();
  const [brokenImports, setBrokenImports] = useState<validateResp>();

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
          setActionState({
            state: ActionState.IMPORTING,
            progress: prev + 10,
            message: 'Upoading structs',
            metadata: {},
          });
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
    // setActionState(RUNNING);
    setActionState({
      state: ActionState.IMPORTING,
    });
    postAPI(`template_assets/${id}/import`, {})
      .then((res: ImportedItems) => {
        console.log('res', res);
        toast.success('Importing ...' + id);
        setImported(res);
        setNextIsActive(true);
        handleNext();
        setActionState({
          state: ActionState.COMPLETED,
        });
        _onDone && _onDone(res);
      })
      .catch((error: any) => {
        setErrors(error);
        toast.success('something wrong');
        setActionState({
          state: ActionState.ERROR,
        });
      });
  };

  /*
   * Validate Import input
   * @param id string
   * import templates from uploaded template aset
   */

  const validateNow = (id: string, _onDone?: any) => {
    setActionState({
      state: ActionState.VALIDATING,
    });

    fetchAPI(`template_assets/${id}/pre_import`)
      .then((res: validateResp) => {
        console.log('res', res);
        if (!res?.missing_items?.length) {
          toast.success('Validated, importing now...');

          // // if validation is no errors
          // importNow(id);

          setActionState({
            state: ActionState.COMPLETED,
          });
          setBrokenImports(res);
        }
        _onDone && _onDone(res);
      })
      .catch((error: any) => {
        setErrors(error);
        toast.success('something wrong');
        setActionState({
          state: ActionState.ERROR,
        });
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

  const onChangeStep = (step: any) => {
    console.log('onChangeStep', step);
    setCurrentStep(step.id);
  };

  return (
    <Container>
      <Box>
        <Box py="md" px="xl">
          <Box>
            <Box display="flex">
              {steps.map((step) => (
                <Stepper
                  key={step.id}
                  step={step}
                  currentStep={currentStep}
                  onSelect={onChangeStep}
                />
              ))}
            </Box>
          </Box>

          <Box>
            {currentStep === 1 && (
              <Box>
                <TemplateUploader onUpload={addUploads} assets={assets} />
              </Box>
            )}

            {currentStep === 2 && (
              <Box>
                <TemplatePreview
                  assets={assets}
                  onValidate={validateNow}
                  actionState={actionState.state}
                  onImport={importNow}
                />
                {renderErrors(errors)}
              </Box>
            )}

            {currentStep === 3 && (
              <Box>
                <Alert>
                  <Box>
                    <Text>Succesfully Imported!</Text>
                    <Text color="green.1200">{imported?.message}</Text>
                    {/* <Box display="flex" px={0} py={2} gap={2}>
                      <Button variant="secondary">Create Document</Button>
                      <Button variant="secondary">View Imported</Button>
                    </Box> */}
                  </Box>
                </Alert>
              </Box>
            )}
          </Box>
        </Box>

        {/* <Flex sx={{ gap: 2, py: 3 }}>
          {currentStep > 1 && (
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1}>
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={currentStep === 1 && !selectedSource && nextIsActive}>
            {currentStep === steps.length ? 'Finish' : 'Continue'}
          </Button>
        </Flex> */}
      </Box>
    </Container>
  );
}

export default ImporterApp;
