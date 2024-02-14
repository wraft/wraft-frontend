import React, { FC, useEffect, useState } from 'react';
import { Box, Button } from 'theme-ui';

// import { modalStyle } from '../utils';

import ImagesForm from './AssetForm';
import { PlusAlt as Plus } from './Icons';
import Modal from './Modal';

// const CategoryCard = (props: any) => (
//   <Flex variant="tableItem" width={1}>
//     <Text fontWeight={900}>{props.tag}</Text>
//     <Flex ml="auto">
//       <Flex mr={3} pb={2}>
//         <IconButton>
//           <Circle size={20} />
//         </IconButton>
//       </Flex>
//       <IconButton onClick={() => props.onDelete(props)}>
//         <Trash size={20} />
//       </IconButton>
//     </Flex>
//   </Flex>
// );

interface IImageList {
  onSuccess: any;
  hideList: boolean;
}

const Form: FC<IImageList> = ({ onSuccess }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  // function closeModal() {
  //   setShowModal(false);
  // }

  function toggleModal() {
    setShowModal(!showModal);
  }

  // const loadData = () => {
  //   fetchAPI('assets').then((data: any) => {
  //     // const res: any = data.images;
  //     // setCats(res);
  //   });
  //   return;
  // };

  useEffect(() => {
    // loadData();
  }, []);

  // useEffect(() => {}, [allCats])

  // const onDelete = (data: any) => {
  //   delCats(data.id);
  //   deleteEntity(`/assets/${data.id}`, token);
  // };

  const onDone = (data: any) => {
    toggleModal();
    onSuccess(data);
  };

  return (
    <Box py={3} mt={4}>
      <Modal
        isOpen={showModal}
        // onRequestClose={closeModal}
        // style={modalStyle}
        // ariaHideApp={false}
        // contentLabel="FileUploader"
      >
        <ImagesForm onUpload={(_m: any) => onDone(_m)} />
      </Modal>
      {}
      {/* <PageHeader title="All Images">
        <Button onClick={toggleModal}>
          <Plus width={20} />
          New Image
        </Button>
      </PageHeader> */}

      <Button type="button" onClick={toggleModal}>
        <Plus width={20} height={20} />
        New Image
      </Button>
      {/* <Box mx={0} mb={3} width={1}>
        {props.hideList && (
          <Box>
            <Flex variant="tableItem" width={1}>
              <Text fontSize={0}>Name</Text>
              <Flex ml="auto">
                <Flex mr={3} pb={2}>
                  <Text fontSize={0} ml={2}>
                    Action
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {!allCats && <Spinner />}
            {allCats &&
              allCats.length > 0 &&
              allCats.map((m: any) => (
                <CategoryCard onDelete={onDelete} key={m.id} {...m} />
              ))}
          </Box>
        )}
      </Box> */}
    </Box>
  );
};
export default Form;
