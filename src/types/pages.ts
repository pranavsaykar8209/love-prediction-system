export interface AboutCalculationProps {
  onCtaClick?: () => void;
  onHistoryNavigate?: () => void;
}

export interface CalculatorFormProps {
  onHomeNavigate: () => void;
  onSubmit: (yourName: string, crushName: string) => void;
  onHistoryNavigate?: () => void;
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
  onHistoryNavigate?: () => void;
}

export interface HistoryPageProps {
  onHomeNavigate: () => void;
  onCalculateNavigate: () => void;
}
