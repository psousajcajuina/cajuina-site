import { z } from 'zod';

export const parceriasSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  whatsapp: z.string().min(1, 'Telefone é obrigatório'),
  tipo_solicitacao: z.string().min(1, 'Tipo de solicitação é obrigatório'),
  nome_instituicao: z.string().min(1, 'Nome da instituição é obrigatório'),
  email_instituicao: z.string().min(1, 'Nome da instituição é obrigatório'),
  telefone_instituicao: z.string().min(1, 'Nome da instituição é obrigatório'),
  evento_nome: z.string().min(1, 'Nome do evento é obrigatório'),
  evento_estado: z.string().min(1, 'Estado é obrigatório'),
  evento_cidade: z.string().min(1, 'Cidade é obrigatória'),
  evento_data: z.string().min(1, 'Data é obrigatória'),
  evento_horario: z.string().min(1, 'Horário é obrigatório'),
  evento_objetivo: z.string().min(1, 'Objetivo é obrigatório'),
  evento_publico: z.string().min(1, 'Público-alvo é obrigatório'),
  evento_abrangencia: z.string().min(1, 'Abrangência é obrigatória'),
  evento_solicitacao: z.string().min(1, 'Solicitação é obrigatória'),
  evento_dataMateriais: z.string().min(1, 'Data de recolhimento é obrigatória'),
  anexo: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'Anexo é obrigatório')
    .nullable(),
  acceptance: z.boolean().refine((val) => val === true, {
    message: 'Você precisa aceitar a política',
  }),
});

export type ParceriasFormData = z.infer<typeof parceriasSchema>;
