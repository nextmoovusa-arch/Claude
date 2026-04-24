export type RecipientType = "coaches" | "parents" | "athlete";

export type TemplateCategory =
  | "Prémisses"
  | "Sportif"
  | "Factures"
  | "Académique"
  | "Facultatif"
  | "Parents"
  | "Athlète";

export interface EmailTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  recipientType: RecipientType;
  subject: string;
  body: string;
}

export const ALL_TEMPLATES: EmailTemplate[] = [
  // ── COACHES ───────────────────────────────────────────────────────────────
  {
    id: "c1",
    name: "Contact initial — Soccer masculin",
    category: "Prémisses",
    recipientType: "coaches",
    subject: "Student-athlete inquiry — {{position}} from {{country}}",
    body: `Dear Coach {{coachLastName}},

My name is {{athleteFirstName}} {{athleteLastName}}, a {{age}}-year-old {{position}} from {{country}}.

I am writing to express my strong interest in playing soccer for {{universityName}}. I have followed your program closely and believe it would be an excellent fit for both my athletic and academic goals.

Athletic profile:
- Current club: {{currentClub}}
- GPA (converted 4.0): {{gpa}}
- TOEFL: {{toefl}}
- Highlight video: {{highlightUrl}}

I would be honored to discuss the possibility of joining your program.

Best regards,
{{athleteFirstName}} {{athleteLastName}}
{{athleteEmail}}`,
  },
  {
    id: "c2",
    name: "Contact initial — Soccer féminin",
    category: "Prémisses",
    recipientType: "coaches",
    subject: "Female student-athlete inquiry — {{position}} from {{country}}",
    body: `Dear Coach {{coachLastName}},

My name is {{athleteFirstName}} {{athleteLastName}}, a {{age}}-year-old {{position}} from {{country}}.

I am very interested in joining the women's soccer program at {{universityName}}. I believe my background and athletic profile would be a strong match for your team.

Athletic profile:
- Current club: {{currentClub}}
- GPA (converted 4.0): {{gpa}}
- TOEFL: {{toefl}}
- Highlight video: {{highlightUrl}}

I look forward to hearing from you.

Best regards,
{{athleteFirstName}} {{athleteLastName}}
{{athleteEmail}}`,
  },
  {
    id: "c3",
    name: "Relance — 7 jours sans réponse",
    category: "Prémisses",
    recipientType: "coaches",
    subject: "Following up — {{athleteFirstName}} {{athleteLastName}} — {{position}}",
    body: `Dear Coach {{coachLastName}},

I wanted to follow up on my previous email regarding {{athleteFirstName}} {{athleteLastName}}.

We remain very interested in your program at {{universityName}} and would love to schedule a brief call at your convenience.

Highlight video: {{highlightUrl}}

Thank you for your time.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
  },
  {
    id: "c4",
    name: "Envoi vidéo highlight complémentaire",
    category: "Sportif",
    recipientType: "coaches",
    subject: "Additional highlight reel — {{athleteFirstName}} {{athleteLastName}}",
    body: `Dear Coach {{coachLastName}},

Following our previous exchange, please find an updated highlight video for {{athleteFirstName}} {{athleteLastName}}.

Updated highlight ({{currentSeason}}): {{highlightUrl}}

The video includes recent matches with {{currentClub}}, set pieces and technical sequences.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
  },
  {
    id: "c5",
    name: "Résultats académiques — TOEFL/SAT",
    category: "Académique",
    recipientType: "coaches",
    subject: "Academic update — {{athleteFirstName}} {{athleteLastName}} — TOEFL {{toefl}}",
    body: `Dear Coach {{coachLastName}},

I wanted to share an academic update for {{athleteFirstName}} {{athleteLastName}}.

Latest results:
- TOEFL: {{toefl}} / 120
- SAT: {{sat}} / 1600
- GPA (converted 4.0): {{gpa}}

Please let us know if you need official transcripts or additional documentation.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
  },
  {
    id: "c6",
    name: "Remerciements après visite campus",
    category: "Facultatif",
    recipientType: "coaches",
    subject: "Thank you — {{athleteFirstName}}'s visit to {{universityName}}",
    body: `Dear Coach {{coachLastName}},

{{athleteFirstName}} {{athleteLastName}} wanted to personally thank you for the wonderful visit to {{universityName}} on {{visitDate}}.

The campus and program left a very strong impression. {{athleteFirstName}} remains very interested in your program.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
  },
  // ── PARENTS ───────────────────────────────────────────────────────────────
  {
    id: "p1",
    name: "Bienvenue dans l'accompagnement",
    category: "Parents",
    recipientType: "parents",
    subject: "[NEXTMOOV] Bienvenue — Accompagnement de {{athleteFirstName}}",
    body: `Bonjour {{parentFirstName}},

Nous sommes ravis de vous accueillir au sein de NEXTMOOV USA pour l'accompagnement de {{athleteFirstName}} {{athleteLastName}} dans son projet d'intégration universitaire aux États-Unis.

Votre agent référent est {{agentName}}, joignable à tout moment par email ou téléphone.

Les prochaines étapes sont :
1. Validation du dossier sportif et académique
2. Sélection des universités cibles
3. Lancement de la campagne d'emails

N'hésitez pas à nous contacter pour toute question.

Cordialement,
L'équipe NEXTMOOV USA`,
  },
  {
    id: "p2",
    name: "Mise à jour avancement projet",
    category: "Parents",
    recipientType: "parents",
    subject: "[NEXTMOOV] Point d'avancement — {{athleteFirstName}} {{athleteLastName}}",
    body: `Bonjour {{parentFirstName}},

Voici un point d'avancement sur le projet de {{athleteFirstName}} :

Tâches terminées : {{completedTasks}} / {{totalTasks}}
Universités contactées : {{contactedUniversities}}
Réponses reçues : {{repliedCoaches}}

{{agentNotes}}

Nous restons disponibles pour un appel si vous souhaitez en discuter.

Cordialement,
{{agentName}} — NEXTMOOV USA`,
  },
  {
    id: "p3",
    name: "Rappel mensualité",
    category: "Factures",
    recipientType: "parents",
    subject: "[NEXTMOOV] Rappel — mensualité {{month}} {{year}}",
    body: `Bonjour {{parentFirstName}},

Nous vous rappelons que la mensualité de {{month}} {{year}} d'un montant de {{amount}} € est due pour le suivi de {{athleteFirstName}} {{athleteLastName}}.

Merci de procéder au règlement dans les plus brefs délais.

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe NEXTMOOV USA`,
  },
  {
    id: "p4",
    name: "Bonne nouvelle — offre reçue",
    category: "Parents",
    recipientType: "parents",
    subject: "[NEXTMOOV] 🎉 Offre reçue — {{universityName}}",
    body: `Bonjour {{parentFirstName}},

Excellente nouvelle ! {{athleteFirstName}} vient de recevoir une offre officielle de {{universityName}} ({{division}}).

Détails de l'offre :
- Bourse athlétique : {{scholarshipPct}}%
- Budget annuel estimé : {{budgetUsd}} USD

Nous allons analyser cette offre et vous contacter rapidement pour en discuter.

Cordialement,
{{agentName}} — NEXTMOOV USA`,
  },
  {
    id: "p5",
    name: "Invitation réunion bilan",
    category: "Parents",
    recipientType: "parents",
    subject: "[NEXTMOOV] Invitation réunion bilan — {{athleteFirstName}}",
    body: `Bonjour {{parentFirstName}},

Nous souhaiterions organiser une réunion bilan pour faire le point sur le projet de {{athleteFirstName}}.

Nous sommes disponibles aux créneaux suivants :
- {{slot1}}
- {{slot2}}
- {{slot3}}

Merci de nous indiquer votre préférence.

Cordialement,
{{agentName}} — NEXTMOOV USA`,
  },
  // ── ATHLETE ───────────────────────────────────────────────────────────────
  {
    id: "a1",
    name: "Bienvenue — Onboarding",
    category: "Athlète",
    recipientType: "athlete",
    subject: "[NEXTMOOV] Bienvenue {{athleteFirstName}} ! Voici tes prochaines étapes",
    body: `Bonjour {{athleteFirstName}},

Bienvenue dans l'aventure NEXTMOOV USA ! Nous sommes très enthousiastes à l'idée de t'accompagner vers les universités américaines.

Tes premières actions :
1. Complète ton profil sportif (taille, poids, poste, pied fort)
2. Envoie-nous ta vidéo highlight
3. Prépare tes relevés de notes

Ton espace dédié : {{portalUrl}}

On est là pour toi à chaque étape. N'hésite pas à nous poser toutes tes questions !

L'équipe NEXTMOOV USA`,
  },
  {
    id: "a2",
    name: "Rappel tâche en attente",
    category: "Athlète",
    recipientType: "athlete",
    subject: "[NEXTMOOV] Action requise — {{taskName}}",
    body: `Bonjour {{athleteFirstName}},

Une tâche importante attend ton action : **{{taskName}}**

Date limite : {{dueDate}}

Pour y accéder : {{portalUrl}}

Si tu as des questions, n'hésite pas à contacter ton agent.

L'équipe NEXTMOOV USA`,
  },
  {
    id: "a3",
    name: "Bonne nouvelle — offre reçue",
    category: "Athlète",
    recipientType: "athlete",
    subject: "[NEXTMOOV] 🎉 Tu as reçu une offre de {{universityName}} !",
    body: `Bonjour {{athleteFirstName}},

Excellente nouvelle ! Tu viens de recevoir une offre officielle de {{universityName}} ({{division}}) !

Ton agent va te contacter très prochainement pour analyser cette offre ensemble et décider des prochaines étapes.

Continue comme ça ! 💪

L'équipe NEXTMOOV USA`,
  },
  {
    id: "a4",
    name: "Préparation départ USA",
    category: "Athlète",
    recipientType: "athlete",
    subject: "[NEXTMOOV] Préparation départ — checklist finale",
    body: `Bonjour {{athleteFirstName}},

Le départ aux États-Unis approche ! Voici ta checklist finale :

☐ Passeport valide (2 ans minimum)
☐ Visa F-1 obtenu
☐ Billet d'avion réservé
☐ Assurance santé souscrite
☐ Logement confirmé à {{universityName}}
☐ Compte bancaire US ouvert
☐ Matériel sportif préparé

Consulte ton espace pour les détails : {{portalUrl}}

L'équipe NEXTMOOV USA`,
  },
];

export function fillTemplate(
  template: EmailTemplate,
  vars: Record<string, string>
): { subject: string; body: string } {
  const fill = (s: string) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
  return { subject: fill(template.subject), body: fill(template.body) };
}

export function getTemplatesByRecipient(type: RecipientType) {
  return ALL_TEMPLATES.filter((t) => t.recipientType === type);
}
