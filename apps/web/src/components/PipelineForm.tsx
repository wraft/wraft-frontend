import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text } from 'theme-ui';
import { Label, Select } from 'theme-ui';

import Modal from 'common/Modal';
import Field from 'common/Field';
import PageHeader from 'common/PageHeader';
import { postAPI, fetchAPI, putAPI } from 'utils/models';
import { IContentType, Template } from 'utils/types';

import { Pipeline } from './Pipeline/PipelineList';

export interface IStage {
  name: string;
  state_id: string;
  data_template_id: string;
  content_type_id: string;
}

const ListGroup = styled(Box)`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  margin-top: 24px;
  margin-bottom: 24px;
  border-radius: 4px;
  overflow: hidden;
  border: solid 1px #ddd;
  background: #fff;
`;

const PipelineForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();
  const [templates, setTemplates] = useState<Array<Template>>([]);
  //
  const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ctypeActive, setCtypeActive] = useState<IContentType>();

  const [stages, addStage] = useState<Array<IStage>>([]);

  const [activePipeline, setActivePipeline] = useState<Pipeline>();

  const [isEdit, setEdit] = useState<boolean>(false);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  // function closeModal() {
  //   setModal(false);
  // }

  function toggleModal() {
    setShowModal(!showModal);
  }

  const onSubmit = (data: any) => {
    const submitt = {
      stages: stages,
      name: data.name,
      api_route: data.api_route,
    };

    if (isEdit) {
      const aId = activePipeline && activePipeline.id;
      putAPI(`/pipelines/${aId}`, submitt);
    } else {
      postAPI('pipelines', submitt);
    }
  };

  const loadTypes = () => {
    fetchAPI('content_types').then((data: any) => {
      const res: IContentType[] = data.content_types;
      setContentTypes(res);
    });
  };

  const loadDetail = (id: string) => {
    fetchAPI(`content_types/${id}`).then((data: any) => {
      const res: IContentType = data.content_type;
      setCtypeActive(res);
    });
  };

  /**
   * Load Templates for the particular content type
   * @param id
   */
  const loadTemplates = (id: string) => {
    fetchAPI(`content_types/${id}/data_templates`).then((data: any) => {
      const res: Template[] = data.data_templates;
      setTemplates(res);
    });
  };

  useEffect(() => {
    loadTypes();
  }, []);

  /**
   * Load Layout Edit Details
   * @param token
   */
  const loadPipeline = (cid: string) => {
    fetchAPI(`pipelines/${cid}`).then((data: any) => {
      const res: Pipeline = data;
      setActivePipeline(res);
    });
  };

  useEffect(() => {
    if (activePipeline) {
      setEdit(true);

      activePipeline &&
        activePipeline.stages &&
        activePipeline.stages.length > 0 &&
        activePipeline.stages.forEach((a: any) => {
          appendStagePars(
            a.state.id,
            a.data_template.id,
            a.content_type.id,
            a.content_type.name,
          );
        });

      setValue('name', activePipeline.name);
      setValue('api_route', activePipeline.api_route);
      // setValue('slug', layout.slug);
      // setValue('height', layout.height);
      // setValue('width', layout.width);
      // setValue('description', layout.description);
      // setValue('engine_uuid', layout.engine.id);
    }
  }, [activePipeline]);

  useEffect(() => {
    if (cId) {
      loadPipeline(cId);
    }
  }, [cId]);

  const LoadContentType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eId = e.target.value;

    if (eId) {
      loadDetail(eId);
      loadTemplates(eId);
    }
  };

  const appendStagePars = (
    state_id: string,
    data_template_id: string,
    content_type_id: string,
    name: string,
  ) => {
    addStage([
      ...stages,
      {
        state_id: state_id,
        data_template_id: data_template_id,
        content_type_id: content_type_id,
        name: name,
      },
    ]);
  };

  const appendStage = () => {
    const m: any = getValues();
    const { state_id, data_template_id, content_type_id } = m;

    const name = (ctypeActive && ctypeActive.name) || '';

    addStage([
      ...stages,
      {
        state_id: state_id,
        data_template_id: data_template_id,
        content_type_id: content_type_id,
        name: name,
      },
    ]);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <PageHeader title="Edit Pipeline" />
      <Box mx={0} mb={3} variant="layout.pageFrame">
        <Flex>
          <Box>
            <Field
              name="name"
              label="Name"
              defaultValue="New Theme"
              register={register}
            />
            <Field
              name="api_route"
              label="API Route"
              defaultValue=""
              register={register}
            />
            {/* <Field
              name="typescale"
              label="Typescale"
              defaultValue="1.25"
              register={register}
            /> */}
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
        <Box>
          <Text mb={1}>Stages</Text>
          <Flex>
            <ListGroup my={4} bg="#fff">
              {stages &&
                stages.map((props: any) => (
                  <Flex
                    key={props.name}
                    sx={{
                      p: 3,
                      borderBottom: 'solid 1px #eee',
                      borderLeft: 0,
                    }}>
                    <Box>
                      <Text mt={0} color="#111">
                        {props.name}
                      </Text>
                      <Text mt={1} color="#444">
                        {props.content_type_id}
                      </Text>
                    </Box>
                    <Text sx={{ color: 'blue', marginLeft: 'auto' }}>Edit</Text>
                  </Flex>
                ))}

              {/* <Box sx={{ p: 3, borderBottom: 'solid 1px #eee', borderLeft: 0 }}>
                Create NDA
              </Box> */}
              <Box
                sx={{
                  p: 3,
                  color: 'blue',
                  borderBottom: 'solid 1px #eee',
                  borderLeft: 0,
                }}>
                <Button variant="small2" onClick={toggleModal}>
                  + Add Stage
                </Button>
              </Box>
            </ListGroup>

            <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
              <Box sx={{ p: 4, width: '60ch' }}>
                <Text mb={3}>Add Stages</Text>
                <Label htmlFor="parent" mb={1}>
                  Content Type
                </Label>
                <Flex>
                  <Box>
                    <Select
                      id="content_type_id"
                      // name="content_type_id"
                      defaultValue="Parent ID"
                      // ref={register({ required: true })}
                      {...register('content_type_id', { required: true })}
                      onChange={LoadContentType}>
                      {ctypes &&
                        ctypes.length > 0 &&
                        ctypes.map((m: any) => (
                          <option value={m.id} key={m.id}>
                            {m.name}
                          </option>
                        ))}
                    </Select>

                    {templates && templates.length > 0 && (
                      <Box>
                        <Label htmlFor="parent" mb={1}>
                          Tempalte
                        </Label>
                        <Select
                          id="data_template_id"
                          // name="data_template_id"
                          defaultValue="Parent ID"
                          // ref={register({ required: true })}
                          {...register('data_template_id', { required: true })}>
                          {templates &&
                            templates.length > 0 &&
                            templates.map((m: any) => (
                              <option value={m.id} key={m.id}>
                                {m.title}
                              </option>
                            ))}
                        </Select>
                      </Box>
                    )}

                    {ctypeActive && (
                      <Box>
                        <Label htmlFor="parent" mb={1}>
                          Default State
                        </Label>
                        <Select
                          id="state_id"
                          // name="state_id"
                          defaultValue="Default State"
                          // ref={register({ required: true })}
                          {...register('state_id', { required: true })}>
                          {ctypeActive.flow.states &&
                            ctypeActive.flow.states.length > 0 &&
                            ctypeActive.flow.states.map((m: any) => (
                              <option value={m.id} key={m.id}>
                                {m.state}
                              </option>
                            ))}
                        </Select>
                      </Box>
                    )}
                  </Box>
                </Flex>
                <Text onClick={appendStage}>Save Stage</Text>
              </Box>
            </Modal>
          </Flex>
        </Box>
      </Box>
      <Box variant="layout.pageFrame" bg="gray.0">
        <Button variant="btnPrimary" ml={2}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};
export default PipelineForm;
