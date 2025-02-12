import { Box } from '@wraft/ui';

type ErrorMessagesProps = {
  errors?: string | string[] | Record<string, string | string[]>;
};

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors }) => {
  if (
    !errors ||
    (typeof errors === 'object' && Object.keys(errors).length === 0)
  ) {
    return 'Something went wrong. Please try again later.';
  }

  if (typeof errors === 'string') {
    return <div className="error-messages">{errors}</div>;
  }

  if (Array.isArray(errors)) {
    return (
      <Box className="error-messages">
        {errors.map((message, index) => (
          <Box key={index}>{message}</Box>
        ))}
      </Box>
    );
  }

  return (
    <Box className="error-messages">
      {Object.entries(errors).map(([field, messages]) => (
        <Box key={field}>
          <strong>{field}:</strong>{' '}
          {Array.isArray(messages) ? messages.join(', ') : messages}
        </Box>
      ))}
    </Box>
  );
};

export default ErrorMessages;
