import React, { useState } from 'react';
import { Drawer, useDrawer, Button, Box } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

import PageHeader from 'common/PageHeader';

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

  return (
    <Box pl={0} minHeight="100%" bg="neutral.100">
      <PageHeader title="Variants" desc="Manage Variants">
        <Button variant="tertiary" onClick={() => setIsOpen(true)}>
          <Plus size={12} weight="bold" />
          Create Variant
        </Button>
      </PageHeader>
      <Box
        py={1}
        pb={4}
        borderBottom="solid 1px"
        borderColor="border"
        mb={3}
        mt={3}>
        <VariantDashboard rerender={rerender} setRerender={setRerender} />
      </Box>
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
    </Box>
  );
};
export default VariantList;
