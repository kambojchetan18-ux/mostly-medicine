const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch monorepo root so workspace packages resolve correctly
config.watchFolders = [monorepoRoot];

// Resolve modules from monorepo root node_modules first
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Ensure react-native field is preferred so workspace packages
// (e.g. @mostly-medicine/ai) use their mobile entry point instead
// of the Node.js entry point that imports @anthropic-ai/sdk.
config.resolver.resolverMainFields = ["react-native", "browser", "main", "module"];

module.exports = config;
