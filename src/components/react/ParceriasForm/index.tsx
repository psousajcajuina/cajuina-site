import { useForm } from '@tanstack/react-form';
import { parceriasValidators } from './validators';
import { FormField } from './FormField';
import { ESTADOS_BRASIL } from './constants';

interface Props {
  onSubmitSuccess?: () => void;
}

type ParceriasFormData = {
  nome: string;
  email: string;
  whatsapp: string;
  tipo_solicitacao: string;
  nome_instituicao: string;
  evento_nome: string;
  evento_estado: string;
  evento_cidade: string;
  evento_data: string;
  evento_horario: string;
  evento_objetivo: string;
  evento_publico: string;
  evento_abrangencia: string;
  evento_solicitacao: string;
  evento_dataMateriais: string;
  anexo: FileList | null;
  acceptance: boolean;
};

export default function ParceriasForm({ onSubmitSuccess }: Props) {
  const form = useForm({
    defaultValues: {
      nome: '',
      email: '',
      whatsapp: '',
      tipo_solicitacao: '',
      nome_instituicao: '',
      evento_nome: '',
      evento_estado: '',
      evento_cidade: '',
      evento_data: '',
      evento_horario: '',
      evento_objetivo: '',
      evento_publico: '',
      evento_abrangencia: '',
      evento_solicitacao: '',
      evento_dataMateriais: '',
      anexo: null as FileList | null,
      acceptance: false,
    } satisfies ParceriasFormData,
    onSubmit: async ({ value }) => {
      try {
        console.log('Form submitted:', value);
        
        // TODO: Implementar envio para API
        const formData = new FormData();
        
        (Object.entries(value) as [keyof ParceriasFormData, any][]).forEach(([key, val]) => {
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
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Informações do Solicitante */}
        <div className="space-y-6">
          <FormField form={form} name="nome" label="Nome do Solicitante" validators={parceriasValidators.nome} required />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField form={form} name="email" type="email" label="E-mail do Solicitante" validators={parceriasValidators.email} required />
            <FormField form={form} name="whatsapp" type="tel" label="Telefone do Solicitante" validators={parceriasValidators.whatsapp} required />
          </div>

          <FormField
            form={form}
            name="tipo_solicitacao"
            type="select"
            label="Tipo de Solicitação"
            validators={parceriasValidators.tipo_solicitacao}
            options={[
              { value: '', label: 'Selecione o Tipo de Solicitação' },
              { value: 'Doação', label: 'Doação' },
              { value: 'Parceria', label: 'Parceria' },
              { value: 'Patrocínio', label: 'Patrocínio' },
            ]}
            required
          />
        </div>

        {/* Informações do Evento/Projeto */}
        <div className="space-y-6">
          <FormField form={form} name="nome_instituicao" label="Nome da Instituição" />
          <FormField form={form} name="evento_nome" label="Nome do Evento/Projeto" validators={parceriasValidators.evento_nome} required />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Local do Evento/Projeto: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <FormField form={form} name="evento_estado" type="select" options={ESTADOS_BRASIL} validators={parceriasValidators.evento_estado} hideLabel />
              </div>
              <div className="md:col-span-2">
                <FormField form={form} name="evento_cidade" placeholder="Digite aqui a Cidade" validators={parceriasValidators.evento_cidade} hideLabel />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField form={form} name="evento_data" label="Data Realização do Evento/Projeto" placeholder="Digite aqui a data ou período" validators={parceriasValidators.evento_data} required />
            <FormField form={form} name="evento_horario" label="Horário do Evento/Projeto" placeholder="Digite aqui o horário de início e término" validators={parceriasValidators.evento_horario} required />
          </div>

          <FormField
            form={form}
            name="evento_objetivo"
            type="textarea"
            label="Objetivo e área de atuação"
            placeholder="Informar o objetivo do projeto/evento e se há relação com as áreas da cultura, educação, esporte, meio ambiente ou social."
            validators={parceriasValidators.evento_objetivo}
            required
          />

          <FormField
            form={form}
            name="evento_publico"
            type="textarea"
            label="Público Alvo"
            placeholder="Informar média de faixa etária, profissão e objetivos dos participantes"
            validators={parceriasValidators.evento_publico}
            required
          />

          <FormField
            form={form}
            name="evento_abrangencia"
            label="Abrangência"
            placeholder="Qtd esperada de pessoas que participarão do projeto/evento"
            validators={parceriasValidators.evento_abrangencia}
            required
          />
        </div>

        <FormField
          form={form}
          name="evento_solicitacao"
          type="textarea"
          label="Sua solicitação"
          placeholder="Especificar qual apoio o solicitante espera receber da Cajuína São Geraldo"
          validators={parceriasValidators.evento_solicitacao}
          required
        />

        <FormField
          form={form}
          name="evento_dataMateriais"
          label="Data pretendida para recolhimento dos produtos/materiais"
          placeholder="Qual data você planeja receber os materiais deste apoio?"
          validators={parceriasValidators.evento_dataMateriais}
          required
        />

        <FormField
          form={form}
          name="anexo"
          type="file"
          label="Anexar projeto"
          validators={parceriasValidators.anexo}
          accept=".jpeg,.jpg,.png,.pdf"
          multiple
          required
        />

        <form.Field name="acceptance" validators={parceriasValidators.acceptance}>
          {(field) => (
            <div className="w-full">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked as any)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-caju-heading-primary focus:ring-2 focus:ring-caju-heading-primary/20"
                />
                <span className="text-sm text-gray-700">
                  Estou ciente da{' '}
                  <a
                    href="#politica-de-patrocinio-e-apoio-cultural"
                    className="text-caju-heading-primary underline hover:text-caju-primary-dark"
                  >
                    Política de Patrocínio e Apoio Cultural
                  </a>
                </span>
              </label>
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-500">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Campos obrigatórios
          </p>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="rounded-lg bg-caju-heading-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-caju-primary-dark focus:outline-none focus:ring-2 focus:ring-caju-heading-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar minha mensagem'}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
