const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Les options typescript et eslint sans ignorer les erreurs
  // typescript: {
  //   // configurez vos options TypeScript ici si nécessaire, mais pas d'ignoreBuildErrors: true
  // },
  // eslint: {
  //   // configurez vos options ESLint ici si nécessaire, mais pas d'ignoreDuringBuilds: true
  // },
};

export default nextConfig;