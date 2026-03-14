import React, { useCallback } from "react";
import {
    ArrayLayoutProps,
    composePaths
} from "@jsonforms/core";
import { withJsonFormsArrayLayoutProps } from "@jsonforms/react";
import { Button } from "@/components/ui/button";
import { CirclePlus, Trash2 } from "lucide-react";
import range from "lodash/range";
import FormDispatch from "@/components/jsonforms/FormDispatch";
import createDefaultFormData from "@/helpers/jsonformsHelper/createDefaultFormData";

const ArrayLayout = (
    {
        schema,
        uischema,
        path,
        data,
        addItem,
        removeItems,
        enabled,
        renderers,
        cells,
        label,
        rootSchema,
        required
    }: ArrayLayoutProps
) => {

    // Get detail from uischema
    const detail = (uischema as any)?.detail || (uischema as any)?.options?.detail;
    const innerCreateDefaultValue = useCallback(
        () => createDefaultFormData(schema, rootSchema),
        [schema, rootSchema]
    );

    const handleAdd = () => {
        addItem(path, innerCreateDefaultValue())();
    };

    const handleRemove = (index: number) => {
        removeItems?.(path, [index])();
    };



    return (
        <div className="flex flex-col gap-3.5 my-2">

            <div className="flex items-center justify-between">
                {
                    label && (
                        <div className="flex flex-col">
                            <div className="flex text-sm font-semibold gap-1">
                                {label}
                                { required && <span className="text-destructive">*</span> }
                            </div>
                            <div className="text-sm text-gray-500">
                                {uischema?.options?.description}
                            </div>
                        </div>
                    )
                }
                {
                    enabled && (
                        <Button
                            type="button"
                            onClick={handleAdd}
                            size="icon"
                        >
                            <CirclePlus />
                        </Button>
                    )
                }
            </div>

            {
                data > 0 && (
                    <div className="flex flex-col gap-4">
                        {
                            range(data).map((index) => {
                                const itemPath = composePaths(path, `${index}`);
                                return (

                                    <div
                                        key={index}
                                        className="flex gap-4 p-4 border rounded-lg"
                                    >
                                        <FormDispatch
                                            schema={schema}
                                            uischema={detail}
                                            path={itemPath}
                                            enabled={enabled}
                                            renderers={renderers}
                                            cells={cells}
                                            visible={true}
                                        />

                                        {
                                            enabled && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleRemove(index)}
                                                    className="mt-6"
                                                >
                                                    <Trash2 />
                                                </Button>
                                            )
                                        }
                                    </div>
                                )}
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};

export default withJsonFormsArrayLayoutProps(React.memo(ArrayLayout));