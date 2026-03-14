import dynamic from "next/dynamic";
import { rankWith, uiTypeIs } from "@jsonforms/core";
import GlobalLoading from "@/app/loading";

const VerticalLayout = dynamic(() => import("@/components/jsonforms/Layout/VerticalLayout/VerticalLayout"), {
    loading: () => <GlobalLoading />
});

export const VerticalLayoutTester = rankWith(
    30,
    uiTypeIs("VerticalLayout")
);

const VerticalLayoutRenderer = {
    renderer: VerticalLayout,
    tester: VerticalLayoutTester,
};

export default VerticalLayoutRenderer;
