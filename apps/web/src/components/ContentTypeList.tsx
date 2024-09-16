import React, { useState } from 'react';
import { Box } from 'theme-ui';
import { Drawer, useDrawer, Button } from '@wraft/ui';
import { Plus, X } from '@phosphor-icons/react';

import PageHeader from 'common/PageHeader';

import ContentTypeDashboard from './ContentTypeDashboard';
import ContentTypeForm from './ContentTypeForm';

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

interface ContentTypeList {
  isEdit?: boolean;
}

const ContentTypeList = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const mobileMenuDrawer = useDrawer();

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
      <PageHeader title="Variants" desc="Manage Variants">
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          <Plus size={12} weight="bold" />
          Create Variant
        </Button>
      </PageHeader>
      <Box
        variant="layout.pageFrame"
        sx={{
          py: 1,
          pb: 4,
          borderBottom: 'solid 1px',
          borderColor: 'border',
          mb: 3,
          mt: 3,
        }}>
        <ContentTypeDashboard rerender={rerender} setRerender={setRerender} />
      </Box>
      <Drawer
        open={isOpen}
        store={mobileMenuDrawer}
        aria-label="Menu backdrop"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        {isOpen && (
          <>
            <Drawer.Header>
              <Drawer.Title>Create Variant</Drawer.Title>
              <X
                size={20}
                weight="bold"
                cursor="pointer"
                onClick={() => setIsOpen(false)}
              />
            </Drawer.Header>
            <ContentTypeForm setIsOpen={setIsOpen} setRerender={setRerender} />
          </>
        )}
      </Drawer>
    </Box>
  );
};
export default ContentTypeList;
