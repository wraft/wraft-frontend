'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Text, Flex } from '@wraft/ui';
import { Tab, useTab } from '@wraft/ui';

import { useTemplateInstallation } from 'hooks/useTemplateInstallation';
import { fetchAPI, postAPI } from 'utils/models';
import { Asset } from 'utils/types';

import TemplateUploader from './TemplateUploader';
import TemplatePreview from './TemplatePreview';
import { ImportedItems } from './ImportedItems';
import { Container } from './Styled';
import { Alert } from './Alert';
import Stepper from './Stepper';
import PublicTemplatesTab from './PublicTemplatesTab';
import TemplateInstallModal from './TemplateInstallModal';

type Step = {
  id: number;
  title: string;
  description: string;
};

interface Template {
  id: string;
  name: string;
  description: string;
  file_name: string;
  file_size: string;
  thumbnail_url: string;
  zip_file_url: string;
}

interface TemplatesResponse {
  templates: Template[];
}

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
  const router = useRouter();
  const tab = useTab({ defaultSelectedId: 'custom' });
  const selectedTabId = tab.useState().selectedId;

  const [currentStep, setCurrentStep] = useState(1);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [formData, setformData] = useState();

  const [actionState, setActionState] =
    useState<ActionStateConfig>(defaultActionState);

  const [imported, setImported] = useState<ImportedItems>();

  const [errors, setErrors] = useState<any>([]);

  // Public templates state
  const [publicTemplates, setPublicTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  // Template installation hook
  const {
    isInstalling,
    installProgress,
    isModalOpen,
    templateToInstall,
    handleTemplateSelect,
    handleInstall,
    handleModalClose,
  } = useTemplateInstallation({
    onInstallSuccess: (template) => {
      setSelectedTemplate(template);

      // Convert template to asset format for compatibility
      const asset: Asset = {
        id: template.id,
        name: template.name,
        updated_at: new Date().toISOString(),
        inserted_at: new Date().toISOString(),
        file: template.zip_file_url,
        type: 'template',
      };
      setAssets([asset]);

      // Auto-advance to next step
      handleNext();
    },
  });

  // Check for template ID in URL
  useEffect(() => {
    const { templateId } = router.query;
    if (templateId && typeof templateId === 'string') {
      // Switch to public templates tab and fetch the specific template
      tab.setSelectedId('public');
      fetchPublicTemplates();
    }
  }, [router.query, tab]);

  // Reset state when switching tabs
  useEffect(() => {
    if (selectedTabId === 'custom') {
      // Reset public template selection when switching to custom
      setSelectedTemplate(null);
    } else if (selectedTabId === 'public') {
      // Reset custom upload state when switching to public
      setAssets([]);
      setCurrentStep(1);
      setErrors([]);
    }
  }, [selectedTabId]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Fetch public templates
  const fetchPublicTemplates = async () => {
    try {
      setTemplatesLoading(true);
      setTemplatesError(null);
      const data = (await fetchAPI(
        'template_assets/public/templates',
      )) as TemplatesResponse;
      setPublicTemplates(data.templates || []);

      // If templateId is in URL, select that template
      const { templateId } = router.query;
      if (templateId && typeof templateId === 'string') {
        const template = data.templates?.find((t) => t.id === templateId);
        if (template) {
          setSelectedTemplate(template);
        }
      }
    } catch (error) {
      console.error('Failed to fetch public templates:', error);
      setTemplatesError('Failed to load templates. Please try again.');
      setPublicTemplates([]);
    } finally {
      setTemplatesLoading(false);
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
          {/* Tab Navigation */}
          <Box mb="lg">
            <Tab.List store={tab} size="md">
              <Tab id="public" store={tab}>
                <Flex alignItems="center" gap="xs">
                  <Text>Public Templates</Text>
                  {publicTemplates.length > 0 && (
                    <Box
                      bg="primary.100"
                      color="primary.800"
                      px="xs"
                      py="2px"
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                      minWidth="20px"
                      textAlign="center"
                    >
                      {publicTemplates.length}
                    </Box>
                  )}
                </Flex>
              </Tab>
              <Tab id="custom" store={tab}>
                <Flex alignItems="center" gap="xs">
                  <Text>Custom Upload</Text>
                  {assets.length > 0 && (
                    <Box
                      bg="gray.100"
                      color="gray.800"
                      px="xs"
                      py="2px"
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                      minWidth="20px"
                      textAlign="center"
                    >
                      {assets.length}
                    </Box>
                  )}
                </Flex>
              </Tab>
            </Tab.List>
          </Box>

          {/* Tab Panels */}
          <Tab.Panel tabId="public" store={tab}>
            <PublicTemplatesTab
              templates={publicTemplates}
              loading={templatesLoading}
              error={templatesError}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onFetchTemplates={fetchPublicTemplates}
            />
          </Tab.Panel>

          <Tab.Panel tabId="custom" store={tab}>
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
          </Tab.Panel>
        </Box>
      </Box>

      {/* Template Installation Modal */}
      <TemplateInstallModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        template={templateToInstall}
        isInstalling={isInstalling}
        installProgress={installProgress}
        onInstall={handleInstall}
      />
    </Container>
  );
}

export default ImporterApp;
