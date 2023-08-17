// export interface ContentTypes {
//   total_pages: number;
//   total_entries: number;
//   page_number: number;
//   content_types: ContentType[];
// }

export interface TokenPayload {
  iss: 'WraftAPI';
  sub: string;
  domain: string;
  admin: boolean;
  iat: number;
  exp: number;
}

export interface ContentType {
  updated_at: Date;
  prefix: string;
  name: string;
  layout: Layout;
  inserted_at: Date;
  id: string;
  flow: Flow | null;
  fields: any;
  decription: string;
  color: null;
}

export interface Flow {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
}

export interface Layout {
  width: number;
  update_at: string;
  unit: string;
  slug_file: null;
  slug: string;
  screenshot: string;
  name: string;
  inserted_at: string;
  id: string;
  height: number;
  description: string;
}

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface ContentType {
  creator: Creator;
  content_type: ContentTypeClass;
}

export interface ContentTypeClass {
  updated_at: string;
  prefix: string;
  name: string;
  layout: Layout;
  inserted_at: string;
  id: string;
  flow: ContentTypeFlow;
  fields: any;
  decription: string;
  color: null;
}

export interface ContentTypeFlow {
  states: State[];
  flow: FlowFlow;
}

export interface FlowFlow {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
}

export interface State {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

/**
 * Tempalates
 */
export interface DataTemplate {
  updated_at: string;
  tag: string;
  inserted_at: string;
  data: string;
  id: string;
}

export interface Template {
  data_template: DataTemplate;
  content_type: ContentType;
  creator: Creator;
}

/**
 * Assets
 */

export interface Asset {
  name: string;
  id: string;
  updated_at: string;
  inserted_at: string;
  file: string;
}

/**
 * Engines
 */

export interface Engine {
  id: string;
  name: string;
  layout_id: string;
  layout: Layout;
  description: string;
}

// Generated by https://quicktype.io

export interface ContentTypes {
  creator: Creator;
  content_type: IContentType;
}

export interface IContentType {
  updated_at: string;
  prefix: string;
  name: string;
  layout: Layout;
  inserted_at: string;
  id: string;
  flow: ContentTypeFlow;
  fields: Field[];
  decription: string;
  color: string;
}

export interface Field {
  name: string;
  id: string;
  field_type: FieldTypeClass;
}

export interface FieldInstance {
  name: string;
  id: string;
  field_type?: FieldTypeClass;
  value: string;
}

export interface FieldTypeClass {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
}

export interface ContentTypeFlow {
  states: State[];
  flow: FieldTypeClass;
}

export interface State {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

export interface ILayout {
  width: number;
  update_at: string;
  unit: string;
  slug_file: null;
  slug: string;
  screenshot: null;
  name: string;
  inserted_at: string;
  id: string;
  height: number;
  description: string;
}

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

// Data Templates

// Generated by https://quicktype.io

export interface DataTemplates {
  data_template: DataTemplate;
  creator: Creator;
  content_type: IContentType;
}

export interface BlockTemplates {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface DataTemplate {
  updated_at: string;
  title_template: string;
  title: string;
  inserted_at: string;
  id: string;
  data: string;
  serialized: any;
}

// Generated by https://quicktype.io

export interface Activity {
  total_pages: number;
  total_entries: number;
  page_number: number;
  activities: ActivityElement[];
}

export interface ActivityElement {
  object_details: ObjectDetails;
  object: string;
  meta: Meta;
  inserted_at: string;
  actor: string;
  action: Action;
}

export enum Action {
  Delete = 'delete',
  Insert = 'insert',
  Update = 'update',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Meta {}

export interface ObjectDetails {
  name: string;
  id?: string;
}

export interface ContentState {
  readonly doc?: string;
  readonly content?: any;
}
