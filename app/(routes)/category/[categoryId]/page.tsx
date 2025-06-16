import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";

import getProducts from "@/actions/get-products";
import getCategory from "@/actions/get-category";
import getSizes from "@/actions/get-sizes";
import getColors from "@/actions/get-colors";

import Filter from "./components/filter";
import MobileFilters from "./components/mobile-filters";

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ colorId?: string; sizeId?: string }> | undefined;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  // Await params to get categoryId
  const { categoryId } = await params;
  // Await searchParams to get colorId and sizeId, or use undefined if searchParams is undefined
  const { colorId, sizeId } = (await searchParams) ?? {
    colorId: undefined,
    sizeId: undefined,
  };

  const products = await getProducts({
    categoryId,
    ...(colorId && { colorId }),
    ...(sizeId && { sizeId }),
  });

  const [sizes, colors, category] = await Promise.all([
    getSizes(),
    getColors(),
    getCategory(categoryId),
  ]);

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category.billboard} />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters sizes={sizes} colors={colors} />
            <div className="hidden lg:block">
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
              <Filter valueKey="colorId" name="Colors" data={colors} />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
