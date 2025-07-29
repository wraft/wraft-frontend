import { fetchAPI, postAPI, putAPI } from 'utils/models';

export interface IntegrationEvent {
  id: string;
  name: string;
  description: string;
}

export interface ConfigField {
  label: string;
  type: string;
  description: string;
  required: boolean;
  secret: boolean;
  value?: string | null;
}

export interface IntegrationConfig {
  [key: string]: ConfigField;
}

export interface Integration {
  id?: string;
  provider: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  enabled: boolean;
  integration_id: string | null;
  config_structure: IntegrationConfig;
  config?: Record<string, string>;
  available_events: IntegrationEvent[];
  selected_events: string[];
}

export interface IntegrationListResponse {
  data: Integration[];
  meta: {
    total_count: number;
    page_size: number;
    page: number;
  };
}

const INTEGRATION_ENDPOINTS = {
  integrations: 'integrations',
  configs: 'integration_configs',
};

/**
 * Integration Service - Handles all integration-related API operations
 */
export const integrationService = {
  /**
   * Get all integrations
   */
  getIntegrations: async (): Promise<Integration[]> => {
    return fetchAPI(INTEGRATION_ENDPOINTS.integrations) as Promise<
      Integration[]
    >;
  },

  /**
   * Get available integration configurations and categories
   */
  getConfigs: async (): Promise<Integration[]> => {
    return fetchAPI(INTEGRATION_ENDPOINTS.configs) as Promise<Integration[]>;
  },

  /**
   * Get unique categories from available integrations
   */
  getCategories: async (): Promise<string[]> => {
    const configs = await integrationService.getConfigs();
    const uniqueCategories = Array.from(
      new Set(configs.map((config) => config.category)),
    );
    return uniqueCategories;
  },

  /**
   * create an integration with initial configuration
   */
  createIntegration: async (
    name: string,
    provider: string,
    config: Record<string, string>,
    selectedEvents: string[] = [],
  ): Promise<Integration> => {
    return postAPI(INTEGRATION_ENDPOINTS.integrations, {
      provider,
      config,
      name,
      events: selectedEvents,
    }) as Promise<Integration>;
  },

  /**
   * Enable an integration
   */
  enableIntegration: async (id: string): Promise<void> => {
    return putAPI(
      `${INTEGRATION_ENDPOINTS.integrations}/${id}/enable`,
      {},
    ) as Promise<void>;
  },
  /**
   * Disable an integration
   */
  disableIntegration: async (id: string): Promise<void> => {
    return putAPI(
      `${INTEGRATION_ENDPOINTS.integrations}/${id}/disable`,
      {},
    ) as Promise<void>;
  },

  /**
   * Update integration configuration
   */
  updateConfig: async (
    id: string,
    config: Record<string, string>,
  ): Promise<Integration> => {
    return putAPI(`${INTEGRATION_ENDPOINTS.integrations}/${id}/config`, {
      config,
    }) as Promise<Integration>;
  },

  /**
   * Update integration events
   */
  updateEvents: async (id: string, events: string[]): Promise<Integration> => {
    return putAPI(`${INTEGRATION_ENDPOINTS.integrations}/${id}/events`, {
      events,
    }) as Promise<Integration>;
  },
};
