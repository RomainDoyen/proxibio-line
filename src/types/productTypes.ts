export type ProducteurType = {
  id: number;
  name: string;
  nameEnterprise: string;
  address: string;
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