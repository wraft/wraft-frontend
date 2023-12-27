import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';

import { Box, Flex, Button, Text, Spinner, Label } from 'theme-ui';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';

import Field from './Field';
import FieldText from './FieldText';
import FieldForm from './FieldForm';
import EditorWraft from './WraftEditor';
import NavEdit from './NavEdit';
import { Template, ContentState } from '../../src/utils/types';
import {
  cleanName,
  findVars,
  replaceTitles,
  updateVars,
} from '../../src/utils';

import { ErrorIcon, TickIcon } from './Icons';

import Modal from './Modal';

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

export interface IContentType {
  name: string;
  id: string;
  layout: any;
  fields: any;
  description: string;
  flow: any;
}

export interface IContent {
  id: string;
  updated_at: string;
  instance_id: string;
  serialized: any;
}

export interface ICreator {
  name: string;
  email: string;
}

export interface IField {
  creator: ICreator;
  content_type: IContentType;
}

export interface IVariantDetail {
  creator: ICreator;
  content_type: IContentType;
}

export interface IFieldItem {
  name: string;
  type: string;
}

export interface IFieldField {
  name: string;
  value: string;
  id?: string;
}

export interface IFieldType {
  name: string;
  value: string;
  type: string;
}

export interface IFieldTypeValue {
  name: string;
  id: string;
  value: string;
  type: string;
}

import { Field as FieldT, FieldInstance } from '../utils/types';
import { createEntity, loadEntity, updateEntity } from '../utils/models';
// import { isString } from 'util';
import { Input } from 'theme-ui';
import { useStoreState } from 'easy-peasy';
// import { Spinner } from 'theme-ui';
// import RichEditorWraft from './EditWraft';

export interface IContentForm {
  id: any;
  edit?: boolean;
}

export interface IFieldModel {
  name: string;
  id: string;
  field_type: any;
  value?: string;
}

export const EMPTY_MARKDOWN_NODE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

interface FlowStateBlock {
  state?: string;
  order?: number;
  id?: any;
}

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
        bg: 'green.1',
        textAlign: 'center',
        mr: 2,
      }}>
      {order}
    </Box>
    <Text variant="labelcaps" sx={{ pt: 2 }}>
      {state}
    </Text>
    {/* <Text>{id}</Text> */}
  </Flex>
);

const ALL_USERS = [
  { id: 'joe', label: 'Joe' },
  { id: 'sue', label: 'Sue' },
  { id: 'pat', label: 'Pat' },
  { id: 'tom', label: 'Tom' },
  { id: 'jim', label: 'Jim' },
];

const Form = (props: IContentForm) => {
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
  const token = useStoreState((state) => state.auth.token);

  // Content Specific
  // -------
  const [content, setContent] = useState<IVariantDetail>();
  const [templates, setTemplates] = useState<Array<Template>>([]);
  const [activeTemplate, setActiveTemplate] = useState('');

  const cId: string = router.query.id as string;
  const [def, setDef] = useState<any>(EMPTY_MARKDOWN_NODE);

  // Testing
  // -------
  // const [foelds, setFoeld] = useState<Array<IFieldModel>>([]);
  // -------

  const [fields, setField] = useState<Array<FieldT>>([]);
  const [active, setActive] = useState('');
  const [body, setBody] = useState<any>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTitleEdit, setTitleEdit] = useState<boolean>(false);

  const [activeFlow, setActiveFlow] = useState<any>(null);

  const [status, setStatus] = useState<number>(0);
  const [maps, setMaps] = useState<Array<IFieldField>>([]);

  const [insertable, setInsertable] = useState<any>();
  const [showDev, setShowDev] = useState<boolean>(false);
  const [showTemplate, setTemplate] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(false);
  const [cleanInsert, setCleanInsert] = useState<boolean>(false);
  const [raw, setRaw] = useState<any>(null);

  // const [varias, setVarias] = useState<IContentType>();
  const [fieldMaps, setFieldMap] = useState<Array<IFieldType>>();
  const { addToast } = useToasts();
  const { id, edit } = props;
  const [title, setTitle] = useState<string>('New Title');

  const [pageTitle, setPageTitle] = useState<string>('');

  // const refSubmitButtom = useRef<HTMLButtonElement>(null);

  /**
   * Toggle Title Edit
   * @param map
   */
  const toggleEdit = () => {
    setTitleEdit(!showTitleEdit);
  };

  /**
   * pass
   * @param map
   */
  const passMe = () => {
    setActive('');
    setBody('');
  };
  /**
   *
   * @param data
   */
  const updateMaps = (map: any) => {
    console.debug('🌿🎃🎃🌿 updateMaps [4]', map);

    setStatus(1);
    setMaps(map);

    passMe();

    if (raw && raw.length > 0) {
      setCleanInsert(true);
      const xr: ContentState = JSON.parse(raw);
      updateStuff(xr, maps);
    }
  };

  /**
   * Insertion Handler
   * @param data
   */
  const makeInsert = (data: any) => {
    setShowForm(data);
    if (raw && raw.length > 0) {
      setCleanInsert(true);
      const xr: ContentState = JSON.parse(raw);
      updateStuff(xr, maps);
    }
  };

  const mapFields = (fields: any, maps = null) => {
    // console.log('mapFields', fields)
    const vals = getValues();

    console.log('vals 🌿🌿🌿🌿🌿', vals, maps);

    // for all fields
    const obj: any = [];
    if (fields && fields.length > 0) {
      fields.forEach(function (value: any) {
        // console.log('field', value)
        const name = vals[`${value.name}`];
        const x: FieldInstance = { ...value, value: name };
        // console.log('x', x);
        obj.push(x);
      });
      // obj.push({ })
    }
    return obj;
  };

  /**
   * Post Submit
   * @param data
   */
  const onCreate = (data: any) => {
    if (data?.info) {
      console.log('Failed Build', data.info);
    }

    if (data?.content?.id) {
      addToast('Saved Successfully', { appearance: 'success' });
      Router.push(`/content/${data.content.id}`);
    }
  };

  /**
   * On Submit
   * @param data
   */

  const onSubmit = (data: any) => {
    // console.log('🧶 [content] Creating Content', data, '');

    const obj: any = {};

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
      updateEntity(`contents/${id}`, template, token, onCreate);
    } else {
      createEntity(
        template,
        `content_types/${data.ttype}/contents`,
        token,
        onCreate,
      );
    }
  };

  /**
   * Load Data
   * @param id
   */
  const loadData = (id: string) => {
    // console.log('🎃 refresh {', id, '}')

    if (edit) {
      loadEntity(token, `contents/${id}`, onLoadContent);
    } else {
      loadEntity(token, `content_types/${id}`, onLoadData);
      loadTemplates(id);
    }
  };

  /**
   * Load values from content meta
   */
  const getFieldValus = (body: any) => {
    // internal field names to exclude
    const commonFields = ['body', 'title', 'serialized'];
    // Extract Fields from API response
    const tFields: IFieldModel[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (!commonFields.includes(`${key}`)) {
        const sval = `${value}`;
        const fieldItem: IFieldModel = {
          id: key,
          name: key,
          value: sval,
          field_type: 'base',
        };
        tFields.push(fieldItem);
      }
    }
    return tFields;
  };

  /**
   * Load content data from a doc
   * @param data
   */
  const onLoadContent = (data: any) => {
    console.log('[🌿] [0]', data);

    const defaultState = data.state && data.state.id;
    setValue('state', defaultState);

    if (data && data.content && data.content.serialized) {
      const serialbody = data?.content?.serialized;
      const ctypeId = data?.content_type?.id;

      // middle wares
      const content_title = serialbody?.title || undefined;

      // fields and templates
      loadEntity(token, `content_types/${ctypeId}`, onLoadData);
      loadTemplates(ctypeId);

      console.log('[🌿🎃🌿🎃] [serialbody]', content_title);

      setValue('title', serialbody.title);
      setTitle(serialbody.title);
      setPageTitle(serialbody.title);

      const rawraw = serialbody.serialized;

      /**
       * Extract field data from `content.serialized`
       * 001
       */

      if (serialbody) {
        const tResult: IFieldModel[] = getFieldValus(serialbody);
        console.log('[🌿🎃🎃] [results]', tResult);
        // setField(tResult);
        // setFoeld(tResult);
      }

      if (rawraw) {
        const df = JSON.parse(rawraw);
        if (df) {
          console.log('[🌿🎃🎃] [rawraw]', df);
          setCleanInsert(true);
          setDef(df);
        }
      }
    } else {
      console.log('[🌿] [1] aara ?? entha ??? - refresh');
    }
  };

  /**
   * Cast content_type to `content`
   * @param data IField compatiable
   * */
  const onLoadData = (data: any) => {
    const res: IVariantDetail = data;
    console.log('🧶🧶🧶 🌿🌿🌿  [xx]  🎃 onLoadData', res);

    setContent(res);

    const tFields = res?.content_type?.fields;
    if (tFields) {
      setField(tFields);
      console.log('🧶🧶🧶 🌿🌿🌿 🎃 fields', tFields);
    }

    const tFlow = res?.content_type?.flow;

    // const [activeFlow, setActiveFlow] = useState<any>(null);

    setActiveFlow(tFlow);

    // if (tFields) {
    //   setField(tFields);
    //   console.log('🧶🧶🧶 🌿🌿🌿 🎃 fields', tFields);
    // }
  };

  /**
   * Load Templates for the particular content type
   * @param id
   */
  const loadTemplates = (id: string) => {
    setActiveTemplate(id);
    token &&
      loadEntity(token, `content_types/${id}/data_templates`, onLoadTemplate);
  };

  const onLoadTemplate = (data: any) => {
    const res: Template[] = data.data_templates;
    setTemplates(res);
  };

  // const setDefaultState = (content: IField) => {
  //   const defaultState =
  //     content.content_type && content.content_type.flow.states[0].id;
  //   setValue('state', defaultState);
  // };

  // const [summary, setSummary] = useState<
  //   {
  //     type: string;
  //     title: string;
  //     visibility: boolean;
  //     onClick: () => void;
  //   }[]
  // >([]);

  const getSummary = () => {
    const res =
      document
        .querySelector('.remirror-editor')
        ?.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5') || [];

    console.log('remirror-editor', res);
  };
  // setSummary(
  //   Array.from(
  //     document
  //       .querySelector('.ProseMirror')
  //       ?.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5') || [],
  //     (seção) => ({
  //       tipo: seção.tagName.toLowerCase(),
  //       título: seção.textContent,
  //       vista: scrollY + innerHeight >= seção.offsetTop,
  //       irAté: () => scrollTo({ top: seção.offsetTop - 74 }),
  //     }),
  //   ),
  // );

  useEffect(() => {
    if (token && token.length > 0) {
      console.log('🧶 [content] `token` check refresh', token);
      loadData(id);
    }
  }, [token]);

  useEffect(() => {
    // getSummary();
  }, []);
  // syncable field

  useEffect(() => {
    if (fields) {
      const f: any = mapFields(fields);
      updateFields(f);
    }
  }, [fields]);

  const updateTitle = () => {
    // console.log('🐴  [updateTitle] tm', selectedTemplate);
    setTitle(selectedTemplate?.title_template);
    setValue('title', selectedTemplate?.title_template);
  };
  /**
   * Field update eventbus
   * @param f
   */
  const updateFields = (f: any) => {
    setFieldMap(f);

    const newty = replaceTitles(selectedTemplate?.title_template, f);
    console.log('🐴🐴  [updateFields] fields', newty);
    updateTitle();
  };

  useEffect(() => {
    if (errors) {
      console.log('errors', errors);
    }
  }, [errors]);

  useEffect(() => {
    if (def) {
      console.log('🎃🎃 ue [def]', def);
    }
  }, [def]);

  useEffect(() => {
    if (activeTemplate.length < 1) {
      setTemplate(true);
    }
  }, [activeTemplate]);

  /**
   * Load Field data
   */
  // const loadFields = () => {
  //   if (content && content.content_type) {
  //     const m: FieldT[] = content.content_type.fields;
  //     console.log('🎃🎃🎃 [fields]', m);
  //     setField(m);
  //   }
  // };

  /**
   * @param x
   */
  const textOperation = (piece: any) => {
    const _dat = piece?.serialized;
    console.log('🧶 [content] [textOperation]', _dat);
    if (_dat) {
      setInsertable(_dat);
    }
  };

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

      // let namesList = [];
      // let newTitle = tempTitle;
      m.map((x: any) => {
        const cName = cleanName(x);
        // localBody = localBody.replace(`[${cleanNames}]`, m.value);
        // newTitle = tempTitle.replace(`[${cName}]`, '')
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
    setTemplate(false);

    textOperation(x);

    // store template obj
    setSelectedTemplate(x);

    console.log('changeText', x);

    changeTitle(x, maps);
    updateStuff(x, maps);
  };

  const passUpdates = (content: any, mappings: any, isClean: any) => {
    setStatus(0);
    const updatedCont = updateVars(content, mappings);
    setCleanInsert(isClean);

    console.log('[updateStuff] passUpdates ', updatedCont);
    setDef(updatedCont);
    setStatus(1);

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
        // console.log('🎃🎃🎃 [updateStuff] ????', res);
        respx = res;
      }

      const xr: any = respx;
      passUpdates(xr, mapx, true);
    }

    if (data.serialized?.data && mapx) {
      const xr: ContentState = JSON.parse(data.serialized.data);
      passUpdates(xr, mapx, true);
    }

    if (data?.type === 'doc') {
      const contentliv: ContentState = data;
      passUpdates(contentliv, mapx, false);
    }
  };

  const doUpdate = (state: any) => {
    // turn OFF appending blocks
    setCleanInsert(false);

    if (state.body) {
      // setDef(state.body)
      setValue('body', state.md);
      setValue('serialized', 'xx');
    }

    if (state.serialized) {
      setStatus(1);
      setRaw(state.serialized);
    }

    if (state.md) {
      setValue('body', state.md);
      // console.log('state 2', state.body)
      setValue('serialized', JSON.stringify(state.body));
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

  const updatePageTitle = (x: any) => {
    const tempTitle = selectedTemplate?.title_template;
    // console.log('🐴🐴 title upate', x, tempTitle);

    const m = replaceTitles(tempTitle, x);

    const actState = activeFlow?.states[0]?.id;
    console.log('🐴🐴  🧶 [activeFlow] x', activeFlow);

    setValue('state', actState);
    setValue('title', m);
    setTitle(m);
  };

  /**
   * onSaved fields
   * @param defx
   */
  const onSaved = (defx: any) => {
    const resx = getInits(defx);
    updateStuff(def, resx);
    updatePageTitle(resx);
  };

  const closeModal = () => {
    setTemplate(false);
  };

  return (
    <Box sx={{ p: 0 }}>
      <NavEdit navtitle={pageTitle || title} onToggleEdit={toggleEdit} />
      <Box sx={{ p: 0 }}>
        {/* {status && <Box sx={{ display: 'none' }} />} */}
        {insertable && status && <Box sx={{ display: 'none' }} />}

        <Flex>
          <Box
            as="form"
            id="hook-form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ minWidth: '70%', maxWidth: '85ch', m: 0 }}>
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
                bg: 'neutral.0',
                borderBottom: 'solid 1px',
                borderBottomColor: 'neutral.1',
                p: 4,
                display: showTitleEdit ? 'block' : 'block',
                flexGrow: 1,
                width: '100%',
                pl: 2,
                pt: 2,
              }}>
              <Flex
                sx={{
                  bg: 'neutral.0',
                  // position: 'absolute',
                  top: 0,
                  right: 1,
                  left: 1,
                  zIndex: 9000,
                }}>
                <Box sx={{ width: '90%', pl: 3, pt: 2, display: 'none' }}>
                  <Field
                    name="title"
                    label=""
                    placeholder="Document Name"
                    // sx={{
                    //   '&': {
                    //     width: '100%',
                    //     display: 'block',
                    //     bg: 'red',
                    //   },
                    //   div: {
                    //     width: '100%',
                    //   },
                    //   button: {
                    //     fontSize: 3,
                    //   },
                    // }}
                    // defaultValue={body?.title}
                    register={register}
                  />
                </Box>
                <Box sx={{ width: '10%', pt: 2, ml: 'auto', mr: 4 }}>
                  <Button
                    // ref={refSubmitButtom}
                    variant="btnPrimary"
                    type="submit"
                    sx={{ width: '100%', p: 0, my: 2, px: 3, py: 2, ml: 3 }}>
                    Save
                  </Button>
                </Box>
              </Flex>
            </Box>

            {!def && <Spinner />}

            {def && (
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
                <EditorWraft
                  value={active}
                  editable={true}
                  onUpdate={doUpdate}
                  starter={def}
                  cleanInsert={cleanInsert}
                  token={def}
                  searchables={ALL_USERS}
                />
                <Box
                  sx={{ pt: '10px', position: 'absolute', right: 3, top: 0 }}>
                  {body && body?.md && raw && (
                    <Box sx={{ color: 'green.4' }}>
                      <TickIcon />
                    </Box>
                  )}

                  {!raw ||
                    (!body?.md && (
                      <Box sx={{ color: 'red.4' }}>
                        <ErrorIcon />
                      </Box>
                    ))}
                </Box>
              </Box>
            )}

            {/* <Button>Publish</Button> */}
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
                    // name="edit"
                    defaultValue={id}
                    // hidden={true}
                    // ref={register({ required: true })}
                    {...register('edit', { required: true })}
                  />
                </Box>
              )}
              <Field
                name="ttype"
                label="Content Type"
                defaultValue={cId}
                register={register}
              />
            </Box>
          </Box>

          <Box
            variant="plateRightBar"
            sx={{
              bg: 'neutral.0',
              ml: 0,
              width: '30%',
              borderLeft: 'solid 1px',
              borderColor: 'neutral.1',
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
                        bg: 'green.1',
                        ml: 2,
                        color: 'green.9',
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
                <Flex sx={{ ml: 'auto' }}>
                  {/* <Button ref={refSubmitButtom} variant="btnPrimary" type="submit">Publish</Button> */}
                  {/* <Button sx={{ fontWeight: 600, mr: 2, bg: 'green.0', color: 'green.8', borderColor: 'green.4', border: 'solid 1px' }} type="submit">Send</Button> */}
                  {/* <Button ref={refSubmitButtom} sx={{ ml: 'auto', fontWeight: 600 }} type="submit">Publish</Button> */}
                </Flex>
              </Flex>
            </Box>

            <Box>
              <Box variant="layout.boxHeading">
                <Text as="h3" variant="sectionheading">
                  Content
                </Text>
              </Box>

              {/* { console.log('templates', templates)} */}

              <Box sx={{ pt: 2, px: 3, bg: '#F5F7FE' }}>
                {selectedTemplate?.id && (
                  <Box>
                    <Text as="h6" variant="labelcaps">
                      Template
                    </Text>
                    <Box sx={{ px: 0, py: 1 }}>
                      <Box
                        sx={{
                          pl: 3,
                          pt: 2,
                          pb: 2,
                          background: '#FFFFFF',
                          border: '1px solid #E9ECEF',
                        }}>
                        <Text
                          onClick={() => setTemplate(true)}
                          as="h6"
                          sx={{
                            fontSize: 1,
                            mb: 0,
                            fontWeight: 500,
                            letterSpacing: '0.2px',
                          }}>
                          {selectedTemplate?.title}
                        </Text>
                        <Text
                          as="p"
                          sx={{ fontSize: 0, fontWeight: 200, pt: 0 }}>
                          {selectedTemplate?.content_type?.prefix}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Modal isOpen={showTemplate} onClose={closeModal}>
              <Box sx={{ px: 3, py: 3 }}>
                <Box sx={{ pb: 2 }}>
                  <Text sx={{ fontSize: 2, color: 'gray.6', pb: 3, mb: 3 }}>
                    Templates
                  </Text>
                </Box>
                <Box mt={2}>
                  {templates &&
                    templates.map((n: any) => (
                      <Box
                        key={n.id}
                        sx={{
                          bg: 'neutral.0',
                          pl: 3,
                          border: 'solid 0.5px',
                          borderColor: 'neutral.1',
                          mb: 1,
                          pt: 2,
                          pb: 3,
                          pr: 3,
                          cursor: 'pointer',
                          width: '100%',
                          ':hover': {
                            bg: 'neutral.1',
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
                  {errors.exampleRequired && (
                    <Text>This field is required</Text>
                  )}
                </Box>
              </Box>
            </Modal>

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

              {/* { console.log('templates', templates)} */}

              {activeFlow && (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    variant="layout.boxHeading"
                    sx={{ bg: 'teal.0', pb: 2, borderTop: 0 }}>
                    <Text as="span" sx={{ fontSize: 0, mr: 1 }}>
                      {activeFlow?.flow?.name}
                    </Text>
                    <Text as="span" variant="labelcaps">
                      ({activeFlow?.states.length})
                    </Text>
                  </Box>

                  <Box sx={{ pt: 2, px: 3, bg: 'teal.0' }}>
                    <Box>
                      <Box sx={{ px: 0, py: 1 }}>
                        {activeFlow?.states.map((x: any) => (
                          <>
                            <FlowStateBlock
                              state={x?.state}
                              order={x?.order}
                              id={x?.id}
                            />
                          </>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* <Box sx={{ bg: 'neutral.0', p: 3 }}>
                    <Button
                      variant="btnPrimary"
                      form="hook-form"
                      sx={{
                        fontWeight: 600,
                        mr: 2,
                      }}
                      type="submit">
                      Publish
                    </Button>
                  </Box> */}
                </Box>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
