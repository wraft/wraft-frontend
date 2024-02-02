const buttons = {
  btnBig: {
    cursor: 'pointer',
  },
  primary: {
    backgroundColor: 'primary',
    color: 'white',
    border: '1px solid',
    borderColor: 'primary',
    borderRadius: '4px',
    padding: '8px 16px',
    ':hover': {
      backgroundColor: '#197231',
      borderColor: '#197231',
    },
    ':disabled': {
      color: 'gray.900',
      bg: 'neutral.300',
    },
  },

  secondary: {
    backgroundColor: '#E4E9EF',
    color: 'gray.900',
    border: '1px solid',
    borderColor: '#E4E9EF',
    borderRadius: '4px',
    padding: '8px 16px',
    ':hover': {
      backgroundColor: '#C1C6DB',
      borderColor: '#C1C6DB',
    },
  },
  buttonPrimary: {
    cursor: 'pointer',
    color: 'white',
    backgroundColor: '#004A0F',
    borderRadius: '6px',
    padding: '8px 16px',
    ':disabled': {
      color: 'gray.900',
      bg: 'neutral.300',
    },
  },
  buttonPrimarySmall: {
    variant: 'buttons.buttonPrimary',
    fontSize: 2,
  },
  delete: {
    variant: 'buttons.buttonPrimary',
    bg: 'red.700',
  },
  cancel: {
    variant: 'buttons.buttonPrimary',
    bg: 'neutral.300',
    color: 'gray.900',
  },
  googleLogin: {
    fontWeight: 'body',
    color: 'gray.600',
    bg: 'backgroundWhite',
    border: '1px solid',
    borderColor: 'border',
    borderRadius: '4px',
    py: '9px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    width: '100%',
    ':hover': {
      bg: 'transparent',
    },
    ':focus': {
      bg: 'transparent',
    },
  },
  download: {
    bg: 'gray.200',
    textTransform: 'capitalize',
  },
  btnPrimary: {
    variant: 'buttons.btnBig',
    bg: 'primary.9',
    color: 'primary.1',
    fontSize: 2,
    borderRadius: 6,
    cursor: 'pointer',
    px: 3,
    py: 2,
    ':hover': {
      bg: 'green.800',
      borderColor: 'border',
    },
  },
  iconButton: {
    bg: 'red.100',
  },
  btnMenu: {
    mr: 2,
    a: {
      textDecoration: 'none',
      color: 'text',
      py: 2,
      px: 1,
      width: '100%',
      '&.active': {
        background: '#E2F7EA',
        color: 'green.800',
        svg: {
          fill: 'green.300',
        },
      },
      ':hover': {
        background: '#E2F7EA',
      },
    },
  },
  btnSecondary: {
    variant: 'buttons.btnPrimary',
    bg: 'neutral.100',
    cursor: 'pointer',
    color: 'gray.1000',
    fontSize: 2,
    borderRadius: 6,
    border: 'solid 1px',
    borderColor: 'border',
    ':hover': {
      bg: 'gray.200',
      color: 'gray.900',
    },
  },
  btnAction: {
    variant: 'buttons.btnBig',
    bg: 'gray.900',
    color: 'gray.200',
    borderColor: 'border',
    ':hover': {
      bg: 'gray.1000',
      color: 'gray.100',
    },
  },
  btnSmall: {
    cursor: 'pointer',
    variant: 'buttons.btnSecondary',
    fontSize: 0,
    p: 1,
    px: 2,
  },
  btnPrimaryLarge: {
    variant: 'buttons.btnBig',
    fontSize: 1,
    p: 2,
    px: 3,
    border: 0,
  },
  base: {
    bg: 'transparent',
    color: 'gray.500',
  },
  button: {
    border: 'solid 1px',
    borderColor: 'border',
    p: 1,
    mt: 3,
    lineHeight: 0,
    svg: { fill: 'text' },
    bg: 'gray.200',
    cursor: 'pointer',
  },
  buttonApproval: {
    ml: 3,
    bg: 'neutral.100',
    fontSize: 0,
    fontWeight: 600,
    color: 'gray.800',
    border: 'solid 1px ',
    borderRadius: '6px',
    borderColor: 'gray.100',
    fontFamily: 'heading',
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&:hover': {
      color: 'gray.900',
      bg: 'neutral.200',
    },
  },
  btnDelete: {
    background: 'none',
    cursor: 'pointer',
    pr: '0px',
    pl: '28px',
    display: 'flex',
  },
};

export default buttons;
