import styled from '@xstyled/emotion';
import { CaretDownIcon } from '@phosphor-icons/react';
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
    mb="md"
    border="1px solid"
    borderColor={error === true ? 'red.400' : 'background-primary'}
    bg={error === true ? 'red.100' : 'background-primary'}>
    <Header
      display="flex"
      as="summary"
      borderBottom={0}
      cursor="pointer"
      py="xs"
      px="sm">
      {header}
      <Box mr="md" mt="sm">
        <CaretDownIcon size={16} />
      </Box>
    </Header>
    <Box border="solid 1px" borderColor="border" borderBottom={0}>
      {children}
    </Box>
  </Box>
);

export default Accordion;
