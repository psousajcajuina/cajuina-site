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
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter placeholder-caju-heading-primary w-full rounded-lg border border-gray-300 px-3 py-2 text-base font-bold focus:ring-2 focus:outline-none md:px-4 md:py-3 md:text-[24px]"
        />
      ) : type === 'select' ? (
        <select
          {...register(name)}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter w-full truncate rounded-lg border border-gray-300 px-3 py-2 text-base font-bold focus:ring-2 focus:outline-none md:px-4 md:py-3 md:text-[24px]"
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
          className="text-caju-heading-primary focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 font-inter w-full truncate rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold file:mr-2 file:rounded-md file:border-0 file:bg-[#828282] file:px-3 file:py-1.5 file:text-xs file:text-white hover:file:bg-[#828282] focus:ring-2 focus:outline-none md:px-4 md:py-3 md:text-[24px] md:file:mr-4 md:file:px-4 md:file:py-2 md:file:text-sm"
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
                        'text-caju-heading-primary! font-inter! text-base! md:text-[20px]! font-bold! truncate!',
                    },
                    InputLabelProps: {
                      className:
                        'text-caju-heading-primary! font-inter! text-base! md:text-[20px]! font-bold! truncate!',
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
            className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter w-full truncate rounded-lg border border-gray-300 px-3 py-2 text-base font-bold focus:ring-2 focus:outline-none md:px-4 md:py-3 md:text-[24px]"
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
                        'text-caju-heading-primary! font-inter! text-base! md:text-[20px]! font-bold! truncate!',
                    },
                    InputLabelProps: {
                      className:
                        'text-caju-heading-primary! font-inter! text-base! md:text-[20px]! font-bold! truncate!',
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
            className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter w-full truncate rounded-lg border border-gray-300 px-3 py-2 text-base font-bold focus:ring-2 focus:outline-none md:px-4 md:py-3 md:text-[24px]"
          />
        )
      ) : (
        <input
          type={type}
          {...register(name)}
          maxLength={400}
          placeholder={finalPlaceholder}
          className="focus:border-caju-heading-primary focus:ring-caju-heading-primary/20 text-caju-heading-primary font-inter placeholder-caju-heading-primary w-full truncate rounded-lg border border-gray-300 px-3 py-2 text-base font-bold focus:ring-2 focus:outline-none md:px-4 md:py-3 md:text-[24px]"
        />
      )}

      {errorMessage && type !== 'date' && type !== 'time' && (
        <p className="text-xsm font-inter m-2 font-bold text-[#d32f2f]/70">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
