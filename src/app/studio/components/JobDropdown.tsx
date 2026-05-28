"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Briefcase, Check } from "lucide-react";

const JOB_OPTIONS: { group: string; jobs: string[] }[] = [
  {
    group: "Development",
    jobs: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "Mobile Developer",
      "Game Developer",
      "Embedded Systems Engineer",
    ],
  },
  {
    group: "Infrastructure & Cloud",
    jobs: [
      "DevOps Engineer",
      "Cloud Engineer",
      "Site Reliability Engineer",
      "Network Engineer",
      "System Administrator",
      "Database Administrator",
    ],
  },
  {
    group: "Security",
    jobs: ["Cybersecurity Engineer", "Penetration Tester", "Security Analyst"],
  },
  {
    group: "Data & AI",
    jobs: [
      "Data Analyst",
      "Data Engineer",
      "Data Scientist",
      "Machine Learning Engineer",
      "AI Engineer",
      "Business Intelligence Analyst",
    ],
  },
  {
    group: "Design & Product",
    jobs: ["UI/UX Designer", "Product Designer", "Product Manager"],
  },
  {
    group: "Quality & Testing",
    jobs: ["QA Engineer", "QA Automation Engineer"],
  },
  {
    group: "Architecture & Leadership",
    jobs: ["Software Architect", "Tech Lead", "Engineering Manager", "CTO"],
  },
  {
    group: "Support & Others",
    jobs: [
      "IT Support Engineer",
      "Technical Support Engineer",
      "IT Project Manager",
      "IT Consultant",
      "Scrum Master",
      "Technical Writer",
    ],
  },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function JobDropdown({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = search.trim()
    ? JOB_OPTIONS.map((group) => ({
        ...group,
        jobs: group.jobs.filter((job) =>
          job.toLowerCase().includes(search.toLowerCase()),
        ),
      })).filter((group) => group.jobs.length > 0)
    : JOB_OPTIONS;

  const handleSelect = (job: string) => {
    onChange(job);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all outline-none
          ${open ? "border-indigo-400 ring-2 ring-indigo-100 bg-white" : "border-gray-200 bg-white/80"}
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-indigo-300"}
          ${!value ? "text-gray-300" : "text-gray-900"}
        `}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-lg transition-colors ${value ? "bg-indigo-50 text-indigo-500" : "bg-gray-100 text-gray-300"}`}
          >
            <Briefcase size={12} />
          </div>
          <span className="truncate">{value || "Select your target job"}</span>
        </div>
        <ChevronDown
          size={15}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300"
            />
          </div>

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                No results found
              </div>
            ) : (
              filtered.map((group) => (
                <div key={group.group}>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                      {group.group}
                    </span>
                  </div>
                  {group.jobs.map((job) => (
                    <button
                      key={job}
                      type="button"
                      onClick={() => handleSelect(job)}
                      className={`w-full cursor-pointer flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-semibold transition-colors
                        ${
                          value === job
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <span>{job}</span>
                      {value === job && (
                        <Check size={13} className="shrink-0 text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
