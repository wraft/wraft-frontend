import {
  VendorForm,
  VendorResponse,
  VendorListResponse,
  VendorSearch,
  VendorContact,
  VendorContactResponse,
  VendorContactListResponse,
} from 'schemas/vendor';
import { fetchAPI, postAPI, putAPI, deleteAPI } from 'utils/models';

const VENDOR_ENDPOINTS = {
  vendors: 'vendors',
  vendorContacts: (vendorId: string) => `vendors/${vendorId}/contacts`,
};

/**
 * Vendor Service - Handles all vendor-related API operations
 */
export const vendorService = {
  /**
   * Get all vendors with pagination and search
   */
  getVendors: async (
    page: number = 1,
    search?: VendorSearch,
  ): Promise<VendorListResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('page_size', '20'); // Default page size

    if (search?.query) {
      queryParams.append('query', search.query);
    }
    if (search?.city) {
      queryParams.append('city', search.city);
    }
    if (search?.country) {
      queryParams.append('country', search.country);
    }
    if (search?.has_contacts !== undefined) {
      queryParams.append('has_contacts', search.has_contacts.toString());
    }
    if (search?.created_after) {
      queryParams.append('created_after', search.created_after);
    }
    if (search?.created_before) {
      queryParams.append('created_before', search.created_before);
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI(
      `${VENDOR_ENDPOINTS.vendors}${query}`,
    ) as Promise<VendorListResponse>;
  },

  /**
   * Get a single vendor by ID
   */
  getVendor: async (id: string): Promise<VendorResponse> => {
    return fetchAPI(
      `${VENDOR_ENDPOINTS.vendors}/${id}`,
    ) as Promise<VendorResponse>;
  },

  /**
   * Create a new vendor
   */
  createVendor: async (vendorData: VendorForm): Promise<VendorResponse> => {
    return postAPI(
      VENDOR_ENDPOINTS.vendors,
      vendorData,
    ) as Promise<VendorResponse>;
  },

  /**
   * Update an existing vendor
   */
  updateVendor: async (
    id: string,
    vendorData: Partial<VendorForm>,
  ): Promise<VendorResponse> => {
    return putAPI(
      `${VENDOR_ENDPOINTS.vendors}/${id}`,
      vendorData,
    ) as Promise<VendorResponse>;
  },

  /**
   * Delete a vendor
   */
  deleteVendor: async (id: string): Promise<void> => {
    return deleteAPI(`${VENDOR_ENDPOINTS.vendors}/${id}`) as Promise<void>;
  },

  /**
   * Upload vendor logo
   */
  uploadLogo: async (
    id: string,
    logoFile: File,
  ): Promise<{ logo_url: string }> => {
    const formData = new FormData();
    formData.append('logo', logoFile);

    console.log(
      'Uploading logo to endpoint:',
      `${VENDOR_ENDPOINTS.vendors}/${id}/logo`,
    );
    console.log('FormData contents:', formData);
    console.log('File details:', {
      name: logoFile.name,
      size: logoFile.size,
      type: logoFile.type,
    });

    return postAPI(
      `${VENDOR_ENDPOINTS.vendors}/${id}/logo`,
      formData,
    ) as Promise<{ logo_url: string }>;
  },

  /**
   * Export vendors to CSV/Excel
   */
  exportVendors: async (search?: VendorSearch): Promise<Blob> => {
    const queryParams = new URLSearchParams();

    if (search?.query) {
      queryParams.append('query', search.query);
    }
    if (search?.city) {
      queryParams.append('city', search.city);
    }
    if (search?.country) {
      queryParams.append('country', search.country);
    }
    if (search?.has_contacts !== undefined) {
      queryParams.append('has_contacts', search.has_contacts.toString());
    }
    if (search?.created_after) {
      queryParams.append('created_after', search.created_after);
    }
    if (search?.created_before) {
      queryParams.append('created_before', search.created_before);
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/${VENDOR_ENDPOINTS.vendors}/export${query}`,
      {
        headers: {
          Authorization: `Bearer ${document.cookie.split('token=')[1]?.split(';')[0] || ''}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to export vendors');
    }

    return response.blob();
  },
};

/**
 * Vendor Contact Service - Handles all vendor contact-related API operations
 */
export const vendorContactService = {
  /**
   * Get all contacts for a vendor
   */
  getVendorContacts: async (
    vendorId: string,
    page: number = 1,
  ): Promise<VendorContactListResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('page_size', '20');

    const query = `?${queryParams.toString()}`;
    return fetchAPI(
      `${VENDOR_ENDPOINTS.vendorContacts(vendorId)}${query}`,
    ) as Promise<VendorContactListResponse>;
  },

  /**
   * Get a single contact by ID
   */
  getVendorContact: async (
    vendorId: string,
    contactId: string,
  ): Promise<VendorContactResponse> => {
    return fetchAPI(
      `${VENDOR_ENDPOINTS.vendorContacts(vendorId)}/${contactId}`,
    ) as Promise<VendorContactResponse>;
  },

  /**
   * Create a new contact for a vendor
   */
  createVendorContact: async (
    vendorId: string,
    contactData: VendorContact,
  ): Promise<VendorContactResponse> => {
    return postAPI(
      VENDOR_ENDPOINTS.vendorContacts(vendorId),
      contactData,
    ) as Promise<VendorContactResponse>;
  },

  /**
   * Update an existing contact
   */
  updateVendorContact: async (
    vendorId: string,
    contactId: string,
    contactData: Partial<VendorContact>,
  ): Promise<VendorContactResponse> => {
    return putAPI(
      `${VENDOR_ENDPOINTS.vendorContacts(vendorId)}/${contactId}`,
      contactData,
    ) as Promise<VendorContactResponse>;
  },

  /**
   * Delete a contact
   */
  deleteVendorContact: async (
    vendorId: string,
    contactId: string,
  ): Promise<void> => {
    return deleteAPI(
      `${VENDOR_ENDPOINTS.vendorContacts(vendorId)}/${contactId}`,
    ) as Promise<void>;
  },
};

/**
 * Vendor Dashboard Service - Handles dashboard statistics
 */
export const vendorDashboardService = {
  /**
   * Get vendor dashboard statistics
   */
  getDashboardStats: async (): Promise<{
    total_vendors: number;
    active_vendors: number;
    recent_additions: number;
    vendors_with_contacts: number;
    total_documents: number;
    pending_approvals: number;
    total_contract_value: number;
    top_vendors: Array<{
      id: string;
      name: string;
      contacts_count: number;
      logo_url?: string;
    }>;
    recent_vendors: Array<{
      id: string;
      name: string;
      created_at: string;
      logo_url?: string;
    }>;
    vendors_by_country: Array<{
      country: string;
      count: number;
    }>;
  }> => {
    return fetchAPI(`${VENDOR_ENDPOINTS.vendors}/stats`) as Promise<{
      total_vendors: number;
      active_vendors: number;
      recent_additions: number;
      vendors_with_contacts: number;
      total_documents: number;
      pending_approvals: number;
      total_contract_value: number;
      top_vendors: Array<{
        id: string;
        name: string;
        contacts_count: number;
        logo_url?: string;
      }>;
      recent_vendors: Array<{
        id: string;
        name: string;
        created_at: string;
        logo_url?: string;
      }>;
      vendors_by_country: Array<{
        country: string;
        count: number;
      }>;
    }>;
  },

  /**
   * Get recent vendor activities
   */
  getRecentActivities: async (): Promise<
    Array<{
      id: string;
      vendor_name: string;
      action: string;
      timestamp: string;
    }>
  > => {
    return fetchAPI(`${VENDOR_ENDPOINTS.vendors}/activities`) as Promise<
      Array<{
        id: string;
        vendor_name: string;
        action: string;
        timestamp: string;
      }>
    >;
  },
};
