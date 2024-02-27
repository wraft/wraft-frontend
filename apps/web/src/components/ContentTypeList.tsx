import React, { useState } from 'react';
import { Box, Button, Flex } from 'theme-ui';
import { Drawer } from '@wraft-ui/Drawer';

import ContentTypeDashboard from './ContentTypeDashboard';
import PageHeader from './PageHeader';
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
  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
      <PageHeader title="Variants" desc="Manage Variants">
        <Flex sx={{ flexGrow: 1, ml: 'auto', mr: 0, pt: 1, mt: 0 }}>
          <Button variant="buttonSecondary" onClick={() => setIsOpen(true)}>
            New Variant
          </Button>
        </Flex>
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
        <ContentTypeDashboard />
      </Box>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        <ContentTypeForm />
      </Drawer>
    </Box>
  );
};
export default ContentTypeList;
