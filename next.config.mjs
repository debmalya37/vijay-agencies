/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Add ALL allowed image domains here
  images: {
    domains: [
      "res.cloudinary.com",
      "encrypted-tbn0.gstatic.com",
      "images.unsplash.com",
      "cdn.pixabay.com",
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com",
    ],
  },

  webpack(config) {
    // ✅ Ignore .map files from chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    });

    // Silence warnings
    config.ignoreWarnings = [{ module: /chrome-aws-lambda/ }];

    return config;
  },
};

export default nextConfig;
