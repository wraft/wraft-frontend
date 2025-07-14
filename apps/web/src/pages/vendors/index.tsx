import React, { useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { Button, Flex, Drawer, useDrawer } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

import VendorList from 'components/Vendor/VendorList';
import VendorDrawer from 'components/Vendor/VendorDrawer';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { VendorResponse } from 'schemas/vendor';
import { usePermission } from 'utils/permissions';

const VendorsPage: NextPage = () => {
  const { hasPermission } = usePermission();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<VendorResponse | null>(null);
  const [rerender, setRerender] = useState(false);
  const drawer = useDrawer();

  const handleVendorSuccess = () => {
    setRerender((prev) => !prev);
    setEditVendor(null);
  };

  const handleAddVendor = () => {
    setEditVendor(null);
    setIsDrawerOpen(true);
  };

  const handleEditVendor = (vendor: VendorResponse) => {
    setEditVendor(vendor);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Head>
        <title>Vendors | Wraft</title>
        <meta
          name="description"
          content="Manage vendor relationships and contacts"
        />
      </Head>
      <Page>
        <PageHeader
          title={[
            { name: 'Manage', path: '/manage' },
            { name: 'Vendors', path: '/manage/vendors' },
          ]}
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Vendors', path: '/manage/vendors' },
              ]}
            />
          }>
          <Flex gap="md">
            {hasPermission('template', 'show') && (
              <Button variant="secondary" onClick={handleAddVendor}>
                <Plus size={16} />
                Add Vendor
              </Button>
            )}
          </Flex>
        </PageHeader>
        <VendorList rerender={rerender} onVendorEdit={handleEditVendor} />
      </Page>

      <Drawer
        open={isDrawerOpen}
        store={drawer}
        aria-label="vendor drawer"
        withBackdrop={true}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditVendor(null);
        }}>
        {isDrawerOpen && (
          <VendorDrawer
            isOpen={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
            vendorId={editVendor?.id}
            isEdit={!!editVendor}
            onSuccess={handleVendorSuccess}
          />
        )}
      </Drawer>
    </>
  );
};

export default VendorsPage;
