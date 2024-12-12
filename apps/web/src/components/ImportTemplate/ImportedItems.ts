export interface ImportedItems {
  items: Struct[];
  message: string;
}

export interface Struct {
  title?: string;
  created_at: string;
  id: string;
  item_type: string;
  name?: string;
}
