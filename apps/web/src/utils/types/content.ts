export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IContentType {
  name: string;
  id: string;
  layout?: any;
  fields?: any;
  description: string;
  flow: any;
}

export interface IContent {
  id: string;
  updated_at: string;
  instance_id: string;
  serialized: any;
}

export interface ICreator {
  name: string;
  email: string;
}

export interface IField {
  creator: ICreator;
  content_type: IContentType;
}

export interface IVariantDetail {
  creator: ICreator;
  content_type?: IContentType;
  content?: any;
}

export interface IFieldItem {
  name: string;
  type: string;
}

export interface IFieldField {
  name: string;
  value: string;
  id?: string;
}

export interface IFieldType {
  name: string;
  value: string;
  type: string;
}

export interface IFieldTypeValue {
  name: string;
  id: string;
  value: string;
  type: string;
}

export interface IContentForm {
  id?: any;
  edit?: boolean;
}

export interface IFieldModel {
  name: string;
  id: string;
  field_type: any;
  value?: string;
}

export interface FlowStateBlockProps {
  state?: string;
  order?: number;
  id?: any;
  activeFlow?: any;
}

/**
 * Empty Prose Mirror Node
 */

export const EMPTY_MARKDOWN_NODE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export interface ContentInstance {
  state: State;
  creator: Creator;
  content_type: ContentType;
  content: Content;
  versions?: any;
}

export interface Content {
  approval_status: any;
  updated_at: any;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: any;
  id: string;
  build: string;
  title: string;
}

export interface Serialized {
  title: string;
  body: string;
  serialized: any;
}

export interface ContentType {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  fields: Fields;
  description: string;
  layout?: any;
}

export interface Fields {
  position: string;
  name: string;
  joining_date: string;
  approved_by: string;
}

export interface Creator {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
  profile_pic?: string;
}

export interface State {
  updated_at: Date;
  state: string;
  order: number;
  inserted_at: Date;
  id: string;
}

export interface IBuild {
  updated_at: string;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: string;
  id: string;
  build: string;
}

export interface Serialized {
  title: string;
  serialized: any;
  body: string;
}
