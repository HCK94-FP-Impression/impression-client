"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  LoaderCircle,
  MapPin,
  Target,
} from "lucide-react";
import { api } from "@/constants/constants";

type Job = {
  id?: string;
  link: string;
  title: string;
  company: string;
  location: string;
  snippet?: string;
};

type JoobleResponse = {
  jobs: Job[];
};

export default function JobRecommendations() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        const res = await api.get<JoobleResponse>("/jobs");
        setJobs(res.data.jobs || []);
      } catch {
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="lg:col-span-12 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">
              Job Market
            </p>
            <h2 className="text-xl font-black tracking-tight text-gray-900">
              Recommended Jobs
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <LoaderCircle size={16} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Loading...
            </span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-gray-100 bg-gray-50 p-6 h-40"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-12 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
      <div className="mb-5">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">
          Job Market
        </p>
        <h2 className="text-xl font-black tracking-tight text-gray-900">
          Recommended Jobs
        </h2>
      </div>

      {jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id ?? job.link}
              className="group flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="rounded-xl bg-gray-50 p-2.5 group-hover:bg-indigo-50 transition-colors">
                  <BriefcaseBusiness
                    size={18}
                    className="text-gray-400 group-hover:text-indigo-500 transition-colors"
                  />
                </div>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-gray-200 p-2 transition-all hover:bg-indigo-950 hover:border-indigo-950 hover:text-white"
                >
                  <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="flex-1">
                <h4 className="mb-1 text-sm font-black tracking-tight text-gray-900 line-clamp-2">
                  {job.title}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  {job.company}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4 text-[10px] font-bold uppercase text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} />
                  {job.location || "Global"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-100 py-14 text-center">
          <Target size={28} className="mx-auto mb-3 text-gray-200" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            No matching jobs found
          </p>
        </div>
      )}
    </div>
  );
}
