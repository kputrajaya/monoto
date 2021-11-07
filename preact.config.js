import Dotenv from 'dotenv-webpack';

export default {
  webpack(config) {
    config.plugins.push(
      new Dotenv({
        safe: true,
        systemvars: true,
      })
    );
    Object.assign(config.resolve.alias, {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    });
  },
};
