/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Router, { useRouter } from 'next/router';
import ContentSidebar, {
  FlowStateBlock,
} from '@wraft-ui/content/ContentSidebar';
import { Box, Flex, Button, Text, Label, Input, Spinner } from 'theme-ui';
import { RemirrorJSON } from 'remirror';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { RoutedDialog } from '@wraft-ui/RoutedDialog';

import NavEdit from 'components/NavEdit';
import FieldText from 'components/FieldText';
import Field from 'components/Field';
import Editor from 'components/common/Editor';
import { findVars, replaceTitles, updateVars } from 'utils/index';
import {
  IContentForm,
  IFieldField,
  IFieldType,
  IVariantDetail,
  EMPTY_MARKDOWN_NODE,
  ContentInstance,
} from 'utils/types/content';
import { postAPI, fetchAPI, putAPI } from 'utils/models';
import { ContentState } from 'utils/types';
import { Field as FieldT } from 'utils/types';
import contentStore from 'store/content.store';

import FieldForm from './FieldForm';

const ContentForm = (props: IContentForm) => {
  // Base
  // -------

  const router = useRouter();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [_content, setContent] = useState<IVariantDetail>();
  const [contents, setContents] = useState<ContentInstance>();
  const [activeTemplate, setActiveTemplate] = useState('');

  const cId: string = router.query.id as string;
  const pathname = usePathname();

  const [body, setBody] = useState<RemirrorJSON>(EMPTY_MARKDOWN_NODE);

  const [fields, setField] = useState<Array<FieldT>>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTitleEdit, setTitleEdit] = useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(true);

  const [activeFlow, setActiveFlow] = useState<any>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [maps, setMaps] = useState<Array<IFieldField>>([]);
  const [showDev, setShowDev] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(false);
  const [fieldMaps, setFieldMap] = useState<Array<IFieldType>>();
  const { id, edit } = props;
  const [title, setTitle] = useState<string>('New Title');

  const [pageTitle, setPageTitle] = useState<string>('New Title');

  const editorRef = useRef<any>();

  // triggers
  const [trigger, setTrigger] = useState<any>(null);
  const newContent = contentStore((state: any) => state.newContents);

  useEffect(() => {
    if (id && edit) {
      fetchAPI(`contents/${id}`).then((data: any) => {
        onLoadContent(data);
      });
    }
  }, [id, edit]);

  useEffect(() => {
    if (!id && !edit && newContent) {
      onInitNewContentCreate(newContent.template);
    }
  }, [newContent]);

  // const routeChangeStart = (url: any) => {
  //   if (
  //     router.asPath !== url &&
  //     unsavedChanges &&
  //     !confirm('You have unsaved changes. Are you sure you want to leave?')
  //   ) {
  //     router.events.emit('routeChangeError');
  //     throw 'Abort route change. Please ignore this error.';
  //   }
  // };

  // useEffect(() => {
  //   router.events.on('routeChangeStart', routeChangeStart);

  //   return () => {
  //     router.events.off('routeChangeStart', routeChangeStart);
  //   };
  // }, []);

  const onInitNewContentCreate = (template: any) => {
    setSelectedTemplate(template);

    const ctypeId = template?.content_type?.id;
    const defaultState = template.state?.id;
    const serialbody = template.content?.serialized;
    const content_title = serialbody?.title;

    if (ctypeId) {
      setValue('ttype', ctypeId);
      fetchContentTypeDetails(ctypeId);
    }

    setValue('state', defaultState);

    if (content_title) {
      setValue('title', content_title);
      setTitle(content_title);
      setPageTitle(content_title);
    }
    // updateStuff(template, maps);
    // setTrigger(EMPTY_MARKDOWN_NODE);
  };

  const fetchContentTypeDetails = async (contentTypeId: string) => {
    try {
      const data: any = await fetchAPI(`content_types/${contentTypeId}`);
      setContent(data);

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

  // /**
  //  * Toggle Title Edit
  //  * @param map
  //  */
  // const toggleEdit = () => {
  //   console.log('hi');
  //   setTitleEdit(!showTitleEdit);
  //   setShowTemplate(!showTemplate);
  // };
  /**
   * Update mapping of users inputs from fields to an internal array with fields
   * @param data
   */
  const updateMaps = (map: any) => {
    setMaps(map);
  };

  /**
   * Insertion Handler
   * @param data
   */
  const makeInsert = (data: any) => {
    setShowForm(data);
  };

  /**
   * Handle form mapping from the form for templates
   * @param fields
   * @returns
   */
  const mapFields = (fields: any) => {
    const vals = getValues();

    return fields.map((field: any) => ({
      ...field,
      value: vals[field.name],
    }));
  };

  /**
   * Post Submit
   * @param data
   */
  const onCreate = (data: any) => {
    if (data?.info) {
      // console.log('Failed Build', data.info);
    }

    if (data?.content?.id) {
      toast.success('Saved Successfully', {
        duration: 1000,
        position: 'top-right',
      });
      Router.push(`/content/${data.content.id}`);
    }
  };

  /**
   * On Submit
   * @param data
   */

  const onSubmit = (data: any) => {
    const obj: any = {};

    const markdownContent = editorRef.current?.helpers?.getMarkdown();
    const json = editorRef.current?.helpers?.getJSON();

    console.log('onSubmit[1--b]', data);
    console.log('onSubmit[1--b]', editorRef.current);

    setSaving(true);

    maps &&
      maps.forEach((f: any) => {
        obj[f.name] = f.value;
      });

    const serials: any = {
      ...obj,
      title: data.title,
      body: markdownContent,
      serialized: json,
    };

    const template = {
      // state_uuid: data.state,
      serialized: serials,
      raw: markdownContent,
    };

    console.log('onSubmit[1--3]', template);

    // return;

    if (edit) {
      putAPI(`contents/${id}`, template).then((data: any) => {
        onCreate(data);
        setSaving(false);
      });
    } else {
      postAPI(`content_types/${data.ttype}/contents`, template).then(
        (data: any) => {
          if (data?.info) {
            toast.success('Build Failed', {
              duration: 1000,
              position: 'top-right',
            });
            setSaving(false);
          }

          if (data?.content?.id) {
            toast.success('Saved Successfully', {
              duration: 1000,
              position: 'top-right',
            });
            Router.push(`/content/${data.content.id}`);
            setSaving(false);
          }
        },
      );
    }
  };

  /**
   * Load content data from a doc
   * @param data
   */
  const onLoadContent = (data: any) => {
    // set master contents
    setContents(data);
    // map loaded state to corresponding form value
    const defaultState = data.state && data.state.id;
    setValue('state', defaultState);

    if (data && data.content && data.content.serialized) {
      const serialbody = data?.content?.serialized;
      const ctypeId = data?.content_type?.id;
      setValue('ttype', ctypeId);

      // middle wares
      const content_title = serialbody?.title || undefined;

      // fields and templates
      fetchContentTypeDetails(ctypeId);

      setValue('title', content_title);
      setTitle(content_title);
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

  /**
   * Load Templates for the particular content type
   * @param id
   */
  // const loadTemplates = (id: string) => {
  //   fetchAPI(`data_templates/${id}`).then((data: any) => {
  //     const res: Template[] = data.data_template;
  //     changeText(res);
  //   });
  // };

  const getSummary = () => {
    // const res =
    //   document
    //     .querySelector('.remirror-editor')
    //     ?.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5') || [];
    // console.log('remirror-editor', res);
  };

  /**
   * Watch out for changes in Content ID, and URL Paths
   */
  useEffect(() => {
    if (pathname) {
      const pathGroup = pathname.split('/');
      // validate if its a edit page
      if (pathGroup.length > 2 && pathGroup[2] === 'edit') {
        // console.log('[red]', pathGroup);
        setShowForm(false);
      }
    }
    // getSummary();
  }, [cId, pathname]);

  // syncable field
  useEffect(() => {
    if (fields) {
      const f: any = mapFields(fields);
      updateFields(f);
    }
  }, [fields]);

  /**
   * Update Document  Title
   */
  const updateTitle = () => {
    setTitle(selectedTemplate?.title_template);
    setValue('title', selectedTemplate?.title_template);
  };
  /**
   * Field update eventbus
   * @param f
   */
  const updateFields = (f: any) => {
    setFieldMap(f);
    updateTitle();
  };

  /**
   * When form errors appear
   */
  useEffect(() => {
    if (errors) {
      // items = errors.keys();
      const items = Object.keys(errors);
      items.map((i: any) => {
        // @ts-expect-error temporary solution here
        const msg: string = errors[i]['message'];
        toast.error(msg, {
          duration: 1000,
          position: 'bottom-center',
        });
      });
      // console.log('errors', errors);
    }
  }, [errors]);

  // when template selection modal is active
  useEffect(() => {
    if (activeTemplate.length < 1) {
      // setShowTemplate(true);
    }
  }, [activeTemplate]);

  /**
   * Change Title on Fields change
   * @param piece
   */
  const changeTitle = (piece: any, maps: any) => {
    if (maps) {
      // lazy matching
      const tempTitle = piece.title_template;
      const m = findVars(tempTitle, false);
      // m.map((x: any) => {
      //   const cName = cleanName(x);
      //   // console.log('🐴🐴  [changeTitle] ', cName, maps);
      // });
    }
  };

  /**
   * on select template
   * @param x
   */

  const changeText = (x: any) => {
    setShowForm(true);

    setActiveTemplate(x.id);

    // textOperation(x);

    // store template obj
    setSelectedTemplate(x);

    changeTitle(x, maps);
    updateStuff(x, maps);
  };

  /**
   * Mapping Form values to content and updating it
   * @param content
   * @param mappings
   */
  const passUpdates = async (content: any, mappings: any) => {
    // console.log('passUpdates', content);

    const updatedCont = await updateVars(content, mappings);
    // console.log('updatedCont', updatedCont);
    // console.log('updatedCont[mappings]', mappings);

    setBody(updatedCont);

    getSummary();
  };

  /**
   *
   * @param data
   * @param mapx
   * @param key
   */
  const updateStuff = (data: any, mapx: any) => {
    // console.log('updateStuff', mapx);
    // console.log('updateStuff[data]', data);
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

  const doUpdate = (state: any) => {
    console.log('[trigger][doUpdate]', state);

    const markdownContent = editorRef.current?.helpers?.getMarkdown();

    const json = editorRef.current?.helpers?.getJSON();

    if (state.md) {
      setValue('body', markdownContent);
    }

    if (state.json) {
      setValue('serialized', JSON.stringify(json));
    }
    // if (state.md) {
    //   setValue('body', state.md);
    // }

    // if (state.json) {
    //   setValue('serialized', JSON.stringify(state.json));
    // }
  };

  const getInits = (field_maps: any) => {
    const initials: IFieldField[] = [];
    field_maps &&
      field_maps.forEach((i: any) => {
        const item: IFieldField = {
          name: i.name,
          value: i.value,
          id: i?.field_type?.id,
        };
        initials.push(item);
      });
    return initials;
  };

  /**
   * Update Page Title
   * @param x
   */
  const updatePageTitle = (x: any) => {
    const tempTitle = selectedTemplate?.title_template;

    const m = replaceTitles(tempTitle, x);
    const actState = activeFlow?.states[0]?.id;

    setValue('state', actState);
    setValue('title', m);
    setTitle(m);
  };

  /**
   * When use saves variant form names
   * @param defx
   */
  const onSaved = (defx: any) => {
    const resx = getInits(defx);
    console.log('onSaved', defx);
    // console.log('onSaved[body]', resx);

    updateStuff(selectedTemplate, resx);

    updatePageTitle(resx);
    // setTrigger(EMPTY_MARKDOWN_NODE);
    // we are inserting an empty node, so that the editor is triggered
  };

  /**
   * @TODO to remove
   * @param e
   */
  const onceInserted = () => {
    setTrigger(null);
  };

  const toggleTitleEdit = () => {
    // setPageTitle(pageTitle);
    setTitleEdit(!showTitleEdit);
  };

  return (
    <>
      <RoutedDialog
        unsavedChanges={unsavedChanges}
        onConfirmLeave={() => setUnsavedChanges(false)}
      />

      <Box sx={{ p: 0 }}>
        <NavEdit
          navtitle={pageTitle || title}
          onToggleEdit={() => toggleTitleEdit()}
        />
        {/* <Button
        onClick={
          () => console.log('Check Json', editorRef.current.helpers?.getRemirrorJSON())
          // console.log('Check Json', editorRef.current?.helpers?.getJSON())
        }>
        Check Json
      </Button>
      <Button
        onClick={
          () => console.log('Check Json', editorRef.current)
          // console.log('Check Json', editorRef.current?.helpers?.getJSON())
        }>
        Check Json
      </Button>
      <Button
        onClick={() =>
          console.log('Check Json', editorRef.current?.helpers?.getJSON())
        }>
        Check all
      </Button>
      <Button
        onClick={() =>
          console.log('Check Json', editorRef.current?.helpers.getMarkdown())
        }>
        Check text
      </Button> */}
        <Box sx={{ p: 0 }}>
          <Flex>
            <Box
              as="form"
              id="content-form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                minWidth: '70%',
                maxWidth: '85ch',
                m: 0,
                bg: 'neutral.200',
              }}>
              <Box sx={{ display: showDev ? 'block' : 'none' }}>
                <FieldText
                  name="body"
                  label="Body"
                  // onChange={onChange}
                  defaultValue={''}
                  register={register}
                />
                <FieldText
                  name="serialized"
                  label="Serialized State"
                  // onChange={onChange}
                  defaultValue={''}
                  register={register}
                />
              </Box>

              <Box
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
                    <Button
                      variant="btnSecondary"
                      type="submit"
                      sx={{ fontWeight: 600 }}>
                      Save
                    </Button>
                  </Box>
                </Flex>
              </Box>

              {body && (
                <Box
                  sx={{
                    p: 0,
                    position: 'relative',
                    lineHeight: 1.5,
                    py: 3,
                    fontFamily: 'body',
                    '.remirror-editor-wrapper ': {
                      pl: '2rem',
                      pr: '2rem',
                    },
                  }}>
                  <Button
                    variant="secondary"
                    type="button"
                    sx={{ display: 'none' }}
                    onClick={() => setShowDev(!showDev)}>
                    Dev
                  </Button>
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
                      defaultValue={body}
                      editable
                      onUpdate={doUpdate}
                      tokens={[]}
                      insertable={trigger}
                      ref={editorRef}
                      onceInserted={onceInserted}
                    />
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'none' }}>
                <Field
                  name="state"
                  label="state"
                  defaultValue=""
                  register={register}
                />

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
                width: '30%',
                borderLeft: 'solid 1px',
                borderColor: 'border',
                pt: 3,
              }}>
              <Box sx={{ px: 0 }}>
                {contents && <ContentSidebar content={contents} />}
              </Box>

              <Box>
                {activeFlow && (
                  <Flex
                    sx={{
                      bg: '#d9deda57',
                      px: 3,
                    }}>
                    {activeFlow?.states.map((x: any) => (
                      <FlowStateBlock
                        key={x?.id}
                        state={x?.state}
                        order={x?.order}
                        id={x?.id}
                      />
                    ))}
                  </Flex>
                )}
                <Box variant="layout.boxHeading" sx={{}}>
                  <Box sx={{ pt: 2, pb: 3 }}>
                    <Flex sx={{ gap: 0 }}>
                      <Button
                        form="content-form"
                        type="submit"
                        variant="btnPrimary">
                        <>
                          {saving && <Spinner color="white" size={24} />}
                          {!saving && (
                            <Text sx={{ fontSize: 2, fontWeight: 600, p: 3 }}>
                              Save
                            </Text>
                          )}
                        </>
                      </Button>
                    </Flex>
                  </Box>
                </Box>
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
                              fontSize: 2,
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
                              fontSize: 1,
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
                activeTemplate={activeTemplate}
                setMaps={updateMaps}
                fields={fieldMaps}
                fieldValues={!edit && newContent?.contentFields}
                showForm={showForm}
                setShowForm={makeInsert}
                onSaved={onSaved}
                onRefresh={onSaved}
              />
              <Box>
                {/* <Box variant="layout.boxHeading">
                <Text as="h3" variant="sectionheading">
                  Flow
                </Text>
              </Box> */}

                {/* {activeFlow && (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    variant="layout.boxHeading"
                    sx={{ bg: 'teal.100', pb: 2, borderTop: 0 }}>
                    <Text as="span" sx={{ fontSize: 0, mr: 1 }}>
                      {activeFlow?.flow?.name}
                    </Text>
                    <Text as="span" variant="labelcaps">
                      ({activeFlow?.states.length})
                    </Text>
                  </Box>

                  <Box sx={{ pt: 2, px: 3, bg: 'teal.100' }}>
                    <Box>
                      <Box sx={{ px: 0, py: 1 }}>
                        {activeFlow?.states.map((x: any) => (
                          <FlowStateBlock
                            key={x?.id}
                            state={x?.state}
                            order={x?.order}
                            id={x?.id}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )} */}
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
export default ContentForm;
