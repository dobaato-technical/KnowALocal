export interface PrivacySection {
  id: string;
  title: string;
  description: string;
  content: string[];
}

export interface PrivacyPolicyData {
  lastUpdated: string;
  sections: PrivacySection[];
}
