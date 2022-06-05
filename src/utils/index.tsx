// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import produce from 'immer';
import { ContentState } from './types';
// import { Flat } from "lodash";

import { Layout, User, Collection } from '@styled-icons/boxicons-regular';

import { Style } from '@styled-icons/material-sharp/Style';
import { FlowBranch } from '@styled-icons/entypo/FlowBranch';

// dayjs.extend(dayjsTwitter)

// export function shortDate(date:any) {
//   return dayjs(date)?.twitter();
// }

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
  // console.log('cleanName2', val)
  const val1 = val.replace('\\[', '');
  return val1.replace('\\]', '');
};

export const findDefault = (needle: string, stack: any) => {
  return stack.find((x: IField) => x.name === needle);
};

/**
 * Update ProseMirror Node
 * @param data
 * @param fields
 * @todo - Limited to 2 level deep arrays
 */
export const updateVars = (data: ContentState, fields: any) => {
  // cut it short if it map has no values
  if (fields && fields[0] && fields[0].value) {
    console.log('UPDATED_BODY updateStuff', fields);
    const result = produce(data, (draft) => {
      data.content.forEach((p: any, k: any) => {
        if (p && p.content && p.content.length > 0) {
          p.content.forEach((c: any, y: any) => {
            if (c['type'] === 'holder') {
              const {
                attrs: { name },
              } = c;
              const ff = fields.find((e: any) => e.name === name);
              // console.log('updateStuff ' + name, ff);
              draft['content'][k]['content'][y]['attrs']['named'] =
                ff && ff.value;
            }
          });
        }
      });
    });
    return result;
  } else {
    return data;
  }
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
  const localBody: string = body;

  if (localBody && localBody.length > 1) {
    // loop through variables
    if (matches && matches.length > 1) {
      matches.forEach((e) => {
        const cleanNames = escaped ? cleanName2(e) : cleanName(e);
        const m = findDefault(cleanNames, maps);
        // find the key from
        if (m && m.value) {
          console.log('ESCAPED', escaped);
          // if its escaped
          if (escaped) {
            localBody = localBody.replace(`\\[${cleanNames}\\]`, m.value);
          }
        } else {
          console.log('ESCAPED X', escaped);
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
  const regexp = /\[\w+\]/gm;
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
  // console.log('results', results);
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
  const localBody: string = body;
  if (localBody && localBody.length > 1) {
    // loop through variables
    if (matches && matches.length > 0) {
      matches.forEach((e) => {
        const cleanNames = cleanName(e);

        const m = findDefault(cleanNames, maps);
        if (m && m.value) {
          console.log('🐴🐴  🧶  ');
          localBody = localBody.replace(`[${cleanNames}]`, m.value);
        } else {
          console.log('🐴🐴  🧶  ', m);
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
  logo: any;
}

export const menuLinks: menuLinksProps[] = [
  {
    name: 'Layouts',
    logo: <Layout width="20px" />,
    path: '/manage/layouts',
  },
  {
    name: 'Flows',
    logo: <FlowBranch width="20px" />,
    path: '/manage/flows',
  },

  {
    name: 'Themes',
    logo: <Style width="20px" />,
    path: '/manage/themes',
  },
  {
    name: 'Roles',
    logo: <User width="20px" />,
    path: '/manage/roles',
  },
  {
    name: 'Fields',
    logo: <User width="20px" />,
    path: '/manage/fields',
  },
  {
    name: 'Pipelines',
    logo: <Collection width={20} />,
    path: '/manage/pipelines',
  },
];

import cookie from 'js-cookie';
import { AxiosRequestConfig, AxiosError } from 'axios';

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
