/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, Label, Input } from 'theme-ui';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Button } from '@wraft/ui';
import type { NodeJSON } from '@wraft/editor';

import NavEdit from 'components/NavEdit';
import Editor from 'components/common/Editor';
import Field from 'common/Field';
import { RoutedDialog } from 'common/RoutedDialog';
import { FlowStateBlock, ContentSidebar } from 'common/content';
import { updateVars, findHolders } from 'utils/index';
import {
  IContentForm,
  IFieldField,
  IFieldType,
  EMPTY_MARKDOWN_NODE,
  ContentInstance,
} from 'utils/types/content';
import { postAPI, fetchAPI, putAPI } from 'utils/models';
import { ContentState } from 'utils/types';
import { Field as FieldT } from 'utils/types';
import contentStore from 'store/content.store';

import FieldForm from './FieldForm';

const ContentForm = ({ id, edit }: IContentForm) => {
  const [activeFlow, setActiveFlow] = useState<any>(null);
  const [body, setBody] = useState<NodeJSON>(EMPTY_MARKDOWN_NODE);
  const [contents, setContents] = useState<ContentInstance>();
  const [contentTypeId, setContentTypeId] = useState<ContentInstance>();
  const [fieldMaps, setFieldMap] = useState<Array<IFieldType>>();
  const [fields, setField] = useState<Array<FieldT>>([]);
  const [fieldValues, setFieldValues] = useState<any>([]);
  const [maps, setMaps] = useState<Array<IFieldField>>([]);
  const [pageTitle, setPageTitle] = useState<string>('New Title');
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(false);
  const [showTitleEdit, setTitleEdit] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<any>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [fieldTokkons, setFieldTokkons] = useState<any>([]);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();
  const editorRef = useRef<any>();
  const newContent = contentStore((state: any) => state.newContents);
  const cId: string = router.query.id as string;

  useEffect(() => {
    if (id && edit) {
      fetchContent(id);
    }
  }, [id, edit]);

  useEffect(() => {
    if (!id && newContent?.template?.title_template) {
      createDefaultTitle(newContent.template.title_template);
    }
  }, [maps, newContent]);

  useEffect(() => {
    if (!id && !edit && newContent) {
      initNewContent(newContent.template);

      if (newContent.contentFields) {
        setFieldValues(newContent.contentFields);
      }
    }
  }, [newContent]);

  useEffect(() => {
    setUnsavedChanges(isDirty);
  }, [isDirty]);

  const initNewContent = (template: any) => {
    setSelectedTemplate(template);

    const ctypeId = template?.content_type?.id;
    const serialbody = template.content?.serialized;
    const content_title = serialbody?.title;

    if (ctypeId) {
      fetchContentTypeDetails(ctypeId);
      setContentTypeId(ctypeId);
    }

    if (content_title) {
      setPageTitle(content_title);
    }
  };

  const fetchContentTypeDetails = async (cid: string) => {
    try {
      const data: any = await fetchAPI(`content_types/${cid}`);

      const tFields = data.content_type?.fields;
      if (tFields) {
        setField(tFields);
      }

      const tFlow = data.content_type?.flow;
      if (tFlow) {
        setActiveFlow(tFlow);
      }
    } catch (error) {
      console.error('Failed to fetch content type details:', error);
    }
  };

  const createDefaultTitle = (titleTemplate: string) => {
    const generatedTitle = replacePlaceholders(titleTemplate, maps || []);
    setPageTitle(generatedTitle);
  };

  const replacePlaceholders = (str: string, replacements: any): any => {
    replacements &&
      replacements.forEach(({ name, value }: any) => {
        const regex = new RegExp(`\\[${name}\\]`, 'g');
        str = str.replace(regex, value);
      });
    return str;
  };

  const updateMaps = (map: any) => {
    setMaps(map);
  };

  /**
   * Post Submit
   * @param data
   */
  const onCreate = (data: any) => {
    if (data?.content?.id) {
      toast.success('Saved Successfully', {
        duration: 1000,
        position: 'top-right',
      });
      router.replace(`/content/${data.content.id}`);
    }
  };

  /**
   * On Submit
   * @param data
   */

  const onSubmit = () => {
    const obj: any = {};

    const markdownContent = editorRef.current?.helpers?.getMarkdown();
    const jsonContent = editorRef.current?.helpers?.getJSON();

    setUnsavedChanges(false);

    setSaving(true);

    const serials: any = {
      ...obj,
      title: pageTitle || 'welcome',
      body: markdownContent,
      serialized: JSON.stringify(jsonContent),
      fields: newContent?.contentFields
        ? JSON.stringify(newContent?.contentFields)
        : '',
    };

    const template = {
      serialized: serials,
      raw: markdownContent,
    };

    if (edit) {
      putAPI(`contents/${id}`, template).then((response: any) => {
        onCreate(response);
        setSaving(false);
      });
    } else {
      postAPI(`content_types/${contentTypeId}/contents`, template)
        .then((response: any) => {
          if (response?.info) {
            toast.success('Build Failed', {
              duration: 1000,
              position: 'top-right',
            });
            setSaving(false);
          }

          if (response?.content?.id) {
            toast.success('Saved Successfully', {
              duration: 1000,
              position: 'top-right',
            });
            router.replace(`/content/${response.content.id}`);
            setSaving(false);
          }
        })
        .catch((error) => {
          setSaving(false);
          toast.error(
            error?.message || 'Something went wrong please try again later',
            {
              duration: 3000,
              position: 'top-right',
            },
          );
        });
    }
  };

  const fetchContent = async (contentId: string) => {
    try {
      const data = await fetchAPI(`contents/${contentId}`);
      loadContentData(data);
    } catch (error) {
      toast.error('Failed to load content');
    }
  };

  /**
   * Load content data from a doc
   * @param data
   */
  const loadContentData = (data: any) => {
    // set master contents

    setContents(data);

    if (data?.content?.serialized?.serialized) {
      const serialized = JSON.parse(data.content.serialized.serialized);
      const fdvalue = findHolders(serialized);
      setFieldValues(fdvalue);
    }

    if (data?.content?.serialized) {
      const serialbody = data?.content?.serialized;
      const ctypeId = data?.content_type?.id;
      setContentTypeId(ctypeId);

      // middle wares
      const content_title = serialbody?.title || undefined;

      // fields and templates
      fetchContentTypeDetails(ctypeId);

      setPageTitle(content_title);

      const jsonBody = serialbody.serialized;

      if (jsonBody) {
        const df = JSON.parse(jsonBody);
        if (df) {
          setBody(df);
        }
      }
    }
  };

  // syncable field
  useEffect(() => {
    if (fields) {
      updateFields(fields);
    }
  }, [fields]);

  /**
   * Update Document  Title
   */
  const updateTitle = () => {
    setPageTitle(selectedTemplate?.title_template);
  };
  /**
   * Field update eventbus
   * @param f
   */
  const updateFields = (f: any) => {
    setFieldMap(f);
    if (!edit) {
      updateTitle();
    }
  };

  /**
   * When form errors appear
   */
  useEffect(() => {
    if (errors) {
      const items = Object.keys(errors);
      items.map((i: any) => {
        // @ts-expect-error temporary solution here
        const msg: string = errors[i]['message'];
        toast.error(msg, {
          duration: 1000,
          position: 'bottom-center',
        });
      });
    }
  }, [errors]);

  /**
   * Mapping Form values to content and updating it
   * @param content
   * @param mappings
   */
  const passUpdates = async (contentData: any, mappings: any) => {
    const updatedContent = await updateVars(contentData, mappings);
    setBody(updatedContent);
  };

  /**
   *
   * @param data
   * @param mapx
   * @param key
   */
  const updateStuff = (data: any, mapx: any) => {
    if (data?.data) {
      let respx = '';

      if (data?.serialized?.type === 'doc') {
        respx = data?.serialized;
      } else {
        const res = JSON.parse(data?.serialized?.data);
        respx = res;
      }

      const xr: any = respx;
      passUpdates(xr, mapx);
    }

    if (data?.serialized?.data && mapx) {
      const xr: ContentState = JSON.parse(data.serialized.data);
      passUpdates(xr, mapx);
    }

    if (data?.type === 'doc') {
      const contentliv: ContentState = data;
      passUpdates(contentliv, mapx);
    }
  };

  /**
   * silently sync editor values to hidden fields... shh...
   * @param state object with md, and json representation
   */

  const doUpdate = () => {};

  const getInits = (field_maps: any) => {
    const initials: IFieldField[] = [];
    field_maps &&
      field_maps.forEach((i: any) => {
        const item: IFieldField = {
          name: i.name,
          value: i.value,
          named: i.value,
          label: i.name,
          id: i?.field_type?.id,
        };
        initials.push(item);
      });
    return initials;
  };

  /**
   * When use saves variant form names
   * @param defx
   */
  const onSaved = (defx: any) => {
    const resx = getInits(defx);

    if (resx?.length > 0) {
      setFieldTokkons(resx);
    }

    if (contents?.content?.serialized?.serialized) {
      const serializedData = editorRef.current?.helpers?.getJSON();
      updateStuff(serializedData, resx);
    }

    if (!edit) {
      updateStuff(selectedTemplate, resx);
    }
  };

  const onceInserted = () => {
    setTrigger(null);
  };

  const toggleTitleEdit = () => {
    setTitleEdit(!showTitleEdit);
  };

  const onTitleUpdate = (data: any) => {
    setPageTitle(data.title);
    setTitleEdit(!showTitleEdit);
  };

  return (
    <>
      <RoutedDialog
        unsavedChanges={unsavedChanges}
        onConfirmLeave={() => setUnsavedChanges(false)}
      />

      <Box sx={{ height: '100vh' }}>
        <NavEdit navtitle={pageTitle} onToggleEdit={() => toggleTitleEdit()} />

        <Flex
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            height: 'calc(100% - 47px)',
          }}>
          <Box
            sx={{
              // minWidth: '40%',
              overflowX: 'scroll',
              // maxWidth: '85ch',
              m: 0,
              bg: 'neutral.200',
            }}>
            {activeFlow && (
              <Flex
                sx={{
                  // bg: '#d9deda57',
                  px: 3,
                  py: '9px',
                  gap: 2,
                  bg: 'gray.200',
                  alignContent: 'center',
                }}>
                {activeFlow?.states.map((x: any) => (
                  <FlowStateBlock
                    key={x?.id}
                    state={x?.state}
                    order={x?.order}
                    id={x?.id}
                  />
                ))}

                <Box sx={{ ml: 'auto' }}>
                  <Button onClick={onSubmit} variant="primary" loading={saving}>
                    Save
                  </Button>
                </Box>
              </Flex>
            )}

            {showTitleEdit && (
              <Box
                as="form"
                onSubmit={handleSubmit(onTitleUpdate)}
                sx={{
                  // position: 'relative',
                  bg: 'neutral.100',
                  borderBottom: 'solid 1px',
                  borderBottomColor: 'neutral.200',
                  p: 4,
                  display: showTitleEdit ? 'block' : 'none',
                  flexGrow: 1,
                  width: '100%',
                  pl: 2,
                  pt: 2,
                  // display: 'none',
                }}>
                <Flex
                  sx={{
                    bg: 'neutral.100',
                    // position: 'absolute',
                    alignItems: 'center',
                    top: 0,
                    right: 1,
                    left: 1,
                    zIndex: 9000,
                  }}>
                  <Box sx={{ width: '90%', pl: 3, pt: 2, mr: 2 }}>
                    <Field
                      name="title"
                      label=""
                      placeholder="Document Name"
                      register={register}
                      defaultValue={pageTitle}
                    />
                  </Box>
                  <Box sx={{ width: '10%', pt: 2, ml: 'auto', mr: 4 }}>
                    <Button variant="secondary" type="submit">
                      Save
                    </Button>
                  </Box>
                </Flex>
              </Box>
            )}

            {body && (
              <Box
                sx={{
                  p: 0,
                  position: 'relative',
                  lineHeight: 1.5,
                  py: 3,
                  maxWidth: '110ch',
                  margin: '0 auto',
                  fontFamily: 'body',
                  '.remirror-editor-wrapper ': {
                    pl: '2rem',
                    pr: '2rem',
                  },
                }}>
                {/* <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowDev(!showDev)}>
                  Dev
                </Button> */}
                <Box
                  sx={{
                    mt: 0,
                    px: 4,
                    pb: 6,
                    '.remirror-theme .ProseMirror': {
                      pl: '9rem !important',
                      pr: '9rem !important',
                      pt: '7rem !important',
                      boxShadow: '#eee 0px 0px 0px 1px',
                      ':focus': {
                        boxShadow: '#ddd 0px 0px 0px 1px',
                      },
                    },
                  }}>
                  <Editor
                    defaultContent={body}
                    isReadonly={false}
                    ref={editorRef}
                  />
                </Box>
              </Box>
            )}
            <Box sx={{ display: 'none' }}>
              {/* <Field
                name="state"
                label="state"
                defaultValue=""
                register={register}
              /> */}

              {id && (
                <Box>
                  <Label>Edit </Label>
                  <Input
                    id="edit"
                    defaultValue={id}
                    {...register('edit', { required: true })}
                  />
                </Box>
              )}
              <Field
                name="ttype"
                label="Content Type"
                defaultValue={cId || id}
                register={register}
              />
            </Box>
          </Box>

          <Box
            variant="plateRightBar"
            sx={{
              bg: 'neutral.100',
              ml: 0,
              borderLeft: 'solid 1px',
              borderColor: 'border',
              overflow: 'scroll',
            }}>
            {contents && <ContentSidebar content={contents} />}

            <Box>
              <Box variant="layout.boxHeading">
                <Text as="h3" variant="sectionheading">
                  Content
                </Text>
              </Box>
              <Box sx={{ pt: 2, px: 3, bg: '#F5F7FE' }}>
                {selectedTemplate?.id && (
                  <Box>
                    <Text as="h6" variant="labelcaps">
                      Template
                    </Text>
                    <Box sx={{ px: 0, py: 1 }}>
                      <Flex
                        sx={{
                          pl: 3,
                          pt: 2,
                          pb: 2,
                          background: '#FFFFFF',
                          border: '1px solid #E9ECEF',
                        }}>
                        <Text
                          as="h6"
                          sx={{
                            fontSize: 'sm',
                            mb: 0,
                            fontWeight: 600,
                            letterSpacing: '0.2px',
                          }}>
                          {selectedTemplate?.title}
                        </Text>
                        <Text
                          as="p"
                          sx={{
                            ml: 'auto',
                            mr: 3,
                            fontSize: 'xs',
                            fontWeight: 600,
                            pt: 0,
                            color: 'gray.600',
                          }}>
                          {selectedTemplate?.content_type?.prefix}
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
            <FieldForm
              setMaps={updateMaps}
              fields={fieldMaps}
              fieldValues={fieldValues}
              onSaved={onSaved}
              onRefresh={onSaved}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
};
export default ContentForm;
