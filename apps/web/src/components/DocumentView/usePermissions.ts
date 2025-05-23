import { useMemo } from 'react';

export type EditorMode = 'view' | 'edit' | 'new' | 'sign';
export type DocRole = 'viewer' | 'editor' | 'signer';
export type UserType = 'default' | 'guest';
export type SectionId =
  | 'overview'
  | 'comment'
  | 'history'
  | 'log'
  | 'flow'
  | 'docGenerator'
  | 'docEdit'
  | 'docView'
  | 'sign'
  | 'toolbar'
  | 'approvalAction';

interface SectionPermission {
  modes: {
    viewer: boolean;
    editor: boolean;
    signer: boolean;
  };
}

type PermissionsMap = Record<SectionId, SectionPermission>;

export const PERMISSIONS_CONFIG: Record<UserType, PermissionsMap> = {
  default: {
    overview: {
      modes: {
        viewer: true,
        editor: true,
        signer: false,
      },
    },
    comment: {
      modes: {
        viewer: true,
        editor: true,
        signer: true,
      },
    },
    history: {
      modes: {
        viewer: true,
        editor: true,
        signer: false,
      },
    },
    log: {
      modes: {
        viewer: true,
        editor: true,
        signer: false,
      },
    },
    sign: {
      modes: {
        viewer: true,
        editor: true,
        signer: true,
      },
    },
    flow: {
      modes: {
        viewer: true,
        editor: true,
        signer: false,
      },
    },
    docGenerator: {
      modes: {
        viewer: true,
        editor: false,
        signer: false,
      },
    },
    docEdit: {
      modes: {
        viewer: true,
        editor: true,
        signer: false,
      },
    },
    docView: {
      modes: {
        viewer: true,
        editor: false,
        signer: false,
      },
    },
    approvalAction: {
      modes: {
        viewer: true,
        editor: false,
        signer: false,
      },
    },
    toolbar: {
      modes: {
        viewer: true,
        editor: true,
        signer: true,
      },
    },
  },
  guest: {
    overview: {
      modes: {
        viewer: true,
        editor: true,
        signer: false,
      },
    },
    comment: {
      modes: {
        viewer: false,
        editor: false,
        signer: false,
      },
    },
    history: {
      modes: {
        viewer: false,
        editor: false,
        signer: false,
      },
    },
    log: {
      modes: {
        viewer: false,
        editor: false,
        signer: false,
      },
    },
    flow: {
      modes: {
        viewer: false,
        editor: false,
        signer: false,
      },
    },
    docGenerator: {
      modes: {
        viewer: false,
        editor: false,
        signer: false,
      },
    },
    docEdit: {
      modes: {
        viewer: false,
        editor: true,
        signer: false,
      },
    },
    docView: {
      modes: {
        viewer: false,
        editor: false,
        signer: false,
      },
    },
    approvalAction: {
      modes: {
        viewer: false,
        editor: false,
        signer: false,
      },
    },
    sign: {
      modes: {
        viewer: false,
        editor: false,
        signer: true,
      },
    },
    toolbar: {
      modes: {
        viewer: true,
        editor: true,
        signer: false,
      },
    },
  },
};

interface UsePermissionsResult {
  canAccess: (sectionId: SectionId) => boolean;
  isAllowed: boolean;
  availableSections: SectionId[];
}

export const usePermissions = (
  userType: UserType,
  docRole: DocRole,
): UsePermissionsResult => {
  return useMemo(() => {
    const userPermissions = PERMISSIONS_CONFIG[userType];

    const canAccess = (sectionId: SectionId): boolean => {
      return userPermissions[sectionId].modes[docRole];
    };

    const availableSections = Object.entries(userPermissions)
      .filter(([_, permissions]) => permissions.modes[docRole])
      .map(([sectionId]) => sectionId as SectionId);

    return {
      canAccess,
      isAllowed: availableSections.length > 0,
      availableSections,
    };
  }, [userType, docRole]);
};
