import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Avatar,
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

            <Box py="sm">
              <Label>Flow states</Label>
              {states && (
                <Box mt="sm">
                  {states.map((item: any, index: number) => {
                    return (
                      <Box
                        key={index}
                        border="1px solid"
                        borderColor="border"
                        borderRadius="sm"
                        mb="md"
                        px="md"
                        py="sm">
                        <Text fontWeight="bold" mb="xs">
                          {`${index + 1} ${item.state} ${item?.type && `- ${item?.type}`}
                            `}
                        </Text>

                        <Box>
                          {item.approvers.map((approver: any) => {
                            return (
                              <Flex key={approver.id} gap="xs" py="xs">
                                <Box>
                                  <Avatar
                                    src={approver.profile_pic}
                                    alt={approver.name}
                                    name={approver.name}
                                    size="xs"
                                  />
                                </Box>
                                <Text>{approver.name}</Text>
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
