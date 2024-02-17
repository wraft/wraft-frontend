import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Dialog, DialogHeading, DialogDismiss } from '@ariakit/react';
import styled from '@emotion/styled';

const DialogWrapper = styled(Dialog)`
  position: fixed;
  inset: 0.75rem;
  z-index: 50;
  margin: auto;
  display: flex;
  height: fit-content;
  max-height: calc(100dvh - 2 * 0.75rem);
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  border-radius: 0.75rem;
  background-color: hsl(204 20% 100%);
  padding: 1rem;
  color: hsl(204 10% 10%);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  .button {
    display: flex;
    height: 2.5rem;
    user-select: none;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    white-space: nowrap;
    border-radius: 0.5rem;
    border-style: none;
    background-color: hsl(204 20% 100%);
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
    line-height: 1.5rem;
    color: hsl(204 10% 10%);
    text-decoration-line: none;
    outline-width: 2px;
    outline-offset: 2px;
    outline-color: hsl(204 100% 40%);
    --border: rgba(0, 0, 0, 0.1);
    --highlight: rgba(255, 255, 255, 0.2);
    --shadow: rgba(0, 0, 0, 0.1);
    box-shadow:
      inset 0 0 0 1px var(--border),
      inset 0 2px 0 var(--highlight),
      inset 0 -1px 0 var(--shadow),
      0 1px 1px var(--shadow);
    font-weight: 500;
  }

  .button:hover {
    background-color: hsl(204 20% 96%);
  }

  .button[aria-disabled='true'] {
    opacity: 0.5;
  }

  .button[aria-expanded='true'] {
    background-color: hsl(204 20% 96%);
  }

  .button[data-focus-visible] {
    outline-style: solid;
  }

  .button:active,
  .button[data-active] {
    padding-top: 0.125rem;
    box-shadow:
      inset 0 0 0 1px var(--border),
      inset 0 2px 0 var(--border);
  }

  :is(.dark .button) {
    background-color: hsl(204 20% 100% / 0.05);
    color: hsl(204 20% 100%);
    --shadow: rgba(0, 0, 0, 0.25);
    --border: rgba(255, 255, 255, 0.1);
    --highlight: rgba(255, 255, 255, 0.05);
    box-shadow:
      inset 0 0 0 1px var(--border),
      inset 0 -1px 0 1px var(--shadow),
      inset 0 1px 0 var(--highlight);
  }

  :is(.dark .button:hover) {
    background-color: hsl(204 20% 100% / 0.1);
  }

  :is(.dark .button)[aria-expanded='true'] {
    background-color: hsl(204 20% 100% / 0.1);
  }

  :is(.dark .button:active),
  :is(.dark .button[data-active]) {
    box-shadow:
      inset 0 0 0 1px var(--border),
      inset 0 1px 1px 1px var(--shadow);
  }

  @media (min-width: 640px) {
    .button {
      gap: 0.5rem;
    }
  }

  :is(.dark .dialog) {
    border-width: 1px;
    border-style: solid;
    border-color: hsl(204 3% 26%);
    background-color: hsl(204 3% 18%);
    color: hsl(204 20% 100%);
  }

  @media (min-width: 640px) {
    top: 10vh;
    bottom: 10vh;
    margin-top: 0px;
    max-height: 80vh;
    width: 420px;
    border-radius: 1rem;
    padding: 1.5rem;
  }

  .heading {
    margin: 0px;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
  }
`;

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
      // Prevent Next.js from completing the navigation
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
      <DialogWrapper
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        className="dialog">
        <DialogHeading className="heading">Message</DialogHeading>
        <p className="description">
          You have unsaved changes. Are you sure you want to leave?
        </p>
        <div>
          <DialogDismiss className="button" onClick={() => handleCancelLeave()}>
            Cancel
          </DialogDismiss>
          <DialogDismiss
            className="button"
            onClick={() => handleConfirmLeave()}>
            Yes, leave
          </DialogDismiss>
        </div>
      </DialogWrapper>
    </>
  );
};
