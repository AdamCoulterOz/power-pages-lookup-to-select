export interface PowerPagesShell {
    getTokenDeferred(): JQuery.Deferred<string>;
}

export interface ValidateLoginSessionFunction<T> {
    (data: T, textStatus: string, jqXHR: JQuery.jqXHR, callback: Function): void;
}

export interface Metadata {
  EntitySetName: string;
  TableLogicalName: string;
  IdFieldName: string;
  TextFieldName: string;
  EntityDisplayName: string;
}

export type Data<T extends DVEntity = DVEntity> = T & Metadata;

export interface DVEntity {
    "@odata.etag": string;
    Id: string;
    Name: string;
    Createdby: Date;
    Createdon: Date;
    Modifiedby: Date;
    Modifiedon: Date;
    Statecode: number;
    Statuscode: number;
    Importsequencenumber: number;
}

declare const shell: PowerPagesShell;
declare const validateLoginSession: <T>(...args: Parameters<ValidateLoginSessionFunction<T>>) => void;

export async function safeAjax<T>(ajaxOptions: JQuery.AjaxSettings): Promise<T> {
    const token = await shell.getTokenDeferred();

    ajaxOptions.headers = {
        ...ajaxOptions.headers,
        "__RequestVerificationToken": token
    };

    return new Promise<T>((resolve, reject) => {
        $.ajax(ajaxOptions)
            .done((data, textStatus, jqXHR) => {
                validateLoginSession(data, textStatus, jqXHR, resolve);
            })
            .fail(reject);
    });
}
