export interface IProductVariant {
  id: number;
  attribute_name: string;
  attribute_value: string;
  additional_price: string;
  image: string;
  quantity_available: number;
  product: number;
}

export interface IProductImage {
  id: number;
  image: string;
  alt: string;
}

export interface IProduct {
  id: number;
  variants: IProductVariant[];
  images: IProductImage[];
  currency: string | null;
  subcategory: string | null;
  name: string;
  description: string;
  type: string;
  price: string;
  is_template_type: boolean;
  quantity_available: number;
  is_featured: boolean;
  template: string | null;
  return_policy: any[]; // Adjust type if return_policy has a specific structure
}
