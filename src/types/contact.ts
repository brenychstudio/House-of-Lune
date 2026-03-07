export type InquiryMode = {
  value: "private-viewing" | "availability" | "bespoke" | "appointment";
  label: string;
  description: string;
};

export type ContactContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    intro: string;
  };
  options: {
    title: string;
    modes: InquiryMode[];
  };
  form: {
    title: string;
    description: string;
    fields: {
      name: string;
      email: string;
      inquiryType: string;
      piece: string;
      timing: string;
      message: string;
    };
    submitLabel: string;
    successLabel: string;
    errorLabel: string;
  };
  details: {
    title: string;
    description: string;
    lines: string[];
  };
  appointmentNote: {
    title: string;
    description: string;
    cta: string;
  };
};
