import { type SchemaTypeDefinition } from "sanity";
// Localized Types
import {
  localizedBlockContent,
  localizedString,
  localizedStringArray,
  localizedText,
} from "./Localized/localizedTypes";
// General Layout Types
import { generalLayout } from "./GeneralLayout/generalLayout";
// Home Page Types
import { homePage } from "./HomePage/HomePage";
// Excursions Page Types
import { excursionsPage } from "./ExcursionsPage/ExcursionsPage";
import { excursionCategory } from "./ExcursionCategory/ExcursionCategory";

import { excursion } from "./IndividualExcursionPage/Excursion";

// Diving & Snorkeling Page Types
import { divingSnorkelingPage } from "./DivingSnorkelingPage/DivingSnorkelingPage";
import { divingExcursion } from "./DivingSnorkelingPage/DivingExcursion";
// About Page Types
import { aboutPage } from "./AboutPage/AboutPage";
// FAQ Page Types
import { faqPage } from "./FaqPage/FaqPage";
// Contact Page Types
import { contactPage } from "./ContactPage/ContactPage";
// Legal Page Types
import { legalDocument } from "./LegalPages/LegalDocument";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Localized Types
    localizedString,
    localizedText,
    localizedBlockContent,
    localizedStringArray,
    // General Layout Types
    generalLayout,
    // Home Page Types
    homePage,
    // Excursions Page Types
    excursionsPage,
    // Excursion Category Types
    excursionCategory,
    // Excursion Types
    excursion,
    // Diving & Snorkeling Page Types
    divingSnorkelingPage,
    divingExcursion,
    // About Page Types
    aboutPage,
    // FAQ Page Types
    faqPage,
    // Contact Page Types
    contactPage,
    // Legal Page Types
    legalDocument,
  ],
};
