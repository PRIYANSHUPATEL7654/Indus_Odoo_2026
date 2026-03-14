import {isStringControl, rankWith} from "@jsonforms/core";
import TextInputControl from "@/components/jsonforms/Control/TextInputControl/TextInputControl";


export const TextInputTester = rankWith(
    5,
    isStringControl
);

const TextInputRenderer = {
    renderer: TextInputControl,
    tester: TextInputTester
};

export default TextInputRenderer;