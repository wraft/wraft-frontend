import React from 'react';

import Dropzone from 'react-dropzone-uploader';
import toast from 'react-hot-toast';

const SingleFileAutoSubmit: React.FC = () => {
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' };
  };
  const handleChangeStatus = ({ meta, remove }: any, status: string) => {
    if (status === 'headers_received') {
      toast.success(`${meta.name} uploaded!`);
      remove();
    } else if (status === 'aborted') {
      toast.error(`${meta.name}, upload failed...`);
    }
  };
  return (
    <React.Fragment>
      <div id="toast">Upload</div>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent="Drop A File"
        styles={{
          dropzone: { width: 400, height: 400 },
          dropzoneActive: { borderColor: 'green' },
        }}
      />
    </React.Fragment>
  );
};
<SingleFileAutoSubmit />;

export default SingleFileAutoSubmit;
