/* eslint-disable @typescript-eslint/no-var-requires */
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        }
      }
    }
  },],
},
{
  test: /\.(png|jpe?g|gif|jp2|webp)$/,
  loader: 'file-loader',
});

module.exports = {
  module: {
    rules,
  },
  target: 'node',
  plugins: plugins,
  output: {
    publicPath: './../',
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};

