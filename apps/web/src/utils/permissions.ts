import { useAuth } from 'contexts/AuthContext';

/**
 * Types for permission system
 */
export interface RouterPermission {
  router: string;
  actions: string[];
}

export type PermissionMap = Record<string, RouterPermission>;

// Define backend permission structure
export type BackendPermissions = Record<string, string[]>;

// Define permission check type
export type PermissionCheck = {
  router: string;
  action: string;
};

/**
 * Hook to check if user has permission for a specific router and action
 */
export const usePermission = () => {
  const { permissions } = useAuth();

  // Safely type the permissions object based on backend format
  const backendPermissions = permissions as BackendPermissions | null;

  /**
   * Reusable reducer function to check permissions
   */
  const checkRouterPermission = (
    router: string,
    actionPredicate: (routerActions: string[], action: string) => boolean,
    action: string | string[],
  ): boolean => {
    if (!backendPermissions || !backendPermissions[router]) return false;

    if (Array.isArray(action)) {
      return (
        action.length > 0 &&
        action.some((act) => actionPredicate(backendPermissions[router], act))
      );
    }

    return actionPredicate(backendPermissions[router], action);
  };

  /**
   * Check if user has permission for a specific router and action
   * Example: hasPermission('organisation', 'view')
   */
  const hasPermission = (router: string, action: string): boolean => {
    return checkRouterPermission(
      router,
      (routerActions, act) => routerActions.includes(act),
      action,
    );
  };

  /**
   * Example:
   * hasAnyPermission([
   *   { router: 'organisation', action: 'view' },
   *   { router: 'document', action: 'edit' }
   * ])
   *
   * Check if user has any one of the multiple permissions specified
   * Returns true if at least one permission check passes
   */
  const hasAnyPermission = (checks: PermissionCheck[]): boolean => {
    if (!backendPermissions || checks.length === 0) return false;

    // Return true if any permission check passes
    return checks.some((check) => hasPermission(check.router, check.action));
  };

  /**
   * Example:
   * hasAllPermissions([
   *   { router: 'organisation', action: 'view' },
   *   { router: 'document', action: 'edit' }
   * ])
   *
   * Check if user has all permissions specified
   * Returns true only if all permission checks pass
   */
  const hasAllPermissions = (checks: PermissionCheck[]): boolean => {
    if (!backendPermissions || checks.length === 0) return false;

    // Return true only if all permission checks pass
    return checks.every((check) => hasPermission(check.router, check.action));
  };

  /**
   * Check if user has at least one of the specified actions for a router
   * Example: hasOneOfActions('organisation', ['show', 'manage', 'delete'])
   */
  const hasOneOfActions = (router: string, actions: string[]): boolean => {
    return checkRouterPermission(
      router,
      (routerActions, act) => routerActions.includes(act),
      actions,
    );
  };

  /**
   *
   * Check if user has at least one permission from a collection of router-action pairs
   * Example:
   * hasOneOfPermissions([
   *   { router: 'organisation', action: 'show' },
   *   { router: 'instance', action: 'manage' },
   *   { router: 'role', action: 'delete' }
   * ])
   */
  const hasOneOfPermissions = (
    permissionChecks: PermissionCheck[],
  ): boolean => {
    return hasAnyPermission(permissionChecks);
  };

  /**
   * Check if user has any permission for a specific router
   * Example: hasRouterAccess('organisation')
   */
  const hasRouterAccess = (router: string): boolean => {
    if (!backendPermissions) return false;

    // Check if router exists in permissions and has at least one action
    return (
      !!backendPermissions[router] && backendPermissions[router].length > 0
    );
  };

  /**
   * Get all available actions for a specific router
   * Example: getRouterActions('organisation') // returns ['view', 'edit', 'delete']
   */
  const getRouterActions = (router: string): string[] => {
    if (!backendPermissions || !backendPermissions[router]) return [];

    // Return the list of actions for this router
    return backendPermissions[router];
  };

  /**
   *
   * Check if user has permission to access a specific UI element
   * This can be used for conditionally showing UI elements
   * Example: canAccess('documents') or canAccess('settings', 'edit')
   */
  const canAccess = (component: string, action: string = 'show'): boolean => {
    // Map UI component names to backend permission entities
    const componentToPermissionMap: Record<string, string> = {
      documents: 'instance',
      templates: 'template_asset',
      forms: 'form',
      workflows: 'flow',
      blocks: 'block',
      roles: 'role',
      users: 'membership',
      settings: 'organisation',
      // Add more mappings as needed
    };

    const router = componentToPermissionMap[component] || component;
    return hasPermission(router, action);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasOneOfActions,
    hasOneOfPermissions,
    hasRouterAccess,
    getRouterActions,
    canAccess,
  };
};

export const checkSubRoutePermission = (routes: any, permissions: any) => {
  const routeList = routes?.filter((data: any) => {
    // If no permissions required, include the route
    if (!data.permissions || data.permissions.length === 0) {
      return data;
    }

    // For routes with specific permission requirements
    if (permissions) {
      // Check each permission in the route's requirements
      return data.permissions.some((permission: string) => {
        // If using resource.action format
        if (permission.includes('.')) {
          const [resource, action] = permission.split('.');

          // Check if resource exists in permissions and includes the action
          return (
            permissions[resource] &&
            Array.isArray(permissions[resource]) &&
            permissions[resource].includes(action)
          );
        }
        // Handle legacy permission format (direct match)
        else {
          // Check all permission categories
          return Object.keys(permissions).some(
            (category) =>
              Array.isArray(permissions[category]) &&
              permissions[category].includes(permission),
          );
        }
      });
    }

    return false;
  });

  return routeList;
};
