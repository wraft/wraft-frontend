import { ReactElement } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from 'contexts/AuthContext';
import { usePermission, PermissionCheck } from 'utils/permissions';

// Original authorize function for backward compatibility
// Example:
// const ProtectedPage = authorize(DashboardPage, 'admin:view');
// or
// const ProtectedPage = authorize(DashboardPage, 'admin');
export function authorize(Component: any, permissionName: any) {
  return function WithRolesWrapper(props: any) {
    const router = useRouter();
    const { permissions } = useAuth();

    // For backward compatibility, we need to check if the permission exists
    // in the new format, permissions will be an object of arrays
    if (permissions) {
      // If permissionName is in format "router:action", split it
      if (permissionName.includes(':')) {
        const [routerName, action] = permissionName.split(':');
        if (
          permissions[routerName] &&
          permissions[routerName].includes(action)
        ) {
          return <Component {...props} />;
        }
      } else {
        // If it's a direct permission key
        if (Object.keys(permissions).includes(permissionName)) {
          return <Component {...props} />;
        }
      }
    }

    router.replace('/404');
    return null;
  };
}

// Enhanced authorize function that uses router and action based permissions
// Example:
// const ProtectedUserPage = authorizeRoute(UserDashboardPage, 'users', 'view');
export function authorizeRoute(
  Component: any,
  routerName: string,
  action: string,
) {
  return function WithRoutePermissionWrapper(props: any) {
    const router = useRouter();
    const { hasPermission } = usePermission();

    // Check if user has permission for this route and action
    if (hasPermission(routerName, action)) {
      return <Component {...props} />;
    }

    // Redirect to 404 if not authorized
    router.replace('/404');
    return null;
  };
}

// Authorize route when at least one of multiple actions is permitted for a router
// Example:
// const UserManagementPage = authorizeRouteWithAnyAction(
//   UserManagementComponent,
//   'users',
//   ['view', 'edit', 'create']
// );
export function authorizeRouteWithAnyAction(
  Component: any,
  routerName: string,
  actions: string[],
) {
  return function WithMultiActionPermissionWrapper(props: any) {
    const router = useRouter();
    const { hasOneOfActions } = usePermission();

    // Check if user has at least one of the specified actions for this router
    if (hasOneOfActions(routerName, actions)) {
      return <Component {...props} />;
    }

    // Redirect to 404 if not authorized
    router.replace('/404');
    return null;
  };
}

// Authorize route when at least one of multiple permissions is granted
// Example:
// const AnalyticsPage = authorizeRouteWithAnyPermissions(
//   AnalyticsComponent,
//   [
//     { router: 'reports', action: 'view' },
//     { router: 'analytics', action: 'access' }
//   ]
// );
export function authorizeRouteWithAnyPermissions(
  Component: any,
  permissionChecks: PermissionCheck[],
) {
  return function WithAnyPermissionsWrapper(props: any) {
    const router = useRouter();
    const { hasOneOfPermissions } = usePermission();

    // Check if user has at least one of the specified permissions
    if (hasOneOfPermissions(permissionChecks)) {
      return <Component {...props} />;
    }

    // Redirect to 404 if not authorized
    router.replace('/404');
    return null;
  };
}

// HOC to authorize a component when user has ANY of the multiple permissions
// Example:
// const AdminDashboard = authorizeAnyRoute(
//   DashboardComponent,
//   [
//     { router: 'admin', action: 'access' },
//     { router: 'superuser', action: 'view' }
//   ]
// );
export function authorizeAnyRoute(
  Component: any,
  permissionChecks: PermissionCheck[],
) {
  return function WithMultiPermissionWrapper(props: any) {
    const router = useRouter();
    const { hasAnyPermission } = usePermission();

    // Check if user has ANY of the specified permissions
    if (hasAnyPermission(permissionChecks)) {
      return <Component {...props} />;
    }

    // Redirect to 404 if not authorized
    router.replace('/404');
    return null;
  };
}

// HOC to authorize a component when user has ALL of the multiple permissions
// Example:
// const SettingsPage = authorizeAllRoute(
//   SettingsComponent,
//   [
//     { router: 'settings', action: 'view' },
//     { router: 'settings', action: 'edit' }
//   ]
// );
export function authorizeAllRoute(
  Component: any,
  permissionChecks: PermissionCheck[],
) {
  return function WithAllPermissionsWrapper(props: any) {
    const router = useRouter();
    const { hasAllPermissions } = usePermission();

    // Check if user has ALL of the specified permissions
    if (hasAllPermissions(permissionChecks)) {
      return <Component {...props} />;
    }

    // Redirect to 404 if not authorized
    router.replace('/404');
    return null;
  };
}

// HOC to wrap a component with conditional rendering based on permissions
// Example:
// const EditButton = withPermission(Button, 'users', 'edit');
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  routerName: string,
  action: string,
): React.FC<P> {
  return function PermissionWrapper(props: P): ReactElement | null {
    const { hasPermission } = usePermission();

    // Only render the component if user has permission
    return hasPermission(routerName, action) ? <Component {...props} /> : null;
  };
}

// HOC to wrap a component with conditional rendering based on ANY of the multiple actions
// Example:
// const UserActionButton = withAnyAction(
//   ActionButton,
//   'users',
//   ['edit', 'delete', 'create']
// );
export function withAnyAction<P extends object>(
  Component: React.ComponentType<P>,
  routerName: string,
  actions: string[],
): React.FC<P> {
  return function MultiActionWrapper(props: P): ReactElement | null {
    const { hasOneOfActions } = usePermission();

    // Only render the component if user has ANY of the actions
    return hasOneOfActions(routerName, actions) ? (
      <Component {...props} />
    ) : null;
  };
}

// HOC to wrap a component with conditional rendering based on having at least one permission
// Example:
// const AdminPanel = withAnyPermissions(
//   AdminPanelComponent,
//   [
//     { router: 'admin', action: 'view' },
//     { router: 'settings', action: 'manage' }
//   ]
// );
export function withAnyPermissions<P extends object>(
  Component: React.ComponentType<P>,
  permissionChecks: PermissionCheck[],
): React.FC<P> {
  return function AnyPermissionsWrapper(props: P): ReactElement | null {
    const { hasOneOfPermissions } = usePermission();

    // Only render the component if user has at least one of the specified permissions
    return hasOneOfPermissions(permissionChecks) ? (
      <Component {...props} />
    ) : null;
  };
}

// HOC to wrap a component with conditional rendering based on ANY of the multiple permissions
// Example:
// const ReportingTools = withAnyPermission(
//   ReportingComponent,
//   [
//     { router: 'reports', action: 'generate' },
//     { router: 'analytics', action: 'export' }
//   ]
// );
// NOTE: This function is duplicate of withAnyPermissions and should be considered for deprecation
export function withAnyPermission<P extends object>(
  Component: React.ComponentType<P>,
  permissionChecks: PermissionCheck[],
): React.FC<P> {
  return function MultiPermissionWrapper(props: P): ReactElement | null {
    const { hasAnyPermission } = usePermission();

    // Only render the component if user has ANY of the specified permissions
    return hasAnyPermission(permissionChecks) ? <Component {...props} /> : null;
  };
}

// HOC to wrap a component with conditional rendering based on ALL of the multiple permissions
// Example:
// const AdvancedTools = withAllPermissions(
//   AdvancedToolsComponent,
//   [
//     { router: 'admin', action: 'access' },
//     { router: 'system', action: 'configure' }
//   ]
// );
export function withAllPermissions<P extends object>(
  Component: React.ComponentType<P>,
  permissionChecks: PermissionCheck[],
): React.FC<P> {
  return function AllPermissionsWrapper(props: P): ReactElement | null {
    const { hasAllPermissions } = usePermission();

    // Only render the component if user has ALL of the specified permissions
    return hasAllPermissions(permissionChecks) ? (
      <Component {...props} />
    ) : null;
  };
}

// Component to conditionally render children based on permission
// Example:
// <PermissionGate
//   router="documents"
//   action="view"
//   fallback={<AccessDenied />}
// >
//   <DocumentViewer />
// </PermissionGate>
export function PermissionGate({
  children,
  router,
  action,
  fallback = null,
}: {
  children: ReactElement | ReactElement[];
  router: string;
  action: string;
  fallback?: ReactElement | null;
}): ReactElement | null {
  const { hasPermission } = usePermission();

  return hasPermission(router, action) ? <>{children}</> : fallback;
}

// Component to conditionally render children based on ANY of multiple actions for a router
// Example:
// <RouterActionsGate
//   router="products"
//   actions={['view', 'edit', 'create']}
//   fallback={<AccessDenied />}
// >
//   <ProductsManager />
// </RouterActionsGate>
export function RouterActionsGate({
  children,
  router,
  actions,
  fallback = null,
}: {
  children: ReactElement | ReactElement[];
  router: string;
  actions: string[];
  fallback?: ReactElement | null;
}): ReactElement | null {
  const { hasOneOfActions } = usePermission();

  return hasOneOfActions(router, actions) ? <>{children}</> : fallback;
}

// Component to conditionally render children based on having at least one permission
// Example:
// <AnyPermissionsGate
//   permissions={[
//     { router: 'customers', action: 'view' },
//     { router: 'leads', action: 'view' }
//   ]}
//   fallback={<NoAccessMessage />}
// >
//   <ContactsDirectory />
// </AnyPermissionsGate>
export function AnyPermissionsGate({
  children,
  permissions,
  fallback = null,
}: {
  children: ReactElement | ReactElement[];
  permissions: PermissionCheck[];
  fallback?: ReactElement | null;
}): ReactElement | null {
  // NOTE: Consider renaming hasOneOfPermissions to hasAnyPermissions in usePermission hook for consistency
  const { hasOneOfPermissions } = usePermission();

  return hasOneOfPermissions(permissions) ? <>{children}</> : fallback;
}

// Component to conditionally render children based on ALL of the multiple permissions
// Example:
// <AllPermissionsGate
//   permissions={[
//     { router: 'settings', action: 'view' },
//     { router: 'settings', action: 'edit' }
//   ]}
//   fallback={<ReadOnlyMessage />}
// >
//   <SettingsEditor />
// </AllPermissionsGate>
export function AllPermissionsGate({
  children,
  permissions,
  fallback = null,
}: {
  children: ReactElement | ReactElement[];
  permissions: PermissionCheck[];
  fallback?: ReactElement | null;
}): ReactElement | null {
  const { hasAllPermissions } = usePermission();

  return hasAllPermissions(permissions) ? <>{children}</> : fallback;
}

// Component to conditionally render children based on ANY of the multiple permissions
// Example:
// <AnyPermissionGate
//   permissions={[
//     { router: 'users', action: 'view' },
//     { router: 'reports', action: 'download' }
//   ]}
//   fallback={<AccessDenied />}
// >
//   <UserDashboard />
// </AnyPermissionGate>
// NOTE: This function is duplicate of AnyPermissionsGate and should be considered for deprecation
export function AnyPermissionGate({
  children,
  permissions,
  fallback = null,
}: {
  children: ReactElement | ReactElement[];
  permissions: PermissionCheck[];
  fallback?: ReactElement | null;
}): ReactElement | null {
  const { hasAnyPermission } = usePermission();

  return hasAnyPermission(permissions) ? <>{children}</> : fallback;
}
