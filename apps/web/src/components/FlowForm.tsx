import React, { useEffect, useState } from 'react';

import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Container, Button, Text, Input, Label, Flex } from 'theme-ui';

import { postAPI, deleteAPI, fetchAPI, putAPI } from '../utils/models';

import ApprovalFormBase from './ApprovalCreate';
import { IconWrapper } from './Atoms';
import { Droppable } from './Droppable';
import Field from './Field';
import Modal from './Modal';

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
  states: StateElement[];
  onSave: any;
  onDelete: React.MouseEventHandler;
  hidden?: boolean;
  onAttachApproval?: React.MouseEventHandler;
  dialog?: any;
  onSorted?: any;
}

/**
 * Create State
 * @param props
 * @returns
 */

interface StateStateFormProps {
  onSave: any;
  setAddState: any;
}

const StateStateForm = ({ onSave, setAddState }: StateStateFormProps) => {
  const [newState, setNewState] = useState<string | any>(null);

  const onChangeInput = (e: any) => {
    setNewState(e.currentTarget.value);
  };

  return (
    <Box p={4} sx={{ minWidth: '400px' }}>
      <Box>
        <Label>State Name</Label>
        <Input
          name="state_name"
          placeholder="New State Name"
          onChange={onChangeInput}
        />
      </Box>
      <Button
        type="button"
        variant="btnPrimary"
        sx={{ p: 2, px: 3, mt: 3 }}
        onClick={() => {
          onSave(newState);
          setAddState(false);
        }}>
        Add State
      </Button>
    </Box>
  );
};

/**
 * Big Form
 * @param props
 * @returns
 */

interface ItemType {
  id: string;
  name?: string;
  meta?: any;
}

const StatesForm = ({
  states,
  onDelete,
  onAttachApproval,
  onSorted,
}: StateFormProps) => {
  const [state, setState] = useState<ItemType[]>([]);

  const onDeleteFlow = (_id: any) => {
    onDelete(_id);
  };

  const setOrder = (names: any) => {
    // new order

    if (names && names.length > 0) {
      const listItems: ItemType[] = [];

      names.map((name: any) => {
        const newItemx: ItemType = {
          id:
            (states &&
              states.filter((state: any) => state.state.state === name)[0]
                ?.state?.id) ||
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

  useEffect(() => {
    if (states) {
      const listItems: ItemType[] = [];
      states.map((c: any) => {
        const newItemx: ItemType = {
          id: c?.state.id,
          name: c?.state.state,
          meta: state,
        };
        listItems.push(newItemx);
      });

      setState(listItems);
    }
  }, [states]);

  return (
    <Box>
      <Label>Flow states</Label>
      {states && (
        <Box
          mb={0}
          sx={{
            border: '1px solid #E4E9EF',
            borderRadius: '4px 4px 4px 4px',
          }}>
          <Droppable
            list={state}
            setOrder={setOrder}
            onAttachApproval={onAttachApproval}
            onDeleteFlow={onDeleteFlow}
          />
        </Box>
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
    formState: { errors },
  } = useForm();
  const [edit, setEdit] = useState<boolean>(false);
  const [approval, setApproval] = useState<boolean>(false);
  const [addState, setAddState] = useState<boolean>(false);
  const [states, setStates] = useState<StateElement[]>();
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
      const res: States = data;
      setStates(res.states);
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

  /**
   * Create State
   * @param data Form Data
   */
  const CreateState = (data: any) => {
    postAPI(`flows/${cId}/states`, data).then(() => {
      if (cId) {
        loadStates(cId);
      }
    });
  };

  /**
   * Delete State
   * @param data Form Data
   */
  const deleteState = (fId: any) => {
    deleteAPI(`states/${fId}`).then(() => {
      toast.success('Deleted a flow', {
        duration: 1000,
        position: 'top-right',
      });
      loadStates(cId);
    });
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
        .then((error: any) => {
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
              errorElement.innerText = error.response.data.errors.name[0];
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

  const updateState = (e: any) => {
    const newState = {
      state: e,
      order: (states?.length && states.length + 1) || 1,
    };

    CreateState(newState);
  };

  /**
   * Update Flow Order
   * @param data Form Data
   */
  const onSortDone = (data: any) => {
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
          <Box sx={{ display: formStep === 1 ? 'block' : 'none' }}>
            {edit && states && (
              <StatesForm
                onAttachApproval={onAttachApproval}
                states={states}
                onSave={CreateState}
                onDelete={deleteState}
                onSorted={onSortDone}
              />
            )}

            <Box
              sx={{
                p: '18px 0px 37px',
              }}>
              <Button
                type="button"
                variant="btnSecondary"
                onClick={() => setAddState(true)}
                sx={{
                  fontWeight: 'bold',
                  fontSize: 2,
                  display: 'flex',
                  gap: 2,
                }}>
                <IconWrapper p="out" size={16}>
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </IconWrapper>
                Add State
              </Button>
            </Box>
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Container>
        <Flex sx={{ p: 4 }}>
          {formStep === 0 && (
            <Button type="button" onClick={next} variant="buttonPrimary">
              Next
            </Button>
          )}
          {formStep === 1 && (
            <Box>
              <Button variant="buttonSecondary" type="button" onClick={prev}>
                Prev
              </Button>
              <Button variant="buttonPrimary" type="submit" ml={2}>
                {edit ? 'Update' : 'Create'}
              </Button>
            </Box>
          )}
        </Flex>
      </Flex>
      <Modal isOpen={approval} onClose={() => setAddState(false)}>
        <ApprovalFormBase
          closeModal={() => setApproval(false)}
          states={states}
          parent={cId}
        />
      </Modal>
      <Modal
        isOpen={addState}
        onClose={() => setAddState(false)}
        label="Add State"
        aria-label="Add New State">
        <StateStateForm onSave={updateState} setAddState={setAddState} />
      </Modal>
    </>
  );
};
export default FlowForm;
