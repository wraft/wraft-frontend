import React, { useEffect, useState } from 'react';

import { Drawer } from '@wraft-ui/Drawer';
import { usePathname } from 'next/navigation';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RemirrorJSON } from 'remirror';
import { Box, Flex, Button, Text, Spinner, Label, Input } from 'theme-ui';

import {
  cleanName,
  findVars,
  replaceTitles,
  updateVars,
} from '../../src/utils';
import { Template, ContentState } from '../../src/utils/types';
import { postAPI, fetchAPI, putAPI } from '../utils/models';
import { Field as FieldT, FieldInstance } from '../utils/types';
import {
  IContentForm,
  IFieldField,
  IFieldType,
  IVariantDetail,
  EMPTY_MARKDOWN_NODE,
  FlowStateBlock,
} from '../utils/types/content';

import Editor from './common/Editor';
import Field from './Field';
import FieldForm from './FieldForm';
import FieldText from './FieldText';
import NavEdit from './NavEdit';

/**
 * Atom Component to show Flow State
 * @TODO move to atoms or ui
 * @param param0
 * @returns
 */
const FlowStateBlock = ({ state, order }: FlowStateBlock) => (
  <Flex
    sx={{ borderTop: 'solid 1px #eee', borderBottom: 'solid 1px #eee', pb: 2 }}>
    <Box
      sx={{
        mt: 2,
        fontSize: 0,
        width: '20px',
        height: '20px',
        borderRadius: '9rem',
        bg: 'gray.200',
        textAlign: 'center',
        mr: 2,
      }}>
      {order}
    </Box>
    <Text variant="labelcaps" sx={{ pt: 2 }}>
      {state}
    </Text>
  </Flex>
);

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

  // Content Specific
  // -------
  const [content, setContent] = useState<IVariantDetail>();
  const [templates, setTemplates] = useState<Array<Template>>([]);
  const [activeTemplate, setActiveTemplate] = useState('');

  const cId: string = router.query.id as string;
  const pathname = usePathname();

  const [body, setBody] = useState<RemirrorJSON>(EMPTY_MARKDOWN_NODE);

  const [fields, setField] = useState<Array<FieldT>>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTitleEdit, setTitleEdit] = useState<boolean>(false);

  const [activeFlow, setActiveFlow] = useState<any>(null);
  const [maps, setMaps] = useState<Array<IFieldField>>([]);
  const [showDev, setShowDev] = useState<boolean>(false);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(false);
  const [fieldMaps, setFieldMap] = useState<Array<IFieldType>>();
  const { id, edit } = props;
  const [title, setTitle] = useState<string>('New Title');

  const [pageTitle, setPageTitle] = useState<string>('');

  // triggers
  const [trigger, setTrigger] = useState<any>(null);

  /**
   * Toggle Title Edit
   * @param map
   */
  const toggleEdit = () => {
    console.log('hi');
    setTitleEdit(!showTitleEdit);
    setShowTemplate(!showTemplate);
  };
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

    // for all fields
    const obj: any = [];
    if (fields && fields.length > 0) {
      fields.forEach(function (value: any) {
        const name = vals[`${value.name}`];
        const x: FieldInstance = { ...value, value: name };
        obj.push(x);
      });
    }
    return obj;
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

    console.log('data', data);

    maps &&
      maps.forEach((f: any) => {
        obj[f.name] = f.value;
      });

    const serials: any = {
      ...obj,
      title: data.title,
      body: data.body,
      serialized: data.serialized,
    };

    const template = {
      // state_uuid: data.state,
      serialized: serials,
      raw: data.body,
    };

    if (edit) {
      putAPI(`contents/${id}`, template).then((data: any) => {
        onCreate(data);
      });
    } else {
      postAPI(`content_types/${data.ttype}/contents`, template).then(
        (data: any) => {
          if (data?.info) {
            toast.success('Build Failed', {
              duration: 1000,
              position: 'top-right',
            });
          }

          if (data?.content?.id) {
            toast.success('Saved Successfully', {
              duration: 1000,
              position: 'top-right',
            });
            Router.push(`/content/${data.content.id}`);
          }
        },
      );
    }
  };

  /**
   * Load Data
   * @param id
   */
  const loadData = (id: string) => {
    if (edit) {
      fetchAPI(`contents/${id}`).then((data: any) => {
        onLoadContent(data);
      });
    } else {
      fetchAPI(`content_types/${id}`).then((data: any) => {
        onLoadData(data);
      });
      loadTemplates(id);
    }
  };

  /**
   * Load content data from a doc
   * @param data
   */
  const onLoadContent = (data: any) => {
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
      fetchAPI(`content_types/${ctypeId}`).then((data: any) => {
        onLoadData(data);
      });
      // load all templates for the content type
      loadTemplates(ctypeId);

      // map loaded content to states
      console.log('title', serialbody.title);
      setValue('title', serialbody.title);
      setTitle(serialbody.title);
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
   * Cast content_type to `content`
   * @param data IField compatiable
   * */
  const onLoadData = (data: any) => {
    const res: IVariantDetail = data;
    setContent(res);

    const tFields = res?.content_type?.fields;
    if (tFields) {
      setField(tFields);
    }
    const tFlow = res?.content_type?.flow;
    setActiveFlow(tFlow);
  };

  /**
   * Load Templates for the particular content type
   * @param id
   */
  const loadTemplates = (id: string) => {
    setActiveTemplate(id);
    fetchAPI(`content_types/${id}/data_templates`).then((data: any) => {
      const res: Template[] = data.data_templates;
      setTemplates(res);
    });
  };

  const getSummary = () => {
    // const res =
    //   document
    //     .querySelector('.remirror-editor')
    //     ?.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5') || [];
    // console.log('remirror-editor', res);
  };

  /**
   * Load date on dom ready
   */
  useEffect(() => {
    loadData(id);
  }, []);

  /**
   * Watch out for changes in Content ID, and URL Paths
   */
  useEffect(() => {
    if (pathname) {
      const pathGroup = pathname.split('/');
      // validate if its a edit page
      if (pathGroup.length > 2 && pathGroup[2] === 'edit') {
        console.log('[red]', pathGroup);
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
      setShowTemplate(true);
    }
  }, [activeTemplate]);

  /**
   * Change Title on Fields change
   * @param piece
   */
  const changeTitle = (piece: any, maps: any) => {
    console.log('🐴🐴  [maps] ', maps);
    if (maps) {
      // lazy matching
      const tempTitle = piece.title_template;
      const m = findVars(tempTitle, false);
      m.map((x: any) => {
        const cName = cleanName(x);
        console.log('🐴🐴  [changeTitle] ', cName, maps);
      });
    }
  };

  /**
   * on select template
   * @param x
   */

  const changeText = (x: any) => {
    setShowForm(true);

    setActiveTemplate(x.id);
    setShowTemplate(false);

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
  const passUpdates = (content: any, mappings: any) => {
    const updatedCont = updateVars(content, mappings);
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

    if (data.serialized?.data && mapx) {
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
    console.log('[doUpdate]', state);

    if (state.md) {
      setValue('body', state.md);
    }

    if (state.json) {
      setValue('serialized', JSON.stringify(state.json));
    }
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
    updateStuff(body, resx);
    updatePageTitle(resx);
    // we are inserting an empty node, so that the editor is triggered
    setTrigger(EMPTY_MARKDOWN_NODE);
  };

  const closeModal = () => {
    setShowTemplate(false);
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
    <Box sx={{ p: 0 }}>
      <NavEdit
        navtitle={pageTitle || title}
        onToggleEdit={() => toggleTitleEdit()}
      />
      <Box sx={{ p: 0 }}>
        <Flex>
          <Box
            as="form"
            id="hook-form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ minWidth: '70%', maxWidth: '85ch', m: 0, bg: 'neutral.200' }}>
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
                <Box sx={{ width: '90%', pl: 3, pt: 2 }}>
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
                    // ref={refSubmitButtom}
                    variant="btnPrimary"
                    type="submit"
                    sx={{
                      width: '100%',
                      p: 0,
                      my: 2,
                      px: 3,
                      py: 2,
                      ml: 3,
                      mt: 0,
                    }}>
                    Save
                  </Button>
                </Box>
              </Flex>
            </Box>

            {!body && <Spinner />}

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
                    // pl: '9rem !important',
                    // pr: '9rem !important',
                    // pt: '7rem !important',
                    '.remirror-theme .ProseMirror': {
                      pl: '9rem !important',
                      pr: '9rem !important',
                      pt: '7rem !important',
                    },
                  }}>
                  <Editor
                    defaultValue={body}
                    editable
                    onUpdate={doUpdate}
                    tokens={[]}
                    insertable={trigger}
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
            <Box sx={{ px: 3 }}>
              <Flex sx={{ mb: 3 }}>
                {content && <Box sx={{ display: 'none' }} />}
                <Box sx={{ mr: 3 }}>
                  <Text as="h6" variant="labelcaps">
                    Version
                  </Text>
                  <Flex>
                    <Text
                      as="h3"
                      sx={{
                        fontWeight: 'heading',
                        fontSize: '16px',
                        lineHeight: '24px',
                      }}>
                      v1.0
                    </Text>
                    <Text
                      as="h6"
                      sx={{
                        fontWeight: 500,
                        bg: 'gray.200',
                        ml: 2,
                        color: 'green.1000',
                        px: 1,
                        py: 1,
                        borderRadius: '3px',
                        letterSpacing: '0.2px',
                        textTransform: 'uppercase',
                        fontSize: '10.24px',
                      }}>
                      Draft
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>

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
                          onClick={() => setShowTemplate(true)}
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
            <Drawer open={showTemplate} setOpen={closeModal}>
              <Box sx={{ px: 3, py: 3 }}>
                <Box sx={{ pb: 2 }}>
                  <Text sx={{ fontSize: 2, color: 'gray.700', pb: 3, mb: 3 }}>
                    Templates
                  </Text>
                </Box>
                <Box mt={2}>
                  {templates &&
                    templates.map((n: any) => (
                      <Box
                        key={n.id}
                        sx={{
                          bg: 'neutral.100',
                          pl: 3,
                          border: 'solid 0.5px',
                          borderColor: 'border',
                          mb: 1,
                          pt: 2,
                          pb: 3,
                          pr: 3,
                          cursor: 'pointer',
                          width: '100%',
                          ':hover': {
                            bg: 'neutral.200',
                          },
                        }}
                        onClick={() => changeText(n)}>
                        <Text
                          as="h6"
                          sx={{ fontSize: 2, mb: 0, fontWeight: 600 }}>
                          {n.title}
                        </Text>
                      </Box>
                    ))}
                </Box>
              </Box>
            </Drawer>

            <FieldForm
              activeTemplate={activeTemplate}
              setMaps={updateMaps}
              fields={fieldMaps}
              templates={templates}
              showForm={showForm}
              setShowForm={makeInsert}
              onSaved={onSaved}
              onRefresh={onSaved}
            />

            <Box>
              <Box variant="layout.boxHeading">
                <Text as="h3" variant="sectionheading">
                  Flow
                </Text>
              </Box>

              {activeFlow && (
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
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
export default ContentForm;
