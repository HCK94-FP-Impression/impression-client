import { CloudUpload, Plus, Trash2 } from "lucide-react";
import type { ProfileData } from "../../profile/data";

type ProfileEditorProps = {
  editor: ProfileData;
  isEditing: boolean;
  selectedImage: File | null;
  onSelectImage: (file: File | null) => void;
  onFieldChange: <K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K],
  ) => void;
  onExperienceChange: (
    index: number,
    key: "role" | "company" | "meta",
    value: string,
  ) => void;
  onEducationChange: (
    index: number,
    key: "title" | "school" | "meta",
    value: string,
  ) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
};

export default function ProfileEditor({
  editor,
  isEditing,
  selectedImage,
  onSelectImage,
  onFieldChange,
  onExperienceChange,
  onEducationChange,
  onAddExperience,
  onRemoveExperience,
  onAddEducation,
  onRemoveEducation,
}: ProfileEditorProps) {
  return (
    <section className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
            Editor
          </p>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-gray-900">
            Update Profile Data
          </h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Name
          </label>
          <input
            value={editor.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            disabled={!isEditing}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Upload Photo
          </label>
          <label className="mt-2 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 transition hover:border-indigo-300">
            <span>{selectedImage ? selectedImage.name : "Choose image"}</span>
            <CloudUpload size={14} />
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) =>
                onSelectImage(event.target.files?.[0] || null)
              }
              disabled={!isEditing}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Role
          </label>
          <input
            value={editor.role}
            onChange={(event) => onFieldChange("role", event.target.value)}
            disabled={!isEditing}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Location
          </label>
          <input
            value={editor.location}
            onChange={(event) => onFieldChange("location", event.target.value)}
            disabled={!isEditing}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Summary
          </label>
          <textarea
            value={editor.summary}
            onChange={(event) => onFieldChange("summary", event.target.value)}
            rows={4}
            disabled={!isEditing}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Skills (comma separated)
          </label>
          <input
            value={editor.skills.join(", ")}
            onChange={(event) =>
              onFieldChange(
                "skills",
                event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            disabled={!isEditing}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            Criteria (comma separated)
          </label>
          <input
            value={editor.criteria.join(", ")}
            onChange={(event) =>
              onFieldChange(
                "criteria",
                event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            disabled={!isEditing}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
              Experience
            </label>
            <button
              type="button"
              onClick={onAddExperience}
              disabled={!isEditing}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-60"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {editor.experience.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className="rounded-2xl border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Item {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemoveExperience(index)}
                    disabled={!isEditing}
                    className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
                <div className="mt-3 grid gap-2">
                  <input
                    value={item.role}
                    onChange={(event) =>
                      onExperienceChange(index, "role", event.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Role"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
                  />
                  <input
                    value={item.company}
                    onChange={(event) =>
                      onExperienceChange(index, "company", event.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Company"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
                  />
                  <input
                    value={item.meta}
                    onChange={(event) =>
                      onExperienceChange(index, "meta", event.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Duration"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
              Education
            </label>
            <button
              type="button"
              onClick={onAddEducation}
              disabled={!isEditing}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-60"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {editor.education.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-2xl border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Item {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemoveEducation(index)}
                    disabled={!isEditing}
                    className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
                <div className="mt-3 grid gap-2">
                  <input
                    value={item.title}
                    onChange={(event) =>
                      onEducationChange(index, "title", event.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Degree"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
                  />
                  <input
                    value={item.school}
                    onChange={(event) =>
                      onEducationChange(index, "school", event.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="School"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
                  />
                  <input
                    value={item.meta}
                    onChange={(event) =>
                      onEducationChange(index, "meta", event.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Meta"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-900 outline-none transition focus:border-indigo-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
