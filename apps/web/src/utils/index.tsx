// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { AxiosRequestConfig, AxiosError } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import cookie from 'js-cookie';
import { Box } from '@wraft/ui';

/**
 *  @TODO Icons: Convert to local files
 */

// util fns here!
export interface IField {
  name: string;
  value: string;
}

// Clean Square Brackets
export const cleanName = (val: string): string => {
  const val1 = val.replace('[', '');
  return val1.replace(']', '');
};

// Clean Square Brackets
export const cleanName2 = (val: string): string => {
  const val1 = val.replace('\\[', '');
  return val1.replace('\\]', '');
};

export const findDefault = (needle: string, stack: any) => {
  return stack.find((x: IField) => x.name === needle);
};

export const findHolders = (data) => {
  const holders = {};

  const traverse = (node) => {
    if (Array.isArray(node)) {
      node.forEach(traverse);
    } else if (typeof node === 'object' && node !== null) {
      if (node.type === 'holder' && node.attrs) {
        const { id, named, name } = node.attrs;
        if (id && named !== undefined) {
          holders[convertToVariableName(name)] = named;
        }
      }
      Object.values(node).forEach(traverse);
    }
  };

  traverse(data);
  return holders;
};

export const updateVars = (data, fields, nodeType = 'holder') => {
  if (!fields?.length || !fields[0]?.value || !data?.content) {
    return data;
  }

  const fieldMap = new Map(
    fields.map((field) => [convertToVariableName(field.name), field.value]),
  );

  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(deepClone);
    }
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  const clonedData = deepClone(data);

  function update(node) {
    if (Array.isArray(node)) {
      node.forEach(update);
    } else if (typeof node === 'object' && node !== null) {
      if (node.type === nodeType) {
        const variableName = convertToVariableName(node.attrs?.name);
        const value = fieldMap.get(convertToVariableName(variableName));
        if (value !== undefined) {
          node.attrs.named = value;
        }
      }
      Object.values(node).forEach(update);
    }
  }

  update(clonedData.content);

  return clonedData;
};

/**
 * Super Simple Variable Replacer
 * @param body
 * @param newValue
 * @param match
 */
export const replaceBoy = (
  body: string,
  matches: string[],
  maps: IField[],
  escaped: boolean,
): string => {
  let localBody: string = body;

  if (localBody && localBody.length > 1) {
    // loop through variables
    if (matches && matches.length > 1) {
      matches.forEach((e) => {
        const cleanNames = escaped ? cleanName2(e) : cleanName(e);
        const m = findDefault(cleanNames, maps);
        // find the key from
        if (m && m.value) {
          if (escaped) {
            localBody = localBody.replace(`\\[${cleanNames}\\]`, m.value);
          }
        }
      });
    }
    return localBody;
  } else {
    return body;
  }
};

/**
 * Find [vars] formatted variables in a text
 * @param body
 */

export const findVars = (body: string, escaped: boolean): string[] => {
  // find vars in this form
  let regexp = /\[\w+\]/gm;
  if (escaped) {
    regexp = /\\\[\w+\\\]/gm;
  }

  let m;
  const results: string[] = [];

  while ((m = regexp.exec(body)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match) => {
      results.push(match);
    });
  }
  return results;
};

/**
 * Replace Vars with Maps field values
 * @param body
 * @param maps
 */
export const replaceVars = (body: string, maps: IField[], escaped: boolean) => {
  const resultVars = findVars(body, escaped);
  return replaceBoy(body, resultVars, maps, escaped);
};

/**
 * Replace Vars with Maps field values
 * @param body
 * @param maps
 */
export const replaceTitles = (body: string, maps: any) => {
  const resultVars = findVars(body, false);
  return replaceTitle(body, resultVars, maps);
};

/**
 * Super Simple Variable Replacer
 * @param body
 * @param newValue
 * @param match
 */
export const replaceTitle = (
  body: string,
  matches: string[],
  maps: any,
): string => {
  let localBody: string = body;
  if (localBody && localBody.length > 1) {
    // loop through variables
    if (matches && matches.length > 0) {
      matches.forEach((e) => {
        const cleanNames = cleanName(e);

        const m = findDefault(cleanNames, maps);
        if (m && m.value) {
          localBody = localBody.replace(`[${cleanNames}]`, m.value);
        }
      });
    }
    return localBody;
  } else {
    return body;
  }
};

/**
 * Find from Array
 * @param k
 * @param needle
 */
export const findAll = (k: any, needle: string) => {
  const res = k.find((m: any) => {
    return m.id == needle;
  });
  return res;
};

export interface IFieldField {
  name: string;
  value: string;
}

export const getInits = (field_maps: any) => {
  const initials: IFieldField[] = [];
  field_maps &&
    field_maps.forEach((i: any) => {
      const item: IFieldField = { name: i.name, value: i.value };
      initials.push(item);
    });
  return initials;
};

export const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    // width: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'scroll',
    height: '60%', // <-- This sets the height
    overlfow: 'scroll', // <-- This tells the modal to scrol
  },
};

export const defaultModalStyle = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(5 6 8 / 78%)',
  },
  content: {
    position: 'relative',
    transform: 'translateY(-50%, -50%)',
    top: '15%',
    width: '50%',
    maxWidth: '910px',
    margin: '0 auto',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 6px #00000029',
    borderRadius: '9px',
    outline: 'none',
    overflow: 'auto',
    padding: 0,
    marginBottom: 0,
    WebkitOverflowScrolling: 'touch',
  },
};

export const modalStyle2 = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '80%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'scroll',
    height: '60%', // <-- This sets the height
    overlfow: 'scroll', // <-- This tells the modal to scrol
  },
};

export const modalStyle3 = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '70%', // <-- This sets the height
    overlfow: 'scroll', // <-- This tells the modal to scrol
  },
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const isNumeric = (str: any) => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};
// const ICON_COLOR = '#999';
export interface menuLinksProps {
  name: string;
  path: string;
  logo?: any;
  role?: any;
}

export interface pipelineLinksProps {
  name: string;
  path: string;
  logo?: any;
  role?: any;
}

export const menuLinks: menuLinksProps[] = [
  {
    name: 'Layouts',
    logo: <Box w="20px" />,
    path: '/manage/layouts',
  },
  {
    name: 'Flows',
    logo: <Box w="20px" />,
    path: '/manage/flows',
  },

  {
    name: 'Themes',
    logo: <Box w="20px" />,
    path: '/manage/themes',
  },
];

export const PersonalWorkspaceLinks: menuLinksProps[] = [
  {
    name: 'General',
    path: '/manage/workspace',
  },
  {
    name: 'Fields',
    path: '/manage/fields',
  },
];

export const workspaceLinks: menuLinksProps[] = [
  {
    name: 'General',
    path: '/manage/workspace',
  },
  {
    name: 'Fields',
    path: '/manage/workspace/fields',
  },
  {
    name: 'Members',
    path: '/manage/workspace/members',
  },

  {
    name: 'Roles',
    path: '/manage/workspace/roles',
  },
  {
    name: 'Permissions',
    path: '/manage/workspace/permissions',
  },
];

export const profileLinks: menuLinksProps[] = [
  {
    name: 'My Account',
    path: '/account',
  },
  {
    name: 'Manage Workspace',
    path: '/account/company',
  },
  // {
  //   name: 'Checks',
  //   path: '/account/checks',
  // },
];

export const removeProtocol = (link: string) =>
  link.replace(/^https?:\/\//, '');

export const withComma = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getAxiosConfig = (
  options: AxiosRequestConfig = {},
): AxiosRequestConfig => ({
  ...options,
  headers: {
    ...options.headers,
    Authorization: cookie.get('token'),
  },
});

export const errorMessage = (err: AxiosError, defaultMessage?: string) => {
  const data = err?.response?.data;
  return data?.message || data?.error || defaultMessage || '';
};

export const checkSubRoutePermission = (routes: any, permissions: any) => {
  const routeList = routes.filter((data: any) => {
    if (!data.permissionName) {
      return data;
    }
    if (permissions && permissions[data.permissionName]) {
      const permissionList = permissions[data.permissionName];
      if (
        data.permissions.some((permission: any) =>
          permissionList.includes(permission),
        )
      ) {
        return data;
      }
    }
  });

  return routeList;
};

export const convertToVariableName = (name) => {
  let varName = name
    .replace(/'/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  // Ensure the name starts with a letter
  if (!/^[a-z]/.test(varName)) {
    varName = 'field_' + varName;
  }

  return varName;
};
