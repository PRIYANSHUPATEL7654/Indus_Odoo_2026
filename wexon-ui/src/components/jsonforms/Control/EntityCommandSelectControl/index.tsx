import { rankWith, isStringControl } from "@jsonforms/core";
import EntityCommandSelectControl
    from "@/components/jsonforms/Control/EntityCommandSelectControl/EntityCommandSelectControl";

export const EntityCommandSelectTester = rankWith(
    11,
    (uischema, schema, context) =>
        isStringControl(uischema, schema, context) &&
        uischema?.options?.format === "entityCommand" &&
        typeof uischema?.options?.entity === "string"
);

const EntityCommandSelectRenderer = {
    renderer: EntityCommandSelectControl,
    tester: EntityCommandSelectTester,
}

export default EntityCommandSelectRenderer;