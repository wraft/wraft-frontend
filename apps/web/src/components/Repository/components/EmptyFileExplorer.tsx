import React from 'react';
import { Box, Text, Flex, Button } from '@wraft/ui';
import { FileText, ArrowUp } from '@phosphor-icons/react';
import styled from '@xstyled/emotion';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  height: 100%;
  min-height: 400px;
  background-color: var(--theme-ui-colors-background);
  border: 2px dashed var(--theme-ui-colors-border);
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: var(--theme-ui-colors-primary);
  }
`;

const IconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--theme-ui-colors-primary-15);
  margin-bottom: 1rem;
  color: var(--theme-ui-colors-primary);
`;

const Title = styled(Text)`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--theme-ui-colors-text);
`;

const Description = styled(Text)`
  font-size: 0.875rem;
  color: var(--theme-ui-colors-text-secondary);
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

interface EmptyStateDocumentLifecycleProps {
  onUpload?: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

const EmptyStateDocumentLifecycle: React.FC<
  EmptyStateDocumentLifecycleProps
> = ({
  onUpload,
  title = 'No Documents Yet',
  description = 'Upload your first document to get started. We support PDF, Word, and other common document formats.',
  buttonText = 'Upload Document',
}) => {
  return (
    <Container>
      <IconWrapper>
        <FileText size={32} weight="duotone" />
      </IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {onUpload && (
        <Button onClick={onUpload} variant="primary" size="md">
          <Flex align="center" gap="sm">
            <ArrowUp size={20} />
            {buttonText}
          </Flex>
        </Button>
      )}
    </Container>
  );
};

export default EmptyStateDocumentLifecycle;
