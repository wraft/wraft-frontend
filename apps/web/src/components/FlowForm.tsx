import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Container, Button, Text, Flex } from 'theme-ui';

import { postAPI, deleteAPI, fetchAPI, putAPI } from '../utils/models';
import { IconWrapper } from './Atoms';
import { Droppable } from './Droppable';
import Field from './Field';

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

export interface Approver {
  id: string;
  name: string;
  profile_pic: string;
}
export interface StateState {
  approvers: Approver[];
  id: string;
  state: string;
  order: number;
  inserted_at: string;
  updated_at: string;
}

export interface StateFormProps {
  onSave: any;
  states: StateState[];
  deleteState: React.MouseEventHandler;
  hidden?: boolean;
  onAttachApproval?: React.MouseEventHandler;
  dialog?: any;
  onSorted?: any;
}

interface ItemType {
  id: string;
  name?: string;
  approvers?: any[];
  meta?: any;
}

const StatesForm = ({
  states,
  deleteState,
  onAttachApproval,
  onSorted,
}: StateFormProps) => {
  // const [state, setState] = useState<ItemType[]>([]);

  const setOrder = (names: any) => {
    // new order

    if (names && names.length > 0) {
      const listItems: ItemType[] = [];

      names.map((name: any) => {
        const newItemx: ItemType = {
          id:
            (states &&
              states.filter((state: any) => state.state === name)[0]?.id) ||
            '',
          name: name,
        };
        if (newItemx.id !== '') {
          listItems.push(newItemx);
        }
      });

      // setState(listItems);

      const dbitems: any = [];

      listItems.map((dbi: any, index) => {
        dbitems.push({ id: dbi.id, order: index + 1 });
      });

      // send updates to server
      onSorted(dbitems);
    }
  };

  // useEffect(() => {
  //   if (states) {
  //     const listItems: ItemType[] = [];
  //     states.map((c: any) => {
  //       const newItemx: ItemType = {
  //         id: c?.id,
  //         name: c?.state,
  //         approvers: c?.approvers,
  //         meta: c,
  //       };
  //       listItems.push(newItemx);
  //     });

  //     setState(listItems);
  //   }
  // }, [states]);

  // console.log('states:', states, '/n state:', state);

  return (
    <Box>
      {states && (
        <Droppable
          states={states}
          setOrder={setOrder}
          onAttachApproval={onAttachApproval}
          deleteState={deleteState}
        />
      )}
    </Box>
  );
};

interface Props {
  setOpen?: any;
  setRerender?: any;
}

const FlowForm = ({ setOpen, setRerender }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm();
  const [edit, setEdit] = useState<boolean>(false);
  const [approval, setApproval] = useState<boolean>(false);
  const [states, setStates] = useState<StateState[]>();
  const [initialStates, setInitialStates] = useState<StateState[]>();
  const [flow, setFlow] = useState<Flow>();
  const errorRef = React.useRef<HTMLDivElement | null>(null);
  const [formStep, setFormStep] = useState(0);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  const onAttachApproval = (_d: any) => {
    setApproval(!approval);
    console.log('onAttachApproval', _d);
  };

  /**
   * Load all states for a particular Flow
   * @param id flow id
   * @param t  token
   */
  const loadStates = (id: string) => {
    fetchAPI(`flows/${id}/states`).then((data: any) => {
      console.log('👽flows/id/states', data);
      const res: States = data;
      const x: StateState[] = res.states.map((s: any) => {
        return s.state;
      });
      setInitialStates(x);
      setStates(x);
    });
  };

  /**
   * Load all states for a particular Flow
   * @param id flow id
   * @param t  token
   */
  const loadFlow = (fId: string) => {
    fetchAPI(`flows/${fId}`).then((data: any) => {
      console.log('👽flows:', data);
      const res: Flow = data.flow;
      setFlow(res);
      setValue('name', res?.name);
    });
  };

  useEffect(() => {
    console.log('🐼states:', states);
  }, [states]);

  /**
   * Create State
   * @param data Form Data
   */
  const CreateState = (data: any) => {
    if (states) {
      const newArr: StateState[] = [...states, data];
      setStates(newArr);
    }
    // if (cId) {
    //   postAPI(`flows/${cId}/states`, data).then(() => {
    //     console.log('🔥flows/id/states post:', data);
    //     loadStates(cId);
    //   });
    // } else {
    //   console.log('no flow id');
    // }
  };

  /**
   * Delete State
   * @param data Form Data
   */
  const deleteState = (name: any) => {
    // if (states) {
    //   const id = states.filter((state) => state.state === name)[0].id;
    //   deleteAPI(`states/${id}`).then(() => {
    //     console.log('🗑️ delete state/id');
    //     toast.success('Deleted a flow', {
    //       duration: 1000,
    //       position: 'top-right',
    //     });
    //     loadStates(cId);
    //   });
    // }
  };

  const onSubmit = async (data: any) => {
    if (edit) {
      putAPI(`flows/${cId}`, data).then(() => {
        toast.success('flow updated', {
          duration: 1000,
          position: 'top-right',
        });
        Router.push('/manage/flows');
      });
    } else {
      await postAPI('flows', data)
        .then(() => {
          toast.success('Flow created', {
            duration: 1000,
            position: 'top-right',
          });
          setOpen(false);
          setRerender((prev: boolean) => !prev);
        })
        .catch((error: any) => {
          toast.error(
            error?.response?.data?.errors?.name[0] || 'Flow created',
            {
              duration: 1000,
              position: 'top-right',
            },
          );
          if (errorRef.current) {
            const errorElement = errorRef.current;
            if (errorElement) {
              errorElement.innerText = error.response?.data?.errors?.name?.[0];
            }
          }
        });
    }
  };

  useEffect(() => {
    if (cId && cId.length > 0) {
      setEdit(true);
      loadStates(cId);
      loadFlow(cId);
    }
  }, [cId]);

  /**
   *
   */

  const updateState = (name: string) => {
    const newState = {
      state: name || '',
      order: (states?.length && states.length + 1) || 1,
      approvers: [],
    };

    CreateState(newState);
  };

  /**
   * Update Flow Order
   * @param data Form Data
   */ const onSorted = (data: any) => {
    const formative = {
      states: data,
    };

    putAPI(`flows/${cId}/align-states`, formative).then(() => {
      toast.success('Sorted flow state', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };

  function next() {
    setFormStep((i) => i + 1);
  }
  function prev() {
    setFormStep((i) => i - 1);
  }

  const goTo = (step: number) => {
    setFormStep(step);
  };

  return (
    <>
      <Flex
        as={'form'}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          height: '100dvh',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'auto',
        }}>
        <Text
          variant="pB"
          sx={{
            p: 4,
          }}>
          {edit ? 'Edit Flow' : 'Create new Flow'}
        </Text>
        <StepsIndicator
          titles={['Basic details', 'Flow states']}
          formStep={formStep}
          goTo={goTo}
        />
        <Container
          sx={{ p: 4, height: '100%', overflowY: 'hidden' }}
          data-flow={flow?.id}>
          <Flex sx={{ display: formStep === 0 ? 'block' : 'none' }}>
            <Box sx={{ width: '492px' }}>
              <Field
                name="name"
                label="Name"
                defaultValue=""
                register={register}
              />
              <Text variant="error" ref={errorRef} />
            </Box>
          </Flex>
          <Box
            sx={{
              display: formStep === 1 ? 'block' : 'none',
              height: 'calc( 100vh - 250px )',
              overflowY: 'auto',
              overflowX: 'visible',
            }}>
            {edit && states && (
              <StatesForm
                onAttachApproval={onAttachApproval}
                states={states}
                onSave={CreateState}
                deleteState={deleteState}
                onSorted={onSorted}
              />
            )}

            <Box
              sx={{
                p: '18px 0px 37px',
              }}>
              <Button
                type="button"
                variant="buttonSmall"
                onClick={() => updateState('name')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <IconWrapper p="out" size={16}>
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </IconWrapper>
                <Text variant="pM">Add State</Text>
              </Button>
            </Box>
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Container>
        <Flex sx={{ p: 4 }}>
          {formStep === 0 && (
            <Button
              type="button"
              onClick={() => {
                next();
                trigger();
              }}
              variant="buttonPrimary">
              Next
            </Button>
          )}
          {formStep === 1 && (
            <Box>
              <Button variant="buttonSecondary" type="button" onClick={prev}>
                Prev
              </Button>
              <Button
                disabled={!isValid}
                variant="buttonPrimary"
                type="submit"
                ml={2}>
                {edit ? 'Update' : 'Create'}
              </Button>
            </Box>
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default FlowForm;
