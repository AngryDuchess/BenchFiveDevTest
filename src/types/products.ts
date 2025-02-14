interface Product {
    image: string;
    productName: string;
    description: string;
    price: string;
    sku: string;
    productType: ProductType;
    productSpecificValue: string;
    // isSelected: boolean;
    // onSelect: () => void;
}

type ProductType = "DVD" | "Book" | "Furniture"

export type {Product, ProductType}
  