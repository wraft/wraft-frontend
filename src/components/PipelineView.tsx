import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, Badge } from 'theme-ui';
import { loadEntity, deleteEntity } from '../utils/models';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Pipeline } from './PipelineList';
import Link from './NavLink';
import { useStoreState } from 'easy-peasy';

import Modal, { Styles } from 'react-modal';

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

const Dot = styled.div`
  width: 12px;
  height: 12px;
  display: block;
  border-radius: 11rem;
  margin-top: 6px;
  background-color: #589444;
  position: absolute;
  left: 41%;
  top: 16px;
  z-index: 200;
`;

const Line = styled.div`
  width: 1px;
  height: 100%;
  border-right: solid 1px #58944461;
  position: absolute;
  left: 50%;
  z-index: 3000;
  display: block;
`;

const PipelineView = () => {
  const token = useStoreState(state => state.auth.token);

  const [stages, addStage] = useState<Array<IStage>>([]);
  const [state, setState] = useState<string>('nostart');

  const [activePipeline, setActivePipeline] = useState<Pipeline>();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

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

  // if we have a route param, load pipeline
  useEffect(() => {
    if (cId && token) {
      loadPipeline(cId, token);
    }
  }, [token, cId]);

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
  const runPipeline = (id:string) => {
    console.info('starting to run pipleine', id);
    setState("running");
  }

  /**
   * Build a pipeline with Data
   * @param pipe 
   */
  const buildPipelineNow = (pipe: any) => {

    const sampleData = {
      //1.  /content_types/{c_type_id}/data_templates/bulk_import
      // 2. 
    }
  }

  /**
   * Delete this pipeline
   */
  const deletePipeline = (id: any) => {
    deleteEntity(`pipelines/${id}`, token);
  };

  return (
    <Box py={3} px={3} mt={4}>
      {!activePipeline && <Text>Loading...</Text>}
      {activePipeline && (
        <Flex>
          <Box sx={{ width: '70%'}}>
            <Box>
              <Text sx={{ fontSize: 0, color: 'gray.6', mb: 2}}>
                Pipelines › {activePipeline.name}
              </Text>
              <Text sx={{ fontSize: 2}}>
                {activePipeline.name}
              </Text>
              <Flex py={3}>                
                <Button onClick={()=> runPipeline(activePipeline.id)}>Run Pipeline</Button>
              </Flex>
              <Badge bg="red.7">{ state}</Badge>
              <hr />
            </Box>

            {state && state ==="running" && (
                <Modal
                  style={_customStyles}
                  isOpen={true}
                  // onRequestClose={closeModal}
                  ariaHideApp={false}
                  contentLabel="Example Modal">
                  <Box>
                    <Text>I'm going to ask you to enter data</Text>
                    <Box sx={{ p: 3, bg: 'gray.0', borderLeft: 'solid 1px #eee', my: 3}}>
                      <Text>DATA IS AUTO-FILLED FOR NOW</Text>
                    </Box>
                    <Button onClick={() => buildPipelineNow(activePipeline)}>Run Now</Button>
                  </Box>
                </Modal>
              )}

            <Box mx={0} mb={3}>
              <Box>
                <Text>
                  Stages {activePipeline.stages.length}
                </Text>
                <Flex>
                  <Box sx={{ borderRadius: 3, borderColor: 'red', border: 'solid 1px' }} my={4} mt={2} bg="gray.0">
                    {activePipeline &&
                      activePipeline.stages.length > 0 &&
                      activePipeline.stages.map((props: any) => (
                        <Flex
                          key={props.name}
                          sx={{
                            p: 0,
                            borderBottom: 'solid 1px',
                            borderColor: 'gray.1',
                            background: '#fff',
                            borderLeft: 0,
                          }}>
                          <Box sx={{ pl: 4}}>
                            <Box sx={{ position: 'relative'}}>
                              <Dot />
                              <Line />
                            </Box>
                          </Box>
                          <Box sx={{ paddingLeft: 3, p: 4 }}>
                            <Text
                              mt={0}
                              // color="#111"
                              // fontSize={1}
                              // fontWeight={600}
                              >
                              {props.content_type.name}
                            </Text>
                            <Text mt={1} color="#444">
                              {props.content_type.id}
                            </Text>
                          </Box>
                          <Box ml="auto" mr={3}>
                            <Text
                              variant="caps"
                              sx={{ color: 'secondary', marginLeft: 'auto', mt: 3 }}>
                              Edit
                            </Text>
                          </Box>
                        </Flex>
                      ))}
                    <Box
                      sx={{
                        p: 3,
                        color: 'blue',
                        borderBottom: 'solid 1px #eee',
                        borderLeft: 0,
                      }}></Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>
          <Box>
            <Text mr={3} onClick={() => deletePipeline(cId)}>
              Delete
            </Text>
            <Link href={`/pipelines/edit/${cId}`}>Edit</Link>
          </Box>
        </Flex>
      )}
    </Box>
  );
};
export default PipelineView;
