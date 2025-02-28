"use client";
import { useCallback, useMemo, useState } from "react";
import { useCart } from "@/utils/cart-provider";
import Image from "next/image";
import QuantityButton from "@/components/QuantityButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "@/types/product";
import Reviews from "@/components/ProductReviews";
// import Reviews from "@/components/ProductReview";
// import CartDrawer from "@/components/CartDrawer";

interface IProductDetailViewProps {
  productDetail: IProduct;
}

function ProductDetailView({ productDetail }: IProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(
    productDetail.images[0]?.image
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state, ...actions } = useCart();

  const isProductAddedToCart: boolean = useMemo(
    () => state.items.some(x => x.id == productDetail.id.toString()),
    [state.items, productDetail.id]
  )

  const initalValue: number = state.items.find(x => x.id == productDetail.id.toString())?.quantity ?? 1;

  const onIncrease = useCallback(() => actions.increaseQuantity(productDetail.id.toString()), [productDetail.id, actions]);
  const onDecrease = useCallback(() => actions.decreaseQuantity(productDetail.id.toString()), [productDetail.id, actions]);
  
  return (
    <section className="py-2 bg-white md:py-16 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 flex">
        {/* Left Side: Image Gallery */}
        <div className="lg:w-1/2 border-grey-200 border-2 rounded-lg py-4 px-2">
          <div className="relative max-w-md mx-auto">
            <Image
              className="w-full h-[350px] object-contain cursor-zoom-in"
              src={selectedImage}
              alt={productDetail.name}
              width={200}
              height={200}
            />
          </div>
          <div className="flex space-x-2 mt-4">
            {productDetail.images.map((img, index) => (
              <Image
                key={index}
                className={`w-20 h-20 object-cover border-2 cursor-pointer ${selectedImage === img.image
                  ? "border-orange-600"
                  : "border-gray-300"
                  }`}
                src={img.image}
                alt="Product Thumbnail"
                width={50}
                height={50}
                onClick={() => setSelectedImage(img.image)}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="lg:w-1/2 pl-8">
          <h1 className="text-xl font-bold">{productDetail.name}</h1>
          <p className="text-3xl text-orange-600 my-2">
            ${productDetail.price}
          </p>

          {/* Variants Section */}
          {productDetail.variants.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Variants</h3>
              <div className="flex gap-3">
                {productDetail.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="border px-3 py-1 rounded-md hover:bg-gray-200"
                  >
                    {variant.attribute_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Buttons */}
          <div className="flex gap-4 my-3">
            {
              isProductAddedToCart ? (
                <QuantityButton {...{ max: productDetail.quantity_available, initalValue, onIncrease, onDecrease }} />
              ) : (
                <button
                  className="bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center"
                  onClick={() => {
                    setIsCartOpen(true);
                    actions.addToCart({
                      id: productDetail.id.toString(),
                      name: productDetail.name,
                      price: Number(productDetail.price),
                      quantity: 1,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
                  Add to cart
                </button>
              )
            }

            <button className="text-orange-600 border border-orange-600 px-3 rounded-lg">
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>

          <p className="text-gray-500">{productDetail.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews productId={productDetail.id} />

      {/* Cart Drawer */}
      {/* {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />} */}
    </section>
  );
}

export default ProductDetailView;
