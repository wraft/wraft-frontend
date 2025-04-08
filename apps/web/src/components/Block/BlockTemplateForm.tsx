import React, { useEffect, useState, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Spinner } from 'theme-ui';
import { Button } from '@wraft/ui';

import Field from 'common/Field';
import Editor from 'common/Editor';
import { BlockTemplates } from 'utils/types';
import { postAPI, putAPI, fetchAPI } from 'utils/models';
import { authorizeRoute } from 'middleware/authorize';

const Form = () => {
  const [addAsset, setAddAsset] = useState<boolean>(false);
  const [dataTemplate, setDataTemplate] = useState<BlockTemplates>();
  const [content, setContent] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const editorRef = useRef<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const router = useRouter();
  const cId: string = router.query.id as string;

  const toggleAssetForm = () => {
    setAddAsset(!addAsset);
  };

  const onSubmit = (data: any) => {
    setLoading(true);

    const jsonContent = editorRef.current?.helpers?.getJSON();
    const markdownContent = editorRef.current?.helpers?.getMarkdown();

    const formValues = {
      title: data.title,
      body: markdownContent,
      serialized: JSON.stringify(jsonContent),
    };

    if (cId) {
      putAPI(`block_templates/${cId}`, formValues)
        .then(() => {
          toast.success('Saved Successfully', {
            duration: 1000,
            position: 'top-right',
          });
          setLoading(false);
          setSaved(true);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      postAPI(`block_templates`, formValues)
        .then(() => {
          toast.success('Saved Successfully', {
            duration: 1000,
            position: 'top-right',
          });
          setLoading(false);
          setSaved(true);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const loadTemplate = (id: string) => {
    fetchAPI(`block_templates/${id}`).then((data: BlockTemplates) => {
      setDataTemplate(data);
    });
  };

  useEffect(() => {
    if (dataTemplate) {
      setValue('title', dataTemplate.title);
      const contentBody = JSON.parse(dataTemplate.serialized);
      setContent(contentBody);
    }
  }, [dataTemplate]);

  useEffect(() => {
    if (saved) {
      Router.push(`/blocks`);
    }
  }, [saved]);

  useEffect(() => {
    if (cId) {
      loadTemplate(cId);
    }
  }, [cId]);

  /**
   * Delete a block
   */
  // const deleteBlock = () => {
  //   if (cId) {
  //     deleteAPI(`block_templates/${cId}`).then(() => {
  //       Router.push(`/block_templates`);
  //       toast.success('Deleted Block Successfully', {
  //         duration: 1000,
  //         position: 'top-right',
  //       });
  //     });
  //   }
  // };

  return (
    <Box
      as="form"
      sx={{ mx: 'auto' }}
      onSubmit={handleSubmit(onSubmit)}
      py={3}
      mt={4}
      mx={4}
      mb={3}>
      {/* {addAsset && <ImagesList hideList={true} onSuccess={imageAdded} />} */}
      <Box>
        <Flex>
          <Box variant="w100" sx={{ minWidth: '70ch' }}>
            <Box
              sx={{
                input: {
                  bg: 'white',
                },
              }}>
              <Box sx={{ px: 1, py: 1 }}>
                <Field
                  name="title"
                  label="Name"
                  defaultValue=""
                  register={register}
                />
              </Box>

              <Editor
                defaultContent={content}
                isReadonly={false}
                ref={editorRef}
              />
            </Box>
          </Box>
          <Box>
            <Button variant="secondary" onClick={() => toggleAssetForm()}>
              + Image
            </Button>
          </Box>
          {errors.serialized && <Text>This field is required</Text>}
        </Flex>
      </Box>
      <Flex mt={3} ml={1}>
        <Button type="submit" variant="primary">
          <Flex m={0}>
            {loading && <Spinner color="white" size={24} />}
            {!loading && <Text>{cId ? 'Update' : 'Create'}</Text>}
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
};
export default authorizeRoute(Form, 'block_template', 'manage');
