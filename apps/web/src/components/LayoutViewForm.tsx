import React, { Fragment, useEffect, useState } from 'react';

import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { TickIcon } from '@wraft/icon';
import { Drawer } from '@wraft-ui/Drawer';
import { Controller, useForm } from 'react-hook-form';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Container,
  Label,
  Select,
  Box,
  Flex,
  Button,
  Text,
  useThemeUI,
} from 'theme-ui';

import { fetchAPI } from '../utils/models';
import { Asset, Engine } from '../utils/types';

import Field from './Field';
import FieldText from './FieldText';
import { ArrowDropdown } from './Icons';
import LayoutForm from './LayoutForm';
import MenuStepsIndicator from './MenuStepsIndicator';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
  engine_uuid: string;
  screenshot: any;
  unit: string;
};

const LayoutViewForm = ({ cId = '' }: Props) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();
  const [engines, setEngines] = useState<Array<Engine>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [layout, setLayout] = useState<Layout>();
  const [formStep, setFormStep] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const themeui = useThemeUI();

  useEffect(() => {
    console.log('🥋🐼', engines);
    if (engines && engines.length > 0) {
      const pandocEngine = engines.find((engine) => engine.name === 'Pandoc');
      pandocEngine && setValue('engine_uuid', pandocEngine?.id);
    }
  }, [engines]);

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
      setValue('engine_uuid', layout?.engine?.id);
    }
  }, [layout]);

  useEffect(() => {
    loadEngine();
  }, []);

  /**
   * If in edit mode
   * @param data
   */

  useEffect(() => {
    if (cId) {
      loadLayout(cId);
    }
  }, [cId]);

  /**
   * Load all Engines
   * @param token
   */
  const loadEngine = () => {
    fetchAPI('engines').then((data: any) => {
      const res: Engine[] = data.engines;
      setEngines(res);
    });
  };

  /**
   * Load Layout Edit Details
   * @param token
   */
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
    <Fragment>
      <Flex>
        <MenuStepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
        <Box
          variant="layout.contentFrame"
          sx={{ maxWidth: '60ch', height: '100%' }}>
          <Flex
            sx={{
              p: 4,
              flexDirection: 'column',
              height: '100%',
            }}>
            <Container sx={{ height: '100%' }}>
              <Box>
                {assets && assets.length > 0 && (
                  <Box
                    sx={{
                      display: formStep === 1 ? 'block' : 'none',
                      borderRadius: '6px',
                      border: '1px dotted',
                      borderColor: 'neutral.200',
                      overflow: 'hidden',
                    }}>
                    <Box
                      sx={{
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bg: 'background',
                        py: '24px',
                      }}>
                      <Document file={assets[assets.length - 1].file}>
                        <Page pageNumber={1} width={251} />
                      </Document>
                    </Box>
                    <Box
                      sx={{
                        py: 3,
                        px: 4,
                        bg: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Flex
                        sx={{
                          alignItems: 'center',
                        }}>
                        <Text variant="pM">
                          {assets[assets.length - 1].name}
                        </Text>
                        <Box
                          sx={{
                            height: '16px',
                            width: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bg: 'green.700',
                            borderRadius: '44px',
                            ml: 2,
                          }}>
                          <TickIcon
                            color={themeui?.theme?.colors?.white as string}
                            height={12}
                            width={12}
                            viewBox="0 0 24 24"
                          />
                        </Box>
                      </Flex>
                      <Button variant="buttonSmall">Edit</Button>
                    </Box>
                  </Box>
                )}
                <Container sx={{ display: formStep === 0 ? 'block' : 'none' }}>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      gap: '28px',
                    }}>
                    <Box>
                      <Field
                        name="name"
                        label="Layout Name"
                        defaultValue="Layout X"
                        register={register}
                        error={errors.name}
                        disable
                      />
                    </Box>
                    <Box>
                      <Label htmlFor="slug">Slug</Label>
                      <Controller
                        control={control}
                        name="slug"
                        defaultValue="contract"
                        rules={{ required: 'Please select a slug' }}
                        render={({ field }) => (
                          <Select mb={0} {...field} disabled>
                            <option>contract</option>
                            <option>pletter</option>
                          </Select>
                        )}
                      />
                      {errors.slug && (
                        <Text variant="error">{errors.slug.message}</Text>
                      )}
                      <Text as="p" variant="subR" mt={2}>
                        Slugs are layout templates used for rendering documents
                      </Text>
                    </Box>
                    <Box>
                      <FieldText
                        name="description"
                        label="Description"
                        defaultValue=""
                        register={register}
                        error={errors.description}
                        disabled
                      />
                    </Box>
                    <DisclosureProvider>
                      <Disclosure
                        as={Box}
                        sx={{
                          border: 'none',
                          bg: 'none',
                          cursor: 'pointer',
                          width: 'fit-content',
                          color: 'green.700',
                          '&[aria-expanded="true"]': {
                            '& svg': {
                              transform: 'rotate(-180deg)',
                              transition: 'transform 0.3s ease',
                            },
                          },
                          '&[aria-expanded="false"]': {
                            '& svg': {
                              transform: 'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                            },
                          },
                        }}>
                        <Flex sx={{ alignItems: 'center' }}>
                          <Text variant="pM" mr={2}>
                            Advanced
                          </Text>
                          <ArrowDropdown />
                        </Flex>
                      </Disclosure>
                      <DisclosureContent>
                        <Box>
                          <Label htmlFor="engine_uuid">Engine ID</Label>
                          <Controller
                            control={control}
                            name="engine_uuid"
                            rules={{ required: 'Please select a Engine ID' }}
                            render={({ field }) => (
                              <Select {...field} disabled>
                                {engines &&
                                  engines.length > 0 &&
                                  engines.map((m: any) => (
                                    <option key={m.id} value={m.id}>
                                      {m.name}
                                    </option>
                                  ))}
                              </Select>
                            )}
                          />
                          {errors.engine_uuid && (
                            <Text variant="error">
                              {errors.engine_uuid.message}
                            </Text>
                          )}
                        </Box>
                      </DisclosureContent>
                    </DisclosureProvider>
                  </Flex>
                </Container>
                {((assets && assets.length < 1) || formStep === 0) && (
                  <>
                    {formStep === 1 && (
                      <Text variant="pR" as={'p'}>
                        There are no assets present in this layout.
                      </Text>
                    )}
                    <Box mt={4}>
                      <Button
                        variant="buttonSecondary"
                        onClick={() => setIsOpen(true)}>
                        {formStep === 1 ? 'Add' : 'Edit'}
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Container>
          </Flex>
        </Box>
      </Flex>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        <LayoutForm setOpen={setIsOpen} cId={cId} />
      </Drawer>
    </Fragment>
  );
};
export default LayoutViewForm;
