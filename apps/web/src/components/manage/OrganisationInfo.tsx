import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, Box, Flex, Field, InputText } from '@wraft/ui';

import { useAuth } from 'contexts/AuthContext';
import { putAPI, fetchAPI } from 'utils/models';

export interface Profile {
  allergies?: string[];
  profile: ProfileClass;
  risks?: string[];
}

export interface ProfileClass {
  activity_level_id: string;
  calory_range_id: string;
  dob: string;
  gender: string;
  goal_id: string;
  height: number;
  menu_id: string;
  mobile_number: string;
  profile_id: string;
  weight: number;
}

const formList = [
  {
    id: 'name',
    label: 'Company Name',
    ftype: 'text',
    defaultValue: '',
  },
  {
    id: 'legal_name',
    label: 'Legal Name',
    ftype: 'text',
    defaultValue: '',
  },
  {
    id: 'address',
    label: 'Address',
    ftype: 'text',
    defaultValue: '',
  },
  // {
  //   id: 'corporate_id',
  //   label: 'Corporate ID',
  //   ftype: 'text',
  //   defaultValue: 'AHEPH-XXXX',
  // },
  // {
  //   id: 'name_of_ceo',
  //   label: 'CEO Full Name',
  //   ftype: 'text',
  //   defaultValue: 'Muneef Hameed',
  // },
  // {
  //   id: 'name_of_cto',
  //   label: 'CTO Full Name',
  //   ftype: 'text',
  //   defaultValue: 'Salsabeel Jamal',
  // },
  {
    id: 'phone',
    label: 'Phone Number',
    ftype: 'text',
    defaultValue: '',
  },
  {
    id: 'gstin',
    label: 'GST Number',
    ftype: 'text',
    defaultValue: '',
  },
  {
    id: 'email',
    label: 'Email Address',
    ftype: 'text',
    defaultValue: '',
  },
];

const OrganisationInfo = () => {
  const { handleSubmit, setValue, control } = useForm();
  const [ready, setReady] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { userProfile } = useAuth();

  const orgId = (userProfile && userProfile.organisation_id) || false;

  useEffect(() => {
    if (orgId) {
      fetchOrganisationDetail();
    }
  }, [orgId]);

  const onSubmit = (data: any) => {
    setLoading(true);
    putAPI(`organisations/${orgId}`, data).then(() => {
      setLoading(false);
      toast.success('updated Successfully', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };

  const fetchOrganisationDetail = () => {
    fetchAPI(`organisations/${userProfile?.organisation_id}`).then(
      (data: any) => {
        setReady(true);
        Object.keys(data).map((key) => {
          if (key !== 'logo') {
            setValue(`${key}`, data[`${key}`]);
          }
        });
      },
    );
  };

  return (
    <>
      {ready && (
        <Flex
          direction="column"
          gap="md"
          as="form"
          onSubmit={handleSubmit(onSubmit)}>
          {formList.map((customField: any) => (
            <Box key={customField?.id}>
              <Controller
                control={control}
                name={customField.id}
                defaultValue={customField.defaultValue}
                render={({ field }) => (
                  <Field label={customField.label}>
                    <InputText {...field} />
                  </Field>
                )}
              />
            </Box>
          ))}
          <Box mt={4}>
            <Button type="submit" loading={isLoading}>
              Update Profile
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};
export default OrganisationInfo;
