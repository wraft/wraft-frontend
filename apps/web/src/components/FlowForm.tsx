import React, { useEffect, useState } from 'react';

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
  content: StateElement[];
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
    <Box p={4}>
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
        sx={{ mr: 2, p: 2, px: 3, mt: 2 }}
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
  id: number;
  name?: string;
  meta?: any;
}

const StatesForm = ({
  content,
  onDelete,
  onAttachApproval,
  onSorted,
}: StateFormProps) => {
  const [state, setState] = useState<ItemType[]>([]);
  useEffect(() => {
    console.log(state);
  }, [state]);

  const onDeleteFlow = (_id: any) => {
    onDelete(_id);
  };

  const setOrder = (content: any) => {
    console.log('e', content);

    // new order

    if (content.size > 0) {
      const listItems: ItemType[] = [];

      content.map((c: any) => {
        const newItemx: ItemType = { id: c?.id, name: c?.name };
        listItems.push(newItemx);
      });

      setState(listItems);

      const dbitems: any = [];

      listItems.map((dbi: any, index) => {
        dbitems.push({ id: dbi.id, order: index });
      });

      // send updates to server
      onSorted(dbitems);
    }
  };

  useEffect(() => {
    if (content) {
      const listItems: ItemType[] = [];
      content.map((c: any) => {
        const newItemx: ItemType = {
          id: c?.state.id,
          name: c?.state.state,
          meta: state,
        };
        listItems.push(newItemx);
      });

      setState(listItems);
    }
  }, [content]);

  return (
    <Box p={0}>
      <Box sx={{ pb: '12px', pt: '32px' }}>
        <Text variant="sectiontitle" sx={{ mb: 0, mt: 0, color: 'grey' }}>
          Flow states
        </Text>
      </Box>
      {content && (
        <Box
          mb={0}
          sx={{
            border: '1px solid #E4E9EF',
            borderRadius: '4px 4px 4px 4px',
          }}>
          <Droppable
            list={state}
            setList={setOrder}
            onAttachApproval={onAttachApproval}
            onDeleteFlow={onDeleteFlow}></Droppable>
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
  const [content, setContent] = useState<StateElement[]>();
  const [flow, setFlow] = useState<Flow>();
  const errorRef = React.useRef<HTMLDivElement | null>(null);

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
      setContent(res.states);
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
      order: 1,
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

    putAPI(`/flows/${cId}/align-states`, formative).then(() => {
      toast.success('Sorted flow state', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };

  return (
    <Box sx={{ px: '32px', pb: 3, backgroundColor: 'white', width: '556px' }}>
      <Box>
        <Container sx={{ p: 0 }} data-flow={flow?.id}>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Flex>
              <Box sx={{ pt: '30px', width: '492px' }}>
                <Field
                  name="name"
                  label="Name"
                  defaultValue=""
                  register={register}
                />
                <Text variant="error" ref={errorRef} />
              </Box>
              {/* <Box sx={{ pt: '12px', ml: 3 }}>
                <Button variant="btnPrimaryBig" type="submit" mt={3}>
                  Save
                </Button>
              </Box> */}
            </Flex>
            <Box mt={0}>
              <Modal isOpen={approval} onClose={() => setAddState(false)}>
                <ApprovalFormBase
                  closeModal={() => setApproval(false)}
                  states={content}
                  parent={cId}
                />
              </Modal>

              {edit && content && (
                <StatesForm
                  onAttachApproval={onAttachApproval}
                  content={content}
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

              <Flex>
                <Button
                  variant="btnPrimary"
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    py: '8px',
                    px: '16px',
                  }}
                  type="submit">
                  Save
                </Button>
              </Flex>

              <Modal
                isOpen={addState}
                onClose={() => setAddState(false)}
                label="Add State"
                aria-label="Add New State">
                <StateStateForm
                  onSave={updateState}
                  setAddState={setAddState}
                />
              </Modal>
            </Box>
            {errors.exampleRequired && <Text>This field is required</Text>}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default FlowForm;
