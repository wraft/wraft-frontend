import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text, Input } from 'theme-ui';
import { Label, Select } from 'theme-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import { ArrowRightIcon } from '@wraft/icon';
import toast from 'react-hot-toast';

import { uuidRegex } from 'utils/regex';

import Field from '../Field';
import { fetchAPI, postAPI, putAPI, deleteAPI } from '../../utils/models';

export interface IFieldItem {
  name: string;
  type: string;
}

export interface FieldTypeItem {
  key: string;
  name?: string;
  field_type_id: string;
}

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

interface Props {
  step?: number;
  setIsOpen?: (e: any) => void;
  pipelineData?: any;
  setRerender: any;
  id?: any;
}

const schema = z.object({
  pipelinename: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(20, { message: 'Maximum 20 characters allowed' }),
  pipeline_form: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Invalid Form',
  }),
  pipeline_source: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(20, { message: 'Maximum 20 characters allowed' }),
});

const Form = ({
  step = 0,
  setIsOpen,
  pipelineData,
  setRerender,
  id,
}: Props) => {
  const [formStep, setFormStep] = useState(step);
  const [source, setSource] = useState<any>(['Wraft Form']);
  const [loading, setLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Array<IField>>([]);
  const [forms, setForms] = useState<any>([]);
  const [formField, setFormField] = useState<Array<any>>([]);
  const [tempField, setTempField] = useState<Array<any>>([]);
  const [ctemplate, setCTemplate] = useState<any>();
  const [formId, setFormId] = useState<any>();
  const [pipeStageDetails, setPipeStageDetails] = useState<any>();
  const [pipeMapId, setPipeMapId] = useState<any>();

  const [destinationData, setDestinationData] = useState<any>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({ mode: 'all', resolver: zodResolver(schema) });
  const router = useRouter();

  const cId: string = router.query.id as string;

  const isUpdate = cId ? true : false;

  const loadTemplate = () => {
    fetchAPI(`data_templates`)
      .then((data: any) => {
        setLoading(true);
        const res: any[] = data.data_templates;

        if (pipelineData) {
          const contentTypeIds = pipelineData.stages.map(
            (stage: any) => stage.content_type.id,
          );

          const filteredTemplates = res.filter((template) => {
            return !contentTypeIds.includes(template.content_type.id);
          });
          setTemplates(filteredTemplates);
        } else {
          setTemplates(res);
        }
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const loadForm = () => {
    fetchAPI(`forms`)
      .then((data: any) => {
        setLoading(true);
        const res: any = data.forms;
        setForms(res);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  //Pipeline Create API

  const createpipeline = (data: any) => {
    const sampleD = {
      name: data.pipelinename,
      api_route: 'client.crm.com',
      source_id: data.pipeline_form,
      source: data.pipeline_source,
    };

    postAPI(`pipelines`, sampleD).then(() => {
      setIsOpen && setIsOpen(false);
      toast.success('Saved Successfully', {
        duration: 1000,
        position: 'top-right',
      });
      setRerender((pre: boolean) => !pre);
    });
  };

  // Pipeline Stage create Api
  // calls when the next button is clicked

  function next() {
    if (formStep == 0) {
      const sampleD = {
        data_template_id: ctemplate.data_template.id,
        content_type_id: ctemplate.content_type.id,
      };

      if (id) {
        putAPI(`stages/${id}`, sampleD)
          .then((res) => {
            setPipeStageDetails(res);
            toast.success('Stage Updated Successfully', {
              duration: 1000,
              position: 'top-right',
            });
            setFormStep((i) => i + 1);
          })
          .catch(() => {
            toast.error('Failed to Update Stage', {
              duration: 1000,
              position: 'top-right',
            });
          });
      } else {
        postAPI(`pipelines/${cId}/stages`, sampleD)
          .then((res: any) => {
            setPipeStageDetails(res);
            toast.success('Stage Created Successfully', {
              duration: 1000,
              position: 'top-right',
            });
            setFormStep((i) => i + 1);
          })
          .catch(() => {
            toast.error('stage already exist', {
              duration: 1000,
              position: 'top-right',
            });
          });
      }
    }
  }

  // Pipeline mapping api

  const onSubmit = () => {
    const sampleD = {
      pipe_stage_id: pipeStageDetails.id,
      mapping: destinationData,
    };
    if (id) {
      putAPI(`forms/${formId}/mapping/${pipeMapId}`, sampleD)
        .then(() => {
          setIsOpen && setIsOpen(false);
          setRerender((prev: boolean) => !prev);
          toast.success('Mapping Updated Successfully', {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch(() => {
          toast.error('Mapping Failed', {
            duration: 1000,
            position: 'top-right',
          });
        });
    } else {
      postAPI(`forms/${formId}/mapping`, sampleD).then(() => {
        setIsOpen && setIsOpen(false);
        setRerender((prev: boolean) => !prev);
        toast.success('Mapped Successfully', {
          duration: 1000,
          position: 'top-right',
        });
      });
    }
  };

  const loadContentTypeSuccess = (data: any) => {
    const res = data.fields;
    setFormField(res);
  };

  const loadContentType = (id: string) => {
    fetchAPI(`forms/${id}`).then((data: any) => {
      loadContentTypeSuccess(data);
    });
  };

  const ctypeChange = () => {
    if (pipelineData) {
      setFormId(pipelineData.source_id);
      loadContentType(pipelineData.source_id);
    }
  };

  const loadTempTypeSuccess = (data: any) => {
    setCTemplate(data);
    const res = data.content_type.fields;
    setTempField(res);
  };

  const loadTempType = (id: string) => {
    fetchAPI(`data_templates/${id}`).then((data: any) => {
      loadTempTypeSuccess(data);
    });
  };

  const tempChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const safeSearchTypeValue: string = event.currentTarget.value;
    loadTempType(safeSearchTypeValue);
  };

  useEffect(() => {
    if (id) {
      setPipeMapId(pipeStageDetails ? pipeStageDetails.form_mapping[0].id : '');
    }
  }, [pipeStageDetails, id]);

  useEffect(() => {
    loadTemplate();
    loadForm();
    ctypeChange();
  }, []);

  function prev() {
    setFormStep((i) => i - 1);
  }

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const titles = pipelineData ? ['Configure', 'Mapping'] : ['Details'];
  // const titles = ['Details', 'Configure', 'Mapping'];

  // function to organise the values which needed to for pipeline mappping

  const handleSelectChange = (index: any, selectedOption: any) => {
    const selectedDestination = tempField.find((m) => m.id === selectedOption);
    if (selectedDestination) {
      setDestinationData((prevData: any) => {
        const newData = [...prevData];
        newData[index] = {
          source: {
            id: formField[index].id,
            name: formField[index].name,
          },
          destination: {
            id: selectedDestination.id,
            name: selectedDestination.name,
          },
        };
        return newData;
      });
    }
  };

  return (
    <Flex
      sx={{
        height: '100vh',
        overflow: 'scroll',
        flexDirection: 'column',
      }}>
      <Text
        variant="pB"
        sx={{
          p: 4,
        }}>
        Create Pipeline
      </Text>
      <StepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
      <Box sx={{ height: '100%' }} p={4} as="form">
        <Flex
          sx={{
            flexDirection: 'column',
            height: 'calc(100% - 80px)',
            overflowY: 'auto',
          }}>
          <Box sx={{ flexGrow: 1 }}>
            {!pipelineData && (
              <Box sx={{ display: formStep === 0 ? 'block' : 'none' }}>
                <Field
                  register={register}
                  label="Name"
                  name="pipelinename"
                  defaultValue={pipelineData ? pipelineData.name : ''}
                  placeholder="Pipeline Name"
                  error={errors.name}
                />
                <Box mt={3}>
                  <Label htmlFor="pipeline_source">Source</Label>
                  <Select
                    id="pipeline_source"
                    {...register('pipeline_source', { required: true })}>
                    {!isUpdate && (
                      <option disabled selected>
                        select an option
                      </option>
                    )}
                    {source &&
                      source.length > 0 &&
                      source.map((m: any) => (
                        <option value={m} key={m}>
                          {m}
                        </option>
                      ))}
                  </Select>
                  {errors.pipeline_source && errors.pipeline_source.message && (
                    <Text variant="error">
                      {errors.pipeline_source.message as string}
                    </Text>
                  )}
                </Box>
                <Box mt={3}>
                  <Label htmlFor="pipeline_form">Choose Form</Label>
                  <Select
                    id="pipeline_form"
                    {...register('pipeline_form', { required: true })}>
                    {!isUpdate && (
                      <option disabled selected>
                        select an option
                      </option>
                    )}
                    {forms &&
                      forms.length > 0 &&
                      forms.map((m: any) => (
                        <option value={m.id} key={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </Select>
                  {errors.pipeline_form && errors.pipeline_form.message && (
                    <Text variant="error">
                      {errors.pipeline_form.message as string}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
            {pipelineData && (
              <Box sx={{ display: formStep === 0 ? 'block' : 'none' }}>
                <Box sx={{ display: 'none' }}>
                  <Input
                    id="edit"
                    defaultValue={0}
                    hidden={true}
                    {...register('edit', { required: true })}
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Label htmlFor="template_id">Choose a template</Label>
                  <Select
                    id="template_id"
                    {...register('template_id', { required: true })}
                    onChange={(e) => tempChange(e)}>
                    {
                      <option disabled selected>
                        select an option
                      </option>
                    }
                    {templates &&
                      templates.length > 0 &&
                      templates.map((m: any) => (
                        <option value={m.id} key={m.id}>
                          {m.title}
                        </option>
                      ))}
                  </Select>
                </Box>
              </Box>
            )}
            {pipelineData && (
              <Box sx={{ display: formStep === 1 ? 'block' : 'none' }}>
                <Box>
                  <Label>Field Name</Label>
                  {formField.map((field, index) => (
                    <Box key={field.id}>
                      <Flex sx={{ alignItems: 'center', pb: '2' }}>
                        <Box sx={{ mr: 2 }}>
                          <Field
                            name={`fields.${index}.name`}
                            register={register}
                            defaultValue={(field && field.name) || ''}
                          />
                        </Box>
                        <ArrowRightIcon />
                        <Box sx={{ flexGrow: 1, ml: 2 }}>
                          <Select
                            {...register(
                              `fields.${index}.destination` as const,
                              {
                                required: true,
                              },
                            )}
                            onChange={(e) =>
                              handleSelectChange(index, e.target.value)
                            }
                            // onChange={() => handleSubmit(onSubmit)()}
                          >
                            <option disabled selected value={''}>
                              select an option
                            </option>
                            {tempField &&
                              tempField.length > 0 &&
                              tempField.map((m: any) => (
                                <option value={m.id} key={m.id}>
                                  {m.name}
                                </option>
                              ))}
                          </Select>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Flex>

        <Flex mt={'auto'} pt={4} sx={{ justifyContent: 'space-between' }}>
          <Flex>
            {pipelineData && (
              <Flex>
                <Button
                  sx={{
                    display: formStep >= 1 ? 'block' : 'none',
                  }}
                  variant="buttonSecondary"
                  type="button"
                  onClick={prev}>
                  Prev
                </Button>
                <Button
                  ml={2}
                  sx={{
                    display: formStep >= 1 ? 'block' : 'none',
                  }}
                  variant="buttonPrimary"
                  type="button"
                  onClick={onSubmit}>
                  Add
                </Button>
              </Flex>
            )}
            <Button
              disabled={pipelineData ? false : !isValid}
              ml={2}
              sx={{
                display: formStep == 0 ? 'block' : 'none',
              }}
              type="button"
              onClick={pipelineData ? next : handleSubmit(createpipeline)}
              variant="buttonPrimary">
              {pipelineData ? 'Next' : 'Create'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
export default Form;
