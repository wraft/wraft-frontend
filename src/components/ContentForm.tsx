import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from 'rebass';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Router, { useRouter } from 'next/router';

import Field from './Field';
import FieldText from './FieldText';
import FieldForm from './FieldForm';

import EditorWraft from './EditorWraft';

// import { replaceVars } from '../../src/utils';
import { Template, ContentState } from '../../src/utils/types';
import { replaceTitles, getInits, updateVars } from '../../src/utils';

import { useToasts } from 'react-toast-notifications';

const Block = styled(Box)`
  padding-bottom: 8px;
  border: solid 1px #ddd;
  margin-bottom: 8px;
  padding-left: 16px;
  padding-top: 12px;
`;

const Sidebar = styled(Box)`
  background-color: #fff;
  border-left: solid 1px #dddddd59;
  position: absolute;
  top: 69px;
  right: 0;
  width: 340px;
  min-height: 100vh;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  padding-right: 24px;
`;

export const EMPTY_MARKDOWN_NODE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Write here',
        },
      ],
    },
  ],
};

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

export interface IFieldItem {
  name: string;
  type: string;
}

export interface IFieldField {
  name: string;
  value: string;
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
import { Input } from '@rebass/forms';
import { useStoreState } from 'easy-peasy';

export interface IContentForm {
  id: any;
  edit?: boolean;
}

const Form = (props: IContentForm) => {
  // var subtitle: any;
  const { register, getValues, handleSubmit, errors, setValue } = useForm();
  const token = useStoreState(state => state.auth.token);
  // const dispatch = useDispatch();
  const [content, setContent] = useState<IField>();
  const [templates, setTemplates] = useState<Array<Template>>([]);
  const [activeTemplate, setActiveTemplate] = useState('');
  const [fields, setField] = useState<Array<FieldT>>([]);
  const [active, setActive] = useState('');
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [maps, setMaps] = useState<Array<IFieldField>>([]);
  const router = useRouter();
  const cId: string = router.query.id as string;
  const [def, setDef] = useState<any>();
  const [insertable, setInsertable] = useState<any>();
  const [cleanInsert, setCleanInsert] = useState<Boolean>(false);
  const [raw, setRaw] = useState<any>();

  const [field_maps, setFieldMap] = useState<Array<IFieldType>>();
  const { addToast } = useToasts();
  const { id, edit } = props;

  const mapFields = (fields: any) => {
    // console.log('mapFields', fields)
    const vals = getValues();
    // for all fields
    let obj: any = [];
    if (fields && fields.length > 0) {
      fields.forEach(function(value: any) {
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
    if(data?.info) {
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
    console.log('Creating Content', data, '');

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
    if (edit) {
      loadEntity(token, `contents/${id}`, onLoadContent);
    } else {
      loadEntity(token, `content_types/${id}`, onLoadData);
      loadTemplates(id);
    }
  };

  const onLoadContent = (data: any) => {
    // console.log('its details eidt', data);

    const defaultState = data.state && data.state.id;
    setValue('state', defaultState);

    if (data && data.content && data.content.serialized) {
      setValue('title', data.content.serialized.title);
      const rawraw = data.content.serialized.serialized;
      if (rawraw) {
        const df = JSON.parse(rawraw);
        if (df) {
          setDef(df);
        }
      } else {
        setDef(EMPTY_MARKDOWN_NODE);
      }
    } else {
      setDef(EMPTY_MARKDOWN_NODE);
    }
  };

  const onLoadData = (data: any) => {
    const res: IField = data;
    setContent(res);
    setDefaultState(res);

    setDef(EMPTY_MARKDOWN_NODE);
  };

  /**
   * Load Templates for the particular content type
   * @param id
   */
  const loadTemplates = (id: string) => {
    setActiveTemplate(id);

    const tok = token ? token : false;
    loadEntity(tok, `content_types/${id}/data_templates`, onLoadTemplate);
  };

  const onLoadTemplate = (data: any) => {
    const res: Template[] = data.data_templates;
    setTemplates(res);
  };

  const setDefaultState = (content: IField) => {
    const defaultState =
      content.content_type && content.content_type.flow.states[0].id;
    setValue('state', defaultState);
  };

  useEffect(() => {
    if (token && token.length > 0) {
      loadData(id);
    }
  }, [token]);

  useEffect(() => {
    content && loadFields();
  }, [content]);

  useEffect(() => {
    if (raw) {
      // setCleanInsert(true);
      // const xr: ContentState = JSON.parse(raw);
      // const inst = updateVars(xr, maps);
      // setInsertable(inst);
      // set
    }
  }, [raw, maps]);

  useEffect(() => {
    const f: any = mapFields(fields);
    // console.log('f', f, fields);
    setFieldMap(f);
  }, [fields]);

  // useEffect(() => {
  //   // get active serialized

  //   // console.log('Vars updated', maps)
  //   // // const f: any = mapFields(fields);
  //   // // // console.log('f', f, fields);
  //   // // setFieldMap(f);
  // }, [maps]);

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  // useEffect(() => {
  //   if (maps.length > 0) {
  //     const m = replaceVars(active, maps, true);
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
      // console.log('fields', m)
      setField(m);
    }
  };

  /**
   * on select template
   * @param x
   */

  const changeText = (x: any) => {
    setShowForm(!showForm);
    // if its serialized
    if (x.serialized && x.serialized.data) {
      setCleanInsert(true);
      const xr: ContentState = JSON.parse(x.serialized.data);
      const inst = updateVars(xr, field_maps);
      console.log('inst', inst);

      setInsertable(inst);
    }

    setActiveTemplate(x.id);

    console.log('field_Maps', field_maps);
    const newerTitle = getInits(field_maps);
    const newTitle = replaceTitles(x.title_template, newerTitle);
    console.log('field_Maps', newTitle);
  };

  const doUpdate = (state: any) => {
    // turn OFF appending blocks
    setCleanInsert(false);

    console.log('doUpdate', state);

    // if (state && state.content) {
    //   setValue('body', state.content);
    // }

    if (state.serialized) {
      setRaw(state.serialized);
      //   setValue('serialized', state.serialized);
    }

    if (state.md) {
      setValue('body', state.md);
      setValue('serialized', state.serialized);
    }

    // if (state && isString(state)) {
    //   setValue('body', state);
    // }
  };

  return (
    <Box width={1}>
      {edit && <Text>Edit {id}</Text>}
      <Box>
        <Text mb={3} fontSize={2} fontWeight={500}>
          <Box>
            {content && content.content_type && (
              <Box>
                <Text fontSize={2}>
                  {'Create ' + content.content_type.name}
                </Text>
                <Text
                  pt={2}
                  fontSize={0}
                  sx={{ color: '#777', textTransform: 'uppercase' }}>
                  {content.content_type.layout.name}
                </Text>
              </Box>
            )}
          </Box>
        </Text>
      </Box>
      <Box mx={0} mb={3} width={8 / 12}>
        <Flex>
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            py={3}
            mt={4}
            width={1}>
            <Field
              name="title"
              label="Title"
              defaultValue=""
              register={register}
            />
            <Box sx={{ display: 'none' }}>
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
            {def && (
              <EditorWraft
                value={active}
                editable={true}
                onUpdate={doUpdate}
                initialValue={def}
                editor="wysiwyg"
                cleanInsert={cleanInsert}
                insertable={insertable}
              />
            )}
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
            <Button type="submit" ml={2}>
              Create
            </Button>
          </Box>
          <Sidebar width={4 / 12} pl={5}>
            <Text mb={4} mt={0} variant="caps">
              Select a template for quick start
            </Text>
            <Box width={7 / 12}>
              {templates &&
                templates.map((n: any) => (
                  <Block key={n.id} onClick={() => changeText(n)}>
                    <Text fontSize={0} fontWeight={600} mb={1}>
                      {n.title}
                    </Text>
                  </Block>
                ))}
              {errors.exampleRequired && <Text>This field is required</Text>}
            </Box>
            <FieldForm
              activeTemplate={activeTemplate}
              maps={maps}
              field_maps={field_maps}
              setMaps={setMaps}
              fields={fields}
              setFieldMap={setFieldMap}
              templates={templates}
              setActive={setActive}
              showForm={showForm}
              setShowForm={setShowForm}
              setValue={setValue}
            />
          </Sidebar>
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
