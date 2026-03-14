import {
    JsonFormsCellRendererRegistryEntry,
    JsonFormsRendererRegistryEntry,
    JsonSchema,
    UISchemaElement
} from "@jsonforms/core";

export interface LayoutProps {
    schema: JsonSchema
    uischema: UISchemaElement
    path: string
    enabled: boolean
    visible: boolean
    renderers: JsonFormsRendererRegistryEntry[]
    cells: JsonFormsCellRendererRegistryEntry[]
    label?: string
    required?: boolean
}