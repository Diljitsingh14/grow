import { getReviews } from "@/utils/services/product";
import { useState, useEffect } from "react";
// import { getReviews } from "@/utils/services/review";

interface Review {
  id: number;
  user: { id: number; username: string };
  rating: number;
  content: string;
}

const Reviews = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  async function fetchReviews() {
    const { data } = await getReviews(`${productId}`);
    setReviews(data?.results);
  }
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews?.map((review) => (
          <div key={review.id} className="border-2 px-2 py-4">
            <p className="font-semibold">{review.user.username}</p>
            <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
            <p>{review.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
