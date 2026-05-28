"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";

const SUGGESTED_SKILLS: { group: string; skills: string[] }[] = [
  {
    group: "Languages",
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Go",
      "Java",
      "Kotlin",
      "Swift",
      "Rust",
      "C++",
      "PHP",
      "Ruby",
    ],
  },
  {
    group: "Frontend",
    skills: [
      "React",
      "Vue",
      "Angular",
      "Next.js",
      "Nuxt.js",
      "Svelte",
      "Tailwind CSS",
      "HTML",
      "CSS",
    ],
  },
  {
    group: "Backend",
    skills: [
      "Node.js",
      "Express",
      "NestJS",
      "Django",
      "FastAPI",
      "Spring Boot",
      "Laravel",
      "GraphQL",
      "REST API",
    ],
  },
  {
    group: "Database",
    skills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "SQLite",
      "Elasticsearch",
      "Prisma",
      "Sequelize",
    ],
  },
  {
    group: "DevOps & Cloud",
    skills: [
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "Azure",
      "Linux",
      "CI/CD",
      "Terraform",
      "Nginx",
    ],
  },
  {
    group: "Tools & Others",
    skills: [
      "Git",
      "GitHub",
      "Figma",
      "Postman",
      "Jest",
      "Webpack",
      "Vite",
      "Agile",
      "Scrum",
    ],
  },
];

type Props = {
  value: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
};

const PALETTES = [
  "border-indigo-200 bg-indigo-50 text-indigo-700",
  "border-violet-200 bg-violet-50 text-violet-700",
  "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-cyan-200 bg-cyan-50 text-cyan-700",
  "border-amber-200 bg-amber-50 text-amber-700",
];

export default function SkillPicker({ value, onChange, disabled }: Props) {
  const [input, setInput] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  const toggleSuggestion = (skill: string) => {
    if (value.includes(skill)) {
      removeSkill(skill);
    } else {
      addSkill(skill);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
      setInput("");
      return;
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (!input.trim()) return;
    addSkill(input);
    setInput("");
  };

  return (
    <div className="space-y-4">
      {/* Selected skills */}
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Skills
        </label>

        {/* Input + selected chips */}
        <div
          className={`min-h-12 w-full flex flex-wrap gap-1.5 rounded-2xl border px-3 py-2.5 transition-all
          ${disabled ? "bg-gray-50 border-gray-100 opacity-40" : "bg-white/80 border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"}
        `}
        >
          {value.map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${PALETTES[i % PALETTES.length]}`}
            >
              {skill}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity text-[10px] cursor-pointer font-black"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {!disabled && (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={
                value.length === 0 ? "Type a skill and press Enter..." : ""
              }
              className="min-w-24 flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-300"
            />
          )}
        </div>
      </div>

      {/* Suggestions */}
      {!disabled && (
        <div className="mt-3 space-y-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
            Quick Add
          </p>
          {SUGGESTED_SKILLS.map((group) => (
            <div key={group.group}>
              <p className="mb-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-gray-300">
                {group.group}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => {
                  const selected = value.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSuggestion(skill)}
                      className={`cursor-pointer inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-all
                        ${
                          selected
                            ? "border-indigo-300 bg-indigo-100 text-indigo-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50"
                        }
                      `}
                    >
                      {!selected && <Plus size={8} className="opacity-50" />}
                      {skill}
                      {selected && (
                        <span className="text-[10px] font-black opacity-60">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
