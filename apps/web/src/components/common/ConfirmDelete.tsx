import { Box, Button, Flex, Text } from 'theme-ui';

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
    <Box sx={{ maxWidth: '342px' }}>
      <Text variant="pB" sx={{ display: 'inline-block', py: 3, px: 4 }}>
        {title}
      </Text>
      <Box sx={{ borderTop: '1px solid', borderColor: 'border' }}>
        <Box sx={{ px: 4 }}>
          <Text variant="pM" sx={{ display: 'inline-block', pt: 3 }}>
            {text}
          </Text>
          <Flex sx={{ gap: 3, py: 4 }}>
            <Button
              onClick={
                inputValue ? () => onConfirmDelete(inputValue) : onConfirmDelete
              }
              variant="delete"
              sx={{
                fontSize: 2,
                flexGrow: 1,
              }}>
              Confirm
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                if (setRender) {
                  setRender((prev: boolean) => prev);
                }
              }}
              variant="cancel"
              sx={{
                fontSize: 2,
                flexGrow: 1,
              }}>
              Cancel
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmDelete;
