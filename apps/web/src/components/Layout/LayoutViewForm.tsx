import React, { useEffect, useState } from 'react';
import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { useForm } from 'react-hook-form';
import { DownIcon } from '@wraft/icon';
import {
  Box,
  Field,
  Flex,
  InputText,
  Textarea,
  Button,
  Text,
  Drawer,
  useDrawer,
  Label,
} from '@wraft/ui';
import styled from '@emotion/styled';
import { Input } from 'theme-ui';

import MenuStepsIndicator from 'common/MenuStepsIndicator';
import { fetchAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import LayoutScaling from './LayoutScaling';
import LayoutForm from './LayoutForm';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleLabel = styled(Box)`
  font-size: 14px;
  color: #64748b;
`;

const ToggleSwitch = styled(Label)`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
`;

const ToggleSlider = styled('span')`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0; /* Light gray when inactive */
  transition: 0.2s;
  border-radius: 20px;
  border: 1px solid #cbd5e1; /* Border color */

  &.slider:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 1px;
    background-color: #fff; /* White knob */
    transition: 0.2s;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const ToggleInput = styled(Input)`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .slider {
    background-color: #127d5d; /* Green when active */
    border-color: #127d5d;
  }

  &:checked + .slider:before {
    transform: translateX(16px);
    background-color: #fff; /* Keep white knob */
  }
`;

export interface Layouts {
  layout: Layout;
  creator: Creator;
}

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface Layout {
  width: number;
  update_at: string;
  unit: string;
  slug_file: null;
  slug: string;
  screenshot: null;
  name: string;
  inserted_at: string;
  id: string;
  height: number;
  engine: IEngine;
  description: string;
  asset: {
    id: string;
    name: string;
    type: string;
    file: string;
    inserted_at: string;
    updated_at: string;
  } | null;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } | null;
  file?: string;
  type?: string;
  updated_at?: string;
}

interface LayoutAsset {
  id: string;
  asset_name: string;
  file: string;
  inserted_at: string;
  updated_at: string;
  type: string;
}

export interface IEngine {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  api_route: null;
}

interface Props {
  setRerender?: any;
  cId?: string;
}

type FormValues = {
  name: string;
  slug: string;
  height: number;
  width: number;
  description: string;
  engine: string;
  screenshot: any;
  unit: string;
};

const DEFAULT_MARGINS = {
  top: 2.54,
  right: 2.54,
  bottom: 2.54,
  left: 2.54,
};

const LayoutViewForm = ({ cId = '' }: Props) => {
  const { register, setValue } = useForm<FormValues>();
  const [assets, setAssets] = useState<LayoutAsset[]>([]);
  const [layout, setLayout] = useState<Layout>();
  const [formStep, setFormStep] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { hasPermission } = usePermission();
  const [showScaling, setShowScaling] = useState<boolean>(false);
  const pdfDimensions = { width: 21.0, height: 29.7 };
  const stateDrawer = useDrawer();

  const [previewMargins, setPreviewMargins] = useState(DEFAULT_MARGINS);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (layout && !layoutLoaded) {
      console.log('LayoutViewForm: Processing layout data:', layout);

      if (layout.asset) {
        const assetData: LayoutAsset = {
          id: layout.asset.id,
          asset_name: layout.asset.name,
          file: layout.asset.file,
          inserted_at: layout.asset.inserted_at,
          updated_at: layout.asset.updated_at,
          type: layout.asset.type,
        };
        setAssets([assetData]);
      }

      if (layout.margin) {
        setPreviewMargins(layout.margin);
      } else {
        setPreviewMargins(DEFAULT_MARGINS);
      }

      setValue('name', layout.name);
      setValue('slug', layout.slug);
      setValue('height', layout.height || 40);
      setValue('width', layout?.width || 40);
      setValue('description', layout?.description);
      setValue('engine', layout?.engine?.name);

      setLayoutLoaded(true);
    }
  }, [layout, layoutLoaded, setValue]);

  useEffect(() => {
    if (cId) {
      setLayoutLoaded(false);
      setAssets([]);
      setPreviewMargins(DEFAULT_MARGINS);
      loadLayout(cId);

      return () => {
        if (!isOpen) {
          setLayoutLoaded(false);
          loadLayout(cId);
        }
      };
    }
  }, [cId, isOpen]);

  const loadLayout = (cid: string) => {
    console.log('LayoutViewForm: Loading layout for cid:', cid);
    fetchAPI(`layouts/${cid}`)
      .then((data: any) => {
        console.log('LayoutViewForm: Layout API response:', data.layout);
        const res: Layout = data.layout;
        setLayout(res);
      })
      .catch((error) => {
        console.error('LayoutViewForm: Error loading layout:', error);
        setPreviewMargins(DEFAULT_MARGINS);
      });
  };

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const handleMarginsUpdate = (newMargins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) => {
    setPreviewMargins(newMargins);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditClick = () => {
    setIsOpen(true);
  };

  const handleFormClose = () => {
    setIsOpen(false);

    if (cId) {
      setLayoutLoaded(false);
      setAssets([]);
      loadLayout(cId);
    }
  };

  const titles = ['Basic Details', 'Background'];
  const pdfContainerWidth = 350;
  const pdfContainerHeight = 375;
  const pdfViewerHeight = 350;

  return (
    <>
      <Flex gap="md" my="md" px="md">
        <MenuStepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
        <Box
          bg="background-primary"
          maxWidth="556px"
          w="40%"
          p="xl"
          h="100%"
          my="md">
          <Flex
            display={formStep === 0 ? 'flex' : 'none'}
            gap="md"
            direction="column">
            <Field label="Layout Name" disabled required>
              <InputText {...register('name')} />
            </Field>
            <Field label="Slug" disabled required>
              <InputText {...register('slug')} />
            </Field>
            <Field label="Description" disabled required>
              <Textarea
                {...register('description')}
                placeholder="Enter a Description"
              />
            </Field>

            <DisclosureProvider>
              <Disclosure>
                <Flex alignItems="center">
                  <Text mr="sm">Advanced</Text>
                  <DownIcon />
                </Flex>
              </Disclosure>
              <DisclosureContent>
                <Box>
                  <Field label="Engine" disabled required>
                    <InputText
                      {...register('engine')}
                      placeholder="Select a Engine"
                    />
                  </Field>
                </Box>
              </DisclosureContent>
            </DisclosureProvider>
          </Flex>

          {assets && assets.length > 0 && (
            <Box display={formStep === 1 ? 'block' : 'none'}>
              <Box
                bg="background-secondary"
                w="100%"
                minHeight={`${pdfViewerHeight + 80}px`}
                p="md"
                borderColor="border"
                display="flex"
                alignItems="center"
                border="1px dotted"
                borderRadius="sm"
                overflow="hidden">
                <Flex
                  w="100%"
                  h={`${pdfViewerHeight}px`}
                  justify="center"
                  align="center"
                  position="relative">
                  <Box w="100%" h="100%" position="relative" mt="-20px">
                    <LayoutScaling
                      pdfUrl={assets[assets.length - 1].file}
                      containerWidth={pdfContainerWidth}
                      containerHeight={pdfContainerHeight}
                      initialMargins={previewMargins}
                      onMarginsChange={handleMarginsUpdate}
                      pdfDimensions={pdfDimensions}
                      interactive={false}
                      showControls={showScaling}
                      forceHeight={pdfViewerHeight}
                    />
                  </Box>
                </Flex>
              </Box>

              <Text py="md">{assets[assets.length - 1].asset_name}</Text>

              <Flex gap="md" alignItems="center" justifyContent="space-between">
                <Button variant="tertiary" onClick={handleEditClick}>
                  Edit layout
                </Button>

                <ToggleContainer>
                  <ToggleSwitch>
                    <ToggleInput
                      type="checkbox"
                      checked={showScaling}
                      onChange={() => setShowScaling(!showScaling)}
                    />
                    <ToggleSlider className="slider" />
                  </ToggleSwitch>
                  <ToggleLabel>Show Scale</ToggleLabel>
                </ToggleContainer>
              </Flex>
            </Box>
          )}

          {((assets && assets.length < 1) || formStep === 0) && (
            <>
              {formStep === 1 && (
                <Text as={'p'}>
                  There are no assets present in this layout.
                </Text>
              )}
              <Box mt="md">
                {hasPermission('layout', 'manage') && (
                  <Button variant="tertiary" onClick={handleEditClick}>
                    {formStep === 1 ? 'Add' : 'Edit'}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Flex>

      <Drawer
        open={isOpen}
        store={stateDrawer}
        aria-label="field drawer"
        withBackdrop={true}
        onClose={handleFormClose}>
        {isOpen && (
          <LayoutForm
            initialMargins={previewMargins}
            onMarginsChange={handleMarginsUpdate}
            setOpen={handleFormClose}
            cId={cId}
            step={formStep}
            key={`form-${cId}-${isOpen}-${refreshTrigger}`}
          />
        )}
      </Drawer>
    </>
  );
};

export default LayoutViewForm;
