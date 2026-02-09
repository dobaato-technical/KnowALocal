export interface Clause {
  heading: string;
  content: string;
}

export interface TCSection {
  id: string;
  title: string;
  description: string;
  clauses: Clause[];
}

export interface TCData {
  lastUpdated: string;
  sections: TCSection[];
}
