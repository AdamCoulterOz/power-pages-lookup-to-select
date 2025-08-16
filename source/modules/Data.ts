import { EntityConfig } from "./Config";

export type Data = DVEntity & EntityConfig;

export interface DVEntity {
    Id: string;
    Name: string;
    CreatedBy: Date;
    CreatedOn: Date;
    ModifiedBy: Date;
    ModifiedOn: Date;
    StateCode: number;
    StatusCode: number;
    ImportSequenceNumber: number;
    Values: any;
}
