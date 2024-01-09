import type { Theme } from 'theme-ui';

const buttons: Theme['buttons'] = {
  buttonPrimary: {
    cursor: 'pointer',
    color: 'white',
    backgroundColor: '#004A0F',
    borderRadius: '6px',
    p: '8px 16px',
    ':disabled': {
      color: 'gray.900',
      bg: 'neutral.300',
    },
    // Uncomment the next line if needed
    //, ":hover": {
    //   "bg": "green.8"
    // }
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
    color: 'dark.600',
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
  contentButton: {
    bg: 'transparent',
    border: 0,
    borderColor: 'border',
    color: 'gray.900',
    textAlign: 'left',
  },
  btnPrimaryIcon: {
    bg: 'gray.100',
    border: 'solid 1px',
    borderColor: 'border',
    color: 'gray.900',
    borderRadius: 4,
    display: 'inline-flex',
    alignItems: 'stretch',
    pt: 2,
    pr: 3,
    pl: 2,
    ':hover': {
      bg: 'gray.200',
      borderColor: 'border',
    },
  },
  btnBig: {
    variant: 'buttons.buttonPrimary',
    p: 1,
    px: 2,
    m: 0,
    border: 'solid 1px',
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 0,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  btnPrimary: {
    variant: 'buttons.btnBig',
    bg: 'primary.9',
    color: 'primary.1',
    fontSize: 2,
    borderRadius: 6,
    px: 3,
    py: 2,
    ':hover': {
      bg: 'gray.500',
      borderColor: 'border',
    },
  },
  btnSecondary: {
    variant: 'buttons.btnPrimary',
    bg: 'neutral.100',
    color: 'gray.1000',
    fontSize: 2,
    borderRadius: 6,
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
  btnMain: {
    variant: 'buttons.btnSecondary',
  },
  btnSmall: {
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
  btnPrimarySmall: {
    variant: 'buttons.btnPrimary',
    fontSize: 0,
    p: 1,
    px: 2,
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
  primary: {
    variant: 'button.btnPrimary',
  },
  secondary: {
    color: 'blue.1000',
    bg: 'blue.300',
    fontFamily: 'body',
  },
  tertiary: {
    color: 'blue.1000',
    bg: 'blue.300',
  },
};

export default buttons;
