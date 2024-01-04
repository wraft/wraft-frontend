import React, { useEffect, useState } from 'react';

import { Box, Flex, Text } from 'theme-ui';

import { fetchAPI } from '../utils/models';
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
  const loadLayout = () => {
    fetchAPI('permissions').then((data: any) => {
      loadDataSuccess(data);
    });
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadResources = () => {
    fetchAPI('resources').then((data: any) => {
      const res: ResourceGroupList = data;
      setResources(res);
    });
  };

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

  /** Trigger Load on Init */

  useEffect(() => {
    loadLayout();
    loadResources();
  }, []);

  const permLevels = [
    {
      name: 'All',
    },
    {
      name: 'Show',
    },
    {
      name: 'Create',
    },
    {
      name: 'Update',
    },
    {
      name: 'Delete',
    },
  ];

  return (
    <Box py={3} mt={4}>
      <Box mx={0} mb={3}>
        {resources && <h1>REsources is tehre</h1>}
        <Text variant="pagetitle">All Permissions x</Text>
        <Box>
          {permLevels.map((pm: any) => (
            <Flex key={pm.name}>
              <Text sx={{ textTransform: 'uppercase' }}>{pm.name}</Text>
            </Flex>
          ))}

          <Flex>
            {contents &&
              contents?.permissions?.length > 0 &&
              contents?.permissions?.map((r: any) => (
                <Box key={r} sx={{ p: 1, bg: 'gray.2', mb: 1 }}>
                  <Text sx={{ fontFamily: 'monospace' }}>{ky(r)}</Text>
                </Box>
              ))}
          </Flex>
        </Box>

        {/* <Text variant="pagetitle">All Resources</Text>
        <Box>
          {resources &&
            resources?.resources?.length > 0 &&
            resources?.resources?.map((r: any) =>
              <Box sx={{ p: 1, bg: 'gray.2', mb: 1 }}>
                <Text sx={{ fontFamily: 'monospace' }}>{ky(r)}</Text>
              </Box>
            )}
        </Box> */}
      </Box>
    </Box>
  );
};
export default OrgPermissionList;
