import React from 'react';
import { Box, Flex, Button, Text } from 'theme-ui';
import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';
import Router from 'next/router';

import Field from './Field';
import { createEntity } from '../utils/models';

const ThemeForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const { addToast } = useToasts();
  
  const token = useStoreState(state => state.auth.token);

  /**
   * On Theme Created
   */
  const onDone = (_d:any) => {
    addToast('Saved Successfully', { appearance: 'success' });
    Router.push(`/themes`);
  }
  
  const onSubmit = (data: any) => {
    const submitter = {
      name: data.name,
      font: data.font,
      typescale:  { h1: 21, h2: 22},
    }
    createEntity(submitter, 'themes', token, onDone)    
  };  

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      <Box>
        <Text mb={3}>
          Create Theme
        </Text>
      </Box>
      <Box mx={0} mb={3}>
        <Flex>
          <Box>
            <Field
              name="name"
              label="Name"
              defaultValue="New Theme"
              register={register}
            />
            <Field
              name="font"
              label="Font"
              defaultValue="Roboto"
              register={register}
            />
            <Field
              name="typescale"
              label="Typescale"
              defaultValue="1.25"
              register={register}
            />
          </Box>          
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
      </Box>
      <Button ml={2}>Create</Button>
    </Box>
  );
};
export default ThemeForm;
