import {
    isIntegerControl,
    isNumberControl,
    rankWith
} from "@jsonforms/core";

import IntegerInputControl from "@/components/jsonforms/Control/IntegerInputControl/IntegerInputControl";

export const NumericInputTester = rankWith(
    6,
    (uischema, schema, context) =>
        isIntegerControl(uischema, schema, context) ||
        isNumberControl(uischema, schema, context)
);

const NumericInputRenderer = {
    renderer: IntegerInputControl,
    tester: NumericInputTester
};

export default NumericInputRenderer;
