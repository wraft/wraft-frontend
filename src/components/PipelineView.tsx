import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import { loadEntity, deleteEntity } from '../utils/models';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Pipeline } from './PipelineList';
import Link from './NavLink';
import { useStoreState } from 'easy-peasy';

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
                <Button >Run Pipeline</Button>
              </Flex>
              <hr />
            </Box>

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
