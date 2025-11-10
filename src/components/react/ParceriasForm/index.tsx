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

function Form({ onSubmitSuccess }: Props) {
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParceriasFormData>({
    resolver: zodResolver(parceriasSchema),
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
    <div className="mx-auto w-full px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white">
        <div className="mb-8 flex flex-col gap-20 [&_div_h3]:mb-6!">
          <FormField
            className="w-96"
            register={register}
            errors={errors}
            name="tipo_solicitacao"
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
            <h3 className="text-caju-heading-primary font-bevan text-4xl font-normal uppercase">
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                register={register}
                errors={errors}
                name="nome"
                type="text"
                placeholder="Nome Completo"
                className="col-span-2"
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
            <h3 className="text-caju-heading-primary font-bevan col-span-2 text-4xl font-normal uppercase">
              Instituições
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                register={register}
                errors={errors}
                name="nome_instituicao"
                type="text"
                placeholder="Nome da instituição"
                className="col-span-2"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="email_instituicao"
                type="text"
                placeholder="Email da institucional (nome@email.com)"
                className="col-span-1 col-start-1"
                required
              />
              <FormField
                register={register}
                errors={errors}
                name="telefone_instituicao"
                type="text"
                placeholder="Telefone da instituição (DDD) 00000-0000"
                className="col-span-1 col-start-2"
                required
              />
            </div>
          </div>

          {/* Evento */}
          <div>
            <h3 className="text-caju-heading-primary font-bevan text-4xl font-normal uppercase">
              Evento/Projeto
            </h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              {/* Nome do evento */}
              <FormField
                register={register}
                errors={errors}
                name="evento_nome"
                type="text"
                placeholder="Digite o nome do evento"
                className="col-span-3"
                required
              />
              {/* abrangencia */}
              <FormField
                register={register}
                errors={errors}
                name="evento_abrangencia"
                type="select"
                options={[
                  { value: '', label: 'Abrangência' },
                  { value: 'Local', label: 'Local' },
                  { value: 'Regional', label: 'Regional' },
                  { value: 'Estadual', label: 'Estadual' },
                  { value: 'Nacional', label: 'Nacional' },
                ]}
                className="col-span-2"
                required
              />
              {/* Estado */}
              <FormField
                register={register}
                errors={errors}
                name="evento_estado"
                type="select"
                options={ESTADOS_BRASIL}
                className="col-span-1 row-start-2"
                required
              />
              {/* Cidade */}
              <FormField
                register={register}
                errors={errors}
                name="evento_cidade"
                type="text"
                placeholder="Cidade"
                className="col-span-2 row-start-2"
                required
              />
              {/* Data */}
              <FormField
                register={register}
                errors={errors}
                name="evento_data"
                type="text"
                placeholder="Data do evento/projeto"
                className="col-span-1 row-span-2"
                required
              />
              {/* Hora */}
              <FormField
                register={register}
                errors={errors}
                name="evento_horario"
                type="text"
                placeholder="Hora do evento/projeto"
                className="col-span-1 row-span-2"
                required
              />
              {/* Objetivo */}
              <FormField
                register={register}
                errors={errors}
                name="evento_objetivo"
                type="textarea"
                placeholder="Informe o objetivo do evento/projeto e se há relação com as áreas da cultura, educação,
esporte, meio ambiente ou social."
                rows={4}
                className="col-span-5"
                required
              />
              {/* Publico alvo */}
              <FormField
                register={register}
                errors={errors}
                name="evento_publico"
                type="textarea"
                placeholder="Detalhe o público alvo do evento/projeto, faixa etária, profissão, interesses e localização."
                className="col-span-5"
                required
              />
              {/* Descreva sua solicitação */}
              <FormField
                register={register}
                errors={errors}
                name="evento_solicitacao"
                type="textarea"
                placeholder="Especifique qual apoio o solicitante espera receber da Cajuína São Geraldo."
                rows={6}
                className="col-span-5"
                required
              />
              {/* Data para receber materiais */}
              <FormField
                register={register}
                errors={errors}
                name="evento_dataMateriais"
                type="text"
                placeholder="Data para receber produto"
                className="col-span-2"
                required
              />
              {/* Documentos */}
              <FormField
                register={register}
                errors={errors}
                name="anexo"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="col-span-2"
                placeholder="Anexar documentos"
                multiple
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          {/* reCAPTCHA */}
          <GoogleReCaptchaCheckbox
            onChange={setToken}
            action="PARCERIA"
            id="PARCERIA_FORM"
          />
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-yellow w-full max-w-80 rounded-lg px-8 py-4 text-lg font-semibold text-white transition-colors focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </div>
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
      <Form />
    </GoogleReCaptchaProvider>
  );
}
