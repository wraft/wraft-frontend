import { Box, Flex, Text } from 'theme-ui';

import Block from './Block';

interface AccordionProps {
  title: string;
  children?: any;
  icon?: React.ReactNode;
  desc?: string;
}

const Accordion = ({ title, children, icon, desc }: AccordionProps) => (
  <Box
    as="details"
    sx={{
      '& summary': {
        cursor: 'pointer',
        // p: 2,
        bg: 'gray.100',
        border: 'solid 1px',
        borderColor: 'gray.400',
        borderBottom: 0,
        listStyle: 'none',
        '&::-webkit-details-marker': {
          display: 'none',
        },
        ':last-child': {
          borderBottom: 'solid 1px',
        },
      },
    }}>
    <Flex as="summary" sx={{ alignItem: 'center', gap: 2, border: 0 }}>
      <Block icon={icon} title={title} desc={desc} clean={true} />
    </Flex>
    <Box sx={{ p: 2, border: 'solid 1px', borderColor: 'gray.400' }}>
      {children}
    </Box>
  </Box>
);

export default Accordion;
