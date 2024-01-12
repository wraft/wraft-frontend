import React from 'react';

import Router from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text } from 'theme-ui';

import { postAPI } from '../utils/models';

import Field from './Field';

const VendorForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * On Theme Created
   */
  const onDone = () => {
    toast.success('Saved Successfully', {
      duration: 1000,
      position: 'top-right',
    });
    Router.push(`/vendors`);
  };

  const onSubmit = (data: any) => {
    const submitter = {
      name: data.name,
      font: data.font,
      typescale: { h1: 21, h2: 22 },
      reg_no: data.reg_no,
      phone: data.phone,
      gstin: data.gstin,
      email: data.email,
      contact_person: data.contact_person,
      address: data.address,
    };
    postAPI('vendors', submitter).then(() => {
      onDone();
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      <Box>
        <Text mb={3}>Create Vendor</Text>
      </Box>
      <Box mx={0} mb={3}>
        <Flex>
          <Box>
            <Field
              name="reg_no"
              label="Registration No"
              defaultValue=""
              register={register}
            />
            <Field
              name="phone"
              label="Phone"
              defaultValue=""
              register={register}
            />
            <Field
              name="name"
              label="Name"
              defaultValue="1.25"
              register={register}
            />

            <Field
              name="gstin"
              label="gstin"
              defaultValue=""
              register={register}
            />
            <Field
              name="email"
              label="email"
              defaultValue=""
              register={register}
            />

            <Field
              name="contact_person"
              label="contact_person"
              defaultValue=""
              register={register}
            />
            <Field
              name="address"
              label="address"
              defaultValue=""
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
export default VendorForm;
