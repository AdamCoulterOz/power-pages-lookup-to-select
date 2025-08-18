import 'reflect-metadata';
import fs from "node:fs";
import path from "node:path";
import { plainToInstance } from "class-transformer";
import { LookupData } from "../source/modules/power-pages/LookupData";
import {
  Attribute,
  EntityReferenceAttribute,
  OptionSetAttribute,
  OptionSetCollectionAttribute,
  MoneyAttribute,
  DateTimeAttribute,
  ByteArrayAttribute,
  GuidAttributeType,
  StringAttribute,
  Int32Attribute,
  DecimalAttribute,
  DoubleAttribute,
  BooleanAttribute
} from "../source/modules/power-pages/Attribute";

function getAttr(attrs: Attribute[], name: string) {
  const n = name.toLowerCase();
  return attrs.find(a => a.Name.toLowerCase() === n);
}

describe("LookupData deserialisation", () => {
  const raw = fs.readFileSync(path.resolve(__dirname, "data/LookupData.json"), "utf8");
  const model = plainToInstance(LookupData, JSON.parse(raw), { exposeDefaultValues: false });
  const rec = model.Records[0];
  const attrs = rec.Attributes;

  

  it("hydrates the root LookupData", () => {
    expect(model instanceof LookupData).toBe(true);
    expect(Object.getPrototypeOf(model).constructor.name).toBe("LookupData");
    expect(model.MoreRecords).toBe(false);
    expect(Array.isArray(model.Records)).toBe(true);
    expect(model.Records.length).toBeGreaterThan(0);
  });

  it("maps typical attribute types correctly", () => {
    const rec = model.Records[0];
    const attrs = rec.Attributes;

    // String
    const nameAttr = getAttr(attrs, "cr186_name");
    expect(nameAttr).toBeTruthy();
    expect(nameAttr).toBeInstanceOf(StringAttribute); // FAILS HERE

    // Int32
    expect(getAttr(attrs, "cr186_wholenumber")).toBeInstanceOf(Int32Attribute);

    // Decimal / Double
    expect(getAttr(attrs, "cr186_decimal")).toBeInstanceOf(DecimalAttribute);
    expect(getAttr(attrs, "cr186_float")).toBeInstanceOf(DoubleAttribute);

    // Boolean
    expect(getAttr(attrs, "cr186_yesno")).toBeInstanceOf(BooleanAttribute);

    // GUID
    const fileId = getAttr(attrs, "cr186_file");
    expect(fileId).toBeInstanceOf(GuidAttributeType);
    expect((fileId as GuidAttributeType).Value).toMatch(/^[0-9a-f-]{36}$/i);

    // Money
    const money = getAttr(attrs, "cr186_amount") as MoneyAttribute;
    expect(money).toBeInstanceOf(MoneyAttribute);
    expect(money.Value.Value).toBeCloseTo(24.25, 5);

    // EntityReference (Customer / Owner / Lookup)
    const customer = getAttr(attrs, "cr186_customer") as EntityReferenceAttribute;
    expect(customer).toBeInstanceOf(EntityReferenceAttribute);
    expect(customer.Value.LogicalName).toBe("contact");
    expect(customer.Value.Id).toMatch(/^[0-9a-f-]{36}$/i);

    // OptionSet (State/Status/Picklist share same wire type)
    const state = getAttr(attrs, "statecode") as OptionSetAttribute;
    expect(state).toBeInstanceOf(OptionSetAttribute);
    expect(state.Value.Value).toBe(0);

    const status = getAttr(attrs, "statuscode") as OptionSetAttribute;
    expect(status.Value.Value).toBe(1);

    // MultiSelect
    const multi = getAttr(attrs, "cr186_multichoice") as OptionSetCollectionAttribute;
    expect(multi).toBeInstanceOf(OptionSetCollectionAttribute);
    expect(multi.Value.map(v => v.Value)).toEqual([102040000, 102040001]);

    // DateTime (/Date(ms)/ → Date)
    const created = getAttr(attrs, "createdon") as DateTimeAttribute;
    expect(created).toBeInstanceOf(DateTimeAttribute);
    expect(created.Value).toBeInstanceOf(Date);
    expect(created.Value?.getTime()).toBe(1755062901000);

    const dt = getAttr(attrs, "cr186_datetime") as DateTimeAttribute;
    expect(dt.Value?.getTime()).toBe(1755106200000);

    // Byte[] → Uint8Array (PNG signature 137,80,78,71)
    const img = getAttr(attrs, "cr186_image") as ByteArrayAttribute;
    expect(img).toBeInstanceOf(ByteArrayAttribute);
    expect(img.Value).toBeInstanceOf(Uint8Array);
    expect(Array.from(img.Value.slice(0, 4))).toEqual([137, 80, 78, 71]);
  });
});