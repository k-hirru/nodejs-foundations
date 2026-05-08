type Category = "electronics" | "clothing" | "food";

interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  inStock: boolean;
  description?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Iphone 16",
    price: 23213,
    category: "electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "RX 9060 xt 16gb",
    price: 24500,
    category: "electronics",
    inStock: true,
  },
  {
    id: 3,
    name: "Hotdog Pack",
    price: 200,
    category: "food",
    inStock: false,
  },
  {
    id: 4,
    name: "Bench Hoodie",
    price: 600,
    category: "clothing",
    inStock: true,
  },
  {
    id: 5,
    name: "Yum Burger",
    price: 60,
    category: "food",
    inStock: true,
  },
];

function getByCategory(products: Product[], cat: string): Product[] {
    return products.filter(p => p.category === cat);
}

function getAvailable(products: Product[]): Product[] {
    return products.filter(p => p.inStock !== false);
}

function getTotalValue(products: Product[]): number {
    let total = 0;
    for (const product of products) {
        if (product.inStock === true) {
            total += product.price;
        }
    }
    return total;
}

console.log("Search by category:\n", getByCategory(products, "electronics"));
console.log("Available products:\n", getAvailable(products));
console.log("Total amount of available items:\n", getTotalValue(products));