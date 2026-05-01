export type ProducerProfileFormState = {
  profileImageUrl: string | null;
  description: string;
  tags: string[];
  sellsCategories: string[];
  phone: string;
  contactEmail: string;
  website: string;
  instagram: string;
  facebook: string;
};

export function emptyProducerProfileFormState(): ProducerProfileFormState {
  return {
    profileImageUrl: null,
    description: "",
    tags: [],
    sellsCategories: [],
    phone: "",
    contactEmail: "",
    website: "",
    instagram: "",
    facebook: "",
  };
}

export function profileStateFromProducteur(p: {
  profileImageUrl?: string | null;
  description?: string | null;
  tags?: string[];
  sellsCategories?: string[];
  phone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}): ProducerProfileFormState {
  return {
    profileImageUrl: p.profileImageUrl ?? null,
    description: p.description ?? "",
    tags: [...(p.tags ?? [])],
    sellsCategories: [...(p.sellsCategories ?? [])],
    phone: p.phone ?? "",
    contactEmail: p.contactEmail ?? "",
    website: p.website ?? "",
    instagram: p.instagram ?? "",
    facebook: p.facebook ?? "",
  };
}
