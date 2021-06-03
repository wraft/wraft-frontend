import React, { useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';
import { useStoreState } from 'easy-peasy';
import { loadEntity } from '../utils/models';
import { Member } from './OrgMemberForm';

export interface PermissionGroupList {
  total_pages: number;
  total_entries: number;
  permissions: { [key: string]: PermissionElement[] }[];
}

export interface PermissionElement {
  id: string;
  name: string;
  permission: PermissionPermission;
}

export interface PermissionPermission {
  id: string;
  resource_id: string;
}

// interface Permission {
//   id?: string;
//   category?: string;
//   action?: string;
// }

interface ResourceItem {
  id?: string;
  category?: string;
  action?: string;
}

export interface ResourceGroupList {
  total_pages: number;
  total_entries: number;
  resources: ResourceItem[];
}

const OrgPermissionList = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<PermissionGroupList>();
  const [resources, setResources] = useState<ResourceGroupList>();

  /**
   * On Loading done
   * @param token
   */
  const loadDataSuccess = (data: any) => {
    const res: PermissionGroupList = data;
    setContents(res);
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadLayout = (token: string) => {
    loadEntity(token, 'permissions', loadDataSuccess);
  };

  /**
   * On Loading done
   * @param token
   */
  const loadResourceDataSuccess = (data: any) => {
    const res: ResourceGroupList = data;
    setResources(res);
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadResources = (token: string) => {
    loadEntity(token, 'resources', loadResourceDataSuccess);
  };

  /** Trigger Load on Init */

  useEffect(() => {
    if (token) {
      loadLayout(token);
      loadResources(token);
    }
  }, [token]);

  return (
    <Box py={3} mt={4}>
      <Box mx={0} mb={3}>
        <Text variant="pagetitle">All Permissions</Text>
        <Box>
          {contents &&
            contents?.permissions?.length > 0 &&
            contents?.permissions?.map((v: any, k: any) => (
              <Text key={k}>{}x</Text>
            ))}
        </Box>

        <Text variant="pagetitle">All Resources</Text>
        {/* <Box>
          {resources &&
            resources?.resources?.length > 0 &&
            resources?.resources?.map((_n: any) => <Text>X {_n[0]}</Text>)}
        </Box> */}
      </Box>
    </Box>
  );
};
export default OrgPermissionList;
