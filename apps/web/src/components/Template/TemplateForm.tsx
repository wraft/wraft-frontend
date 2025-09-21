import React, { useEffect, useState, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextTIcon } from '@phosphor-icons/react';
import {
  Button,
  Box,
  Flex,
  Text,
  Field,
  InputText,
  Search,
  Modal,
} from '@wraft/ui';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import MentionField from 'components/MentionsField';
import { IconFrame, TimeAgo } from 'common/Atoms';
import Editor from 'common/Editor';
import NavEdit from 'common/NavEdit';
import { Template, TemplateSchema } from 'schemas/template';
import { putAPI, postAPI, fetchAPI } from 'utils/models';
import {
  IContentType,
  ContentTypes,
  Field as FieldT,
  DataTemplates,
} from 'utils/types';

import EditMenus from './EditMenus';

export interface BlockTemplate {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

const TemplateEditor = () => {
  const [blocks, setBlocks] = useState<Array<BlockTemplate>>([]);
  const [contentTypes, setContentTypes] = useState<Array<IContentType>>([]);
  const [currentTemplate, setCurrentTemplate] = useState<DataTemplates>();
  const [fields, setFields] = useState<any>([]);
  const [insertable, setInsertable] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagetitle, setPageTitle] = useState<string>('');
  const [isSetupVisible, setIsSetupVisible] = useState<boolean>(false);
  const [fieldTokens, setFieldTokens] = useState<any>('');
  const [selectedVariant, setSelectedVariant] = useState<IContentType>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const editorRef = useRef<any>();

  const {
    trigger,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm<Template>({ resolver: zodResolver(TemplateSchema) });
  const router = useRouter();
  const templateId: string = router.query.id as string;

  useEffect(() => {
    if (templateId && currentTemplate?.data_template) {
      const templateData = currentTemplate.data_template;
      setValue('title', templateData.title);
      setValue('title_template', templateData.title_template);
      setValue('variant', currentTemplate.content_type, {
        shouldValidate: true,
      });
      setPageTitle(templateData.title);
      fetchContentTypeDetails(currentTemplate.content_type.id);

      const isInsertable = templateData.serialized?.data || false;
      if (isInsertable) {
        setValue('serialized', isInsertable);
        setInsertable(JSON.parse(isInsertable));
      }
    }
  }, [currentTemplate]);

  useEffect(() => {
    fetchContentTypes();
    fetchTemplateBlocks();

    if (!templateId) {
      setIsSetupVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!templateId && contentTypes && contentTypes[0] && contentTypes[0].id) {
      fetchContentTypeDetails(contentTypes[0].id);
    }
  }, [contentTypes]);

  useEffect(() => {
    if (templateId) {
      fetchTemplateDetails(templateId);
    }
  }, [templateId]);

  useEffect(() => {
    if (selectedVariant?.fields) {
      const tokens = selectedVariant.fields.map((field: any) => ({
        id: `${field.id}`,
        label: `${field.name}`,
        name: `${field.name}`,
      }));
      setFieldTokens(tokens);
    }
  }, [selectedVariant]);

  const onCreated = () => {
    Router.push('/templates');
  };

  /**
   * Form Submit
   * @param data
   */
  const onSubmit = (formData: any) => {
    setLoading(true);

    const jsonContent = editorRef.current?.helpers?.getJSON();
    const markdownContent = editorRef.current?.helpers?.getMarkdown();

    const payload = {
      title_template: formData.title_template,
      title: formData.title,
      data: markdownContent,
      serialized: {
        data: JSON.stringify(jsonContent),
      },
    };

    if (templateId) {
      putAPI(`data_templates/${templateId}`, payload)
        .then(() => {
          onCreated();
          toast.success('Updated Successfully', {
            duration: 1000,
            position: 'top-right',
          });
          setLoading(false);
        })
        .catch(() => {
          setLoading(true);
          toast.error('Failed to update!', {
            duration: 1000,
            position: 'top-right',
          });
        });
    } else {
      postAPI(`content_types/${formData.variant.id}/data_templates`, payload)
        .then((content: any) => {
          Router.replace(`/templates/${content.id}`);
          // onCreated();
          toast.success('Created Successfully', {
            duration: 3000,
            position: 'top-right',
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(
            (error && JSON.stringify(error)) ||
              'Something went wrong please try again later',
            {
              duration: 3000,
              position: 'top-right',
            },
          );
        });
    }
  };

  const fetchContentTypes = () => {
    fetchAPI('content_types').then((data: any) => {
      setContentTypes(data.content_types);
    });
  };

  const fetchContentTypeDetails = (id: string) => {
    fetchAPI(`content_types/${id}`).then((data: any) => {
      const contentTypeDetails: ContentTypes = data;
      setSelectedVariant(contentTypeDetails.content_type);

      if (contentTypeDetails?.content_type?.fields) {
        const fieldOption = contentTypeDetails.content_type.fields.map(
          ({ name }) => ({
            value: `[${name}]`,
            label: name,
          }),
        );
        setFields(fieldOption);
      }
    });
  };

  const fetchTemplateBlocks = () => {
    fetchAPI(`block_templates`).then((data: any) => {
      const allBlocks: BlockTemplate[] = data.block_templates;
      setBlocks(allBlocks);
    });
  };

  const fetchTemplateDetails = (id: string) => {
    setLoading(true);
    fetchAPI(`data_templates/${id}`)
      .then((data: any) => {
        setLoading(false);
        setCurrentTemplate(data);
      })
      .catch((error) => {
        if (error?.status === 400 || error?.statusCode === 400) {
          return router.push('/404');
        }
        setLoading(false);
      });
  };

  /**
   * Insert a block at pointer
   * @param block
   */
  const insertBlock = (block: any) => {
    const blockContent = JSON.parse(block.serialized);
    editorRef.current.helpers.insterBlock(blockContent);
  };

  const handleDocxUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: any = await postAPI(
        'import_docx',
        formData,
        (progress) => {
          setUploadProgress(progress);
        },
      );

      toast.success('Document uploaded successfully', {
        duration: 3000,
        position: 'top-right',
      });

      if (response?.prosemirror) {
        const prosemirrorJson = response?.prosemirror;
        editorRef.current?.helpers?.insterBlock(prosemirrorJson);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document', {
        duration: 6000,
        position: 'top-right',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleDocxUpload(file);
    }
  };

  const onSaveTemplate = async () => {
    const isValid = await trigger(['title', 'variant']);

    if (!isValid) {
      return;
    }

    setIsSetupVisible(!isSetupVisible);

    const formData = getValues();
    setPageTitle(formData?.title);

    if (formData?.title_template == '') {
      setValue('title_template', formData?.title);
    }
  };

  const onCancelSetup = () => {
    if (!templateId) {
      onCreated();
      return;
    }

    setIsSetupVisible(!isSetupVisible);
  };

  const onSearchVariants = async (query: string) => {
    try {
      const response: any = await fetchAPI(`content_types?name=${query}`);

      if (!response || !response.content_types) {
        throw new Error('Invalid response structure');
      }

      return response.content_types;
    } catch (error) {
      console.error('Error fetching content types:', error);
      return [];
    }
  };

  return (
    <Box h="100vh" overflow="hidden">
      <NavEdit
        navtitle={templateId ? 'Edit ' + pagetitle : pagetitle}
        backLink="/templates"
        onToggleEdit={onSaveTemplate}
      />
      <Flex align="space-between" h="100%">
        <Box flex={1} bg="background-secondary" h="100%">
          <Flex
            bg="background-primary"
            align="center"
            p="md"
            gap="sm"
            as="form"
            onSubmit={handleSubmit(onSubmit)}>
            <Box flex={1}>
              <Controller
                control={control}
                name="title_template"
                render={({ field: { onChange, value, name } }) => (
                  <MentionField
                    onChange={onChange}
                    name={name}
                    defaultValue={value}
                    options={fields}
                    placeholder="Automatic Title, use @ ds"
                  />
                )}
              />
            </Box>

            <Button variant="primary" loading={loading} type="submit" size="sm">
              {templateId ? 'Update' : 'Create'}
            </Button>
          </Flex>

          <Flex
            mt="lg"
            flexGrow={1}
            justify="center"
            overflowY="auto"
            maxHeight="calc(100vh - 150px)">
            <Box minWidth="794px" maxWidth="920px">
              <Editor
                isReadonly={false}
                defaultContent={insertable}
                tokens={fieldTokens}
                ref={editorRef}
              />
            </Box>
          </Flex>
        </Box>

        <Modal
          open={isSetupVisible}
          ariaLabel="Create Template"
          onClose={() => setIsSetupVisible(false)}>
          <Flex w="480px" direction="column">
            <Box py="md" borderBottom="solid 1px" borderColor="border">
              <Text fontSize="xl" fontWeight="heading">
                {templateId ? `Edit Template` : 'Create Template'}
              </Text>
            </Box>
            <Flex pt="md" pb="xl" direction="column" gap="sm">
              <Field
                label="Template Name"
                required
                error={errors?.title?.message}>
                <InputText
                  {...register('title')}
                  placeholder="Title for your template"
                  required
                />
              </Field>

              {selectedVariant && selectedVariant.fields && !templateId && (
                <Controller
                  control={control}
                  name="variant"
                  render={({ field: { onChange, value, name } }) => (
                    <Field
                      label="Variant"
                      hint="The variant type cannot be modified once saved. Please select the correct one."
                      required
                      error={errors?.variant?.message}>
                      <Search
                        itemToString={(item: any) => item && item.name}
                        name={name}
                        placeholder="Search Variant"
                        minChars={0}
                        value={value}
                        onChange={(variant: any) => {
                          if (variant?.id) {
                            onChange(variant);
                            fetchContentTypeDetails(variant?.id);
                          }
                        }}
                        renderItem={(item: any) => (
                          <Box>
                            <Text>{item.name}</Text>
                          </Box>
                        )}
                        search={onSearchVariants}
                      />
                    </Field>
                  )}
                />
              )}
              <Box borderTop="solid 1px" borderColor="border" my="lg" />
              <Box>
                <Field
                  label="Upload Your DOCX Template (Optional)"
                  hint="Use an existing template by uploading a .docx file.">
                  <>
                    <InputText
                      type="file"
                      accept=".docx"
                      placeholder="Upload your document"
                      onChange={handleFileChange}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Box mt="xs">
                        <Text>Uploading: {uploadProgress}%</Text>
                      </Box>
                    )}
                  </>
                </Field>
              </Box>
            </Flex>
            <Flex borderTop="solid 1px" borderColor="border" py="md" gap="sm">
              <Button variant="primary" onClick={() => onSaveTemplate()}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => onCancelSetup()}>
                Cancel
              </Button>
            </Flex>
          </Flex>
        </Modal>
        <Box
          w="30%"
          maxWidth="400px"
          borderLeft="solid 1px"
          borderColor="border">
          {templateId && currentTemplate && (
            <Flex align="center" justify="space-between" px="md" py="lg">
              <Box>
                <Text fontWeight="heading">Updated </Text>
                <TimeAgo
                  time={currentTemplate?.data_template?.updated_at}
                  ago={true}
                />
              </Box>
              <Box>
                <EditMenus id={templateId} />
              </Box>
            </Flex>
          )}

          {selectedVariant && selectedVariant.fields && (
            <Box px="md" py="lg">
              <Text as="h4">Fields</Text>
              <Text as="p" mb="sm" color="text-secondary">
                Dynamic variables provided by Variants
              </Text>
              <Box border="solid 1px" borderColor="border" borderRadius="sm">
                {selectedVariant.fields &&
                  selectedVariant.fields.map((field: FieldT, index: number) => (
                    <Flex
                      bg="background-secondary"
                      p="sm"
                      borderBottom={
                        index === selectedVariant.fields.length - 1
                          ? 'none'
                          : 'solid 1px'
                      }
                      borderColor="border"
                      justify="space-between"
                      key={field.id}
                      onClick={() => insertBlock(field)}>
                      <Text>{field.name}</Text>
                      <IconFrame color="icon">
                        <TextTIcon />
                      </IconFrame>
                    </Flex>
                  ))}
              </Box>
            </Box>
          )}

          <Box px="md" py="lg">
            <Box mb="sm">
              <Text as="h4">Blocks</Text>
              <Text as="p" color="text-secondary">
                Blocks are reusable contents, click to insert
              </Text>
            </Box>

            <Box border="solid 1px" borderColor="border" borderRadius="sm">
              {blocks &&
                blocks.map((block: BlockTemplate, index: number) => (
                  <Box
                    key={block.id}
                    onClick={() => insertBlock(block)}
                    borderBottom={
                      index === blocks.length - 1 ? 'none' : 'solid 1px'
                    }
                    borderColor="border"
                    p="sm"
                    bg="background-secondary">
                    <Text>{block.title}</Text>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
        {/* {errors.exampleRequired && <Text>This field is required</Text>} */}

        {/* <WraftEditor/> */}
      </Flex>
    </Box>
  );
};
export default TemplateEditor;
