import type { StorybookConfig } from "@storybook/react-vite";
import react from "@vitejs/plugin-react";

import { dirname, join, resolve } from "path";

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/ui/src/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-docs",

    // getAbsolutePath("@storybook/addon-links"),
    // getAbsolutePath("@storybook/addon-essentials"),
    // getAbsolutePath("@storybook/addon-onboarding"),
    // getAbsolutePath("@storybook/addon-interactions"),
    // getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: true,
  },
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    return {
      ...config,
      define: { "process.env": {} },
      resolve: {
        alias: [
          {
            find: "ui",
            replacement: resolve(__dirname, "../../../packages/ui/"),
          },
          {
            find: "@",
            replacement: resolve(__dirname, "../../../packages/ui/src"),
          },
        ],
      },
    };
  },
};

export default config;
