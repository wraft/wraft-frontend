import { Handle, Position } from '@xyflow/react';
import { Box, Flex, Text } from '@wraft/ui';
import { HardDrivesIcon, XIcon, FilesIcon } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';

export const Source = ({
  type,
  data,
  selected,
  disabled,
  onNodeClick,
  onCloseIconClick,
  additionalClassName,
}: any) => {
  return (
    <>
      <Flex
        data-selected={selected}
        aria-disabled={disabled}
        className={`NodeInnerWrapper ${additionalClassName}`}
        {...(onNodeClick && { onClick: () => onNodeClick(type, data) })}
        bg="white"
        w="230px"
        px="md"
        py="md"
        borderRadius="2px"
        border="1px solid"
        borderLeftWidth="3px"
        borderColor="rgb(82, 196, 26)"
        boxShadow="0 1px 3px 0 rgba(0, 20, 32, .12)"
        justifyContent="space-between">
        <Flex>
          <IconFrame color="icon">
            <HardDrivesIcon size={36} weight="thin" />
          </IconFrame>
          <Box px="sm">
            <Text>Source</Text>
            <Text fontSize="xs">{data.label}</Text>
          </Box>
        </Flex>
        <XIcon onClick={onCloseIconClick} />
      </Flex>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export const Templete = ({
  type,
  data,
  selected,
  disabled,
  onNodeClick,
  onCloseIconClick,
  additionalClassName,
  isConnectable,
}: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="NodePort" />
      <Flex
        data-selected={selected}
        aria-disabled={disabled}
        className={`NodeInnerWrapper ${additionalClassName}`}
        {...(onNodeClick && { onClick: () => onNodeClick(type, data) })}
        as="div"
        bg="white"
        w="230px"
        px="md"
        py="md"
        borderRadius="2px"
        border="1px solid"
        borderLeftWidth="3px"
        borderColor="rgb(24, 144, 255)"
        boxShadow="0 1px 3px 0 rgba(0, 20, 32, .12)">
        <Flex>
          <IconFrame color="icon">
            <FilesIcon size={36} weight="thin" />
          </IconFrame>
          <Box px="sm">
            <Text>Templete</Text>
            <Text fontSize="xs">{data.label}</Text>
          </Box>
        </Flex>
        <IconFrame color="icon">
          <XIcon onClick={onCloseIconClick} />
        </IconFrame>
      </Flex>
      <Handle
        type="source"
        position={Position.Bottom}
        className="NodePort"
        isConnectable={isConnectable}>
        {/* <Box
          sx={{
            position: 'absolute',
            right: '10px',
            width: '30px',
            fontSize: '6px',
            pointerEvents: 'none',
          }}>
          target
        </Box> */}
        {/* <Box>Plus</Box> */}
      </Handle>
    </>
  );
};
