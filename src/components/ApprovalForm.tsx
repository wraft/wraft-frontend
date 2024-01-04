import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Container, Button, Text, Divider, Flex, Select } from 'theme-ui';

import { fetchAPI, postAPI, deleteAPI } from '../utils/models';

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
          }}>
          {props.content.map((c: StateElement, index) => (
            <Flex
              key={index + 1}
              sx={{
                p: 3,
                bg: 'blue.0',
                border: 'solid 1px',
                borderBottom: 0,
                borderColor: 'blue.2',
              }}>
              <Text mr={2} sx={{ color: 'blue.6' }}>
                {index + 1}
              </Text>
              <Text
                sx={{ fontWeight: 'heading', color: 'blue.9' }}
                key={c.state.id}>
                {c.state.state}
              </Text>
              <Text
                onClick={() => onDeleteFlow(c.state.id)}
                sx={{ ml: 'auto' }}>
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [edit, setEdit] = useState<boolean>(false);
  const [content, setContent] = useState<StateElement[]>();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

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
    deleteAPI(`states/${fId}`)
      .then(() => {
        toast.success('Deleted a flow', {
          duration: 1000,
          position: 'top-right',
        });
        loadStates(cId);
      })
      .catch(() => {
        toast.error('failed Deleted a flow', {
          duration: 1000,
          position: 'top-right',
        });
      });
  };

  /**
   * Submit Form
   * @param data Form Data
   */
  const onSubmit = (data: any) => {
    postAPI('flows', data);
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
      loadStates(cId);
    }
  }, [cId]);

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
