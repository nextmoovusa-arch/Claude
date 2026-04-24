"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Users, User, UserCheck,
  Search, Check, Send, Loader2,
} from "lucide-react";
import {
  ALL_TEMPLATES, fillTemplate,
  type RecipientType, type EmailTemplate,
} from "@/lib/email-templates";

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ATHLETES = [
  { id: "1", firstName: "Lucas",  lastName: "Martins",   position: "midfielder",  country: "France",  age: "18", currentClub: "Paris FC U19",       gpa: "3.4", toefl: "98",  sat: "1180", highlightUrl: "https://youtube.com/watch?v=example", email: "lucas.m@nextmoov.fr",  parentName: "Ricardo Martins", parentEmail: "ricardo.martins@gmail.com" },
  { id: "2", firstName: "Sofia",  lastName: "Chen",      position: "forward",     country: "China",   age: "17", currentClub: "Shanghai FC Academy", gpa: "3.7", toefl: "102", sat: "1260", highlightUrl: "https://youtube.com/watch?v=sofia",   email: "sofia.c@nextmoov.fr",  parentName: "Wei Chen",        parentEmail: "wei.chen@gmail.com" },
  { id: "3", firstName: "Emma",   lastName: "Bergström", position: "center-back", country: "Sweden",  age: "19", currentClub: "Hammarby IF U21",     gpa: "3.1", toefl: "95",  sat: "1080", highlightUrl: "https://youtube.com/watch?v=emma",    email: "emma.b@nextmoov.fr",   parentName: "Lars Bergström",  parentEmail: "lars.b@gmail.com" },
];

const MOCK_UNIVERSITIES = [
  { id: "u1", name: "University of Virginia",        city: "Charlottesville", state: "VA", division: "NCAA_D1", headCoach: { id: "hc1", firstName: "George",   lastName: "Gelnovatch", email: "ggelnovatch@virginia.edu" },  assistants: [{ id: "ac1", firstName: "David",  lastName: "Nazemba",  email: "dnazemba@virginia.edu" }] },
  { id: "u2", name: "Duke University",               city: "Durham",          state: "NC", division: "NCAA_D1", headCoach: { id: "hc2", firstName: "John",     lastName: "Kerr",       email: "john.kerr@duke.edu" },        assistants: [] },
  { id: "u3", name: "Indiana University",            city: "Bloomington",     state: "IN", division: "NCAA_D1", headCoach: { id: "hc3", firstName: "Todd",     lastName: "Yeagley",    email: "tyeagley@indiana.edu" },      assistants: [{ id: "ac2", firstName: "Chris",  lastName: "Zegers",   email: "czegers@indiana.edu" }] },
  { id: "u4", name: "Creighton University",          city: "Omaha",           state: "NE", division: "NCAA_D1", headCoach: { id: "hc4", firstName: "Johnny",   lastName: "Torres",     email: "jtorres@creighton.edu" },     assistants: [] },
  { id: "u5", name: "Grand Valley State University", city: "Allendale",       state: "MI", division: "NCAA_D2", headCoach: { id: "hc5", firstName: "Schellas", lastName: "Hyndman",    email: "shyndman@gvsu.edu" },         assistants: [{ id: "ac3", firstName: "Jeff",   lastName: "Dufour",   email: "jdufour@gvsu.edu" }] },
  { id: "u6", name: "Wake Forest University",        city: "Winston-Salem",   state: "NC", division: "NCAA_D1", headCoach: { id: "hc6", firstName: "Bobby",    lastName: "Muuss",      email: "bmuuss@wfu.edu" },            assistants: [] },
  { id: "u7", name: "Adelphi University",            city: "Garden City",     state: "NY", division: "NCAA_D2", headCoach: { id: "hc7", firstName: "Julio",    lastName: "Penas",      email: "jpenas@adelphi.edu" },        assistants: [] },
  { id: "u8", name: "Messiah University",            city: "Mechanicsburg",   state: "PA", division: "NCAA_D3", headCoach: { id: "hc8", firstName: "Brad",     lastName: "McCarty",    email: "bmccarty@messiah.edu" },      assistants: [{ id: "ac4", firstName: "Lisa",   lastName: "Taylor",   email: "ltaylor@messiah.edu" }] },
];

const DIVISIONS = ["NCAA_D1", "NCAA_D2", "NCAA_D3", "NAIA", "NJCAA_D1"];
const DIV_LABELS: Record<string, string> = { NCAA_D1: "NCAA D1", NCAA_D2: "NCAA D2", NCAA_D3: "NCAA D3", NAIA: "NAIA", NJCAA_D1: "JUCO D1" };
const US_STATES = ["AL","AZ","CA","CO","CT","FL","GA","IL","IN","KS","KY","LA","MA","MD","MI","MN","MO","NC","NE","NJ","NY","OH","OK","OR","PA","SC","TN","TX","VA","WA","WI"];

type Step = 1 | 2 | 3 | 4;
interface SelectedCoach { coachId: string; coachFirstName: string; coachLastName: string; coachEmail: string; universityId: string; universityName: string; }

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [recipientType, setRecipientType] = useState<RecipientType | "">("");
  const [athleteId, setAthleteId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedCoaches, setSelectedCoaches] = useState<SelectedCoach[]>([]);
  const [search, setSearch] = useState("");
  const [filterDiv, setFilterDiv] = useState("");
  const [filterState, setFilterState] = useState("");
  const [previewIdx, setPreviewIdx] = useState(0);
  const [parentEmail, setParentEmail] = useState("");
  const [athleteEmail, setAthleteEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const athlete = MOCK_ATHLETES.find((a) => a.id === athleteId);
  const template = ALL_TEMPLATES.find((t) => t.id === templateId);
  const filteredTemplates = ALL_TEMPLATES.filter((t) => t.recipientType === recipientType);

  const filteredUniversities = useMemo(() => {
    return MOCK_UNIVERSITIES.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !search || u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.state.toLowerCase().includes(q);
      const matchDiv = !filterDiv || u.division === filterDiv;
      const matchState = !filterState || u.state === filterState;
      return matchSearch && matchDiv && matchState;
    });
  }, [search, filterDiv, filterState]);

  function allCoachesOf(u: typeof MOCK_UNIVERSITIES[0]): SelectedCoach[] {
    const all: SelectedCoach[] = [{ coachId: u.headCoach.id, coachFirstName: u.headCoach.firstName, coachLastName: u.headCoach.lastName, coachEmail: u.headCoach.email, universityId: u.id, universityName: u.name }];
    u.assistants.forEach((a) => all.push({ coachId: a.id, coachFirstName: a.firstName, coachLastName: a.lastName, coachEmail: a.email, universityId: u.id, universityName: u.name }));
    return all;
  }

  function isCoachSelected(id: string) { return selectedCoaches.some((c) => c.coachId === id); }
  function isUniAllSelected(u: typeof MOCK_UNIVERSITIES[0]) { return allCoachesOf(u).every((c) => isCoachSelected(c.coachId)); }

  function toggleCoach(coach: SelectedCoach) {
    setSelectedCoaches((prev) => prev.some((c) => c.coachId === coach.coachId) ? prev.filter((c) => c.coachId !== coach.coachId) : [...prev, coach]);
  }
  function toggleUniversity(u: typeof MOCK_UNIVERSITIES[0]) {
    if (isUniAllSelected(u)) {
      setSelectedCoaches((prev) => prev.filter((c) => c.universityId !== u.id));
    } else {
      const newOnes = allCoachesOf(u).filter((c) => !isCoachSelected(c.coachId));
      setSelectedCoaches((prev) => [...prev, ...newOnes]);
    }
  }
  function selectAllVisible() {
    const newOnes = filteredUniversities.flatMap(allCoachesOf).filter((c) => !isCoachSelected(c.coachId));
    setSelectedCoaches((prev) => [...prev, ...newOnes]);
  }

  function buildVars(ath: typeof MOCK_ATHLETES[0], coach?: SelectedCoach) {
    return {
      athleteFirstName: ath.firstName, athleteLastName: ath.lastName, athleteEmail: ath.email,
      position: ath.position, country: ath.country, age: ath.age,
      currentClub: ath.currentClub, gpa: ath.gpa, toefl: ath.toefl, sat: ath.sat,
      highlightUrl: ath.highlightUrl,
      parentFirstName: ath.parentName.split(" ")[0], parentEmail: ath.parentEmail,
      agentName: "NEXTMOOV USA",
      coachLastName: coach?.coachLastName ?? "[Coach]",
      universityName: coach?.universityName ?? "[Université]",
      currentSeason: "2025-2026",
      portalUrl: `https://varsitypath.netlify.app/portal/${ath.id}`,
    };
  }

  function applyTemplate(tId: string) {
    const tpl = ALL_TEMPLATES.find((t) => t.id === tId);
    if (!tpl || !athlete) return;
    const filled = fillTemplate(tpl, buildVars(athlete));
    setSubject(filled.subject);
    setBody(filled.body);
  }

  function renderPreview(coach?: SelectedCoach) {
    if (!athlete) return { to: "", subject: "", body: "" };
    const vars = buildVars(athlete, coach);
    const fill = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k as keyof typeof vars] ?? `{{${k}}}`);
    return {
      to: coach ? coach.coachEmail : (recipientType === "parents" ? parentEmail : athleteEmail),
      subject: fill(subject),
      body: fill(body),
    };
  }

  const previewCoach = selectedCoaches[previewIdx];
  const preview = renderPreview(previewCoach);

  async function handleSend() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
  }

  const canStep2 = recipientType !== "" && athleteId !== "";
  const canStep3 = templateId !== "" && subject !== "" && body !== "";
  const canStep4 = recipientType === "coaches" ? selectedCoaches.length > 0 : recipientType === "parents" ? parentEmail !== "" : athleteEmail !== "";

  const STEP_LABELS = ["Athlète & type", "Template", "Destinataires", "Aperçu & Envoi"];

  if (sent) {
    const count = recipientType === "coaches" ? selectedCoaches.length : 1;
    return (
      <div className="p-8 max-w-2xl mx-auto text-center pt-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-display uppercase tracking-wider text-navy mb-2">Campagne lancée</h2>
        <p className="text-graphite font-mono mb-8">{count} email{count > 1 ? "s" : ""} en cours d'envoi</p>
        <div className="flex gap-3 justify-center">
          <Link href="/admin/campaigns" className="px-5 py-2.5 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90">
            Voir les campagnes →
          </Link>
          <button onClick={() => { setSent(false); setStep(1); setRecipientType(""); setAthleteId(""); setTemplateId(""); setSubject(""); setBody(""); setSelectedCoaches([]); }}
            className="px-5 py-2.5 border border-line text-graphite text-sm font-mono rounded hover:border-graphite">
            Nouvelle campagne
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/admin/campaigns" className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-5">
        <ChevronLeft className="w-4 h-4" /> Retour aux campagnes
      </Link>
      <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-6">Nouvelle campagne</h1>

      {/* Progress bar */}
      <div className="flex items-center mb-8">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          return (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${step >= n ? "text-navy" : "text-stone"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 transition-colors ${step > n ? "bg-navy border-navy text-paper" : step === n ? "border-navy text-navy" : "border-line text-stone"}`}>
                  {step > n ? <Check className="w-3.5 h-3.5" /> : n}
                </div>
                <span className="text-xs font-mono hidden md:block">{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-px mx-3 ${step > n ? "bg-navy" : "bg-line"}`} />}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1 ─────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-4">Athlète concerné</p>
            <div className="grid grid-cols-3 gap-3">
              {MOCK_ATHLETES.map((a) => (
                <button key={a.id} onClick={() => setAthleteId(a.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${athleteId === a.id ? "border-navy bg-navy/5" : "border-line hover:border-graphite"}`}>
                  <p className="font-semibold text-ink text-sm">{a.firstName} {a.lastName}</p>
                  <p className="text-xs font-mono text-graphite mt-0.5">{a.position} · {a.country}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-4">Type de destinataires</p>
            <div className="grid grid-cols-3 gap-4">
              {([
                { type: "coaches" as RecipientType,  Icon: Users,     label: "Coachs universitaires", desc: "Envoi groupé · jusqu'à 40+ emails personnalisés" },
                { type: "parents" as RecipientType,  Icon: UserCheck, label: "Parents / Tuteur",       desc: "Email individuel au parent ou tuteur" },
                { type: "athlete" as RecipientType,  Icon: User,      label: "Athlète",                desc: "Email direct à l'athlète" },
              ]).map(({ type, Icon, label, desc }) => (
                <button key={type} onClick={() => setRecipientType(type)}
                  className={`p-5 border-2 rounded-lg text-left transition-all ${recipientType === type ? "border-navy bg-navy/5" : "border-line hover:border-graphite"}`}>
                  <Icon className={`w-6 h-6 mb-3 ${recipientType === type ? "text-navy" : "text-graphite"}`} />
                  <p className="font-semibold text-sm text-ink">{label}</p>
                  <p className="text-xs font-mono text-graphite mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setStep(2)} disabled={!canStep2}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed">
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ─────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-4">Choisir un template</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {filteredTemplates.map((t) => (
                <button key={t.id} onClick={() => { setTemplateId(t.id); applyTemplate(t.id); }}
                  className={`p-4 border rounded-lg text-left transition-colors ${templateId === t.id ? "border-navy bg-navy/5" : "border-line hover:border-graphite"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-semibold text-ink text-sm leading-tight">{t.name}</p>
                    {templateId === t.id && <Check className="w-4 h-4 text-navy flex-shrink-0" />}
                  </div>
                  <span className="inline-block px-1.5 py-0.5 bg-navy/10 text-navy text-xs font-mono rounded mb-1">{t.category}</span>
                  <p className="text-xs text-stone font-mono truncate">{t.subject.slice(0, 55)}…</p>
                </button>
              ))}
            </div>
          </div>

          {templateId && (
            <div className="bg-white border border-line rounded-lg p-6 space-y-4">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite">Modifier le contenu</p>
              <div>
                <label className="text-xs font-mono text-graphite block mb-1.5">Sujet</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-navy" />
              </div>
              <div>
                <label className="text-xs font-mono text-graphite block mb-1.5">Corps de l'email</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10}
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-navy" />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 px-4 py-2 border border-line text-graphite text-sm font-mono rounded hover:border-graphite">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <button onClick={() => setStep(3)} disabled={!canStep3}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed">
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ─────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          {recipientType === "coaches" && (
            <>
              <div className="bg-white border border-line rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-graphite">
                    Sélection des coachs
                    {selectedCoaches.length > 0 && <span className="ml-2 px-2 py-0.5 bg-navy text-paper text-xs rounded">{selectedCoaches.length} sélectionné{selectedCoaches.length > 1 ? "s" : ""}</span>}
                  </p>
                  <button onClick={selectAllVisible} className="text-xs font-mono text-navy hover:underline">
                    Tout sélectionner ({filteredUniversities.reduce((s, u) => s + 1 + u.assistants.length, 0)})
                  </button>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-graphite" />
                    <input placeholder="Rechercher une université…" value={search} onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-line rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-navy" />
                  </div>
                  <select value={filterDiv} onChange={(e) => setFilterDiv(e.target.value)}
                    className="border border-line rounded px-3 py-2 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy">
                    <option value="">Toutes divisions</option>
                    {DIVISIONS.map((d) => <option key={d} value={d}>{DIV_LABELS[d] ?? d}</option>)}
                  </select>
                  <select value={filterState} onChange={(e) => setFilterState(e.target.value)}
                    className="border border-line rounded px-3 py-2 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy">
                    <option value="">Tous états</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {filteredUniversities.map((u) => {
                    const coaches = allCoachesOf(u);
                    return (
                      <div key={u.id} className="border border-line rounded-lg overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 bg-paper cursor-pointer hover:bg-cream" onClick={() => toggleUniversity(u)}>
                          <input type="checkbox" checked={isUniAllSelected(u)} onChange={() => {}} className="w-3.5 h-3.5 accent-navy" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink">{u.name}</p>
                            <p className="text-xs font-mono text-graphite">{u.city}, {u.state} · {DIV_LABELS[u.division] ?? u.division}</p>
                          </div>
                          <span className="text-xs font-mono text-stone">{coaches.length} coach{coaches.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="divide-y divide-line">
                          {coaches.map((c) => (
                            <div key={c.coachId} className="flex items-center gap-3 px-6 py-2.5 hover:bg-paper/60 cursor-pointer" onClick={() => toggleCoach(c)}>
                              <input type="checkbox" checked={isCoachSelected(c.coachId)} onChange={() => {}} className="w-3 h-3 accent-navy" />
                              <span className="text-xs text-ink font-medium flex-1">{c.coachFirstName || c.coachLastName ? `${c.coachFirstName} ${c.coachLastName}`.trim() : "Nom non renseigné"}</span>
                              <span className="text-xs font-mono text-graphite">{c.coachEmail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedCoaches.length > 0 && (
                <div className="bg-navy/5 border border-navy/20 rounded-lg px-5 py-3 flex items-center justify-between">
                  <p className="text-sm font-mono text-navy font-semibold">{selectedCoaches.length} coach{selectedCoaches.length !== 1 ? "s" : ""} · {new Set(selectedCoaches.map((c) => c.universityId)).size} université{new Set(selectedCoaches.map((c) => c.universityId)).size !== 1 ? "s" : ""}</p>
                  <button onClick={() => setSelectedCoaches([])} className="text-xs font-mono text-graphite hover:text-red-flag">Désélectionner tout</button>
                </div>
              )}
            </>
          )}

          {recipientType === "parents" && (
            <div className="bg-white border border-line rounded-lg p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-4">Email du parent</p>
              <p className="text-sm text-graphite font-mono mb-3">Athlète : <strong>{athlete?.firstName} {athlete?.lastName}</strong></p>
              <input type="email" placeholder="Email du parent / tuteur" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)}
                className="w-full border border-line rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-navy" />
              {athlete?.parentEmail && (
                <button onClick={() => setParentEmail(athlete.parentEmail)} className="text-xs font-mono text-navy mt-2 hover:underline block">
                  Utiliser {athlete.parentEmail}
                </button>
              )}
            </div>
          )}

          {recipientType === "athlete" && (
            <div className="bg-white border border-line rounded-lg p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-4">Email de l'athlète</p>
              <input type="email" placeholder="Email de l'athlète" value={athleteEmail} onChange={(e) => setAthleteEmail(e.target.value)}
                className="w-full border border-line rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-navy" />
              {athlete?.email && (
                <button onClick={() => setAthleteEmail(athlete.email)} className="text-xs font-mono text-navy mt-2 hover:underline block">
                  Utiliser {athlete.email}
                </button>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 px-4 py-2 border border-line text-graphite text-sm font-mono rounded hover:border-graphite">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <button onClick={() => setStep(4)} disabled={!canStep4}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed">
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4 ─────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-4">Récapitulatif</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-paper rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-navy">{recipientType === "coaches" ? selectedCoaches.length : 1}</p>
                <p className="text-xs font-mono text-graphite mt-1">email{recipientType === "coaches" && selectedCoaches.length > 1 ? "s" : ""} à envoyer</p>
              </div>
              <div className="bg-paper rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-ink">{athlete?.firstName} {athlete?.lastName}</p>
                <p className="text-xs font-mono text-graphite mt-1">athlète</p>
              </div>
              <div className="bg-paper rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-ink truncate">{template?.name ?? "—"}</p>
                <p className="text-xs font-mono text-graphite mt-1">template</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite">Aperçu — email personnalisé</p>
              {recipientType === "coaches" && selectedCoaches.length > 1 && (
                <div className="flex items-center gap-3">
                  <button onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))} disabled={previewIdx === 0} className="text-xs font-mono text-graphite hover:text-navy disabled:opacity-30">← Préc</button>
                  <span className="text-xs font-mono text-graphite bg-paper px-2 py-0.5 rounded">{previewIdx + 1} / {selectedCoaches.length}</span>
                  <button onClick={() => setPreviewIdx((i) => Math.min(selectedCoaches.length - 1, i + 1))} disabled={previewIdx === selectedCoaches.length - 1} className="text-xs font-mono text-graphite hover:text-navy disabled:opacity-30">Suiv →</button>
                </div>
              )}
            </div>
            <div className="bg-paper border border-line rounded-lg p-5">
              <p className="text-xs font-mono text-graphite mb-1">À : <span className="text-ink">{preview.to}</span></p>
              <p className="text-sm font-semibold text-ink mb-4 pt-2 border-t border-line">{preview.subject}</p>
              <pre className="text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">{preview.body}</pre>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 px-4 py-2 border border-line text-graphite text-sm font-mono rounded hover:border-graphite">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <button onClick={handleSend} disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 disabled:opacity-60 font-semibold">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Envoi en cours…" : `Envoyer ${recipientType === "coaches" ? `${selectedCoaches.length} email${selectedCoaches.length > 1 ? "s" : ""}` : "l'email"}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
