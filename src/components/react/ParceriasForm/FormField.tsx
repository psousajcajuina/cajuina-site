import type { UseFormRegister, FieldErrors, Path } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps<TFormData extends Record<string, any>> {
  register: UseFormRegister<TFormData>;
  errors: FieldErrors<TFormData>;
  name: Path<TFormData>;
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'checkbox';
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  hideLabel?: boolean;
  accept?: string;
  multiple?: boolean;
  rows?: number;
}

export function FormField<TFormData extends Record<string, any>>({
  register,
  errors,
  name,
  label,
  type = 'text',
  placeholder,
  options,
  required = false,
  hideLabel = false,
  accept,
  multiple,
  rows = 6,
}: FormFieldProps<TFormData>) {
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  if (type === 'checkbox') {
    return (
      <div className="w-full">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register(name)}
            className="text-caju-heading-primary focus:ring-caju-heading-primary/20 mt-1 h-5 w-5 rounded border-gray-300 focus:ring-2"
          />
          {label && <span className="text-sm text-gray-700">{label}</span>}
        </label>
        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {!hideLabel && label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          {...register(name)}
          rows={rows}
          maxLength={2000}
          placeholder={placeholder}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none"
        />
      ) : type === 'select' ? (
        <select
          {...register(name)}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:outline-none"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'file' ? (
        <input
          type="file"
          {...register(name)}
          multiple={multiple}
          accept={accept}
          className="file:bg-caju-heading-primary hover:file:bg-caju-primary-dark focus:ring-caju-heading-primary/20 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:ring-2 focus:outline-none"
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          maxLength={400}
          placeholder={placeholder}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none"
        />
      )}

      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
