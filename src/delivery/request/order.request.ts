import { ProductType } from "../enum/product-type.enum";

export class OrderRequest {
    products: {type: ProductType, count: number}[];

    orderDate: string;
}