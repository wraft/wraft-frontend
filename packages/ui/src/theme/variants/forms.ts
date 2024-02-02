const forms = {
  label: {
    color: 'gray.400',
    fontFamily: 'body',
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.2px',
  },
  input: {
    borderColor: 'border',
    '&[type=text]': {
      color: '#656E78',
      fontWeight: '500',
      fontSize: '15px',
      p: '8px 16px',
    },
  },
  select: {
    borderColor: 'border',
  },
  textarea: {
    borderColor: 'border',
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
