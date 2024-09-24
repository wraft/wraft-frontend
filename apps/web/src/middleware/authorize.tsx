import { useRouter } from 'next/router';

import { useAuth } from 'contexts/AuthContext';

export function authorize(Component: any, permissionName: any) {
  return function WithRolesWrapper(props: any) {
    const router = useRouter();
    const { permissions } = useAuth();

    if (permissions && permissions[permissionName]) {
      return <Component {...props} />;
    }

    router.replace('/404');
    null;
  };
}
