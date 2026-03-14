import React from "react";
import { withJsonFormsLayoutProps } from "@jsonforms/react";
import { isLayout, UISchemaElement } from "@jsonforms/core";
import FormDispatch from "@/components/jsonforms/FormDispatch";
import { LayoutProps } from "@jsonforms/core";

const HorizontalLayout = (
    {
        schema,
        uischema,
        path,
        enabled,
        visible,
        renderers,
        cells,
        label
    }: LayoutProps
) => {

    if (!visible || !isLayout(uischema) || !uischema.elements.length) {
        return null;
    }

    const {options = {}} = uischema;
    const {showLabel = true} = options;

    return (
        <div>
            {
                showLabel && label && (
                    <div className="mb-2">
                        {label}
                    </div>
                )
            }
            <div className="flex flex-col md:flex-row gap-4">
                {
                    uischema.elements.map((child: UISchemaElement, index: number) => {
                        if (child.options && child.options.customClass) {
                            return (
                                <div className={child.options.customClass} key={index}>
                                    <FormDispatch
                                        key={index}
                                        schema={schema}
                                        uischema={child}
                                        path={path}
                                        enabled={enabled}
                                        renderers={renderers}
                                        cells={cells}
                                        className={child.options.customClass}
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <FormDispatch
                                    key={index}
                                    schema={schema}
                                    uischema={child}
                                    path={path}
                                    enabled={enabled}
                                    renderers={renderers}
                                    cells={cells}
                                />
                            );
                        }
                    })
                }
            </div>
        </div>
    );
};

export default withJsonFormsLayoutProps(React.memo(HorizontalLayout));
