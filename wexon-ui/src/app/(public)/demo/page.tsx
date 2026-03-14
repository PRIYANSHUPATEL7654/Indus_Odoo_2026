"use client";

import React from "react";
import Form from "@/components/jsonforms/Form";
import { JsonSchema7, UISchemaElement } from "@jsonforms/core";
import AutoComplete, {Option} from "@/components/basicComponents/Input/EnumInput/AutoComplete";
import {Search, Shield, User} from "lucide-react";

/* ------------------------------------------------------------------ */
/* JSON SCHEMA */
/* ------------------------------------------------------------------ */
const demoSchema: JsonSchema7 = {
    type: "object",
    properties: {
        // -------- STRING INPUTS --------
        name: {
            type: "string",
            minLength: 2
        },
        email: {
            type: "string",
            format: "email"
        },
        password: {
            type: "string",
            minLength: 6
        },
        phone: {
            type: "string",
            minLength: 10,
            maxLength: 15
        },
        remarks: {
            type: "string"
        },

        // -------- NUMBER INPUTS --------
        bagCount: {
            type: "integer",
            minimum: 0
        },
        netWeight: {
            type: "integer",
            minimum: 0
        },
        netAmount: {
            type: "integer",
            minimum: 0
        },
        "isActive": {
            "type": "boolean",
            "title": "Is Active",
            default: true
        },
        "isVerified": {
            "type": "boolean",
            "title": "Is Verified",
        },
        country: {
            type: "string",
            enum: ["IN", "US", "UK"]
        },
        role: {
            type: "string"
        },
        startDate: {
            type: "string",
            format: "date",
            title: "Start Date",
        }
    },
    required: ["name", "phone", "bagCount", "netAmount"]
};

/* ------------------------------------------------------------------ */
/* UI SCHEMA */
/* ------------------------------------------------------------------ */
const demoUiSchema: UISchemaElement = {
    type: "VerticalLayout",
    elements: [
        /* ---------- STRING ---------- */
        {
            type: "Control",
            scope: "#/properties/name",
            options: {
                variant: "text",
                placeholder: "Item / Person Name"
            }
        },
        {
            type: "Control",
            scope: "#/properties/email",
            options: {
                variant: "email",
                placeholder: "example@email.com"
            }
        },
        {
            type: "Control",
            scope: "#/properties/password",
            options: {
                variant: "password",
                showPasswordShowAndHideButton: true
            }
        },
        {
            type: "Control",
            scope: "#/properties/phone",
            options: {
                variant: "phone",
                countryCode: "+91"
            }
        },
        {
            type: "Control",
            scope: "#/properties/remarks",
            options: {
                variant: "textarea",
            }
        },
        {
            type: "Control",
            scope: "#/properties/netWeight",
            options: {
                variant: "measurement",
                unit: "Kg",
                precision: 3
            }
        },
        {
            type: "Control",
            scope: "#/properties/netAmount",
            options: {
                variant: "currency",
                currencySymbol: "₹",
                precision: 2
            }
        },
        {
            "type": "Control",
            "scope": "#/properties/isVerified",
            "options": {
                "variant": "radioGroup",
                "direction": "horizontal",
                "radio": {
                    "trueLabel": "Yes",
                    "falseLabel": "No"
                }
            }
        },
        {
            type: "HorizontalLayout",
            elements: [
                {
                    "type": "Control",
                    "scope": "#/properties/isActive",
                    "options": {
                        "variant": "switch",
                        // "showLabel": false
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/bagCount",
                    options: {
                        variant: "number",
                        precision: 0
                    }
                }

            ]
        },
        {
            type: "Control",
            scope: "#/properties/country",
            options: {
                variant: "radioGroup",
                placeholder: "Select country",
                enabledSearch: true
            }
        },
        {
            type: "Control",
            scope: "#/properties/role",
            options: {
                control: "enum",
                variant: "autoComplete",
                direction: "horizontal",
                placeholder: "Select role",
                showDescription: true,
                enumOptions: [
                    {
                        label: "Administrator",
                        value: "admin",
                        description: "Full system access"
                    },
                    {
                        label: "User",
                        value: "user",
                        description: "Limited access"
                    },
                    {
                        label: "Manager",
                        value: "manager",
                        description: "Manages teams"
                    }
                ]
            }
        },
        {
            type: "Control",
            scope: "#/properties/startDate",
            options: {
                placeholder: "Select date",
                dateFormat: "dd MMM yyyy",
                fromYear: 2000,
                toYear: 2035,
            },
        }
    ]
};

/* ------------------------------------------------------------------ */
/* DEMO PAGE */
/* ------------------------------------------------------------------ */
const JsonFormsDemoPage = () => {

    const [basic, setBasic] = React.useState<string>();
    const [withDesc, setWithDesc] = React.useState<string>();
    const [withIcon, setWithIcon] = React.useState<string>();
    const [disabledValue, setDisabledValue] = React.useState<string>("user");
    const [noSearch, setNoSearch] = React.useState<string>();
    const [mixed, setMixed] = React.useState<string>();

    const options: Option[] = [
        {
            label: "Admin",
            value: "admin",
            description: "Full system access"
        },
        {
            label: "User",
            value: "user",
            description: "Limited access"
        },
        {
            label: "Manager",
            value: "manager",
            description: "Manages teams and reports"
        },
        {
            label: "Guest",
            value: "guest",
            disabled: true,
            description: "Read-only access"
        }
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
                JSON Forms – String & Number Input Demo
            </h2>



            <Form
                schema={demoSchema}
                uiSchema={demoUiSchema}
                submitBtnText="Save Demo Data"
                onSubmit={(result) => {
                    console.log("FORM RESULT:", result);
                    alert(
                        result.status
                            ? "Form submitted successfully ✅\nCheck console for data"
                            : "Validation failed ❌\nCheck console for errors"
                    );
                }}
                readOnly={false}
            />

            <div className="space-y-8 p-10 max-w-xl">
                <h1 className="text-2xl font-bold">AutoComplete – All Combinations</h1>

                {/* 1️⃣ Basic */}
                <section className="space-y-2">
                    <h2 className="font-semibold">1. Basic</h2>
                    <AutoComplete
                        value={basic}
                        onChange={setBasic}
                        options={options}
                        placeholder="Select role"
                    />
                    <div className="text-xs text-muted-foreground">
                        Value: {basic ?? "undefined"}
                    </div>
                </section>

                {/* 2️⃣ With description */}
                <section className="space-y-2">
                    <h2 className="font-semibold">2. With description</h2>
                    <AutoComplete
                        value={withDesc}
                        onChange={setWithDesc}
                        options={options}
                        placeholder="Select role"
                        showDescription
                    />
                </section>

                {/* 3️⃣ With start icon */}
                <section className="space-y-2">
                    <h2 className="font-semibold">3. With start icon</h2>
                    <AutoComplete
                        value={withIcon}
                        onChange={setWithIcon}
                        options={options}
                        placeholder="Select role"
                        showStartIcon
                        startIcon={Shield}
                    />
                </section>

                {/* 4️⃣ Disabled */}
                <section className="space-y-2">
                    <h2 className="font-semibold">4. Disabled combobox</h2>
                    {/*<AutoComplete*/}
                    {/*    value={disabledValue}*/}
                    {/*    options={options}*/}
                    {/*    placeholder="Disabled"*/}
                    {/*    disabled*/}
                    {/*    showDescription*/}
                    {/*/>*/}
                </section>

                {/* 5️⃣ Search disabled */}
                <section className="space-y-2">
                    <h2 className="font-semibold">5. Search disabled</h2>
                    <AutoComplete
                        value={noSearch}
                        onChange={setNoSearch}
                        options={options}
                        placeholder="Click to select"
                        enabledSearch={false}
                        showStartIcon
                        startIcon={Search}
                    />
                </section>

                {/* 6️⃣ Mixed flags */}
                <section className="space-y-2">
                    <h2 className="font-semibold">6. Mixed flags</h2>
                    <AutoComplete
                        value={mixed}
                        onChange={setMixed}
                        options={options}
                        placeholder="Role"
                        showDescription
                        showStartIcon
                        startIcon={User}
                    />
                </section>
            </div>
        </div>
    );
};

export default JsonFormsDemoPage;
