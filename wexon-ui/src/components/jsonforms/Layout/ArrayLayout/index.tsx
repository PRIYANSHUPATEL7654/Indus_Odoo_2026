import dynamic from "next/dynamic";
import { rankWith, uiTypeIs } from "@jsonforms/core";
import GlobalLoading from "@/app/loading";

const ArrayLayout = dynamic(() => import("@/components/jsonforms/Layout/ArrayLayout/ArrayLayout"), {
    loading: () => <GlobalLoading />
});

export const ArrayLayoutTester = rankWith(
    1000,
    uiTypeIs("ArrayLayout")
);

const ArrayLayoutRenderer = {
    renderer: ArrayLayout,
    tester: ArrayLayoutTester,
};

export default ArrayLayoutRenderer;
