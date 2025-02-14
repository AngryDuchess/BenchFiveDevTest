import dvdone from "./assets/dvd-poster-1.jpg";
import bookImage from "./assets/book-1.jpg";
import furnitureImage from "./assets/furniture-1.jpg";

interface Product {
  image: string;
  productName: string;
  description: string;
  price: string;
  sku: string;
  productType: 'DVD' | 'Book' | 'Furniture';
  productSpecificValue: string;
}

export const products: Product[] = [
  {
    image: dvdone,
    productName: 'Awesome DVD',
    description: 'A great DVD with lots of content.',
    price: '$19.99',
    sku: 'DVD123',
    productType: 'DVD',
    productSpecificValue: '700 MB'
  },
  {
    image: bookImage,
    productName: 'Interesting Book',
    description: 'A book full of interesting content.',
    price: '$9.99',
    sku: 'BOOK123',
    productType: 'Book',
    productSpecificValue: '1.5 Kg'
  },
  {
    image: furnitureImage,
    productName: 'Comfortable Chair',
    description: 'A very comfortable chair.',
    price: '$49.99',
    sku: 'FURN123',
    productType: 'Furniture',
    productSpecificValue: '120 x 60 x 60 cm'
  },
  {
    image: dvdone,
    productName: 'Awesome DVD',
    description: 'A great DVD with lots of content.',
    price: '$19.99',
    sku: 'DVD123',
    productType: 'DVD',
    productSpecificValue: '700 MB'
  },
  {
    image: dvdone,
    productName: 'Awesome DVD',
    description: 'A great DVD with lots of content.',
    price: '$19.99',
    sku: 'DVD123',
    productType: 'DVD',
    productSpecificValue: '700 MB'
  },
  {
    image: dvdone,
    productName: 'Awesome DVD',
    description: 'A great DVD with lots of content.',
    price: '$19.99',
    sku: 'DVD123',
    productType: 'DVD',
    productSpecificValue: '700 MB'
  },
  {
    image: dvdone,
    productName: 'Awesome DVD',
    description: 'A great DVD with lots of content.',
    price: '$19.99',
    sku: 'DVD123',
    productType: 'DVD',
    productSpecificValue: '700 MB'
  },
  {
    image: dvdone,
    productName: 'Awesome DVD',
    description: 'A great DVD with lots of content.',
    price: '$19.99',
    sku: 'DVD123',
    productType: 'DVD',
    productSpecificValue: '700 MB'
  },
  {
    image: dvdone,
    productName: 'Awesome DVD',
    description: 'A great DVD with lots of content.',
    price: '$19.99',
    sku: 'DVD123',
    productType: 'DVD',
    productSpecificValue: '700 MB'
  },
];