import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="prose prose-sm md:prose-base font-inter max-w-none">
          <h2 className="text-caju-heading-primary mb-6 text-2xl font-bold">
            Política de Privacidade e Proteção de Dados
          </h2>

          <p>
            A Cajuína São Geraldo tem o compromisso de proteger a sua
            privacidade e seus dados pessoais. Esta política descreve como
            coletamos, usamos e protegemos suas informações.
          </p>
          <br />
          <h3>1. Coleta de Dados</h3>
          <p>
            Coletamos informações que você nos fornece diretamente ao preencher
            nossos formulários, como nome, e-mail, telefone e informações sobre
            sua solicitação.
          </p>
          <br />
          <h3>2. Uso dos Dados</h3>
          <p>Utilizamos seus dados para:</p>
          <ul>
            <li>
              Processar e responder às suas solicitações de parceria, patrocínio
              ou doação;
            </li>
            <li>
              Entrar em contato com você sobre o status da sua solicitação;
            </li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
          <br />
          <h3>3. Compartilhamento de Dados</h3>
          <p>
            Não vendemos ou alugamos seus dados pessoais. Podemos compartilhar
            suas informações com prestadores de serviços que nos ajudam a operar
            nosso negócio, sempre sob confidencialidade.
          </p>
          <br />
          <h3>4. Seus Direitos</h3>
          <p>
            Você tem direito a acessar, corrigir ou solicitar a exclusão de seus
            dados pessoais. Para exercer esses direitos, entre em contato
            conosco.
          </p>
          <br />
          <h3>5. Segurança</h3>
          <p>
            Adotamos medidas de segurança técnicas e organizacionais para
            proteger seus dados contra acesso não autorizado, perda ou
            alteração.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="btn-yellow rounded-lg px-6 py-2 font-semibold text-white transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
