import { defineSchema, mergeSchemas, operation } from './schemaHelpers';
import {
  testPostSchema,
  testUserSchema,
} from '../../../../tools/test/testSchemas';

describe('mergeSchemas', () => {
  it('should merge schemas multiple times', () => {
    const firstMergedSchema = mergeSchemas(testUserSchema, testPostSchema);

    const schema = defineSchema({
      events: {},
      queries: {},
      commands: {
        testCommand: operation.command,
      },
    });

    const fullSchema = mergeSchemas(firstMergedSchema, schema);

    expect(fullSchema).toMatchInlineSnapshot(`
      {
        "commands": {
          "createPost": OperationDefinition {
            "kind": "command",
            "name": "createPost",
            "payload": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
            "result": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
          },
          "createUser": OperationDefinition {
            "kind": "command",
            "name": "createUser",
            "payload": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
            "result": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
          },
          "testCommand": OperationDefinition {
            "kind": "command",
            "name": "testCommand",
          },
        },
        "events": {
          "postCreated": OperationDefinition {
            "kind": "event",
            "name": "postCreated",
            "payload": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
          },
          "userCreated": OperationDefinition {
            "kind": "event",
            "name": "userCreated",
            "payload": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
          },
        },
        "queries": {
          "getPost": OperationDefinition {
            "kind": "query",
            "name": "getPost",
            "payload": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
            "result": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
          },
          "getUser": OperationDefinition {
            "kind": "query",
            "name": "getUser",
            "payload": ZodObject {
              "_cached": null,
              "_def": {
                "catchall": ZodNever {
                  "_def": {
                    "typeName": "ZodNever",
                  },
                  "and": [Function],
                  "array": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "shape": [Function],
                "typeName": "ZodObject",
                "unknownKeys": "strip",
              },
              "and": [Function],
              "array": [Function],
              "augment": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nonstrict": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
            "result": ZodOptional {
              "_def": {
                "description": undefined,
                "errorMap": [Function],
                "innerType": ZodObject {
                  "_cached": null,
                  "_def": {
                    "catchall": ZodNever {
                      "_def": {
                        "typeName": "ZodNever",
                      },
                      "and": [Function],
                      "array": [Function],
                      "brand": [Function],
                      "catch": [Function],
                      "default": [Function],
                      "describe": [Function],
                      "isNullable": [Function],
                      "isOptional": [Function],
                      "nullable": [Function],
                      "nullish": [Function],
                      "optional": [Function],
                      "or": [Function],
                      "parse": [Function],
                      "parseAsync": [Function],
                      "pipe": [Function],
                      "promise": [Function],
                      "refine": [Function],
                      "refinement": [Function],
                      "safeParse": [Function],
                      "safeParseAsync": [Function],
                      "spa": [Function],
                      "superRefine": [Function],
                      "transform": [Function],
                    },
                    "shape": [Function],
                    "typeName": "ZodObject",
                    "unknownKeys": "strip",
                  },
                  "and": [Function],
                  "array": [Function],
                  "augment": [Function],
                  "brand": [Function],
                  "catch": [Function],
                  "default": [Function],
                  "describe": [Function],
                  "isNullable": [Function],
                  "isOptional": [Function],
                  "nonstrict": [Function],
                  "nullable": [Function],
                  "nullish": [Function],
                  "optional": [Function],
                  "or": [Function],
                  "parse": [Function],
                  "parseAsync": [Function],
                  "pipe": [Function],
                  "promise": [Function],
                  "refine": [Function],
                  "refinement": [Function],
                  "safeParse": [Function],
                  "safeParseAsync": [Function],
                  "spa": [Function],
                  "superRefine": [Function],
                  "transform": [Function],
                },
                "typeName": "ZodOptional",
              },
              "and": [Function],
              "array": [Function],
              "brand": [Function],
              "catch": [Function],
              "default": [Function],
              "describe": [Function],
              "isNullable": [Function],
              "isOptional": [Function],
              "nullable": [Function],
              "nullish": [Function],
              "optional": [Function],
              "or": [Function],
              "parse": [Function],
              "parseAsync": [Function],
              "pipe": [Function],
              "promise": [Function],
              "refine": [Function],
              "refinement": [Function],
              "safeParse": [Function],
              "safeParseAsync": [Function],
              "spa": [Function],
              "superRefine": [Function],
              "transform": [Function],
            },
          },
        },
      }
    `);
  });
});
