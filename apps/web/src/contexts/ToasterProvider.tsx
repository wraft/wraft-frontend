import React from 'react';
import { Toaster } from 'react-hot-toast';
import { x } from '@xstyled/emotion';

const ToasterProvider = () => {
  return (
    <x.div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            backgroundColor: 'colors.neutral800',
            color: 'gray.900',
            padding: '4',
            borderRadius: 'md',
            boxShadow: 'lg',
          },
        }}
      />
    </x.div>
  );
};

export default ToasterProvider;
