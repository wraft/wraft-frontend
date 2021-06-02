import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from 'theme-ui';
import { useForm } from 'react-hook-form';

import Field from './Field';
import { createEntity, loadEntity, loadEntityDetail, updateEntity } from '../utils/models';

import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '60%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'scroll',
  },
};

import { IContentType, Template } from '../utils/types';
import { Label, Select } from 'theme-ui';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Pipeline } from './PipelineList';
import { useStoreState } from 'easy-peasy';

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
  const { register, handleSubmit, errors, getValues, setValue } = useForm();
  const token = useStoreState(state => state.auth.token);
  const [templates, setTemplates] = useState<Array<Template>>([]);
  //
  const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  const [showModal, setModal] = useState<boolean>(false);
  const [ctypeActive, setCtypeActive] = useState<IContentType>();

  const [stages, addStage] = useState<Array<IStage>>([]);

  const [activePipeline, setActivePipeline] = useState<Pipeline>();

  const [isEdit, setEdit] = useState<boolean>(false);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  function closeModal() {
    setModal(false);
  }

  function toggleModal() {
    setModal(!showModal);
  }

  const onSubmit = (data: any) => {
    console.log('stages', stages);
    const submitt = {
      stages: stages,
      name: data.name,
      api_route: data.api_route,
    };

    if(isEdit) {
      const aId = activePipeline && activePipeline.id;
      updateEntity(`/pipelines/${aId}`, submitt, token);
    }else {
      createEntity(submitt, 'pipelines', token);
    }    
  };

  const loadTypesSuccess = (data: any) => {
    const res: IContentType[] = data.content_types;
    setContentTypes(res);
  };

  const loadTypes = () => {
    loadEntity(token, 'content_types', loadTypesSuccess);
  };

  const loadDetailSuccess = (data: any) => {
    const res: IContentType = data.content_type;
    setCtypeActive(res);
  };

  const loadDetail = (token: string, id: string) => {
    loadEntityDetail(token, 'content_types', id, loadDetailSuccess);
  };

  /**
   * Load Templates for the particular content type
   * @param id
   */
  const loadTemplates = (id: string) => {    
    loadEntity(token, `content_types/${id}/data_templates`, onLoadTemplate);
  };

  const onLoadTemplate = (data: any) => {
    const res: Template[] = data.data_templates;
    setTemplates(res);
  };

  useEffect(() => {
    if (token) {
      loadTypes();
    }
  }, [token]);

  /**
   * Load Layout Edit Details
   * @param token
   */
  const loadPipeline = (cid: string, token: string) => {
    loadEntity(token, `pipelines/${cid}`, loadPipelineSuccess);
  };

  const loadPipelineSuccess = (data: any) => {
    const res: Pipeline = data;
    setActivePipeline(res);
  };

  useEffect(() => {
    if (activePipeline) {
      setEdit(true);
      console.log('activePipeline', activePipeline);
      // const assetsList: Asset[] = layout.assets;

      activePipeline && activePipeline.stages && activePipeline.stages.length > 0 && activePipeline.stages.forEach((a: any) => {
        appendStagePars(a.state.id, a.data_template.id, a.content_type.id, a.content_type.name);
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

    if(cId) {
      loadPipeline(cId, token);
    }

  }, [token, cId])

  // const LoadContentType = (props:any) => {
  //   console.log('x', props);
  // };

  const LoadContentType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eId = e.target.value;

    if (eId) {
      loadDetail(token, eId);
      loadTemplates(eId);
    }
  };

  const appendStagePars = (state_id:string, data_template_id:string, content_type_id:string, name:string) => {
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
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} width={1} mt={4}>
      <Box>
        <Text mb={3} fontSize={2} fontWeight={500}>
          { isEdit ? 'Update' : 'Create'} Pipeline
        </Text>
      </Box>
      <Box mx={0} mb={3} width={1}>
        <Flex>
          <Box width={7 / 12}>
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
          <Text mb={1} fontWeight={600}>
            Stages
          </Text>
          <Flex flexDirection="column">
            <ListGroup my={4} bg="#fff" width={3 / 6}>
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
                    <Text mt={0} color="#111" fontSize={1} fontWeight={600}>{props.name}</Text>
                      <Text mt={1} color="#444" fontSize={0}>{props.content_type_id}</Text>
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

            <Modal
              isOpen={showModal}
              onRequestClose={closeModal}
              style={customStyles}
              ariaHideApp={false}
              contentLabel="Pipeline Form">
              <Box>
                <Text mb={3} fontWeight={600}>
                  Add Stages
                </Text>
                <Label htmlFor="parent" mb={1}>
                  Content Type
                </Label>
                <Flex>
                  <Box width={4 / 8}>
                    <Select
                      id="content_type_id"
                      name="content_type_id"
                      onChange={LoadContentType}
                      defaultValue="Parent ID"
                      ref={register({ required: true })}>
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
                          name="data_template_id"
                          defaultValue="Parent ID"
                          ref={register({ required: true })}>
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
                          name="state_id"
                          defaultValue="Default State"
                          ref={register({ required: true })}>
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
      <Button ml={2}>{ isEdit ? 'Update' : 'Create'}</Button>
    </Box>
  );
};
export default PipelineForm;
