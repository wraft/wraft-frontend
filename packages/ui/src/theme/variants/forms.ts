const forms = {
  label: {
    fontFamily: "body",
    variant: "text.pR",
    color: "gray.900",
    mb: 2,
  },
  input: {
    borderColor: "border",
    p: "8px 16px",
    variant: "text.pM",
    bg: "gray.100",
    color: "gray.1100",
    ":disabled": {
      color: "gray.900",
      bg: "gray.100",
    },
  },
  select: {
    borderColor: "border",
    p: "8px 16px",
    variant: "text.pM",
    bg: "gray.100",
    ":disabled": {
      color: "gray.900",
      bg: "gray.100",
    },
  },
  textarea: {
    borderColor: "border",
    p: "8px 16px",
    variant: "text.pM",
    bg: "gray.100",
    resize: "none",
    ":disabled": {
      color: "gray.900",
      bg: "gray.100",
    },
  },
  checkbox: {
    MozAppearance: "none",
    WebkitAppearance: "none",
    OAppearance: "none",
    outline: "none",
    content: "none",
    color: "neutral.200",
    accentColor: "gray.900",
  },
  small: {
    p: 0,
    px: 3,
    fontFamily: "body",
    fontWeight: 500,
    borderColor: "border",
  },
};

export default forms;
