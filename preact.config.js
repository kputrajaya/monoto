import CopyWebpackPlugin from 'copy-webpack-plugin';

export default (config) => {
  const copyPublic = new CopyWebpackPlugin({
    patterns: [
      {context: `${__dirname}/src/public`, from: '*.*'}
    ]
  });
  config.plugins.push(copyPublic);
};
