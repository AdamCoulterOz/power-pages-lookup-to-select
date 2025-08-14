import { AttributeMeta } from "./meta/Attribute";

export interface ViewLayout {
    Base64SecureConfiguration: string; // Dont try to parse this, it's encrypted, but we need it to call the API to get the full configuration for a target view
    ViewName:          string;
    Id:                string;
}

export interface CompleteViewLayout extends ViewLayout {
    Configuration:             Configuration;
    Columns:                   Column[];
    ColumnsTotalWidth:         number;
    SortExpression:            string;
}

export interface Column {
    WidthAsPercent: number;
    Type:           number;
    LogicalName:    string;
    Name:           string;
    Width:          number;
    SortDisabled:   boolean;
    Metadata?:      AttributeMeta;
}

export interface Configuration {
    PartialViewConfig:                      boolean;
    EntityName:                             string;
    PrimaryKeyName?:                        string;
    ViewId:                                 string;
    Id:                                     string;
    PageSize:                               number;
    ColumnOverrides:                        any[];
    EnableEntityPermissions:                boolean;
    Search:                                 Search;
    FilterQueryStringParameterName:         string;
    SortQueryStringParameterName:           string;
    PageQueryStringParameterName:           string;
    FilterByUserOptionLabel:                string;
    DetailsActionLink:                      DetailsActionLink;
    InsertActionLink:                       ActionLink;
    AssociateActionLink:                    ActionLink;
    EditActionLink:                         ActionLink;
    DeleteActionLink:                       ActionLink;
    CloseIncidentActionLink:                ActionLink;
    ResolveCaseActionLink:                  ActionLink;
    ReopenCaseActionLink:                   ActionLink;
    CancelCaseActionLink:                   ActionLink;
    QualifyLeadActionLink:                  ActionLink;
    ConvertOrderToInvoiceActionLink:        ActionLink;
    ConvertQuoteToOrderActionLink:          ActionLink;
    CalculateOpportunityActionLink:         ActionLink;
    DeactivateActionLink:                   ActionLink;
    ActivateActionLink:                     ActionLink;
    ActivateQuoteActionLink:                ActionLink;
    SetOpportunityOnHoldActionLink:         ActionLink;
    ReopenOpportunityActionLink:            ActionLink;
    WinOpportunityActionLink:               ActionLink;
    LoseOpportunityActionLink:              ActionLink;
    GenerateQuoteFromOpportunityActionLink: ActionLink;
    UpdatePipelinePhaseActionLink:          ActionLink;
    DisassociateActionLink:                 ActionLink;
    CreateRelatedRecordActionLinks:         any[];
    ViewActionLinks:                        any[];
    ItemActionLinks:                        any[];
    ActionLinksColumnWidth:                 number;
    LanguageCode:                           number;
    MapSettings:                            MapSettings;
    CalendarSettings:                       CalendarSettings;
    FilterSettings:                         FilterSettings;
    ModalLookupAttributeLogicalName:        string;
    ModalLookupEntityLogicalName:           string;
    ModalLookupGridPageSize:                number;
    SubgridFormEntityId:                    string;
    ViewName?:                              string;
}

export interface ActionLink {
    Modal?:           Modal;
    Type:             number;
    Enabled:          boolean;
    ShowModal:        number;
    FilterCriteriaId: string;
}

export interface Modal {
}

export interface CalendarSettings {
    Enabled:           boolean;
    InitialView:       number;
    InitialDateString: string;
    Style:             number;
    TimeZoneDisplay:   number;
}

export interface DetailsActionLink extends ActionLink {
    Label:            string;
    Tooltip:          string;
}

export interface FilterSettings {
    Enabled:                        boolean;
    FilterQueryStringParameterName: string;
    TooltipText:                    string;
}

export interface MapSettings {
    Enabled:                boolean;
    RestUrl:                string;
    DefaultCenterLatitude:  number;
    DefaultCenterLongitude: number;
    DefaultZoom:            number;
    InfoboxOffsetX:         number;
    InfoboxOffsetY:         number;
    PinImageHeight:         number;
    PinImageWidth:          number;
    DistanceUnit:           number;
}

export interface Search {
    Enabled:                        boolean;
    SearchQueryStringParameterName: string;
    PlaceholderText:                string;
    NlplaceholderText:              string;
    TooltipText:                    string;
    ButtonLabel:                    string;
}
