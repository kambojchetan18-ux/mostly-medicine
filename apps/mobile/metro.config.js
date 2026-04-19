const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

config.resolver.resolverMainFields = ["react-native", "browser", "main", "module"];

config.resolver.extraNodeModules = {
  react: path.resolve(monorepoRoot, "node_modules/react"),
  "react-native": path.resolve(monorepoRoot, "node_modules/react-native"),
  "react-dom": path.resolve(monorepoRoot, "node_modules/react-dom"),
  scheduler: path.resolve(monorepoRoot, "node_modules/scheduler"),
  "react-is": path.resolve(monorepoRoot, "node_modules/react-is"),
};

module.exports = config;
