import {
    JsonSchema,
    createDefaultValue,
    Resolve
} from "@jsonforms/core";

const normalizeType = (type?: string | string[]) =>
    Array.isArray(type) ? type[0] : type;

const normalizeItems = (items?: JsonSchema | JsonSchema[]) =>
    Array.isArray(items) ? items[0] : items;

const isStringType = (type?: string | string[]) =>
    Array.isArray(type)
        ? type.includes("string")
        : type === "string";

const createDefaultFormData = (
    schema: JsonSchema,
    rootSchema: JsonSchema = schema
): any => {

    if (!schema || typeof schema !== "object") return undefined;

    let data = createDefaultValue(schema, rootSchema);

    if (data === null) return undefined;

    if (isStringType(schema.type)) {
        return data === null ? undefined : data;
    }

    if (schema.type !== "object" || !schema.properties) {
        return data;
    }

    if (typeof data !== "object" || Array.isArray(data)) {
        data = {};
    }

    const required = new Set(schema.required ?? []);

    for (const key of Object.keys(schema.properties)) {
        const propSchema = schema.properties[key] as JsonSchema;
        const propType = normalizeType(propSchema.type);

        if (propType === "string") {
            if (data[key] == null) {
                data[key] = required.has(key) ? "" : undefined;
            }
            continue;
        }

        if (propType === "object" || propType === "array") {
            if (data[key] == null) {
                data[key] = createDefaultFormData(propSchema, rootSchema);
            }

            if (
                propType === "array" &&
                propSchema.items &&
                Array.isArray(data[key])
            ) {
                const itemSchema = normalizeItems(propSchema.items);
                const min = Number(propSchema.minItems ?? 0);

                if (itemSchema && data[key].length < min) {
                    for (let i = data[key].length; i < min; i++) {
                        const resolved = Resolve.schema(itemSchema, "", rootSchema);
                        data[key].push(
                            createDefaultFormData(resolved, rootSchema)
                        );
                    }
                }
            }

        }
    }

    return data;
};

export default createDefaultFormData;
