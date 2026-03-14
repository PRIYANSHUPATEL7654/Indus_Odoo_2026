"use client";

import React, { useState, useMemo } from "react";
import { ControlProps, JsonSchema7 } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useQuery } from "@tanstack/react-query";

import EntityCommandSelect, { Option } from "@/components/basicComponents/Select/EntityCommandSelect";
import FormFieldWrapper from "@/components/jsonforms/FormFieldWrapper";
import { ENTITY_CONFIG, EntityKey } from "@/constants/EntityConfiguration";

import { formatEntityName } from "@/helpers/jsonformsHelper/defultValueGenerator";
import { resolveErrorMessage } from "@/helpers/jsonformsHelper/resolveErrorMessage";

const EntityCommandSelectControl = (
    {
        schema,
        uischema,
        data,
        handleChange,
        path,
        label,
        required,
        errors,
        visible,
        enabled,
    }: ControlProps
) => {

    if (!visible) return null;

    const entity = uischema?.options?.entity as EntityKey | undefined;
    const placeholderText = uischema?.options?.placeholder ?? formatEntityName(entity);
    const config = entity ? ENTITY_CONFIG[entity] : undefined;

    const [open, setOpen] = useState(false);

    const { data: response, isLoading } = useQuery({
        queryKey: [config?.queryKey, open],
        queryFn: async () => {
            const res = await config!.queryFn();
            return res?.data;
        },
        enabled: !!config && open,
        gcTime: 0,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const options: Option[] = useMemo(() => {
        if (!response || !config) return [];
        return (response ?? []).map(config.options);
    }, [response, config]);

    return (
        <FormFieldWrapper
            label={label ?? formatEntityName(entity)}
            required={required}
            errorMessage={resolveErrorMessage(errors, schema as JsonSchema7)}
        >
            <EntityCommandSelect
                value={data}
                options={options}
                disabled={!enabled}
                placeholder={`Select ${placeholderText}`}
                onChange={(val) => handleChange(path, val ?? undefined)}
                onClick={() => setOpen(true)}
                isLoading={isLoading}
            />
        </FormFieldWrapper>
    );
};

export default withJsonFormsControlProps(EntityCommandSelectControl);
