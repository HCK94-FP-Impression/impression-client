import type { ComponentType, InputHTMLAttributes } from "react";

type IconType = ComponentType<{ size?: number; className?: string }>;

type AuthInputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: IconType;
  wrapperClassName?: string;
  inputClassName?: string;
};

export default function AuthInputField({
  label,
  icon: Icon,
  wrapperClassName = "px-4 py-4",
  inputClassName = "",
  ...inputProps
}: AuthInputFieldProps) {
  return (
    <div className="space-y-2">
      <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <div
        className={`flex items-center gap-3 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-indigo-600 ${wrapperClassName}`}
      >
        {Icon ? <Icon size={18} className="text-gray-400" /> : null}
        <input
          className={`w-full bg-transparent text-sm font-bold text-gray-800 outline-none placeholder-gray-300 ${inputClassName}`}
          {...inputProps}
        />
      </div>
    </div>
  );
}
