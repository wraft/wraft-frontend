import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Field,
  Flex,
  InputText,
  Label,
  Text,
  Drawer,
  useDrawer,
} from '@wraft/ui';
import { Avatar } from 'theme-ui';

import { Circle } from 'components/ImportTemplate/Styled';
import { fetchAPI } from 'utils/models';

import FlowForm from './FlowForm';

export interface States {
  total_pages: number;
  total_entries: number;
  states: StateElement[];
  page_number: number;
}

export interface StateElement {
  state: StateState;
  flow: Flow;
  creator: Creator;
}

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface Flow {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
}

export interface StateState {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

export interface StateFormProps {
  content: StateElement[];
  onSave: any;
  onDelete: React.MouseEventHandler;
  hidden?: boolean;
  onAttachApproval?: React.MouseEventHandler;
  dialog?: any;
  onSorted?: any;
}

const FlowViewForm = () => {
  const [flow, setFlow] = useState<Flow>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [states, setStates] = useState<any>();

  const { register, setValue } = useForm();
  const stateDrawer = useDrawer();
  const router = useRouter();
  const flowId: string = router.query.id as string;

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId, rerender]);

  const loadFlow = async (fId: string) => {
    try {
      const response = await fetchAPI(`flows/${fId}`);
      const { flow: flowData, states: flowStates }: any = response;

      setFlow(flowData);
      setStates(flowStates);
      setValue('name', flowData.name);
    } catch (error) {
      console.error('Failed to load flow:', error);
    }
  };

  return (
    <>
      <Box bg="background-primary" maxWidth="556px" w="40%" p="xl">
        <Box data-flow={flow?.id}>
          <Box as="form">
            <Field label="Flow Name" disabled required>
              <InputText {...register('name')} />
            </Field>

            <Box py="sm" pb="xl">
              <Label>Flow states</Label>
              {states && (
                <Box mt="sm">
                  {states.map((item: any, index: number) => {
                    return (
                      <Box
                        key={index}
                        border="1px solid"
                        borderColor="border"
                        borderRadius="md"
                        display="flex"
                        mb="-1px"
                        px="md"
                        gap="sm"
                        py="sm">
                        <Circle bg="teal.200" color="teal.800">
                          {index + 1}
                        </Circle>
                        <Flex pt="xxs" gap="sm">
                          <Text fontWeight="bold" mb="xs">
                            {item.state}
                          </Text>
                          <Text
                            fontWeight="normal"
                            mb="xs"
                            fontSize="sm"
                            color="gray.900">
                            {item?.type}
                          </Text>
                        </Flex>

                        <Box ml="auto">
                          {item.approvers.map((x: any) => {
                            return (
                              <Flex key={x.id} gap="sm" mr="xxs" py="xs">
                                <Box>
                                  <Avatar
                                    src={x.profile_pic}
                                    alt="profile"
                                    width={14}
                                    height={14}
                                  />
                                </Box>
                                <Text
                                  fontSize="base"
                                  fontWeight="500"
                                  color="gray.1000">
                                  {x.name}
                                </Text>
                              </Flex>
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              Edit
            </Button>
          </Box>
        </Box>
      </Box>
      <Drawer
        open={isOpen}
        store={stateDrawer}
        aria-label="field drawer"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        {isOpen && <FlowForm setOpen={setIsOpen} setRerender={setRerender} />}
      </Drawer>
    </>
  );
};
export default FlowViewForm;
