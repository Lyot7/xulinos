export interface ModelOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface WoodOption {
  id: string;
  name: string;
  image: string;
}

export interface EngravingOption {
  id: string;
  name: string;
  pattern: string;
  image: string;
}

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
}

export interface ConfiguratorStepData {
  title?: string;
  description?: string;
  message?: string;
  models?: ModelOption[];
  woods?: WoodOption[];
  patterns?: EngravingOption[];
  fields?: FormField[];
  actions?: Array<{
    id: string;
    label: string;
    url: string;
    type: string;
  }>;
}

export interface ConfiguratorFormData {
  bladeEngraving: string;
  handleEngraving: string;
  otherDetails: string;
  email: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
  sub4?: string;
  [key: string]: string | undefined;
} 