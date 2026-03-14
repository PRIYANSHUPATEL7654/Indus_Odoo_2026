import { rankWith, isDateControl } from "@jsonforms/core";
import DatePickerControl from "@/components/jsonforms/Control/DatePickerControl/DatePickerControl";

export const DatePickerTester = rankWith(
    6,
    isDateControl
);

export default {
    renderer: DatePickerControl,
    tester: DatePickerTester,
};
