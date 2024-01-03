import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Modal, { Styles } from 'react-modal';

import { PlayCircle } from './Icons';
import { fetchAPI, postAPI, deleteAPI } from '../utils/models';
import { Pipeline } from './PipelineList';
import Link from './NavLink';
import Field from './Field';
import PageHeader from './PageHeader';

export interface ITriggers {
  triggers: Trigger[];
  total_pages: number;
  total_entries: number;
  page_number: number;
}

export interface Trigger {
  zip_file: null;
  updated_at: Date;
  state: string;
  start_time: Date;
  inserted_at: Date;
  id: string;
  error: { [key: string]: Error };
  end_time: Date;
  duration: number;
  data: Data;
  creator: Creator;
}

export interface Creator {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface Data {
  title?: string;
  position: string;
  name: string;
}

export interface Error {
  stage: string;
  info: string;
}

const _customStyles: Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    bottom: '20%',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
  },
};

export interface IStage {
  name: string;
  state_id: string;
  data_template_id: string;
  content_type_id: string;
}

// const Dot = styled.div`
//   width: 12px;
//   height: 12px;
//   display: block;
//   border-radius: 11rem;
//   margin-top: 6px;
//   background-color: #589444;
//   position: absolute;
//   left: 41%;
//   top: 16px;
//   z-index: 200;
// `;

// const Line = styled.div`
//   width: 1px;
//   height: 100%;
//   border-right: solid 1px #58944461;
//   position: absolute;
//   left: 50%;
//   z-index: 3000;
//   display: block;
// `;

// {fields &&
//   fields.map((_p: any) => (
//     <Box>
//       <Text sx={{ fontSize: 1, mb:2 , mt: 1, fontWeight: 600}}>Form</Text>
//       { _p.map((pp: any) => (
//         <Text as="code">{pp.name}</Text>
//       ))}
//     </Box>
//   ))}

const PipelineForm = (fields: any) => {
  // console.log('fields', fields.fields.length);
  return (
    <Box>
      <Text>Pipeline Form 2 ({fields?.fields?.length})</Text>
      {fields.fields.map((f: any) => (
        <Text key={f?.id}>{f.id}</Text>
      ))}
    </Box>
  );
};

const PipelineView = () => {
  const [stages, addStage] = useState<Array<IStage>>([]);
  const [state, setState] = useState<string>('nostart');
  const [activePipeline, setActivePipeline] = useState<Pipeline>();
  const [triggers, setTriggers] = useState<ITriggers>();
  const [fields, setFields] = useState<any>();

  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const cId: string = router.query.id as string;

  /**
   * Load Layout Edit Details
   * @param token
   */
  const loadPipeline = (cid: string) => {
    fetchAPI(`pipelines/${cid}`).then((data: any) => {
      loadPipelineSuccess(data);
    });
  };

  const loadPipelineSuccess = (data: any) => {
    const res: Pipeline = data;
    setActivePipeline(res);

    // setFields(res.stages)

    if (res.stages) {
      const mx: any = [];
      res.stages.map((s: any) => {
        // s.map((s: any) => {
        // const fs:any = s?.content_type?.fields;
        // console.log('fields', fs);
        mx.push(s?.content_type?.fields);
      });

      setFields(mx);
    }
  };

  // if we have a route param, load pipeline
  useEffect(() => {
    if (cId) {
      loadPipeline(cId);
      loadTriggers(cId);
    }
  }, [cId]);

  // if we have a route param, load pipeline
  useEffect(() => {
    if (cId === 'dummy') {
      buildPipelineNow({ name: 'remove_me' });
    }
  }, [cId]);

  // When pipe line is ready
  useEffect(() => {
    if (activePipeline) {
      console.log('activePipeline', activePipeline);
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
    }
  }, [activePipeline]);

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

  /**
   * RUn a pipeline
   * @param id pipline_id
   */
  const runPipeline = (id: string) => {
    console.info('starting to run pipleine', id);
    setState('running');
  };

  /**
   * Load trigger history
   * @param id pipline_id
   */
  const loadTriggers = (id: string) => {
    console.log('loading triggers for ', id);
    // setState('running');
    fetchAPI(`/pipelines/${id}/triggers`).then((data: any) => {
      const res: ITriggers = data;
      setTriggers(res);
    });
  };

  const closeRunning = () => {
    setState('nostart');
  };

  /**
   * Build a pipeline with Data
   * @param pipe
   */
  const buildPipelineNow = (pipe: any) => {
    console.log('pipe', pipe);
    // const sampleData = {
    //   //1.  /content_types/{c_type_id}/data_templates/bulk_import
    //   // 2.
    // };

    triggerPipeline(pipe?.id);
  };

  const triggerPipeline = (id: string) => {
    const path = `/pipelines/${id}/triggers`;

    // const data = {
    //   title: 'Title Test',
    //   desc: 'Description Test',
    // };

    const dataPost = {
      data: {
        position: 'HR Manager',
        name: 'John Doe',
        title: 'Title',
      },
    };

    postAPI(path, dataPost);
    // create(token, `pipelines/${cid}`, loadPipelineSuccess);
  };

  const pipelineCollect = () => {
    setState('collect');
  };

  const onSubmit = (data: any) => {
    // createEntity(data, 'organisations', token, onCreate);
    console.log('data', data);
    // return false;

    const dataPost = {
      data,
    };
    const path = `/pipelines/${cId}/triggers`;
    postAPI(path, dataPost);
    // updateEntity('organisations', data, token, onCreate);
  };

  /**
   * Delete this pipeline
   */
  const deletePipeline = (id: any) => {
    deleteAPI(`pipelines/${id}`);
  };

  return (
    <Box>
      <PageHeader title="Pipelines">
        <Box sx={{ ml: 'auto' }}>
          <Link href="/manage/pipelines/new" variant="btnSecondary">
            + Add Pipeline
          </Link>
        </Box>
      </PageHeader>
      {!activePipeline && <Text>Loading...</Text>}
      {activePipeline && (
        <Flex sx={{ px: 4 }}>
          <Box sx={{ width: '70%' }}>
            <Flex>
              <Text as="h1" sx={{ py: 3, fontSize: 3 }}>
                {activePipeline.name}
              </Text>
              {/* <Box>
                <Text sx={{ fontSize: 0, color: 'gray.6', mb: 2 }}>
                  Pipelines › {activePipeline.name}
                </Text>
                <Text sx={{ fontSize: 4 }}>{activePipeline.name}</Text>
              </Box> */}
              <Box sx={{ ml: 'auto' }}>
                <Flex py={3}>
                  <Button
                    variant="btnPrimary"
                    onClick={() => runPipeline(activePipeline.id)}
                    sx={{
                      bg: 'green.7',
                      border: 'solid 1px',
                      borderColor: 'green.8',
                      ':hover': {
                        bg: 'green.8',
                      },
                    }}>
                    <Flex>
                      <Box sx={{ mr: 2 }}>
                        <PlayCircle width={16} />
                      </Box>
                      <Text>Run</Text>
                    </Flex>
                  </Button>
                  <Button
                    variant="btnPrimary"
                    sx={{
                      ml: 2,
                      bg: 'gray.0',
                      border: 'solid 1px',
                      borderColor: 'gray.3',
                      color: 'gray.8',
                    }}
                    onClick={() => pipelineCollect()}>
                    <Flex>
                      <PlayCircle width={16} />
                      <Text ml={2}>Collect</Text>
                    </Flex>
                  </Button>
                </Flex>
              </Box>
            </Flex>
            <Box>
              <Text
                sx={{
                  // p: 2,
                  fontSize: 0,
                  color: 'gray.7',
                  letterSpacing: '-0.2',
                  fontWeight: 100,
                  // bg: 'white',
                  borderRadius: 0,
                  // border: 'solid 1px',
                  // borderColor: 'gray.3',
                }}>
                {state === 'running' ? `Running` : ''}
              </Text>
            </Box>
            {state}
            {state && (state === 'running' || state === 'collect') && (
              <Modal
                style={_customStyles}
                isOpen={true}
                onRequestClose={closeRunning}
                ariaHideApp={false}
                contentLabel="Example Modal">
                <Box>
                  <Text as="h2">Enter Fields</Text>
                  <Box
                    sx={{
                      p: 3,
                      bg: 'gray.0',
                      borderLeft: 'solid 1px #eee',
                      my: 3,
                    }}>
                    <Box
                      mx={0}
                      mb={3}
                      as="form"
                      onSubmit={handleSubmit(onSubmit)}>
                      {fields &&
                        fields.length > 0 &&
                        fields.map((fd: any, index: any) => (
                          <Box key={index}>
                            Group {index}
                            {fd.map((fx: any) => (
                              <Box key={fx.name}>
                                <Field
                                  name={`${fx.name}`}
                                  label={fx.name}
                                  defaultValue=""
                                  register={register}
                                />
                              </Box>
                            ))}
                          </Box>
                        ))}
                      <Button>
                        {/* onClick={() => buildPipelineNow(activePipeline)} */}
                        Send
                      </Button>
                    </Box>
                    {/* <Text>DATA IS AUTO-FILLED FOR NOW</Text> */}
                  </Box>
                </Box>
              </Modal>
            )}

            <Box mx={0} mb={3}>
              <Box>
                {state === 'collect' && fields && fields.length > 0 && (
                  <PipelineForm fields={fields} />
                )}
              </Box>
              <Box>
                <Text sx={{ fontSize: 3, pt: 3, pb: 2 }}>
                  Stages {activePipeline.stages.length}
                </Text>
                <Flex>
                  <Box
                    sx={{
                      borderRadius: 3,
                      // borderColor: 'red',
                      bg: 'gray.1',
                      border: 'solid 1px',
                      borderColor: 'gray.4',
                      width: '100%',
                    }}
                    my={4}
                    mt={2}
                    bg="gray.0">
                    {activePipeline &&
                      activePipeline.stages.length > 0 &&
                      activePipeline.stages.map((props: any) => (
                        <Flex
                          key={props.id}
                          sx={{
                            p: 0,
                            mt: 3,
                            pt: 3,
                            pb: 3,

                            // bg: 'blue',
                            borderBottom: 'solid 1px',
                            borderColor: 'gray.4',
                            // background: '#fff',
                            borderLeft: 0,
                          }}>
                          <Box sx={{ pl: 4 }}>
                            <Box
                              sx={{
                                bg: props.content_type.color,
                                border: 0,
                                borderRadius: 3,
                                color: 'white',
                                p: 3,
                                position: 'relative',
                              }}>
                              {props.content_type.prefix}
                              {/* <Dot /> */}
                              {/* <Line /> */}
                            </Box>
                          </Box>
                          <Box sx={{ paddingLeft: 3, pl: 4, pb: 4, pt: 0 }}>
                            <Text
                              sx={{
                                fontSize: 2,
                                fontWeight: 600,
                                color: 'gray.8',
                              }}
                              mt={0}
                              // color="#111"
                              // fontSize={1}
                              // fontWeight={600}
                            >
                              {props.content_type.name}
                            </Text>
                            <Text mt={0} color="gray.6">
                              {props.content_type?.fields?.length} field
                            </Text>
                          </Box>
                          <Box ml="auto" mr={3}>
                            <Text
                              variant="caps"
                              sx={{
                                color: 'secondary',
                                marginLeft: 'auto',
                                mt: 3,
                              }}>
                              Edit
                            </Text>
                          </Box>
                        </Flex>
                      ))}

                    <Box sx={{ py: 3, mt: 4 }}>
                      {triggers &&
                        triggers?.triggers?.map((m: any) => (
                          <Flex
                            key={m?.id}
                            sx={{
                              p: 4,
                              bg: 'gray.1',
                              borderBottom: 'solid 1px #ddd',
                            }}>
                            <Box
                              sx={{
                                p: 0,
                                fontFamily: 'monospace',
                                fontSize: 0,
                                color:
                                  m.state === 'success' ? 'green' : 'orange',
                                borderRadius: 0,
                                mr: 4,
                              }}>
                              {m.state}
                            </Box>
                            <Box
                              as="pre"
                              sx={{
                                bg: 'gray.2',
                                p: 0,
                                color: 'gray.7',
                                height: '30px',
                                overflow: 'hidden',
                                width: '60%',
                                borderRadius: 0,
                                mr: 4,
                              }}>
                              {JSON.stringify(m.error)}
                            </Box>
                            {/* {m.id} */}
                            <Button
                              sx={{
                                // ml: 4,
                                ml: 'auto',
                                bg: 'gray.0',
                                color: 'gray.8',
                                border: 'solid 1px',
                                borderColor: 'gray.5',
                              }}>
                              Re-run
                            </Button>
                          </Flex>
                        ))}
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>

          <Box sx={{ pl: 4 }}>
            <Text mr={3} onClick={() => deletePipeline(cId)}>
              Delete
            </Text>
            <Link href={`/manage/pipelines/edit/${cId}`}>Edit</Link>
          </Box>
        </Flex>
      )}
    </Box>
  );
};
export default PipelineView;
