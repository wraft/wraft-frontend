import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text, Image, Spinner } from 'theme-ui';
import { Label, Select } from 'theme-ui';

import { useAuth } from '../contexts/AuthContext';
import { base64ToFile } from '../utils/imgCrop';
import { loadEntity, updateEntityFile } from '../utils/models';
import Field from './Field';
import ImageUploader from './ImageUploader';

export interface Profile {
  uuid: null;
  user: User;
  profile_pic: null;
  name: string;
  gender: null;
  dob: string;
}

export interface User {
  id: string;
  email: string;
}

export interface IAccount {
  updated_at: string;
  role: string;
  profile_pic: string;
  dob?: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile>();
  // const [image, setImage] = useState<any>();
  // const [imagePreview, setImagePreview] = useState<string>();
  const [saving, setSaving] = useState<boolean>(false);

  // const [showModal, setModal] = useState<boolean>(false);
  const [showAvatarUploader, setShowAvatarUploader] = useState<boolean>(false);

  // function closeModal() {
  //   setModal(false);
  //   setProfileImageModal(false);
  // }

  // function toggleModal() {
  //   setModal(!showModal);
  //   const m: IAccount = {
  //     updated_at: '',
  //     role: '',
  //     profile_pic: '',
  //     dob: '',
  //     name: '',
  //     inserted_at: '',
  //     id: '',
  //     email_verify: false,
  //     email: '',
  //   };
  //   setMe(m);
  // }

  // const [cropImage, setCroppedImage] = useState<File>(); // for file submit
  // const [editing, setEditing] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onUpdate = () => {
    setSaving(false);

    toast.success('Saved Successfully', {
      duration: 1000,
      position: 'top-right',
    });
  };

  /**
   * Submit Form
   * @param data Form Data
   */
  const onSubmit = (data: any) => {
    setSaving(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('dob', data.dob);
    formData.append('gender', data.gender);

    updateEntityFile(`profiles`, formData, accessToken as string, onUpdate);
  };

  const onOrg = (data: Profile) => {
    setProfile(data);

    if (data) {
      setValue('name', data.name);
      if (data.dob) {
        setValue('dob', data.dob);
      }
      setValue('gender', data.gender);
    }
  };

  /**
   * Catch update response
   * @param respo
   */
  const onUpdated = (respo: any) => {
    console.log('response', respo);
    toast.success('Image Updated', {
      duration: 1000,
      position: 'top-right',
    });
  };

  /**
   * Upload Cropped Image
   * @param f blob string
   */
  const onBlobReady = (f: string) => {
    const file: File = base64ToFile(f, 'file.jpg');
    const formData = new FormData();

    if (file) {
      formData.append('profile_pic', file);
    }

    updateEntityFile(`profiles`, formData, accessToken as string, onUpdated);
  };

  useEffect(() => {
    if (accessToken) {
      loadEntity(accessToken as string, `profiles`, onOrg);
    }
  }, [accessToken]);

  const toggleEditor = () => {
    setShowAvatarUploader(!showAvatarUploader);
  };

  console.log('imagessss');

  return (
    <Box sx={{ width: '50%' }}>
      <Box variant="w100">
        <Flex variant="w100">
          <Box variant="w100">
            <Box>
              <Box sx={{ pl: 4 }}>
                <Box>
                  {profile && (
                    <Flex
                      sx={{
                        borderRadius: 99,
                        flexWrap: 'wrap',
                        button: {
                          display: 'block',
                          ':hover': { display: 'block', zIndex: 9000 },
                        },
                      }}
                      pr={4}
                      pb={4}>
                      <Box sx={{ position: 'relative' }}>
                        <Image
                          onClick={() =>
                            setShowAvatarUploader(!showAvatarUploader)
                          }
                          alt=""
                          sx={{
                            width: '80px',
                            maxWidth: 'auto',
                            height: '80px',
                            borderRadius: 99,
                            border: 'solid 1px',
                            borderColor: 'border',
                          }}
                          src={`${profile?.profile_pic}`}
                        />

                        <ImageUploader
                          showModal={showAvatarUploader}
                          target="avatar"
                          id="avatar-upload"
                          buttonMsg="Change avatar"
                          onClose={toggleEditor}
                          handleAvatarChange={(newAvatar) => {
                            setShowAvatarUploader(false);
                            onBlobReady(newAvatar);
                          }}
                          imageSrc={`${profile?.profile_pic}` || undefined}
                        />
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Box>
              <Box sx={{ pl: 3 }}>
                <Box mx={0} mb={3} as="form" onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ py: 2 }}>
                    <Field
                      name="name"
                      label="Name"
                      variant="baseInput"
                      placeholder="Your Full Name"
                      register={register}
                      error={errors.name}
                    />
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <Field
                      name="dob"
                      label="Birthday"
                      variant="baseInput"
                      type="date"
                      register={register}
                      error={errors.dob}
                    />
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <Label>Gender</Label>
                    <Select {...register('gender', { required: true })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </Box>
                  {errors.gender && <Text>This field is required</Text>}
                  <Button
                    type="submit"
                    ml={0}
                    mt={3}
                    sx={{ borderRadius: '6px' }}>
                    {saving && <Spinner width={16} height={16} color="white" />}
                    {!saving && <Text>Save</Text>}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
