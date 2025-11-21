import type { CallToAction } from './types';
import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: '/',
    },
    {
      text: 'Sobre',
      href: '/sobre',
    },
    {
      text: 'Produtos',
      href: '/produtos',
    },
    {
      text: 'Notícias',
      href: '/blog',
    },
    {
      text: 'Nos Encontre',
      href: '#nos-encontre',
    },
  ],
  actions: [
    {
      text: 'Trabalhe Conosco',
      variant: 'outlined',
      target: '_blank',
      href: 'https://cajuinasaogeraldo.gupy.io/',
    },
    {
      text: 'Seja um distribuidor',
      variant: 'yellow',
      href: '/solicite/seja-um-distribuidor',
    },
  ] as CallToAction[],
};

export const footerData = {
  links: [
    {
      title: 'Institucional',
      links: [
        { text: 'Sobre', href: '/sobre' },
        { text: 'Produtos', href: '/produtos' },
        { text: 'Notícias', href: '/blog' },
        { text: 'Nos encontre', href: '/#nos-encontre' },
        {
          text: 'Trabalhe Conosco',
          href: 'https://cajuinasaogeraldo.gupy.io/',
        },
      ],
    },
    {
      title: 'Contato',
      links: [
        { text: 'Solicite Parceria', href: '/solicite/parcerias/' },
        {
          text: 'Portal de boletos',
          href: 'https://boletos.cajuinasaogeraldo.com.br/',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        { text: 'Seja distribuidor', href: '/solicite/seja-um-distribuidor' },
        { text: 'Canal de denúncia', href: '/empresa/canal-de-denuncia/' },
      ],
    },
    {
      title: 'Informações',
      links: [
        {
          text: 'Política Anticorrupção',
          href: '/empresa/politica-anticorrupcao/',
        },
        {
          text: 'Política recebimento de brinde',
          href: '/empresa/politica-de-recebimento-e-oferecimento-de-presentes-brindes-hospitalidades-e-contrapartidas-de-patrocinio/',
        },
        { text: 'Código de Conduta', href: '/empresa/codigo-de-conduta/' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Promoções', href: '/promocoes' },
    // { text: 'Política de Privacidade', href: getPermalink('/privacy') },
    {
      text: 'Política de Privacidade',
      href: '/empresa/politica-de-privacidade/',
    },
  ],
  socialLinks: [
    {
      ariaLabel: 'Instagram',
      icon: 'mdi:instagram',
      href: 'https://www.instagram.com/cajuinasaogeraldo',
    },
    {
      ariaLabel: 'Facebook',
      icon: 'mdi:facebook',
      href: 'https://www.facebook.com/cajuinasaogeraldo',
    },
    {
      ariaLabel: 'X',
      icon: 'tabler:brand-x',
      href: 'https://x.com/saogeraldocaju',
    },
    {
      ariaLabel: 'Tiktok',
      icon: 'tabler:brand-tiktok',
      href: 'https://www.tiktok.com/@saogeraldocaju',
    },
    {
      ariaLabel: 'Linkedin',
      icon: 'mdi:linkedin',
      href: 'https://www.linkedin.com/company/cajuinasaogeraldo',
    },
    {
      ariaLabel: 'Youtube',
      icon: 'mdi:youtube',
      href: 'https://www.youtube.com/c/cajuinasaogeraldo',
    },
    // { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    <span>
      &copy; 2025 Todos os direitos reservados à Cajuína São Geraldo / Av. Padre Cícero, Km 02 - Juazeiro do Norte, CE - CEP: 63022-115
    </span>
  `,
};
