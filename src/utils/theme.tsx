const colors = {
  blue: '#3354E1',
  greys: ['#e1e0e4', '#b4b2bb', '#8b8796', '#413d4e'],
  white: '#FFF',
  black: '#333',
};

const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace',
  },
  // fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontSizes: [12.8, 16, 20, 20, 25, 31.25, 39.06, 48.83, 61.04],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#07c',
    secondary: '#30c',
    muted: '#f6f6f6',
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529',
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a',
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d',
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c',
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4',
    ],
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7',
    ],
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285',
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b',
    ],
    green: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057',
      '#37b24d',
      '#2f9e44',
      '#2b8a3e',
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d',
    ],
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700',
    ],
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f',
    ],
  },
  forms: {
    label: {
      color: 'gray.7',
      fontSize: 1,
      pb: 1,
    },
    input: {
      color: 'gray.8',
      fontWeight: 500,
      border: 'solid 1px',
      borderColor: 'gray.4',
      bg: 'white',
      mb: 2,
      borderRadius: 2,
    },
    select: {
      color: 'gray.8',
      fontWeight: 500,
      border: 'solid 1px',
      borderColor: 'gray.4',
      bg: 'white',
      mb: 2,
      borderRadius: 2,
    },
    textarea: {
      color: 'gray.8',
      fontWeight: 500,
      border: 'solid 1px',
      borderColor: 'gray.4',
      bg: 'white',
      mb: 2,
      borderRadius: 2,
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h1: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 5,
    },
    h2: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 4,
    },
    h3: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 3,
    },
    h4: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 2,
    },
    h5: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 1,
    },
    h6: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 0,
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    a: {
      color: 'primary',
    },
    pre: {
      fontFamily: 'monospace',
      overflowX: 'auto',
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    img: {
      maxWidth: '100%',
    },
  },
  links: {
    rel: {
      position: 'relative',
      display: 'block',
      // bg: 'red'
    },
    bold: {
      fontWeight: 'bold',
    },
    button: {
      fontWeight: 500,
      color: 'inherit',
      border: 'solid 1px',
      fontFamily: 'heading',
      fontSize: 0,
      px: 2,
      py: 2,
      borderRadius: 2,
      bg: 'gray.1',
      borderColor: 'gray.3',
      letterSpacing: -0.2,
      textDecoration: 'none',
      display: 'inline-flex',
    }
  },
  variants: {
    baseForm: {
      width: '100%',
      // bg: 'purple'
    },
    w100: {
      width: '100%',
    },
    w90: {
      width: '90%',
    },
    w80: {
      width: '80%',
    },
    w70: {
      width: '70%',
    },
    w60: {
      width: '60%',
    },
    w50: {
      width: '50%',
    },
    w20: {
      width: '25%',
    },
    w33: {
      width: '33%',
    },
    hidden: {
      display: 'none'
    },
    download: {
      bg: 'red',
      color: 'blue',
    },
    plateLite: {
      p: 0,
      mb: 4,
      pb: 4,
      borderBottom: 'solid 1px',
      borderColor: 'gray.4'
    },
    plateBox: {
      border: 'solid 1px',
      borderColor: 'gray.0',
      bg: 'white',
      px: 3,
      py: 3,
    },
    plateBlock: {
      base: 'plateBox',
      bg: 'white',
      mr: 4,
      p: 4,
      width: '25%',
      border: 'solid 1px',
      borderColor: 'gray.2',
      borderLeft: 'solid 3px',
    },
    plateSide: {
      base: 'plateBox',
    },
    button: {
      bg: 'red',
    },
    header: {
      borderBottom: 'solid 1px',
      borderColor: 'gray.2',
      paddingBottom: 2,
      bg: 'white',
      paddingTop: 2,
      paddingLeft: 2,
    },
    plateRightBar: {
      bg:'white',
      border: 'solid 1px',
      borderColor: 'gray.2',
      p: 3,
      position: 'fixed',
      right: 0,
      width: '25%',
      minHeight: '100vh',
      top: '72px',
    },
    boxCard: {
      width: '123px',
      height: '123px',
      background: 'white',
      border: '1px solid #E0E0E0',
      borderRadius: '5px',
    },
    listWide: {
      // borderRadius: 2,
      // padding: 2,
      // marginTop: 2,
      p: 0,
      borderBottom: 'solid 1px',
      borderColor:'gray.1',
      pl: 4,
      pt: 3,
      pb: 3,
      ':hover': {
        bg: 'gray.0',
      },
      // paddingBottom: '24px',
      // bg: 'blue',
      // position: 'relative',
    },
    cTyeMark: { 
      width: '2px',
      position: 'absolute',
      top: 0,
      left: -4,
      height: '40px',
      display: 'inline-block',
      borderRadius: '0px'
    }
  },
  text: {
    caps: {
      pt: 2,
      fontSize: 0,
      textTransform:'uppercase'
    },
    download: {
      color: 'red.9'
    },
    menulink: {
      fontSize: 1,
    },
    pagetitle: {
      fontSize: 3,
      mb: 2,
      fontWeight: 'heading'
    },
    pageinfo: {
      color: 'gray.6'
    },
    pagedesc: {
      fontSize: 1,
      mb: 4,
      color: 'gray.6'
    },
    pageheading: {
      fontSize: 3,
      mb: 1,
    },
    personName: {
      fontSize: 1,
      fontWeight: 'heading',
      mb: 1,
    },
    personBio: {
      fontSize: 0,
      mb: 0,
    },
    personBlock: {
      color: 'gray.6',
      fontSize: 0,
      fontWeight: 'heading'
    },
    personPlace: {
      fontSize: 0,
      mt: 0,
      color: 'gray.5'
    }
  },
  buttons: {
    secondary: {
      color: 'gray.8',
      bg: 'gray.1',
      border: 'solid 1px',
      borderColor: 'gray.2',
      mb: 3,
      mt: 3,
      display: 'inline-flex',
      pt: 1,
      pb: 1,
    },
    primary: {
      color: 'white',
      bg: 'primary',
    },
  },
};

export default theme;
