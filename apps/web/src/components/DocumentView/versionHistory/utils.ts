import { format } from 'date-fns';

export interface Author {
  email: string;
  name: string;
}

export interface APIVersion {
  id: string;
  inserted_at: string;
  naration: string | null;
  type: string;
  version_number: number;
  author: Author;
  current_version?: boolean;
}

export interface UIVersion extends APIVersion {
  name: string;
  isCurrentVersion: boolean;
  hasChanges: boolean;
  previousVersionId?: string;
}

export const formatDateTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return format(date, 'MMMM d, h:mm a');
  } catch {
    return 'Invalid date';
  }
};

export const transformVersions = (apiVersions: APIVersion[]): UIVersion[] => {
  if (!apiVersions?.length) return [];

  const chronological = [...apiVersions].sort(
    (a, b) =>
      new Date(a.inserted_at).getTime() - new Date(b.inserted_at).getTime(),
  );

  return chronological
    .map((version, index) => {
      const prev = index > 0 ? chronological[index - 1] : null;
      return {
        ...version,
        name: version.naration || `Version ${version.version_number}`,
        isCurrentVersion: !!version.current_version,
        hasChanges: !!prev,
        previousVersionId: prev?.id,
      };
    })
    .reverse();
};
