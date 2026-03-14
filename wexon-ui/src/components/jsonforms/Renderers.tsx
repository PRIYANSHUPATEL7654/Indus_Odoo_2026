
import VerticalLayoutRenderer from '@/components/jsonforms/Layout/VerticalLayout/index';
import HorizontalLayoutRenderer from '@/components/jsonforms/Layout/HorizontalLayout/index';
import ArrayLayoutRenderer from "@/components/jsonforms/Layout/ArrayLayout";

import TextInputRenderer from "@/components/jsonforms/Control/TextInputControl/index";
import EntityCommandSelectRenderer from "@/components/jsonforms/Control/EntityCommandSelectControl";
import IntegerInputRenderer from "@/components/jsonforms/Control/IntegerInputControl";
import BooleanControlRenderer from "@/components/jsonforms/Control/BooleanControl";
import EnumControlRenderer from "@/components/jsonforms/Control/EnumControl";
import DatePickerControl from "@/components/jsonforms/Control/DatePickerControl";

export const layoutRenderers = [
    VerticalLayoutRenderer,
    HorizontalLayoutRenderer,
    ArrayLayoutRenderer,
];

export const controlRenderers = [
    TextInputRenderer,
    EntityCommandSelectRenderer,
    IntegerInputRenderer,
    BooleanControlRenderer,
    EnumControlRenderer,
    DatePickerControl
]

export const formRenderers = [
    ...controlRenderers,
    ...layoutRenderers
]