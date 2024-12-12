import styled, { x } from '@xstyled/emotion';
import { CaretCircleDown, CaretDown } from '@phosphor-icons/react';

import { Box } from 'common/Box';

import Block from './Block';

interface AccordionProps {
  header: React.ReactNode;
  children?: any;
}

const Frame = styled.divBox`
  background-color: gray.100;
  border: solid 1px;
  align-item: 'center';
  border-color: gray.400;
  border-width: 0;
  & summary {
    cursor: pointer;
    liststyle: none;
  }
`;

const Header = styled.divBox`
  padding: 0;
  border: solid 1px;
  border-color: gray.400;
`;

const Accordion = ({ header, children }: AccordionProps) => (
  <Frame as="details">
    <Header display="flex" as="summary" borderBottom={0}>
      {header}
      <Box mr={2} mt={2}>
        <CaretDown size={16} />
      </Box>
    </Header>
    <Box border="solid 1px" borderColor="gray.400" borderBottom={0}>
      {children}
    </Box>
  </Frame>
);

export default Accordion;
