import ProductList from "@/components/product-list";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Container from "@/components/ui/container";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  // Await params to get productId
  const { productId } = await params;
  const product = await getProduct(productId);
  const suggestedProducts = await getProducts({
    categoryId: product?.category?.id,
  });

  if (!product) {
    return null;
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.variations.flatMap((v) => v.images)} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={product} />
            </div>
          </div>
          {product.description && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
          )}
          <hr className="my-10" />
          <ProductList title="Related Items" items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
