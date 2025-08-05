import { Record } from "./Record";

export interface LookupData {
    MoreRecords: boolean;
    Records: Record[];
    ItemCount: number;
    PageCount: number;
    PageNumber: number;
    PageSize: number;
    NextPagePagingCookie?: string;
    ViewConfiguration: null;
    CompleteViewLayout: null;
    CreateActionMetadata: CreateActionMetadata;
    DisabledItemActionLinks: any[];
}

export interface CreateActionMetadata {
    Disabled: boolean;
    DisabledMessage: null;
}

