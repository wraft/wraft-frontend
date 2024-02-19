import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Container, Text, Flex } from 'theme-ui';

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
  console.log(state);

  const onDeleteFlow = (_id: any) => {
    onDelete(_id);
  };

  const setOrder = (content: any) => {
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

const FlowViewForm = () => {
  const { register, setValue } = useForm();
  const [edit, setEdit] = useState<boolean>(false);
  const [approval, setApproval] = useState<boolean>(false);
  const [content, setContent] = useState<StateElement[]>();
  const [flow, setFlow] = useState<Flow>();

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

  useEffect(() => {
    if (cId && cId.length > 0) {
      setEdit(true);
      loadStates(cId);
      loadFlow(cId);
    }
  }, [cId]);

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
    <Box sx={{ px: 4, pb: 3, backgroundColor: 'white', width: '556px' }}>
      <Box>
        <Container data-flow={flow?.id}>
          <Box as="form">
            <Flex>
              <Box sx={{ pt: '30px', width: '492px' }}>
                <Field
                  name="name"
                  label="Name"
                  defaultValue=""
                  register={register}
                />
              </Box>
            </Flex>

            {edit && content && (
              <StatesForm
                onAttachApproval={onAttachApproval}
                content={content}
                onSave={CreateState}
                onDelete={deleteState}
                onSorted={onSortDone}
              />
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default FlowViewForm;
