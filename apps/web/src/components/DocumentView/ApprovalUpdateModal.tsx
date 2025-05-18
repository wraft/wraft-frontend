import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Button, Modal, Text, Flex, Box } from '@wraft/ui';

import Field from 'common/Field';
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
    <Modal ariaLabel="Approval" open={open}>
      <Flex direction="column" w="372px">
        <Modal.Header>
          <Text fontSize="lg">Confirm Action</Text>
        </Modal.Header>

        <Text
          color="text-secondary"
          mt="xs"
          dangerouslySetInnerHTML={{
            __html:
              state === 'next'
                ? `Confirm to send current content to <strong>${nextState?.state} stage</strong> ?`
                : `Are you sure you want to send back to <strong>${prevState?.state} stage</strong>?`,
          }}
        />

        <Box as="form" py="sm" mt="sm" display="none">
          <Box>
            <Field name="body" label="" defaultValue="" register={register} />
          </Box>
        </Box>
        <Flex mt="xxl" gap="md">
          <Button size="sm" onClick={handleModalAction}>
            Confirm
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
