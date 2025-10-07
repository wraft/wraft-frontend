import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styled from '@emotion/styled';
import {
  Box,
  Flex,
  Button,
  Select,
  SeletOption,
  OptionValue,
  Field,
  InputText,
} from '@wraft/ui';

import ImageUploader from 'common/ImageUploader';
import { useAuth } from 'contexts/AuthContext';
import { base64ToFile } from 'utils/imgCrop';
import { fetchAPI, putAPI } from 'utils/models';

export interface User {
  id: string;
  email: string;
}
export interface Profile {
  uuid: string | null;
  user: User;
  profile_pic: string | null;
  name: string;
  gender: string | null;
  dob: string;
}

interface FormData {
  name: string;
  dob: string;
  gender: string | null;
}

const genderOptions: SeletOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const AvatarContainer = styled(Box)`
  cursor: pointer;
  width: 120px;
  height: 120px;
`;

const AvatarImage = styled(Image)`
  border-radius: 99px;
  border: solid 1px;
  border-color: ${(props: any) => props.theme.colors.border};
`;

const AvatarOverlay = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 99px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    .edit-text {
      opacity: 1;
    }
  }
`;

const EditText = styled(Box)`
  opacity: 0.6;
  transition: opacity 0.2s;
`;

const StyledDateInput = styled(InputText)`
  @media (prefers-color-scheme: dark) {
    &[type="date"] {
      &::-webkit-calendar-picker-indicator {
        filter: invert(0.4);
      }

`;

const Form = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile>();
  const [saving, setSaving] = useState<boolean>(false);
  const [showAvatarUploader, setShowAvatarUploader] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSaving(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('dob', data.dob);
    formData.append('gender', data.gender || '');

    try {
      await putAPI('profiles', formData);
      toast.success('Profile updated successfully', {
        duration: 1000,
        position: 'top-right',
      });
      await onLoadProfile();
      setSaving(false);
    } catch (error) {
      toast.error('Failed to update profile');
      setSaving(false);
    }
  };

  const onLoadProfile = useCallback(async () => {
    if (!accessToken) return;

    try {
      const data: any = await fetchAPI('profiles');
      setProfile(data);

      if (data) {
        setValue('name', data.name);
        setValue('dob', data.dob || '');
        setValue('gender', data.gender || '');
      }
    } catch (error) {
      toast.error('Failed to load profile');
    }
  }, [accessToken, setValue]);

  const onAvatarUpload = async (base64String: string) => {
    const file = base64ToFile(base64String, 'avatar.jpg');
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_pic', file);

    try {
      await putAPI('profiles', formData);
      toast.success('Avatar updated successfully', {
        duration: 1000,
        position: 'top-right',
      });
      onLoadProfile();
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  useEffect(() => {
    onLoadProfile();
  }, [onLoadProfile]);

  const onToggleAvatarUploader = () => {
    setShowAvatarUploader(!showAvatarUploader);
  };

  return (
    <Flex
      direction="column"
      w="50%"
      maxWidth="600px"
      bg="background-primary"
      p="xl">
      <Box>
        {profile && (
          <Flex direction="row" wrap="wrap">
            <Box position="relative">
              <AvatarContainer
                position="relative"
                onClick={() => setShowAvatarUploader(!showAvatarUploader)}>
                <AvatarImage
                  alt=""
                  width={120}
                  height={120}
                  src={`${profile?.profile_pic}`}
                  priority
                />
                <AvatarOverlay
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  className="hover-overlay">
                  <EditText as="div" className="edit-text">
                    Edit
                  </EditText>
                </AvatarOverlay>
              </AvatarContainer>

              <ImageUploader
                isModalOpen={showAvatarUploader}
                targetAlt="avatar"
                id="avatar-upload"
                buttonLabel="Change avatar"
                onModalClose={onToggleAvatarUploader}
                onImageChange={(newAvatar: string) => {
                  setShowAvatarUploader(false);
                  onAvatarUpload(newAvatar);
                }}
                currentImageSrc={`${profile?.profile_pic}` || undefined}
              />
            </Box>
          </Flex>
        )}
      </Box>

      <Flex
        direction="column"
        gap="md"
        mb="md"
        mt="xl"
        as="form"
        onSubmit={handleSubmit(onSubmit)}>
        <Field label="Name" required error={errors?.name?.message}>
          <InputText {...register('name')} placeholder="Enter your full name" />
        </Field>

        <Field label="Date of Birth" required error={errors?.dob?.message}>
          <StyledDateInput {...register('dob')} type="date" />
        </Field>
        <Box>
          <Field label="Gender" required error={errors?.gender?.message}>
            <Select
              name="gender"
              options={genderOptions}
              onChange={(value: OptionValue) => {
                const option = genderOptions.find((opt) => opt.value === value);
                const selectedGender = option?.value?.toString() || '';
                setValue('gender', selectedGender);

                setProfile((prevProfile) => ({
                  ...prevProfile!,
                  gender: selectedGender,
                }));
              }}
              value={
                profile?.gender
                  ? {
                      value: profile.gender.toLowerCase(),
                      label: profile.gender,
                    }
                  : undefined
              }
            />
          </Field>
        </Box>

        <Box>
          <Button type="submit" loading={saving} disabled={saving}>
            Save
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
export default Form;
