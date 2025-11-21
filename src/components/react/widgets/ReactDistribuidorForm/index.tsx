import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormField } from './FormField';
import { distribuidorSchema, type DistribuidorFormData } from './validators';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptchaCheckbox,
} from '@google-recaptcha/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

interface Props {
  onSubmitSuccess?: () => void;
  recaptchaSiteKey?: string;
  apiUrl?: string;
}

const actions = { SOLICITACAO_DISTRIBUIDOR: 'SOLICITACAO_DISTRIBUIDOR' } as const;

function Form({ onSubmitSuccess, apiUrl }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DistribuidorFormData>({
    resolver: zodResolver(distribuidorSchema),
  });

  const validateCaptcha = async (token: string | null) => {
    setToken(token);
    setRecaptchaError(null);
    const req = await fetch(`${apiUrl}/shared/recaptcha/validate`, {
      method: 'POST',
      body: JSON.stringify({ token, action: actions.SOLICITACAO_DISTRIBUIDOR }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!req.ok) {
      setRecaptchaError(
        'Falha ao validar reCAPTCHA. Por favor, tente novamente.'
      );
      return false;
    }

    return true;
  };

  const onSubmit = async (data: DistribuidorFormData) => {
    try {
      const formData = new FormData();
      const captchaIsValid = await validateCaptcha(token);

      if (captchaIsValid) {
        Object.entries(data).forEach(([key, val]) => {
          if (val !== null && typeof val !== 'boolean') {
            formData.append(key, String(val));
          } else if (typeof val === 'boolean') {
            formData.append(key, val ? 'true' : 'false');
          }
        });

        const response = await fetch(
          `${apiUrl}/shared/brevo-mail/submit-form`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (
            errorData.message &&
            (errorData.message.includes('reCAPTCHA') ||
              errorData.message.includes('token'))
          ) {
            setRecaptchaError(
              'Falha na validação do reCAPTCHA. Por favor, tente novamente.'
            );
            return;
          }
          throw new Error('Falha ao enviar formulário');
        }

        alert('Formulário enviado com sucesso!');
        onSubmitSuccess?.();
        reset();
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  };

  return (
    <div className="mx-auto w-full px-4 py-4 md:px-6 md:py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white">
        <div className="mb-6 flex flex-col gap-8 md:mb-8 md:gap-12">
          {/* Informações da Empresa  */}
          <div>
            <h3 className="text-caju-heading-primary font-bevan mb-4 text-2xl font-normal uppercase md:mb-6 md:text-4xl">
              Informações da Empresa
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                register={register}
                errors={errors}
                name="razaoSocial"
                type="text"
                placeholder="Razão Social"
                className="col-span-1 md:col-span-2"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="cnpj"
                type="text"
                placeholder="CNPJ"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="cidadeAtuacao"
                type="text"
                placeholder="Cidade de Atuação"
                required
              />
            </div>
          </div>
          {/* Informações de Contato  */}
          <div>
            <h3 className="text-caju-heading-primary font-bevan mb-4 text-2xl font-normal uppercase md:mb-6 md:text-4xl">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                register={register}
                errors={errors}
                name="name"
                type="text"
                placeholder="Nome Completo"
                className="col-span-1 md:col-span-2"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="email"
                type="email"
                placeholder="Email (seu@email.com)"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="whatsapp"
                type="tel"
                placeholder="Telefone (DDD) 00000-0000"
                required
              />
            </div>
          </div>
          {/* Termos */}
          <div className="font-inter flex flex-col items-stretch gap-4 md:flex-row md:items-center">
            <FormField
              register={register}
              errors={errors}
              name="acceptance"
              type="checkbox"
              label={
                <span>
                  Declaro que li e aceito a{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPrivacyModalOpen(true);
                    }}
                    className="text-caju-heading-primary hover:text-caju-red-primary cursor-pointer font-semibold underline"
                  >
                    Política de Privacidade e Proteção de Dados
                  </button>
                  .
                </span>
              }
              required
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start gap-4 md:flex-row">
          {/* reCAPTCHA */}
          <div className="flex flex-col gap-1">
            <GoogleReCaptchaCheckbox
              onChange={setToken}
              action={actions.SOLICITACAO_DISTRIBUIDOR}
              id="DISTRIBUIDOR_FORM"
            />
            {recaptchaError && (
              <span className="text-[#d32f2f]/70">{recaptchaError}</span>
            )}
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-yellow w-full rounded-lg px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-80 md:px-8 md:py-4 md:text-lg"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </div>
      </form>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default function ReactDistribuidorForm({
  recaptchaSiteKey,
  apiUrl,
}: Props) {
  return (
    <GoogleReCaptchaProvider
      type="v2-checkbox"
      siteKey={recaptchaSiteKey!}
      isEnterprise
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Form apiUrl={apiUrl} />
      </LocalizationProvider>
    </GoogleReCaptchaProvider>
  );
}
