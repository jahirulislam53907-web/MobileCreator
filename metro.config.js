const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@react-native-async-storage/async-storage': require.resolve(
    '@react-native-async-storage/async-storage'
  ),
};

module.exports = config;
