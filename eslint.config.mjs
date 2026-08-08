import nextConfig from "eslint-config-next/core-web-vitals";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    rules: {
      // React Compiler rules produce false positives on valid async-setState and
      // window.location patterns. Downgrade to warnings so the build is not blocked.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/incompatible-library": "warn",
    },
  },
];

export default config;
