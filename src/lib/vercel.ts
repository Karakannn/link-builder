

interface VercelDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string;
  redirectStatusCode?: number;
  gitBranch?: string;
  updatedAt?: number;
  createdAt?: number;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

interface VercelApiError {
  error: {
    code: string;
    message: string;
  };
}

class VercelAPI {
  private baseUrl = 'https://api.vercel.com';
  private accessToken: string;
  private teamId?: string;
  private projectId: string;

  constructor() {
    this.accessToken = process.env.VERCEL_ACCESS_TOKEN!;
    this.teamId = process.env.VERCEL_TEAM_ID;
    this.projectId = process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!;
    
    if (!this.accessToken) {
      throw new Error('VERCEL_ACCESS_TOKEN is required');
    }
    if (!this.projectId) {
      throw new Error('NEXT_PUBLIC_VERCEL_PROJECT_ID is required');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.teamId) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('teamId', this.teamId);
      return fetch(urlObj.toString(), { ...options, headers });
    }

    return fetch(url, { ...options, headers });
  }

  async addDomain(domain: string): Promise<{ success: boolean; data?: VercelDomainResponse; error?: string }> {
    try {
      const response = await this.request(`/v9/projects/${this.projectId}/domains`, {
        method: 'POST',
        body: JSON.stringify({ name: domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data as VercelApiError;
        return { 
          success: false, 
          error: error.error?.message || 'Failed to add domain to Vercel' 
        };
      }

      return { success: true, data: data as VercelDomainResponse };
    } catch (error) {
      console.error('Vercel API Error:', error);
      return { 
        success: false, 
        error: 'Network error while adding domain to Vercel' 
      };
    }
  }

  async removeDomain(domain: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.request(`/v9/projects/${this.projectId}/domains/${domain}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json() as VercelApiError;
        return { 
          success: false, 
          error: data.error?.message || 'Failed to remove domain from Vercel' 
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Vercel API Error:', error);
      return { 
        success: false, 
        error: 'Network error while removing domain from Vercel' 
      };
    }
  }

  async getDomainInfo(domain: string): Promise<{ success: boolean; data?: VercelDomainResponse; error?: string }> {
    try {
      const response = await this.request(`/v9/projects/${this.projectId}/domains/${domain}`);
      
      if (!response.ok) {
        const data = await response.json() as VercelApiError;
        return { 
          success: false, 
          error: data.error?.message || 'Domain not found in Vercel' 
        };
      }

      const data = await response.json();
      return { success: true, data: data as VercelDomainResponse };
    } catch (error) {
      console.error('Vercel API Error:', error);
      return { 
        success: false, 
        error: 'Network error while fetching domain info from Vercel' 
      };
    }
  }

  async checkDomainVerification(domain: string): Promise<{ success: boolean; isVerified?: boolean; verification?: any; error?: string }> {
    try {
      const domainInfo = await this.getDomainInfo(domain);
      
      if (!domainInfo.success || !domainInfo.data) {
        return { success: false, error: domainInfo.error };
      }

      // Check if domain has verification challenges
      const verification = domainInfo.data.verification;
      const isVerified = !verification || verification.length === 0;

      return { 
        success: true, 
        isVerified,
        verification: verification || []
      };
    } catch (error) {
      console.error('Vercel verification check error:', error);
      return { 
        success: false, 
        error: 'Error checking domain verification status' 
      };
    }
  }

  getCnameTarget(): string {
    return process.env.NEXT_PUBLIC_CUSTOM_DOMAIN_TARGET || 'cname.vercel-dns.com';
  }

  getARecord(): string {
    // Vercel's default A record IP (bu dynamic olarak alınabilir)
    return '76.76.21.21';
  }
}

export const vercelAPI = new VercelAPI();