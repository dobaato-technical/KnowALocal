export interface Specialty {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: string;
}

export interface SpecialtiesSectionProps {
  specialties: Specialty[];
}
