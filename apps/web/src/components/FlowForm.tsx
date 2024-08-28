import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Container, Button, Text, Flex } from 'theme-ui';
import { AddIcon } from '@wraft/icon';

import { postAPI, deleteAPI, fetchAPI, putAPI } from '../utils/models';
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
  type: string;
  order: number;
  inserted_at: string;
  updated_at: string;
  error?: string | undefined;
}

export interface StateFormProps {
  states: StateState[];
  setStates: (e: StateState[]) => void;
  highestOrder: number;
}

const StatesForm = ({ states, setStates, highestOrder }: StateFormProps) => {
  return (
    <Box>
      {states && (
        <Droppable
          states={states}
          setStates={setStates}
          highestOrder={highestOrder}
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
  const [highestOrder, setHighestOrder] = useState<number>(0);
  const [states, setStates] = useState<StateState[]>();
  const [initialStates, setInitialStates] = useState<StateState[]>();
  const [flow, setFlow] = useState<Flow>();
  const errorRef = React.useRef<HTMLDivElement | null>(null);
  const [formStep, setFormStep] = useState(0);
  const [cId, setCId] = useState<string>('');

  // determine edit state based on URL
  const router = useRouter();
  const flowId: string = router.query.id as string;

  useEffect(() => {
    setCId(flowId);
  }, [flowId]);

  /**
   * Load all states for a particular Flow
   * @param id flow id
   * @param t  token
   */
  const loadStates = (id: string) => {
    fetchAPI(`flows/${id}/states`).then((data: any) => {
      const res: StateElement[] = data;
      const x: any = res
        .map((s: any) => {
          return s.state;
        })
        .sort((a, b) => a.order - b.order);
      const bigOrderItem: StateState = x.reduce(
        (prev: StateState, current: StateState) => {
          return prev.order > current.order ? prev : current;
        },
      );
      setHighestOrder(bigOrderItem.order);

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
      const res: Flow = data.flow;
      setFlow(res);
      setValue('name', res?.name);
    });
  };

  useEffect(() => {}, [states]);

  const onSubmit = async (data: any) => {
    const itemsAreEqual = (item1: StateState, item2: StateState) => {
      return (
        item1.approvers === item2.approvers &&
        item1.state === item2.state &&
        item1.type === item2.type &&
        item1.order === item2.order
      );
    };

    if (states) {
      const checkedStates = states.map((e) => {
        return {
          ...e,
          error:
            e.approvers.length === 0
              ? 'Please add approvers for this state'
              : undefined,
        };
      });
      if (checkedStates.some((e) => e.approvers.length === 0)) {
        setStates(checkedStates);
        return;
      }
    }

    if (edit) {
      if (states && initialStates) {
        const existingStates = states.filter((state) =>
          initialStates.some((s) => s.id === state.id),
        );

        const newStates = states.filter(
          (state) => !initialStates.some((s) => s.id === state.id),
        );

        const removedStates = initialStates.filter(
          (state) => !existingStates.some((s) => s.id === state.id),
        );

        const changedStates = existingStates.filter((state) => {
          const initialItem = initialStates.find((e) => e.id === state.id);
          return !initialItem || !itemsAreEqual(state, initialItem);
        });

        const updateDataArr = changedStates.map((changedItem) => {
          const initialItem = initialStates.find(
            (item) => item.id === changedItem.id,
          ) as StateState;
          const initialApproversIds = initialItem.approvers.map(
            (approver) => approver.id,
          );
          const changedApproversIds = changedItem.approvers.map(
            (approver) => approver.id,
          );

          const addedApprovers = changedApproversIds.filter(
            (id) => !initialApproversIds.includes(id),
          );
          const removedApprovers = initialApproversIds.filter(
            (id) => !changedApproversIds.includes(id),
          );

          return {
            id: changedItem.id,
            state: changedItem.state,
            type: changedItem.type,
            //used initial order cause backend throws error order already exists
            order: initialItem.order,
            approvers: {
              add: addedApprovers,
              remove: removedApprovers,
            },
          };
        });

        const createDataArr = newStates.map((newItem, index) => {
          return {
            state: newItem.state,
            type: newItem.type,
            order: highestOrder + 1 + index,
            approvers: newItem.approvers.map((approver) => approver.id),
          };
        });

        const CreateReqs = createDataArr.map((data) => {
          return postAPI(`flows/${cId}/states`, data);
        });
        const UpdateReqs = updateDataArr.map((updateData) => {
          const { id, ...data } = updateData;
          return putAPI(`states/${id}`, data);
        });
        const DeleteReqs = removedStates.map((s) => {
          deleteAPI(`states/${s.id}`);
        });
        const allReqs = Promise.all([
          ...CreateReqs,
          ...UpdateReqs,
          ...DeleteReqs,
        ]);
        toast.promise(allReqs, {
          loading: 'Updating states',
          success: () => {
            fetchAPI(`flows/${cId}/states`).then(async (data: StateState[]) => {
              const res: StateState[] = data;
              const x: StateState[] = res
                .map((s: any) => {
                  return s.state;
                })
                .sort((a, b) => a.order - b.order);
              type Align = {
                states: {
                  order: number;
                  id: string;
                }[];
              };
              const alignData: Align = {
                states: x.map((state) => {
                  return {
                    order:
                      states.find((s) => s.state === state.state)?.order || 0,
                    id: state.id,
                  };
                }),
              };
              await putAPI(`flows/${cId}/align-states`, alignData).then(() => {
                toast.success('Sorted flow state', {
                  duration: 1000,
                  position: 'top-right',
                });
                setRerender((pre: boolean) => !pre);
              });

              await putAPI(`flows/${cId}`, data).then(() => {
                toast.success('flow updated', {
                  duration: 1000,
                  position: 'top-right',
                });
                setOpen(false);
                setRerender((prev: boolean) => !prev);
              });
            });
            return 'States updated';
          },
          error: 'Error updating states',
        });
      }
    } else {
      await postAPI('flows', data)
        .then((data: any) => {
          toast.success('Flow created', {
            duration: 1000,
            position: 'top-right',
          });
          setCId(data?.id);
          if (errorRef.current) {
            const errorElement = errorRef.current;
            if (errorElement) {
              errorElement.innerText = '';
            }
          }
          next();
        })
        .catch((error: any) => {
          toast.error(
            error?.response?.data?.errors?.name[0] || 'Failed to create flow',
            {
              duration: 1000,
              position: 'top-right',
            },
          );
          if (errorRef.current) {
            const errorElement = errorRef.current;
            if (errorElement) {
              errorElement.innerText =
                error.response?.data?.errors?.name?.[0] || 'Already exists';
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

  const AddState = () => {
    const newState: StateState = {
      id: Math.random().toString(),
      state: '',
      type: '',
      order: highestOrder + 1,
      approvers: [],
      inserted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (states) {
      const newArr: StateState[] = [...states, newState];
      setStates(newArr);
    }
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
              overflowY: 'scroll',
              overflowX: 'hidden',
              pr: 3,
              ':-webkit-scrollbar': {
                width: '5px',
                '&-track': {
                  background: 'red.500',
                },
                '&-thumb': {
                  borderColor: 'gray.900',
                  borderRadius: '6px',
                },
              },
            }}>
            {edit && states && (
              <StatesForm
                states={states}
                setStates={setStates}
                highestOrder={highestOrder}
              />
            )}

            <Box
              sx={{
                p: '18px 0px 37px',
              }}>
              <Button
                type="button"
                variant="buttonSmall"
                onClick={() => AddState()}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: 'border',
                  bg: 'white',
                  color: 'green.700',
                  cursor: 'pointer',
                }}>
                <AddIcon width={14} height={14} />
                <Text as="p" variant="pM" color="green.700">
                  Add Flow Step
                </Text>
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
                trigger();
                if (!edit) {
                  handleSubmit(onSubmit)();
                } else {
                  next();
                }
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
