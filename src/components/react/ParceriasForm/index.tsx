import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { ESTADOS_BRASIL } from './constants';
import { FormField } from './FormField';
import { parceriasSchema, type ParceriasFormData } from './validators';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptchaCheckbox,
} from '@google-recaptcha/react';

interface Props {
  onSubmitSuccess?: () => void;
  recaptchaSiteKey?: string;
}

function Form({ onSubmitSuccess, recaptchaSiteKey }: Props) {
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParceriasFormData>({
    resolver: zodResolver(parceriasSchema),
    // defaultValues: {
    //   nome: '',
    //   email: '',
    //   whatsapp: '',
    //   tipo_solicitacao: '',
    //   nome_instituicao: '',
    //   evento_nome: '',
    //   evento_estado: '',
    //   evento_cidade: '',
    //   evento_data: '',
    //   evento_horario: '',
    //   evento_objetivo: '',
    //   evento_publico: '',
    //   evento_abrangencia: '',
    //   evento_solicitacao: '',
    //   evento_dataMateriais: '',
    //   anexo: null,
    //   acceptance: false,
    // },
  });

  const onSubmit = async (data: ParceriasFormData) => {
    try {
      // Obter o token do reCAPTCHA
      console.log('Form submitted:', data);
      console.log('reCAPTCHA token:', token);

      const formData = new FormData();

      // Adicionar o token do reCAPTCHA
      formData.append('recaptcha_token', token || '');

      Object.entries(data).forEach(([key, val]) => {
        if (key === 'anexo' && val && val instanceof FileList) {
          Array.from(val).forEach((file: File) =>
            formData.append('anexo', file)
          );
        } else if (val !== null && typeof val !== 'boolean') {
          formData.append(key, String(val));
        } else if (typeof val === 'boolean') {
          formData.append(key, val ? '1' : '0');
        }
      });

      alert('Formulário enviado com sucesso!');
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-6 shadow-lg lg:p-12"
      >
        <h1 className="text-caju-heading-primary mb-8 text-center text-3xl font-bold lg:text-4xl">
          Formulário de Parcerias
        </h1>

        <div className="mb-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Dados Pessoais
            </h2>

            <FormField
              register={register}
              errors={errors}
              name="nome"
              label="Nome completo"
              type="text"
              placeholder="Digite seu nome completo"
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="whatsapp"
              label="WhatsApp"
              type="tel"
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Informações da Instituição
            </h2>

            <FormField
              register={register}
              errors={errors}
              name="tipo_solicitacao"
              label="Tipo de solicitação"
              type="select"
              options={[
                { value: '', label: 'Selecione o tipo' },
                { value: 'Patrocínio', label: 'Patrocínio' },
                { value: 'Doação', label: 'Doação' },
                { value: 'Parceria', label: 'Parceria' },
              ]}
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="nome_instituicao"
              label="Nome da instituição/evento"
              type="text"
              placeholder="Digite o nome da instituição"
              required
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Dados do Evento
            </h2>

            <FormField
              register={register}
              errors={errors}
              name="evento_nome"
              label="Nome do evento"
              type="text"
              placeholder="Digite o nome do evento"
              required
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <FormField
                register={register}
                errors={errors}
                name="evento_estado"
                label="Estado"
                type="select"
                options={ESTADOS_BRASIL}
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="evento_cidade"
                label="Cidade"
                type="text"
                placeholder="Digite a cidade"
                required
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <FormField
                register={register}
                errors={errors}
                name="evento_data"
                label="Data do evento"
                type="text"
                placeholder="DD/MM/AAAA"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="evento_horario"
                label="Horário"
                type="text"
                placeholder="HH:MM"
                required
              />
            </div>

            <FormField
              register={register}
              errors={errors}
              name="evento_objetivo"
              label="Objetivo do evento"
              type="textarea"
              placeholder="Descreva o objetivo do evento"
              rows={4}
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="evento_publico"
              label="Público-alvo"
              type="text"
              placeholder="Ex: Jovens, adultos, idosos..."
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="evento_abrangencia"
              label="Abrangência do evento"
              type="select"
              options={[
                { value: '', label: 'Selecione' },
                { value: 'Local', label: 'Local' },
                { value: 'Regional', label: 'Regional' },
                { value: 'Estadual', label: 'Estadual' },
                { value: 'Nacional', label: 'Nacional' },
              ]}
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="evento_solicitacao"
              label="O que está sendo solicitado?"
              type="textarea"
              placeholder="Descreva sua solicitação"
              rows={6}
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="evento_dataMateriais"
              label="Data para recolhimento de materiais"
              type="text"
              placeholder="DD/MM/AAAA"
              required
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Documentos</h2>
            <FormField
              register={register}
              errors={errors}
              name="anexo"
              label="Anexar documentos (PDF, imagens)"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              required
            />
          </div>

          <FormField
            register={register}
            errors={errors}
            name="acceptance"
            type="checkbox"
            label="Estou ciente da Política de Privacidade"
          />
        </div>

        {/* reCAPTCHA */}
        <div className="mb-6 flex justify-center">
          <GoogleReCaptchaCheckbox
            onChange={setToken}
            action="PARCERIA"
            id="PARCERIA_FORM"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-caju-heading-primary hover:bg-caju-primary-dark focus:ring-caju-heading-primary/30 w-full rounded-lg px-8 py-4 text-lg font-semibold text-white transition-colors focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </form>
    </div>
  );
}

export default function ParceriasForm({ recaptchaSiteKey }: Props) {
  return (
    <GoogleReCaptchaProvider
      type="v2-checkbox"
      siteKey={recaptchaSiteKey!}
      isEnterprise
    >
      <Form recaptchaSiteKey={recaptchaSiteKey} />
    </GoogleReCaptchaProvider>
  );
}
