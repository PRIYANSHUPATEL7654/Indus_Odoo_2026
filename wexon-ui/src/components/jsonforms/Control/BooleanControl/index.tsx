import { isBooleanControl, rankWith } from "@jsonforms/core";
import BooleanControl from "@/components/jsonforms/Control/BooleanControl/BooleanControl";

export const BooleanControlTester = rankWith(
    6,
    isBooleanControl
);

const BooleanControlRenderer = {
    renderer: BooleanControl,
    tester: BooleanControlTester,
};

export default BooleanControlRenderer;
