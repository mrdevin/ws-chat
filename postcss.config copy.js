module.exports = {
    plugins: [
      require('autoprefixer')({ grid: 'autoplace'}),
      require("postcss-gap-properties")
    ],
    map: { inline: false }
  };
