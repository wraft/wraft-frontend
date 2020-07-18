import produce from 'immer';
import { ContentState } from './types';

// import { Flat } from "lodash";

// util fns here!
export interface IField {
  name: string;
  value: string;
}

// Clean Square Brackets
export const cleanName = (val: string): string => {
  let val1 = val.replace('[', '');
  return val1.replace(']', '');
};

// Clean Square Brackets
export const cleanName2 = (val: string): string => {
  // console.log('cleanName2', val)
  let val1 = val.replace('\\[', '');
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
    console.log('UPDATED_BODY', fields);
    const result = produce(data, draft => {
      data.content.forEach((p: any, k: any) => {
        if (p && p.content && p.content.length > 0) {
          p.content.forEach((c: any, y: any) => {
            if (c['type'] === 'holder') {
              const {
                attrs: { name },
              } = c;
              const ff = fields.find((e: any) => e.name === name);
              // console.log('c', ff);
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
  let localBody: string = body;

  if (localBody && localBody.length > 1) {
    // loop through variables
    if (matches && matches.length > 1) {
      matches.forEach(e => {
        let cleanNames = escaped ? cleanName2(e) : cleanName(e);
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
  let regexp = /\[\w+\]/gm;
  if (escaped) {
    regexp = /\\\[\w+\\\]/gm;
  }

  let m;
  let results: string[] = [];

  while ((m = regexp.exec(body)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach(match => {
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
export const replaceTitles = (body: string, maps: IField[]) => {
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
  maps: IField[],
): string => {
  let localBody: string = body;
  if (localBody && localBody.length > 1) {
    // loop through variables
    if (matches && matches.length > 0) {
      matches.forEach(e => {
        let cleanNames = cleanName(e);
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
  let initials: IFieldField[] = [];
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
    overlfow: 'scroll' // <-- This tells the modal to scrol
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
    overlfow: 'scroll' // <-- This tells the modal to scrol
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
    overlfow: 'scroll' // <-- This tells the modal to scrol
  },
};