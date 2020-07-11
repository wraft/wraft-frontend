import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'rebass';
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

const Relative = styled(Box)`
  position: relative;
  height: 100%;
`;

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
    <Box py={3} width={1} mt={4}>
      {!activePipeline && <Text>Loading...</Text>}
      {activePipeline && (
        <Flex>
          <Box width={8 / 12}>
            <Box>
              <Text mb={3} fontSize={0} fontWeight={500}>
                Pipelines › {activePipeline.name}
              </Text>
              <Text mb={3} fontSize={2} fontWeight={500}>
                {activePipeline.name}
              </Text>
              <Flex py={2}>
                <Button mr={3}>Run Pipeline</Button>
              </Flex>
              <hr />
            </Box>

            <Box mx={0} mb={3} width={1}>
              <Box>
                <Text mb={1} fontWeight={300}>
                  Stages {activePipeline.stages.length}
                </Text>
                <Flex flexDirection="column">
                  <ListGroup my={4} mt={2} bg="#fff" width={1}>
                    {activePipeline &&
                      activePipeline.stages.length > 0 &&
                      activePipeline.stages.map((props: any) => (
                        <Flex
                          key={props.name}
                          sx={{
                            p: 0,
                            borderBottom: 'solid 1px #eee',
                            background: '#fff',
                            borderLeft: 0,
                          }}>
                          <Box width={1 / 12}>
                            <Relative>
                              <Dot />
                              <Line />
                            </Relative>
                          </Box>
                          <Box p={3} width={8 / 12}>
                            <Text
                              mt={0}
                              color="#111"
                              fontSize={1}
                              fontWeight={600}>
                              {props.content_type.name}
                            </Text>
                            <Text mt={1} color="#444" fontSize={0}>
                              {props.content_type.id}
                            </Text>
                          </Box>
                          <Box ml="auto" mr={3} width={2 / 12}>
                            <Text
                              variant="caps"
                              sx={{ color: 'secondary', marginLeft: 'auto' }}>
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
                  </ListGroup>
                </Flex>
              </Box>
            </Box>
          </Box>
          <Box width={4 / 12}>
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
