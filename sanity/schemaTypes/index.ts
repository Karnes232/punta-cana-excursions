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
  ],
};
