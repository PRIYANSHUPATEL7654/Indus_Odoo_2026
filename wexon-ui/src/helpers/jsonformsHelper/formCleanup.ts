export const cleanUpData = (data: any): any => {

    if (Array.isArray(data)) {
        return data
            .map(item => cleanUpData(item))
            .filter(
                item =>
                    item !== undefined &&
                    item !== null &&
                    !(typeof item === "object" && Object.keys(item).length === 0)
            );
    }

    if (typeof data === "object" && data !== null) {
        const result: any = {};

        Object.keys(data).forEach(key => {
            let value = data[key];


            if (typeof value === "string") {
                value = value.trim();
            }


            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                return;
            }

            const cleanedValue = cleanUpData(value);

            if (
                cleanedValue === undefined ||
                cleanedValue === null ||
                (typeof cleanedValue === "object" &&
                    Object.keys(cleanedValue).length === 0)
            ) {
                return;
            }

            result[key] = cleanedValue;
        });

        return result;
    }

    return typeof data === "string" ? data.trim() : data;
};
