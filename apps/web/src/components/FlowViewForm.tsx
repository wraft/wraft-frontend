import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Box, Container, Label } from 'theme-ui';

import { fetchAPI } from '../utils/models';

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

const FlowViewForm = () => {
  const { register, setValue } = useForm();
  // const [edit, setEdit] = useState<boolean>(false);
  // const [content, setContent] = useState<StateElement[]>();
  const [flow, setFlow] = useState<Flow>();
  const [states, setStates] = useState<any>();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  // /**
  //  * Load all states for a particular Flow
  //  * @param id flow id
  //  * @param t  token
  //  */
  // const loadStates = (id: string) => {
  //   fetchAPI(`flows/${id}/states`).then((data: any) => {
  //     const res: States = data;
  //     setContent(res.states);
  //   });
  // };

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
      // setEdit(true);
      // loadStates(cId);
      loadFlow(cId);
    }
  }, [cId]);

  return (
    <Box sx={{ px: 4, pb: 3, backgroundColor: 'white', width: '556px' }}>
      <Container data-flow={flow?.id}>
        <Box as="form">
          <Box sx={{ pt: 4, width: '100%' }}>
            <Field
              name="name"
              label="Name"
              defaultValue=""
              register={register}
            />
          </Box>
          <Box pt={4}>
            <Label>Flow states</Label>
            {states &&
              states.map((item: any, index: number) => {
                return <Box key={index}>{item.state}</Box>;
              })}
          </Box>

          {/* {edit &&
            content?.map((item: any, index: number) => (
              <Box key={index}>{item}</Box>
            ))} */}
        </Box>
      </Container>
    </Box>
  );
};
export default FlowViewForm;
