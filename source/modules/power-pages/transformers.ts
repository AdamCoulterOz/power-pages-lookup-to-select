import { ClassConstructor, TransformFnParams, plainToInstance } from "class-transformer";

type SubType = { name: string; value: ClassConstructor<any> };
type DiscriminatorShape = { property: string; subTypes: SubType[] };

export function transformUsingDiscriminator<T>(
  BaseCtor: ClassConstructor<T>,
  discriminator: DiscriminatorShape,
  preprocess?: (v: any) => any
) {
  return ({ value }: TransformFnParams) => {
    const raw = preprocess ? preprocess(value) : value;
    const key = discriminator.property;
    const typeName = raw?.[key];
    const match = discriminator.subTypes?.find((s) => s.name === typeName);
    const Target = (match?.value ?? BaseCtor) as ClassConstructor<any>;
    return plainToInstance(Target, raw, {
      enableImplicitConversion: true,
      excludeExtraneousValues: false,
    });
  };
}