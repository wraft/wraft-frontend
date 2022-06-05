import React from 'react';
import { usePositioner, useSuggest, UseSuggestReturn } from '@remirror/react';
import { AnimatePresence } from 'framer-motion';

import { Box } from 'theme-ui';
// import { Portal } from 'reakit/ts'

export const FloatingActionsMenu = ({ options }: any) => {
  // const { commands } = useRemirrorContext();

  const { change, ...rest } = useSuggest({
    char: '[',
    name: 'actions-dropdown',
    matchOffset: 0,
  });
  console.log({ change, ...rest });
  // const query = change?.query.full;

  return (
    <FloatingBubble change={change}>
      <Box>
        <Box
          sx={{
            border: 'solid 1px',
            borderColor: 'gray.1',
            borderRadius: '4px',
            boxShadow: '0px 0px 6px #44444463',
          }}>
          {options &&
            options.map((opt: any) => (
              <Box
                // onClick={() => doSelect(opt)}
                key={opt.label}
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: 1,
                  borderBottom: 'solid 1px',
                  borderTop: 'solid 1px',
                  borderColor: 'gray.1',
                  ':hover': { bg: 'gray.2' },
                }}>
                {opt.label}
              </Box>
            ))}
        </Box>
      </Box>
    </FloatingBubble>
  );
};

export const FloatingBubble: React.FC<{
  change?: UseSuggestReturn['change'];
}> = ({ children, change }) => {
  const { ref, rect, height, active } = usePositioner(
    change?.reason === 'start' ? 'cursor' : 'nearestWord',
    change !== undefined,
  );
  return (
    <AnimatePresence>
      {active && (
        <Box>
          <Box
            sx={{ position: 'fixed', bg: 'gray.0' }}
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // exit={{ opacity: 0 }}
            // transition={{ duration: 0.2 }}
            css={{ top: rect.top + height, left: rect.left }}
            ref={ref}>
            {children}
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};
