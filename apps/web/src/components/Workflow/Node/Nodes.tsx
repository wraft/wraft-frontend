import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Text, Box, Flex, Button } from 'theme-ui';
import { HardDrives, X, Files } from '@phosphor-icons/react';

// const onCloseIconClick = (event: any, props: any) => {
//   event.stopPropagation();
//   const { data, id } = props;
//   data.onDeleteNodeCallback(id);
// };

export const Source = ({
  type,
  data,
  selected,
  disabled,
  onNodeClick,
  onCloseIconClick,
  additionalClassName,
}: any) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Flex
        data-selected={selected}
        aria-disabled={disabled}
        className={`NodeInnerWrapper ${additionalClassName}`}
        {...(onNodeClick && { onClick: () => onNodeClick(type, data) })}
        sx={{
          bg: 'white',
          width: '230px',
          px: 3,
          py: 3,
          borderRadius: '2px',
          border: '1px solid',
          justifyContent: 'space-between',
          // borderLeftStyle: 'solid',
          borderLeftWidth: '3px',
          borderColor: 'rgb(82, 196, 26)',
          boxShadow: '0 1px 3px 0 rgba(0, 20, 32, .12)',
        }}>
        <Flex>
          <HardDrives size={36} weight="thin" />
          <Box sx={{ px: 2 }}>
            <Box sx={{ fontSize: '10px' }}>Source</Box>
            <Box sx={{ fontSize: '12px' }}>{data.label}</Box>
          </Box>
        </Flex>
        <X onClick={onCloseIconClick} />
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
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} className="NodePort" />
      <Flex
        data-selected={selected}
        aria-disabled={disabled}
        className={`NodeInnerWrapper ${additionalClassName}`}
        {...(onNodeClick && { onClick: () => onNodeClick(type, data) })}
        sx={{
          bg: 'white',
          width: '230px',
          px: 3,
          py: 3,
          borderRadius: '2px',
          border: '1px solid',
          justifyContent: 'space-between',
          // borderLeftStyle: 'solid',
          borderLeftWidth: '3px',
          borderColor: 'rgb(24, 144, 255)',
          boxShadow: '0 1px 3px 0 rgba(0, 20, 32, .12)',
        }}>
        <Flex>
          <Files size={36} weight="thin" />
          <Box sx={{ px: 2 }}>
            <Box sx={{ fontSize: '10px' }}>Templete</Box>
            <Box sx={{ fontSize: '12px' }}>{data.label}</Box>
          </Box>
        </Flex>
        <X onClick={onCloseIconClick} />
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
