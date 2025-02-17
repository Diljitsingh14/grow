import Features from "@/views/Features";
import Products from "../Products";
import Services from "../Services";

const HomeView: React.FC = () => {

  return (
    <>
      <Features />
      <Products id="products" />
      <Services />
    </>
  );
};

export default HomeView;
