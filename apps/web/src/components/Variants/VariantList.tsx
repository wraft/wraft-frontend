import React, { useState } from 'react';
import { Drawer, useDrawer, Button } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

import PageHeader from 'common/PageHeader';
import { usePermission } from 'utils/permissions';

import VariantForm from './VariantForm';
import VariantDashboard from './VariantDashboard';

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const VariantList = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const mobileMenuDrawer = useDrawer();
  const { hasPermission } = usePermission();

  return (
    <>
      <PageHeader title="Variants" desc="Manage Variants">
        {hasPermission('variant', 'manage') && (
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
            <Plus size={12} weight="regular" />
            Create Variant
          </Button>
        )}
      </PageHeader>

      <VariantDashboard rerender={rerender} setRerender={setRerender} />

      <Drawer
        open={isOpen}
        store={mobileMenuDrawer}
        aria-label="Menu backdrop"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        {isOpen && (
          <>
            <VariantForm setIsOpen={setIsOpen} setRerender={setRerender} />
          </>
        )}
      </Drawer>
    </>
  );
};
export default VariantList;
