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
} from '@wraft/ui';
// import styled from '@emotion/styled';

import MenuStepsIndicator from 'common/MenuStepsIndicator';
import PdfViewer from 'common/PdfViewer';
import { fetchAPI } from 'utils/models';
// import { Asset } from 'utils/types';
import { usePermission } from 'utils/permissions';

import LayoutScaling from './LayoutScaling';
import LayoutForm from './LayoutForm';

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
  // Add these properties to match what you're using
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
  const [margins, setMargins] = useState(DEFAULT_MARGINS);
  const pdfDimensions = { width: 21.0, height: 29.7 };
  const stateDrawer = useDrawer();

  useEffect(() => {
    if (layout) {
      // Handle asset if it exists
      if (layout.asset) {
        const assetData: LayoutAsset = {
          id: layout.asset.id,
          asset_name: layout.asset.asset_name,
          file: layout.asset.file,
          inserted_at: layout.asset.inserted_at,
          updated_at: layout.asset.updated_at,
          type: layout.asset.type,
        };
        addUploads(assetData);
      }

      // Set margins from layout if available
      if (layout.margin) {
        setMargins(layout.margin);
      }

      setValue('name', layout.name);
      setValue('slug', layout.slug);
      setValue('height', layout.height || 40);
      setValue('width', layout?.width || 40);
      setValue('description', layout?.description);
      setValue('engine', layout?.engine?.name);
    }
  }, [layout]);

  useEffect(() => {
    if (cId && !isOpen) {
      loadLayout(cId);
    }
  }, [cId, isOpen]);

  const loadLayout = (cid: string) => {
    fetchAPI(`layouts/${cid}`).then((data: any) => {
      const res: Layout = data.layout;
      setLayout(res);
      // Reset assets when loading new layout
      setAssets([]);
    });
  };

  /**
   * Upload Assets
   * @param data
   */
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
    setMargins(newMargins);
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
                h={`${pdfContainerHeight}px`}
                p="md"
                borderColor="border"
                border="1px dotted"
                borderRadius="sm"
                overflow="hidden"
                position="relative">
                {showScaling ? (
                  <Flex w="100%" h="100%" justify="center" align="center">
                    <LayoutScaling
                      pdfUrl={assets[assets.length - 1].file}
                      containerWidth={pdfContainerWidth}
                      containerHeight={pdfViewerHeight}
                      initialMargins={margins}
                      onMarginsChange={handleMarginsChange}
                      pdfDimensions={pdfDimensions}
                      interactive={false}
                      showControls={false}
                    />
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

              {/* Display margins if available */}
              {/* {layout?.margin && (
                <Box py="sm">
                  <Text mb="1" fontWeight="bold">
                    Current Margins (cm):
                  </Text>
                  <Flex gap="2" fontSize="12px">
                    <Text>Top: {layout.margin.top}</Text>
                    <Text>Right: {layout.margin.right}</Text>
                    <Text>Bottom: {layout.margin.bottom}</Text>
                    <Text>Left: {layout.margin.left}</Text>
                  </Flex>
                </Box>
              )} */}

              <Flex gap="md">
                <Button variant="tertiary" onClick={() => setIsOpen(true)}>
                  Edit
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => setShowScaling(!showScaling)}>
                  {showScaling ? 'Hide Scaling' : 'Show Scaling'}
                </Button>
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
                  <Button variant="tertiary" onClick={() => setIsOpen(true)}>
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
        onClose={() => setIsOpen(false)}>
        {isOpen && <LayoutForm setOpen={setIsOpen} cId={cId} step={formStep} />}
      </Drawer>
    </>
  );
};

export default LayoutViewForm;
