import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Text, Flex, Button } from '@wraft/ui';
import { Warning } from '@phosphor-icons/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RepositoryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      'Repository Error Boundary caught an error:',
      error,
      errorInfo,
    );
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box>
          <Flex
            justify="center"
            align="center"
            h="400px"
            direction="column"
            gap="md">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="60px"
              h="60px"
              borderRadius="full"
              backgroundColor="error.15"
              color="error">
              <Warning size={30} />
            </Box>
            <Text color="error" fontSize="lg" fontWeight="semibold">
              Something went wrong
            </Text>
            <Text color="text-secondary" textAlign="center" maxW="400px">
              We encountered an error while loading the repository. Please try
              again.
            </Text>
            <Button onClick={this.handleRetry} variant="primary">
              Try Again
            </Button>
          </Flex>
        </Box>
      );
    }

    return this.props.children;
  }
}
