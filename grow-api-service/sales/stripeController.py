import environ
import stripe

env = environ.Env()
environ.Env.read_env('.env.local')

STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')
STRIPE_PUB_KEY = env('STRIPE_PUBLISH_KEY')

stripe.api_key = STRIPE_SECRET_KEY


def create_stripe_product(product, request):
    stripe_product = stripe.Product.create(
        name=product.name,
        description=product.description,
        # Full URL to the product image
        images=[request.build_absolute_uri(product.image.url)],
        metadata={
            'product_id': product.product_id,
            'label': product.label
        }
    )


def delete_all_stripe_products():
    try:
        # Retrieve all products from Stripe
        products = stripe.Product.list(limit=100)
        print(products)

        while products.has_more:
            # Retrieve all prices associated with the product
            prices = stripe.Price.list(product=product['id'], limit=100)

            # Delete each price associated with the product
            for price in prices['data']:
                stripe.Price.pop()
                print(
                    f"Deleted price {price['id']} for product {product['id']}")

                # Delete the product after its prices have been deleted
                stripe.Product.delete(product['id'])
                print(f"Deleted product {product['id']}")

            # Iterate over each product and delete it
            for product in products['data']:
                stripe.Product.delete(product['id'])
                print(f"Deleted product {product['id']}")

            # Fetch the next page of products
            products = stripe.Product.list(
                limit=100, starting_after=products['data'][-1]['id'])

        # Delete the remaining products
        for product in products['data']:
            stripe.Product.delete(product['id'])
            print(f"Deleted product {product['id']}")

        return "All products have been deleted."

    except stripe.error.StripeError as e:
        return f"An error occurred: {e}"
