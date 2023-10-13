import React from 'react';
// import { useStoreState } from 'easy-peasy';
import { Box, Flex } from 'theme-ui';

import NavLink from './NavLink';
// import { deleteEntity, fetchAPI } from '../utils/models';
// import LayoutCard from './Card';
import ContentTypeDashboard from './ContentTypeDashboard';
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
  // const token = useStoreState((state) => state.auth.token);

  /** DELETE content
   * @TODO move to inner page [design]
   */
  // const delData = (id: string) => {
  //   deleteEntity(`content_types/${id}`, token);
  // };

  // const loadData = () => {
  //   fetchAPI('content_types')
  //     .then((data: any) => {
  //       setLoading(true);
  //       const res: IField[] = data.content_types;
  //       setContents(res);
  //     })
  //     .catch(() => {
  //       setLoading(true);
  //     });
  // };

  // useEffect(() => {
  //   setLoading(false);
  // }, []);

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
      {/* <Flex sx={{ width: '100%', pt: 4 }}>
        <Grid columns={3}>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <LayoutCard key={m.id} {...m} onDelete={delData} />
            ))}
        </Grid>
      </Flex> */}
    </Box>
  );
};
export default ContentTypeList;
