export interface Variant {
  id: string;
  name: string;
  prefix: string;
  color?: string;
  type?: 'contract' | 'document';
}

export interface TemplateFilterState {
  selectedVariantIds: string[];
  variants: Variant[];
  isLoading: boolean;
}
