const layout = {
  drawerBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
    opacity: 10,
    transitionDuration: '150ms',
  },
  dialog: {
    bg: 'neutral.100',
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
    borderRadius: '4px',
    padding: 0,
    color: 'hsl(204 10% 10%)',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    transformOrigin: 'center',
    opacity: 1,
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '150ms',
    transform: 'scale(0.95)',
    maxWidth: 'fit-content',
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
    borderColor: 'border',
    position: 'absolute',
    top: '5px',
    left: '8px',
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
    borderTopColor: 'neutral.200',
    borderBottom: 'solid 1px',
    borderBottomColor: 'neutral.200',
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
    bg: 'gray.100',
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
    bg: 'gray.100',
    mx: 'auto',
    // mt: '-30%',
    // p: 4,
    border: 'solid 1px',
    borderColor: 'border',
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
    bg: 'backgroundWhite',
    pb: 4,
    px: 4,
    py: 2,
    borderBottom: 'solid 1px',
    borderColor: 'border',
    mb: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'sticky',
    height: '72px',
  },
  button: {
    border: 'solid 1px',
    borderColor: 'border',
    p: 1,
    mt: 3,
    lineHeight: 0,
    svg: { fill: 'text' },
    bg: 'gray.200',
  },
  linkBlock: {
    bg: 'gray.100',
  },
  pageFrame: {
    bg: 'background',
    p: 4,
    height: 'calc(100vh - 72px)',
    overflow: 'scroll',
  },
  contentFrame: {
    width: '100%',
    // bg: 'backgroundWhite',
    border: '1px solid',
    borderColor: 'border',
    borderRadius: 4,
  },
  menuWrapper: {
    a: {
      textDecoration: 'none',
      color: 'text',
      py: 2,
      px: 1,
      width: '100%',
      '&.active': {
        background: 'green.a300',
        color: 'green.800',
      },
      ':hover': {
        background: 'green.100',
      },
    },
    px: 2,
    py: 0,
    color: 'text',
    ':hover': {
      color: 'gray.1000',
    },
    cursor: 'pointer',
    mb: 1,
  },
  menuLink: {
    cursor: 'pointer',
    mb: 0,
    p: 1,
    px: 2,
    borderRadius: 3,
    fontWeight: 500,
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
  menu: {
    height: 'auto',
    minWidth: '155px',
    width: 'fit-content',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: '50',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: '4px',
    backgroundColor: 'white',
    padding: '8px',
    color: 'hsl(204 10% 10%)',
    boxShadow: `2px 3px 14px 0px rgba(0, 0, 0, 0.16)`,
  },
  menuBlockWrapper: {
    minWidth: '20ch',
    bg: 'white',
    zIndex: 900,
    boxShadow: `2px 3px 14px 0px rgba(0, 0, 0, 0.16)`,
  },
  menuItem: {
    px: 3,
    py: 2,
    fontSize: 'sm',
    cursor: 'pointer',
    color: 'text',
    '&:hover': {
      color: 'green.600',
    },
  },
  menuItemHeading: {
    variant: 'layouts.menuItem',
    fontSize: 'xs',
    color: 'gray.400',
    p: 2,
    py: 2,
    bg: 'grey.100',
  },
  menuLinkActive: {
    bg: 'gray.200',
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
    borderColor: 'border',
  },
  plateBox: {
    border: 'solid 1px',
    borderColor: 'border',
    // bg: 'gray.100',
    // px: 3,
    py: 3,
  },
  button2: {
    mt: 3,
    borderRadius: 3,
    bg: 'red.300',
    color: 'text',
    display: 'block',
  },
  header: {
    borderBottom: 'solid 1px',
    borderColor: 'border',
    paddingBottom: 2,
    paddingTop: 2,
    paddingLeft: 2,
  },
  plateRightBar: {
    bg: 'text',
    border: 'solid 1px',
    borderColor: 'border',
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
    borderColor: 'border',
    pl: 4,
    pt: 3,
    pb: 3,
    ':hover': {
      bg: 'gray.100',
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
};

export default layout;
