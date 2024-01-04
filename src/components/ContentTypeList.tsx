import React from 'react';

import { Box, Flex } from 'theme-ui';

import ContentTypeDashboard from './ContentTypeDashboard';
import NavLink from './NavLink';
import PageHeader from './PageHeader';

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

const ContentTypeList = ({ isEdit }: ContentTypeList) => {
  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.0' }}>
      <PageHeader title="Variants" desc="Manage Variants">
        <Flex sx={{ flexGrow: 1, ml: 'auto', mr: 0, pt: 1, mt: 0 }}>
          <NavLink href="/content-types/new" variant="btnSecondary" locale={''}>
            New Variant
          </NavLink>
        </Flex>
      </PageHeader>
      <Box
        variant="layout.pageFrame"
        sx={{
          py: 1,
          pb: 4,
          borderBottom: 'solid 1px',
          borderColor: 'neutral.0',
          mb: 3,
          mt: 3,
        }}>
        <ContentTypeDashboard isEdit={isEdit} />
      </Box>
    </Box>
  );
};
export default ContentTypeList;
