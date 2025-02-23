import { IProduct } from "@/types/product";
import { fetchProductDetail } from "@/utils/services/turnx/forms";
import ProductDetailView from "@/views/ProductDetailView";
import { notFound } from "next/navigation";

const getProducts = async (id: number): Promise<IProduct | null> => {
  if (!id) return null;
  try {
    const { data }: { data: IProduct } = await fetchProductDetail(id);
    return data;
  } catch (error) {
    return null;
  }
};

interface IProductDetailPageProps {
  params: Promise<{ id: number }>;
}

export default async function ProductDetail({
  params,
}: IProductDetailPageProps) {
  const id: number = (await params).id;
  const productDetail = await getProducts(id);

  if (!productDetail) notFound();

  return <ProductDetailView {...{ productDetail }} />;
}
