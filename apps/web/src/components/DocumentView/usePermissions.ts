import { useMemo } from 'react';

export type EditorMode = 'view' | 'edit' | 'new' | 'sign';
export type DocRole = 'viewer' | 'editor' | 'new' | 'signer';
export type UserType = 'default' | 'guest';
export type SectionId =
  | 'comment'
  | 'history'
  | 'log'
  | 'flow'
  | 'docGenerator'
  | 'docEdit'
  | 'docView'
  | 'approvalAction';

interface SectionPermission {
  modes: {
    viewer: boolean;
    editor: boolean;
    new: boolean;
    signer: boolean;
  };
}

type PermissionsMap = Record<SectionId, SectionPermission>;

export const PERMISSIONS_CONFIG: Record<UserType, PermissionsMap> = {
  default: {
    comment: {
      modes: {
        viewer: true,
        editor: true,
        new: true,
        signer: true,
      },
    },
    history: {
      modes: {
        viewer: true,
        editor: true,
        new: false,
        signer: false,
      },
    },
    log: {
      modes: {
        viewer: true,
        editor: true,
        new: false,
        signer: false,
      },
    },
    flow: {
      modes: {
        viewer: true,
        editor: true,
        new: false,
        signer: false,
      },
    },
    docGenerator: {
      modes: {
        viewer: true,
        editor: false,
        new: false,
        signer: false,
      },
    },
    docEdit: {
      modes: {
        viewer: true,
        editor: true,
        new: false,
        signer: false,
      },
    },
    docView: {
      modes: {
        viewer: true,
        editor: false,
        new: false,
        signer: false,
      },
    },
    approvalAction: {
      modes: {
        viewer: true,
        editor: false,
        new: false,
        signer: false,
      },
    },
  },
  guest: {
    comment: {
      modes: {
        viewer: false,
        editor: false,
        new: false,
        signer: false,
      },
    },
    history: {
      modes: {
        viewer: false,
        editor: false,
        new: false,
        signer: false,
      },
    },
    log: {
      modes: {
        viewer: false,
        editor: false,
        new: false,
        signer: false,
      },
    },
    flow: {
      modes: {
        viewer: false,
        editor: false,
        new: false,
        signer: false,
      },
    },
    docGenerator: {
      modes: {
        viewer: false,
        editor: false,
        new: false,
        signer: false,
      },
    },
    docEdit: {
      modes: {
        viewer: false,
        editor: true,
        new: false,
        signer: false,
      },
    },
    docView: {
      modes: {
        viewer: false,
        editor: false,
        new: false,
        signer: false,
      },
    },
    approvalAction: {
      modes: {
        viewer: false,
        editor: false,
        new: false,
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
