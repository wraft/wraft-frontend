import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Avatar, Box, Button, Container, Flex, Label, Text } from 'theme-ui';

import { Drawer } from 'common/Drawer';
import Field from 'common/Field';
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
  const { register, setValue } = useForm();
  const [flow, setFlow] = useState<Flow>();
  const [states, setStates] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  /**
   * Load all states for a particular Flow
   * @param id flow id
   * @param t  token
   */
  const loadFlow = (fId: string) => {
    fetchAPI(`flows/${fId}`).then((data: any) => {
      const res: Flow = data.flow;
      setFlow(res);
      const flowStates: States = data.states;
      setStates(flowStates);
      setValue('name', res?.name);
    });
  };

  useEffect(() => {
    if (cId && cId.length > 0) {
      loadFlow(cId);
    }
  }, [cId, rerender]);

  return (
    <>
      <Box sx={{ px: 4, pb: 3, backgroundColor: 'white', width: '556px' }}>
        <Container data-flow={flow?.id}>
          <Box as="form">
            <Box sx={{ pt: 4, width: '100%' }}>
              <Field
                name="name"
                label="Name"
                defaultValue=""
                register={register}
                view
              />
            </Box>
            <Box pt={4}>
              <Label>Flow states</Label>
              {states && (
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'border',
                    borderRadius: '4px',
                  }}>
                  {states.map((item: any, index: number) => {
                    return (
                      <Box
                        key={index}
                        p={3}
                        sx={{
                          borderBottom:
                            index === states.length - 1 ? 'none' : '1px solid',
                          borderColor: 'border',
                        }}>
                        <Flex
                          sx={{
                            alignItems: 'center',
                          }}>
                          <Flex sx={{ alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bg: 'neutral.200',
                                borderRadius: '50%',
                                flexShrink: 0,
                              }}>
                              <Text
                                as="p"
                                variant="capM"
                                sx={{ color: 'text' }}>
                                {index + 1}
                              </Text>
                            </Box>
                            <Text sx={{ ml: 2 }} variant="pM">
                              {item.state}
                            </Text>
                            <Text sx={{ ml: 2 }} variant="pM">
                              {item?.type && `- ${item?.type}`}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex
                          sx={{ flexDirection: 'column', gap: '12px', mt: 3 }}>
                          {item.approvers.map((x: any, i: number) => {
                            return (
                              <Flex
                                key={x.id}
                                sx={{
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}>
                                  <Box
                                    sx={{
                                      position: 'relative',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Avatar
                                      src={x.profile_pic}
                                      alt="profile"
                                      width={18}
                                      height={18}
                                    />
                                    <Box
                                      sx={{
                                        display: i === 0 ? 'none' : 'block',
                                        height: '13px',
                                        width: '1px',
                                        bg: 'neutral.200',
                                        position: 'absolute',
                                        left: '9px',
                                        top: '-13.3px',
                                      }}
                                    />
                                  </Box>
                                  <Text
                                    as={'p'}
                                    ml={3}
                                    variant="subM"
                                    sx={{ color: 'gray.900' }}>
                                    {x.name}
                                  </Text>
                                </Box>
                              </Flex>
                            );
                          })}
                        </Flex>
                      </Box>
                    );
                  })}
                </Box>
              )}
              <Button
                variant="buttonSecondary"
                mt={4}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(true);
                }}>
                Edit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        {isOpen && <FlowForm setOpen={setIsOpen} setRerender={setRerender} />}
      </Drawer>
    </>
  );
};
export default FlowViewForm;
