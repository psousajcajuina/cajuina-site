import type {
  UseFormRegister,
  FieldErrors,
  Path,
  Control,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps<TFormData extends Record<string, any>> {
  register: UseFormRegister<TFormData>;
  control?: Control<TFormData>;
  errors: FieldErrors<TFormData>;
  name: Path<TFormData>;
  label?: React.ReactNode | null;
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'file'
    | 'checkbox'
    | 'date'
    | 'time';
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
  control,
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

  const baseInputClasses =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base font-semibold text-caju-heading-primary placeholder-gray-400 transition-all duration-200 focus:border-caju-heading-primary focus:outline-none focus:ring-2 focus:ring-caju-heading-primary/20 md:px-4 md:py-3 md:text-lg';

  if (type === 'checkbox') {
    return (
      <div className={twMerge('w-full', className)}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            {...register(name)}
            className="text-caju-heading-primary focus:ring-caju-heading-primary/20 mt-1 h-5 w-5 rounded border-gray-300 focus:ring-2"
          />
          {label && (
            <span className="text-caju-heading-primary text-sm select-none">
              {label}
            </span>
          )}
        </label>
        {errorMessage && (
          <p className="font-inter mt-1 text-sm text-red-600/75">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={twMerge('w-full', className)}>
      {!hideLabel && label && type !== 'date' && (
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
          className={twMerge(baseInputClasses, 'font-inter resize-y')}
        />
      ) : type === 'select' ? (
        <div className="relative">
          <select
            {...register(name)}
            className={twMerge(baseInputClasses, 'font-inter appearance-none')}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      ) : type === 'file' ? (
        <input
          type="file"
          {...register(name)}
          multiple={multiple}
          accept={accept}
          className={twMerge(
            baseInputClasses,
            'font-inter file:mr-4 file:rounded-md file:border-0 file:bg-gray-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-700'
          )}
        />
      ) : type === 'date' ? (
        control ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <DatePicker
                label={label || 'Data'}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errorMessage,
                    helperText: errorMessage,
                    InputProps: {
                      className:
                        'text-caju-heading-primary! font-inter! text-base! md:text-lg! font-semibold! rounded-lg! bg-white!',
                    },
                    InputLabelProps: {
                      className:
                        'text-gray-500! font-inter! text-base! md:text-lg!',
                    },
                  },
                }}
              />
            )}
          />
        ) : (
          <input
            type="date"
            {...register(name)}
            className={twMerge(baseInputClasses, 'font-inter')}
          />
        )
      ) : type === 'time' ? (
        control ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <TimePicker
                label={label || 'Hora'}
                value={field.value ? dayjs(field.value, 'HH:mm') : null}
                onChange={(time) => field.onChange(time?.format('HH:mm'))}
                format="HH:mm"
                ampm={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errorMessage,
                    helperText: errorMessage,
                    InputProps: {
                      className:
                        'text-caju-heading-primary! font-inter! text-base! md:text-lg! font-semibold! rounded-lg! bg-white!',
                    },
                    InputLabelProps: {
                      className:
                        'text-gray-500! font-inter! text-base! md:text-lg!',
                    },
                  },
                }}
              />
            )}
          />
        ) : (
          <input
            type="time"
            {...register(name)}
            className={twMerge(baseInputClasses, 'font-inter')}
          />
        )
      ) : (
        <input
          type={type}
          {...register(name)}
          maxLength={400}
          placeholder={finalPlaceholder}
          className={twMerge(baseInputClasses, 'font-inter')}
        />
      )}

      {errorMessage && type !== 'date' && type !== 'time' && (
        <p className="font-inter mt-1 text-sm text-red-600/75">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
