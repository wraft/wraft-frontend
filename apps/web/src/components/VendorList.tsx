import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';

import PageHeader from 'common/PageHeader';
import Link from 'common/NavLink';
import { fetchAPI } from 'utils/models';

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
    <Text as="h5" sx={{ fontWeight: 500, color: 'text' }}>
      {name}
    </Text>
    <Text as="h6" sx={{ fontSize: 'xs', fontWeight: 300, color: 'gray.500' }}>
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
  const [contents, setContents] = useState<Array<Vendor>>([]);
  const [_vendors, setVendors] = useState<Array<Vendor>>([]);
  const [_loading, setLoading] = useState<boolean>(true);

  const loadData = () => {
    fetchAPI('vendors')
      .then((data: any) => {
        const res: Vendor[] = data.vendors;
        setContents(res);
        setLoading(false);
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
              <Text sx={{ color: 'text' }}>{r.address}</Text>
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
      <PageHeader title="Vendors" desc="Manage your vendors">
        <Box sx={{ ml: 'auto', mr: 0, pt: 2 }}>
          <Link href="/vendor/new" variant="btnSecondary" locale={''}>
            + Add Vendor
          </Link>
        </Box>
      </PageHeader>
    </Box>
  );
};
export default VendorListBlock;
