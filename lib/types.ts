export type EducationLevel = "SLC" | "Intermediate" | "+2" | "Bachelors" | "Masters" | "PhD" | "Other";

export type ContributionCategory =
  | "Social Work"
  | "Infrastructure"
  | "Education"
  | "Healthcare"
  | "Environment"
  | "Governance"
  | "Youth"
  | "Other";

export type SourcePlatform =
  | "Wikipedia"
  | "LinkedIn"
  | "Twitter/X"
  | "Facebook"
  | "Nepal Election Commission"
  | "Parliament Website"
  | "News Article"
  | "Official Website"
  | "Other";

export type SocialPlatform =
  | "Website"
  | "Facebook"
  | "LinkedIn"
  | "Twitter/X"
  | "Instagram";

export interface Education {
  level: EducationLevel;
  degree?: string;
  institution?: string;
  country?: string;
}

export interface Constituency {
  name: string;
  district: string;
  province: string;
  provinceNumber: number;
}

export interface RunnerUp {
  name: string;
  party: string;
  votes: number;
}

export interface Contribution {
  title: string;
  description: string;
  category: ContributionCategory;
}

export interface Source {
  platform: SourcePlatform;
  url: string;
  label?: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface Manifesto {
  type: "party" | "individual";
  title: string;
  url: string;
  downloadUrl?: string;
  note?: string;
}

export interface Candidate {
  id: string;
  name: string;
  nameNepali?: string;
  photo?: string;
  dateOfBirth?: string;
  age?: number;
  gender: "Male" | "Female" | "Other";
  education: Education[];
  constituency: Constituency;
  electionType: "FPTP" | "PR";
  votesReceived?: number;
  totalValidVotes?: number;
  voteSharePercent?: number;
  runnerUp?: RunnerUp;
  winMargin?: number;
  winMarginPercent?: number;
  profession?: string;
  biography?: string;
  majorContributions: Contribution[];
  previousPositions?: string[];
  socials?: SocialLink[];
  phone?: string;
  manifesto?: Manifesto;
  sources: Source[];
  lastUpdated: string;
}

export interface CandidateFilters {
  query: string;
  provinces: string[];
  districts: string[];
  educationLevels: EducationLevel[];
  ageMin: number;
  ageMax: number;
  gender: string[];
  voteShareMin: number;
  voteShareMax: number;
  electionType: string[];
  winMarginMin: number;
  professionCategories: string[];
}

export type SortKey = "name" | "age" | "voteSharePercent" | "winMargin" | "constituency";
export type SortOrder = "asc" | "desc";
