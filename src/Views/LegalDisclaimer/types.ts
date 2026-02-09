export interface DisclaimerSection {
  id: string;
  title: string;
  description: string;
  content: string[];
}

export interface LegalDisclaimerData {
  lastUpdated: string;
  sections: DisclaimerSection[];
}
