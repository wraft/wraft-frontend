import React, { useEffect, useState, useRef } from 'react';
import Router, { useRouter } from 'next/router';

import { Box, Flex, Button, Text } from 'theme-ui';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';

import Field from './Field';
import FieldText from './FieldText';
import FieldForm from './FieldForm';
import EditorWraft from './WraftEditor';
import NavEdit from './NavEdit';
import { Template, ContentState } from '../../src/utils/types';
import { updateVars } from '../../src/utils';

import { ErrorIcon, TickIcon } from './Icons';

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

const Form = (props: IContentForm) => {
  // var subtitle: any;
  const { register, getValues, handleSubmit, errors, setValue } = useForm();
  const token = useStoreState((state) => state.auth.token);
  // const dispatch = useDispatch();
  const [content, setContent] = useState<IVariantDetail>();
  const [templates, setTemplates] = useState<Array<Template>>([]);
  const [activeTemplate, setActiveTemplate] = useState('');
  /* Foeld is a Field */
  const [foelds, setFoeld] = useState<Array<IFieldModel>>([]);
  /* ----- */

  const [fields, setField] = useState<Array<FieldT>>([]);
  const [active, setActive] = useState('');
  const [body, setBody] = useState<any>();
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [showTitleEdit, setTitleEdit] = useState<Boolean>(false);
  const [status, setStatus] = useState<number>(0);
  const [maps, setMaps] = useState<Array<IFieldField>>([]);
  const router = useRouter();
  const cId: string = router.query.id as string;
  const [def, setDef] = useState<any>(EMPTY_MARKDOWN_NODE);
  const [insertable, setInsertable] = useState<any>();
  const [showDev, setShowDev] = useState<boolean>(false);
  const [cleanInsert, setCleanInsert] = useState<boolean>(false);
  const [raw, setRaw] = useState<any>(null);

  const [varias, setVarias] = useState<IContentType>();
  const [fieldMaps, setFieldMap] = useState<Array<IFieldType>>();
  const { addToast } = useToasts();
  const { id, edit } = props;
  const [title, setTitle] = useState<string>('New Title');

  const refSubmitButtom = useRef<HTMLButtonElement>(null);

  /**
   * Toggle Title Edit
   * @param map
   */
  const toggleEdit = () => {
    setTitleEdit(!showTitleEdit);
  };
  /**
   *
   * @param data
   */
  const updateMaps = (map: any) => {
    console.debug('🌿🎃🎃🌿 updateMaps [4]', map);

    setStatus(1);
    setMaps(map);

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

  /**
   * Insertion Handler
   * @param data
   */
  const makeInsertMox = (data: any, raw: any) => {
    setShowForm(data);

    console.log('KIXL', data, raw);
    // if (raw && raw.length > 0) {
    //   setCleanInsert(true);
    //   const xr: ContentState = JSON.parse(raw);
    //   updateStuff(xr, maps);
    // }
  };

  const mapFields = (fields: any, maps = null) => {
    // console.log('mapFields', fields)
    const vals = getValues();

    console.log('vals 🌿🌿🌿🌿🌿', vals, maps)

    // if(maps) {

    // }

    // for all fields
    let obj: any = [];
    if (fields && fields.length > 0) {
      fields.forEach(function (value: any) {
        // console.log('field', value)
        const name = vals[`${value.name}`];
        let x: FieldInstance = { ...value, value: name };
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
    console.log('🧶 [content] Creating Content', data, '');

    let obj: any = {};

    maps &&
      maps.forEach((f: any) => {
        obj[f.name] = f.value;
      });

    let serials: any = {
      ...obj,
      title: data.title,
      body: data.body,
      serialized: data.serialized,
    };

    const template = {
      state_uuid: data.state,
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
        const sval: string = `${value}`;
        const fieldItem: IFieldModel = { id: key, name: key, value: sval, field_type: 'base' };
        tFields.push(fieldItem);
      }
    }
    return tFields;
  }

  /**
   * Load content data from a doc
   * @param data 
   */
  const onLoadContent = (data: any) => {
    console.log('[🌿] [0]', data);

    const defaultState = data.state && data.state.id;
    setValue('state', defaultState);

    if (data && data.content && data.content.serialized) {

      const serialbody = data?.content?.serialized
      const ctypeId = data?.content_type?.id;

      // fields and templates
      loadEntity(token, `content_types/${ctypeId}`, onLoadData);
      loadTemplates(ctypeId);

      setValue('title', serialbody.title);
      setTitle(serialbody.title);
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
      console.log('[🌿] [1] aara ?? entha ??? - refresh')
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

    const tFields = res?.content_type?.fields
    if (tFields) {
      setField(tFields);
      console.log('🧶🧶🧶 🌿🌿🌿 🎃 fields', tFields);
    }
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

  useEffect(() => {
    if (token && token.length > 0) {
      console.log('🧶 [content] `token` check refresh', token);
      loadData(id);
    }
  }, [token]);

  // useEffect(() => {
  //   if (token && token.length > 0) {
  //     console.log(`🎃 loading for refresh -> ${id} = `, token);
  //     loadData(id);
  //   } else {
  //     console.log(`🎃 NO TOKEN refresh -> ${id};`);
  //   }

  // }, []);

  useEffect(() => {

    if (body) {
      console.log('🧶 [content] body check', body);
    }
  }, [body]);


  useEffect(() => {
    if (content) {
      console.log('🌿🌿🌿 🧶 [content] content check', content, fields);
    }
  }, [content, fields]);


  // syncable field

  useEffect(() => {
    if (fields) {
      const f: any = mapFields(fields);
      updateFields(f);
    }
  }, [fields]);


  /**
   * Field update eventbus
   * @param f 
   */
  const updateFields = (f: any) => {
    console.log('🧶 [updateFields] fields', fields, f);
    setFieldMap(f);
  }

  // useEffect(() => {
  //   console.log('🧶 [content] insertable, status, maps', insertable, status, maps);
  //   if (insertable) {
  //     if (maps.length > 0) {
  //       console.log('Doing a clean insert now', insertable, maps);
  //       updateStuff(insertable, maps, `insertable, status, maps, ${status}`);
  //     }
  //   }
  // }, [insertable, status, maps]);

  // useEffect(() => {
  //   if(maps && status === 1 && raw?.length > 0 ) {
  //     setCleanInsert(true);
  //     const xr: ContentState = JSON.parse(raw);
  //     updateStuff(xr, maps)
  //   }
  // }, [maps, status, body]);

  useEffect(() => {
    if (errors) {
      console.log('errors', errors);
    }
  }, [errors]);


  useEffect(() => {
    if (def) {
      console.log('🎃🎃 ue [def]', def)
    }
  }, [def]);



  // useEffect(() => {
  //   if (maps.length > 0) {
  //     const m = updateVars(active, maps);
  //     console.log('m', m);
  //   }
  // }, [maps]);

  /**
   * Load data if edit is loaded
   */

  /**
   * Load Field data
   */
  const loadFields = () => {
    if (content && content.content_type) {
      const m: FieldT[] = content.content_type.fields;
      console.log('🎃🎃🎃 [fields]', m)
      setField(m);
    }
  };

  // const findVarEx = (body: string, escaped: boolean): string[] => {
  //   // find vars in this form
  //   let regexp = /\[\w+\]/gm;
  //   if (escaped) {
  //     regexp = /\\\[\w+\\\]/gm;
  //   }

  //   let m;
  //   let results: string[] = [];

  //   while ((m = regexp.exec(body)) !== null) {
  //     // This is necessary to avoid infinite loops with zero-width matches
  //     if (m.index === regexp.lastIndex) {
  //       regexp.lastIndex++;
  //     }

  //     // The result can be accessed through the `m`-variable.
  //     m.forEach((match) => {
  //       results.push(match);
  //     });
  //   }
  //   // console.log('results', results);
  //   return results;
  // };

  /**
   * @param x
   */
  const textOperation = (piece: any) => {
    const _dat = piece?.serialized;

    console.log('🧶 [content] [textOperation]', _dat);

    // const df = JSON.parse(_dat);
    if (_dat) {
      setInsertable(_dat);
    }
  };

  /**
   * on select template
   * @param x
   */

  const changeText = (x: any) => {
    setShowForm(!showForm);
    setActiveTemplate(x.id);

    textOperation(x);

    updateStuff(x, maps);
  };

  /**
   *
   * @param data
   * @param mapx
   * @param key
   */
  const updateStuff = (data: any, mapx: any, _key?: any) => {
    console.log('🎃🎃🎃 🧶 [content] [updateStuff] ', data, mapx);

    console.log('🎃🎃🎃 [updateStuff]', data);

    if (data?.data) {

      let respx = '';

      if (data?.serialized?.type === "doc") {
        console.log('🎃🎃🎃 [updateStuff] XoXo', data?.serialized);
        respx = data?.serialized;
      } else {

        const res = JSON.parse(data?.serialized?.data);
        console.log('🎃🎃🎃 [updateStuff] ????', res);
        respx = res
      }

      console.log('[updateStuff] B ', respx)

      setCleanInsert(true);
      const xr: ContentState = respx;
      const inst = updateVars(xr, mapx);
      console.log('[updateStuff] C ', inst)

      setDef(inst);

      setStatus(1);
    }


    if (data.serialized?.data && mapx) {
      setCleanInsert(true);
      const xr: ContentState = JSON.parse(data.serialized.data);
      const inst = updateVars(xr, mapx);
      console.log('insta', inst);
      setInsertable(inst);
      setStatus(1);
    }

    if (data?.type === 'doc') {
      console.log('insta vidm?');
      setCleanInsert(true);
      const xr: ContentState = data;
      const inst = updateVars(xr, mapx);
      setInsertable(inst);
      setStatus(1);
    }
  };

  const doUpdate = (state: any) => {
    // turn OFF appending blocks
    setCleanInsert(false);

    console.log('🎃 doUpdate', state);

    console.log('🔥', state);
    setValue('state', '07f46fd5-8574-47bc-80d8-c4717c2a6ba7');

    if (state.body) {
      // setDef(state.body)
      setValue('body', state.md);
      setValue('serialized', "xx");
    }

    if (state.serialized) {
      setStatus(1);
      setRaw(state.serialized);
    }

    if (state.md) {
      setValue('body', state.md);
      console.log('state 2', state.body)
      setValue('serialized', JSON.stringify(state.body));
    }
  };

  const getInits = (field_maps: any) => {
    let initials: IFieldField[] = [];
    field_maps &&
      field_maps.forEach((i: any) => {
        const item: IFieldField = { name: i.name, value: i.value, id: i?.field_type?.id };
        initials.push(item);
      });
    return initials;
  };

  const onSaved = (defx: any) => {    
    const resx = getInits(defx);


    console.log('🌿🎃🎃🌿 onSaved [4.0]', defx, def, fields, resx)
  }

  return (
    <Box sx={{ p: 0 }}>
      <NavEdit navtitle={title} onToggleEdit={toggleEdit} />
      <Box sx={{ p: 4 }}>
        <Flex>
          <Box
            as="form"
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
              sx={{ display: showTitleEdit ? 'block' : 'none', flexGrow: 1, width: '100%', pl: 2, pt: 2 }}>
              <Field
                name="title"
                label=""
                defaultValue={body?.title}
                register={register}
              />
              <Button type="button" ref={refSubmitButtom} variant="btnPrimary" type="submit">Publish</Button>
            </Box>

            {!def && (
              <h1>Content Loading ..</h1>
            )}
            {def && (
              <Box
                sx={{
                  pl: 0,
                  bg: 'gray.0',
                  position: 'relative',
                  lineHeight: 1.5,
                  // fontFamily: 'courier',
                }}>
                <Button variant="secondary" type="button" onClick={() => setShowDev(!showDev)}>Dev</Button>
                <EditorWraft
                  value={active}
                  editable={true}
                  onUpdate={doUpdate}
                  starter={def}
                  cleanInsert={cleanInsert}
                  token={def}
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

            <Button>Publish</Button>
            <Box sx={{ display: 'none' }}>
              <Field
                name="state"
                label="state"
                defaultValue=""
                register={register}
              />
              {id && (
                <Input
                  id="edit"
                  name="edit"
                  defaultValue={id}
                  hidden={true}
                  ref={register({ required: true })}
                />
              )}
              <Field
                name="ttype"
                label="Content Type"
                defaultValue={cId}
                register={register}
              />

            </Box>
          </Box>
          <Box variant="plateRightBar" sx={{ ml: 4, width: '30%' }}>
            <Flex sx={{ mb: 4 }}>
              <Button type="submit">Publish</Button>
            </Flex>
            <Text sx={{ fontSize: 1, color: 'gray.6', pb: 3, mb: 3 }}>
              Templates for <Text as="span" sx={{ borderBottom: 'solid 1px red', color: 'gray.9', display: 'block', fontSize: 1, fontWeight: 'body'}}>Replace</Text>
            </Text>
            <Box mt={2}>
              {templates &&
                templates.map((n: any) => (
                  <Box
                    key={n.id}
                    sx={{
                      bg: 'gray.0',
                      pl: 3,
                      border: 'solid 0.5px',
                      borderColor: 'gray.2',
                      mb: 1,
                      pt: 2,
                      pb: 3,
                      pr: 3,
                      width: '100%',
                    }}
                    onClick={() => changeText(n)}>
                    <Text as="h6" sx={{ fontSize: 1, mb: 0, fontWeight: 600 }}>
                      {n.title}
                    </Text>
                    <Text as="p" sx={{ fontSize: 0, fontWeight: 200, pt: 0 }}>
                      Description
                    </Text>
                  </Box>
                ))}
              {errors.exampleRequired && <Text>This field is required</Text>}
            </Box>

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
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
