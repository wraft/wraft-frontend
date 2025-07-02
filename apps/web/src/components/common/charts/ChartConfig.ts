export interface ChartConfigItem {
  label: string;
  color?: string;
}

export interface ChartConfig {
  [key: string]: ChartConfigItem;
}

export const defaultChartColors = [
  'var(--color-primary)',
  'var(--color-success)',
  'var(--color-secondary)',
  'var(--color-accent)',
  'var(--color-warning)',
  'var(--color-error)',
];

export const createChartConfig = (
  dataKeys: string[],
  customConfig?: Partial<ChartConfig>,
): ChartConfig => {
  const config: ChartConfig = {};

  dataKeys.forEach((key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: defaultChartColors[index % defaultChartColors.length],
      ...customConfig?.[key],
    };
  });

  return config;
};
