import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Flex,
  Text,
  InputText as Input,
  Label,
  Search,
  Field,
} from '@wraft/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRightIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Button, Drawer } from '@wraft/ui';
import { X } from '@phosphor-icons/react';

import StepsIndicator from 'common/Form/StepsIndicator';
import { uuidRegex } from 'utils/regex';
import { fetchAPI, postAPI, putAPI } from 'utils/models';

export interface Layout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface FieldData {
  id: string;
  name: string;
  layout_id: string;
  layout: Layout;
  description: string;
}

interface PipelineStageFormProps {
  step?: number;
  setIsOpen?: (isOpen: boolean) => void;
  pipelineData: any;
  setRerender: (value: any) => void;
  selectedPipelineStageId?: string;
  pipeStageName?: string;
  pipelineStageTemplateId?: string;
}

interface FormValues {
  template_id: string;
  edit?: any;
  fields?: Record<string, any>;
}

const stageSchema = z.object({
  template_id: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Please select a template',
  }),
  edit: z.any().optional(),
  fields: z.record(z.string(), z.any()).optional(),
});

const PipelineStageForm = ({
  step = 0,
  setIsOpen,
  pipelineData,
  setRerender,
  selectedPipelineStageId,
  pipeStageName,
  pipelineStageTemplateId,
}: PipelineStageFormProps) => {
  const [formStep, setFormStep] = useState(step);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Array<FieldData>>([]);
  const [formFields, setFormFields] = useState<Array<any>>([]);
  const [templateFields, setTemplateFields] = useState<Array<any>>([]);
  const [currentTemplate, setCurrentTemplate] = useState<any>();
  const [formId, setFormId] = useState<string>();
  const [pipelineStageDetails, setPipelineStageDetails] = useState<any>();
  const [pipelineMapId, setPipelineMapId] = useState<string>();
  const [sourceData, setSourceData] = useState<any>([]);
  const [stageMapping, setStageMapping] = useState<any>([]);
  const [zodSchema, setZodSchema] = useState<any>(stageSchema);

  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(zodSchema),
    defaultValues: {
      template_id: pipelineStageTemplateId || '',
    },
  });
  const router = useRouter();

  const pipelineId: string = router.query.id as string;
  const selectedTemplateId: any = watch('template_id');

  const loadTemplates = () => {
    fetchAPI(`data_templates`)
      .then((data: any) => {
        setIsLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const templates: any[] = data.data_templates;
        if (pipelineData) {
          const usedTemplateIds = pipelineData.stages.map(
            (stage: any) => stage.data_template.id,
          );

          const availableTemplates = templates.filter((template) => {
            if (
              selectedPipelineStageId &&
              template.id === pipelineStageTemplateId
            ) {
              return true;
            }
            return !usedTemplateIds.includes(template.id);
          });
          setTemplates(availableTemplates);
        } else {
          setTemplates(templates);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(true);
      });
  };

  // Pipeline Stage create/update API
  const handleNextStep = () => {
    setIsLoading(true);
    if (formStep == 0) {
      const stagePayload = {
        data_template_id: currentTemplate?.data_template?.id,
        content_type_id: currentTemplate?.content_type?.id,
      };

      if (selectedPipelineStageId) {
        putAPI(`stages/${selectedPipelineStageId}`, stagePayload)
          .then((res) => {
            setPipelineStageDetails(res);
            toast.success('Stage Updated Successfully', {
              position: 'top-right',
            });
            setRerender((prev: boolean) => !prev);
            setFormStep((current) => current + 1);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast.error('Failed to Update Stage', {
              position: 'top-right',
            });
          });
      } else {
        postAPI(`pipelines/${pipelineId}/stages`, stagePayload)
          .then((res: any) => {
            setPipelineStageDetails(res);
            toast.success('Stage Created Successfully', {
              position: 'top-right',
            });
            setRerender((prev: boolean) => !prev);
            setFormStep((current) => current + 1);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast.error('Stage already exists', {
              position: 'top-right',
            });
          });
      }
    }
  };

  // Pipeline mapping API
  const handleSubmitMapping = () => {
    setIsLoading(true);
    const mappingPayload = {
      pipe_stage_id: pipelineStageDetails.id,
      mapping: sourceData,
    };

    if (selectedPipelineStageId && pipelineMapId) {
      putAPI(`forms/${formId}/mapping/${pipelineMapId}`, mappingPayload)
        .then(() => {
          setIsOpen && setIsOpen(false);
          setRerender((previous: boolean) => !previous);
          toast.success('Mapping Updated Successfully', {
            position: 'top-right',
          });
          setIsLoading(false);
        })
        .catch(() => {
          toast.error('Mapping Failed', {
            position: 'top-right',
          });
          setIsLoading(false);
        });
    } else if (templateFields.length == mappingPayload.mapping.length) {
      postAPI(`forms/${formId}/mapping`, mappingPayload)
        .then(() => {
          setIsOpen && setIsOpen(false);
          setRerender((previous: boolean) => !previous);
          toast.success('Mapped Successfully', {
            position: 'top-right',
          });
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const loadFormFieldsSuccess = (data: any) => {
    const fields = data.fields;
    setFormFields(fields);
  };

  const loadFormFields = (id: string) => {
    fetchAPI(`forms/${id}`).then((data: any) => {
      loadFormFieldsSuccess(data);
    });
  };

  const loadContentTypeForPipeline = () => {
    if (pipelineData) {
      setFormId(pipelineData.source_id);
      loadFormFields(pipelineData.source_id);
    }
  };

  const loadTemplateFieldsSuccess = (data: any) => {
    setCurrentTemplate(data);
    const fields = data.content_type?.fields || [];
    setTemplateFields(fields);
  };

  const loadTemplateFields = (id: string) => {
    fetchAPI(`data_templates/${id}`)
      .then((data: any) => {
        loadTemplateFieldsSuccess(data);
      })
      .catch((error) => {
        console.error('Error loading template fields:', error);
        toast.error('Failed to load template fields', {
          position: 'top-right',
        });
        setTemplateFields([]);
      });
  };

  const handleTemplateChange = (id: any) => {
    if (id) {
      const templateId: any = id;
      loadTemplateFields(templateId);
    } else {
      setCurrentTemplate(undefined);
      setTemplateFields([]);
    }
  };

  useEffect(() => {
    if (
      selectedPipelineStageId &&
      pipelineStageDetails &&
      pipelineStageDetails.form_mapping?.mapping
    ) {
      setPipelineMapId(
        pipelineStageDetails ? pipelineStageDetails.form_mapping.id : '',
      );
      const mappingData = pipelineStageDetails.form_mapping.mapping;
      setStageMapping(mappingData);
      setSourceData(mappingData);

      // Initialize field mapping values in the form
      if (mappingData && mappingData.length > 0) {
        mappingData.forEach((mapping: any, index: number) => {
          if (mapping.source && mapping.source.id) {
            (setValue as any)(`fields.${index}.source`, mapping.source.id);
          }
        });
      }
    }
  }, [pipelineStageDetails, selectedPipelineStageId, setValue]);

  useEffect(() => {
    loadTemplates();
    loadContentTypeForPipeline();
    if (pipelineStageTemplateId) {
      loadTemplateFields(pipelineStageTemplateId);
      if (selectedPipelineStageId) {
        setValue('template_id', pipelineStageTemplateId);

        // Fetch the specific template to ensure it's available for display
        fetchAPI(`data_templates/${pipelineStageTemplateId}`)
          .then((data: any) => {
            // Add this template to the templates list if it's not already there
            setTemplates((prevTemplates) => {
              const exists = prevTemplates.some((t) => t.id === data.id);
              if (!exists) {
                return [...prevTemplates, data];
              }
              return prevTemplates;
            });
          })
          .catch((error) => {
            console.error('Error fetching template details:', error);
          });
      }
    }
  }, [selectedPipelineStageId, pipelineStageTemplateId, setValue]);

  useEffect(() => {
    if (pipelineStageDetails || pipelineData) {
      setZodSchema(stageSchema);
    }
  }, [pipelineStageDetails]);

  useEffect(() => {
    handleTemplateChange(selectedTemplateId);
  }, [selectedTemplateId]);

  const handlePrevStep = () => {
    setFormStep((current) => current - 1);
  };

  const goToStep = (nextStep: number) => {
    setFormStep(nextStep);
  };

  const formTitles = ['Configure', 'Mapping'];

  // Function to handle field mapping selection
  const handleFieldMappingChange = (index: number, selectedOption: string) => {
    const selectedSource = formFields.find(
      (field) => field.id === selectedOption,
    );

    if (selectedSource) {
      setSourceData((prevData: any) => {
        const newData = [...prevData];
        newData[index] = {
          destination: {
            id: templateFields[index].id,
            name: templateFields[index].name,
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
            id: templateFields[index].id,
            name: templateFields[index].name,
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

  const onSearchTemplates = async (query?: string) => {
    // If editing an existing pipeline stage with a template that might not be in the list
    if (selectedPipelineStageId && pipelineStageTemplateId) {
      const existingTemplate = templates.find(
        (template) => template.id === pipelineStageTemplateId,
      );
      if (!existingTemplate && templates.length > 0) {
        try {
          const response = await fetchAPI(
            `data_templates/${pipelineStageTemplateId}`,
          );
          if (response) {
            return [...templates, response];
          }
        } catch (error) {
          console.error('Error fetching template:', error);
        }
      }
    }

    // If there's a search query, fetch filtered templates from API
    if (query && query.trim() !== '') {
      try {
        const response = (await fetchAPI(
          `data_templates?title=${encodeURIComponent(query)}`,
        )) as { data_templates: Array<FieldData> };
        return response.data_templates || [];
      } catch (error) {
        console.error('Error searching templates:', error);
        return templates; // Fallback to cached templates on error
      }
    }

    return templates;
  };

  const onSearchFormFields = async () => {
    const nilOption = { id: 'nil', name: 'nil' };
    return [nilOption, ...formFields];
  };

  return (
    <Flex direction="column" h="100vh" overflow="scroll">
      <Drawer.Header>
        <Drawer.Title>
          {selectedPipelineStageId ? 'Edit Stage' : 'Create Stage'}
        </Drawer.Title>
        <X
          size={20}
          weight="bold"
          cursor="pointer"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      </Drawer.Header>
      <StepsIndicator titles={formTitles} formStep={formStep} goTo={goToStep} />
      <Box flex={1} overflowY="auto" px="xl" py="md" minWidth="550px">
        <Flex direction="column" gap="md">
          <Box display={formStep === 0 ? 'block' : 'none'}>
            <Box display="none">
              <Input
                id="edit"
                defaultValue={0}
                hidden={true}
                {...(register('edit', { required: true }) as any)}
              />
            </Box>

            <Box mt={3}>
              <Controller
                control={control}
                name="template_id"
                render={({ field: { onChange, name, value } }) => {
                  // Find the selected template to display in the Search component
                  const selectedTemplate = templates.find(
                    (t) => t.id === value,
                  );

                  return (
                    <Field
                      label="Choose a template"
                      required
                      disabled={selectedPipelineStageId ? true : false}
                      error={errors?.template_id?.message as string}>
                      <Search
                        itemToString={(item: any) => item && item.title}
                        name={name}
                        placeholder={
                          !selectedPipelineStageId
                            ? 'Select a template'
                            : pipeStageName || ''
                        }
                        minChars={0}
                        value={selectedTemplate || value}
                        onChange={(item: any) => {
                          if (!item) {
                            onChange('');
                            return;
                          }
                          onChange(item.id);
                        }}
                        renderItem={(item: any) => (
                          <Box>
                            <Text>{item?.title}</Text>
                          </Box>
                        )}
                        search={(query: string) => onSearchTemplates(query)}
                      />
                    </Field>
                  );
                }}
              />
            </Box>
          </Box>
          <Box display={formStep === 1 ? 'block' : 'none'}>
            <Box>
              <Label>Field Name</Label>
              {templateFields &&
                templateFields.length > 0 &&
                templateFields.map((field, index) => (
                  <Box key={field.id}>
                    <Flex align="center" pb="2">
                      <Box mr={2}>
                        <Input
                          {...(register(`fields.${index}.name`) as any)}
                          defaultValue={(field && field.name) || ''}
                          disabled
                        />
                      </Box>
                      <ArrowRightIcon />
                      <Box flexGrow={1} ml={2}>
                        <Controller
                          control={control as any}
                          name={`fields.${index}.source`}
                          defaultValue={stageMapping[index]?.source?.id || ''}
                          render={({ field: { onChange, name, value } }) => {
                            // Find the selected field to display in the Search component
                            const selectedField =
                              formFields.find((f) => f.id === value) ||
                              (stageMapping[index]
                                ? {
                                    id: stageMapping[index].source.id,
                                    name: stageMapping[index].source.name,
                                  }
                                : null);

                            return (
                              <Search
                                itemToString={(item: any) => item && item.name}
                                name={name}
                                placeholder={
                                  stageMapping[index]
                                    ? stageMapping[index].source.name
                                    : 'Select an option'
                                }
                                minChars={0}
                                value={selectedField}
                                initialSelectedItem={selectedField}
                                onChange={(item: any) => {
                                  if (!item) {
                                    onChange('');
                                    return;
                                  }
                                  onChange(item.id);
                                  handleFieldMappingChange(index, item.id);
                                }}
                                renderItem={(item: any) => (
                                  <Box>
                                    <Text>{item?.name}</Text>
                                  </Box>
                                )}
                                search={() => onSearchFormFields()}
                              />
                            );
                          }}
                        />
                      </Box>
                    </Flex>
                  </Box>
                ))}
            </Box>
          </Box>
        </Flex>
      </Box>
      <Flex flexShrink="0" px="xl" py="md" gap="sm">
        {formStep >= 1 && (
          <Button variant="secondary" type="button" onClick={handlePrevStep}>
            Prev
          </Button>
        )}
        {formStep == 0 ? (
          <Button
            disabled={isLoading}
            type="button"
            onClick={handleNextStep}
            variant="primary"
            loading={isLoading}>
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            type="button"
            loading={isLoading}
            disabled={isLoading}
            onClick={handleSubmitMapping}>
            {stageMapping && stageMapping.length > 0 && isValid
              ? 'Update'
              : 'Add'}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default PipelineStageForm;
