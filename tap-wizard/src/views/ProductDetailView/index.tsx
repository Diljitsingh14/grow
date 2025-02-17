import Image from "next/image";
import QuantityButton from "@/components/QuantityButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";

export interface IProductVariantData {
  id: number;
  attribute_name: string;
  attribute_value: string;
  additional_price: string;
  quantity_available: number;
}

type ProductTypes = "product" | "service";

export interface IProductDetail {
  id: number;
  variants: IProductVariantData[];
  name: string;
  description: string;
  type: ProductTypes;
  price: number;
  is_template_type: boolean;
  image: URL;
  quantity_available: number;
  is_featured: boolean;
  template?: unknown;
}

interface IProductDetailViewProps {
  productDetail: IProductDetail
}

function ProductDetailView({ productDetail }: IProductDetailViewProps) {
  return (
    <section className="py-2 bg-white md:py-16 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <Image
              className="w-full hidden dark:block"
              src={productDetail.image.toString()}
              alt=""
              width={150}
              height={150}
            />
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1
              className="text-xl text-dark"
            >
              {productDetail.name}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p
                className="text-3xl text-orange-600 sm:text-3xl"
              >
                {productDetail.price} $
              </p>
            </div>

            <div className="flex my-3 gap-4">
              <QuantityButton max={productDetail.quantity_available} />
              <button
                className="bg-orange-600 text-white sm:mt-0 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 rounded-lg px-5 py-2.5 focus:outline-none flex items-center justify-center"
                role="button"
              >
                <FontAwesomeIcon icon={faCartShopping} className="me-1" />
                Add to cart
              </button>

              <button className="text-orange-600 border border-orange-600 rounded-lg px-3 flex items-center justify-center">
                {/* <FavIcon /> */}
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-gray-500 dark:text-gray-400">
            {productDetail.description}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailView