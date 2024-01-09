import type { Theme } from 'theme-ui';

const forms: Theme['forms'] = {
  label: {
    color: 'gray.500',
    fontSize: 2,
    fontWeight: 500,
    pb: 0,
    ':disabled': {
      color: 'gray.300',
    },
  },
  input: {
    variant: 'text.subM',
    color: 'text',
    fontWeight: 'body',
    border: 'solid 1px',
    borderColor: 'border',
    fontFamily: 'body',
    mb: 2,
    fontSize: 3,
    py: 1,
    borderRadius: 4,
    ':disabled': {
      color: 'gray.200',
      bg: 'background',
    },
    '::placeholder': {
      variant: 'text.subM',
      color: 'gray.300',
    },
  },
  checkbox: {
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    OAppearance: 'none',
    outline: 'none',
    content: 'none',
    color: 'neutral.200',
    accentColor: 'gray.900',
  },
  small: {
    p: 0,
    px: 3,
    fontFamily: 'body',
    fontWeight: 500,
    borderColor: 'border',
  },
  select: {
    color: 'text',
    fontWeight: 500,
    border: 'solid 1px',
    bg: 'backgroundWhite',
    borderColor: 'border',
    mb: 2,
    borderRadius: 4,
  },
  textarea: {
    color: 'text',
    fontWeight: 500,
    border: 'solid 1px',
    bg: 'backgroundWhite',
    borderColor: 'border',
    fontFamily: 'body',
    mb: 2,
    borderRadius: 4,
  },
};

export default forms;
