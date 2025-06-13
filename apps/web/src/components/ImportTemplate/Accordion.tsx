import styled from '@xstyled/emotion';
import { CaretDown } from '@phosphor-icons/react';
import { Box } from '@wraft/ui';

interface AccordionProps {
  header: React.ReactNode;
  children?: any;
  error?: boolean;
}

const Header = styled.divBox`
  padding: 0;
  border: solid 1px;
  border-color: gray.400;
`;

const Accordion = ({ header, children, error = false }: AccordionProps) => (
  <Box
    as="details"
    alignItems="center"
    bg={error === true ? 'red.100' : 'gray.100'}>
    <Header display="flex" as="summary" borderBottom={0} cursor="pointer">
      {header}
      <Box mr="md" mt="sm">
        <CaretDown size={16} />
      </Box>
    </Header>
    <Box border="solid 1px" borderColor="border" borderBottom={0}>
      {children}
    </Box>
  </Box>
);

export default Accordion;
