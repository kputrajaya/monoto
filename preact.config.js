import Dotenv from 'dotenv-webpack';

export default {
  webpack (config) {
    config.plugins.push(new Dotenv());
  },
};
