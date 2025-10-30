import React from 'react';
import { Flex, Button } from '@wraft/ui';
import { TableIcon, BulletListIcon } from '@wraft/icon';

export type ViewType = 'table' | 'list';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  disabled?: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
  disabled = false,
}) => {
  return (
    <Flex gap="xs" align="center">
      <Button
        variant={currentView === 'table' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onViewChange('table')}
        disabled={disabled}
        title="Table view">
        <TableIcon width={16} height={16} />
      </Button>
      <Button
        variant={currentView === 'list' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onViewChange('list')}
        disabled={disabled}
        title="List view">
        <BulletListIcon width={16} height={16} />
      </Button>
    </Flex>
  );
};
