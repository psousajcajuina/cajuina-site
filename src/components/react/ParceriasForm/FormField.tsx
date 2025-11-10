import type { ValidationError } from '@tanstack/react-form';

interface Option {
  value: string;
  label: string;
}

type FieldValidator<TValue> = {
  onChange?: (props: {
    value: TValue;
  }) => ValidationError | Promise<ValidationError>;
  onBlur?: (props: {
    value: TValue;
  }) => ValidationError | Promise<ValidationError>;
};

interface FormFieldProps<TFormData extends Record<string, any>, TName extends keyof TFormData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: TName;
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file';
  placeholder?: string;
  validators?: FieldValidator<TFormData[TName]>;
  options?: Option[];
  required?: boolean;
  hideLabel?: boolean;
  accept?: string;
  multiple?: boolean;
}

export function FormField<
  TFormData extends Record<string, any>,
  TName extends keyof TFormData,
>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  validators,
  options,
  required = false,
  hideLabel = false,
  accept,
  multiple,
}: FormFieldProps<TFormData, TName>) {
  return (
    <form.Field name={name as any} validators={validators}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(field: any) => (
        <div className="w-full">
          {!hideLabel && label && (
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </label>
          )}

          {type === 'textarea' ? (
            <textarea
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={6}
              maxLength={2000}
              placeholder={placeholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-caju-heading-primary focus:outline-none focus:ring-2 focus:ring-caju-heading-primary/20"
            />
          ) : type === 'select' ? (
            <select
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-caju-heading-primary focus:outline-none focus:ring-2 focus:ring-caju-heading-primary/20"
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
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.files)}
              multiple={multiple}
              accept={accept}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-caju-heading-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-caju-primary-dark focus:outline-none focus:ring-2 focus:ring-caju-heading-primary/20"
            />
          ) : (
            <input
              type={type}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={400}
              placeholder={placeholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-caju-heading-primary focus:outline-none focus:ring-2 focus:ring-caju-heading-primary/20"
            />
          )}

          {field.state.meta.errors && (
            <p className="mt-1 text-sm text-red-500">
              {field.state.meta.errors.join(', ')}
            </p>
          )}
        </div>
      )}
    </form.Field>
  );
}
