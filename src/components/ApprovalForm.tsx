import React, { useEffect, useState } from 'react';
import { Box, Container, Button, Text, Divider, Flex, Select } from 'theme-ui';
import { useStoreState } from 'easy-peasy';
import { useForm } from 'react-hook-form';

import Field from './Field';
import { useRouter } from 'next/router';
import { createEntity, deleteEntity, loadEntity } from '../utils/models';
import { useToasts } from 'react-toast-notifications';

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
}

const StatesForm = (props: StateFormProps) => {
  // const [stat, setStat] = useState('');
  //
  const [showModal, setShowModal] = useState<boolean>(false);
  // const { addToast } = useToasts();

  // function closeModal() {
  //   setShowModal(false);
  // }

  function toggleModal() {
    setShowModal(!showModal);
  }

  // const updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setStat(e.target.value);
  // };

  const onDeleteFlow = (_id: any) => {
    props.onDelete(_id);
  };

  // const AddState = () => {
  //   const newState = {
  //     state: stat,
  //     order: -1,
  //   };

  //   props.onSave(newState);
  //   setStat('');

  //   closeModal();

  //   addToast(`Added ${stat} to Flow`, { appearance: 'success' })

  // };

  return (
    <Box p={2}>
      <Text variant="caps" sx={{ color: 'gray.7' }} pb={3}>
        All States
      </Text>
      {props.content && (
        <Box
          mb={4}
          sx={{
            borderBottom: 'solid 1px',
            borderColor: 'blue.2',
          }}
        >
          {props.content.map((c: StateElement, index) => (
            <Flex
              key={index + 1}
              sx={{
                p: 3,
                bg: 'blue.0',
                border: 'solid 1px',
                borderBottom: 0,
                borderColor: 'blue.2',
              }}
            >
              <Text mr={2} sx={{ color: 'blue.6' }}>
                {index + 1}
              </Text>
              <Text
                sx={{ fontWeight: 'heading', color: 'blue.9' }}
                key={c.state.id}
              >
                {c.state.state}
              </Text>
              <Text
                onClick={() => onDeleteFlow(c.state.id)}
                sx={{ ml: 'auto' }}
              >
                Delete
              </Text>
            </Flex>
          ))}
        </Box>
      )}
      <Button variant="btnSecondary" onClick={toggleModal}>
        Add New
      </Button>
    </Box>
  );
};

const ApprovalForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const [edit, setEdit] = useState<boolean>(false);
  const [content, setContent] = useState<StateElement[]>();

  const token = useStoreState((state) => state.auth.token);

  const { addToast } = useToasts();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  /**
   * Map states to types, and states
   * @param data
   */
  const loadStatesSuccess = (data: any) => {
    const res: States = data;
    setContent(res.states);
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

  const onCreateState = (_x: any) => {
    if (cId && token) {
      loadStates(cId, token);
    }
  };

  /**
   * Submit Form
   * @param data Form Data
   */
  const onSubmit = (data: any) => {
    createEntity(data, 'flows', token);
  };

  // const loadSearchSuccess = (d: any) => {
  //   console.log('d', d);
  // };

  // /**
  //  * Search User
  //  * @param data
  //  */
  // const onChangeInput = (data: any) => {
  //   console.log('data', data);
  //   // loadEntity(token, `users/search?key=${data}`, loadSearchSuccess);
  // };

  useEffect(() => {
    if (cId && cId.length > 0) {
      setEdit(true);
      loadStates(cId, token);
    }
  }, [cId, token]);

  return (
    <Box py={3} mt={4}>
      <Box>
        <Container sx={{ maxWidth: '70ch', mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Text variant="pagetitle">Create Approval Flow</Text>
          </Box>
          <Box>
            <Box mx={0} mb={3} as="form" onSubmit={handleSubmit(onSubmit)}>
              <Field
                name="name"
                label="Name"
                defaultValue="Standard Approval Flow (Offer Letter)"
                register={register}
              />
              <Flex sx={{ p: 2, bg: 'gray.2', my: 4 }}>
                <Select>
                  <option></option>
                </Select>

                <Field
                  name="name"
                  label="After"
                  defaultValue="Approved (F02)"
                  register={register}
                />
              </Flex>
              <Field
                name="name"
                label="Approver"
                defaultValue="Muneef Hameed (U01)"
                register={register}
              />
              <Button variant="btnPrimary" type="submit" mt={3}>
                Save
              </Button>
            </Box>
            <Divider sx={{ color: 'gray.3', my: 4 }} />
            <Box mt={2}>
              {edit && content && (
                <StatesForm
                  content={content}
                  onSave={CreateState}
                  onDelete={deleteState}
                />
              )}
            </Box>
            {errors.exampleRequired && <Text>This field is required</Text>}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default ApprovalForm;
