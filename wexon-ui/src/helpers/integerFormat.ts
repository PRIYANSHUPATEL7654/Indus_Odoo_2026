
export const formatInteger = (
    value: number,
    unit?: string
) => `${new Intl.NumberFormat("en-IN").format(value)} ${unit ? ` ${unit}` : ""}`;