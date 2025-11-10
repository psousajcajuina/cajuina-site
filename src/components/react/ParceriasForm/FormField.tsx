import type { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps<TFormData extends Record<string, any>> {
  register: UseFormRegister<TFormData>;
  errors: FieldErrors<TFormData>;
  name: Path<TFormData>;
  label?: string | null;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'checkbox';
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  hideLabel?: boolean;
  accept?: string;
  multiple?: boolean;
  rows?: number;
  className?: string;
}

export function FormField<TFormData extends Record<string, any>>({
  register,
  errors,
  name,
  label = null,
  type = 'text',
  placeholder,
  options,
  required = false,
  hideLabel = false,
  accept,
  multiple,
  rows = 6,
  className,
}: FormFieldProps<TFormData>) {
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  // Adiciona asterisco vermelho no placeholder se obrigatório e sem label
  // Usamos um caractere especial para indicar obrigatoriedade
  const finalPlaceholder =
    !label && required && placeholder ? `${placeholder} *` : placeholder;

  const requiredClass = !label && required ? 'required-field' : '';

  if (type === 'checkbox') {
    return (
      <div className={twMerge('w-full', className)}>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register(name)}
            className="text-caju-heading-primary focus:ring-caju-heading-primary/20 mt-1 h-5 w-5 rounded border-gray-300 focus:ring-2"
          />
          {label && (
            <span className="text-caju-heading-primary text-sm">{label}</span>
          )}
        </label>
        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className={twMerge('w-full', className)}>
      {!hideLabel && label && (
        <label className="text-caju-heading-primary mb-2 block text-sm font-medium">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          {...register(name)}
          rows={rows}
          maxLength={2000}
          placeholder={finalPlaceholder}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter placeholder-caju-heading-primary w-full rounded-lg border border-gray-300 px-4 py-3 text-[24px] font-bold focus:ring-2 focus:outline-none"
        />
      ) : type === 'select' ? (
        <select
          {...register(name)}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter w-full truncate rounded-lg border border-gray-300 px-4 py-3 text-[24px] font-bold focus:ring-2 focus:outline-none"
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
          className="text-caju-heading-primary focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 font-inter w-full truncate rounded-lg border border-gray-300 px-4 py-3 text-[24px] font-bold file:mr-4 file:rounded-md file:border-0 file:bg-[#828282] file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-[#828282] focus:ring-2 focus:outline-none"
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          maxLength={400}
          placeholder={finalPlaceholder}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter placeholder-caju-heading-primary w-full truncate rounded-lg border border-gray-300 px-4 py-3 text-[24px] font-bold focus:ring-2 focus:outline-none"
        />
      )}

      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
