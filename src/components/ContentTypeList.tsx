import React, { useEffect, useState } from 'react';
// import { useStoreState } from 'easy-peasy';
import { Box, Flex, Spinner } from 'theme-ui';
// import { Plus } from '@styled-icons/boxicons-regular';

import Link from './NavLink';
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

  // const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Box>
      <PageHeader title="Variants" desc="Manage Variants">
        <Flex sx={{ flexGrow: 1, ml: 'auto', mr: 0, pt: 2, mt: 1 }}>
          <Link href="/content-types/new" variant="btnSmall">
            New Variant
          </Link>
        </Flex>
      </PageHeader>
      <Flex>
        {loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
      </Flex>
      <Box
        variant="layout.pageFrame"
        sx={{ py: 1, pb: 4, borderBottom: 'solid 1px #ddd', mb: 3, mt: 3 }}
      >
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
