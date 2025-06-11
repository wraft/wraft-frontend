import styled from "@xstyled/emotion";

export const Table: any = styled("table")`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid;
  border-color: border;
  background-color: background-primary;
  tr:hover td {
    background-color: gray.200;
  }
`;
export const Thead: any = styled("thead")``;
export const Tr: any = styled("tr")``;

export const Th: any = styled("th")`
  @media (max-width: 500px) {
    min-width: auto;
  }
`;
export const Tbody: any = styled("tbody")``;
export const Td: any = styled("td")`
  background-color: background-primary;
  @media (max-width: 500px) {
    min-width: auto;
  }
`;
