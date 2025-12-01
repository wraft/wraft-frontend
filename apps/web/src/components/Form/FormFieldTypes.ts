import {
  TextT,
  TextAlignLeft,
  CalendarBlank,
  RadioButton,
  CheckSquare,
  ListDashes,
  Clock,
  EnvelopeSimple,
  Table,
} from '@phosphor-icons/react';
import { IconProps } from '@phosphor-icons/react';

export type BackendFieldType =
  | 'Email'
  | 'Date'
  | 'Time'
  | 'Text'
  | 'Radio Button'
  | 'Drop Down'
  | 'String'
  | 'options'
  | 'Table';

export enum FieldType {
  TEXT = 'TEXT',
  LONG_TEXT = 'LONG_TEXT',
  DATE = 'DATE',
  TIME = 'TIME',
  EMAIL = 'EMAIL',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  DROPDOWN = 'DROPDOWN',
  OPTIONS = 'OPTIONS',
  TABLE = 'TABLE',
}

export interface FieldValue {
  id: string;
  name: string;
}

export interface TableColumn {
  id: string;
  name: string;
  type?: string;
}

export interface FormField {
  id: string;
  name: string;
  machineName?: string;
  type: BackendFieldType;
  fieldTypeId: string;
  required?: boolean;
  long?: boolean;
  multiple?: boolean;
  fileSize?: number;
  values?: FieldValue[];
  tableColumns?: TableColumn[];
  tableRows?: Record<string, any>[];
  defaultValue?: string;
  error?: string;
  uiType?: FieldType;
}

export const BackendTypeMapping: Record<FieldType, BackendFieldType> = {
  [FieldType.TEXT]: 'String',
  [FieldType.LONG_TEXT]: 'Text',
  [FieldType.DATE]: 'Date',
  [FieldType.TIME]: 'Time',
  [FieldType.EMAIL]: 'Email',
  [FieldType.RADIO]: 'Radio Button',
  [FieldType.CHECKBOX]: 'Radio Button',
  [FieldType.DROPDOWN]: 'Drop Down',
  [FieldType.OPTIONS]: 'options',
  [FieldType.TABLE]: 'Table',
};

export const FieldDisplayNames: Record<FieldType, string> = {
  [FieldType.TEXT]: 'Text',
  [FieldType.LONG_TEXT]: 'Long Text',
  [FieldType.DATE]: 'Date',
  [FieldType.TIME]: 'Time',
  [FieldType.EMAIL]: 'Email',
  [FieldType.RADIO]: 'Radio Button',
  [FieldType.CHECKBOX]: 'Checkbox',
  [FieldType.DROPDOWN]: 'Dropdown',
  [FieldType.OPTIONS]: 'Options',
  [FieldType.TABLE]: 'Table',
};

export const FieldIcons: Record<FieldType, React.ComponentType<IconProps>> = {
  [FieldType.TEXT]: TextT,
  [FieldType.LONG_TEXT]: TextAlignLeft,
  [FieldType.DATE]: CalendarBlank,
  [FieldType.TIME]: Clock,
  [FieldType.EMAIL]: EnvelopeSimple,
  [FieldType.RADIO]: RadioButton,
  [FieldType.CHECKBOX]: CheckSquare,
  [FieldType.DROPDOWN]: ListDashes,
  [FieldType.OPTIONS]: ListDashes,
  [FieldType.TABLE]: Table,
};

export const FieldDescriptions: Record<FieldType, string> = {
  [FieldType.TEXT]: 'Short answer text field',
  [FieldType.LONG_TEXT]: 'Paragraph text field',
  [FieldType.DATE]: 'Date selector',
  [FieldType.TIME]: 'Time selector',
  [FieldType.EMAIL]: 'Email address field',
  [FieldType.RADIO]: 'Single selection from options',
  [FieldType.CHECKBOX]: 'Multiple selection from options',
  [FieldType.DROPDOWN]: 'Dropdown selection menu',
  [FieldType.OPTIONS]: 'Options field',
  [FieldType.TABLE]: 'Table with rows and columns',
};

export const FieldMap: Record<
  FieldType,
  {
    displayName: string;
    description: string;
    icon: React.ComponentType<IconProps>;
    backendType: BackendFieldType;
  }
> = {
  [FieldType.TEXT]: {
    displayName: FieldDisplayNames[FieldType.TEXT],
    description: FieldDescriptions[FieldType.TEXT],
    icon: FieldIcons[FieldType.TEXT],
    backendType: BackendTypeMapping[FieldType.TEXT],
  },
  [FieldType.LONG_TEXT]: {
    displayName: FieldDisplayNames[FieldType.LONG_TEXT],
    description: FieldDescriptions[FieldType.LONG_TEXT],
    icon: FieldIcons[FieldType.LONG_TEXT],
    backendType: BackendTypeMapping[FieldType.LONG_TEXT],
  },
  [FieldType.DATE]: {
    displayName: FieldDisplayNames[FieldType.DATE],
    description: FieldDescriptions[FieldType.DATE],
    icon: FieldIcons[FieldType.DATE],
    backendType: BackendTypeMapping[FieldType.DATE],
  },
  [FieldType.TIME]: {
    displayName: FieldDisplayNames[FieldType.TIME],
    description: FieldDescriptions[FieldType.TIME],
    icon: FieldIcons[FieldType.TIME],
    backendType: BackendTypeMapping[FieldType.TIME],
  },
  [FieldType.EMAIL]: {
    displayName: FieldDisplayNames[FieldType.EMAIL],
    description: FieldDescriptions[FieldType.EMAIL],
    icon: FieldIcons[FieldType.EMAIL],
    backendType: BackendTypeMapping[FieldType.EMAIL],
  },
  [FieldType.RADIO]: {
    displayName: FieldDisplayNames[FieldType.RADIO],
    description: FieldDescriptions[FieldType.RADIO],
    icon: FieldIcons[FieldType.RADIO],
    backendType: BackendTypeMapping[FieldType.RADIO],
  },
  [FieldType.CHECKBOX]: {
    displayName: FieldDisplayNames[FieldType.CHECKBOX],
    description: FieldDescriptions[FieldType.CHECKBOX],
    icon: FieldIcons[FieldType.CHECKBOX],
    backendType: BackendTypeMapping[FieldType.CHECKBOX],
  },
  [FieldType.DROPDOWN]: {
    displayName: FieldDisplayNames[FieldType.DROPDOWN],
    description: FieldDescriptions[FieldType.DROPDOWN],
    icon: FieldIcons[FieldType.DROPDOWN],
    backendType: BackendTypeMapping[FieldType.DROPDOWN],
  },
  [FieldType.OPTIONS]: {
    displayName: FieldDisplayNames[FieldType.OPTIONS],
    description: FieldDescriptions[FieldType.OPTIONS],
    icon: FieldIcons[FieldType.OPTIONS],
    backendType: BackendTypeMapping[FieldType.OPTIONS],
  },
  [FieldType.TABLE]: {
    displayName: FieldDisplayNames[FieldType.TABLE],
    description: FieldDescriptions[FieldType.TABLE],
    icon: FieldIcons[FieldType.TABLE],
    backendType: BackendTypeMapping[FieldType.TABLE],
  },
};

export const FormElementTypes: FieldType[] = [
  FieldType.TEXT,
  FieldType.LONG_TEXT,
  FieldType.DATE,
  FieldType.TABLE,
  FieldType.DROPDOWN,
  // FieldType.RADIO,
  // FieldType.CHECKBOX,
];

export const getFieldTypeFromBackendType = (
  backendType: BackendFieldType,
): FieldType | undefined => {
  for (const [key, value] of Object.entries(BackendTypeMapping)) {
    if (value === backendType) {
      return key as FieldType;
    }
  }
  return undefined;
};

export const getDefaultFieldConfig = (fieldType: FieldType): FormField => {
  const baseConfig: FormField = {
    name: '',
    type: BackendTypeMapping[fieldType],
    id: Math.random().toString(),
    required: false,
    fieldTypeId: '',
    uiType: fieldType,
  };

  switch (fieldType) {
    case FieldType.RADIO:
    case FieldType.CHECKBOX:
    case FieldType.DROPDOWN:
      return {
        ...baseConfig,
        multiple: fieldType === FieldType.CHECKBOX,
        values: [],
      };
    case FieldType.LONG_TEXT:
      return {
        ...baseConfig,
        long: true,
      };
    case FieldType.TABLE:
      return {
        ...baseConfig,
        tableColumns: [],
        tableRows: [],
      };
    default:
      return baseConfig;
  }
};
