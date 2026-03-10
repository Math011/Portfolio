import { homeTranslations } from './home';
// import { aboutTranslations } from './about';
import { projectsTranslations } from './projects';
// import { contactTranslations } from './contact';
import { commonTranslations } from './common';

export const translations = {
  fr: {
    ...commonTranslations.fr,
    ...homeTranslations.fr,
    // ...aboutTranslations.fr,
    ...projectsTranslations.fr,
    // ...contactTranslations.fr,
  },
  en: {
    ...commonTranslations.en,
    ...homeTranslations.en,
    // ...aboutTranslations.en,
    ...projectsTranslations.en, 
    // ...contactTranslations.en,
  }
};