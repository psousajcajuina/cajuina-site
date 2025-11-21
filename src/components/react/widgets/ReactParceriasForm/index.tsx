import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ESTADOS_BRASIL } from './constants';
import { FormField } from './FormField';
import { parceriasSchema, type ParceriasFormData } from './validators';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptchaCheckbox,
} from '@google-recaptcha/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';

interface Props {
  onSubmitSuccess?: () => void;
  recaptchaSiteKey?: string;
  apiUrl?: string;
}
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

const actions = { SOLICITACAO_PARCERIAS: 'SOLICITACAO_PARCERIAS' } as const;

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
  } = useForm<ParceriasFormData>({
    resolver: zodResolver(parceriasSchema),
  });

  const validateCaptcha = async (token: string | null) => {
    setToken(token);
    setRecaptchaError(null);
    const req = await fetch(`${apiUrl}/shared/recaptcha/validate`, {
      method: 'POST',
      body: JSON.stringify({ token, action: actions.SOLICITACAO_PARCERIAS }),
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

  const onSubmit = async (data: ParceriasFormData) => {
    try {
      const formData = new FormData();
      const captchaIsValid = await validateCaptcha(token);

      if (captchaIsValid) {
        Object.entries(data).forEach(([key, val]) => {
          if (key === 'files' && val && val instanceof FileList) {
            Array.from(val).forEach((file: File) =>
              formData.append('files', file)
            );
          } else if (val !== null && typeof val !== 'boolean') {
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
          <FormField
            className="w-full md:w-96"
            register={register}
            errors={errors}
            name="requestType"
            type="select"
            options={[
              { value: '', label: 'Tipo de solicitação' },
              { value: 'patrocinio', label: 'Patrocínio' },
              { value: 'doacao', label: 'Doação' },
              { value: 'parceria', label: 'Parceria' },
            ]}
            required
          />

          {/* Informações pessoais  */}
          <div>
            <h3 className="text-caju-heading-primary font-bevan mb-4 text-2xl font-normal uppercase md:mb-6 md:text-4xl">
              Informações Pessoais
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

          {/* Instituições */}
          <div>
            <h3 className="text-caju-heading-primary font-bevan mb-4 text-2xl font-normal uppercase md:mb-6 md:text-4xl">
              Instituições
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                register={register}
                errors={errors}
                name="institutionName"
                type="text"
                placeholder="Nome da instituição"
                className="col-span-1 md:col-span-2"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="institutionEmail"
                type="email"
                placeholder="Email da institucional (nome@email.com)"
                className="col-span-1"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="institutionPhone"
                type="text"
                placeholder="Telefone da instituição (DDD) 00000-0000"
                className="col-span-1"
                required
              />
            </div>
          </div>

          {/* Evento */}
          <div>
            <h3 className="text-caju-heading-primary font-bevan mb-4 text-2xl font-normal uppercase md:mb-6 md:text-4xl">
              Evento/Projeto
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Nome do evento */}
              <FormField
                register={register}
                errors={errors}
                name="eventName"
                type="text"
                placeholder="Digite o nome do evento"
                className="col-span-1 md:col-span-2 lg:col-span-3"
                required
              />
              {/* abrangencia */}
              <FormField
                register={register}
                errors={errors}
                name="eventScope"
                type="select"
                options={[
                  { value: '', label: 'Abrangência' },
                  { value: 'Local', label: 'Local' },
                  { value: 'Regional', label: 'Regional' },
                  { value: 'Estadual', label: 'Estadual' },
                  { value: 'Nacional', label: 'Nacional' },
                ]}
                className="col-span-1 md:col-span-2 lg:col-span-2"
                required
              />
              {/* Estado */}
              <FormField
                register={register}
                errors={errors}
                name="eventState"
                type="select"
                options={ESTADOS_BRASIL}
                className="col-span-1"
                required
              />
              {/* Cidade */}
              <FormField
                register={register}
                errors={errors}
                name="eventCity"
                type="text"
                placeholder="Cidade"
                className="col-span-1 md:col-span-1 lg:col-span-2"
                required
              />
              {/* Data */}
              <FormField
                register={register}
                control={control}
                errors={errors}
                name="eventDate"
                type="date"
                label="Data do evento"
                placeholder="Data do evento/projeto"
                className="col-span-1"
                required
              />
              {/* Hora */}
              <FormField
                register={register}
                control={control}
                errors={errors}
                name="eventTime"
                type="time"
                placeholder="Hora do evento/projeto"
                className="col-span-1"
                required
              />
              {/* Objetivo */}
              <FormField
                register={register}
                errors={errors}
                name="eventObjective"
                type="textarea"
                placeholder="Informe o objetivo do evento/projeto e se há relação com as áreas da cultura, educação,
esporte, meio ambiente ou social."
                rows={4}
                className="col-span-1 md:col-span-2 lg:col-span-5"
                required
              />
              {/* Publico alvo */}
              <FormField
                register={register}
                errors={errors}
                name="eventTargetAudience"
                type="textarea"
                placeholder="Detalhe o público alvo do evento/projeto, faixa etária, profissão, interesses e localização."
                className="col-span-1 md:col-span-2 lg:col-span-5"
                required
              />
              {/* Descreva sua solicitação */}
              <FormField
                register={register}
                errors={errors}
                name="eventRequestDetails"
                type="textarea"
                placeholder="Especifique qual apoio o solicitante espera receber da Cajuína São Geraldo."
                rows={6}
                className="col-span-1 md:col-span-2 lg:col-span-5"
                required
              />
              {/* Data para receber materiais */}
              <FormField
                register={register}
                control={control}
                errors={errors}
                name="materialPickupDate"
                type="date"
                label="Data para receber produto"
                placeholder="Data para receber produto"
                className="col-span-1 md:col-span-1 lg:col-span-2"
                required
              />
              {/* Documentos */}
              <FormField
                register={register}
                errors={errors}
                name="files"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="col-span-1 md:col-span-1 lg:col-span-2"
                placeholder="Anexar documentos"
                multiple
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
              action={actions.SOLICITACAO_PARCERIAS}
              id="PARCERIA_FORM"
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

export default function ReactParceriasForm({
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
