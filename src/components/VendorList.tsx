import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Container } from 'theme-ui';
// import Link from './NavLink';
import { Table } from './Table';
// import { Plus } from './Icons';
import { fetchAPI } from '../utils/models';
// import { useStoreState } from 'easy-peasy';
import { Button } from 'theme-ui';

// import { useToasts } from 'react-toast-notifications';
import PageHeader from './PageHeader';

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
      let row: any = [];
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
      <PageHeader title="Vendors">
        <Box sx={{ ml: 'auto', mr: 5 }}>
          {/* <Button variant="btnSecondary" mr={2}>Secondary</Button> */}
          <Button variant="btnPrimary">+ New Vendor</Button>
        </Box>
      </PageHeader>
      <Container sx={{ pl: 5, pr: 5, pt: 4 }}>
        <Box mx={0} mb={3}>
          <Box sx={{ maxWidth: '70ch' }}>
            {vendors && (
              <Table
                options={{
                  columns: [
                    {
                      Header: 'Name',
                      accessor: 'col2',
                      width: '65%',
                    },
                    {
                      Header: 'Contact',
                      accessor: 'col3',
                      width: '30%',
                    },
                  ],
                  data: vendors,
                }}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default VendorListBlock;
