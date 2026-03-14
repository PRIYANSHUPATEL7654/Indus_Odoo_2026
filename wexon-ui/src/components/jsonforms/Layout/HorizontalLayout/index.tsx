import dynamic from "next/dynamic";
import { rankWith, uiTypeIs } from "@jsonforms/core";
import GlobalLoading from "@/app/loading";

const HorizontalLayout = dynamic(() => import("@/components/jsonforms/Layout/HorizontalLayout/HorizontalLayout"), {
    loading: () => <GlobalLoading />
});

export const HorizontalLayoutTester = rankWith(
    30,
    uiTypeIs("HorizontalLayout")
);

const HorizontalLayoutRenderer = {
    renderer: HorizontalLayout,
    tester: HorizontalLayoutTester,
};

export default HorizontalLayoutRenderer;
