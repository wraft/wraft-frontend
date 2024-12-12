import styled, { x } from '@xstyled/emotion';
import { CaretCircleDown, CaretDown } from '@phosphor-icons/react';

import Block from './Block';

interface AccordionProps {
  title: string;
  children?: any;
  icon?: React.ReactNode;
  desc?: string;
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

const Accordion = ({ title, children, icon, desc }: AccordionProps) => (
  <Frame as="details">
    <Header display="flex" as="summary" borderBottom={0}>
      <Block icon={icon} title={title} desc={desc} clean={true} />
      <x.div mr={2} mt={2}>
        <CaretDown size={16} />
      </x.div>
    </Header>
    <x.div border="solid 1px" borderColor="gray.400" borderBottom={0}>
      {children}
    </x.div>
  </Frame>
);

export default Accordion;
