import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string;
};

const FileInput: React.FC<Props> = ({ name }) => {
  const { register, unregister, setValue, watch } = useFormContext();
  const files = watch(name);

  const onDrop = useCallback(
    (droppedFiles) => {
      setValue(name, droppedFiles, { shouldValidate: true });
    },
    [setValue, name],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: false,
  });

  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} {...register(name)} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default FileInput;
