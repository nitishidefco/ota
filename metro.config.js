const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

module.exports = (async () => {
  // Get default config
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: {assetExts, sourceExts},
  } = defaultConfig;

  // Define custom config
  const customConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };

  // Merge default and custom config
  return mergeConfig(defaultConfig, customConfig);
})();
