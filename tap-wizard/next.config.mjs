/** @type {import('next').NextConfig} */
const hosturl = process.env.NEXT_PUBLIC_HOST || "localhost";
const nextConfig = {
  // Add your other configurations here if any
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      hosturl.replace("http://"),
      "127.0.0.1",
    ],
  },
};

export default nextConfig;
