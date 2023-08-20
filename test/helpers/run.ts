import { resolve } from "path";
import tailwind, { Config } from "tailwindcss";
import postcss from "postcss";
import surfaces from "../../src";

export async function run(contents: string, testId: string, config?: Config) {
  const defaultConfig: Config = config
    ? {
        ...config,
        content: { ...config.content, files: [{ raw: contents }] },
        plugins: [...(config.plugins || []), surfaces],
      }
    : {
        content: {
          files: [{ raw: contents }],
        },
        plugins: [surfaces],
      };

  return await postcss([tailwind(defaultConfig)]).process(
    ["@tailwind components;"].join("\n"),
    {
      from: `${resolve(__filename)}?test=${testId}`,
    },
  );
}
