import React from 'react';
import { Box, Flex, Button, Label, Input, Select } from 'theme-ui';

import { useForm } from 'react-hook-form';
import { Asset } from '../utils/types';
import { useStoreState } from 'easy-peasy';
import { createEntityFile } from '../utils/models';
// import { CloudUploadIcon } from './Icons';
import Error from './Error';
import Field from './Field';
// import { useDropzone } from 'react-dropzone';

interface AssetFormProps {
  setAsset?: any;
  onUpload?: any;
  filetype?: string;
}

type FormInputs = {
  file: FileList;
  name: string;
};

const AssetForm = ({
  onUpload,
  setAsset,
  filetype = 'layout',
}: AssetFormProps) => {
  const {
    // watch,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormInputs>({ mode: 'all' });
  const token = useStoreState((state) => state.auth.token);
  // const [contents, setContents] = React.useState<Asset>();

  const onImageUploaded = (data: any) => {
    const mData: Asset = data;
    onUpload(mData);
    // setContents(data);
  };

  const onSubmit = (data: any) => {
    console.log('file:', data);
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('name', data.name);
    formData.append('type', filetype);

    createEntityFile(formData, token, 'assets', onImageUploaded);
    // setAsset(true);
  };

  // const [file, setFile] = React.useState([]);
  // const [dragging, setDragging] = React.useState(false);

  // const handleDragOver = (event: any) => {
  //   setDragging(true);
  //   event?.preventDefault();
  // };
  // const handleDrop = (event: any) => {
  //   setDragging(false);
  //   event?.preventDefault();
  //   const droppedFile = event.dataTransfer.files[0];
  //   setFile(droppedFile);
  //   console.log(droppedFile);
  // };

  // React.useEffect(() => {
  //   console.log(file);
  // }, [file]);

  // const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  // const files = acceptedFiles.map((file) => (
  //   <li key={file.name}>
  //     {file.name} - {file.size} bytes
  //   </li>
  // ));
  // return (
  //   <Box as="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
  //     <Box
  //       {...getRootProps({})}
  //       sx={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         border: '1px dashed',
  //         borderColor: 'neutral.0',
  //         p: '18px',
  //         // bg: dragging ? 'green.0' : 'bgWhite',
  //       }}>
  //       <input {...getInputProps({ ...register('file') })} />
  //       <p>Drag 'n' drop some files here, or click to select files</p>
  //     </Box>
  //     {/* <p>
  //         Drag & drop or{' '}
  //         <Text as="span" sx={{ color: 'primary', cursor: 'pointer' }}>
  //           upload files
  //         </Text>
  //       </p> */}
  //     {/* <Box mb="12px">
  //         <CloudUploadIcon />
  //       </Box>
  //       <Text variant="capM">PDF - Max file size 5MB</Text>
  //     */}
  //     <Flex>
  //       <Button
  //         type="submit"
  //         disabled={!isValid}
  //         sx={{
  //           ':disabled': {
  //             bg: 'gray.0',
  //             color: 'gray.5',
  //           },
  //         }}>
  //         Upload
  //       </Button>
  //     </Flex>
  //     <pre>{JSON.stringify(watch())}</pre>
  //     <ul>{files}</ul>
  //   </Box>
  // );

  {
    /*current */
  }
  {
    /* <Box>
          <Label
            htmlFor="file"
            sx={{ color: 'primary', display: 'inline-block' }}>
            <Text variant="pM" mb="4px">
              Drag & drop or{' '}
              <Text as="span" sx={{ color: 'primary', cursor: 'pointer' }}>
                upload files
              </Text>
            </Text>
          </Label>
          <Controller
            name="file"
            control={control}
            defaultValue={null}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                id="fileInput"
                type="file"
                accept="application/pdf"
                {...field}
              />
            )}
          />
        </Box>
        <Text variant="capM">PDF - Max file size 5MB</Text> */
  }
  {
    /*//inside upper box
           <Input
            // sx={{ display: 'none' }}
            id="fileInput"
            type="file"
            accept="application/pdf"
            {...register('file', { required: true })}
          /> */
  }
  {
    /* <Box
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px dashed',
          borderColor: 'neutral.0',
          p: '18px',
          bg: dragging ? 'green.0' : 'bgWhite',
        }}>
        <Box mb="12px">
          <CloudUploadIcon />
        </Box> */
  }
  {
    /* <pre>{JSON.stringify(watch())}</pre> */
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
      <Box mx={-2} mb={3}>
        {filetype === 'theme' && (
          <Box>
            <Label htmlFor="name" mb={1}>
              Font Weight
            </Label>
            <Select
              id="flow_id"
              defaultValue=""
              {...register('name', { required: true })}>
              <option value="Regular" key="regular">
                Regular
              </option>
              <option value="Italic" key="italic">
                Italic
              </option>
              <option value="Bold" key="bold">
                Bold
              </option>
            </Select>
            {errors.name && <Error text={errors.name.message} />}
          </Box>
        )}
        {filetype !== 'theme' && (
          <Box>
            <Field
              name="name"
              label="Asset Name"
              defaultValue=""
              register={register}
              error={errors.name}
            />
          </Box>
        )}
        <Label htmlFor="file" mb={1}>
          File
        </Label>
        <Input id="file" type="file" {...register('file')} />
      </Box>
      <Flex>
        <Button
          type="submit"
          disabled={!isValid}
          sx={{
            ':disabled': {
              bg: 'gray.0',
              color: 'gray.5',
            },
          }}>
          Upload
        </Button>
      </Flex>
    </Box>
  );
};
export default AssetForm;
