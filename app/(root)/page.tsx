import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/action/product.action";

const HomePage = async () => {
  const latestProduct=await getLatestProducts()
  return (
    <div className='space-y-8'>
      
      <ProductList title='Newest Arrivals' data={latestProduct}  />
    </div>
  );
};
export default HomePage;