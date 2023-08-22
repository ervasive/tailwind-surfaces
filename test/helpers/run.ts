import { resolve } from 'path';
import tailwind, { Config } from 'tailwindcss';
import postcss from 'postcss';
import surfaces, { PluginOptions } from '../../src';

export async function run({
  contents,
  options,
  testId,
  config,
  layers = ['components'],
}: {
  contents: string;
  options: PluginOptions;
  testId: string;
  config?: Config;
  layers?: ('base' | 'components' | 'utilities')[];
}) {
  const defaultConfig: Config = config
    ? {
        ...config,
        content: { ...config.content, files: [{ raw: contents }] },
        plugins: [...(config.plugins || []), surfaces(options)],
      }
    : {
        content: {
          files: [{ raw: contents }],
        },
        plugins: [surfaces(options)],
      };

  return await postcss([tailwind(defaultConfig)]).process(
    layers.map((l) => `@tailwind ${l};`).join('\n'),
    {
      from: `${resolve(__filename)}?test=${testId}`,
    },
  );
}
