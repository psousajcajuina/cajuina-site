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
      href: 'noticias',
    },
    {
      text: 'Nos Encontre',
      href: '#',
    },
  ],
  actions: [
    {
      text: 'Trabalhe Conosco',
      variant: 'outlined',
      href: '#',
    },
    {
      text: 'Seja um distribuidor',
      variant: 'yellow',
      href: '#',
    },
  ] as CallToAction[],
};

export const footerData = {
  links: [
    {
      title: 'Institucional',
      links: [
        { text: 'Sobre', href: '#' },
        { text: 'Produtos', href: '#' },
        { text: 'Notícias', href: '#' },
        { text: 'Nos encontre', href: '#' },
        { text: 'Trabalhe Conosco', href: '#' },
      ],
    },
    {
      title: 'Contato',
      links: [
        { text: 'Solicite', href: '#' },
        { text: 'Portal de boletos', href: '#' },
        { text: 'Seja distribuidor', href: '#' },
        { text: 'Canal de denúncia', href: '#' },
      ],
    },
    {
      title: 'Informações',
      links: [
        { text: 'Política Anticorrupção', href: '#' },
        { text: 'Política recebimento de brinde', href: '#' },
        { text: 'Código de Conduta', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Promoções', href: '/promocoes' },
    { text: 'Política de Privacidade', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    {
      ariaLabel: 'Instagram',
      icon: 'mdi:instagram',
      href: 'https://www.instagram.com/cajuinasaogeraldo/#',
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
    <span class="block">
      &copy; 2025 Todos os direitos reservados à Cajuína São Geraldo / Av. Padre Cícero, Km 02 - Juazeiro do Norte, CE - CEP: 63022-115
    </span>
  `,
};
