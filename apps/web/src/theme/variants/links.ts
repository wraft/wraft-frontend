import type { Theme } from 'theme-ui';

const links: Theme['links'] = {
  none: {
    textDecoration: 'none',
    color: 'inherit',
    p: 0,
    m: 0,
  },
  download: {
    color: 'red.500',
    svg: {
      fill: 'red.500',
    },
  },
  btnNavLink: {
    p: 2,
    px: 3,
    // display: 'block',
    letterSpacing: '-0.15px',
    textDecoration: 'none',
  },
  btnPrimary: {
    textDecoration: 'none',
    variant: 'buttons.btnPrimary',
    color: 'backgroundWhite',
    fontWeight: 500,
    px: 3,
    borderRadius: 4,
  },
  btnSecondary: {
    variant: 'buttons.btnPrimary',
    border: 'solid 1px #ddd',
    fontSize: 2,
    px: 3,
    py: 2,
    bg: 'neutral.300',
    color: 'text',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 6,
    borderColor: 'border',
    a: {
      textDecoration: 'none',
    },
  },
  btnSmall: {
    variant: 'buttons.btnSmall',
    p: 2,
    px: 3,
    bg: 'gray.100',
    borderColor: 'border',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: 1,
  },
  btnPrimarySmall: {
    variant: 'buttons.btnPrimary',
    // fontSize: 0,
    p: 2,
    px: 2,
    color: 'gray.100',
    '&:hover': {
      bg: 'teal.900',
    },
  },
  btnPrimaryIcon: {
    bg: 'gray.100',
    border: 'solid 1px',
    borderColor: 'border',
    color: 'text',
    borderRadius: 4,
    display: 'inline-flex',
    alignItems: 'stretch',
    pt: 2,
    pr: 3,
    pl: 2,
    '&:hover': {
      bg: 'gray.200',
      borderColor: 'border',
    },
    // mt: -1,
    // color: 'gray.100',
    // pb: 0,
  },
  iconCircle: {
    p: 0,
    a: {
      color: 'blue',
      bg: 'transparent !important',
    },
    bg: 'transparent',
    ':hover': {
      bg: 'transparent',
    },
  },
  base: {
    width: '100%',
    color: 'text',
    textDecoration: 'none',
  },
  rel: {
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
  },
  download2: {
    color: 'green.1000',
    fontSize: 0,
    textTransform: 'uppercase',
    textDecoration: 'none',
    mt: 2,
    display: 'block',
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    fontFamily: 'body',
    fontWeight: 500,
    color: 'primary',
    border: 'solid 1px',
    fontSize: 0,
    px: 3,
    py: 2,
    borderRadius: 4,
    bg: 'text',
    borderColor: 'border',
    letterSpacing: -0.2,
    textDecoration: 'none',
    display: 'inline-flex',
    ':hover': {
      bg: 'primary',
      color: 'white',
    },
  },
};

export default links;
