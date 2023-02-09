import { createContext, useState } from "react";

import PRODUCTS from "../shop-data.json";

export const ProductsContext = createContext({
  products: [],
});

export const ProductsProvider = ({ children }) => {
  // Create products state with default null, as defined in ProductsContext
  const [products, setProducts] = useState(PRODUCTS);
  // Create value variable consisting of the products and setter function
  // as defined in ProductsContext
  // so we can give it as the 'value' prop to the Provider Component
  const value = { products, setProducts };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
