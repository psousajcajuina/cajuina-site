import { z } from 'zod';

export const distribuidorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  whatsapp: z.string().min(1, 'Telefone é obrigatório'),
  razaoSocial: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  cidadeAtuacao: z.string().min(1, 'Cidade de atuação é obrigatória'),
  acceptance: z.boolean().refine((val) => val === true, {
    message: 'Você precisa aceitar a política',
  }),
});

export type DistribuidorFormData = z.infer<typeof distribuidorSchema>;
