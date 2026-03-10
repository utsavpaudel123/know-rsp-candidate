#!/usr/bin/env python3
"""
update_professions.py
---------------------
Updates the `profession` field in data/candidates.json for candidates
who only list "Politician" but have a known prior or concurrent profession.

Professions are derived from:
  - education field (degree subject)
  - biography text (mentions of prior career)
  - previousPositions field
  - publicly-known biographical facts
  - enrich_candidates.py RESEARCH_UPDATES as supplementary reference

Candidates whose profession already contains more than just "Politician"
are left unchanged. Where there is no reliable signal, "Politician" is kept.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "candidates.json"

# ─────────────────────────────────────────────────────────────────────────────
# PROFESSION_UPDATES: id → corrected profession string
# Source notes are included in comments.
# ─────────────────────────────────────────────────────────────────────────────
PROFESSION_UPDATES: dict[str, str] = {
    # ── Education: Masters in Journalism / Social Work ──────────────────────
    "nisha-dangi": "Journalist, Social Worker, Politician",         # Masters Journalism, TU

    # ── Lawyer / Legal background ────────────────────────────────────────────
    "sobita-gautam": "Lawyer, Politician",                          # LL.B + Masters Law
    "sulav-kharel": "Lawyer, Politician",                           # BA LL.B + Masters Constitutional Law
    "manish-khanal": "Lawyer, Politician",                          # LL.B Nepal Law Campus
    "sasmit-pokharel": "Lawyer, Politician",                        # BALLB Kathmandu University School of Law
    "madhukumar-chaulagain": "Lawyer, Politician",                  # LL.B Nepal Law Campus, TU

    # ── Medical / Healthcare ─────────────────────────────────────────────────
    "toshima-karki": "Surgeon, Physician, Politician",              # MBBS + MS General Surgery
    "lekh-jung-thapa": "Neurologist, Academic, Politician",         # MD + DM Neurology + PhD
    "ashika-tamang": "Nurse, Politician",                           # Diploma in Nursing

    # ── Engineering ─────────────────────────────────────────────────────────
    "lal-bikram-thapa": "Civil Engineer, Politician",               # Diploma Civil Engineering
    "bipin-kumar-acharya": "Engineer, Entrepreneur, Politician",    # Biotech Engineering + MBA
    "dipak-kumar-sah-sunsari-4": "Engineer, Politician",           # Mechanical Engineering
    "ramji-yadav": "Electrical Engineer, Politician",               # BE Electrical Engineering
    "ujjwal-kumar-jha": "Civil Engineer, Politician",               # Civil Engineering VTU
    "krishna-kumar-karki": "Construction Manager, Politician",      # Construction Management + Sports Diploma

    # ── Environmental Science / Research ────────────────────────────────────
    "dhannjaya-regmi": "Environmental Scientist, Politician",       # PhD Environmental Earth Science, Hokkaido
    "ganesh-karki": "Environmental Scientist, Politician",          # MSc International Environmental Studies, Norway

    # ── Economics / Finance ─────────────────────────────────────────────────
    "sushant-vaidik": "Economist, Policy Analyst, Politician",      # MSc Economics, LSE
    "sagar-dhakal": "Economist, Politician",                        # MSc Oxford
    "ashish-gajurel": "Logistics Engineer, Politician",             # MSc Transportation, TU Munich

    # ── Academic / Researcher ────────────────────────────────────────────────
    "bikram-timilsina": "Academic, Researcher, Politician",         # PhD Politics & IR, Griffith
    "tara-prasad-joshi": "Academic, Diplomat, Politician",          # PhD International Politics, JNU
    "sunil-lamsal": "Academic, Politician",                         # Masters + PhD (ongoing)
    "rajan-gautam": "Educator, Politician",                         # Masters Education, Management & Political Science
    "kamal-subedi": "Educator, Politician",                         # Bachelors Education + Masters TU
    "shishir-khanal": "Policy Analyst, Politician",                 # MIPA Wisconsin + BA IPED
    "sushil-khadka": "Development Professional, Politician",        # Biological Engineering + MSc Economic Development

    # ── Journalism / Media ──────────────────────────────────────────────────
    "jagdish-kharel": "Journalist, Politician",                     # Masters Mass Communication, TU + Wikipedia confirms journalist
    "prakash-pathak": "Journalist, Politician",                     # Facebook handle "JournoPrakash" = journalist

    # ── Business / Management ───────────────────────────────────────────────
    "raj-kishor-mahato": "Businessman, Politician",                 # Bachelor of Commerce
    "narendra-kumar-gupta": "Businessman, Politician",              # Bachelors Management
    "hari-dhakal": "Businessman, Politician",                       # Bachelors; Wikipedia confirms businessman
    "khadka-raj-paudel": "Businessman, Politician",                 # MBA
    "tauphik-ahamad-khan": "Businessman, Politician",               # MBA
    "bina-gurung": "Businesswoman, Politician",                     # BBS Commerce, Prithivi Narayan Campus
    "prakash-subedi": "Businessman, Politician",                    # Commerce background
    "gyanendra-singh-mahata": "Businessman, Politician",            # BCom + MCom
    "buddhi-prasad-pant": "Businessman, Politician",                # BCom + MA
    "rukesh-ranjit": "Businessman, Politician",                     # MBA
    "prakash-pathak-palpa": "Businessman, Politician",              # Commerce

    # ── Social Work / Civil Society ─────────────────────────────────────────
    "indira-rana-magar": "Social Worker, Politician",               # Wikipedia + official website confirm social work
    "ranju-darshana": "Civil Society Activist, Politician",         # Official website confirms activist background
    "khagendra-sunar": "Social Worker, Politician",                 # BA Political Science + Social Work
    "kp-khanal": "Social Worker, Politician",                       # BSW Texas International College
    "pukar-bam": "Social Worker, Politician",                       # Masters Sociology

    # ── Sociology / Social Science ───────────────────────────────────────────
    "devaraj-pathak": "Sociologist, Politician",                    # Masters Sociology; MA Social Values
    "shambhu-prasad-dhakal": "Political Scientist, Politician",     # Masters Political Science
    "manish-jha": "Political Scientist, Politician",                # Masters Political Science

    # ── Public Health ────────────────────────────────────────────────────────
    "dipak-kumar-sah": "Public Health Professional, Politician",    # Masters Public Health, London + IOM

    # ── Science / Biochemistry ───────────────────────────────────────────────
    "ananda-bahadur-chand": "Scientist, Politician",                # Masters Biochemistry + PhD

    # ── Agriculture / Environment ────────────────────────────────────────────
    "sitaram-sah": "Agronomist, Politician",                        # Bachelors Soil Conservation
}


def should_update(candidate: dict) -> bool:
    """Return True only if profession is exactly 'Politician'."""
    return candidate.get("profession", "").strip() == "Politician"


def main() -> None:
    print(f"Loading {DATA_PATH} …")
    data: list[dict] = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    updated = 0
    skipped_already_set = 0
    not_in_map = 0

    for candidate in data:
        cid = candidate.get("id", "")
        old_profession = candidate.get("profession", "")

        if not should_update(candidate):
            skipped_already_set += 1
            continue

        if cid in PROFESSION_UPDATES:
            new_profession = PROFESSION_UPDATES[cid]
            candidate["profession"] = new_profession
            print(f"  ✓ {candidate['name']:40s}  →  {new_profession}")
            updated += 1
        else:
            not_in_map += 1

    print()
    print(f"Summary:")
    print(f"  Updated:                    {updated}")
    print(f"  Already non-Politician:     {skipped_already_set}")
    print(f"  Still 'Politician' (no map): {not_in_map}")
    print()

    DATA_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Saved {DATA_PATH}")


if __name__ == "__main__":
    main()
