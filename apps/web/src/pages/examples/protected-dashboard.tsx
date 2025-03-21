import React from 'react';
import Head from 'next/head';
import { Box, Flex, Text, Button } from '@wraft/ui';

import { usePermission, PermissionCheck } from 'utils/permissions';
import { authorizeAnyRoute } from 'middleware/authorize';
import { AnyPermissionGate, AllPermissionsGate } from 'middleware/authorize';

// Dashboard that requires multiple permissions
const ProtectedDashboard = () => {
  const { hasPermission, hasAnyPermission } = usePermission();

  // Define some common operations that require specific permissions
  const _canManageUsers = hasPermission('membership', 'manage');
  const _canManageTemplates = hasPermission('template_asset', 'manage');

  // Check for multiple permission combinations
  const adminPermissions: PermissionCheck[] = [
    { router: 'organisation', action: 'update' },
    { router: 'role', action: 'manage' },
  ];

  const _hasAdminCapabilities = hasAnyPermission(adminPermissions);

  return (
    <>
      <Head>
        <title>Protected Dashboard | Wraft</title>
        <meta
          name="description"
          content="Example of a protected dashboard with multiple permission checks"
        />
      </Head>

      <Box p={4}>
        <Box px={4} py={3}>
          <Text as="h1" mb={3}>
            Protected Dashboard
          </Text>
          <Text mb={4}>
            This dashboard is protected with multiple permission checks.
            Different sections are displayed based on your specific permissions.
          </Text>

          {/* Dashboard Stats Section - Always visible */}
          <Box mb={5} p={4} backgroundColor="highlight" borderRadius="4px">
            <Text as="h2" mb={3}>
              Dashboard Overview
            </Text>
            <Flex flexDirection={['column', 'row']} mb={3}>
              <Box
                flex={1}
                p={3}
                backgroundColor="background"
                mr={[0, 3]}
                mb={[3, 0]}
                borderRadius="4px">
                <Text fontSize="24px" fontWeight="bold">
                  12
                </Text>
                <Text>Active Documents</Text>
              </Box>
              <Box
                flex={1}
                p={3}
                backgroundColor="background"
                mr={[0, 3]}
                mb={[3, 0]}
                borderRadius="4px">
                <Text fontSize="24px" fontWeight="bold">
                  5
                </Text>
                <Text>Pending Approvals</Text>
              </Box>
              <Box
                flex={1}
                p={3}
                backgroundColor="background"
                borderRadius="4px">
                <Text fontSize="24px" fontWeight="bold">
                  3
                </Text>
                <Text>Recent Comments</Text>
              </Box>
            </Flex>
          </Box>

          {/* User Management Section - Only visible with membership:manage permission */}
          <AnyPermissionGate
            permissions={[{ router: 'membership', action: 'manage' }]}
            fallback={
              <Box mb={5} p={4} backgroundColor="muted" borderRadius="4px">
                <Text color="text-muted">
                  You dont have permission to manage users
                </Text>
              </Box>
            }>
            <Box
              mb={5}
              p={4}
              backgroundColor="primary"
              color="white"
              borderRadius="4px">
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text as="h2">User Management</Text>
                <Button variant="secondary">Add User</Button>
              </Flex>
              <Text mb={3}>
                You have permission to manage users in the system.
              </Text>
              <Flex flexDirection="column">
                <Box
                  p={2}
                  backgroundColor="rgba(255,255,255,0.1)"
                  mb={2}
                  borderRadius="4px">
                  <Text>Jane Smith - Admin</Text>
                </Box>
                <Box
                  p={2}
                  backgroundColor="rgba(255,255,255,0.1)"
                  mb={2}
                  borderRadius="4px">
                  <Text>John Doe - Editor</Text>
                </Box>
                <Box
                  p={2}
                  backgroundColor="rgba(255,255,255,0.1)"
                  borderRadius="4px">
                  <Text>Mark Johnson - Viewer</Text>
                </Box>
              </Flex>
            </Box>
          </AnyPermissionGate>

          {/* Admin Section - Only visible with organisation:update OR role:manage */}
          <AnyPermissionGate
            permissions={adminPermissions}
            fallback={
              <Box mb={5} p={4} backgroundColor="muted" borderRadius="4px">
                <Text color="text-muted">You dont have admin privileges</Text>
              </Box>
            }>
            <Box
              mb={5}
              p={4}
              backgroundColor="secondary"
              color="white"
              borderRadius="4px">
              <Text as="h2" mb={3}>
                Admin Controls
              </Text>
              <Text mb={3}>
                You have admin privileges that allow you to manage the
                organization settings.
              </Text>
              <Flex>
                <Box mr={2}>
                  <Button variant="secondary">Organisation Settings</Button>
                </Box>
                <Button variant="secondary">Manage Roles</Button>
              </Flex>
            </Box>
          </AnyPermissionGate>

          {/* Templates Section - Only visible with template_asset:manage permission */}
          <AllPermissionsGate
            permissions={[{ router: 'template_asset', action: 'manage' }]}>
            <Box mb={5} p={4} backgroundColor="highlight" borderRadius="4px">
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text as="h2">Templates</Text>
                <Button variant="primary">Create Template</Button>
              </Flex>
              <Text mb={3}>
                You have permission to manage document templates.
              </Text>
              <Flex flexDirection="column">
                <Box
                  p={2}
                  backgroundColor="background"
                  mb={2}
                  borderRadius="4px">
                  <Text>Invoice Template</Text>
                </Box>
                <Box
                  p={2}
                  backgroundColor="background"
                  mb={2}
                  borderRadius="4px">
                  <Text>Contract Template</Text>
                </Box>
                <Box p={2} backgroundColor="background" borderRadius="4px">
                  <Text>Report Template</Text>
                </Box>
              </Flex>
            </Box>
          </AllPermissionsGate>
        </Box>
      </Box>
    </>
  );
};

// This page requires you to have ANY of these permissions to access
const requiredPermissions: PermissionCheck[] = [
  { router: 'dashboard', action: 'show' },
  { router: 'role', action: 'show' },
  { router: 'membership', action: 'show' },
];

export default authorizeAnyRoute(ProtectedDashboard, requiredPermissions);
