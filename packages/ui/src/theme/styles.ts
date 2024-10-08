const styles = {
  root: {
    fontFamily: 'body',
    lineHeight: 'body',
    fontWeight: 'body',
    fontSize: `base`,
  },
  body: {
    fontFamily: 'body',
  },
  h1: {
    color: 'text',
    fontFamily: 'heading',
    lineHeight: 'heading',
    fontWeight: 'heading',
    fontSize: '2xl',
  },
  h2: {
    color: 'text',
    fontFamily: 'heading',
    lineHeight: 'heading',
    fontWeight: 'heading',
    fontSize: 'xl',
  },
  h3: {
    color: 'text',
    fontFamily: 'heading',
    lineHeight: 'heading',
    fontWeight: 'heading',
    fontSize: 'base',
  },
  h4: {
    color: 'text',
    fontFamily: 'heading',
    lineHeight: 'heading',
    fontWeight: 'heading',
    fontSize: 'sm',
  },
  h5: {
    color: 'text',
    fontFamily: 'heading',
    lineHeight: 'heading',
    fontWeight: 'heading',
    fontSize: 'xs',
  },
  h6: {
    color: 'text',
    fontFamily: 'heading',
    lineHeight: 'heading',
    fontWeight: 'heading',
    fontSize: 'xxs',
  },
  p: {
    color: 'text',
    fontFamily: 'body',
    fontWeight: 'body',
    lineHeight: 'body',
  },
  h3Medium: {
    fontWeight: 'heading',
    lineHeight: '38.88px',
    fontSize: '29.3px',
    letterSpacing: '0.2px',
  },
  h3Bold: {
    fontWeight: 'bold',
    lineHeight: '38.88px',
    fontSize: '29.3px',
    letterSpacing: '0.2px',
  },
  h1Medium: {
    fontSize: '45.78px',
    fontWeight: 'heading',
    lineHeight: ' 59.24px',
  },
  h5Bold: {
    fontSize: '19px',
    fontWeight: 'bold',
    lineHeight: ' 22.8px',
  },
  h5Medium: {
    fontSize: '19px',
    fontWeight: 'heading',
    lineHeight: ' 22.8px',
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
  tableInput: {
    variant: 'text.pM',
    fontSize: 'xxs',
    color: 'gray.500',
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
    p: { color: 'gray.1000', fontFamily: 'body', pt: 2, pb: 1, fontSize: 0 },
    h1: {
      color: 'red.600',
      py: 3,
      fontFamily: 'body',
      textTransform: 'uppercase',
      lineHeight: 1.25,
      fontSize: 'xs',
    },
    h2: {
      color: 'red.400',
      py: 3,
      fontFamily: 'body',
      lineHeight: 1.25,
      fontSize: 'xs',
    },
    h3: {
      color: 'red.400',
      py: 3,
      fontFamily: 'body',
      textTransform: 'uppercase',
      lineHeight: 1.25,
      fontSize: 'xs',
    },
    h4: {
      color: 'red.400',
      py: 3,
      fontFamily: 'body',
      lineHeight: 1.25,
      fontSize: 'xs',
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
      borderColor: 'border',
      lineHeight: 1.65,
      bg: 'neutral.100',
      h1: { color: 'text', fontFamily: 'editor2', pt: 2, pb: 1 },
      h2: { color: 'text', fontFamily: 'editor2', pt: 2, pb: 1 },
      h3: { color: 'text', fontFamily: 'editor2', pt: 2, pb: 1 },
      '.holder': {
        bg: '#9df5e366',
        color: 'text',
      },
      '.no-holder': {
        bg: '#f3781261',
        color: '#5f3614e6',
      },
    },
    p: { color: 'text', fontFamily: 'editor2', pt: 2, pb: 1 },
    h1: {
      color: 'red.600',
      py: 3,
      fontFamily: 'editor2',
      lineHeight: 1.25,
      fontSize: 'xs',
    },
    h2: {
      color: 'red.400',
      py: 3,
      fontFamily: 'editor2',
      lineHeight: 1.25,
      fontSize: 'xs',
    },
    h3: {
      color: 'red.400',
      py: 2,
      fontFamily: 'editor2',
      lineHeight: 1.25,
      fontSize: 'xs',
    },
    h4: {
      color: 'red.400',
      py: 3,
      fontFamily: 'editor2',
      lineHeight: 1.25,
      fontSize: 'xs',
    },
  },
  btnMenuBlock: {
    a: {
      textDecoration: 'none',
      borderRadius: 4,
      color: 'text',
      py: 2,
      px: 1,
      width: '100%',
      '&.active': {
        background: 'green.a300',
        // background: '#E2F7EA',
        color: 'green.1000',
        svg: {
          fill: 'green.300',
        },
      },
      ':hover': {
        background: 'green.a300',
      },
    },
  },
  scrollbarY: {
    overflowY: 'scroll',
    '::-webkit-scrollbar': {
      width: '8px',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: '#B8B3B1',
      borderRadius: '10px',
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
  scrollbarX: {
    overflowX: 'scroll',
    '::-webkit-scrollbar': {
      height: '8px',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: '#B8B3B1',
      borderRadius: '10px',
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
};

export default styles;
