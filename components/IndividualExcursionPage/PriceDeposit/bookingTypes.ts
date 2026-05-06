export interface BookingFormState {
  name: string;
  email: string;
  phone: string;
  hotel: string;
  date: string;
  timeSlot: string;
  adults: number;
  children: number;
}

export type BookingFormErrors = Partial<Record<keyof BookingFormState, string>>;

export interface BookingLabels {
  // Header
  modalTitle: string;
  modalSubtitle: string;
  close: string;
  // Steps
  stepFormTitle: string;
  stepReviewTitle: string;
  // Date
  dateLabel: string;
  /** Use {hours} as the placeholder, e.g. "Book at least {hours} hours in advance." */
  dateHelper: string;
  dateInvalidWeekday: string;
  dateInvalidNotice: string;
  // Time
  timeLabel: string;
  timeRequired: string;
  // Guests
  guestsLabel: string;
  adultsLabel: string;
  childrenLabel: string;
  childAgeRangeNote?: string;
  // Contact
  contactSection: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  hotelLabel: string;
  hotelPlaceholder: string;
  // Validation
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  // Buttons
  continueToPayment: string;
  editDetails: string;
  // Review summary
  reviewExcursion: string;
  reviewDate: string;
  reviewTime: string;
  reviewGuests: string;
  reviewHotel: string;
  reviewTotal?: string;
  reviewDeposit: string;
  reviewDepositNote: string;
  reviewBalanceLabel: string;
  // Success
  successTitle: string;
  successMessage: string;
  successCheckEmail: string;
  // Error
  errorTitle: string;
  errorRetry: string;
  errorContact: string;
  paymentError: string;
}
