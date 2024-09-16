// TODO: We might be able to reuse types from torii-client. However, they are nested, we can simplify them like this:
export type PrimitiveType = string | number | boolean;

export type SchemaType = {
    [key: string]: {
        [key: string]: any;
    };
};

export type QueryOptions = {
    limit?: number; // Limit the number of results returned
    offset?: number; // Offset the results returned
    entityId?: string; // Get the specific entity by ID. Which is the key in the db.
};

export interface WhereOptions extends QueryOptions {
    where?: Record<
        string,
        {
            // Add more operators as needed
            $eq?: PrimitiveType;
            $neq?: PrimitiveType;
            $gt?: PrimitiveType;
            $gte?: PrimitiveType;
            $lt?: PrimitiveType;
            $lte?: PrimitiveType;
        }
    >;
}
// Used for complex queries in fetching data
export type QueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [K in keyof T]?: {
        [L in keyof T[K]]?: {
            $?: WhereOptions;
        };
    };
};

export type SubscriptionQueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [K in keyof T]?: {
        [L in keyof T[K]]?: true | string[];
    };
};

export type QueryResult<T extends SchemaType> = {
    [K in keyof T]: {
        [L in keyof T[K]]: Array<{
            [P in keyof T[K][L]]: T[K][L][P] extends SchemaType
                ? QueryResult<T[K][L][P]>
                : T[K][L][P];
        }>;
    };
};
