import { Signature } from '@phosphor-icons/react';
import { Box, Button, Flex, Text } from '@wraft/ui';

import { IconFrame } from 'common/Atoms';

import { CardBlockWrapper } from './CardBlock';

/**
 * Interface for the properties of the TaskItem component
 */
interface TaskItemProps {
  /** Title of the task */
  title?: string;
  /** Name of the person who assigned the task */
  assignedBy?: string;
  /** Callback function when the sign button is clicked */
  onSignClick?: () => void;
  /** Icon to display for the task */
  icon?: React.ReactNode;
  /** Button text */
  buttonText?: string;
  /** Tag to display for the task */
  tag?: string;
  /** Color of the tag */
  color?: string;
}

/**
 * TaskItem component displays a task that needs to be signed
 */
export const TaskItem: React.FC<TaskItemProps> = ({
  title = 'Sign Document',
  assignedBy,
  onSignClick = () => {},
  icon = <Signature size={20} weight="thin" />,
  buttonText,
  tag,
}) => {
  return (
    <CardBlockWrapper
      flex="100%"
      p="md"
      bg="green.100"
      borderBottom="solid 1px"
      borderColor="gray.400"
      alignItems="flex-start"
      gap="md">
      <Box>
        <Box
          as="img"
          width={20}
          height={20}
          borderRadius="3em"
          src={`https://mighty.tools/mockmind-api/content/human/125.jpg`}
        />
        {/* <IconFrame color="green.1100">{icon}</IconFrame> */}
      </Box>
      <Flex flex="100%" direction="column">
        <Text as="p" fontSize="base" fontWeight="medium" color="green.1200">
          {title}
        </Text>
        {assignedBy && (
          <Text
            display="flex"
            fontSize="sm2"
            as="span"
            fontWeight="body"
            color="gray.1000"
            // mt="xs"
            gap="sm">
            {assignedBy}
          </Text>
        )}
      </Flex>
      <Box ml="auto">
        {tag && (
          <Text
            fontSize="11px"
            lineHeight="1rem"
            textTransform="uppercase"
            bg="teal.200"
            color="teal.1200"
            fontWeight="600"
            px="6px"
            borderRadius="4px"
            letterSpacing="0.23px">
            {tag}
          </Text>
        )}
        {buttonText && (
          <Button
            // borderColor="green.700"
            variant="secondary"
            size="sm"
            bg="white"
            fontSize="sm2"
            color="green.1200"
            onClick={onSignClick}>
            {buttonText}
          </Button>
        )}
      </Box>
    </CardBlockWrapper>
  );
};
