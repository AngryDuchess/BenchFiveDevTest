interface Product {
    id: string;
    image: string;
    productName: string;
    description: string;
    price: string;
    sku: string;
    productType: ProductType;
    productSpecificValue: string;
    createdAt: string;
}

type ProductType = "DVD" | "Book" | "Furniture"

export type {Product, ProductType}
  