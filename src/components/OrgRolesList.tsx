import React, { useEffect, useState } from 'react';
import { Flex, Box, Text } from 'theme-ui';
import { useStoreState } from 'easy-peasy';
import { loadEntity } from '../utils/models';

export interface PermissionGroupList {
  total_pages: number;
  total_entries: number;
  permissions: any;
}

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

const OrgRolesList = () => {
  const token = useStoreState((state) => state.auth.token);
  // const profile = useStoreState((state) => state.profile?.profile);
  const [contents, setContents] = useState<any>();
  const [resources, setResources] = useState<ResourceGroupList>();

  /**
   * On Loading done
   * @param token
   */
  const loadDataSuccess = (data: any) => {
    console.log('roles', data);
    setContents(data.role_groups);
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadLayout = (token: string) => {
    // console.log(profile)
    // const org_id = profile?.organisation_id
    loadEntity(token, `role_groups`, loadDataSuccess);
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
    loadEntity(token, 'role_groups', loadResourceDataSuccess);
  };

  /** Trigger Load on Init */

  useEffect(() => {
    if (token) {
      loadLayout(token);
      loadResources(token);
    }
  }, [token]);

  /**
   *
   * @param r
   * @returns
   */
  const ky = (r: any) => {
    let pname = '';
    Object.keys(r).map(function (key, index) {
      // myObject[key] *= 2;
      console.log('keys', key, index);
      pname = key;
    });

    // return pname;
    if (pname) {
      console.log('pname', r[`${pname}`]);
    }
    return pname;
  };

  return (
    <Box py={3} mt={4}>
      <Box mx={0} mb={3}>
        <Text as="h3" mb={3}>
          All Roles
        </Text>
        <Flex>
          {contents &&
            contents?.permissions?.length > 0 &&
            contents?.permissions?.map((r: any) => (
              <Box key={r?.id} sx={{ p: 1, bg: 'gray.2', mb: 1 }}>
                <Text sx={{ fontFamily: 'monospace' }}>{ky(r)}</Text>
              </Box>
            ))}
        </Flex>

        {contents?.length < 1 && (
          <Box>
            <Text as="h5" sx={{ fontSize: 1, color: 'gray.8' }}>
              No Roles?
            </Text>
            <Text as="p" sx={{ fontSize: 0, color: 'gray.6' }}>
              Are you kidding?
            </Text>
          </Box>
        )}

        <Box>
          {resources &&
            resources?.resources?.length > 0 &&
            resources?.resources?.map((_n: any) => <Text key={_n?.id}>X</Text>)}
        </Box>
      </Box>
    </Box>
  );
};
export default OrgRolesList;
