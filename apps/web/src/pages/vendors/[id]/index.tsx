import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Button, Flex, Drawer, useDrawer, Spinner } from '@wraft/ui';
import { PencilSimpleIcon, ArrowLeftIcon } from '@phosphor-icons/react';

import { vendorService } from 'components/Vendor/vendorService';
import VendorDetail from 'components/Vendor/VendorDetail';
import VendorDrawer from 'components/Vendor/VendorDrawer';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { usePermission } from 'utils/permissions';

const VendorDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { hasPermission } = usePermission();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const drawer = useDrawer();

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadVendorData();
    }
  }, [id, rerender]);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      const vendorData = await vendorService.getVendor(id as string);
      setVendor(vendorData);
    } catch (error) {
      console.error('Error loading vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSuccess = () => {
    setRerender((prev) => !prev);
  };

  if (!id || typeof id !== 'string') {
    return <div>Invalid vendor ID</div>;
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size={32} />
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>
          {vendor ? `${vendor.name} | Wraft` : 'Vendor Details | Wraft'}
        </title>
        <meta
          name="description"
          content="View vendor details and manage contacts"
        />
      </Head>
      <Page>
        <PageHeader
          title={vendor ? vendor.name : 'Loading...'}
          desc="Vendor details and contact management"
          hasBack={true}>
          <Flex gap="md">
            {hasPermission('template', 'show') && (
              <Button
                variant="secondary"
                onClick={() => setIsEditDrawerOpen(true)}>
                <PencilSimpleIcon size={16} />
                Edit Vendor
              </Button>
            )}
          </Flex>
        </PageHeader>
        <VendorDetail vendorId={id} />
      </Page>

      <Drawer
        open={isEditDrawerOpen}
        store={drawer}
        aria-label="edit vendor drawer"
        withBackdrop={true}
        onClose={() => setIsEditDrawerOpen(false)}>
        {isEditDrawerOpen && (
          <VendorDrawer
            isOpen={isEditDrawerOpen}
            setIsOpen={setIsEditDrawerOpen}
            vendorId={id as string}
            isEdit={true}
            onSuccess={handleVendorSuccess}
          />
        )}
      </Drawer>
    </>
  );
};

export default VendorDetailPage;
