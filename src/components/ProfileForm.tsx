import React, { useEffect, useState, useCallback } from 'react';
import { Box, Flex, Button, Text, Image } from 'theme-ui';
import { useForm } from 'react-hook-form';

import { Input, Label, Select } from '@rebass/forms';
import Cropper from 'react-easy-crop';

import Field from './Field';
import { loadEntity, updateEntityFile } from '../utils/models';
import { useStoreState } from 'easy-peasy';

import { Slider } from 'theme-ui';
import { getCroppedImg } from '../utils/imgCrop';
import ImageCropper from './ImageCropper';

// import dateFnsFormat from 'date-fns/format';
// import DayPicker, { DateUtils } from 'react-day-picker';

export interface Profile {
  uuid: null;
  user: User;
  profile_pic: null;
  name: string;
  gender: null;
  dob: null;
}

export interface User {
  id: string;
  email: string;
}

// Generated by https://quicktype.io

export interface IAccount {
  updated_at: string;
  role: string;
  profile_pic: null;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

// Generated by https://quicktype.io
interface IImageCopperProps {
  image?: any;
  onUpdate: any;
}

type ImageData = {
  name: string;
  data: string;
};

const ImageCopper = ({ image, onUpdate }: IImageCopperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        dogImg,
        croppedAreaPixels,
        rotation,
      );
      console.log('donee', { croppedImage });
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);
  // // const [imageTemp, setImageTemp] = useState<any>();
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  // const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
  //   // console.log(croppedArea, croppedAreaPixels);
  //   getCroppedImg(image, croppedArea).then((_m: File) => {
  //     onUpdate(_m);
  //   })
  // }, []);

  const changeZoom = (_e: any) => {
    setZoom(_e.target.value);
  };

  return (
    <Box>
      <Box
        sx={{
          mx: 3,
          my: 3,
          ml: 0,
          mr: 3,
          position: 'relative',
          zIndex: 100,
          width: 200,
          height: 200,
        }}>
        <Box>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={2 / 2}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Box>
      </Box>
      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        aria-labelledby="Zoom"
        onChange={(zoom: any) => changeZoom(zoom)}
      />
    </Box>
  );
};

const Form = () => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const token = useStoreState(state => state.auth.token);
  const [me, setMe] = useState<IAccount>();
  const [profile, setProfile] = useState<Profile>();
  const [image, setImage] = useState<any>();
  const [imagePreview, setImagePreview] = useState<string>();
  const [imageTemp, setImageTemp] = useState<any>();
  const [imageSaved, setImageSaved] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);

  const [cropImage, setCroppedImage] = useState<File>();
  const [editing, setEditing] = useState<boolean>(false);

  const setPreviewImage = (props: any) => {
    // console.log('setPreviewImage', props)
    setCroppedImage(props.prevImageFile);
  };

  const toggleEdit = () => {
    setEdit(!isEdit);
  };

  // const [showDate, setShowDate] = useState<boolean>(false);
  // const profilex = useStoreState(state => state.profile.data);
  // const dispatch = useDispatch();

  const onUpdate = (d: any) => {
    console.log('Updated', d);
    console.log('me', me);
  };

  // const toggleDate = () => {
  //   setShowDate(!showDate);
  // };

  /**
   * Submit Form
   * @param data Form Data
   */
  const onSubmit = (data: any) => {
    // const id: string = me && me.id;

    console.log('data.profile_pic', data);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('dob', data.dob);

    if (cropImage) {
      formData.append('profile_pic', cropImage);
    }

    formData.append('gender', data.gender);

    updateEntityFile(`profiles`, formData, token, onUpdate);
  };

  // const formatDate = (date: any, format: string) => {
  //   return dateFnsFormat(date, format);
  // };

  const onMe = (data: any) => {
    const meme: IAccount = data;
    console.log('Me', meme);
    setMe(meme);
  };

  const onOrg = (data: Profile) => {
    setProfile(data);

    if (data) {
      setValue('name', data.name);
      setValue('dob', data.dob);
      setValue('gender', data.gender);
      const img = 'http://localhost:4000' + data?.profile_pic;
      setImage(img);
    }
  };

  useEffect(() => {
    if (token) {
      loadEntity(token, `profiles`, onOrg);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadEntity(token, `profiles`, onOrg);
    }
  }, [token]);

  const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  useEffect(() => {
    // console.log('imageTemp', imageTemp);
    try {
      if (imageTemp && imageTemp.size > 0) {
        getBase64(imageTemp).then((_e: any) => {
          setImagePreview(_e);
        });
      }
    } catch (error) {
      console.log('errr', error);
    }

    // // if(imageTemp) {
    //   setValue('profile_pic', imageTemp);
    // }
    // if (token) {
    //   loadEntity(token, `profiles`, onOrg);
    // }
  }, [imageTemp]);

  // setImageTemp

  // const dateChange = (day: Date) => {
  //   const FORMAT = 'yyyy-MM-dd';
  //   if (DateUtils.isDate(day)) {
  //     const m = formatDate(day, FORMAT);
  //     setValue('dob', m);
  //   }
  //   // toggleDate();
  // };

  // const fileHandle = (event: any) => {
  //   setEdit(true);
  //   setImage(URL.createObjectURL(event.target.files[0]));
  //   setImageSaved(false);
  // };

  // /**
  //  * Initiate a crop;
  //  */
  // const saveCrop = () => {
  //   // setEdit(true);
  //   setImageSaved(true);
  //   console.log('image', imageTemp);
  //   setImage(imageTemp);
  //   // setValue('profile_pic', imageTemp);
  // };

  // const setTempImage  = ()

  return (
    <Box py={3} mt={4}>
      <Box>
        <Text variant="pagetitle">My Profile</Text>
      </Box>
      <Box>
        <Flex>
          <Box>
            <Box mx={0} mb={3} as="form" onSubmit={handleSubmit(onSubmit)}>
              <Field
                name="name"
                label="Name"
                defaultValue="Your Full Name"
                register={register}
              />
              <Box>
                <Flex>
                  {profile && profile.profile_pic && (
                    <Box pr={4} pb={4}>
                      <Box>
                        {!isEdit && (
                          <Image
                            sx={{ width: '80px', height: '80px' }}
                            src={`http://localhost:4000${profile?.profile_pic}`}
                          />
                        )}
                        {isEdit && (
                          <ImageCropper onFileSubmit={setPreviewImage} />
                        )}
                      </Box>

                      {/* { imageTemp && 
                        <Image src={imageTemp?.item}/>
                      } */}
                      <Button variant="secondary" onClick={() => toggleEdit()}>
                        Edit
                      </Button>
                    </Box>
                  )}

                  {profile && imageSaved && (
                    <>
                      <Image
                        src={'http://localhost:4000' + profile?.profile_pic}
                        width={100}
                        // height={100}
                      />
                    </>
                  )}

                  {/* <Box sx={{ display: imageSaved ? 'none' : 'block' }}>
                    <Label htmlFor="screenshot" mb={1}>
                      Profile
                    </Label>
                    <Input
                      id="profile_pic"
                      name="profile_pic"
                      type="file"
                      onChange={fileHandle}
                      ref={register()}
                    />
                  </Box> */}
                  {/* )} */}
                </Flex>
              </Box>
              <Field
                name="dob"
                label="Birthday"
                defaultValue="1992-09-24"
                register={register}
                // onClick={toggleDate}
                // onChange={dateChange}
              />
              {/* {showDate && <DayPicker onDayClick={dateChange} />} */}

              <Label>Gender</Label>
              <Select name="gender" ref={register({ required: true })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>

              {/* <Label>Calorie Range</Label>
              <Select name="calory_range_id" ref={register({ required: true })}>
                <option value="006bce5a-ec1a-4210-890c-bf4817addaa1">1000-1200</option>
                <option value="64d5fd8d-6726-4b9b-81ff-f367b249307d">1200-1400</option>
              </Select> */}

              {/* <Box py={4}>
                <Text variant="pagetitle">My Profile</Text>
                <Flex>
                  <Field
                    name="calories"
                    label="Calories"
                    defaultValue="2400"
                    register={register}
                  />
                  <Field
                    name="prefs"
                    label="Preference"
                    defaultValue="Weight Loss"
                    register={register}
                  />
                </Flex>
                <Field
                  name="height"
                  label="Height"
                  defaultValue="174cm"
                  register={register}
                />
                <Field
                  name="weight"
                  label="Weight"
                  defaultValue="69kg"
                  register={register}
                />
              </Box> */}
              <Button type="submit" ml={2} mt={3}>
                Update Profile
              </Button>
            </Box>
          </Box>

          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
