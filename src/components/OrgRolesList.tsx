import React, { useEffect, useState } from 'react';

import { Flex, Box, Text } from 'theme-ui';

import { fetchAPI } from '../utils/models';

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
  const [contents, setContents] = useState<any>();
  const [resources, setResources] = useState<ResourceGroupList>();

  /**
   * Load all Engines
   * @param token
   */
  const loadLayout = () => {
    // console.log(profile)
    // const org_id = profile?.organisation_id
    fetchAPI(`role_groups`).then((data: any) => {
      console.log('roles', data);
      setContents(data.role_groups);
    });
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadResources = () => {
    fetchAPI('role_groups').then((data: any) => {
      const res: ResourceGroupList = data;
      setResources(res);
    });
  };

  /** Trigger Load on Init */

  useEffect(() => {
    loadLayout();
    loadResources();
  }, []);

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
    <Box py={3} mt={4} sx={{ width: '100%' }}>
      <Box mx={0} mb={3}>
        <Text mb={5}>All Roles</Text>
        <Flex>
          {contents &&
            contents?.permissions?.length > 0 &&
            contents?.permissions?.map((r: any) => (
              <Box key={r?.id} sx={{ p: 1, bg: 'gray.300', mb: 1 }}>
                <Text sx={{ fontFamily: 'monospace' }}>{ky(r)}</Text>
              </Box>
            ))}
        </Flex>

        {contents?.length < 1 && (
          <Box sx={{ p: 4, border: 'solid 1px', borderColor: 'border' }}>
            <Text as="h5" sx={{ fontSize: 1, color: 'text' }}>
              No Roles?
            </Text>
            <Text as="p" sx={{ fontSize: 0, color: 'text' }}>
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
