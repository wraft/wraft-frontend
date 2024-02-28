import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal } from '@wraft/ui';
import { Box, Flex } from 'theme-ui';

interface RoutedDialogProps {
  unsavedChanges?: boolean;
  onConfirmLeave?: () => void;
}

export const RoutedDialog = ({
  unsavedChanges,
  onConfirmLeave,
}: RoutedDialogProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [nextUrl, setNextUrl] = useState('');
  const router = useRouter();

  const handleRouteChangeStart = (url: string) => {
    if (unsavedChanges) {
      setNextUrl(url);
      setDialogOpen(true);

      router.events.emit('routeChangeError');
      throw 'Abort route change. Please ignore this error.';
    }
  };

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [unsavedChanges]);

  const handleConfirmLeave = () => {
    if (onConfirmLeave) {
      onConfirmLeave();
    }

    console.log('handleCancelLeave', nextUrl);

    setDialogOpen(false);
    router.push(nextUrl);
  };

  const handleCancelLeave = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Modal
        open={isDialogOpen}
        ariaLabel="confirm model"
        onClose={() => setDialogOpen(false)}>
        <Box>
          <Modal.Header>Message</Modal.Header>
          <Box my={3}>
            You have unsaved changes. Are you sure you want to leave?
          </Box>
          <Flex sx={{ gap: '8px' }}>
            <Button variant="secondary" onClick={handleCancelLeave}>
              Cancel
            </Button>
            <Button onClick={handleConfirmLeave}>Leave</Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
};
