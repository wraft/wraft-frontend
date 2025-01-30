import React, { useEffect, useState } from 'react';
import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { useForm } from 'react-hook-form';
import { DownIcon } from '@wraft/icon';
import { Box, Field, Flex, InputText, Textarea, Button, Text } from '@wraft/ui';

import MenuStepsIndicator from 'common/MenuStepsIndicator';
import PdfViewer from 'common/PdfViewer';
import { Drawer } from 'common/Drawer';
import { fetchAPI } from 'utils/models';
import { Asset } from 'utils/types';

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
  assets: any[];
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

const LayoutViewForm = ({ cId = '' }: Props) => {
  const { register, setValue } = useForm<FormValues>();
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [layout, setLayout] = useState<Layout>();
  const [formStep, setFormStep] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (layout) {
      const assetsList: Asset[] = layout.assets;

      assetsList.forEach((a: Asset) => {
        addUploads(a);
      });

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
    });
  };

  /**
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => [...prevArray, data]);
  };

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const titles = ['Basic Details', 'Background'];

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
              <Disclosure
              // as={Box}
              // sx={{
              //   border: 'none',
              //   bg: 'none',
              //   cursor: 'pointer',
              //   width: 'fit-content',
              //   color: 'green.700',
              //   '&[aria-expanded="true"]': {
              //     '& svg': {
              //       transform: 'rotate(-180deg)',
              //       transition: 'transform 0.3s ease',
              //     },
              //   },
              //   '&[aria-expanded="false"]': {
              //     '& svg': {
              //       transform: 'rotate(0deg)',
              //       transition: 'transform 0.3s ease',
              //     },
              //   },
              // }}
              >
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
            <Box display={formStep === 1 ? 'block' : 'none'} borderRadius="sm">
              <Flex
                bg="background-secondary"
                w="100%"
                justify="center"
                p="md"
                borderColor="border"
                border="1px dotted"
                overflow="hidden">
                <PdfViewer
                  url={`${assets[assets.length - 1].file}`}
                  pageNumber={1}
                  height={350}
                />
              </Flex>

              <Text py="md">{assets[assets.length - 1].name}</Text>

              <Button variant="tertiary" onClick={() => setIsOpen(true)}>
                Edit
              </Button>
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
                <Button variant="tertiary" onClick={() => setIsOpen(true)}>
                  {formStep === 1 ? 'Add' : 'Edit'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Flex>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        {isOpen && <LayoutForm setOpen={setIsOpen} cId={cId} step={formStep} />}
      </Drawer>
    </>
  );
};
export default LayoutViewForm;
