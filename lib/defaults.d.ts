// Type definitions for json-schema-defaults
// Definitions by: Michael Wagner <https://github.com/wagich>

export as namespace jsonSchemaDefaults;
export = defaults;

/**
 * Creates an instance object from a JSON Schema using the defaults specified in the schema.
 * @param schema The JSON Schema
 * @param definitions Any additional definitions not included in the JSON Schema
 * @param options The options
 */
declare function defaults(schema: Object, definitions?: Object, options?: defaults.DefaultsOptions): Object;

declare namespace defaults {
    export interface DefaultsOptions {
        /**
         * Set this to true to create a fully scaffolded object (all properties will be set to 
         * appropriate default values, even if no defaults have been specified in the schema).
         */
        scaffold?: boolean;
    }
}
