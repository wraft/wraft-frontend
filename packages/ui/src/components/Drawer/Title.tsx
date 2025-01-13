import { x } from "@xstyled/emotion";

import * as S from "./styles";

export const Title: React.FC<any> = ({ children, zIndex = "1", ...props }) => {
  return (
    <S.Title
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      position={{ xs: "sticky", md: "static" }}
      top={{ xs: 0, md: "auto" }}
      zIndex={zIndex}
      {...props}
    >
      <x.h3>{children}</x.h3>
    </S.Title>
  );
};

export const Header: React.FC<any> = ({ children, zIndex = "1", ...props }) => {
  return (
    <S.Header
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      position={{ xs: "sticky", md: "static" }}
      px="xl"
      top={{ xs: 0, md: "auto" }}
      zIndex={zIndex}
      {...props}
    >
      {children}
    </S.Header>
  );
};
