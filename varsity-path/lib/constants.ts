import { AthleteStatus } from "@/types"

export const ATHLETE_STATUS_LABELS: Record<AthleteStatus, string> = {
  PROSPECT: "Prospect",
  SIGNED: "Signé",
  IN_FILE: "En dossier",
  IN_CAMPAIGN: "En campagne",
  OFFERS_RECEIVED: "Offres reçues",
  COMMITTED: "Committed",
  NLI_SIGNED: "NLI signé",
  ARRIVED_US: "Arrivée US",
  ABANDONED: "Abandon",
}

export const ATHLETE_STATUS_COLORS: Record<AthleteStatus, string> = {
  PROSPECT: "default",
  SIGNED: "navy",
  IN_FILE: "default",
  IN_CAMPAIGN: "gold",
  OFFERS_RECEIVED: "red",
  COMMITTED: "navy",
  NLI_SIGNED: "navy",
  ARRIVED_US: "navy",
  ABANDONED: "default",
}

export const STEPS_DEFAULT = [
  "Signature du contrat",
  "Création du profil complet",
  "Dossier académique finalisé",
  "Tests standardisés passés",
  "Inscription NCAA Eligibility Center",
  "Vidéo highlights produite",
  "Shortlist universités validée",
  "Campagne d'emails lancée",
  "Offres reçues et étudiées",
  "Université choisie — NLI signé",
]
