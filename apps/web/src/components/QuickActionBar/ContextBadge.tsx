import React from 'react';
import { Tag } from '@wraft/ui';
import { motion } from 'framer-motion';
import { useTheme } from '@emotion/react';

interface ContextOption {
  id: string;
  name: string;
  type: 'module' | 'variant';
  prefix?: string;
  color?: string;
}

interface ContextBadgeProps {
  context: ContextOption;
  onRemove: () => void;
}

export const ContextBadge = ({ context, onRemove }: ContextBadgeProps) => {
  const theme = useTheme() as any;
  const isDark = theme.colors?.mode === 'dark';

  const bgColor = context.color || (isDark ? '#1e3a5f' : '#e0f2fe');
  const textColor = context.color ? '#fff' : isDark ? '#93c5fd' : '#0284c7';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: -10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -10 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}>
      <Tag
        variant="info"
        size="sm"
        onRemove={onRemove}
        style={{
          background: bgColor,
          color: textColor,
          fontWeight: 600,
          margin: 0,
        }}>
        {context.prefix || context.name}
      </Tag>
    </motion.div>
  );
};
