import type { Theme } from 'theme-ui';

const forms: Theme['forms'] = {
  common: {
    borderColor: 'border',
    p: '8px 16px',
    variant: 'text.pM',
    bg: 'transparent',
  },
  label: {
    fontFamily: 'body',
    variant: 'text.pR',
    color: 'gray.600',
    mb: 2,
  },
  input: {
    variant: 'forms.common',
  },
  select: {
    variant: 'forms.common',
  },
  textarea: {
    variant: 'forms.common',
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
