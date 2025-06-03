export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export interface SearchResult {
    path: string[];
    matchType: 'key' | 'value';
    matchedText: string;
}


export const searchJsonPaths = (
    obj: JsonValue,
    searchString: string,
    caseSensitive: boolean = false
): SearchResult[] => {
    const results: SearchResult[] = [];
    const search = caseSensitive ? searchString : searchString.toLowerCase();

    function traverse(current: JsonValue, currentPath: string[]): void {
        if (current === null || typeof current !== 'object') {
            return;
        }

        if (Array.isArray(current)) {
            // For arrays, check each element
            current.forEach((item, index) => {
                const itemPath = [...currentPath, String(index)];

                // Check if the array element's value matches
                if (item !== null && typeof item !== 'object') {
                    const valueStr = caseSensitive ? String(item) : String(item).toLowerCase();
                    if (valueStr.includes(search)) {
                        results.push({
                            path: currentPath, // Path to the array containing the match
                            matchType: 'value',
                            matchedText: String(item)
                        });
                    }
                }

                // Recursively search deeper
                traverse(item, itemPath);
            });
        } else {
            // For objects, check keys and direct values
            const objectEntries = Object.entries(current as JsonObject);

            objectEntries.forEach(([key, value]) => {
                const keyPath = [...currentPath, key];

                // Check if key matches
                const keyStr = caseSensitive ? key : key.toLowerCase();
                if (keyStr.includes(search)) {
                    results.push({
                        path: currentPath, // Path to the object containing the matching key
                        matchType: 'key',
                        matchedText: key
                    });
                }

                // Check if direct value matches (only for primitive values)
                if (value !== null && typeof value !== 'object') {
                    const valueStr = caseSensitive ? String(value) : String(value).toLowerCase();
                    if (valueStr.includes(search)) {
                        results.push({
                            path: currentPath, // Path to the object containing the matching value
                            matchType: 'value',
                            matchedText: String(value)
                        });
                    }
                }

                // Recursively search deeper
                traverse(value, keyPath);
            });
        }
    }

    traverse(obj, []);
    return results;
}

/**
* Simplified version that returns just the paths as string arrays
*/
export const searchJsonPathsSimple = (
    obj: JsonValue,
    searchString: string,
    caseSensitive: boolean = false
): string[][] => {
    const results = searchJsonPaths(obj, searchString, caseSensitive);
    const uniquePaths = new Map<string, string[]>();

    // Use path as string key to deduplicate, keep original array as value
    results.forEach(result => {
        const pathKey = result.path.join('.');
        if (!uniquePaths.has(pathKey)) {
            uniquePaths.set(pathKey, result.path);
        }
    });

    return Array.from(uniquePaths.values());
}
