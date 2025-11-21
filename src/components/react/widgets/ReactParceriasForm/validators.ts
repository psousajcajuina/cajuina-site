import { z } from 'zod';

export const parceriasSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  whatsapp: z.string().min(1, 'Telefone é obrigatório'),
  requestType: z.string().min(1, 'Tipo de solicitação é obrigatório'),
  institutionName: z.string().min(1, 'Nome da instituição é obrigatório'),
  institutionEmail: z.string().min(1, 'E-mail da instituição é obrigatório'),
  institutionPhone: z.string().min(1, 'Telefone da instituição é obrigatório'),
  eventName: z.string().min(1, 'Nome do evento é obrigatório'),
  eventState: z.string().min(1, 'Estado é obrigatório'),
  eventCity: z.string().min(1, 'Cidade é obrigatória'),
  eventDate: z.string().min(1, 'Data é obrigatória'),
  eventTime: z.string().min(1, 'Horário é obrigatório'),
  eventObjective: z.string().min(1, 'Objetivo é obrigatório'),
  eventTargetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  eventScope: z.string().min(1, 'Abrangência é obrigatória'),
  eventRequestDetails: z.string().min(1, 'Solicitação é obrigatória'),
  materialPickupDate: z.string().min(1, 'Data de recolhimento é obrigatória'),
  files: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'Anexo é obrigatório')
    .nullable(),
  acceptance: z.boolean().refine((val) => val === true, {
    message: 'Você precisa aceitar a política',
  }),
});

export type ParceriasFormData = z.infer<typeof parceriasSchema>;
