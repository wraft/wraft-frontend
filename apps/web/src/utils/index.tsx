// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { AxiosError } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import cookie from 'js-cookie';

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

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const errorMessage = (err: AxiosError, defaultMessage?: string) => {
  const data = err?.response?.data;
  return data?.message || data?.error || defaultMessage || '';
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
