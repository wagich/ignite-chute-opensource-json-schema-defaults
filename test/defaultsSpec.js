var defaults = typeof require !== 'undefined' ? require('../lib/defaults') : jsonSchemaDefaults;


describe("wrapper", function() {
  it("doesn't expose as global in node", function() {
    if (typeof require !== 'undefined') {
      expect(typeof jsonSchemaDefaults === 'undefined').toBeTruthy();
    }
  });

  it("noConflict returns back the variable", function() {
    if (typeof require === 'undefined') {
      var defaults = jsonSchemaDefaults;
      expect(window.jsonSchemaDefaults).toBeDefined();

      var noConflicted = jsonSchemaDefaults.noConflict();

      expect(noConflicted).toBe(defaults);
      expect(window.jsonSchemaDefaults).toBeUndefined();
    }
  });
});


describe("defaults", function() {
  it("reads defaults from object attributes", function() {
    expect(defaults({
      "title": "Album Options",
      "type": "object",
      "properties": {
        "sort": {
          "type": "string",
          "default": "id"
        },
        "per_page": {
          "default": 30,
          "type": "integer"
        }
      }
    })).toEqual({
      sort: 'id',
      per_page: 30
    });
  });

  it("returns empty object if properties are not present", function() {
    expect(defaults({
      "title": "Album Selector",
      "type": "object"
    })).toEqual({});
  });

  it("sets a falsy value", function() {
    expect(defaults({
      "type": "object",
      "properties": {
        "margin": {
          "type": "integer",
          "default": 0
        },
        "render": {
          "type": "boolean",
          "default": false
        }
      }
    })).toEqual({
      margin: 0,
      render: false
    });
  });

  it("returns empty object if nested object's properties are not present", function() {
    expect(defaults({
      "title": "Wall",
      "type": "object",
      "properties": {
        "album": {
          "title": "Album Selector",
          "type": "object",
          "albumSelector": true
        }
      }
    })).toEqual({
      album: {}
    });
  });

  it("returns null if property default is set to null", function () {
    expect(defaults({
      "type": "object",
      "properties": {
        "albums": {
          "type": "array",
          "default": null
        }
      }
    })).toEqual({
      "albums": null
    });
  });

  it("sets album shortcut from default", function() {
    expect(defaults({
      "type": "object",
      "title": "Album Selector",
      "albumSelector": true,
      "default": {
        "shortcut": "9IZukfpi"
      }
    })).toEqual({
      shortcut: "9IZukfpi"
    });
  });

  it("doesnt set attribute without a default value", function() {
    expect(defaults({
      "type": "string"
    })).toBeUndefined();
  });

  it("doesn't set object's attribute without a default value", function() {
    expect(defaults({
      "type": "object",
      "properties": {
        "per_page": {
          "type": "integer",
          "default": 30
        },
        "sort": {
          "type": "string"
        }
      }
    })).toEqual({
      per_page: 30
    });
  });

  it("doesn't set object's only attribute without a default value", function() {
    expect(defaults({
      "type": "object",
      "properties": {
        "sort": {
          "type": "string"
        }
      }
    })).toEqual({});
  });

  it("sets default values of an array type", function() {
    expect(defaults({
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": ["getchute", "chute"]
    })).toEqual([
      "getchute",
      "chute"
    ]);
  });

  it("sets default values of array of objects", function () {
    var values = defaults({
      "type": "array",
      "default": [
        {
          "fieldOne": "1",
          "fieldTwo": "2"
        }
      ]
    });
    expect(values).toEqual([
      { fieldOne: "1", fieldTwo: "2" }
    ]);
    expect(Array.isArray(values)).toBe(true);
  });

  it("sets default values of nested array type", function() {
    expect(defaults({
      "type": "object",
      "properties": {
        "albums": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "shortcut": {
                "type": "string",
                "default": "abc123"
              }
            }
          }
        }
      }
    })).toEqual({
      "albums": [
        { "shortcut": "abc123" }
      ]
    });
  });

  it("returns empty array when items are not present", function() {
    expect(defaults({
      "type": "object",
      "properties": {
        "albums": {
          "type": "array"
        }
      }
    })).toEqual({
      "albums": []
    });
  });

  it("returns empty array when no defaults set", function() {
    expect(defaults({
      "type": "array",
      "items": {
        "type": "string"
      }
    })).toEqual([]);
  });

  it("returns array with min items", function() {
    expect(defaults({
      "type": "object",
      "properties": {
        "albums": {
          "type": "array",
          "items": {
            "type": "string",
            "default": "xyz"
          },
          "minItems": 2
        }
      }
    })).toEqual({
      "albums": ["xyz", "xyz"]
    });
  });

  it("returns array of min items that are not the same instance", function() {
    var result = defaults({
      "type": "object",
      "properties": {
        "albums": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "minItems": 2,
          "maxItems": 2
        }
      }
    })
    expect(result).toEqual({
      "albums": [{}, {}]
    });
    expect(result['albums'][0]).not.toBe(result['albums'][1]);
  });

  it("returns empty objects if scaffold:true", function() {
    var result = defaults({
      "type": "object",
      "properties": {
        "albums": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "minItems": 2,
          "maxItems": 2
        }
      }
    }, null, {
      scaffold: true
    })
    expect(result).toEqual({
      "albums": [{}, {}]
    });
  });

  it("returns array of tuples with one item set by default value", function() {
    expect(defaults({
      "type": "array",
      "items": [
        {
          "type": "string",
          "default": "xyz"
        },
        {
          "type": "number"
        }
      ]
    })).toEqual(["xyz"]);
  });

  it("returns array of tuples with undefined value if requested by min items", function() {
    expect(defaults({
      "type": "array",
      "items": [
        {
          "type": "string",
          "default": "xyz"
        },
        {
          "type": "number"
        }
      ],
      "minItems": 2
    })).toEqual(["xyz", undefined]);
  });

  it("returns array of tuples with undefined value if there are defaults after it", function() {
    expect(defaults({
      "type": "array",
      "items": [
        {
          "type": "string",
          "default": "xyz"
        },
        {
          "type": "number"
        },
        {
          "type": "string",
          "default": "abc"
        }
      ]
    })).toEqual(["xyz", undefined, "abc"]);
  });

  it('returns defaults if they are present in reference', function () {
    expect(defaults({
      "type": "object",
      "properties": {
        "per_page": {
          "$ref": "#/definitions/per_page"
        },
        "sort": {
          "type": "string"
        }
      },
      "definitions": {
        "per_page": {
          "type": "integer",
          "default": 30
        }
      }
    })).toEqual({
      per_page: 30
    });
  });

  it('should not throw exception if reference is not correct', function () {
    expect(defaults({
      "type": "object",
      "properties": {
        "per_page": {
          "$ref": "#/definitions/page_per"
        },
        "sort": {
          "type": "string"
        }
      },
      "definitions": {
        "per_page": {
          "type": "integer",
          "default": 30
        }
      }
    })).toEqual({});
  });

  it('returns defaults if they are present in nested reference', function () {
    expect(defaults({
      "$ref": "#/definitions/foo",
      "definitions": {
        "foo": {
          "type": "object",
          "properties": {
            "per_page": {
              "$ref": "#/definitions/per_page"
            }
          }
        },
        "per_page": {
          "type": "integer",
          "default": 30
        }
      }
    })).toEqual({
      per_page: 30
    });
  });

  it('should merge objects from "allOf" list and extract defaults from result object', function () {
    expect(defaults({
      "type": "object",
      "properties": {
        "per_page": {
          "$ref": "#/definitions/per_page"
        },
        "per_page_big": {
          "allOf": [
            {"$ref": "#/definitions/per_page"},
            {"default": 50}
          ]

        },
        "sort": {
          "type": "string"
        }
      },
      "definitions": {
        "per_page": {
          "type": "integer",
          "default": 30
        }
      }
    })).toEqual({
      per_page: 30,
      per_page_big: 50
    });

    var res = defaults({
      "type": "object",
      "properties": {
        "farewell_to_arms": {
          "allOf": [
            {"$ref": "#/definitions/book"},
            {"properties": {
              "price": {
                "default": 30
              }
            }}
          ]
        },
        "for_whom_the_bell_tolls": {
          "allOf": [
            {"$ref": "#/definitions/book"},
            {"properties": {
              "price": {
                "default": 100
              }
            }}
          ]
        }
      },
      "definitions": {
        "book": {
          "type": "object",
          "properties": {
            "author": {
              "type": "string",
              "default": "Hemingway"
            },
            "price": {
              "type": "integer",
              "default": 10
            }
          }
        }
      }
    });

    expect(res).toEqual({
      farewell_to_arms: {
        author: "Hemingway",
        price: 30
      },
      for_whom_the_bell_tolls: {
        author: "Hemingway",
        price: 100
      }
    });
  });

  it('scaffolds default values when scaffold: true', function() {
    expect(defaults({
      "type": "object",
      "properties": {
        "per_page": {
          "type": "integer",
          "default": 30
        },
        "string": {
          "type": "string"
        },
        "number": {
          "type": "number"
        },
        "integer": {
          "type": "integer"
        },
        "boolean": {
          "type": "boolean"
        },
        "object": {
          "type": "object"
        },
        "array": {
          "type": "array"
        },
        "null": {
          "type": "null"
        },
        "booleanSchemaTrue": true,
        "booleanSchemaFalse": false,
        "emptySchema": {}
      }
    }, null, {
      scaffold: true
    })).toEqual({
      per_page: 30,
      string: '',
      number: 0,
      integer: 0,
      boolean: false,
      object: {},
      array: [],
      'null': null,
      booleanSchemaTrue: null,
      emptySchema: null
    });
  })

  it("returns array of with default values if scaffold: true", function() {
    expect(defaults({
      "type": "array",
      "items": [
        {
          "type": "string"
        },
        {
          "type": "number"
        },
        {
          "type": "integer"
        },
        {
          "type": "boolean"
        },
        {
          "type": "object"
        },
        {
          "type": "array"
        },
        {
          "type": "null"
        },
        true,
        {}
      ],
      "minItems": 10
    }, null, {
      scaffold: true
    })).toEqual(["", 0, 0,  false, {}, [], null, null, null]);
  });
});
