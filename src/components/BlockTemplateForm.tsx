import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text, Spinner } from 'theme-ui';

import { useForm } from 'react-hook-form';

import Field from './Field';
import FieldText from './FieldText';
import { BlockTemplates } from '../utils/types';
// import styled from 'styled-components';
import EditorWraft from './EditorWraft';
import {
  API_HOST,
  createEntity,
  deleteEntity,
  loadEntityDetail,
  updateEntity,
} from '../utils/models';
import Router, { useRouter } from 'next/router';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';

import ImagesList from './ImagesList';

// const Tag = styled(Box)`
//   padding: 5px;
//   color: #444;
//   border-radius: 3px;
//   margin-bottom: 8px;
//   padding-left: 16px;
//   padding-top: 8px;
//   padding-bottom: 8px;
//   background-color: #d7f7e2;
//   max-width: 60%;
//   font-family: monospace;
//   font-weight: bold;
//   color: #3d5039;
// `;

// interface IFormTemplate {
//   name?: string;
//   serialized?: any;
// }

// const dummyFormTemplate: IFormTemplate = {};

const EMPTY_MARKDOWN_NODE = {
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

const Form = () => {
  const token = useStoreState((state) => state.auth.token);
  const { register, handleSubmit, errors, setValue } = useForm();
  // const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  // const [varias, setVarias] = useState<IContentType>();
  const [dataTemplate, setDataTemplate] = useState<BlockTemplates>();
  // const [body, setBody] = useState('');
  // const [formData, setFormData] = useState<IFormTemplate>(dummyFormTemplate);
  // const [keys, setKeys] = useState<Array<string>>();
  // const [raw, setRaw] = useState<any>();
  const [def, setDef] = useState<any>();

  const [insertable, setInsertable] = useState<any>();
  const [status, setStatus] = useState<number>(0);
  // const [loaded, setLoaded] = useState<boolean>(false);
  const [cleanInsert, setCleanInsert] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [saved, setSaved] = useState<boolean>(false);

  const { addToast } = useToasts();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  // toggle image uploader
  const [addAsset, setAddAsset] = useState<boolean>(false);
  // const [asset, setAsset] = useState<any>();

  const toggleAssetForm = () => {
    setAddAsset(!addAsset);
  };

  const formatImageNode = (src: string) => {
    // image object
    const imageNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: {},
          content: [
            {
              type: 'image',
              attrs: {
                src: `${API_HOST}/${src}`,
              },
            },
          ],
        },
      ],
    };
    return imageNode;
  };

  /**
   *
   * @param _data
   */
  const imageAdded = (_m: any) => {
    console.log('imaged', _m);
    const imageNode = formatImageNode(_m?.file);
    setInsertable(imageNode);
  };

  /**
   * Form Submit
   * @param data
   */

  const onSuccess = () => {
    addToast('Saved Successfully', { appearance: 'success' });
    setLoading(false);
    setSaved(true);
  };

  /** Editor Submit */

  const onSubmit = (data: any) => {
    setLoading(true);

    const formValues = {
      title: data.title,
      body: data.body,
      serialized: data.serialized,
    };

    // if edit is live
    if (cId) {
      updateEntity(`block_templates/${cId}`, formValues, token, onSuccess);
    } else {
      createEntity(formValues, `block_templates`, token, onSuccess);
    }
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadTemplate = (id: string, token: string) => {
    loadEntityDetail(token, 'block_templates', id, loadTemplateSuccess);
  };

  const loadTemplateSuccess = (data: BlockTemplates) => {
    setDataTemplate(data);
  };

  const doUpdate = (state: any) => {
    console.log('[block] [doUpdate]', state.body);
    if (state.md) {
      setValue('body', state.md);
      setValue('serialized', state.serialized);
    }

    if (state.body) {
      const castBody = state.body;
      console.log('ASHT', JSON.stringify(castBody));
      setValue('serialized', JSON.stringify(castBody));
    }
  };

  useEffect(() => {
    if (dataTemplate) {
      const contentBody = JSON.parse(dataTemplate.serialized);
      console.log('contentBody', contentBody);
      setDef(contentBody);
      setStatus(3);

      setInsertable(contentBody);
    }
  }, [token, dataTemplate]);

  useEffect(() => {
    if (saved) {
      Router.push(`/blocks`);
    }
  }, [saved]);

  useEffect(() => {
    if (!cId) {
      setStatus(3);
      setDef(EMPTY_MARKDOWN_NODE);
    }

    // dummy

    if (cId === 'xd') {
      setCleanInsert(false);
    }
    if (token && cId) {
      loadTemplate(cId, token);
    }
  }, [token, cId]);

  useEffect(() => {
    if (dataTemplate) {
      setValue('title', dataTemplate.title);
    }
  }, [dataTemplate]);

  /**
   * Delete a block
   */
  const deleteBlock = () => {
    if (cId && token) {
      deleteEntity(`block_templates/${cId}`, token);
      Router.push(`/block_templates`);
      addToast('Deleted Block Successfully', { appearance: 'error' });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py={3}
      mt={4}
      mx={4}
      mb={3}
      variant="w100">
      <Box>
        <Text mb={3} variant="pagetitle">
          Create Block
        </Text>
      </Box>

      <Button variant="secondary" onClick={() => toggleAssetForm()}>
        + Image
      </Button>
      {addAsset && <ImagesList hideList={true} onSuccess={imageAdded} />}
      <Box variant="w50">
        <Flex>
          <Box variant="w100">
            <Field
              name="title"
              label="Name"
              defaultValue=""
              register={register}
            />
            <Box variant="hidden" sx={{ display: 'none' }}>
              <Field
                name="body"
                label="Body"
                defaultValue={''}
                register={register}
              />
            </Box>
            <Box variant="hidden" sx={{ display: 'none' }}>
              <FieldText
                name="serialized"
                label="Serialized"
                defaultValue={'{}'}
                register={register}
              />
            </Box>
            {/* <EditorWraft autoFocus defaultValue="Heading"/> */}
            {def && status > 2 && (
              <EditorWraft
                onUpdate={doUpdate}
                document={def}
                editable={true}
                cleanInsert={cleanInsert}
                insertable={insertable}
              />
            )}
            {/* <Box pt={2} mb={3}>
              <Label sx={{ mb: 0, pb: 1 }}>Block Content</Label>
              <EditorWraft
                editable={true}
                onUpdate={doUpdate}
                value={body}
                editor="wysiwyg"
                mt={1}
                initialValue={EMPTY_MARKDOWN_NODE}
                insertable={false}
              />
            </Box> */}
            {/* {body} */}
          </Box>
          {errors.serialized && <Text>This field is required</Text>}
        </Flex>
      </Box>
      {saved && <Text>Saved</Text>}
      <Box mt={3}>
        <Button variant="primary">
          <Flex m={0}>
            {loading && <Spinner color="white" size={24} />}
            {!loading && <Text>{cId ? 'Update' : 'Create'}</Text>}
          </Flex>
        </Button>

        {cId && (
          <Button type="button" onClick={deleteBlock} variant="delete">
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default Form;
