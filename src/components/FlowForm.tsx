import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Button,
  Text,
  Input,
  Label,
  Flex,
  // Select,
} from 'theme-ui';
import { useStoreState } from 'easy-peasy';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';

import {
  createEntity,
  deleteEntity,
  loadEntity,
  updateEntity,
} from '../utils/models';

import ApprovalFormBase from './ApprovalCreate';
import Field from './Field';
import Modal from './Modal';
// import PageHeader from './PageHeader';

import { ReactSortable } from 'react-sortablejs';

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
  onDelete: any;
  hidden?: boolean;
  onAttachApproval?: any;
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showApproval, setShowApproval] = useState<boolean>(false);

  const [state, setState] = useState<ItemType[]>([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const changeForm = (data: any) => {
    onAttachApproval(data);
    setShowApproval(true);
    toggleModal();
  };

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
      <Box sx={{ pb: 3 }}>
        <Text as="h4" variant="sectiontitle" sx={{ mb: 0, mt: 0 }}>
          All States {showApproval}
        </Text>
        <Text
          as="p"
          variant="sectiontitle"
          sx={{ color: 'gray.6', mb: 2, mt: 0 }}>
          Manage your flows
        </Text>
      </Box>
      {content && (
        <Box
          mb={0}
          sx={{
            borderBottom: 'solid 1px',
            borderColor: 'gray.2',
          }}>
          <ReactSortable list={state} setList={setOrder}>
            {state.map((c: ItemType, index) => (
              <Flex
                key={index}
                sx={{
                  p: 3,
                  bg: 'gray.0',
                  border: 'solid 1px',
                  borderBottom: 0,
                  borderColor: 'gray.4',
                  h6: { opacity: 1 },
                  ':hover': { h6: { opacity: 1 } },
                }}>
                <Text mr={2} sx={{ color: 'gray.6', fontWeight: 300 }}>
                  {index + 1}
                </Text>
                <Text
                  sx={{ fontWeight: 'heading', color: 'gray.9' }}
                  key={c.id}
                  data-rel={c.id}>
                  {c.name}
                </Text>
                <Flex sx={{ ml: 'auto' }}>
                  <Button
                    sx={{
                      mx: 3,
                      fontSize: 0,
                      fontWeight: 600,
                      fontFamily: 'heading',
                      textTransform: 'uppercase',
                    }}
                    variant="btnSecondary"
                    onClick={() => changeForm(c)}>
                    Add Approval
                  </Button>
                  <Button
                    variant="btnSecondary"
                    onClick={() => onDeleteFlow(c.id)}
                    sx={{
                      ml: 'auto',
                      fontSize: 0,
                      fontWeight: 600,
                      fontFamily: 'heading',
                      textTransform: 'uppercase',
                    }}>
                    Delete
                  </Button>
                </Flex>
              </Flex>
            ))}
          </ReactSortable>
        </Box>
      )}
    </Box>
  );
};

interface Props {
  setOpen: any;
  setRerender: any;
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

  const token = useStoreState((state) => state.auth.token);

  const { addToast } = useToasts();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  const onAttachApproval = (_d: any) => {
    setApproval(!approval);
    console.log('onAttachApproval', _d);
  };

  /**
   * Map states to types, and states
   * @param data
   */
  const loadStatesSuccess = (data: any) => {
    const res: States = data;
    setContent(res.states);
  };

  const loadFlowSuccess = (data: any) => {
    const res: Flow = data.flow;
    setFlow(res);
    setValue('name', res?.name);
  };

  /**
   * Load all states for a particular Flow
   * @param id flow id
   * @param t  token
   */
  const loadStates = (id: string, t: string) => {
    const tok = token ? token : t;
    loadEntity(tok, `flows/${id}/states`, loadStatesSuccess);
  };

  /**
   * Load all states for a particular Flow
   * @param id flow id
   * @param t  token
   */
  const loadFlow = (fId: string, t: string) => {
    const tok = token ? token : t;
    loadEntity(tok, `flows/${fId}`, loadFlowSuccess);
  };

  /**
   * Create State
   * @param data Form Data
   */
  const CreateState = (data: any) => {
    createEntity(data, `flows/${cId}/states`, token, onCreateState);
  };

  /**
   * Delete State
   * @param data Form Data
   */
  const deleteState = (fId: any) => {
    deleteEntity(`states/${fId}`, token);

    addToast('Deleted a flow', { appearance: 'error' });

    loadStates(cId, token);
  };

  const onCreateState = () => {
    if (cId && token) {
      loadStates(cId, token);
    }
  };

  /**
   * Submit Form
   * @param data Form Data
   */
  const onSubmit = async (data: any) => {
    await createEntity(data, 'flows', token);
    setOpen(false);
    setTimeout(() => {
      setRerender((prev: boolean) => !prev);
    }, 0);
    // Router.push('/manage/flows');
  };

  useEffect(() => {
    if (cId && cId.length > 0) {
      setEdit(true);
      loadStates(cId, token);
      loadFlow(cId, token);
    }
  }, [cId, token]);

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

  const onSortSuccess = () => {
    addToast('Sorted flow state', { appearance: 'success' });
  };

  /**
   * Update Flow Order
   * @param data Form Data
   */
  const onSortDone = (data: any) => {
    const formative = {
      states: data,
    };

    token &&
      updateEntity(
        `/flows/${cId}/align-states`,
        formative,
        token,
        onSortSuccess,
      );
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      {/* <PageHeader
        title={cId ? 'Edit Flows' : 'Create Flows'}
        desc="Mange document flows"
        breads={true}
      /> */}

      <Box
        sx={{
          mt: 4,
          // borderRadius: 5,
          // maxWidth: '80ch',
          // mx: 'auto',
          // border: 'solid 1px',
          // borderColor: 'gray.4',
        }}>
        <Container
          // variant="layout.pageFrame"
          sx={{ p: 0 }}
          data-flow={flow?.id}>
          <Box
            as="form"
            // sx={{ flexWrap: 'wrap', alignContent: 'flex-start' }}
            onSubmit={handleSubmit(onSubmit)}>
            <Flex
              // variant="layout.pageFrame"
              sx={
                {
                  // flexWrap: 'wrap',
                  // borderBottom: 'solid 1px',
                  // borderColor: 'gray.4',
                  // flexGrow: 1,
                }
              }>
              {/* <Box mx={0} mb={3} as="form" onSubmit={handleSubmit(onSubmit)}> */}
              {/* <Box sx={{ flexGrow: 1 }}> */}
              <Box>
                <Field
                  name="name"
                  label="Name"
                  defaultValue=""
                  register={register}
                />
              </Box>
              <Box sx={{ pt: '12px', ml: 3 }}>
                <Button variant="btnPrimaryBig" type="submit" mt={3}>
                  Save
                </Button>
              </Box>
            </Flex>
            <Box
              //  variant="layout.pageFrame"
              sx={{ pt: 3 }}>
              <Box mt={0}>
                <Modal isOpen={approval} onClose={() => setAddState(false)}>
                  <ApprovalFormBase
                    closeModal={() => setApproval(false)}
                    isOpen={approval}
                    states={content}
                    parent={cId}
                  />
                </Modal>

                {edit && content && (
                  <StatesForm
                    onAttachApproval={onAttachApproval}
                    content={content}
                    // dialog={dialog2}
                    onSave={CreateState}
                    onDelete={deleteState}
                    onSorted={onSortDone}
                  />
                )}

                <Flex
                // sx={{
                //   px: 3,
                //   py: 3,
                //   bg: 'gray.2',
                //   borderTop: 'solid 1px',
                //   borderLeft: 'solid 1px',
                //   borderBottom: 'solid 1px',
                //   borderColor: 'gray.4',
                //   h6: { opacity: 1 },
                //   ':hover': { h6: { opacity: 1 } },
                // }}
                >
                  <Button
                    variant="btnPrimary"
                    sx={{ fontSize: 1, p: 2, px: 3 }}
                    onClick={() => setAddState(true)}>
                    Add State
                  </Button>
                </Flex>

                <Modal
                  isOpen={addState}
                  onClose={() => setAddState(false)}
                  label="ModalX"
                  aria-label="Add New State">
                  <StateStateForm
                    onSave={updateState}
                    setAddState={setAddState}
                  />
                </Modal>
              </Box>
            </Box>
            {errors.exampleRequired && <Text>This field is required</Text>}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default FlowForm;
