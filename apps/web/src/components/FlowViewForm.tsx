import React, { useEffect, useState } from 'react';

import { Drawer } from '@wraft-ui/Drawer';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Box, Button, Container, Flex, Label, Text } from 'theme-ui';

import { fetchAPI } from '../utils/models';

import Field from './Field';
import FlowForm from './FlowForm';
import PersonCapsule from './PersonCapsule';

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
      console.log('flowwwwwwwwww', data);
      const res: Flow = data.flow;
      setFlow(res);
      const states: States = data.states;
      setStates(states);
      setValue('name', res?.name);
    });
  };

  useEffect(() => {
    if (cId && cId.length > 0) {
      loadFlow(cId);
    }
  }, [cId]);

  const users = [
    { name: 'Lara', src: 'https://i.pravatar.cc/300?img=1' },
    { name: 'Cenny', src: 'https://i.pravatar.cc/300?img=2' },
    { name: 'Rex', src: 'https://i.pravatar.cc/300?img=3' },
    { name: 'Harry', src: 'https://i.pravatar.cc/300?img=4' },
    { name: 'Lucy', src: 'https://i.pravatar.cc/300?img=5' },
    { name: 'Potter', src: 'https://i.pravatar.cc/300?img=6' },
    { name: 'Jonh', src: 'https://i.pravatar.cc/300?img=7' },
  ];

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
                          <Flex>
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
                                {item.order}
                              </Text>
                            </Box>
                            <Text sx={{ ml: 2 }} variant="pM">
                              {item.state}
                            </Text>
                          </Flex>
                        </Flex>
                        {users && (
                          <Flex sx={{ flexWrap: 'wrap', gap: 2, mt: '18px' }}>
                            {users.map((user: any, index: number) => (
                              <PersonCapsule person={user} key={index} />
                            ))}
                          </Flex>
                        )}
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
        <FlowForm />
      </Drawer>
    </>
  );
};
export default FlowViewForm;
