export class ViewActionLink {
  Type: LinkActionType;
  Label: string;
  Tooltip: string;
  QueryStringIdParameterName: string;
  Enabled: boolean;
  ButtonCssClass: string;
  SuccessMessage: string;
  ActionIndex?: number | null;
  ActionButtonAlignment?: ActionButtonAlignment;
  ActionButtonStyle?: ActionButtonStyle;
  ActionButtonPlacement?: ActionButtonPlacement;
  Confirmation: string;
  ShowModal: ShowModal;
  FilterCriteria: string;
  FilterCriteriaId: string;
  BusyText: string;
}

export enum ShowModal {
  No = 0,
  Yes = 1
}

export enum ActionButtonAlignment {
  Left = 0,
  Right = 1
}

export enum ActionButtonPlacement {
  AboveForm = 0,
  BelowForm = 1
}

export enum ActionButtonStyle {
  ButtonGroup = 0,
  DropDown = 1
}

export enum LinkActionType {
  Details = 1,
  Edit = 2,
  Insert = 3,
  Delete = 4,
  Associate = 5,
  Disassociate = 6,
  Workflow = 7,
  Download = 8,
  CloseIncident = 9,
  QualifyLead = 10,
  ConvertQuote = 11,
  ConvertOrder = 12,
  CalculateOpportunity = 13,
  ResolveCase = 14,
  ReopenCase = 15,
  CancelCase = 16,
  Deactivate = 17,
  Activate = 18,
  ActivateQuote = 19,
  SetOpportunityOnHold = 20,
  WinOpportunity = 21,
  LoseOpportunity = 22,
  GenerateQuoteFromOpportunity = 23,
  UpdatePipelinePhase = 24,
  ReopenOpportunity = 25,
  Submit = 26,
  Next = 27,
  Previous = 28,
  CreateRelatedRecord = 29
}

export class ActionLink {
  // Modal?: Modal;
  Type: number;
  Enabled: boolean;
  ShowModal: number;
  FilterCriteriaId: string;
}

export class DetailsActionLink extends ActionLink {
  Label: string;
  Tooltip: string;
}
