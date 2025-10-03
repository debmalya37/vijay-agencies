/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['res.cloudinary.com'], // Add your Cloudinary domain here
    },
    webpack(config) {
      // ✅ Ignore .map files from chrome-aws-lambda
      config.module.rules.push({
        test: /\.map$/,
        use: 'ignore-loader',
      });
  
      // Optional: silence warnings from chrome-aws-lambda sourcemaps
      config.ignoreWarnings = [{ module: /chrome-aws-lambda/ }];
  
      return config;
    },
  };
  
  export default nextConfig;
  