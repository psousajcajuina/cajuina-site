import type { ValidationError } from '@tanstack/react-form';

type ValidationResult = ValidationError | Promise<ValidationError>;

type ValidatorFn<T> = (props: { value: T }) => ValidationResult;

interface FieldValidators<T> {
  onChange?: ValidatorFn<T>;
  onBlur?: ValidatorFn<T>;
}

type ParceriasValidators = {
  nome: FieldValidators<string>;
  email: FieldValidators<string>;
  whatsapp: FieldValidators<string>;
  tipo_solicitacao: FieldValidators<string>;
  nome_instituicao: FieldValidators<string>;
  evento_nome: FieldValidators<string>;
  evento_estado: FieldValidators<string>;
  evento_cidade: FieldValidators<string>;
  evento_data: FieldValidators<string>;
  evento_horario: FieldValidators<string>;
  evento_objetivo: FieldValidators<string>;
  evento_publico: FieldValidators<string>;
  evento_abrangencia: FieldValidators<string>;
  evento_solicitacao: FieldValidators<string>;
  evento_dataMateriais: FieldValidators<string>;
  anexo: FieldValidators<FileList | null>;
  acceptance: FieldValidators<boolean>;
};

export const parceriasValidators: ParceriasValidators = {
  nome: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Nome é obrigatório' : undefined,
  },
  email: {
    onChange: ({ value }: { value: string }) => {
      if (!value) return 'E-mail é obrigatório';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'E-mail inválido';
      return undefined;
    },
  },
  whatsapp: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Telefone é obrigatório' : undefined,
  },
  tipo_solicitacao: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Tipo de solicitação é obrigatório' : undefined,
  },
  nome_instituicao: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Nome da instituição é obrigatório' : undefined,
  },
  evento_nome: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Nome do evento é obrigatório' : undefined,
  },
  evento_estado: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Estado é obrigatório' : undefined,
  },
  evento_cidade: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Cidade é obrigatória' : undefined,
  },
  evento_data: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Data é obrigatória' : undefined,
  },
  evento_horario: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Horário é obrigatório' : undefined,
  },
  evento_objetivo: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Objetivo é obrigatório' : undefined,
  },
  evento_publico: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Público alvo é obrigatório' : undefined,
  },
  evento_abrangencia: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Abrangência é obrigatória' : undefined,
  },
  evento_solicitacao: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Solicitação é obrigatória' : undefined,
  },
  evento_dataMateriais: {
    onChange: ({ value }: { value: string }) =>
      !value ? 'Data de recolhimento é obrigatória' : undefined,
  },
  anexo: {
    onChange: ({ value }: { value: FileList | null }) =>
      !value || value.length === 0 ? 'Anexo é obrigatório' : undefined,
  },
  acceptance: {
    onChange: ({ value }: { value: boolean }) =>
      !value ? 'Você precisa aceitar a política' : undefined,
  },
};
