export const propertyTypes = ['SALE', 'RENT'] as const;
export const propertyCategories = ['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'DUPLEX'] as const;
export const propertyStatuses = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export const listingPageSize = 9;

export const categoryLabels: Record<(typeof propertyCategories)[number], string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  LAND: 'Land',
  COMMERCIAL: 'Commercial',
  DUPLEX: 'Duplex',
};
