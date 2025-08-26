import { backgroundColor } from "@xstyled/emotion";

const boxVariant = {
  card: {
    padding: "xxl",
    border: "1px solid",
    borderColor: "border",
    borderRadius: "lg",
    backgroundColor: "background-primary",
  },
  block: {
    padding: "md",
    border: "1px solid",
    borderColor: "border",
    // borderRadius: "md2",
    backgroundColor: "background-primary",
  },
  boxone: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  boxtwo: {
    backgroundColor: "red.100",
    textAlign: "center",
  },
  menuWrapper: {
    a: {
      textDecoration: "none",
      color: "text-primary",
      width: "100%",
      padding: "sm md",
      "&.active": {
        backgroundColor: "green.a300",
        color: "green.800",
        borderRadius: "md",
      },
      ":hover": {
        backgroundColor: "green.200",
      },
    },

    color: "text-primary",
    ":hover": {
      color: "gray.1000",
    },
    cursor: "pointer",
    marginBottom: "xs",
  },
};

export default boxVariant;
