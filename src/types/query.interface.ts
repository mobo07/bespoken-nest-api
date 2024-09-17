import { ProductType } from 'src/products/enums/product-type.enum';

export interface QueryFilter {
  type: ProductType;
  customizable: 'true' | 'false';
  page: number;
  resPerPage?: number;
}
