import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Container } from 'theme-ui';
import { fetchAPI } from '../utils/models';

// import { useToasts } from 'react-toast-notifications';
import PageHeader from './PageHeader';
import ManageSidebar from './ManageSidebar';

import { Collection, LayoutAlt, Style, FlowBranch, UserAlt } from './Icons';

// const ICON_COLOR = '#999';
interface menuLinksProps {
  name: string;
  path: string;
  logo: any;
}

const menuLinks: menuLinksProps[] = [
  {
    name: 'Role Groups',
    logo: <LayoutAlt width={20} height={20} />,
    path: '/super/roles',
  },
  {
    name: 'Resources',
    logo: <FlowBranch width={20} height={20} />,
    path: '/super/resources',
  },

  {
    name: 'Oranganization Fields',
    logo: <Style width={20} height={20} />,
    path: '/super/fields',
  },
  {
    name: 'Permissions',
    logo: <UserAlt width={20} height={20} />,
    path: '/super/roles',
  },
  {
    name: 'Fields',
    logo: <UserAlt width={20} height={20} />,
    path: '/super/fields',
  },
  {
    name: 'Pipelines',
    logo: <Collection width={20} height={20} />,
    path: '/super/pipelines',
  },
];

export interface VendorTypes {
  vendors: Vendor[];
  total_pages: number;
  total_entries: number;
  page_number: number;
}
interface PersonCardProps {
  name?: string;
  phone?: string;
}

const PersonCard = ({ name, phone }: PersonCardProps) => (
  <Box>
    <Text as="h5" sx={{ fontWeight: 500, color: 'gray.8' }}>
      {name}
    </Text>
    <Text as="h6" sx={{ fontSize: 0, fontWeight: 300, color: 'gray.5' }}>
      {phone}
    </Text>
  </Box>
);

export interface Vendor {
  updated_at: Date;
  reg_no: string;
  phone: string;
  name: string;
  inserted_at: Date;
  gstin: string;
  email: string;
  contact_person: string;
  address: string;
}

const VendorListBlock: FC = () => {
  // const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<Vendor>>([]);
  const [vendors, setVendors] = useState<Array<Vendor>>([]);
  // const { addToast } = useToasts();

  const loadData = () => {
    fetchAPI('vendors')
      .then((data: any) => {
        const res: Vendor[] = data.vendors;
        setContents(res);
      })
      .catch();
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col2: (
            <Box>
              <Text as="h4">{r.name}</Text>
              <Text sx={{ color: 'gray.6' }}>{r.address}</Text>
            </Box>
          ),
          col3: <PersonCard name={r.contact_person} phone={r.phone} />,
        };

        row.push(rFormated);
      });

      setVendors(row);
    }
  }, [contents]);

  return (
    <Box>
      <PageHeader title="Super Admin" desc="Manage your organization">
        <Box sx={{ ml: 'auto', mr: 5 }}>
          {/* <Button variant="btnPrimaryBig">+ New Vendor</Button> */}
        </Box>
      </PageHeader>
      <Container sx={{ pl: 5, pr: 5, pt: 4 }}>
        {vendors && <h1>Has vendors</h1>}
        <Box mx={0} mb={3}>
          <Box sx={{ maxWidth: '70ch' }}>
            <ManageSidebar items={menuLinks} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default VendorListBlock;
