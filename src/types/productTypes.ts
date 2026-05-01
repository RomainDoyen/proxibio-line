export type ContributionStatus = "APPROVED" | "PENDING" | "REJECTED";

export type ProducteurType = {
  id: number;
  name: string;
  nameEnterprise: string;
  address: string;
  status?: ContributionStatus;
  profileImageUrl?: string | null;
  description?: string | null;
  tags?: string[];
  sellsCategories?: string[];
  phone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  createdAt: Date;
  updatedAt: Date;
  positionProducteur: PositionProducteurType[];
};

export type PositionProducteurType = {
  id: number;
  producteurId: number;
  latitude: number;
  longitude: number;
  marker: string;
  producteur: ProducteurType;
};