import {JsonSchema} from "@jsonforms/core";

const normalizeBackendData = (data: any, schema: JsonSchema): any => {
    if (!data || typeof data !== "object") return data;

    const result: any = {};

    Object.keys(schema.properties ?? {}).forEach(key => {
        const propSchema = schema.properties?.[key] as JsonSchema;
        const value = data[key];

        if (value === null) {
            return;
        }

        result[key] = value;
    });

    return result;
};

export default normalizeBackendData;