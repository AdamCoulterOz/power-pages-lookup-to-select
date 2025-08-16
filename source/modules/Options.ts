export interface Entry {
    Id: string;
    Text: string;
}

export interface SingleEntry extends Entry {
    Selected?: boolean;
    Disabled?: boolean;
}

export interface GroupEntry extends Entry {
    Children: SingleEntry[];
}

export interface Result {
    Results: Entry[];
    Pagination?: { More: boolean; };
}
