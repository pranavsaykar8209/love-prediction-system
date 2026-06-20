export interface AboutCalculationProps {
  onCtaClick?: () => void;
}

export interface CalculatorFormProps {
  onHomeNavigate: () => void;
  onSubmit: (yourName: string, crushName: string) => void;
}

export interface FormInputConfig {
  name: string;
  label: string;
  placeholder: string;
}

export interface ResultPageProps {
  yourName: string;
  crushName: string;
  onAnalyzeAnother: () => void;
  onHomeNavigate: () => void;
}
