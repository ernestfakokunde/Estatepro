export type UserRole = 'USER' | 'AGENT' | 'ADMIN';
export type PropertyType = 'RENT' | 'SALE';
export type PropertyCategory = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'LAND' | 'COMMERCIAL' | 'DUPLEX';
export type PropertyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PropertyImage = { id?: string; url: string; publicId: string; alt: string; position?: number };
export type PropertyAgent = { id: string; name: string; phone?: string | null; avatarUrl?: string | null };
export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  type: PropertyType;
  category: PropertyCategory;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | string;
  address: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  status: PropertyStatus;
  features: string[];
  images: PropertyImage[];
  agent: PropertyAgent;
  createdAt: string;
  updatedAt: string;
};

export type PropertyFilters = {
  q?: string;
  type?: PropertyType | '';
  category?: PropertyCategory | '';
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  page?: number;
};
