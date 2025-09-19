'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Box, Text, InputText, Field, Button, Flex } from '@wraft/ui';

import ProgressBar from 'components/common/ProgressBar';
import { fetchAPI, postAPI } from 'utils/models';
import { Asset } from 'utils/types';

import TemplateUploader from './TemplateUploader';
import TemplatePreview from './TemplatePreview';
import { ImportedItems } from './ImportedItems';
import { Container } from './Styled';
import { Alert } from './Alert';
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

const extractTemplateId = (url: string): string => {
  const match = url.match(
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  );
  return match ? match[0] : '';
};

const simulateProgress = async (
  setUploadProgress: (progress: number) => void,
  setActionState: (state: ActionStateConfig) => void,
) => {
  for (let p = 20; p <= 100; p += 20) {
    await new Promise((r) => setTimeout(r, 200));
    setUploadProgress(p);
    setActionState({ state: ActionState.PROCESSING, progress: p });
  }
};

function ImporterApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [formData, setformData] = useState();
  const searchParams = useSearchParams();
  const [importUrl, setImportUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const [actionState, setActionState] =
    useState<ActionStateConfig>(defaultActionState);

  const [imported, setImported] = useState<ImportedItems>();
  const [errors, setErrors] = useState<any>([]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      if (urlParam.startsWith('import-')) {
        setImportUrl(`http://app.wraft.app/manage/import?url=${urlParam}`);
      } else {
        setImportUrl(urlParam);
      }
    }
  }, [searchParams]);
  const handleUrlUpload = async () => {
    if (!importUrl.trim()) return;

    const templateId = extractTemplateId(importUrl);

    if (!templateId) {
      toast.error('Invalid template URL');
      return;
    }

    try {
      setUploadProgress(10);
      setActionState({ state: ActionState.PROCESSING, progress: 10 });

      const res = (await postAPI(
        `template_assets/public/${templateId}/install`,
        {},
      )) as Asset;

      await simulateProgress(setUploadProgress, setActionState);

      addUploads(res);
      setActionState({ state: ActionState.COMPLETED, progress: 100 });
    } catch (err) {
      setErrors(err);
      setActionState({ state: ActionState.ERROR });
      toast.error('Failed to upload template');
    }
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
    postAPI(`global_asset/import`, formData)
      .then((res: ImportedItems) => {
        toast.success(`Successfully imported template: ${id}`);
        setImported(res);
        handleNext();
        setActionState({
          state: ActionState.COMPLETED,
        });
        _onDone && _onDone(res);
      })
      .catch((error: any) => {
        setErrors(error);
        toast.error('something wrong');
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
        if (!res?.missing_items?.length) {
          toast.success('Validated, importing now...');

          // // if validation is no errors
          // importNow(id);

          setActionState({
            state: ActionState.COMPLETED,
          });
        }
        _onDone && _onDone(res);
      })
      .catch((error: any) => {
        setErrors(error);
        toast.error('something wrong');
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
    handleNext();
  };

  const onChangeStep = (step: any) => {
    setCurrentStep(step.id);
  };

  return (
    <Container>
      <Box>
        <Box py="md" px="xl">
          <Box display="flex" mb="md">
            {steps.map((step) => (
              <Stepper
                key={step.id}
                step={step}
                currentStep={currentStep}
                onSelect={onChangeStep}
              />
            ))}
          </Box>

          <Box>
            {currentStep === 1 && (
              <Box>
                <TemplateUploader
                  onUpload={addUploads}
                  assets={assets}
                  formDate={setformData}
                />
                <Box my="md">
                  <Text color="gray.600">OR install from URL</Text>
                </Box>

                <Flex gap="sm">
                  <Box w="500px">
                    <Field label="Template Install URL">
                      <InputText
                        placeholder="app.wraft.app/import-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                      />
                    </Field>
                  </Box>
                  <Box mt="28px">
                    <Button
                      onClick={handleUrlUpload}
                      disabled={!importUrl.trim()}>
                      Install
                    </Button>
                  </Box>
                </Flex>

                {uploadProgress > 0 && (
                  <Box mt="md">
                    <Text color="gray.700" mb="xs">
                      {uploadProgress < 100
                        ? `Uploading... ${uploadProgress}%`
                        : 'Upload Complete! 100%'}
                    </Text>
                    <Box w="100%" maxW="400px">
                      <ProgressBar progress={uploadProgress} />
                    </Box>
                  </Box>
                )}
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
                  </Box>
                </Alert>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ImporterApp;
