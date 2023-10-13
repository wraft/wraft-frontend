import { Theme, ThemeUIStyleObject } from 'theme-ui';

type Variant = ThemeUIStyleObject;

type CustomVariantGroups = {
  variants: {
    onboardingFormPage: Variant;
    onboardingForms: Variant;
  };
};

const theme: Theme & CustomVariantGroups = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: "'Inter', sans-serif",
    heading: 'inherit',
    editor1: "'Inter', sans-serif",
    editor2:
      '\'Inter\', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif', //"'IBM Plex Mono', monospace",
    // font-family:
    monospace: 'Menlo, monospace',
    satoshi:
      '\'Satoshi\', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  initialColorModeName: 'light',
  useColorSchemeMediaQuery: true,
  fontSizes: [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48],
  fontWeights: {
    body: 400,
    heading: 500,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    muted: '#f6f6f6',
    text: '#000',
    dimGray: '#F5F7FA',
    background: '#FAFBFC',
    primary: '#00471A',
    primary_700: '#004A0F',
    border: '#E4E9EF',
    success_100: '#9FE5B9',
    success_400: '#008932',
    success_500: '#006726',
    success_600: '#00471A',
    dark_300: '#8F959B',
    dark_600: '#343E49',
    dark_200: '#B1B5B9',
    dark_400: '#6F777F',
    input_border: '#D7DDE9',
    info_400: '#007FA6',
    info_200: '#41C3E9',
    error_400: '#D33E60',
    warning_300: '#E3774C',
    warning_500: '#88472E',
    primary_500: '#3748CF',
    white: '#fff',
    bgWhite: '#fff',

    // primary: '#00471A',
    secondary: 'gray.8',
    neutral: [
      '#FAFBFD', //light
      '#E4E9EF', //nutral
      '#C1C6DB', //dark
    ],
    gray: [
      '#D4D7DA',
      '#BCC0C5',
      '#A5ABB2',
      '#8E969E',
      '#79828B',
      '#656E78',
      '#515B66',
      '#3E4854',
      '#2C3641',
      '#1D252F',
    ],
    green: [
      '#C5DCC7',
      '#68A371',
      '#3A8549',
      '#197231',
      '#006222',
      '#005517',
      '#004A0F',
      '#004008',
      '#003604',
      '#002D02',
    ],
    blue: [
      '#BAD9FF',
      '#94C3FF',
      '#72ADFF',
      '#5095FF',
      '#307CFF',
      '#0D60FC',
      '#004BDF',
      '#0038BB',
      '#002997',
      '#001A71',
    ],
    red: [
      '#FFC9C0',
      '#FCAC9F',
      '#F68E7F',
      '#ED705F',
      '#E15142',
      '#D02F23',
      '#BA0000',
      '#950000',
      '#750000',
      '#550000',
    ],
    orange: [
      '#FFCAB3',
      '#FFAC8B',
      '#FF8B60',
      '#FF632C',
      '#F04100',
      '#D12E00',
      '#B12000',
      '#901400',
      '#720B00',
      '#520500',
    ],
    cyan: [
      '#C5D9E3',
      '#679CB4',
      '#397E9A',
      '#166A87',
      '#005A77',
      '#004E69',
      '#00435D',
      '#003950',
      '#003045',
      '#00283B',
    ],
    teal: [
      '#EFF5F0',
      '#C5DCC7',
      '#68A371',
      '#3A8549',
      '#197231',
      '#006222',
      '#005517',
      '#004008',
      '#003604',
      '#002D02',
    ],

    modes: {
      dark: {
        text: '#fff',
        base: '#000',
        background: '#111',
        dimGray: '#f5f7fa0f',
        bgWhite: '#1D252F',
        neutral: ['#1D252F', '#2C3641', '#D4D7DA'],
        gray: [
          '#1D252F',
          '#2C3641',
          '#3E4854',
          '#515B66',
          '#656E78',
          '#79828B',
          '#8E969E',
          '#A5ABB2',
          '#BCC0C5',
          '#D4D7DA',
        ],
        green: [
          '#002D02',
          '#003604',
          '#004008',
          '#004A0F',
          '#005517',
          '#006222',
          '#197231',
          '#3A8549',
          '#68A371',
          '#C5DCC7',
        ],
      },
    },
  },
  forms: {
    label: {
      color: 'gray.5',
      fontSize: 2,
      fontWeight: 500,
      pb: 0,
      ':disabled': {
        color: 'gray.2',
      },
    },
    input: {
      variant: 'text.subM',
      color: 'gray.8',
      fontWeight: 'body',
      border: 'solid 1px',
      borderColor: 'neutral.1',
      fontFamily: 'body',
      mb: 2,
      fontSize: 3,
      py: 1,
      borderRadius: 4,
      ':disabled': {
        color: 'gray.1',
        bg: 'background',
        // borderColor: 'neutral.0',
      },
      '::placeholder': {
        variant: 'text.subM',
        color: 'gray.2',
      },
    },
    checkbox: {
      // '-webkit-tap-highlight-color': 'transparent',
      color: 'neutral.1',
      // bg: 'gray.8',
      // border: '1px solid',
      // borderColor: 'gray.0',
      // ':checked': {
      //   bg: 'gray.8',
      // },
      // ':focus': {
      //   outline: 'none',
      // },
    },

    small: {
      // bg: 'gray.0',
      fontSize: 0,
      p: 0,
      px: 3,
      fontFamily: 'body',
      fontWeight: 500,
      borderColor: 'gray.2',
    },
    select: {
      color: 'gray.8',
      fontWeight: 500,
      border: 'solid 1px',
      bg: 'bgWhite',
      borderColor: 'neutral.1',
      mb: 2,
      borderRadius: 4,
    },
    textarea: {
      color: 'gray.8',
      fontWeight: 500,
      border: 'solid 1px',
      bg: 'bgWhite',
      borderColor: 'neutral.1',
      fontFamily: 'body',
      mb: 2,
      borderRadius: 4,
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
    h3Medium: {
      color: 'primary_700',
      fontWeight: 'heading',
      lineHeight: '38.88px',
      fontSize: '29.3px',
    },
    a: {
      color: 'primary',
      textDecoration: 'none',
    },
    pre: {
      fontFamily: 'body',
      overflowX: 'auto',
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontFamily: 'body',
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
    editorBody: {
      '.remirror-theme h1': {},

      '.remirror-editor-wrapper': {},
      '.remirror-theme .ProseMirror': {
        outline: 'none',
        // border: 'solid 1px #ddd',
        // color: #721515 !important;
        // pl: '4rem',
        // pr: '4rem',
        // pt: '4rem',
        // pb: '4rem',
        p: 0,
      },
      p: { color: 'gray.9', fontFamily: 'body', pt: 2, pb: 1, fontSize: 0 },
      h1: {
        color: 'red.5',
        py: 3,
        fontFamily: 'body',
        textTransform: 'uppercase',
        lineHeight: 1.25,
        fontSize: 1,
      },
      h2: {
        color: 'red.3',
        py: 3,
        fontFamily: 'body',
        lineHeight: 1.25,
        fontSize: 1,
      },
      h3: {
        color: 'red.3',
        py: 3,
        fontFamily: 'body',
        textTransform: 'uppercase',
        lineHeight: 1.25,
        fontSize: 1,
      },
      h4: {
        color: 'red.3',
        py: 3,
        fontFamily: 'body',
        lineHeight: 1.25,
        fontSize: 1,
      },
    },
    editorBody2: {
      '.remirror-theme .remirror-editor': {
        bg: 'red',
        p: 5,
      },
      '.remirror-theme h1': {
        fontFamily: 'editor2',
      },
      '.remirror-theme .ProseMirror': {
        outline: 'none',
        border: 'solid 1px',
        fontFamily: 'editor2',
        borderColor: 'neutral.1',
        lineHeight: 1.65,
        bg: 'neutral.0',
        h1: { color: 'gray.7', fontFamily: 'editor2', pt: 2, pb: 1 },
        h2: { color: 'gray.7', fontFamily: 'editor2', pt: 2, pb: 1 },
        h3: { color: 'gray.7', fontFamily: 'editor2', pt: 2, pb: 1 },
        '.holder': {
          bg: 'green.1',
          color: 'green.8',
        },
      },
      p: { color: 'gray.7', fontFamily: 'editor2', pt: 2, pb: 1 },
      h1: {
        color: 'red.5',
        py: 3,
        fontFamily: 'editor2',
        lineHeight: 1.25,
        fontSize: 1,
      },
      h2: {
        color: 'red.3',
        py: 3,
        fontFamily: 'editor2',
        lineHeight: 1.25,
        fontSize: 1,
      },
      h3: {
        color: 'red.3',
        py: 2,
        fontFamily: 'editor2',
        lineHeight: 1.25,
        fontSize: 1,
      },
      h4: {
        color: 'red.3',
        py: 3,
        fontFamily: 'editor2',
        lineHeight: 1.25,
        fontSize: 1,
      },
    },
  },
  links: {
    download: {
      color: 'red.4',
      svg: {
        fill: 'red.4',
      },
    },
    btnNavLink: {
      p: 2,
      px: 3,
      display: 'block',
      letterSpacing: '-0.15px',
      textDecoration: 'none',
    },
    btnPrimary: {
      textDecoration: 'none',
      variant: 'buttons.btnPrimary',
      color: 'bgWhite',
      fontWeight: 500,
      px: 3,
      borderRadius: 4,
    },
    btnSecondary: {
      variant: 'buttons.btnSecondary',
      fontSize: 2,
      px: 3,
      py: 2,
      bg: 'neutral.1',
      color: 'gray.7',
      fontWeight: 600,
      textDecoration: 'none',
      borderRadius: 6,
      borderColor: 'gray.1',
    },
    btnSmall: {
      variant: 'buttons.btnSmall',
      p: 2,
      px: 3,
      bg: 'gray.0',
      borderColor: 'neutral.1',
      textDecoration: 'none',
      fontSize: 1,
    },
    btnPrimarySmall: {
      variant: 'buttons.btnPrimary',
      // fontSize: 0,
      p: 2,
      px: 2,
      color: 'gray.0',
      '&:hover': {
        bg: 'teal.8',
      },
    },
    btnPrimaryIcon: {
      bg: 'gray.0',
      border: 'solid 1px',
      borderColor: 'gray.4',
      color: 'gray.8',
      borderRadius: 4,
      display: 'inline-flex',
      alignItems: 'stretch',
      pt: 2,
      pr: 3,
      pl: 2,
      '&:hover': {
        bg: 'gray.1',
        borderColor: 'gray.5',
      },
      // mt: -1,
      // color: 'gray.0',
      // pb: 0,
    },
    base: {
      width: '100%',
      color: 'gray.8',
      textDecoration: 'none',
    },
    rel: {
      position: 'relative',
      display: 'block',
      textDecoration: 'none',
    },
    download2: {
      color: 'green.9',
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
      borderColor: 'gray.3',
      letterSpacing: -0.2,
      textDecoration: 'none',
      display: 'inline-flex',
      ':hover': {
        bg: 'primary',
        color: 'white',
      },
    },
  },
  layout: {
    dialog: {
      bg: 'neutral.0',
      position: 'fixed',
      inset: '20ch',
      zIndex: 50,
      margin: 'auto',
      display: 'flex',
      height: 'fit-content',
      maxHeight: 'calc(100vh - 2 * 0.75rem)',
      flexDirection: 'column',
      gap: '1rem',
      overflow: 'auto',
      borderRadius: '0.75rem',
      padding: 0,
      color: 'hsl(204 10% 10%)',
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      transformOrigin: 'center',
      opacity: 1,
      transitionProperty: 'opacity, transform',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
      transform: 'scale(0.95)',
    },
    backdrop: {
      bg: 'hsl(204 10% 10% / 0.8)',
      opacity: 1,
      transitionProperty: 'opacity, backdrop-filter',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
      backdropFilter: 'blur(0)',
    },
    squareButton: {
      width: '24px',
      height: '24px',
      border: 'solid 1px',
      borderColor: 'neutral.1',
      position: 'absolute',
      top: 2,
      left: '20px',
      padding: '5px',
      // background: "#fff",
      borderRadius: '4px',
      // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    boxHeading: {
      pl: 3,
      pt: 2,
      width: '100%',
      borderTop: 'solid 1px',
      borderTopColor: 'neutral.1',
      borderBottom: 'solid 1px',
      borderBottomColor: 'neutral.1',
    },

    modalContent: {
      p: 0,
      top: '10%',
      // m: 2,
      position: 'relative',
      // left: 0,
      right: 0,
      // top: 0,
      // mt: ['50%', 0, 0],
      zIndex: 300,
      // ml: '-10%',
      // right: 'auto',
      // bottom: 'auto',
      borderRadius: '8px',
      // mr: '-50%',
      // transform: 'translate(-30% -30%)',
      // height: '10%', // <-- This sets the height
      width: ['80%', '70%', '60%'],
      bg: 'gray.0',
      mx: 'auto',
      // mt: '-30%',
      overflow: 'scroll', // <-- This tells the modal to scrol
    },
    modalContentB: {
      top: '10%',
      m: 2,
      position: 'relative',
      // left: 0,
      right: 0,
      // top: 0,
      mt: ['50%', 0, 0],
      zIndex: 300,
      // ml: '-10%',
      // right: 'auto',
      // bottom: 'auto',
      borderRadius: '8px',
      // mr: '-50%',
      // transform: 'translate(-30% -30%)',
      // height: '10%', // <-- This sets the height
      width: ['80%', '70%', '40%'],
      bg: 'gray.0',
      mx: 'auto',
      // mt: '-30%',
      // p: 4,
      border: 'solid 1px',
      borderColor: 'gray.2',
      overflow: 'scroll', // <-- This tells the modal to scrol
    },
    modalBackgroup: {
      bg: 'rgba(30,30,30,0.85)',
      position: 'fixed',
      zIndex: 200,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    frameHeading: {
      bg: 'bgWhite',
      pb: 4,
      px: 4,
      py: 2,
      borderBottom: 'solid 1px',
      borderColor: 'neutral.1',
      mb: 0,
      // minHeight: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    button: {
      border: 'solid 1px',
      borderColor: 'gray.2',
      p: 1,
      mt: 3,
      lineHeight: 0,
      svg: { fill: 'text' },
      bg: 'gray.1',
    },
    linkBlock: {
      bg: 'gray.0',
    },
    pageFrame: {
      p: 4,
      height: 'calc(100vh - 80px)',
      overflow: 'scroll',
    },
    menuWrapper: {
      // bg: 'red.2',
      px: 2,
      py: 0,
      color: 'gray.7',
      ':hover': {
        color: 'gray.9',
      },
      cursor: 'pointer',
    },
    menuLink: {
      cursor: 'pointer',
      mb: 0,
      p: 1,
      px: 2,
      borderRadius: 3,
      fontWeight: 600,
      width: '100%',
      color: '#343E49',
      a: {
        fontWeight: 600,
      },
      ':hover': {
        bg: 'rgba(155, 225, 181, 0.3);',
        svg: {
          color: '#008932',
        },
      },
    },
    menuBlockWrapper: {
      border: 0,
      borderColor: 'gray.2',
      minWidth: '20ch',
      bg: 'neutral.0',
      zIndex: 900,
      boxShadow: `2px 3px 14px 0px rgba(0, 0, 0, 0.16)`,
    },
    menuItem: {
      px: 3,
      py: 2,
      fontSize: 2,
      cursor: 'pointer',
      borderBottom: 'solid 1px',
      bg: 'neutral.0',
      color: 'gray.6',
      borderBottomColor: 'neutral.1',
      '&:hover': {
        bg: 'neutral.1',
      },
    },
    menuItemHeading: {
      variant: 'layouts.menuItem',
      fontSize: 1,
      color: 'gray.3',
      p: 2,
      py: 2,
    },
    menuLinkActive: {
      bg: 'gray.1',
      mb: 0,
      p: 2,
      borderRadius: 3,
      width: '100%',
      color: '#0d1c17',
      fontWeight: 900,
    },
    baseForm: {
      width: '100%',
    },
    avatar: {
      width: '24px',
      height: '24px',
      borderRadius: 99,
      mr: 1,
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
      minWidth: '70%',
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
      display: 'none',
    },
    download: {
      bg: 'red',
      color: 'blue',
    },
    plateSidebar: {
      ml: 3,
      width: '30%',
    },
    plateLite: {
      p: 0,
      mb: 4,
      pb: 4,
      borderBottom: 'solid 1px',
      borderColor: 'gray.4',
    },
    plateBox: {
      border: 'solid 1px',
      borderColor: 'gray.3',
      // bg: 'gray.0',
      // px: 3,
      py: 3,
    },
    button2: {
      mt: 3,
      borderRadius: 3,
      bg: 'red.2',
      color: 'text',
      display: 'block',
    },
    header: {
      borderBottom: 'solid 1px',
      borderColor: 'gray.2',
      paddingBottom: 2,
      paddingTop: 2,
      paddingLeft: 2,
    },
    plateRightBar: {
      bg: 'text',
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
      background: 'text',
      border: '1px solid #E0E0E0',
      borderRadius: '5px',
    },
    listWide: {
      // borderRadius: 2,
      // padding: 2,
      // marginTop: 2,
      p: 0,
      borderBottom: 'solid 1px',
      borderColor: 'gray.1',
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
      borderRadius: '0px',
    },
  },
  images: {
    profile: {
      width: '128px',
      height: '128px',
      borderRadius: '50%',
      objectFit: 'contain',
      bg: 'background',
    },
  },
  alerts: {
    primary: {
      color: 'green.8',
      bg: 'green.1',
    },
    alert: {
      color: 'red.8',
      bg: 'red.1',
    },
    muted: {
      color: 'text',
      bg: 'muted',
    },
  },
  text: {
    error: {
      variant: 'text.subR',
      color: 'red.5',
    },
    // paragraph
    pR: {
      color: 'gray.5',
      // fontSize: 1,
      fontSize: 2,
      fontWeight: 400,
      lineHeight: '1.6',
    },
    pM: {
      color: 'gray.8',
      // fontSize: 1,
      fontSize: 2,
      fontWeight: 500,
      lineHeight: '1.6',
    },
    pB: {
      color: 'gray.8',
      fontSize: 2,
      fontWeight: 700,
      lineHeight: '1.6',
    },

    subR: {
      color: 'gray.5',
      fontSize: 1,
      fontWeight: 400,
      lineHeight: '1.6',
    },

    subM: {
      color: 'gray.5',
      fontSize: 1,
      fontWeight: 400,
      lineHeight: '1.6',
    },
    // caption
    capM: {
      color: 'gray.5',
      // fontSize: 0,
      fontSize: 1,
      fontWeight: 500,
      lineHeight: '1.6',
    },
    labelSmall: {
      pl: 1,
      pr: 2,
      mr: 3,
      fontSize: 0,
      fontWeight: 400,
      color: 'gray.8',
      display: 'inline-block',
      textAlign: 'right',
      width: 'auto',
      textTransform: 'uppercase',
      letterSpacing: '-0.01rem',
    },
    labelcaps: {
      fontWeight: 300,
      color: 'gray.6',
      letterSpacing: '0.2px',
      textTransform: 'uppercase',
      fontSize: '10.24px',
    },
    sectionheading: {
      fontWeight: 300,
      fontSize: 1,
      lineHeight: '24px',
      pb: 2,
    },
    caps: {
      pt: 0,
      pb: 1,
      color: 'gray.7',
      fontSize: 0,
      textTransform: 'uppercase',
    },
    menulink: {
      fontSize: 3,
      fontWeight: 600,
    },
    pagetitle: {
      // color: 'red.6',
      fontSize: 4,
      mb: 3,
      fontWeight: 300,
    },
    pageinfo: {
      color: 'gray.7',
      fontWeight: 300,
    },
    pagedesc: {
      fontSize: 1,
      mb: 4,
      color: 'gray.6',
    },
    pageheading: {
      fontSize: 1,
      mb: 2,
      color: 'gray.7',
      fontWeight: 400,
      mt: 2,
    },
    personName: {
      fontSize: 1,
      fontWeight: 'heading',
      mb: 0,
    },
    personBio: {
      fontSize: 1,
      mb: 0,
      fontWeight: 'body',
      color: 'gray.6',
    },
    personBlock: {
      color: 'gray.6',
      fontSize: 0,
      fontWeight: 'heading',
    },
    personPlace: {
      fontSize: 0,
      mt: 0,
      color: 'gray.5',
    },
  },
  buttons: {
    buttonPrimary: {
      cursor: 'pointer',
      color: 'white',
      backgroundColor: 'primary_700',
      borderRadius: '6px',
      p: '8px 16px',
      ':disabled': {
        color: 'gray.8',
        bg: 'neutral.2',
      },
      ':hover': {
        bg: 'green.8',
      },
    },
    buttonPrimarySmall: {
      variant: 'buttons.buttonPrimary',
      fontSize: 2,
    },
    delete: {
      variant: 'buttons.buttonPrimary',
      bg: 'red.6',
    },
    cancel: {
      variant: 'buttons.buttonPrimary',
      bg: 'neutral.2',
      color: 'gray.8',
    },
    googleLogin: {
      fontWeight: 'body',
      color: 'dark_600',
      bg: 'bgWhite',
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
      '&:hover': {
        bg: 'transparent',
      },
      '&:focus': {
        bg: 'transparent',
      },
    },
    download: {
      bg: 'gray.1',
      textTransform: 'capitalize',
    },
    contentButton: {
      bg: 'transparent',
      border: 0,
      borderColor: 'gray.4',
      color: 'gray.8',
      textAlign: 'left',
    },
    btnPrimaryIcon: {
      bg: 'gray.0',
      border: 'solid 1px',
      borderColor: 'gray.4',
      color: 'gray.8',
      borderRadius: 4,
      display: 'inline-flex',
      alignItems: 'stretch',
      pt: 2,
      pr: 3,
      pl: 2,
      '&:hover': {
        bg: 'gray.1',
        borderColor: 'gray.5',
      },
      // mt: -1,
      // color: 'gray.0',
      // pb: 0,
    },
    btnBig: {
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
      '&:hover': {
        bg: 'green.4',
        borderColor: 'neutral.0',
      },
    },
    btnSecondary: {
      variant: 'buttons.btnPrimary',
      bg: 'neutral.0',
      color: 'gray.9',
      fontSize: 2,
      borderRadius: 6,
      borderColor: 'neutral.1',
      '&:hover': {
        bg: 'gray.1',
        color: 'gray.8',
      },
    },
    btnAction: {
      variant: 'buttons.btnBig',
      bg: 'gray.8',
      color: 'gray.1',
      borderColor: 'gray.8',
      '&:hover': {
        bg: 'gray.9',
        color: 'gray.0',
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
      color: 'gray.4',
    },
    button: {
      border: 'solid 1px',
      borderColor: 'gray.2',
      p: 1,
      mt: 3,
      lineHeight: 0,
      svg: { fill: 'text' },
      bg: 'gray.1',
      cursor: 'pointer',
    },
    secondary: {
      color: 'blue.9',
      bg: 'blue.2',
      fontFamily: 'body',
    },
    primary: {
      variant: 'button.btnPrimary',
    },
    tertiary: {
      color: 'blue.9',
      bg: 'blue.2',
    },
    // small: {
    //   bg: 'blue.5',
    //   px: 3,
    //   py: 1,
    //   fontSize: 0,
    // },
  },
  variants: {
    onboardingForms: {
      padding: '32px',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: '4px',
      backgroundColor: 'bgWhite',
      width: '574px',
      height: '629px',
      flexDirection: 'column',
    },
    onboardingFormPage: {
      padding: '80px',
      backgroundColor: 'background',
      justifyContent: 'center',
    },
  },
};

export default theme;
