import type { Theme } from 'theme-ui';

const forms: Theme['forms'] = {
  label: {
    fontFamily: 'body',
    variant: 'text.pR',
    color: 'gray.600',
    mb: 2,
  },
  input: {
    borderColor: 'border',
    p: '8px 16px',
    variant: 'text.pM',
    bg: 'transparent',
    ':disabled': {
      color: 'gray.200',
    },
  },
  select: {
    borderColor: 'border',
    p: '8px 16px',
    variant: 'text.pM',
    bg: 'transparent',
    ':disabled': {
      color: 'gray.200',
    },
  },
  textarea: {
    borderColor: 'border',
    p: '8px 16px',
    variant: 'text.pM',
    bg: 'transparent',
    resize: 'none',
    ':disabled': {
      color: 'gray.200',
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
};

export default forms;
