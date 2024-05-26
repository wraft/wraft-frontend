import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Spinner, Box, Text } from 'theme-ui';
// import { Label, Select, Textarea } from 'theme-ui';

import { putAPI, fetchAPI, fetchUserInfo } from '../utils/models';
import Field from './Field';

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
    defaultValue: 'Functionary Films',
  },
  {
    id: 'legal_name',
    label: 'Legal Name',
    ftype: 'text',
    defaultValue: 'Functionary Films Pvt Ltd',
  },
  {
    id: 'addres',
    label: 'Address',
    ftype: 'text',
    defaultValue: '#21, HM Green Oak Apartments, Bengaluru, IN',
  },
  {
    id: 'corporate_id',
    label: 'Corporate ID',
    ftype: 'text',
    defaultValue: 'AHEPH-XXXX',
  },
  {
    id: 'name_of_ceo',
    label: 'CEO Full Name',
    ftype: 'text',
    defaultValue: 'Muneef Hameed',
  },
  {
    id: 'name_of_cto',
    label: 'CTO Full Name',
    ftype: 'text',
    defaultValue: 'Salsabeel Jamal',
  },
  {
    id: 'phone',
    label: 'Phone Number',
    ftype: 'text',
    defaultValue: '8050473500',
  },
  {
    id: 'gstin',
    label: 'GST Number',
    ftype: 'text',
    defaultValue: 'GST-IN-XXX',
  },
  {
    id: 'email',
    label: 'Email Address',
    ftype: 'text',
    defaultValue: 'info@aurut.com',
  },
];

const OrgForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [ready, setReady] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>();
  const [organ, setOrgan] = useState<any>();

  const onCreate = (d: any) => {
    setSuccess(true);
    console.log('__d', d, success);
    // if (d && d.id) {
    //   // Router.push(`/user-profile`);
    // }
  };

  /** Update Form */

  const onSubmit = (data: any) => {
    putAPI(`organisations/${profile.organisation_id}`, data).then(
      (data: any) => {
        onCreate(data);
      },
    );
  };

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  const onProfileLoad = (data: any) => {
    const res: any[] = data;
    setProfile(res);
  };

  useEffect(() => {
    // check if token is there
    // const tokenInline = cookie.get('token') || false;
    //

    fetchUserInfo().then((data: any) => {
      onProfileLoad(data);
    });

    // loadEntity(token, 'macros', loadDataSuccess);
  }, []);

  /**
   * When Org data is load
   *
   */
  const onOrgLoad = (_o: any) => {
    setReady(true);
    console.log('profile.organisation_id', _o);
    setOrgan(_o);

    Object.keys(_o).map(function (key, index) {
      console.log('key', key, index, `${key}`, _o[`${key}`]);
      setValue(`${key}`, _o[`${key}`]);
    });

    // set sample
  };

  const onOrgMembLoad = (_o: any) => {
    setReady(true);
    console.log('onOrgMembLoad', _o);
    // setOrgan(_o);

    // Object.keys(_o).map(function(key, index) {
    //   console.log('key', key, index, `${key}`, _o[`${key}`]);
    //   setValue(`${key}`, _o[`${key}`]);
    // });
  };

  const onOrgLoadAll = (_x: any) => {
    console.log('x', _x);
  };

  /**
   * Set Profile Context
   */

  useEffect(() => {
    // check if token is there
    // const tokenInline = cookie.get('token') || false;
    //
    if (profile) {
      console.log('profile', profile);
      // setValue('')
      // checkUser(token, onProfileLoad);
      fetchAPI(`organisations/${profile.organisation_id}`).then((data: any) => {
        onOrgLoad(data);
      });

      fetchAPI(`organisations`).then((data: any) => {
        onOrgLoadAll(data);
      });

      fetchAPI(`organisations/${profile.organisation_id}/memberships`).then(
        (data: any) => {
          onOrgMembLoad(data);
        },
      );
    }

    if (organ) {
      console.log('got organ', organ);
    }
  }, [profile]);

  /**
   * Watch Form Change
   */
  // const checkChange = (_a: any) => {
  //   console.log('__args', _a);
  // };

  return (
    <Box>
      {!ready && <Spinner />}
      <Text as="h3">Company Information</Text>
      <Box>
        {ready && (
          <Box
            mx={0}
            mb={3}
            variant="w100"
            as="form"
            onSubmit={handleSubmit(onSubmit)}>
            {formList.map((fl: any) => (
              <Box key={fl?.id} sx={{ mb: 3 }}>
                <Field
                  name={fl.id}
                  label={fl.label}
                  defaultValue={fl.defaultValue}
                  register={register}
                />
              </Box>
            ))}
            <Button type="submit" ml={2} mt={3}>
              Update Profile
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default OrgForm;
