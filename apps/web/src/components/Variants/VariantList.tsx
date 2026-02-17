import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';
import { usePermission } from 'utils/permissions';

import VariantDashboard from './VariantDashboard';

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

const VariantList = () => {
  const [rerender, setRerender] = useState<boolean>(false);
  const { hasPermission } = usePermission();
  const router = useRouter();

  return (
    <>
      <PageHeader title="Variants" desc="Manage Variants">
        {hasPermission('variant', 'manage') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/variants/new')}
          >
            <Plus size={12} weight="regular" />
            Add Variant
          </Button>
        )}
      </PageHeader>

      <PageInner>
        <VariantDashboard rerender={rerender} setRerender={setRerender} />
      </PageInner>
    </>
  );
};
export default VariantList;
