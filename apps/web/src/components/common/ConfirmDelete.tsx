import { CloseIcon } from '@wraft/icon';
import { Box, Button, Flex, Modal, Text } from '@wraft/ui';

interface props {
  inputValue?: any;
  setOpen: any;
  setRender?: any;
  onConfirmDelete: any;
  title: string;
  text: string;
}

const ConfirmDelete = ({
  inputValue,
  setOpen,
  setRender,
  onConfirmDelete,
  title,
  text,
}: props) => {
  return (
    <>
      <Flex justify="space-between">
        <Modal.Header>{title}</Modal.Header>
        <Box onClick={() => setOpen(false)}>
          <CloseIcon color="#2C3641" />
        </Box>
      </Flex>
      <Box maxWidth="342px" borderTop="1px solid" borderColor="border" py="sm">
        <Text>{text}</Text>
      </Box>
      <Flex gap="sm" py="sm">
        <Button
          danger
          onClick={
            inputValue ? () => onConfirmDelete(inputValue) : onConfirmDelete
          }>
          Confirm
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            if (setRender) {
              setRender((prev: boolean) => prev);
            }
          }}
          variant="tertiary">
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ConfirmDelete;
