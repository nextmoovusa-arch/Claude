"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Star } from "lucide-react";

type EventType = "EXAM" | "DEADLINE" | "MEETING" | "VISIT" | "MATCH" | "INTERNAL";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startDate: string;
  endDate?: string;
  location?: string;
  athleteName?: string;
  isImportant: boolean;
}

const EVENT_COLORS: Record<EventType, string> = {
  EXAM: "bg-blue-600",
  DEADLINE: "bg-red-flag",
  MEETING: "bg-navy",
  VISIT: "bg-green-700",
  MATCH: "bg-amber-600",
  INTERNAL: "bg-graphite",
};

const EVENT_LABELS: Record<EventType, string> = {
  EXAM: "Examen",
  DEADLINE: "Deadline",
  MEETING: "Réunion",
  VISIT: "Visite campus",
  MATCH: "Match",
  INTERNAL: "Interne",
};

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "TOEFL — Lucas Martins",
    type: "EXAM",
    startDate: "2026-06-15",
    location: "Centre agréé Paris",
    athleteName: "Lucas Martins",
    isImportant: true,
    description: "Score cible: 100+",
  },
  {
    id: "2",
    title: "Deadline NCAA Eligibility",
    type: "DEADLINE",
    startDate: "2026-05-01",
    athleteName: "Lucas Martins",
    isImportant: true,
    description: "Profil complet + relevés de notes",
  },
  {
    id: "3",
    title: "Réunion famille Chen",
    type: "MEETING",
    startDate: "2026-04-25",
    location: "Zoom",
    athleteName: "Sofia Chen",
    isImportant: false,
    description: "Bilan mensuel et stratégie",
  },
  {
    id: "4",
    title: "SAT — Sofia Chen",
    type: "EXAM",
    startDate: "2026-06-01",
    location: "Centre agréé Shanghai",
    athleteName: "Sofia Chen",
    isImportant: true,
    description: "Score cible: 1400+",
  },
  {
    id: "5",
    title: "Visite UVA",
    type: "VISIT",
    startDate: "2026-05-20",
    endDate: "2026-05-22",
    location: "Charlottesville, VA",
    athleteName: "Lucas Martins",
    isImportant: true,
    description: "Officielle + entraînement avec l'équipe",
  },
  {
    id: "6",
    title: "Match Champions U19",
    type: "MATCH",
    startDate: "2026-04-28",
    location: "Stade de France",
    athleteName: "Lucas Martins",
    isImportant: false,
  },
  {
    id: "7",
    title: "Réunion équipe NEXTMOOV",
    type: "INTERNAL",
    startDate: "2026-04-30",
    location: "Bureau Paris",
    isImportant: false,
    description: "Bilan mensuel athlètes",
  },
];

const MONTH_NAMES_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAY_NAMES_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function CalendarPage() {
  const today = new Date("2026-04-22");
  const [viewDate, setViewDate] = useState({ year: 2026, month: 3 }); // April 2026 (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    MOCK_EVENTS.forEach((event) => {
      const date = event.startDate;
      if (!map[date]) map[date] = [];
      map[date].push(event);
    });
    return map;
  }, []);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate[selectedDate] || [];
  }, [selectedDate, eventsByDate]);

  const upcomingEvents = useMemo(() => {
    const todayStr = today.toISOString().split("T")[0];
    return MOCK_EVENTS
      .filter((e) => e.startDate >= todayStr)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 5);
  }, []);

  const prevMonth = () => {
    setViewDate((prev) => {
      const month = prev.month === 0 ? 11 : prev.month - 1;
      const year = prev.month === 0 ? prev.year - 1 : prev.year;
      return { year, month };
    });
  };

  const nextMonth = () => {
    setViewDate((prev) => {
      const month = prev.month === 11 ? 0 : prev.month + 1;
      const year = prev.month === 11 ? prev.year + 1 : prev.year;
      return { year, month };
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">
          Calendrier
        </h1>
        <p className="text-sm text-graphite font-mono">
          Événements, échéances et rendez-vous
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="col-span-2">
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <button onClick={prevMonth} className="p-1 hover:text-navy">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-display uppercase tracking-wider text-navy">
                {MONTH_NAMES_FR[viewDate.month]} {viewDate.year}
              </h2>
              <button onClick={nextMonth} className="p-1 hover:text-navy">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-line">
              {DAY_NAMES_FR.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-mono uppercase tracking-widest text-graphite">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {/* Padding cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`pad-${i}`} className="h-20 border-b border-r border-line bg-paper/50" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayEvents = eventsByDate[dateStr] || [];
                const isToday = dateStr === today.toISOString().split("T")[0];
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`h-20 border-b border-r border-line p-1.5 text-left transition-colors hover:bg-paper ${
                      isSelected ? "bg-navy/5 border-navy" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 text-xs font-mono rounded-full mb-1 ${
                        isToday ? "bg-navy text-paper font-bold" : "text-ink"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`${EVENT_COLORS[event.type]} text-white text-xs font-mono px-1 py-0.5 rounded truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-graphite font-mono pl-1">
                          +{dayEvents.length - 2}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day events */}
          {selectedDate && (
            <div className="mt-4 bg-white border border-line rounded-lg p-5">
              <h3 className="text-sm font-mono uppercase tracking-widest text-graphite mb-4">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-graphite font-mono">Aucun événement ce jour.</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((event) => (
                    <div key={event.id} className="flex gap-3 items-start">
                      <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${EVENT_COLORS[event.type]}`} />
                      <div>
                        <p className="font-medium text-ink text-sm">{event.title}</p>
                        {event.description && (
                          <p className="text-xs text-graphite mt-0.5">{event.description}</p>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1 text-xs text-graphite mt-0.5">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Upcoming events */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">
              Légende
            </h3>
            <div className="space-y-2">
              {Object.entries(EVENT_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
                  <span className="text-xs font-mono text-ink">
                    {EVENT_LABELS[type as EventType]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4">
              Prochains événements
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex gap-3 items-start pb-3 border-b border-line last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${EVENT_COLORS[event.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink leading-tight truncate">
                      {event.isImportant && <Star className="inline w-3 h-3 text-gold mr-1" />}
                      {event.title}
                    </p>
                    <p className="text-xs font-mono text-graphite mt-0.5">
                      {new Date(event.startDate + "T12:00:00").toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-graphite font-mono">Aucun événement à venir.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
