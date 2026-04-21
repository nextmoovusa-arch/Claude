export type Role = "AGENT" | "ATHLETE" | "FAMILY"

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "CANCELLED"

export type TaskCategory =
  | "ACADEMIC"
  | "ADMINISTRATIVE"
  | "SPORTS"
  | "STRATEGY"
  | "COMMUNICATION"
  | "FINANCIAL"

export type AthleteStatus =
  | "PROSPECT"
  | "SIGNED"
  | "IN_FILE"
  | "IN_CAMPAIGN"
  | "OFFERS_RECEIVED"
  | "COMMITTED"
  | "NLI_SIGNED"
  | "ARRIVED_US"
  | "ABANDONED"

export type Division =
  | "NCAA_D1"
  | "NCAA_D2"
  | "NCAA_D3"
  | "NAIA"
  | "NJCAA_D1"
  | "NJCAA_D2"
  | "NJCAA_D3"
  | "PREP_SCHOOL"

export type StepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED"

export type EmailStatus = "DRAFT" | "SENT" | "OPENED" | "CLICKED" | "REPLIED" | "BOUNCED"
