import { Type } from "class-transformer";

import { AttributeMeta } from "./meta/Attribute";

export class ViewLayout {
  @Type(() => Configuration)
  Configuration: Configuration;
  Base64SecureConfiguration: string; // Dont try to parse this, it's encrypted, but we need it to call the API to get the full configuration for a target view
  ViewName: string;
  ColumnsTotalWidth: number;
  Id: string;
}

export class CompleteViewLayout extends ViewLayout {
  @Type(() => Column)
  Columns: Column[];
  SortExpression: string;
}

export class Column {
  WidthAsPercent: number;
  Type: number;
  LogicalName: string;
  Name: string;
  Width: number;
  SortDisabled: boolean;

  @Type(() => AttributeMeta)
  Metadata?: AttributeMeta;
}

export class Configuration {
  PartialViewConfig: boolean;
  EntityName: string;
  PrimaryKeyName?: string;
  ViewId: string;
  Id: string;
  PageSize: number;

  @Type(() => ViewColumn)
  ColumnOverrides: ViewColumn[];
  EnableEntityPermissions: boolean;

  @Type(() => Search)
  Search: Search;
  FilterQueryStringParameterName: string;
  SortQueryStringParameterName: string;
  PageQueryStringParameterName: string;
  FilterByUserOptionLabel: string;
  // DetailsActionLink: DetailsActionLink;
  // InsertActionLink: ActionLink;
  // AssociateActionLink: ActionLink;
  // EditActionLink: ActionLink;
  // DeleteActionLink: ActionLink;
  // CloseIncidentActionLink: ActionLink;
  // ResolveCaseActionLink: ActionLink;
  // ReopenCaseActionLink: ActionLink;
  // CancelCaseActionLink: ActionLink;
  // QualifyLeadActionLink: ActionLink;
  // ConvertOrderToInvoiceActionLink: ActionLink;
  // ConvertQuoteToOrderActionLink: ActionLink;
  // CalculateOpportunityActionLink: ActionLink;
  // DeactivateActionLink: ActionLink;
  // ActivateActionLink: ActionLink;
  // ActivateQuoteActionLink: ActionLink;
  // SetOpportunityOnHoldActionLink: ActionLink;
  // ReopenOpportunityActionLink: ActionLink;
  // WinOpportunityActionLink: ActionLink;
  // LoseOpportunityActionLink: ActionLink;
  // GenerateQuoteFromOpportunityActionLink: ActionLink;
  // UpdatePipelinePhaseActionLink: ActionLink;
  // DisassociateActionLink: ActionLink;
  // CreateRelatedRecordActionLinks: ViewActionLink[];
  // ViewActionLinks: ActionLink[];
  // ItemActionLinks: ActionLink[];
  ActionLinksColumnWidth: number;
  LanguageCode: number;
  // MapSettings: MapSettings;
  // CalendarSettings: CalendarSettings;
  @Type(() => FilterSettings)
  FilterSettings: FilterSettings;
  ModalLookupAttributeLogicalName: string;
  ModalLookupEntityLogicalName: string;
  ModalLookupGridPageSize: number;
  SubgridFormEntityId: string;
  ViewName?: string;
}

export class ViewColumn {
  AttributeLogicalName: string;
  DisplayName: string;
  Width: number;
}

// export class Modal {}

// export class CalendarSettings {
//   Enabled: boolean;
//   InitialView: number;
//   InitialDateString: string;
//   Style: number;
//   TimeZoneDisplay: number;
// }

export class FilterSettings {
  Enabled: boolean;
  FilterQueryStringParameterName: string;
  TooltipText: string;
}

// export class MapSettings {
//   Enabled: boolean;
//   RestUrl: string;
//   DefaultCenterLatitude: number;
//   DefaultCenterLongitude: number;
//   DefaultZoom: number;
//   InfoboxOffsetX: number;
//   InfoboxOffsetY: number;
//   PinImageHeight: number;
//   PinImageWidth: number;
//   DistanceUnit: number;
// }

export class Search {
  Enabled: boolean;
  SearchQueryStringParameterName: string;
  PlaceholderText: string;
  NlplaceholderText: string;
  TooltipText: string;
  ButtonLabel: string;
}
