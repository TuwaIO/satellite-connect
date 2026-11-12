import { baseFooterLinks, baseNavLinks, PixelArt, projectIconArt, type SocialLink } from '@tuwaio/docs-ui';

// The pixel GitHub mark of docs-ui, as in its footer, on the link to this repository
const github = baseFooterLinks.find((link) => link.title === 'GitHub') as SocialLink;

export const navLinks: SocialLink[] = [
  {
    title: 'Storybook',
    href: 'https://stories.tuwa.io/?path=/docs/introduction--docs',
    // The Storybook of Nova UI Kit, under the pixel icon of Nova: its cells are 2px at this size
    image: <PixelArt art={projectIconArt.supernova} className="h-[18px] w-[18px] [--tuwa-pixel-ink:currentColor]" />,
  },
  ...baseNavLinks,
  { ...github, href: 'https://github.com/TuwaIO/satellite-connect' },
];
