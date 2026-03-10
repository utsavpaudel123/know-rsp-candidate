import candidatesData from '@/data/candidates.json';
import { Candidate, CandidateFilters, EducationLevel, SortKey, SortOrder } from '@/lib/types';

export const candidates: Candidate[] = candidatesData as Candidate[];

// Education level hierarchy — used to determine a candidate's highest qualification
const EDUCATION_RANK: Record<EducationLevel, number> = {
  SLC: 0,
  Intermediate: 1,
  '+2': 2,
  Bachelors: 3,
  Masters: 4,
  PhD: 5,
  Other: 1,
};

function getHighestEducationLevel(education: Candidate['education']): EducationLevel | null {
  if (!education.length) return null;
  return education.reduce((h, e) =>
    EDUCATION_RANK[e.level] > EDUCATION_RANK[h.level] ? e : h
  ).level;
}

export const PROFESSION_CATEGORIES: { label: string; keywords: string[] }[] = [
  { label: 'Engineer', keywords: ['Engineer', 'Construction Manager'] },
  { label: 'Business / Entrepreneur', keywords: ['Business', 'Entrepreneur', 'Contractor'] },
  { label: 'Lawyer / Advocate', keywords: ['Lawyer', 'Advocate'] },
  { label: 'Medical / Health', keywords: ['Physician', 'Surgeon', 'Nurse', 'Health'] },
  { label: 'Academic / Educator', keywords: ['Academic', 'Teacher', 'Lecturer', 'Educator', 'Researcher', 'Economist', 'Scientist', 'Sociologist'] },
  { label: 'Journalist / Media', keywords: ['Journalist', 'Media', 'Rapper', 'Comedian', 'Actress'] },
  { label: 'Civil Society / Activist', keywords: ['Activist', 'Social Worker', 'Development Worker', 'Development Professional'] },
  { label: 'Police Officer', keywords: ['Police'] },
  { label: 'Diplomat / Policy', keywords: ['Diplomat', 'Policy'] },
];

export const ALL_DISTRICTS: string[] = [
  'Baglung', 'Baitadi', 'Banke', 'Bara', 'Bardiya',
  'Bhaktapur', 'Chitwan', 'Dadeldhura', 'Dang', 'Dhading',
  'Dhanusha', 'Dolakha', 'Gorkha', 'Gulmi', 'Jhapa',
  'Kailali', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu',
  'Kavrepalanchok', 'Lamjung', 'Lalitpur', 'Mahottari', 'Makwanpur',
  'Morang', 'Nawalparasi West', 'Nawalpur', 'Nuwakot', 'Okhaldhunga',
  'Palpa', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap',
  'Rautahat', 'Rupandehi', 'Saptari', 'Sarlahi', 'Sindhuli',
  'Sindhupalchok', 'Siraha', 'Sunsari', 'Surkhet', 'Syangja',
  'Tanahun', 'Udayapur',
];

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}

export function getDefaultFilters(): CandidateFilters {
  return {
    query: '',
    provinces: [],
    districts: [],
    educationLevels: [],
    ageMin: 0,
    ageMax: 120,
    gender: [],
    voteShareMin: 0,
    voteShareMax: 100,
    electionType: [],
    winMarginMin: 0,
    professionCategories: [],
  };
}

export function filterAndSortCandidates(
  candidateList: Candidate[],
  filters: CandidateFilters,
  sortKey: SortKey,
  sortOrder: SortOrder
): Candidate[] {
  let result = [...candidateList];

  // Text search
  if (filters.query.trim()) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.nameNepali ?? '').toLowerCase().includes(q) ||
        c.constituency.name.toLowerCase().includes(q) ||
        c.constituency.district.toLowerCase().includes(q) ||
        c.constituency.province.toLowerCase().includes(q) ||
        (c.profession ?? '').toLowerCase().includes(q)
    );
  }

  // Province filter
  if (filters.provinces.length > 0) {
    result = result.filter((c) =>
      filters.provinces.includes(c.constituency.province)
    );
  }

  // District filter
  if (filters.districts.length > 0) {
    result = result.filter((c) =>
      filters.districts.includes(c.constituency.district)
    );
  }

  // Election type filter
  if (filters.electionType.length > 0) {
    result = result.filter((c) => filters.electionType.includes(c.electionType));
  }

  // Gender filter
  if (filters.gender.length > 0) {
    result = result.filter((c) => filters.gender.includes(c.gender));
  }

  // Profession category filter
  if (filters.professionCategories.length > 0) {
    result = result.filter((c) => {
      if (!c.profession) return false;
      return filters.professionCategories.some((cat) => {
        const category = PROFESSION_CATEGORIES.find((pc) => pc.label === cat);
        if (!category) return false;
        return category.keywords.some((kw) =>
          c.profession!.toLowerCase().includes(kw.toLowerCase())
        );
      });
    });
  }

  // Education level filter — matches by HIGHEST qualification only.
  // A candidate with Masters won't appear when filtering for SLC.
  if (filters.educationLevels.length > 0) {
    result = result.filter((c) => {
      const highest = getHighestEducationLevel(c.education);
      return highest ? filters.educationLevels.includes(highest) : false;
    });
  }

  // Age range filter
  if (filters.ageMin > 0 || filters.ageMax < 120) {
    result = result.filter((c) => {
      if (c.age == null) return true;
      return c.age >= filters.ageMin && c.age <= filters.ageMax;
    });
  }

  // Vote share filter
  if (filters.voteShareMin > 0 || filters.voteShareMax < 100) {
    result = result.filter((c) => {
      if (c.voteSharePercent == null) return true;
      return (
        c.voteSharePercent >= filters.voteShareMin &&
        c.voteSharePercent <= filters.voteShareMax
      );
    });
  }

  // Win margin filter
  if (filters.winMarginMin > 0) {
    result = result.filter((c) => {
      if (c.winMargin == null) return true;
      return c.winMargin >= filters.winMarginMin;
    });
  }

  // Sorting
  result.sort((a, b) => {
    let aVal: string | number | undefined;
    let bVal: string | number | undefined;

    switch (sortKey) {
      case 'name':
        aVal = a.name;
        bVal = b.name;
        break;
      case 'age':
        aVal = a.age;
        bVal = b.age;
        break;
      case 'voteSharePercent':
        aVal = a.voteSharePercent;
        bVal = b.voteSharePercent;
        break;
      case 'winMargin':
        aVal = a.winMargin;
        bVal = b.winMargin;
        break;
      case 'constituency':
        aVal = a.constituency.name;
        bVal = b.constituency.name;
        break;
    }

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const cmp = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? cmp : -cmp;
    }

    const cmp = (aVal as number) - (bVal as number);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}
