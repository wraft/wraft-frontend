import { Text, Flex, Box, Button } from 'theme-ui';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import Field from 'common/Field';
import Modal from 'common/Modal';
import { putAPI } from 'utils/models';

import { useDocument } from './DocumentContext';

export const ApprovalUpdateModal = ({ state, success, open, setOpen }: any) => {
  const { contents, nextState, prevState } = useDocument();
  const { register } = useForm();

  const handleModalAction = () => {
    if (contents) {
      if (state === 'next') {
        const req = putAPI(`contents/${contents.content.id}/approve`);
        toast.promise(req, {
          loading: 'Approving...',
          success: () => {
            success();
            return 'Approved';
          },
          error: 'Failed',
        });
      } else if (state === 'prev' && prevState) {
        const req = putAPI(`contents/${contents.content.id}/reject`);
        toast.promise(req, {
          loading: 'Rejecting...',
          success: () => {
            success();
            return 'Rejected';
          },
          error: 'Failed',
        });
      }
      setOpen(false);
    }
  };
  return (
    <Modal isOpen={open}>
      <Flex
        sx={{
          flexDirection: 'column',
          width: '372px',
          height: '225px',
          border: '1px solid #E4E9EF',
          background: '#FFF',
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
        }}>
        <Box
          sx={{
            px: 3,
            py: 2,
            borderColor: 'border',
            width: '100%',
            borderBottom: 'solid 1px #ddd',
            mb: 2,
          }}>
          <Text
            as="p"
            variant="h5Medium"
            sx={{ textAlign: 'left', fontSize: '15px' }}>
            Confirm action
          </Text>
        </Box>
        <Text
          sx={{
            px: 4,
            mb: 2,
            marginTop: '5px',
            // mb: '5px',
            textAlign: 'left',
            fontWeight: 'heading',
            color: 'gray.900',
          }}>
          {state === 'next'
            ? `Confirm to send current content to ${nextState?.state} stage ?`
            : `Are you sure you want to send back to ${prevState?.state}?`}{' '}
        </Text>
        <Box as="form" py={1} mt={0} sx={{ display: 'none' }}>
          <Box mx={0} mb={2} sx={{ width: '350px' }}>
            <Field name="body" label="" defaultValue="" register={register} />
          </Box>
        </Box>
        <Flex
          sx={{
            gap: '12px',
            px: 3,
            py: 3,
            mt: 3,
            // borderColor: '#eee',
            borderTop: 'solid 1px #ddd',
            width: '100%',
          }}>
          <Button onClick={handleModalAction} sx={{}}>
            Confirm
          </Button>
          <Button
            variant="btnSecondary"
            onClick={() => setOpen(false)}
            sx={{ bg: 'red', color: 'gray.1100', fontWeight: 'bold' }}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
