import {rankWith, isEnumControl} from "@jsonforms/core";
import EnumControl from "@/components/jsonforms/Control/EnumControl/EnumControl";

export const EnumControlTester = rankWith(
    10,
    (uischema, schema, context) =>
        isEnumControl(uischema, schema, context) ||
        uischema?.options?.control === "enum"
);

const EnumControlRenderer = {
    renderer: EnumControl,
    tester: EnumControlTester,
};

export default EnumControlRenderer;
