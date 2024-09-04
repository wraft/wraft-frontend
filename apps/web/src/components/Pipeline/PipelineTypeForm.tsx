import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Box, Flex, Text, Input } from 'theme-ui';
import { Label, Select } from 'theme-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import { ArrowRightIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Button, Drawer } from '@wraft/ui';
import { X } from '@phosphor-icons/react';

import { uuidRegex } from 'utils/regex';

import Field from '../Field';
import { fetchAPI, postAPI, putAPI } from '../../utils/models';

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
  selectedPipelineStageId?: any;
  pipeStageName?: any;
  pipelineStageTemplateId?: any;
}

const pipelineschema = z.object({
  pipelinename: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(20, { message: 'Maximum 20 characters allowed' }),
  pipeline_form: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Select a Option',
  }),
  // pipeline_source: z.string().refine((value) => uuidRegex.test(value), {
  //   message: 'Select a Option',
  // }),
});

const stageSchema = z.object({
  template_id: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Please select a template',
  }),
});

// const mapSchema = z.object({
//   fields: z.array(
//     z.object({
//       source: z.string().refine((value) => uuidRegex.test(value)),
//     }),
//   ),
// });

const Form = ({
  step = 0,
  setIsOpen,
  pipelineData,
  setRerender,
  selectedPipelineStageId,
  pipeStageName,
  pipelineStageTemplateId,
}: Props) => {
  const [formStep, setFormStep] = useState(step);
  const [source, setSource] = useState<any>([
    { label: 'Wraft Form', value: 'wraft_from' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Array<IField>>([]);
  const [forms, setForms] = useState<any>([]);
  const [formField, setFormField] = useState<Array<any>>([]);
  const [tempField, setTempField] = useState<Array<any>>([]);
  const [ctemplate, setCTemplate] = useState<any>();
  const [formId, setFormId] = useState<any>();
  const [pipeStageDetails, setPipeStageDetails] = useState<any>();
  const [pipeMapId, setPipeMapId] = useState<any>();
  const [sourceData, setSourceData] = useState<any>([]);
  const [stageMap, setStageMap] = useState<any>([]);
  const [zodSchema, setZodSchema] = useState<any>(pipelineschema);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: 'onSubmit', resolver: zodResolver(zodSchema) });
  const router = useRouter();

  const cId: string = router.query.id as string;

  const template_id: any = watch('template_id');

  const isUpdate = cId ? true : false;

  const loadTemplate = () => {
    fetchAPI(`data_templates`)
      .then((data: any) => {
        setLoading(true);
        const res: any[] = data.data_templates;
        if (pipelineData) {
          const templateId = pipelineData.stages.map(
            (stage: any) => stage.data_template.id,
          );

          const filteredTemplates = res.filter((template) => {
            return !templateId.includes(template.id);
          });
          setTemplates(filteredTemplates);
        } else {
          setTemplates(res);
        }
        setLoading(false);
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
        setLoading(false);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  //Pipeline Create API

  const createpipeline = (data: any) => {
    setLoading(true);
    const sampleD = {
      name: data?.pipelinename.trim(),
      api_route: 'client.crm.com',
      source_id: data.pipeline_form,
      source: 'wraft_from',
    };

    postAPI(`pipelines`, sampleD)
      .then(() => {
        setIsOpen && setIsOpen(false);
        toast.success('Saved Successfully', {
          duration: 2000,
          position: 'top-right',
        });
        setRerender((pre: boolean) => !pre);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          (err?.errors && JSON.stringify(err?.errors)) ||
            JSON.stringify(err) ||
            'somthing wrong',
          {
            duration: 2000,
            position: 'top-right',
          },
        );
      });
  };

  // Pipeline Stage create Api
  // calls when the next button is clicked

  function next() {
    setLoading(true);
    if (formStep == 0) {
      const sampleD = {
        data_template_id: ctemplate?.data_template?.id,
        content_type_id: ctemplate?.content_type?.id,
      };

      if (selectedPipelineStageId) {
        putAPI(`stages/${selectedPipelineStageId}`, sampleD)
          .then((res) => {
            setPipeStageDetails(res);
            toast.success('Stage Updated Successfully', {
              position: 'top-right',
            });
            setRerender((pre: boolean) => !pre);
            setFormStep((i) => i + 1);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            toast.error('Failed to Update Stage', {
              position: 'top-right',
            });
          });
      } else {
        postAPI(`pipelines/${cId}/stages`, sampleD)
          .then((res: any) => {
            setPipeStageDetails(res);
            toast.success('Stage Created Successfully', {
              position: 'top-right',
            });
            setRerender((pre: boolean) => !pre);
            setFormStep((i) => i + 1);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            toast.error('stage already exist', {
              position: 'top-right',
            });
          });
      }
    }
  }

  // Pipeline mapping api

  const onSubmit = () => {
    setLoading(true);
    const sampleD = {
      pipe_stage_id: pipeStageDetails.id,
      mapping: sourceData,
    };
    if (selectedPipelineStageId && pipeMapId) {
      putAPI(`forms/${formId}/mapping/${pipeMapId}`, sampleD)
        .then(() => {
          setIsOpen && setIsOpen(false);
          setRerender((prev: boolean) => !prev);
          toast.success('Mapping Updated Successfully', {
            position: 'top-right',
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Mapping Failed', {
            position: 'top-right',
          });
          setLoading(false);
        });
    } else if (tempField.length == sampleD.mapping.length) {
      postAPI(`forms/${formId}/mapping`, sampleD)
        .then(() => {
          setIsOpen && setIsOpen(false);
          setRerender((prev: boolean) => !prev);
          toast.success('Mapped Successfully', {
            position: 'top-right',
          });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(
            (err?.errors && JSON.stringify(err?.errors)) || JSON.stringify(err),
            {
              duration: 3000,
              position: 'top-right',
            },
          );
        });
    } else {
      toast.error('Map every field', {
        position: 'top-right',
      });
      setLoading(false);
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

  const tempChange = (id: any) => {
    const safeSearchTypeValue: any = id;

    loadTempType(safeSearchTypeValue);
  };

  useEffect(() => {
    if (
      selectedPipelineStageId &&
      pipeStageDetails &&
      pipeStageDetails.form_mapping?.mapping
    ) {
      setPipeMapId(pipeStageDetails ? pipeStageDetails.form_mapping.id : '');
      setStageMap(pipeStageDetails.form_mapping.mapping);
      setSourceData(pipeStageDetails.form_mapping.mapping);
    }
  }, [pipeStageDetails, selectedPipelineStageId]);

  useEffect(() => {
    loadTemplate();
    loadForm();
    ctypeChange();
    if (pipelineData && pipelineData.stages && pipelineStageTemplateId) {
      loadTempType(pipelineStageTemplateId);
    }
  }, [selectedPipelineStageId]);

  useEffect(() => {
    if (pipeStageDetails || pipelineData) {
      setZodSchema(stageSchema);
    }
  }, [pipeStageDetails]);

  useEffect(() => {
    tempChange(template_id);
  }, [template_id]);

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
    const selectedSource = formField.find((m) => m.id === selectedOption);

    if (selectedSource) {
      setSourceData((prevData: any) => {
        const newData = [...prevData];
        newData[index] = {
          destination: {
            id: tempField[index].id,
            name: tempField[index].name,
          },
          source: {
            id: selectedSource.id,
            name: selectedSource.name,
          },
        };
        return newData;
      });
    } else {
      setSourceData((prevData: any) => {
        const newData = [...prevData];
        newData[index] = {
          destination: {
            id: tempField[index].id,
            name: tempField[index].name,
          },
          source: {
            id: selectedOption,
            name: selectedOption,
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
      <Drawer.Header>
        <Drawer.Title>
          {selectedPipelineStageId
            ? 'Edit Stage'
            : pipelineData
              ? 'Create Stage'
              : 'Create Pipeline'}
        </Drawer.Title>
        <X
          size={20}
          weight="bold"
          cursor="pointer"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      </Drawer.Header>
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
                  error={errors.pipelinename}
                />
                <Box mt={3}>
                  <Label htmlFor="pipeline_source">Source</Label>
                  <Select
                    id="pipeline_source"
                    {...register('pipeline_source', { required: true })}>
                    {!isUpdate && (
                      <option disabled selected>
                        Select an option
                      </option>
                    )}
                    {source &&
                      source.length > 0 &&
                      source.map((m: any) => (
                        <option value={m.value} key={m.value}>
                          {m.label}
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
                        Select an option
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
                    disabled={selectedPipelineStageId ? true : false}>
                    {
                      <option disabled selected>
                        {!selectedPipelineStageId
                          ? 'Select an option'
                          : pipeStageName}
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
                  {errors.template_id && errors.template_id.message && (
                    <Text variant="error">
                      {errors.template_id.message as string}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
            {pipelineData && (
              <Box sx={{ display: formStep === 1 ? 'block' : 'none' }}>
                <Box>
                  <Label>Field Name</Label>
                  {tempField &&
                    tempField.length > 0 &&
                    tempField.map((field, index) => (
                      <Box key={field.id}>
                        <Flex sx={{ alignItems: 'center', pb: '2' }}>
                          <Box sx={{ mr: 2 }}>
                            <Field
                              name={`fields.${index}.name`}
                              register={register}
                              defaultValue={(field && field.name) || ''}
                              disable
                            />
                          </Box>
                          <ArrowRightIcon />
                          <Box sx={{ flexGrow: 1, ml: 2 }}>
                            <Select
                              {...register(`fields.${index}.source` as const, {
                                required: true,
                              })}
                              onChange={(e) =>
                                handleSelectChange(index, e.target.value)
                              }
                              // onChange={() => handleSubmit(onSubmit)()}
                            >
                              <option disabled selected value={''}>
                                {stageMap[index]
                                  ? stageMap[index].source.name
                                  : 'Select an option'}
                              </option>
                              <option value="nil">nil</option>
                              {formField &&
                                formField.length > 0 &&
                                formField.map((m: any) => (
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
              <Flex sx={{ gap: 1 }}>
                {formStep >= 1 && (
                  <Button variant="secondary" type="button" onClick={prev}>
                    Prev
                  </Button>
                )}
                {formStep >= 1 && (
                  <Button
                    variant="primary"
                    type="button"
                    loading={loading}
                    disabled={loading}
                    onClick={onSubmit}>
                    {stageMap && stageMap.length > 0 && isValid
                      ? 'Update'
                      : 'Add'}
                  </Button>
                )}
              </Flex>
            )}
            {formStep == 0 && (
              <Button
                // disabled={
                //   (pipelineData && isValid) || selectedPipelineStageId
                //     ? false
                //     : !isValid
                // }
                disabled={isValid && loading}
                type="button"
                onClick={pipelineData ? next : handleSubmit(createpipeline)}
                variant="primary"
                loading={loading}>
                {pipelineData ? 'Next' : 'Create'}
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
export default Form;
