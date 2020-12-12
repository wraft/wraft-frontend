import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Button } from 'rebass';
// import Link from './NavLink';
import { Circle, Trash, Plus } from '@styled-icons/boxicons-regular';

import Modal from 'react-modal';

import { Spinner, IconButton } from 'theme-ui';
import { useStoreState, useStoreActions } from 'easy-peasy';

import { loadEntity, deleteEntity } from '../utils/models';
// import PageHeader from './PageHeader';
import { modalStyle } from '../utils';

// import CategoryForm from './NutriLabelForm';

import ImagesForm from './AssetForm';

const CategoryCard = (props: any) => (
  <Flex variant="tableItem" width={1}>
    <Text fontWeight={900}>{props.tag}</Text>
    <Flex ml="auto">
      <Flex mr={3} pb={2}>
        <IconButton>
          <Circle size={20} />
        </IconButton>
      </Flex>
      <IconButton onClick={() => props.onDelete(props)}>
        <Trash size={20} />
      </IconButton>
    </Flex>
  </Flex>
);

interface IImageList {
  onSuccess: any;
  hideList: boolean;
}

const Form = (props: IImageList) => {
  const token = useStoreState(state => state.auth.token);

  // const getThemes = useStoreActions((actions: any) => actions.themes.fetch);
  const setCats = useStoreActions((actions: any) => actions.images.set);
  // const addCats = useStoreActions((actions: any) => actions.images.add);
  const delCats = useStoreActions((actions: any) => actions.images.remove);
  const allCats = useStoreState(state => state.images.items);

  const [showModal, setShowModal] = useState<boolean>(false);

  function closeModal() {
    setShowModal(false);
  }

  function toggleModal() {
    setShowModal(!showModal);
  }

  const loadDataSuccess = (data: any) => {
    // console.log('loadDataSuccess', data);
    const res: any = data.images;
    setCats(res);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'assets', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      // getThemes();
      loadData(token);
    }
  }, [token]);

  useEffect(() => {}, [allCats]);

  // const onDelete = (data: any) => {
  //   delCats(data.id);
  //   deleteEntity(`/assets/${data.id}`, token);
  // };

  const onDone = (data: any) => {
    toggleModal();
    props.onSuccess(data);
  }

  return (
    <Box py={3} width={10 / 12} mt={4}>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={modalStyle}
        ariaHideApp={false}
        contentLabel="FileUploader">
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
        <Plus width={20} />
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
