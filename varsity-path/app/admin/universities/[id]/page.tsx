"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, MapPin, Trophy, DollarSign, Users, Mail,
  ExternalLink, Edit3, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Coach = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  isHeadCoach: boolean;
  linkedinUrl?: string;
  twitterUrl?: string;
};

// Mock university data
const MOCK_UNIVERSITY = {
  id: "1",
  name: "University of Virginia",
  slug: "university-of-virginia",
  city: "Charlottesville",
  state: "VA",
  division: "NCAA_D1",
  region: "Southeast",
  country: "USA",
  latitude: 38.0336,
  longitude: -78.5022,
  satAvgLow: 1480,
  satAvgHigh: 1570,
  actAvgLow: 33,
  actAvgHigh: 35,
  acceptanceRate: 0.19,
  tuitionInState: 18000,
  tuitionOutOfState: 48000,
  roomAndBoard: 14000,
  rosterSize: 23,
  scholarshipsTotal: 11.5,
  websiteUrl: "https://www.virginia.edu",
  athleticsUrl: "https://virginiaathletics.com",
  agentNotes: "Excellent D1 program. Strong academics and athletic tradition.",
};

const MOCK_COACHES: Coach[] = [
  {
    id: "c1",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "mjohnson@virginia.edu",
    phone: "(434) 123-4567",
    title: "Head Coach",
    isHeadCoach: true,
    linkedinUrl: "https://linkedin.com/in/marcus-johnson",
    twitterUrl: "https://twitter.com/marcusjohnson",
  },
  {
    id: "c2",
    firstName: "David",
    lastName: "Miller",
    email: "dmiller@virginia.edu",
    phone: "(434) 123-4568",
    title: "Assistant Coach",
    isHeadCoach: false,
    linkedinUrl: "https://linkedin.com/in/david-miller",
  },
  {
    id: "c3",
    firstName: "Jennifer",
    lastName: "Williams",
    email: "jwilliams@virginia.edu",
    title: "Recruiting Coordinator",
    isHeadCoach: false,
  },
];

const DIVISION_LABELS: Record<string, string> = {
  NCAA_D1: "NCAA Division 1",
  NCAA_D2: "NCAA Division 2",
  NCAA_D3: "NCAA Division 3",
  NAIA: "NAIA",
  NJCAA_D1: "NJCAA Division 1",
  NJCAA_D2: "NJCAA Division 2",
  NJCAA_D3: "NJCAA Division 3",
};

export default function UniversityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const university = MOCK_UNIVERSITY;
  const [coaches, setCoaches] = useState<Coach[]>(MOCK_COACHES);

  const headCoach = useMemo(
    () => coaches.find((c) => c.isHeadCoach),
    [coaches]
  );

  const assistantCoaches = useMemo(
    () => coaches.filter((c) => !c.isHeadCoach),
    [coaches]
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/universities"
          className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux universités
        </Link>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-2">
              {university.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite">
                <MapPin className="w-4 h-4" />
                {university.city}, {university.state}
              </span>
              <Badge variant="secondary">{DIVISION_LABELS[university.division]}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            SAT (Plage)
          </p>
          <p className="text-lg font-display text-navy">
            {university.satAvgLow}–{university.satAvgHigh}
          </p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            Taux d'acceptation
          </p>
          <p className="text-lg font-display text-navy">
            {Math.round(university.acceptanceRate * 100)}%
          </p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            Effectif équipe
          </p>
          <p className="text-lg font-display text-navy">{university.rosterSize}</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            Bourses totales
          </p>
          <p className="text-lg font-display text-navy">{university.scholarshipsTotal}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Info panels */}
        <div className="col-span-2 space-y-6">
          {/* Académique */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Critères d'admission
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">SAT moyen (min-max)</span>
                <span className="text-ink font-medium">
                  {university.satAvgLow}–{university.satAvgHigh}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">ACT moyen (min-max)</span>
                <span className="text-ink font-medium">
                  {university.actAvgLow}–{university.actAvgHigh}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-mono text-graphite">Taux d'acceptation</span>
                <span className="text-ink font-medium">
                  {Math.round(university.acceptanceRate * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Financier */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Coûts
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">Frais in-state/an</span>
                <span className="text-ink font-medium">
                  ${(university.tuitionInState / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">Frais out-of-state/an</span>
                <span className="text-ink font-medium">
                  ${(university.tuitionOutOfState / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-mono text-graphite">Logement & repas/an</span>
                <span className="text-ink font-medium">
                  ${(university.roomAndBoard / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">
              Notes Agent
            </h3>
            <p className="text-sm text-ink leading-relaxed">
              {university.agentNotes}
            </p>
          </div>

          {/* Links */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">
              Ressources
            </h3>
            <div className="space-y-2">
              {university.websiteUrl && (
                <a
                  href={university.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-navy underline hover:text-navy-600 font-mono"
                >
                  → Site universitaire
                </a>
              )}
              {university.athleticsUrl && (
                <a
                  href={university.athleticsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-navy underline hover:text-navy-600 font-mono"
                >
                  → Site athletics
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Coaches + Athletes targeting */}
        <div className="col-span-1 space-y-6">
          {/* Athletes targeting this university */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Athlètes ciblant cette université
            </h3>
            <div className="space-y-3">
              {[
                { id: "1", name: "Lucas Martins", status: "CONTACTED", statusLabel: "Contacté", color: "bg-navy/10 text-navy" },
              ].map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/athletes/${a.id}`}
                  className="flex items-center justify-between py-2 border-b border-line last:border-0 hover:text-navy transition-colors"
                >
                  <p className="text-sm font-medium text-ink hover:text-navy">{a.name}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${a.color}`}>
                    {a.statusLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
                <Users className="w-4 h-4" /> Coachs ({coaches.length})
              </h3>
              <button className="text-navy hover:text-navy-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Head Coach */}
              {headCoach && (
                <div className="pb-4 border-b border-line">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-navy text-paper text-xs font-mono font-semibold rounded">
                      Head Coach
                    </span>
                  </div>
                  <p className="font-medium text-ink text-sm">
                    {headCoach.firstName} {headCoach.lastName}
                  </p>
                  {headCoach.title && (
                    <p className="text-xs text-graphite font-mono mt-1">
                      {headCoach.title}
                    </p>
                  )}
                  {headCoach.email && (
                    <a
                      href={`mailto:${headCoach.email}`}
                      className="flex items-center gap-1 text-xs text-navy font-mono mt-2 hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      {headCoach.email}
                    </a>
                  )}
                  {headCoach.linkedinUrl && (
                    <a
                      href={headCoach.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-navy font-mono mt-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              {/* Assistant Coaches */}
              <div className="space-y-3">
                {assistantCoaches.map((coach) => (
                  <div key={coach.id} className="pb-3 border-b border-line last:border-0">
                    <p className="font-medium text-ink text-sm">
                      {coach.firstName} {coach.lastName}
                    </p>
                    {coach.title && (
                      <p className="text-xs text-graphite font-mono mt-0.5">
                        {coach.title}
                      </p>
                    )}
                    {coach.email && (
                      <a
                        href={`mailto:${coach.email}`}
                        className="flex items-center gap-1 text-xs text-navy font-mono mt-1.5 hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        {coach.email}
                      </a>
                    )}
                    {coach.linkedinUrl && (
                      <a
                        href={coach.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-navy font-mono hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        LinkedIn
                      </a>
                    )}
                    {coach.twitterUrl && (
                      <a
                        href={coach.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-navy font-mono hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Twitter
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
