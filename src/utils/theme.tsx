const colors = {
  blue: '#212A5F',
  greys: ['#e1e0e4', '#b4b2bb', '#8b8796', '#413d4e'],
  white: '#FFF',
  black: '#333',
};

const theme = {
  colors: {
    primary: colors.blue,
    text: colors.black,
    background: colors.white,
    secondary: '#FFF2ED',
    tertiary: '#999999',
    quaternary: '#F7F7F7',
    red: '#a70c0c2e',
    green: '#2ba70c2e',
    ...colors,
  },
  shadows: {
    card: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  space: [0, 4, 8, 16, 24, 32, 40, 48, 56, 64],
  fontSizes: [12.8, 16, 20, 25, 31.25, 39.06, 48.83, 61.04],
  radii: {
    default: 2,
  },
  breakpoints: ['850px', '1100px', '64em'],
  fonts: {
    system: [
      'Metropolis',
      'IBM Plex Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
    ],
    serif: ['Georgia', 'serif'],
  },
  forms: {
    label: {
      color: '#8b8796',
      fontSize:0,
      pb:1,
    },
    input: {
      color: '#444',
      fontWeight: 500,
      border: 'solid 1px #ddd',
      bg: 'white',
      mb: 2,
    },
    select: {
      color: '#444',
      fontWeight: 500,
      border: 'solid 1px #ddd',
      bg: 'white'
    },
    textarea: {
      color: '#444',
      fontWeight: 600,
      border: 'solid 1px #ddd',
      bg: 'white',
      mb: 1,
    },
  },
  variants: {
    searchList: {
      border: 'solid 1px #eee',
      bg: 'secondary',
      p: 2,
    },
    sachetList: {
      border: 'solid 1px #eee',
      bg: 'secondary',
    },
    table: {
      border: 'solid 1px #eee',
      bg: 'white',
    },
    card3: {
      bg: 'white',
      p: 4,
      pl: 3,
      pr: 2,
    },
    navBlock: {
      pb: 3,
    },
    mealCard: {
      height: '290px',
      width: '200px',
      bg: 'primary',
    },
    mealCardEmpty: {
      bg: 'secondary',
      width: '200px',
      height: '290px',
      p: 0,
      border: 'dotted 1px',
      borderColor: 'tertiary',
    },
    mealCardTitle: {
      p: 3,
    },

    imageUploader: {
      border: 'dotted 2px #ddd',
      p: 4,
      borderRadius: 3,
      mb:0,
    },

    // mealCardTitle: {
    //   p: 3,
    // },
    card: {
      border: 'solid 1px',
      borderColor: 'tertiary',
      p: 3,
      bg: 'white',
      mb: 3,
      borderRadius: 2,
    },
    secondary: {
      bg: 'tertiary',
    },
    label: {
      // fontFamily: 'system',
    },
    field: {
      border: 'solid 1px #ddd',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
    },
    linkButton: {
      color: 'white',
      bg: 'primary',
      textDecoration: 'none',
      marginRight: 2,
    },
    big: {

    },
    nav: {
      boxShadow: 'card',
      color: '#000',
    },
    success: {
      bg: 'green',
      p: 3,
      mb: 4,
      lineHeight: 1.25,
    },
    error: {
      bg: 'red',
      p: 3,
      mb: 4,
      lineHeight: 1.25,
    },
    centered: {
      // backgroundColor: '#f2edff',
      textAlign: ['center', 'left', 'left'],
      p: [4, 0, 0],
      m: 0,
    },
    centeredBg: {
      backgroundColor: '#f2edff',
      textAlign: ['center', 'left', 'left'],
      p: [4, 0, 0],
      m: 0,
    },
    fill: {
      flexDirection: ['column', 'row', 'row'],
      pl: [3, 0, 0],
      pr: [3, 0, 0],
    },
    boxy: {
      border: 'solid 1px #ddd',
      p: 0,
      mt: 3,
      ml: 3,
      pt: 3,
      pb: 2,
    },
    bordered: {
      border: 'solid 1px #ddd',
      p: 3,
      mb: 3,
    },
    fillx: {
      minHeight: '100vh',
    },
    tableItem: {
      borderBottom: 'solid 1px #ddd',
      pt: 3,
      pr: 3,
      pl: 3,
      pb: 2,
    },
  },
  buttons: {    
    button: {
      bg: 'green',
    },
    medium: {
      bg: 'primary',
      // fontFamily: 'system',
      fontSize: 0,
      color: 'white',
      borderRadius: 0,
      fontWeight: 600,
    },
    small: {
      bg: 'transparent',
      py: 2,
      fontSize: 0,
      border: 'solid 1px #ddd',
      // fontFamily: 'system',
      color: '#444',
      borderRadius: 0,
      display: 'flex',
      paddingTop: '6px',
      marginRight: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.25px',
    },
    small2: {
      bg: 'transparent',
      // py: 2,
      fontSize: 0,
      // fontFamily: 'system',
      borderRadius: 0,
      display: 'flex',
      paddingTop: '6px',
      marginRight: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.25px',
      mt: -3,
      p: 0,
      ml: 'auto',
      color: 'primary',
    },
    inline: {
      bg: 'transparent',
      p: 0,
      pt: 0,
      pr: 0,
      color: 'black',
    },
    primary: {
      // color: '#fff !important',
      bg: 'primary',
      color: 'white',
      fontWeight: 600,
      borderRadius: 0,
      textTransform: 'uppercase',
      fontSize: 1,
      mb:4,
      pt: 2,
      pr: 4,
      display: 'flex',
    },
    disabled: {
      color: 'secondary',
      bg: 'tertiary',
      borderRadius: 0,
      fontWeight: 600,
      // fontFamily: 'system',
      pl: 5,
      pt: 3,
      pb: 3,
      pr: 4,
      fontSize: 1,
    },
    secondary: {
      bg: 'tertiary',
      color: 'white',
      borderRadius: 4,
      textTransform: 'uppercase',
      // border: 'solid 1px',
      borderColor: 'tertiary',

      mb:4,
      pt: 2,
      pr: 4,

    },
  },
  link: {
    button: {
      bg: 'primary',
    },
  },
  images: {
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 99999,
    },
    profile: {
      width: 80,
      height: 80,
      borderRadius: 99999,
    },
  },
  text: {
    serif: {
      fontFamily: `'Prata', georgia, serif`,
    },
    cardtitle: {
      fontSize:1,
      fontWeight: 600,
    },
    smalltitle: {
      mb: 2,
      fontSize:1,
      mt: 1,
    },
    blocktitle: {
      mb: 2,
      fontSize:2,
      mt: 1,
      fontWeight:900,
    },
    dim: {
      fontSize:3,
    },
    tag: {
      bg: '#eee',
      display: 'inline-block',
      border: 'solid 1px #ddd',
      mr: 3,
      fontSize: 0,
      py: 4,
      p:1,
    },
    smallHeading: {
      mb: 2,
      fontSize:1,
      mt: 1,
      fontWeight:900,
    },
    mediumHeading: {
      base: 'smallHeading',
      fontSize:2,
      mb: 2,      
    },
    pagetitle: {
      mb: 3,
      fontSize:3,
      mt: 1,
      fontWeight:300,
      color: 'black',
    },
    body: {
      fontSize: 0,
      lineHeight: 1.5,
    },
    label: {
      color: 'tertiary',
      textTransform: 'uppercase',
      // fontFamily: 'system',
      fontSize: 0,
      fontWeight: 400,
    },
    labelForm: {
      color: 'secondary',
      // fontFamily: 'system',
      fontSize: 1,
      fontWeight: 500,
    },
    info: {
      color: 'secondary',
      fontSize: 0,
      mt: 2,
      // fontFamily: 'system',
    },
    smallcaps: {
      textTransform: 'uppercase',
      fontSize: 0,
      paddingLeft: '8px',
      paddingTop: '4px',
      fontWeight: 'bold',
      color: '#0a1f09',
    },
    bigheading: {
      fontSize: [4, 4, 5],
      fontWeight: 600,
      lineHeight: 1.15,
      color: 'black',
      textAlign: ['center', 'left', 'left'],
      pr: 4,
    },
    heading1: {
      fontSize: [2, 2, 2],
      fontWeight: 600,
      textAlign: ['center', 'left', 'left'],
    },
    body1: {
      fontSize: [2, 2, 2],
      textAlign: ['center', 'left', 'left'],
    },
    caps: {
      fontSize: 0,
      textTransform: 'uppercase',
      textAlign: ['center', 'left', 'left'],
      letterSpacing: '0.3px',
      pt: 3,
    },
    subheading: {
      fontSize: [1, 2, 2],
      fontWeight: 300,
    },
    labelbig: {
      color: 'tertiary',
    },
    heading: {
      mb: 3,
      // fontFamily: 'system',
    },
    // pagetitle: {
    //   fontSize: [2, 3, 3],
    //   // fontFamily: 'system',
    //   mt: 5,
    //   mb: 4,
    //   fontWeight: 600,
    // },
    blockbody: {
      fontSize: 1,
      lineHeight: 1.5,
    },
    smallHead: {
      fontSize: 0,
      color: 'primary',
      mb: 1,
    },
  },
};

export default theme;
