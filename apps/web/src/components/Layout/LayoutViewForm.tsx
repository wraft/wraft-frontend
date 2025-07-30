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
import PdfViewer from 'common/PdfViewer';
import { fetchAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import LayoutScaling from './LayoutScaling';
import LayoutForm from './LayoutForm';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  color: #64748b;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .slider {
    background-color: white; // Green background when active
  }

  &:checked + .slider:before {
    transform: translateX(16px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.2s;
  border-radius: 20px;

  &:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: green; // White circle
    transition: 0.2s;
    border-radius: 50%;
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
    asset_name: string;
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

  // Key fix: Properly initialize and manage margins
  const [margins, setMargins] = useState(DEFAULT_MARGINS);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  useEffect(() => {
    if (layout && !layoutLoaded) {
      console.log('Processing layout data:', layout);

      if (layout.asset) {
        const assetData: LayoutAsset = {
          id: layout.asset.id,
          asset_name: layout.asset.asset_name,
          file: layout.asset.file,
          inserted_at: layout.asset.inserted_at,
          updated_at: layout.asset.updated_at,
          type: layout.asset.type,
        };
        setAssets([assetData]); // Reset and set the single asset
      }

      // Handle margins from API response
      if (layout.margin) {
        console.log('Setting margins from layout.margin:', layout.margin);
        setMargins(layout.margin);
      } else {
        console.log('No margins found, using defaults');
        setMargins(DEFAULT_MARGINS);
      }

      // Set form values
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
      // Reset states when loading new layout
      setLayoutLoaded(false);
      setAssets([]);
      setMargins(DEFAULT_MARGINS);
      loadLayout(cId);
    }
  }, [cId]);

  const loadLayout = (cid: string) => {
    console.log('Loading layout for cid:', cid);
    fetchAPI(`layouts/${cid}`)
      .then((data: any) => {
        console.log('Layout API response:', data.layout);
        const res: Layout = data.layout;
        setLayout(res);
      })
      .catch((error) => {
        console.error('Error loading layout:', error);
        setMargins(DEFAULT_MARGINS);
      });
  };

  const addUploads = (data: LayoutAsset) => {
    setAssets((prevArray) => [...prevArray, data]);
  };

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const handleMarginsChange = (newMargins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) => {
    console.log('LayoutViewForm: margins changed to:', newMargins);
    setMargins(newMargins);
  };

  // Handle form opening - pass current margins to form
  const handleEditClick = () => {
    console.log('Opening form with current margins:', margins);
    setIsOpen(true);
  };

  // Handle form closing - refresh layout data to get latest margins
  const handleFormClose = () => {
    setIsOpen(false);
    // Reload layout to get updated margins
    if (cId) {
      setLayoutLoaded(false);
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
              {/* Consistent PDF Container */}
              <Box
                bg="background-secondary"
                w="100%"
                h="100%"
                p="md"
                borderColor="border"
                border="1px dotted"
                borderRadius="sm"
                overflow="hidden"
                position="relative">
                {showScaling ? (
                  <Flex w="100%" h="100%" justify="center" align="center">
                    <Box>
                      <LayoutScaling
                        pdfUrl={assets[assets.length - 1].file}
                        containerWidth={pdfContainerWidth}
                        containerHeight={pdfContainerHeight}
                        initialMargins={margins}
                        onMarginsChange={handleMarginsChange}
                        pdfDimensions={pdfDimensions}
                        interactive={false}
                        showControls={false}
                        key={`scaling-${cId}-${JSON.stringify(margins)}`}
                      />
                    </Box>
                  </Flex>
                ) : (
                  <Flex w="100%" h="100%" justify="center" align="center">
                    <PdfViewer
                      url={`${assets[assets.length - 1].file}`}
                      pageNumber={1}
                      height={pdfViewerHeight}
                    />
                  </Flex>
                )}
              </Box>

              <Text py="md">{assets[assets.length - 1].asset_name}</Text>

              {/* {showScaling && margins && (
                <Box py="sm" mb="md">
                  <Text mb="1" fontWeight="bold" fontSize="sm">
                    Current Margins (cm):
                  </Text>
                  <Flex gap="10" color="gray.600">
                    <Text fontSize="12px">Top: {margins.top.toFixed(2)}</Text>
                    <Text fontSize="12px">
                      Right: {margins.right.toFixed(2)}
                    </Text>
                    <Text fontSize="12px">
                      Bottom: {margins.bottom.toFixed(2)}
                    </Text>
                    <Text fontSize="12px">Left: {margins.left.toFixed(2)}</Text>
                  </Flex>
                </Box>
              )} */}

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
                  <ToggleLabel>Show Scaling</ToggleLabel>
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
            initialMargins={margins}
            onMarginsChange={setMargins}
            setOpen={handleFormClose}
            cId={cId}
            step={formStep}
            key={`form-${cId}-${isOpen}`} // Force re-render when opening form
          />
        )}
      </Drawer>
    </>
  );
};

export default LayoutViewForm;
