"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/binary-parser/dist/binary_parser.js
  var require_binary_parser = __commonJS({
    "node_modules/binary-parser/dist/binary_parser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Parser = void 0;
      var Context = class {
        constructor(importPath, useContextVariables) {
          this.code = "";
          this.scopes = [["vars"]];
          this.bitFields = [];
          this.tmpVariableCount = 0;
          this.references = /* @__PURE__ */ new Map();
          this.imports = [];
          this.reverseImports = /* @__PURE__ */ new Map();
          this.useContextVariables = false;
          this.importPath = importPath;
          this.useContextVariables = useContextVariables;
        }
        generateVariable(name) {
          const scopes = [...this.scopes[this.scopes.length - 1]];
          if (name) {
            scopes.push(name);
          }
          return scopes.join(".");
        }
        generateOption(val) {
          switch (typeof val) {
            case "number":
              return val.toString();
            case "string":
              return this.generateVariable(val);
            case "function":
              return `${this.addImport(val)}.call(${this.generateVariable()}, vars)`;
          }
        }
        generateError(err) {
          this.pushCode(`throw new Error(${err});`);
        }
        generateTmpVariable() {
          return "$tmp" + this.tmpVariableCount++;
        }
        pushCode(code) {
          this.code += code + "\n";
        }
        pushPath(name) {
          if (name) {
            this.scopes[this.scopes.length - 1].push(name);
          }
        }
        popPath(name) {
          if (name) {
            this.scopes[this.scopes.length - 1].pop();
          }
        }
        pushScope(name) {
          this.scopes.push([name]);
        }
        popScope() {
          this.scopes.pop();
        }
        addImport(im) {
          if (!this.importPath)
            return `(${im})`;
          let id = this.reverseImports.get(im);
          if (!id) {
            id = this.imports.push(im) - 1;
            this.reverseImports.set(im, id);
          }
          return `${this.importPath}[${id}]`;
        }
        addReference(alias) {
          if (!this.references.has(alias)) {
            this.references.set(alias, { resolved: false, requested: false });
          }
        }
        markResolved(alias) {
          const reference = this.references.get(alias);
          if (reference) {
            reference.resolved = true;
          }
        }
        markRequested(aliasList) {
          aliasList.forEach((alias) => {
            const reference = this.references.get(alias);
            if (reference) {
              reference.requested = true;
            }
          });
        }
        getUnresolvedReferences() {
          return Array.from(this.references).filter(([_, reference]) => !reference.resolved && !reference.requested).map(([alias, _]) => alias);
        }
      };
      var aliasRegistry = /* @__PURE__ */ new Map();
      var FUNCTION_PREFIX = "___parser_";
      var PRIMITIVE_SIZES = {
        uint8: 1,
        uint16le: 2,
        uint16be: 2,
        uint32le: 4,
        uint32be: 4,
        int8: 1,
        int16le: 2,
        int16be: 2,
        int32le: 4,
        int32be: 4,
        int64be: 8,
        int64le: 8,
        uint64be: 8,
        uint64le: 8,
        floatle: 4,
        floatbe: 4,
        doublele: 8,
        doublebe: 8
      };
      var PRIMITIVE_NAMES = {
        uint8: "Uint8",
        uint16le: "Uint16",
        uint16be: "Uint16",
        uint32le: "Uint32",
        uint32be: "Uint32",
        int8: "Int8",
        int16le: "Int16",
        int16be: "Int16",
        int32le: "Int32",
        int32be: "Int32",
        int64be: "BigInt64",
        int64le: "BigInt64",
        uint64be: "BigUint64",
        uint64le: "BigUint64",
        floatle: "Float32",
        floatbe: "Float32",
        doublele: "Float64",
        doublebe: "Float64"
      };
      var PRIMITIVE_LITTLE_ENDIANS = {
        uint8: false,
        uint16le: true,
        uint16be: false,
        uint32le: true,
        uint32be: false,
        int8: false,
        int16le: true,
        int16be: false,
        int32le: true,
        int32be: false,
        int64be: false,
        int64le: true,
        uint64be: false,
        uint64le: true,
        floatle: true,
        floatbe: false,
        doublele: true,
        doublebe: false
      };
      var Parser = class _Parser {
        constructor() {
          this.varName = "";
          this.type = "";
          this.options = {};
          this.endian = "be";
          this.useContextVariables = false;
        }
        static start() {
          return new _Parser();
        }
        sanitizeFieldName(name) {
          if (name && !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
            throw new Error(`Invalid field name: ${name}`);
          }
          return name;
        }
        sanitizeEncoding(encoding) {
          const allowed = [
            "utf8",
            "utf-8",
            "ascii",
            "hex",
            "base64",
            "base64url",
            "latin1",
            "binary"
          ];
          if (!allowed.includes(encoding.toLowerCase())) {
            throw new Error(`Invalid encoding: ${encoding}`);
          }
          return encoding;
        }
        primitiveGenerateN(type, ctx) {
          const typeName = PRIMITIVE_NAMES[type];
          const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
          ctx.pushCode(`${ctx.generateVariable(this.varName)} = dataView.get${typeName}(offset, ${littleEndian});`);
          ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
        }
        primitiveN(type, varName, options) {
          return this.setNextParser(type, varName, options);
        }
        useThisEndian(type) {
          return type + this.endian.toLowerCase();
        }
        uint8(varName, options = {}) {
          return this.primitiveN("uint8", varName, options);
        }
        uint16(varName, options = {}) {
          return this.primitiveN(this.useThisEndian("uint16"), varName, options);
        }
        uint16le(varName, options = {}) {
          return this.primitiveN("uint16le", varName, options);
        }
        uint16be(varName, options = {}) {
          return this.primitiveN("uint16be", varName, options);
        }
        uint32(varName, options = {}) {
          return this.primitiveN(this.useThisEndian("uint32"), varName, options);
        }
        uint32le(varName, options = {}) {
          return this.primitiveN("uint32le", varName, options);
        }
        uint32be(varName, options = {}) {
          return this.primitiveN("uint32be", varName, options);
        }
        int8(varName, options = {}) {
          return this.primitiveN("int8", varName, options);
        }
        int16(varName, options = {}) {
          return this.primitiveN(this.useThisEndian("int16"), varName, options);
        }
        int16le(varName, options = {}) {
          return this.primitiveN("int16le", varName, options);
        }
        int16be(varName, options = {}) {
          return this.primitiveN("int16be", varName, options);
        }
        int32(varName, options = {}) {
          return this.primitiveN(this.useThisEndian("int32"), varName, options);
        }
        int32le(varName, options = {}) {
          return this.primitiveN("int32le", varName, options);
        }
        int32be(varName, options = {}) {
          return this.primitiveN("int32be", varName, options);
        }
        bigIntVersionCheck() {
          if (!DataView.prototype.getBigInt64)
            throw new Error("BigInt64 is unsupported on this runtime");
        }
        int64(varName, options = {}) {
          this.bigIntVersionCheck();
          return this.primitiveN(this.useThisEndian("int64"), varName, options);
        }
        int64be(varName, options = {}) {
          this.bigIntVersionCheck();
          return this.primitiveN("int64be", varName, options);
        }
        int64le(varName, options = {}) {
          this.bigIntVersionCheck();
          return this.primitiveN("int64le", varName, options);
        }
        uint64(varName, options = {}) {
          this.bigIntVersionCheck();
          return this.primitiveN(this.useThisEndian("uint64"), varName, options);
        }
        uint64be(varName, options = {}) {
          this.bigIntVersionCheck();
          return this.primitiveN("uint64be", varName, options);
        }
        uint64le(varName, options = {}) {
          this.bigIntVersionCheck();
          return this.primitiveN("uint64le", varName, options);
        }
        floatle(varName, options = {}) {
          return this.primitiveN("floatle", varName, options);
        }
        floatbe(varName, options = {}) {
          return this.primitiveN("floatbe", varName, options);
        }
        doublele(varName, options = {}) {
          return this.primitiveN("doublele", varName, options);
        }
        doublebe(varName, options = {}) {
          return this.primitiveN("doublebe", varName, options);
        }
        bitN(size, varName, options) {
          options.length = size;
          return this.setNextParser("bit", varName, options);
        }
        bit1(varName, options = {}) {
          return this.bitN(1, varName, options);
        }
        bit2(varName, options = {}) {
          return this.bitN(2, varName, options);
        }
        bit3(varName, options = {}) {
          return this.bitN(3, varName, options);
        }
        bit4(varName, options = {}) {
          return this.bitN(4, varName, options);
        }
        bit5(varName, options = {}) {
          return this.bitN(5, varName, options);
        }
        bit6(varName, options = {}) {
          return this.bitN(6, varName, options);
        }
        bit7(varName, options = {}) {
          return this.bitN(7, varName, options);
        }
        bit8(varName, options = {}) {
          return this.bitN(8, varName, options);
        }
        bit9(varName, options = {}) {
          return this.bitN(9, varName, options);
        }
        bit10(varName, options = {}) {
          return this.bitN(10, varName, options);
        }
        bit11(varName, options = {}) {
          return this.bitN(11, varName, options);
        }
        bit12(varName, options = {}) {
          return this.bitN(12, varName, options);
        }
        bit13(varName, options = {}) {
          return this.bitN(13, varName, options);
        }
        bit14(varName, options = {}) {
          return this.bitN(14, varName, options);
        }
        bit15(varName, options = {}) {
          return this.bitN(15, varName, options);
        }
        bit16(varName, options = {}) {
          return this.bitN(16, varName, options);
        }
        bit17(varName, options = {}) {
          return this.bitN(17, varName, options);
        }
        bit18(varName, options = {}) {
          return this.bitN(18, varName, options);
        }
        bit19(varName, options = {}) {
          return this.bitN(19, varName, options);
        }
        bit20(varName, options = {}) {
          return this.bitN(20, varName, options);
        }
        bit21(varName, options = {}) {
          return this.bitN(21, varName, options);
        }
        bit22(varName, options = {}) {
          return this.bitN(22, varName, options);
        }
        bit23(varName, options = {}) {
          return this.bitN(23, varName, options);
        }
        bit24(varName, options = {}) {
          return this.bitN(24, varName, options);
        }
        bit25(varName, options = {}) {
          return this.bitN(25, varName, options);
        }
        bit26(varName, options = {}) {
          return this.bitN(26, varName, options);
        }
        bit27(varName, options = {}) {
          return this.bitN(27, varName, options);
        }
        bit28(varName, options = {}) {
          return this.bitN(28, varName, options);
        }
        bit29(varName, options = {}) {
          return this.bitN(29, varName, options);
        }
        bit30(varName, options = {}) {
          return this.bitN(30, varName, options);
        }
        bit31(varName, options = {}) {
          return this.bitN(31, varName, options);
        }
        bit32(varName, options = {}) {
          return this.bitN(32, varName, options);
        }
        namely(alias) {
          aliasRegistry.set(alias, this);
          this.alias = alias;
          return this;
        }
        skip(length, options = {}) {
          return this.seek(length, options);
        }
        seek(relOffset, options = {}) {
          if (options.assert) {
            throw new Error("assert option on seek is not allowed.");
          }
          return this.setNextParser("seek", "", { length: relOffset });
        }
        string(varName, options) {
          if (!options.zeroTerminated && !options.length && !options.greedy) {
            throw new Error("One of length, zeroTerminated, or greedy must be defined for string.");
          }
          if ((options.zeroTerminated || options.length) && options.greedy) {
            throw new Error("greedy is mutually exclusive with length and zeroTerminated for string.");
          }
          if (options.stripNull && !(options.length || options.greedy)) {
            throw new Error("length or greedy must be defined if stripNull is enabled.");
          }
          options.encoding = options.encoding || "utf8";
          this.sanitizeEncoding(options.encoding);
          return this.setNextParser("string", varName, options);
        }
        buffer(varName, options) {
          if (!options.length && !options.readUntil) {
            throw new Error("length or readUntil must be defined for buffer.");
          }
          return this.setNextParser("buffer", varName, options);
        }
        wrapped(varName, options) {
          if (typeof options !== "object" && typeof varName === "object") {
            options = varName;
            varName = "";
          }
          if (!options || !options.wrapper || !options.type) {
            throw new Error("Both wrapper and type must be defined for wrapped.");
          }
          if (!options.length && !options.readUntil) {
            throw new Error("length or readUntil must be defined for wrapped.");
          }
          return this.setNextParser("wrapper", varName, options);
        }
        array(varName, options) {
          if (!options.readUntil && !options.length && !options.lengthInBytes) {
            throw new Error("One of readUntil, length and lengthInBytes must be defined for array.");
          }
          if (!options.type) {
            throw new Error("type is required for array.");
          }
          if (typeof options.type === "string" && !aliasRegistry.has(options.type) && !(options.type in PRIMITIVE_SIZES)) {
            throw new Error(`Array element type "${options.type}" is unknown.`);
          }
          return this.setNextParser("array", varName, options);
        }
        choice(varName, options) {
          if (typeof options !== "object" && typeof varName === "object") {
            options = varName;
            varName = "";
          }
          if (!options) {
            throw new Error("tag and choices are are required for choice.");
          }
          if (!options.tag) {
            throw new Error("tag is requird for choice.");
          }
          if (!options.choices) {
            throw new Error("choices is required for choice.");
          }
          for (const keyString in options.choices) {
            const key = parseInt(keyString, 10);
            const value = options.choices[key];
            if (isNaN(key)) {
              throw new Error(`Choice key "${keyString}" is not a number.`);
            }
            if (typeof value === "string" && !aliasRegistry.has(value) && !(value in PRIMITIVE_SIZES)) {
              throw new Error(`Choice type "${value}" is unknown.`);
            }
          }
          return this.setNextParser("choice", varName, options);
        }
        nest(varName, options) {
          if (typeof options !== "object" && typeof varName === "object") {
            options = varName;
            varName = "";
          }
          if (!options || !options.type) {
            throw new Error("type is required for nest.");
          }
          if (!(options.type instanceof _Parser) && !aliasRegistry.has(options.type)) {
            throw new Error("type must be a known parser name or a Parser object.");
          }
          if (!(options.type instanceof _Parser) && !varName) {
            throw new Error("type must be a Parser object if the variable name is omitted.");
          }
          return this.setNextParser("nest", varName, options);
        }
        pointer(varName, options) {
          if (options.offset == null) {
            throw new Error("offset is required for pointer.");
          }
          if (!options.type) {
            throw new Error("type is required for pointer.");
          }
          if (typeof options.type === "string" && !(options.type in PRIMITIVE_SIZES) && !aliasRegistry.has(options.type)) {
            throw new Error(`Pointer type "${options.type}" is unknown.`);
          }
          return this.setNextParser("pointer", varName, options);
        }
        saveOffset(varName, options = {}) {
          return this.setNextParser("saveOffset", varName, options);
        }
        endianness(endianness) {
          switch (endianness.toLowerCase()) {
            case "little":
              this.endian = "le";
              break;
            case "big":
              this.endian = "be";
              break;
            default:
              throw new Error('endianness must be one of "little" or "big"');
          }
          return this;
        }
        endianess(endianess) {
          return this.endianness(endianess);
        }
        useContextVars(useContextVariables = true) {
          this.useContextVariables = useContextVariables;
          return this;
        }
        create(constructorFn) {
          if (!(constructorFn instanceof Function)) {
            throw new Error("Constructor must be a Function object.");
          }
          this.constructorFn = constructorFn;
          return this;
        }
        getContext(importPath) {
          const ctx = new Context(importPath, this.useContextVariables);
          ctx.pushCode("var dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);");
          if (!this.alias) {
            this.addRawCode(ctx);
          } else {
            this.addAliasedCode(ctx);
            ctx.pushCode(`return ${FUNCTION_PREFIX + this.alias}(0).result;`);
          }
          return ctx;
        }
        getCode() {
          const importPath = "imports";
          return this.getContext(importPath).code;
        }
        addRawCode(ctx) {
          ctx.pushCode("var offset = 0;");
          ctx.pushCode(`var vars = ${this.constructorFn ? "new constructorFn()" : "{}"};`);
          ctx.pushCode("vars.$parent = null;");
          ctx.pushCode("vars.$root = vars;");
          this.generate(ctx);
          this.resolveReferences(ctx);
          ctx.pushCode("delete vars.$parent;");
          ctx.pushCode("delete vars.$root;");
          ctx.pushCode("return vars;");
        }
        addAliasedCode(ctx) {
          ctx.pushCode(`function ${FUNCTION_PREFIX + this.alias}(offset, context) {`);
          ctx.pushCode(`var vars = ${this.constructorFn ? "new constructorFn()" : "{}"};`);
          ctx.pushCode("var ctx = Object.assign({$parent: null, $root: vars}, context || {});");
          ctx.pushCode(`vars = Object.assign(vars, ctx);`);
          this.generate(ctx);
          ctx.markResolved(this.alias);
          this.resolveReferences(ctx);
          ctx.pushCode("Object.keys(ctx).forEach(function (item) { delete vars[item]; });");
          ctx.pushCode("return { offset: offset, result: vars };");
          ctx.pushCode("}");
          return ctx;
        }
        resolveReferences(ctx) {
          const references = ctx.getUnresolvedReferences();
          ctx.markRequested(references);
          references.forEach((alias) => {
            var _a;
            (_a = aliasRegistry.get(alias)) === null || _a === void 0 ? void 0 : _a.addAliasedCode(ctx);
          });
        }
        compile() {
          const importPath = "imports";
          const ctx = this.getContext(importPath);
          this.compiled = new Function(importPath, "TextDecoder", `return function (buffer, constructorFn) { ${ctx.code} };`)(ctx.imports, TextDecoder);
        }
        sizeOf() {
          let size = NaN;
          if (Object.keys(PRIMITIVE_SIZES).indexOf(this.type) >= 0) {
            size = PRIMITIVE_SIZES[this.type];
          } else if (this.type === "string" && typeof this.options.length === "number") {
            size = this.options.length;
          } else if (this.type === "buffer" && typeof this.options.length === "number") {
            size = this.options.length;
          } else if (this.type === "array" && typeof this.options.length === "number") {
            let elementSize = NaN;
            if (typeof this.options.type === "string") {
              elementSize = PRIMITIVE_SIZES[this.options.type];
            } else if (this.options.type instanceof _Parser) {
              elementSize = this.options.type.sizeOf();
            }
            size = this.options.length * elementSize;
          } else if (this.type === "seek") {
            size = this.options.length;
          } else if (this.type === "nest") {
            size = this.options.type.sizeOf();
          } else if (!this.type) {
            size = 0;
          }
          if (this.next) {
            size += this.next.sizeOf();
          }
          return size;
        }
        // Follow the parser chain till the root and start parsing from there
        parse(buffer) {
          if (!this.compiled) {
            this.compile();
          }
          return this.compiled(buffer, this.constructorFn);
        }
        setNextParser(type, varName, options) {
          const parser = new _Parser();
          parser.type = type;
          parser.varName = this.sanitizeFieldName(varName);
          parser.options = options;
          parser.endian = this.endian;
          if (this.head) {
            this.head.next = parser;
          } else {
            this.next = parser;
          }
          this.head = parser;
          return this;
        }
        // Call code generator for this parser
        generate(ctx) {
          if (this.type) {
            switch (this.type) {
              case "uint8":
              case "uint16le":
              case "uint16be":
              case "uint32le":
              case "uint32be":
              case "int8":
              case "int16le":
              case "int16be":
              case "int32le":
              case "int32be":
              case "int64be":
              case "int64le":
              case "uint64be":
              case "uint64le":
              case "floatle":
              case "floatbe":
              case "doublele":
              case "doublebe":
                this.primitiveGenerateN(this.type, ctx);
                break;
              case "bit":
                this.generateBit(ctx);
                break;
              case "string":
                this.generateString(ctx);
                break;
              case "buffer":
                this.generateBuffer(ctx);
                break;
              case "seek":
                this.generateSeek(ctx);
                break;
              case "nest":
                this.generateNest(ctx);
                break;
              case "array":
                this.generateArray(ctx);
                break;
              case "choice":
                this.generateChoice(ctx);
                break;
              case "pointer":
                this.generatePointer(ctx);
                break;
              case "saveOffset":
                this.generateSaveOffset(ctx);
                break;
              case "wrapper":
                this.generateWrapper(ctx);
                break;
            }
            if (this.type !== "bit")
              this.generateAssert(ctx);
          }
          const varName = ctx.generateVariable(this.varName);
          if (this.options.formatter && this.type !== "bit") {
            this.generateFormatter(ctx, varName, this.options.formatter);
          }
          return this.generateNext(ctx);
        }
        generateAssert(ctx) {
          if (!this.options.assert) {
            return;
          }
          const varName = ctx.generateVariable(this.varName);
          switch (typeof this.options.assert) {
            case "function":
              {
                const func = ctx.addImport(this.options.assert);
                ctx.pushCode(`if (!${func}.call(vars, ${varName})) {`);
              }
              break;
            case "number":
              ctx.pushCode(`if (${this.options.assert} !== ${varName}) {`);
              break;
            case "string":
              ctx.pushCode(`if (${JSON.stringify(this.options.assert)} !== ${varName}) {`);
              break;
            default:
              throw new Error("assert option must be a string, number or a function.");
          }
          ctx.generateError(`"Assertion error: ${varName} is " + ${JSON.stringify(this.options.assert.toString())}`);
          ctx.pushCode("}");
        }
        // Recursively call code generators and append results
        generateNext(ctx) {
          if (this.next) {
            ctx = this.next.generate(ctx);
          }
          return ctx;
        }
        nextNotBit() {
          if (this.next) {
            if (this.next.type === "nest") {
              if (this.next.options && this.next.options.type instanceof _Parser) {
                if (this.next.options.type.next) {
                  return this.next.options.type.next.type !== "bit";
                }
                return false;
              } else {
                return true;
              }
            } else {
              return this.next.type !== "bit";
            }
          } else {
            return true;
          }
        }
        generateBit(ctx) {
          const parser = JSON.parse(JSON.stringify(this));
          parser.options = this.options;
          parser.generateAssert = this.generateAssert.bind(this);
          parser.generateFormatter = this.generateFormatter.bind(this);
          parser.varName = ctx.generateVariable(parser.varName);
          ctx.bitFields.push(parser);
          if (!this.next || this.nextNotBit()) {
            const val = ctx.generateTmpVariable();
            ctx.pushCode(`var ${val} = 0;`);
            const getMaxBits = (from = 0) => {
              let sum2 = 0;
              for (let i2 = from; i2 < ctx.bitFields.length; i2++) {
                const length = ctx.bitFields[i2].options.length;
                if (sum2 + length > 32)
                  break;
                sum2 += length;
              }
              return sum2;
            };
            const getBytes = (sum2) => {
              if (sum2 <= 8) {
                ctx.pushCode(`${val} = dataView.getUint8(offset);`);
                sum2 = 8;
              } else if (sum2 <= 16) {
                ctx.pushCode(`${val} = dataView.getUint16(offset);`);
                sum2 = 16;
              } else if (sum2 <= 24) {
                ctx.pushCode(`${val} = (dataView.getUint16(offset) << 8) | dataView.getUint8(offset + 2);`);
                sum2 = 24;
              } else {
                ctx.pushCode(`${val} = dataView.getUint32(offset);`);
                sum2 = 32;
              }
              ctx.pushCode(`offset += ${sum2 / 8};`);
              return sum2;
            };
            let bitOffset = 0;
            const isBigEndian = this.endian === "be";
            let sum = 0;
            let rem = 0;
            ctx.bitFields.forEach((parser2, i2) => {
              let length = parser2.options.length;
              if (length > rem) {
                if (rem) {
                  const mask2 = -1 >>> 32 - rem;
                  ctx.pushCode(`${parser2.varName} = (${val} & 0x${mask2.toString(16)}) << ${length - rem};`);
                  length -= rem;
                }
                bitOffset = 0;
                rem = sum = getBytes(getMaxBits(i2) - rem);
              }
              const offset = isBigEndian ? sum - bitOffset - length : bitOffset;
              const mask = -1 >>> 32 - length;
              ctx.pushCode(`${parser2.varName} ${length < parser2.options.length ? "|=" : "="} ${val} >> ${offset} & 0x${mask.toString(16)};`);
              if (parser2.options.length === 32) {
                ctx.pushCode(`${parser2.varName} >>>= 0`);
              }
              if (parser2.options.assert) {
                parser2.generateAssert(ctx);
              }
              if (parser2.options.formatter) {
                parser2.generateFormatter(ctx, parser2.varName, parser2.options.formatter);
              }
              bitOffset += length;
              rem -= length;
            });
            ctx.bitFields = [];
          }
        }
        generateSeek(ctx) {
          const length = ctx.generateOption(this.options.length);
          ctx.pushCode(`offset += ${length};`);
        }
        generateString(ctx) {
          const name = ctx.generateVariable(this.varName);
          const start = ctx.generateTmpVariable();
          const encoding = this.options.encoding;
          const isHex = encoding.toLowerCase() === "hex";
          const toHex = 'b => b.toString(16).padStart(2, "0")';
          if (this.options.length && this.options.zeroTerminated) {
            const len = this.options.length;
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode(`while(dataView.getUint8(offset++) !== 0 && offset - ${start} < ${len});`);
            const end = `offset - ${start} < ${len} ? offset - 1 : offset`;
            ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(${start}, ${end}), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, ${end}));`);
          } else if (this.options.length) {
            const len = ctx.generateOption(this.options.length);
            ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(offset, offset + ${len}), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(offset, offset + ${len}));`);
            ctx.pushCode(`offset += ${len};`);
          } else if (this.options.zeroTerminated) {
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode("while(dataView.getUint8(offset++) !== 0);");
            ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(${start}, offset - 1), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, offset - 1));`);
          } else if (this.options.greedy) {
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode("while(buffer.length > offset++);");
            ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(${start}, offset), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, offset));`);
          }
          if (this.options.stripNull) {
            ctx.pushCode(`${name} = ${name}.replace(/\\x00+$/g, '')`);
          }
        }
        generateBuffer(ctx) {
          const varName = ctx.generateVariable(this.varName);
          if (typeof this.options.readUntil === "function") {
            const pred = this.options.readUntil;
            const start = ctx.generateTmpVariable();
            const cur = ctx.generateTmpVariable();
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode(`var ${cur} = 0;`);
            ctx.pushCode(`while (offset < buffer.length) {`);
            ctx.pushCode(`${cur} = dataView.getUint8(offset);`);
            const func = ctx.addImport(pred);
            ctx.pushCode(`if (${func}.call(${ctx.generateVariable()}, ${cur}, buffer.subarray(offset))) break;`);
            ctx.pushCode(`offset += 1;`);
            ctx.pushCode(`}`);
            ctx.pushCode(`${varName} = buffer.subarray(${start}, offset);`);
          } else if (this.options.readUntil === "eof") {
            ctx.pushCode(`${varName} = buffer.subarray(offset);`);
          } else {
            const len = ctx.generateOption(this.options.length);
            ctx.pushCode(`${varName} = buffer.subarray(offset, offset + ${len});`);
            ctx.pushCode(`offset += ${len};`);
          }
          if (this.options.clone) {
            ctx.pushCode(`${varName} = buffer.constructor.from(${varName});`);
          }
        }
        generateArray(ctx) {
          const length = ctx.generateOption(this.options.length);
          const lengthInBytes = ctx.generateOption(this.options.lengthInBytes);
          const type = this.options.type;
          const counter = ctx.generateTmpVariable();
          const lhs = ctx.generateVariable(this.varName);
          const item = ctx.generateTmpVariable();
          const key = this.options.key;
          const isHash = typeof key === "string";
          if (isHash) {
            ctx.pushCode(`${lhs} = {};`);
          } else {
            ctx.pushCode(`${lhs} = [];`);
          }
          if (typeof this.options.readUntil === "function") {
            ctx.pushCode("do {");
          } else if (this.options.readUntil === "eof") {
            ctx.pushCode(`for (var ${counter} = 0; offset < buffer.length; ${counter}++) {`);
          } else if (lengthInBytes !== void 0) {
            ctx.pushCode(`for (var ${counter} = offset + ${lengthInBytes}; offset < ${counter}; ) {`);
          } else {
            ctx.pushCode(`for (var ${counter} = ${length}; ${counter} > 0; ${counter}--) {`);
          }
          if (typeof type === "string") {
            if (!aliasRegistry.get(type)) {
              const typeName = PRIMITIVE_NAMES[type];
              const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
              ctx.pushCode(`var ${item} = dataView.get${typeName}(offset, ${littleEndian});`);
              ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
            } else {
              const tempVar = ctx.generateTmpVariable();
              ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + type}(offset, {`);
              if (ctx.useContextVariables) {
                const parentVar = ctx.generateVariable();
                ctx.pushCode(`$parent: ${parentVar},`);
                ctx.pushCode(`$root: ${parentVar}.$root,`);
                if (!this.options.readUntil && lengthInBytes === void 0) {
                  ctx.pushCode(`$index: ${length} - ${counter},`);
                }
              }
              ctx.pushCode(`});`);
              ctx.pushCode(`var ${item} = ${tempVar}.result; offset = ${tempVar}.offset;`);
              if (type !== this.alias)
                ctx.addReference(type);
            }
          } else if (type instanceof _Parser) {
            ctx.pushCode(`var ${item} = {};`);
            const parentVar = ctx.generateVariable();
            ctx.pushScope(item);
            if (ctx.useContextVariables) {
              ctx.pushCode(`${item}.$parent = ${parentVar};`);
              ctx.pushCode(`${item}.$root = ${parentVar}.$root;`);
              if (!this.options.readUntil && lengthInBytes === void 0) {
                ctx.pushCode(`${item}.$index = ${length} - ${counter};`);
              }
            }
            type.generate(ctx);
            if (ctx.useContextVariables) {
              ctx.pushCode(`delete ${item}.$parent;`);
              ctx.pushCode(`delete ${item}.$root;`);
              ctx.pushCode(`delete ${item}.$index;`);
            }
            ctx.popScope();
          }
          if (isHash) {
            ctx.pushCode(`${lhs}[${item}.${key}] = ${item};`);
          } else {
            ctx.pushCode(`${lhs}.push(${item});`);
          }
          ctx.pushCode("}");
          if (typeof this.options.readUntil === "function") {
            const pred = this.options.readUntil;
            const func = ctx.addImport(pred);
            ctx.pushCode(`while (!${func}.call(${ctx.generateVariable()}, ${item}, buffer.subarray(offset)));`);
          }
        }
        generateChoiceCase(ctx, varName, type) {
          if (typeof type === "string") {
            const varName2 = ctx.generateVariable(this.varName);
            if (!aliasRegistry.has(type)) {
              const typeName = PRIMITIVE_NAMES[type];
              const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
              ctx.pushCode(`${varName2} = dataView.get${typeName}(offset, ${littleEndian});`);
              ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]}`);
            } else {
              const tempVar = ctx.generateTmpVariable();
              ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + type}(offset, {`);
              if (ctx.useContextVariables) {
                ctx.pushCode(`$parent: ${varName2}.$parent,`);
                ctx.pushCode(`$root: ${varName2}.$root,`);
              }
              ctx.pushCode(`});`);
              ctx.pushCode(`${varName2} = ${tempVar}.result; offset = ${tempVar}.offset;`);
              if (type !== this.alias)
                ctx.addReference(type);
            }
          } else if (type instanceof _Parser) {
            ctx.pushPath(varName);
            type.generate(ctx);
            ctx.popPath(varName);
          }
        }
        generateChoice(ctx) {
          const tag = ctx.generateOption(this.options.tag);
          const nestVar = ctx.generateVariable(this.varName);
          if (this.varName) {
            ctx.pushCode(`${nestVar} = {};`);
            if (ctx.useContextVariables) {
              const parentVar = ctx.generateVariable();
              ctx.pushCode(`${nestVar}.$parent = ${parentVar};`);
              ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
            }
          }
          ctx.pushCode(`switch(${tag}) {`);
          for (const tagString in this.options.choices) {
            const tag2 = parseInt(tagString, 10);
            const type = this.options.choices[tag2];
            ctx.pushCode(`case ${tag2}:`);
            this.generateChoiceCase(ctx, this.varName, type);
            ctx.pushCode("break;");
          }
          ctx.pushCode("default:");
          if (this.options.defaultChoice) {
            this.generateChoiceCase(ctx, this.varName, this.options.defaultChoice);
          } else {
            ctx.generateError(`"Met undefined tag value " + ${tag} + " at choice"`);
          }
          ctx.pushCode("}");
          if (this.varName && ctx.useContextVariables) {
            ctx.pushCode(`delete ${nestVar}.$parent;`);
            ctx.pushCode(`delete ${nestVar}.$root;`);
          }
        }
        generateNest(ctx) {
          const nestVar = ctx.generateVariable(this.varName);
          if (this.options.type instanceof _Parser) {
            if (this.varName) {
              ctx.pushCode(`${nestVar} = {};`);
              if (ctx.useContextVariables) {
                const parentVar = ctx.generateVariable();
                ctx.pushCode(`${nestVar}.$parent = ${parentVar};`);
                ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
              }
            }
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
            if (this.varName && ctx.useContextVariables) {
              if (ctx.useContextVariables) {
                ctx.pushCode(`delete ${nestVar}.$parent;`);
                ctx.pushCode(`delete ${nestVar}.$root;`);
              }
            }
          } else if (aliasRegistry.has(this.options.type)) {
            const tempVar = ctx.generateTmpVariable();
            ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + this.options.type}(offset, {`);
            if (ctx.useContextVariables) {
              const parentVar = ctx.generateVariable();
              ctx.pushCode(`$parent: ${parentVar},`);
              ctx.pushCode(`$root: ${parentVar}.$root,`);
            }
            ctx.pushCode(`});`);
            ctx.pushCode(`${nestVar} = ${tempVar}.result; offset = ${tempVar}.offset;`);
            if (this.options.type !== this.alias) {
              ctx.addReference(this.options.type);
            }
          }
        }
        generateWrapper(ctx) {
          const wrapperVar = ctx.generateVariable(this.varName);
          const wrappedBuf = ctx.generateTmpVariable();
          if (typeof this.options.readUntil === "function") {
            const pred = this.options.readUntil;
            const start = ctx.generateTmpVariable();
            const cur = ctx.generateTmpVariable();
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode(`var ${cur} = 0;`);
            ctx.pushCode(`while (offset < buffer.length) {`);
            ctx.pushCode(`${cur} = dataView.getUint8(offset);`);
            const func2 = ctx.addImport(pred);
            ctx.pushCode(`if (${func2}.call(${ctx.generateVariable()}, ${cur}, buffer.subarray(offset))) break;`);
            ctx.pushCode(`offset += 1;`);
            ctx.pushCode(`}`);
            ctx.pushCode(`${wrappedBuf} = buffer.subarray(${start}, offset);`);
          } else if (this.options.readUntil === "eof") {
            ctx.pushCode(`${wrappedBuf} = buffer.subarray(offset);`);
          } else {
            const len = ctx.generateOption(this.options.length);
            ctx.pushCode(`${wrappedBuf} = buffer.subarray(offset, offset + ${len});`);
            ctx.pushCode(`offset += ${len};`);
          }
          if (this.options.clone) {
            ctx.pushCode(`${wrappedBuf} = buffer.constructor.from(${wrappedBuf});`);
          }
          const tempBuf = ctx.generateTmpVariable();
          const tempOff = ctx.generateTmpVariable();
          const tempView = ctx.generateTmpVariable();
          const func = ctx.addImport(this.options.wrapper);
          ctx.pushCode(`${wrappedBuf} = ${func}.call(this, ${wrappedBuf}).subarray(0);`);
          ctx.pushCode(`var ${tempBuf} = buffer;`);
          ctx.pushCode(`var ${tempOff} = offset;`);
          ctx.pushCode(`var ${tempView} = dataView;`);
          ctx.pushCode(`buffer = ${wrappedBuf};`);
          ctx.pushCode(`offset = 0;`);
          ctx.pushCode(`dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);`);
          if (this.options.type instanceof _Parser) {
            if (this.varName) {
              ctx.pushCode(`${wrapperVar} = {};`);
            }
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
          } else if (aliasRegistry.has(this.options.type)) {
            const tempVar = ctx.generateTmpVariable();
            ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + this.options.type}(0);`);
            ctx.pushCode(`${wrapperVar} = ${tempVar}.result;`);
            if (this.options.type !== this.alias) {
              ctx.addReference(this.options.type);
            }
          }
          ctx.pushCode(`buffer = ${tempBuf};`);
          ctx.pushCode(`dataView = ${tempView};`);
          ctx.pushCode(`offset = ${tempOff};`);
        }
        generateFormatter(ctx, varName, formatter) {
          if (typeof formatter === "function") {
            const func = ctx.addImport(formatter);
            ctx.pushCode(`${varName} = ${func}.call(${ctx.generateVariable()}, ${varName});`);
          }
        }
        generatePointer(ctx) {
          const type = this.options.type;
          const offset = ctx.generateOption(this.options.offset);
          const tempVar = ctx.generateTmpVariable();
          const nestVar = ctx.generateVariable(this.varName);
          ctx.pushCode(`var ${tempVar} = offset;`);
          ctx.pushCode(`offset = ${offset};`);
          if (this.options.type instanceof _Parser) {
            ctx.pushCode(`${nestVar} = {};`);
            if (ctx.useContextVariables) {
              const parentVar = ctx.generateVariable();
              ctx.pushCode(`${nestVar}.$parent = ${parentVar};`);
              ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
            }
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
            if (ctx.useContextVariables) {
              ctx.pushCode(`delete ${nestVar}.$parent;`);
              ctx.pushCode(`delete ${nestVar}.$root;`);
            }
          } else if (aliasRegistry.has(this.options.type)) {
            const tempVar2 = ctx.generateTmpVariable();
            ctx.pushCode(`var ${tempVar2} = ${FUNCTION_PREFIX + this.options.type}(offset, {`);
            if (ctx.useContextVariables) {
              const parentVar = ctx.generateVariable();
              ctx.pushCode(`$parent: ${parentVar},`);
              ctx.pushCode(`$root: ${parentVar}.$root,`);
            }
            ctx.pushCode(`});`);
            ctx.pushCode(`${nestVar} = ${tempVar2}.result; offset = ${tempVar2}.offset;`);
            if (this.options.type !== this.alias) {
              ctx.addReference(this.options.type);
            }
          } else if (Object.keys(PRIMITIVE_SIZES).indexOf(this.options.type) >= 0) {
            const typeName = PRIMITIVE_NAMES[type];
            const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
            ctx.pushCode(`${nestVar} = dataView.get${typeName}(offset, ${littleEndian});`);
            ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
          }
          ctx.pushCode(`offset = ${tempVar};`);
        }
        generateSaveOffset(ctx) {
          const varName = ctx.generateVariable(this.varName);
          ctx.pushCode(`${varName} = offset`);
        }
      };
      exports.Parser = Parser;
    }
  });

  // node_modules/gopro-telemetry/code/data/keys.js
  var require_keys = __commonJS({
    "node_modules/gopro-telemetry/code/data/keys.js"(exports, module) {
      var Parser = require_binary_parser().Parser;
      var keyAndStructParser = new Parser().endianess("big").string("fourCC", { length: 4, encoding: "ascii" }).string("type", { length: 1, encoding: "ascii" }).uint8("size").uint16("repeat");
      var types = {
        c: { func: "string", opt: { encoding: "ascii", stripNull: true } },
        U: { func: "string", opt: { encoding: "ascii", stripNull: true } },
        F: { func: "string", opt: { length: 4, encoding: "ascii" } },
        b: { size: 1, func: "int8" },
        B: { size: 1, func: "uint8" },
        l: { size: 4, func: "int32" },
        L: { size: 4, func: "uint32" },
        q: { size: 4, func: "uint32" },
        //Never tested
        Q: { size: 8, func: "uint64" },
        //Never tested
        d: { size: 8, func: "doublebe" },
        j: { size: 8, func: "int64" },
        J: { size: 8, func: "uint64", forceNum: true },
        f: { size: 4, func: "floatbe" },
        s: { size: 2, func: "int16" },
        S: { size: 2, func: "uint16" },
        "": { size: 1, func: "bit1" },
        "?": { complex: true },
        "\0": { nested: true }
      };
      var translations = {
        SIUN: "units",
        UNIT: "units",
        STNM: "name",
        RMRK: "comment",
        DVNM: "device name"
      };
      var ignore = ["EMPT", "TSMP", "TICK", "TOCK"];
      var stickyTranslations = {
        TMPC: "temperature [\xB0C]",
        GPSF: "fix",
        GPSP: "precision",
        GPSA: "altitude system",
        STMP: "timestamps [\xB5s]"
      };
      var forcedStruct = {
        FACE: [
          "ID,x,y,w,h",
          // HERO6
          "ID,x,y,w,h,null,null,unknown,null,null,null,null,null,null,null,null,null,null,null,null,null,null,smile",
          // HERO7
          "ID,x,y,w,h,confidence %,smile %",
          // HERO8
          "ver,confidence %,ID,x,y,w,h,smile %, blink %"
          // HERO10
        ]
      };
      var mgjsonMaxArrs = {
        FACE: 2
      };
      function generateStructArr(key, partial) {
        const example = partial.find((arr) => Array.isArray(arr) && arr.length);
        if (!example) return;
        const length = example.length;
        const strings = forcedStruct[key];
        if (!strings) return;
        const str = strings.find((str2) => str2.split(",").length === length);
        if (!str) return null;
        let resultingArr = [];
        str.split(",").forEach((w) => {
          resultingArr.push(w);
        });
        resultingArr = resultingArr.map((v) => v === "null" ? null : v);
        return resultingArr;
      }
      function idKeysTranslation(key) {
        return key.replace(/_?FOUR_?CC/i, "");
      }
      function idValuesTranslation(val, key) {
        const pairs = {
          CLASSIFIER: {
            SNOW: "snow",
            URBA: "urban",
            INDO: "indoor",
            WATR: "water",
            VEGE: "vegetation",
            BEAC: "beach"
          }
        };
        if (pairs[key]) return pairs[key][val] || val;
        return val;
      }
      var names = {
        ACCL: "3-axis accelerometer",
        GYRO: "3-axis gyroscope",
        ISOG: "Image sensor gain",
        SHUT: "Exposure time",
        GPS5: "Latitude, longitude, altitude (WGS 84), 2D ground speed, and 3D speed",
        GPS9: "Lat., Long., Alt., 2D, 3D, days, secs, DOP, fix",
        GPSU: "UTC time and data from GPS",
        GPSF: "GPS Fix",
        GPSP: "GPS Precision - Dilution of Precision (DOP x100)",
        STMP: "Microsecond timestamps",
        FACE: "Face detection boundaring boxes",
        FCNM: "Faces counted per frame",
        ISOE: "Sensor ISO",
        ALLD: "Auto Low Light frame Duration",
        WBAL: "White Balance in Kelvin",
        WRGB: "White Balance RGB gains",
        YAVG: "Luma (Y) Average over the frame",
        HUES: "Predominant hues over the frame",
        UNIF: "Image uniformity",
        SCEN: "Scene classifier in probabilities",
        SROT: "Sensor Read Out Time",
        CORI: "Camera ORIentation",
        IORI: "Image ORIentation",
        GRAV: "GRAvity Vector",
        WNDM: "Wind Processing",
        MWET: "Microphone is WET",
        AALP: "Audio Levels",
        DISP: "Disparity track (360 modes)",
        MAGN: "MAGNnetometer",
        MSKP: "Main video frame SKiP",
        LSKP: "Low res video frame SKiP",
        LOGS: "health logs",
        VERS: "version of the metadata library that created the camera data",
        FMWR: "Firmware version",
        LINF: "Internal IDs",
        CINF: "Internal IDs",
        CASN: "Camera Serial Number",
        MINF: "Camera model",
        MUID: "Media ID",
        CPID: "Capture Identifier",
        CPIN: "Capture number in group",
        CMOD: "Camera Mode",
        MTYP: "Media type",
        HDRV: "HDR Video",
        OREN: "Orientation",
        DZOM: "Digital Zoom enable",
        DZST: "Digital Zoom Setting",
        SMTR: "Spot Meter",
        PRTN: "Protune Enabled",
        PTWB: "Protune White balance",
        PTSH: "Protune Sharpness",
        PTCL: "Protune Color",
        EXPT: "Exposure Type",
        PIMX: "Protune ISO Max",
        PIMN: "Protune ISO Min",
        PTEV: "Protune EV",
        RATE: "Burst Rate, TimeWarp Rate, Timelapse Rate",
        EISE: "Electric Stabilization",
        EISA: "EIS Applied",
        HCTL: "In camera Horizon control",
        AUPT: "Audio Protune",
        APTO: "Audio Protune Option",
        AUDO: "Audio Option",
        AUBT: "Audio BlueTooth",
        PRJT: "Lens Projection",
        CDAT: "Creation Date/Time",
        SCTM: "Schedule Capture Time",
        PRNA: "Preset IDs",
        PRNU: "Preset IDs",
        SCAP: "Schedule Capture",
        CDTM: "Capture Delay Timer (in ms)",
        DUST: "Duration Settings",
        VRES: "Video Resolution",
        VFPS: "Video Framerate ratio",
        HSGT: "Hindsight Settings",
        BITR: "Bitrate",
        MMOD: "Media Mod",
        RAMP: "Speed Ramp Settings",
        TZON: "Time Zone offset in minutes",
        DZMX: "Digital Zoom amount",
        CTRL: "Control Level",
        PWPR: "Power Profile",
        ORDP: "Orientation Data Present",
        CLDP: "Classification Data Present",
        PIMD: "Protune ISO Mode",
        ABSC: "AutoBoost SCore - Used for Autoboost variable prescription modes",
        ZFOV: "Diagon Field Of View in degrees (from corner to corner)",
        VFOV: "Visual FOV style",
        PYCF: "Polynomial power",
        POLY: "Polynomial values",
        ZMPL: "Zoom scale normalization",
        ARUW: "Aspect Ratio of the UnWarped input image",
        ARWA: "Aspect Ratio of the WArped output image",
        MXCF: "Mapping X CoeFficients, Superview/HyperView",
        MAPX: "new_x = ax + bx^3 + cx^5",
        MYCF: "Mapping Y CoeFficients, Superview/HyperView",
        MAPY: "new_y = ay + by^3 + cy^5 + dyx^2 + ey^3x^2 + fyx^4"
      };
      var knownMulti = {
        FACE: true,
        HUES: true,
        SCEN: true
      };
      var computedStreams = ["dateStream"];
      var mp4ValidSamples = ["HLMT"];
      module.exports = {
        keyAndStructParser,
        types,
        translations,
        ignore,
        stickyTranslations,
        generateStructArr,
        mgjsonMaxArrs,
        idKeysTranslation,
        idValuesTranslation,
        names,
        knownMulti,
        computedStreams,
        mp4ValidSamples
      };
    }
  });

  // node_modules/gopro-telemetry/code/utils/breathe.js
  var require_breathe = __commonJS({
    "node_modules/gopro-telemetry/code/utils/breathe.js"(exports, module) {
      var awaiter = typeof setImmediate === "undefined" ? setTimeout : setImmediate;
      module.exports = function() {
        return new Promise((resolve) => awaiter(resolve));
      };
    }
  });

  // node_modules/gopro-telemetry/code/parseV.js
  var require_parseV = __commonJS({
    "node_modules/gopro-telemetry/code/parseV.js"(exports, module) {
      var Parser = require_binary_parser().Parser;
      var { types } = require_keys();
      var breathe = require_breathe();
      var unknown = /* @__PURE__ */ new Set();
      var valueParsers = {};
      function getValueParserForType(type, opts) {
        const key = `${type}-${JSON.stringify(opts)}`;
        if (!valueParsers.hasOwnProperty(key)) {
          valueParsers[key] = new Parser().endianess("big");
          if (!valueParsers[key][types[type].func]) {
            throw new Error(`Unknown type "${type}" (func "${types[type].func}")`);
          }
          valueParsers[key] = valueParsers[key][types[type].func]("value", opts);
        }
        return valueParsers[key];
      }
      function parseV(environment, slice, len, specifics) {
        const { data, options, ks } = environment;
        const { ax = 1, type = ks.type, complexType } = specifics;
        if (ax > 1) {
          let res = [];
          let sliceProgress = 0;
          for (let i2 = 0; i2 < ax; i2++) {
            let innerType = type;
            if (types[type].complex) innerType = complexType[i2];
            if (!types[innerType]) {
              unknown.add(type);
              res.push(null);
            } else {
              const from = slice + sliceProgress;
              const axLen = types[innerType].size || (types[innerType].opt || {}).length || len / ax;
              sliceProgress += axLen;
              res.push(
                parseV(environment, from, axLen, {
                  ax: 1,
                  type: innerType,
                  complexType
                })
              );
            }
          }
          if (options.debug && unknown.size)
            breathe().then(
              () => console.warn("unknown types:", [...unknown].join(","))
            );
          return res;
        } else if (!types[type].complex) {
          let opts = { length: len };
          if (types[type].opt) {
            Object.assign(opts, types[type].opt);
          }
          let valParser = getValueParserForType(type, opts);
          const parsed = valParser.parse(data.subarray(slice));
          if (types[type].forceNum) parsed.value = Number(parsed.value);
          return parsed.value;
        } else throw new Error("Complex type ? with only one axis");
      }
      module.exports = parseV;
    }
  });

  // node_modules/gopro-telemetry/code/utils/unArrayTypes.js
  var require_unArrayTypes = __commonJS({
    "node_modules/gopro-telemetry/code/utils/unArrayTypes.js"(exports, module) {
      function replacer(whole, match0, match1) {
        let replacement = "";
        for (let i2 = 0; i2 < match1; i2++) replacement += match0;
        return replacement;
      }
      module.exports = function(str) {
        if (/(\w)\[(\d+)\]/g.test(str)) str = str.replace(/(\w)\[(\d+)\]/g, replacer);
        return str;
      };
    }
  });

  // node_modules/gopro-telemetry/code/parseKLV.js
  var require_parseKLV = __commonJS({
    "node_modules/gopro-telemetry/code/parseKLV.js"(exports, module) {
      var {
        keyAndStructParser,
        types,
        generateStructArr,
        mp4ValidSamples
      } = require_keys();
      var parseV = require_parseV();
      var unArrayTypes = require_unArrayTypes();
      var breathe = require_breathe();
      function extendIfNeeded(data, ks, start) {
        let extend = 0;
        if (ks && ks.fourCC === "DEVC") {
          while (data[start + extend] === 0 && data[start + extend + 1] === 0 && data[start + extend + 2] === 0 && data[start + extend + 3] === 0) {
            extend += 4;
          }
        }
        return extend;
      }
      function findLastCC(data, start, end) {
        let ks;
        while (start < end) {
          let length = 0;
          try {
            const tempKs = keyAndStructParser.parse(data.subarray(start));
            if (tempKs.fourCC !== "\0\0\0\0") ks = tempKs;
            length = ks.size * ks.repeat;
          } catch (error) {
            breathe().then(() => console.error(error));
          }
          const reached = start + 8 + (length >= 0 ? length : 0);
          while (start < reached) start += 4;
          start += extendIfNeeded(data, ks, start);
        }
        if (ks) return ks.fourCC;
      }
      async function parseKLV(data, options = {}, { start = 0, end = data.length, parent, unArrayLast = true, gpsTimeSrc }) {
        let result = {};
        let unknown = /* @__PURE__ */ new Set();
        let complexType = [];
        let lastCC = findLastCC(data, start, end);
        if (mp4ValidSamples.includes(lastCC)) unArrayLast = true;
        result.interpretSamples = lastCC;
        if (parent === "STRM" && options.stream && !options.stream.includes(lastCC) && (lastCC !== gpsTimeSrc || options.timeIn === "MP4" && !options.raw || options.streamList || options.deviceList)) {
          return void 0;
        }
        while (start < end) {
          let length = 0;
          let ks;
          try {
            if (start % 2e4 === 0) await breathe();
            try {
              ks = keyAndStructParser.parse(data.subarray(start));
              length = ks.size * ks.repeat;
            } catch (error) {
            }
            const done = !ks || ks.fourCC === "\0\0\0\0" || options.deviceList && ks.fourCC === "STRM" || options.streamList && ks.fourCC === lastCC && parent === "STRM";
            if (!done) {
              let partialResult = [];
              let unArrayLastChild = true;
              if (ks.fourCC === "STRM" && options.mp4header) {
                unArrayLastChild = false;
              }
              if (length < 0) {
                console.warn(
                  "Invalid length found. Proceeding but could have errors"
                );
              }
              if (length <= 0) partialResult.push(void 0);
              else if (!types[ks.type]) unknown.add(ks.type);
              else if (types[ks.type].nested) {
                if (data.length >= start + 8 + length) {
                  const parsed = await parseKLV(data, options, {
                    start: start + 8,
                    end: start + 8 + length,
                    parent: ks.fourCC,
                    unArrayLast: unArrayLastChild,
                    gpsTimeSrc
                  });
                  if (parsed != null) partialResult.push(parsed);
                } else partialResult.push(void 0);
              } else if (types[ks.type].func || types[ks.type].complex && complexType) {
                let axes = 1;
                if (types[ks.type].size > 1) axes = ks.size / types[ks.type].size;
                else if (types[ks.type].complex && complexType.length)
                  axes = complexType.length;
                if (types[ks.type].func === "string" && ks.size === 1 && ks.repeat > 1) {
                  ks.size = length;
                  ks.repeat = 1;
                }
                const environment = { data, options, ks };
                const specifics = { ax: axes, complexType };
                if (ks.repeat > 1) {
                  for (let i2 = 0; i2 < ks.repeat; i2++)
                    partialResult.push(
                      parseV(environment, start + 8 + i2 * ks.size, ks.size, specifics)
                    );
                } else
                  partialResult.push(
                    parseV(environment, start + 8, length, specifics)
                  );
                if (ks.fourCC === "TYPE")
                  complexType = unArrayTypes(partialResult[0]);
                else if (ks.fourCC === "DVID" && parent === "DEVC" && options.device && !options.device.includes(partialResult[0]))
                  return void 0;
              } else unknown.add(ks.type);
              if (ks.fourCC === lastCC && generateStructArr(ks.fourCC, partialResult)) {
                let extraDescription = generateStructArr(
                  ks.fourCC,
                  partialResult
                ).filter((v) => v != null);
                let newValueArr = [];
                partialResult.forEach((p, i2) => {
                  let descCandidate = [];
                  let newP = [];
                  generateStructArr(ks.fourCC, partialResult).forEach((e, ii) => {
                    if (Array.isArray(p) && e != null) {
                      descCandidate.push(e);
                      newP.push(p[ii]);
                    } else if (ii === 0 && e != null) descCandidate.push(e);
                  });
                  if (newP.length) partialResult[i2] = newP;
                  if (descCandidate.length > extraDescription.length)
                    extraDescription = descCandidate;
                });
                if (newValueArr.length) partialResult[0] = newValueArr;
                if (extraDescription.length) {
                  const extraDescString = extraDescription.join(",");
                  if (!/\(.+\)$/.test(result.STNM)) {
                    result.STNM = `${result.STNM || ""} (${extraDescString})`;
                  } else if (result.STNM.match(/\((.+)\)$/)[1].length < extraDescString.length) {
                    result.STNM.replace(/\(.+\)$/, `(${extraDescString})`);
                  }
                }
              }
              if (result.hasOwnProperty(ks.fourCC)) {
                if (parent === "STRM") {
                  if (!result.multi) result[ks.fourCC] = [result[ks.fourCC]];
                  result[ks.fourCC].push(partialResult);
                  result.multi = true;
                } else result[ks.fourCC] = result[ks.fourCC].concat(partialResult);
              } else result[ks.fourCC] = partialResult;
            }
          } catch (err) {
            if (options.tolerant) {
              await breathe();
              console.error(err);
            } else {
              throw err;
            }
          }
          const reached = start + 8 + (length >= 0 ? length : 0);
          while (start < reached) start += 4;
          start += extendIfNeeded(data, ks, start);
        }
        for (const key in result) {
          if ((!unArrayLast || key !== lastCC) && result[key] && result[key].length === 1) {
            result[key] = result[key][0];
          }
        }
        if (options.debug && unknown.size) {
          await breathe();
          console.warn("unknown types:", [...unknown].map((el) => `"${el}"`).join(","));
        }
        return result;
      }
      module.exports = parseKLV;
    }
  });

  // node_modules/gopro-telemetry/code/groupDevices.js
  var require_groupDevices = __commonJS({
    "node_modules/gopro-telemetry/code/groupDevices.js"(exports, module) {
      var { ignore } = require_keys();
      var breathe = require_breathe();
      async function groupDevices(klv) {
        const result = {};
        for (const d of klv.DEVC || []) {
          if (d != null) {
            await breathe();
            ignore.forEach((i2) => {
              if (d.hasOwnProperty(i2)) delete d[i2];
            });
            if (result[d.DVID]) result[d.DVID].DEVC.push(d);
            else result[d.DVID] = { DEVC: [d], interpretSamples: "DEVC" };
          }
        }
        return result;
      }
      module.exports = groupDevices;
    }
  });

  // node_modules/gopro-telemetry/code/deviceList.js
  var require_deviceList = __commonJS({
    "node_modules/gopro-telemetry/code/deviceList.js"(exports, module) {
      function deviceList(klv) {
        const result = {};
        (klv.DEVC || []).filter((d) => d != null).forEach((d) => {
          result[d.DVID] = d.DVNM;
        });
        return result;
      }
      module.exports = deviceList;
    }
  });

  // node_modules/gopro-telemetry/code/utils/hero7Labelling.js
  var require_hero7Labelling = __commonJS({
    "node_modules/gopro-telemetry/code/utils/hero7Labelling.js"(exports, module) {
      var { idKeysTranslation } = require_keys();
      module.exports = function(str, multi) {
        const newStyle = /\[\[([\w,\s]+)\][,\s\.]*\]/;
        if (str && newStyle.test(str)) {
          const inner = str.match(newStyle)[1].split(",").map((s, i2) => {
            if (i2 === 0 && multi) s = idKeysTranslation(s);
            return s.trim();
          }).join(",");
          return str.replace(newStyle, ` (${inner})`);
        }
        return str;
      };
    }
  });

  // node_modules/gopro-telemetry/code/streamList.js
  var require_streamList = __commonJS({
    "node_modules/gopro-telemetry/code/streamList.js"(exports, module) {
      var { translations, names, knownMulti } = require_keys();
      var hero7Labelling = require_hero7Labelling();
      function deviceList(klv) {
        const result = {};
        (klv.DEVC || []).filter((d) => d != null).forEach((d) => {
          if (!result[d.DVID]) result[d.DVID] = {};
          result[d.DVID][translations.DVNM] = d.DVNM;
          result[d.DVID].streams = result[d.DVID].streams || {};
          (d.STRM || []).forEach((s) => {
            if (s.interpretSamples && s.interpretSamples !== "STNM") {
              result[d.DVID].streams[s.interpretSamples] = s.STNM || s.RMRK || names[s.interpretSamples] || s.interpretSamples;
              result[d.DVID].streams[s.interpretSamples] = hero7Labelling(
                result[d.DVID].streams[s.interpretSamples],
                knownMulti[s.interpretSamples]
              );
            }
          });
        });
        return result;
      }
      module.exports = deviceList;
    }
  });

  // node_modules/gopro-telemetry/code/timeKLV.js
  var require_timeKLV = __commonJS({
    "node_modules/gopro-telemetry/code/timeKLV.js"(exports, module) {
      var breathe = require_breathe();
      function GPSUtoDate(GPSU) {
        let regex = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{3})/;
        let YEAR = 1, MONTH = 2, DAY = 3, HOUR = 4, MIN = 5, SEC = 6, MIL = 7;
        let parts = GPSU.match(regex);
        if (parts) {
          const date = new Date(
            Date.UTC(
              "20" + parts[YEAR],
              parts[MONTH] - 1,
              parts[DAY],
              parts[HOUR],
              parts[MIN],
              parts[SEC],
              parts[MIL]
            )
          );
          return date.getTime();
        }
        return null;
      }
      function GPS9toDate(GPS9) {
        if (GPS9 && GPS9.length > 6) {
          const days = GPS9[5];
          const seconds = GPS9[6];
          const fullSeconds = Math.floor(seconds);
          const milliseconds = (seconds - fullSeconds) * 1e3;
          let date = /* @__PURE__ */ new Date("2000");
          date.setUTCDate(date.getUTCDate() + days);
          date.setUTCSeconds(date.getUTCSeconds() + fullSeconds);
          date.setUTCMilliseconds(date.getUTCMilliseconds() + milliseconds);
          return date.getTime();
        }
        return null;
      }
      async function fillGPSTime(klv, options, timeMeta, gpsTimeSrc) {
        let { gpsDate } = timeMeta;
        let res = [];
        if (options.timeIn === "MP4" || options.mp4header) return res;
        let missingDates = [];
        klv.DEVC.forEach((d, i2) => {
          let partialRes;
          let date;
          if (d != null && d.STRM && d.STRM.length) {
            for (const key in d.STRM) {
              if (d.STRM[key][gpsTimeSrc] != null) {
                if (gpsTimeSrc === "GPS5") date = GPSUtoDate(d.STRM[key].GPSU);
                else if (gpsTimeSrc === "GPS9") {
                  date = GPS9toDate(d.STRM[key].GPS9[0]);
                }
                delete d.STRM[key].GPSU;
                const doneWithGPSTime = options.stream && !options.stream.includes(gpsTimeSrc) && (!options.dateStream || gpsTimeSrc === "GPS5");
                if (doneWithGPSTime || d.STRM[key].toDelete === "all") {
                  delete d.STRM[key];
                } else if (Array.isArray(d.STRM[key].toDelete)) {
                  d.STRM[key][gpsTimeSrc] = d.STRM[key][gpsTimeSrc].filter(
                    (_, i3) => d.STRM[key].toDelete[i3]
                  );
                  delete d.STRM[key].toDelete;
                }
                break;
              }
            }
          }
          if (date != null) {
            if (gpsDate == null) {
              gpsDate = date;
              timeMeta.gpsDate = gpsDate;
            }
            partialRes = { date };
            if (res.length && res[res.length - 1] && res[res.length - 1].date) {
              res[res.length - 1].duration = partialRes.date - res[res.length - 1].date;
            }
          }
          if (partialRes) {
            partialRes.cts = partialRes.date - gpsDate;
            res.push(partialRes);
          } else {
            res.push(null);
            missingDates.push(i2);
          }
        });
        let missingDurations = [];
        missingDates.forEach((i2) => {
          if (res[i2] === null && res[i2 - 1] && res[i2 - 1].date) {
            let foundNext = false;
            for (let x = 1; i2 + x < res.length; x++) {
              if (res[i2 + x] && res[i2 + x].date) {
                res[i2 - 1].duration = (res[i2 + x].date - res[i2 - 1].date) / x;
                const index = missingDurations.indexOf(i2 - 1);
                if (index !== -1) missingDurations.splice(index, 1);
                foundNext = true;
                break;
              }
            }
            if (!foundNext) {
              let lastDuration = 1e3;
              for (let j = i2 - 2; j >= 0; j--) {
                if (res[j] && res[j].duration) {
                  lastDuration = res[j].duration;
                  break;
                }
              }
              res[i2 - 1].duration = lastDuration;
            }
            if (res[i2 - 1].duration != null) {
              res[i2] = { date: res[i2 - 1].date + res[i2 - 1].duration };
              res[i2].cts = res[i2].date - gpsDate;
              missingDurations.push(i2);
            }
          }
        });
        let lastMissing = -1;
        while (res[lastMissing + 1] == null && lastMissing < res.length)
          lastMissing++;
        if (lastMissing >= 0 && res.length > lastMissing + 2) {
          const avgDuration = (res.slice(-1)[0].date - res[lastMissing + 1].date) / (res.length - (lastMissing + 1));
          while (lastMissing >= 0) {
            const nextGood = res[lastMissing + 1];
            res[lastMissing] = {
              date: nextGood.date - avgDuration,
              cts: nextGood.cts - avgDuration,
              duration: avgDuration
            };
            lastMissing--;
          }
        }
        if (res[0] && res[0].cts < 0)
          res = res.map((r) => ({ ...r, cts: r.cts - res[0].cts }));
        missingDurations.forEach((i2) => {
          if (res[i2 + 1] && res[i2 + 1].date)
            res[i2].duration = res[i2 + 1].date - res[i2].date;
        });
        if (res.length === 1 && res[0] != null && res[0].duration == null)
          res[0].duration = 1001;
        return res;
      }
      async function fillMP4Time(klv, timing, options, timeMeta) {
        let { offset, mp4Date } = timeMeta;
        if (!offset) offset = 0;
        let res = [];
        if (options.timeIn === "GPS" || options.mp4header) return res;
        if (!timing || !timing.samples || !timing.samples.length) {
          timing = {
            frameDuration: 0.03336666666666667,
            start: /* @__PURE__ */ new Date(),
            samples: [{ cts: 0, duration: 1001 }]
          };
        }
        if (typeof timing.start != "object") timing.start = new Date(timing.start);
        if (!mp4Date) {
          mp4Date = timing.start.getTime();
          timeMeta.mp4Date = mp4Date;
        }
        klv.DEVC.forEach((d, i2) => {
          let partialRes = {};
          if (timing.samples[i2] != null) {
            partialRes = JSON.parse(JSON.stringify(timing.samples[i2]));
            if (offset) partialRes.cts += offset;
          } else {
            partialRes.cts = res[i2 - 1].cts + (res[i2 - 1].duration || 0);
            if (i2 + 1 < klv.DEVC.length) {
              if (res[i2 - 1].duration) partialRes.duration = res[i2 - 1].duration;
              else if (i2 > 1 && res[i2 - 2].duration) {
                partialRes.duration = res[i2 - 2].duration;
              }
            }
          }
          partialRes.date = mp4Date + partialRes.cts;
          res.push(partialRes);
          if (d != null && d.STRM && d.STRM.length) {
            for (const key in d.STRM) {
              if (d.STRM[key].GPSU != null) {
                if (options.stream && !options.stream.includes("GPS5") || d.STRM[key].toDelete) {
                  delete d.STRM[key];
                } else delete d.STRM[key].GPSU;
                break;
              }
            }
          }
        });
        return res;
      }
      async function timeKLV(klv, { timing, opts = {}, timeMeta = {}, gpsTimeSrc }) {
        let { offset } = timeMeta;
        if (!offset) offset = 0;
        let result;
        try {
          result = JSON.parse(JSON.stringify(klv));
        } catch (error) {
          result = klv;
        }
        const includeTime = opts.timeOut !== "date" || opts.groupTimes;
        const includeDate = opts.timeOut !== "cts";
        try {
          if (result.DEVC && result.DEVC.length) {
            const gpsTimes = await fillGPSTime(result, opts, timeMeta, gpsTimeSrc);
            const mp4Times = await fillMP4Time(result, timing, opts, timeMeta);
            let sDuration = {};
            let dateSDur = {};
            for (let i2 = 0; i2 < result.DEVC.length; i2++) {
              await breathe();
              const d = result.DEVC[i2];
              const { cts, duration } = (() => {
                if (mp4Times.length && mp4Times[i2] != null) return mp4Times[i2];
                else if (gpsTimes.length && gpsTimes[i2] != null) return gpsTimes[i2];
                return { cts: null, duration: null };
              })();
              const { date, duration: dateDur } = (() => {
                if (gpsTimes.length && gpsTimes[i2] != null) return gpsTimes[i2];
                else if (mp4Times.length && mp4Times[i2] != null) return mp4Times[i2];
                return { date: null, duration: null };
              })();
              const dInitialDate = (() => {
                if (gpsTimes.length && timeMeta.gpsDate) return timeMeta.gpsDate;
                if (mp4Times.length && timeMeta.mp4Date) return timeMeta.mp4Date;
                return 0;
              })();
              const delayDateStream = gpsTimeSrc === "GPS9" && includeDate;
              const dummyStream = {
                STNM: "UTC date/time",
                interpretSamples: "dateStream",
                dateStream: delayDateStream ? [] : ["0"]
              };
              if (d.STRM && opts.dateStream && !delayDateStream) {
                d.STRM.push(dummyStream);
              }
              let skipSTMP = false;
              (d.STRM || []).forEach((s, ii) => {
                if (s.interpretSamples && s[s.interpretSamples] && s[s.interpretSamples].length) {
                  const fourCC = s.interpretSamples;
                  if (!opts.mp4header) {
                    let currCts;
                    let currDate;
                    if (ii === 0) {
                      if (opts.removeGaps) skipSTMP = true;
                      else if (!mp4Times.length) skipSTMP = true;
                      else if (s.STMP / 1e3 > mp4Times[i2].cts + 1e3 * 2) {
                        skipSTMP = true;
                      } else if (s.STMP / 1e3 < mp4Times[i2].cts - 1e3 * 2) {
                        skipSTMP = true;
                      }
                    }
                    let microCts = false;
                    let microDuration = false;
                    let microDate = false;
                    let microDateDuration = false;
                    if (s.STMP != null) {
                      if (!skipSTMP) {
                        currCts = s.STMP / 1e3;
                        if (opts.timeIn === "MP4") {
                          currDate = dInitialDate + currCts;
                          microDate = true;
                        }
                        microCts = true;
                        if (result.DEVC[i2 + 1]) {
                          (result.DEVC[i2 + 1].STRM || []).forEach((ss) => {
                            if (ss.interpretSamples === fourCC) {
                              if (ss.STMP) {
                                sDuration[fourCC] = (ss.STMP / 1e3 - currCts) / s[fourCC].length;
                                microDuration = true;
                                if (opts.timeIn === "MP4") {
                                  dateSDur[fourCC] = sDuration[fourCC];
                                  microDateDuration = true;
                                }
                              }
                            }
                          });
                        }
                      }
                      delete s.STMP;
                    }
                    if (!microDuration && duration != null) {
                      sDuration[fourCC] = duration / s[fourCC].length;
                    }
                    if (!microCts) currCts = cts;
                    if (!microDateDuration && dateDur != null) {
                      dateSDur[fourCC] = dateDur / s[fourCC].length;
                    }
                    if (!microDate) currDate = date;
                    let timoDur = 0;
                    if (s.TIMO) {
                      if (s.TIMO * 1e3 > currCts) s.TIMO = currCts / 100;
                      currCts -= s.TIMO * 1e3;
                      if (currCts < 0) currCts = 0;
                      if (d.STRM[ii + 1] && d.STRM[ii + 1].TIMO) {
                        const timoDiff = d.STRM[ii + 1].TIMO - s.TIMO;
                        timoDur = 100 * timoDiff / s[fourCC].length;
                      }
                      currDate -= s.TIMO * 1e3;
                      delete s.TIMO;
                    }
                    s[fourCC] = s[fourCC].map((value) => {
                      if (currCts != null && sDuration[fourCC] != null) {
                        let timedSample = { value };
                        if (includeTime) timedSample.cts = currCts;
                        if (includeDate) {
                          if (gpsTimeSrc === "GPS9" && fourCC === "GPS9") {
                            const GPS9Date = GPS9toDate(value);
                            const date2 = new Date(GPS9Date);
                            timedSample.date = date2;
                            const dateStreamSample = { date: date2, value: GPS9Date };
                            if (includeTime) dateStreamSample.cts = currCts;
                            dummyStream.dateStream.push(dateStreamSample);
                          } else {
                            timedSample.date = new Date(currDate);
                            if (fourCC === "dateStream") {
                              timedSample.value = currDate;
                            }
                          }
                        }
                        currCts += sDuration[fourCC] - timoDur;
                        currDate += dateSDur[fourCC] - timoDur;
                        return timedSample;
                      } else return { value };
                    });
                  } else {
                    s[fourCC] = s[fourCC].map((value) => ({
                      value
                    }));
                  }
                  if (fourCC === gpsTimeSrc && opts.stream && !opts.stream.includes(gpsTimeSrc)) {
                    delete d.STRM[ii];
                  }
                }
              });
              if (d.STRM && opts.dateStream && delayDateStream) {
                d.STRM.push(dummyStream);
              }
            }
          } else throw new Error("Invalid data, no DEVC");
        } catch (error) {
          if (opts.tolerant) {
            await breathe();
            console.error(error);
          } else throw error;
        }
        return result;
      }
      module.exports = timeKLV;
    }
  });

  // node_modules/gopro-telemetry/code/utils/rmrkToNameUnits.js
  var require_rmrkToNameUnits = __commonJS({
    "node_modules/gopro-telemetry/code/utils/rmrkToNameUnits.js"(exports, module) {
      module.exports = (rmrk) => {
        const rx = /^struct: (.*)/;
        if (!rx.test(rmrk)) return {};
        const parenthesisRx = / ?\(.*?\)/g;
        let broadString = rmrk.match(rx)[1].replace(/\) (.*)/g, "), $1");
        const name = `(${broadString.replace(parenthesisRx, "").replace(/\bXYZ\b/, "X, Y, Z")})`;
        const commasRx = /(\([^)]*?),([^)]*?\))/g;
        while (broadString.match(commasRx))
          broadString = broadString.replace(commasRx, "$1:REPLACER:$2");
        const broad = broadString.split(",");
        const units = [];
        const unitRx = /\((.+)\)/;
        broad.forEach((v) => {
          if (!unitRx.test(v)) units.push("_");
          else {
            units.push(...v.match(unitRx)[1].split(":REPLACER:"));
          }
        });
        return { name, units };
      };
    }
  });

  // node_modules/gopro-telemetry/code/interpretKLV.js
  var require_interpretKLV = __commonJS({
    "node_modules/gopro-telemetry/code/interpretKLV.js"(exports, module) {
      var { names } = require_keys();
      var rmrkToNameUnits = require_rmrkToNameUnits();
      async function interpretKLV(klv, options) {
        let result;
        try {
          result = JSON.parse(JSON.stringify(klv));
        } catch (e) {
          result = klv;
        }
        if (result != null && result.interpretSamples) {
          const toInterpret = ["SCAL", "altitudeFix", "ORIN", "ORIO", "MTRX", "TYPE"];
          const someMatch = function(a1, a2) {
            for (const elt of a1) if (a2.includes(elt)) return true;
            return false;
          };
          if (someMatch(toInterpret, Object.keys(result))) {
            if (result.hasOwnProperty("ORIN") && result.hasOwnProperty("ORIO")) {
              if (typeof result.ORIO === "string")
                result.ORIO = result.ORIO.split("");
              const labels = `(${result.ORIO.map((o) => o.toLowerCase()).join(",")})`;
              if (result.STNM) result.STNM += ` ${labels}`;
              else result.STNM = labels;
            }
            result[result.interpretSamples] = result[result.interpretSamples].map(
              (s) => {
                if (s == null) return s;
                if (result.hasOwnProperty("SCAL")) {
                  if (typeof s === "number") s = s / result.SCAL;
                  else if (Array.isArray(s)) {
                    const rescale = (samples) => {
                      if (result.SCAL.length === samples.length) {
                        samples = samples.map(
                          (ss, i2) => typeof ss === "number" ? ss / result.SCAL[i2] : ss
                        );
                      } else {
                        samples = samples.map(
                          (sss) => typeof sss === "number" ? sss / result.SCAL : sss
                        );
                      }
                      return samples;
                    };
                    if (s.every((ss) => Array.isArray(ss))) s = s.map(rescale);
                    else s = rescale(s);
                  }
                }
                if (result.hasOwnProperty("altitudeFix") && (result.GPS5 || result.GPS9) && s && s.length > 2) {
                  s[2] = s[2] - result.altitudeFix;
                }
                if (result.hasOwnProperty("ORIN") && result.hasOwnProperty("ORIO")) {
                  if (!result.hasOwnProperty("MTRX")) {
                    let newS = [];
                    const len = result.ORIN.length;
                    for (let y = 0; y < len; y++) {
                      for (let x = 0; x < len; x++) {
                        if (result.ORIN[y].toUpperCase() === result.ORIO[x]) {
                          if (result.ORIN[y] === result.ORIO[x]) newS[x] = s[y];
                          else newS[x] = -s[y];
                        }
                      }
                    }
                    s = newS;
                  }
                }
                if (result.hasOwnProperty("MTRX")) {
                  let newS = [];
                  const len = Math.sqrt(result.MTRX.length);
                  for (let y = 0; y < len; y++) {
                    for (let x = 0; x < len; x++) {
                      if (result.MTRX[y * len + x] !== 0)
                        newS[x] = s[y] * result.MTRX[y * len + x];
                    }
                  }
                  s = newS;
                }
                let rmrkName, rmrkUnits;
                if (result.RMRK && /^struct: (.*)/.test(result.RMRK)) {
                  const { name, units } = rmrkToNameUnits(result.RMRK);
                  rmrkName = name;
                  rmrkUnits = units;
                }
                if (!result.hasOwnProperty("STNM")) {
                  if (names[result.interpretSamples]) {
                    result.STNM = names[result.interpretSamples];
                  } else if (rmrkName) result.STNM = rmrkName;
                }
                if (!result.hasOwnProperty("UNIT") && rmrkUnits)
                  result.UNIT = rmrkUnits;
                return s;
              }
            );
          } else if (Array.isArray(result[result.interpretSamples])) {
            result[result.interpretSamples] = await Promise.all(
              result[result.interpretSamples].map((s) => interpretKLV(s, options))
            );
          } else {
            result[result.interpretSamples] = await interpretKLV(
              result[result.interpretSamples],
              options
            );
          }
          toInterpret.forEach((k) => delete result[k]);
        }
        return result;
      }
      module.exports = interpretKLV;
    }
  });

  // node_modules/gopro-telemetry/code/utils/deduceHeaders.js
  var require_deduceHeaders = __commonJS({
    "node_modules/gopro-telemetry/code/utils/deduceHeaders.js"(exports, module) {
      module.exports = function({ units, name }, { inn, out } = {}) {
        let parts;
        if (name) {
          parts = name.match(/.*\((.+?)\).*/);
          if (parts && parts.length) {
            name = name.replace(/\((.+?)\)/, "").trim().replace("  ", " ");
            parts = parts[1].split(",").map((p) => p.trim());
          } else parts = [];
        }
        let unitsHeaders = [];
        if (units) {
          if (Array.isArray(units)) unitsHeaders = units;
          else unitsHeaders[0] = units;
        }
        let headers = [name];
        if (inn == null || out == null) {
          for (let i2 = 0; i2 < Math.max(parts.length, unitsHeaders.length); i2++) {
            let part = parts[i2] || parts[0] ? `(${parts[i2] || parts[0]})` : "";
            let unit = unitsHeaders[i2] || unitsHeaders[0] ? `[${unitsHeaders[i2] || unitsHeaders[0]}]` : "";
            headers[i2] = [name, part, unit].filter((e) => e.length).join(" ");
          }
        } else {
          let part = parts.slice(inn, out).length ? `(${parts.slice(inn, out).join(",")})` : "";
          let unit = unitsHeaders.slice(inn, out).length ? `[${unitsHeaders.slice(inn, out).join(",")}]` : "";
          headers = [name, part, unit].filter((e) => e.length).join(" ");
        }
        return headers;
      };
    }
  });

  // node_modules/gopro-telemetry/code/mergeStream.js
  var require_mergeStream = __commonJS({
    "node_modules/gopro-telemetry/code/mergeStream.js"(exports, module) {
      var {
        translations,
        ignore,
        stickyTranslations,
        idKeysTranslation,
        idValuesTranslation,
        mp4ValidSamples
      } = require_keys();
      var deduceHeaders = require_deduceHeaders();
      var hero7Labelling = require_hero7Labelling();
      var breathe = require_breathe();
      function deepEqual(a, b) {
        if (typeof a !== "object" || typeof b !== "object" || a == null || b == null)
          return a === b;
        if (Object.keys(a).length !== Object.keys(b).length) return false;
        for (let i2 = 0; i2 < Object.keys(a).length; i2++)
          if (!deepEqual(a[Object.keys(a)[i2]], b[Object.keys(a)[i2]])) return false;
        return true;
      }
      async function mergeStreams(klv, options) {
        const { repeatHeaders, repeatSticky, mp4header } = options;
        let result = { streams: {} };
        let stickies = {};
        for (const d of klv.DEVC || []) {
          if (d != null) {
            stickies[d["device name"]] = stickies[d["device name"]] || {};
            try {
              for (let i2 = 0; i2 < d.STRM.length; i2++) {
                await breathe();
                const s = d.STRM[i2] || {};
                if ((!mp4header || mp4ValidSamples.includes(s.interpretSamples)) && s.interpretSamples && s.interpretSamples !== "STNM") {
                  const fourCC = s.interpretSamples;
                  stickies[d["device name"]][fourCC] = stickies[d["device name"]][fourCC] || {};
                  let samples = s[fourCC];
                  delete s[fourCC];
                  delete s.interpretSamples;
                  const multiple = s.multi;
                  delete s.multi;
                  if (samples && samples.length) {
                    let sticky = {};
                    let description = { name: fourCC };
                    for (const key in s) {
                      if (translations[key]) description[translations[key]] = s[key];
                      else if (!ignore.includes(key))
                        sticky[stickyTranslations[key] || key] = s[key];
                    }
                    sticky = { ...stickies[d["device name"]][fourCC], ...sticky };
                    if (repeatSticky) {
                      for (let i3 = 0; i3 < samples.length; i3++) {
                        samples[i3] = { ...samples[i3] || {}, ...sticky };
                      }
                    } else if (Object.keys(sticky).length && samples.length) {
                      for (let key in sticky) {
                        if (!deepEqual(
                          sticky[key],
                          stickies[d["device name"]][fourCC][key]
                        )) {
                          samples[0].sticky = samples[0].sticky || {};
                          samples[0].sticky[key] = sticky[key];
                        }
                      }
                    }
                    stickies[d["device name"]][fourCC] = {
                      ...stickies[d["device name"]][fourCC],
                      ...sticky
                    };
                    const workOnHeaders = async function(samples2, desc) {
                      let description2 = JSON.parse(JSON.stringify(desc));
                      let headers = deduceHeaders(description2);
                      for (let i3 = 0; i3 < samples2.length; i3++) {
                        const ss = samples2[i3] || {};
                        if (Array.isArray(ss.value)) {
                          ss.value.forEach(
                            (v, i4) => ss[headers[i4] || `(${i4})`] = v
                          );
                        } else if (headers[0]) ss[headers[0]] = ss.value;
                        if (headers.length) delete ss.value;
                        samples2[i3] = ss;
                      }
                      delete description2.units;
                      delete description2.name;
                      return { samples: samples2, description: description2 };
                    };
                    description.name = hero7Labelling(description.name);
                    const completeSample = async ({ samples: samples2, description: description2 }) => {
                      if (repeatHeaders) {
                        const newResults = await workOnHeaders(samples2, description2);
                        samples2 = newResults.samples;
                        description2 = newResults.description;
                      }
                      if (result.streams[fourCC])
                        result.streams[fourCC].samples.push(...samples2);
                      else result.streams[fourCC] = { samples: samples2, ...description2 };
                    };
                    if (multiple) {
                      let newSamples = {};
                      let idKey = "id";
                      let idPos = 0;
                      let idParts, firstIdParts;
                      if (description.name) {
                        idParts = description.name.match(/(\(.*)\b(ID)\b,?(.*\))$/);
                        if (idParts) {
                          idPos = idParts[0].replace(/\((.*)\)$/, "$1").split(",").indexOf("ID");
                          idKey = "ID";
                        } else {
                          firstIdParts = description.name.match(/\((\w+),?(.*)\)$/i);
                          if (firstIdParts) {
                            idKey = idKeysTranslation(firstIdParts[1]);
                          }
                        }
                      }
                      if (samples[0].value[0] && samples[0].value[0].length === 2) {
                        const headers = [];
                        const newSamples2 = [];
                        for (let i3 = 0; i3 < samples.length; i3++) {
                          const ss = samples[i3] || {};
                          const newSample = { ...ss, value: [] };
                          (ss.value || []).forEach((v, x) => {
                            if (v != null && Array.isArray(v)) {
                              headers[x] = idValuesTranslation(v[0], idKey);
                              newSample.value.push(v[idPos === 1 ? 0 : 1]);
                            }
                          });
                          newSamples2.push(newSample);
                        }
                        if (firstIdParts || idParts) {
                          description.name = description.name.replace(
                            /\((\w+),?(.*)\)$/i,
                            ` | ${idKey}`
                          );
                          if (firstIdParts) {
                            description.units = firstIdParts[2].split(",").map((p) => p.trim());
                          }
                        }
                        description.name += ` (${headers.join(",")})`;
                        await completeSample({ samples: newSamples2, description });
                      } else {
                        if (idParts) {
                          description.name = description.name.replace(
                            idParts[0],
                            idParts[1] + idParts[3]
                          );
                        } else if (firstIdParts) {
                          description.name = description.name.replace(
                            /\((\w+),?(.*)\)$/i,
                            `(${firstIdParts[2]})`
                          );
                        }
                        for (let i3 = 0; i3 < samples.length; i3++) {
                          const ss = samples[i3] || {};
                          (ss.value || []).forEach((v) => {
                            if (v != null && Array.isArray(v)) {
                              let id = v[idPos];
                              if (!newSamples[id]) newSamples[id] = [];
                              let thisSample = {};
                              Object.keys(ss).forEach((k) => {
                                if (k !== "value") thisSample[k] = ss[k];
                              });
                              thisSample.value = [
                                ...v.slice(0, idPos),
                                ...v.slice(idPos + 1)
                              ];
                              if (Array.isArray(thisSample.value) && thisSample.value.length === 1)
                                thisSample.value = thisSample.value[0];
                              newSamples[id].push(thisSample);
                            }
                          });
                        }
                        for (const key in newSamples) {
                          description.subStreamName = `${idKey}:${idValuesTranslation(
                            key,
                            idKey
                          )}`;
                          let desc = description;
                          if (repeatHeaders) {
                            const newResults = await workOnHeaders(
                              newSamples[key],
                              description
                            );
                            newSamples[key] = newResults.samples;
                            desc = newResults.description;
                          }
                          if (result.streams[fourCC + key]) {
                            result.streams[fourCC + key].samples.push(
                              ...newSamples[key]
                            );
                          } else {
                            if (Array.isArray(options.stream) && options.stream.includes(fourCC)) {
                              options.stream.push(fourCC + key);
                            }
                            result.streams[fourCC + key] = {
                              samples: newSamples[key],
                              ...desc
                            };
                          }
                        }
                      }
                    } else await completeSample({ samples, description });
                  }
                } else {
                  if (s.interpretSamples) delete s.interpretSamples;
                  result.streams[`Data ${i2}`] = JSON.parse(JSON.stringify(d.STRM));
                }
              }
            } catch (error) {
            }
          }
          delete d.DVID;
          delete d.interpretSamples;
          delete d.STRM;
          for (const key in d) {
            if (translations[key]) result[translations[key]] = d[key];
            else result[key] = d[key];
          }
        }
        return result;
      }
      module.exports = mergeStreams;
    }
  });

  // node_modules/gopro-telemetry/code/utils/reduceSamples.js
  var require_reduceSamples = __commonJS({
    "node_modules/gopro-telemetry/code/utils/reduceSamples.js"(exports, module) {
      function reduceSamples(samples) {
        const keys = new Set(
          samples.reduce((acc, curr) => acc.concat(Object.keys(curr)), [])
        );
        let result = Array.isArray(samples[0]) ? [] : {};
        keys.forEach((k) => {
          const validVals = samples.map((s) => s[k]).filter((v) => v != null);
          if (k === "date") {
            result[k] = new Date(
              validVals.reduce((acc, curr) => acc + new Date(curr).getTime(), 0) / validVals.length
            );
          } else if (!isNaN(validVals[0])) {
            result[k] = validVals.reduce((acc, curr) => acc + curr, 0) / validVals.length;
          } else if (typeof validVals[0] === "object") {
            result[k] = reduceSamples(validVals);
          } else if (validVals[0] === void 0) result[k] = null;
          else result[k] = validVals[0];
        });
        return result;
      }
      module.exports = reduceSamples;
    }
  });

  // node_modules/gopro-telemetry/code/groupTimes.js
  var require_groupTimes = __commonJS({
    "node_modules/gopro-telemetry/code/groupTimes.js"(exports, module) {
      var reduceSamples = require_reduceSamples();
      var breathe = require_breathe();
      function process2Vals(vals, prop, k) {
        if (vals.length < 2) return vals[0] || null;
        else if (typeof vals[0] === "number")
          return vals[0] + (vals[1] - vals[0]) * prop;
        else if (k === "date") {
          return new Date(
            new Date(vals[0]).getTime() + (new Date(vals[1]).getTime() - new Date(vals[0]).getTime()) * prop
          );
        } else if (typeof vals[0] === "object") {
          let result;
          try {
            result = JSON.parse(JSON.stringify(vals[0]));
          } catch (error) {
            result = vals[0];
          }
          for (const key in result)
            result[key] = process2Vals([vals[0][key], vals[1][key]], prop);
          return result;
        } else return vals[0];
      }
      function interpolateSample(samples, i2, currentTime) {
        const baseTime = samples[i2].cts;
        const difference = samples[i2 + 1].cts - baseTime;
        const proportion = (currentTime - baseTime) / difference;
        const keys = new Set(
          [samples[i2], samples[i2 + 1]].reduce(
            (acc, curr) => acc.concat(Object.keys(curr)),
            []
          )
        );
        let result = Array.isArray(samples[0]) ? [] : {};
        keys.forEach((k) => {
          const validVals = [samples[i2], samples[i2 + 1]].map((s) => s[k]).filter((v) => v != null);
          result[k] = process2Vals(validVals, proportion, k);
        });
        return result;
      }
      module.exports = async function(klv, { groupTimes, timeOut, disableInterpolation, disableMerging }) {
        const result = {};
        for (const key in klv) {
          const { streams, ...rest } = klv[key];
          result[key] = rest;
          if (streams) {
            result[key].streams = [];
            for (const k in streams) {
              await breathe();
              const { samples, ...rest2 } = streams[k];
              result[key].streams[k] = rest2;
              if (samples) {
                let currentTime = 0;
                let newSamples = [];
                let reachedEnd = false;
                let i2 = 0;
                while (!reachedEnd) {
                  let group = [];
                  while (samples[i2].cts < currentTime + groupTimes) {
                    group.push(samples[i2]);
                    if (i2 + 1 >= samples.length) {
                      reachedEnd = true;
                      break;
                    } else i2++;
                    if (i2 % 1e3 === 0) await breathe();
                    if (disableMerging) break;
                  }
                  if (group.length > 1) newSamples.push(reduceSamples(group));
                  else if (i2 > 0 && i2 < samples.length && !disableInterpolation) {
                    newSamples.push(interpolateSample(samples, i2 - 1, currentTime));
                  } else if (group.length === 1) newSamples.push(group[0]);
                  if (timeOut === "date" && newSamples.length)
                    delete newSamples[newSamples.length - 1].cts;
                  currentTime += groupTimes;
                }
                result[key].streams[k].samples = newSamples;
              }
            }
          }
        }
        return result;
      };
    }
  });

  // node_modules/gopro-telemetry/code/smoothSamples.js
  var require_smoothSamples = __commonJS({
    "node_modules/gopro-telemetry/code/smoothSamples.js"(exports, module) {
      var reduceSamples = require_reduceSamples();
      var breathe = require_breathe();
      module.exports = async function(klv, { smooth, repeatSticky }) {
        let result;
        try {
          result = JSON.parse(JSON.stringify(klv));
        } catch (error) {
          result = klv;
        }
        for (const key in result) {
          if (result[key].streams) {
            for (const k in result[key].streams) {
              await breathe();
              const samples = result[key].streams[k].samples;
              let newSamples = [];
              if (samples) {
                for (let i2 = 0; i2 < samples.length; i2++) {
                  const ins = Math.max(0, i2 - smooth);
                  const out = Math.min(i2 + smooth + 1, samples.length);
                  let newSample = reduceSamples(samples.slice(ins, out));
                  if (samples[i2].cts != null) newSample.cts = samples[i2].cts;
                  if (samples[i2].date != null) newSample.date = samples[i2].date;
                  if (!repeatSticky) {
                    delete newSample.sticky;
                    if (samples[i2].sticky) newSample.sticky = samples[i2].sticky;
                  }
                  newSamples.push(newSample);
                }
              }
              result[key].streams[k].samples = newSamples;
            }
          }
        }
        return result;
      };
    }
  });

  // node_modules/gopro-telemetry/code/decimalPlaces.js
  var require_decimalPlaces = __commonJS({
    "node_modules/gopro-telemetry/code/decimalPlaces.js"(exports, module) {
      module.exports = async function(interpreted, { decimalPlaces }) {
        let result = interpreted;
        for (const key in result) {
          if (result[key].streams) {
            for (const k in result[key].streams) {
              const samples = result[key].streams[k].samples;
              let newSamples = [];
              if (samples) {
                for (let i2 = 0; i2 < samples.length; i2++) {
                  let newSample = samples[i2];
                  for (let j = 0; j < newSample.value.length; j++) {
                    if (!isNaN(newSample.value[j])) {
                      newSample.value[j] = parseFloat(newSample.value[j].toFixed(decimalPlaces));
                    }
                  }
                  newSamples.push(newSample);
                }
              }
              result[key].streams[k].samples = newSamples;
            }
          }
        }
        return result;
      };
    }
  });

  // node_modules/gopro-telemetry/code/processGPS.js
  var require_processGPS = __commonJS({
    "node_modules/gopro-telemetry/code/processGPS.js"(exports, module) {
      var egm96;
      try {
        egm96 = __require("egm96-universal");
      } catch {
        egm96 = void 0;
      }
      var breathe = require_breathe();
      module.exports = async function(klv, { ellipsoid, GPSPrecision, GPSFix, geoidHeight }, gpsTimeSrc) {
        const evaluateDeletion = (s) => {
          if (s.GPS5) {
            if (GPSFix != null && (s.GPSF == null || s.GPSF < GPSFix)) {
              return "all";
            }
            if (GPSPrecision != null && (s.GPSP == null || s.GPSP > GPSPrecision)) {
              return "all";
            }
            return false;
          } else if (s.GPS9) {
            let accepted = 0;
            let rejected = 0;
            const perSample = [];
            for (const sample of s.GPS9 || []) {
              if (!sample) {
                perSample.push(true);
                continue;
              }
              const fix = sample[8];
              const precision = sample[7];
              if (GPSFix != null) {
                if (fix == null || fix < GPSFix) {
                  rejected++;
                  perSample.push(true);
                  continue;
                }
              }
              if (GPSPrecision != null) {
                if (precision == null || precision > GPSPrecision) {
                  rejected++;
                  perSample.push(true);
                  continue;
                }
              }
              accepted++;
              perSample.push(false);
            }
            if (rejected === s.GPS9.length) return "all";
            if (accepted === s.GPS9.length) return false;
            return perSample.filter((s2) => !!s2).length;
          }
        };
        let result;
        try {
          result = JSON.parse(JSON.stringify(klv));
        } catch (error) {
          result = klv;
        }
        const corrections = {};
        if (!ellipsoid || geoidHeight || GPSFix != null || GPSPrecision != null) {
          for (const d of result.DEVC || []) {
            const length = result.DEVC.length;
            const foundCorrections = {};
            for (let i2 = ((d || {}).STRM || []).length - 1; i2 >= 0; i2--) {
              await breathe();
              const toDelete = d.STRM[i2][gpsTimeSrc] && evaluateDeletion(d.STRM[i2]);
              if (toDelete) d.STRM[i2].toDelete = toDelete;
              else if ((!foundCorrections.GPS5 || foundCorrections.GPS9) && //If altitude is mean sea level, no need to process it further
              //Otherwise check if all needed info is available
              d.STRM[i2].GPSA !== "MSLV" && (!ellipsoid || geoidHeight)) {
                const gpsKey = ["GPS5", "GPS9"].find(
                  (k) => d.STRM[i2][k] && d.STRM[i2][k][0] != null
                );
                if (gpsKey && !foundCorrections[gpsKey]) {
                  let fixQuality, precision;
                  if (gpsKey === "GPS5" && d.STRM[i2].GPSF != null && d.STRM[i2].GPSP != null) {
                    fixQuality = d.STRM[i2].GPSF / 3;
                    precision = (9999 - d.STRM[i2].GPSP) / 9999;
                  } else if (gpsKey === "GPS9") {
                    fixQuality = d.STRM[i2].GPS9[0][8] / 3;
                    precision = (9999 - 100 * d.STRM[i2].GPS9[0][7]) / 9999;
                  } else continue;
                  corrections[gpsKey] = corrections[gpsKey] || {};
                  const centered = (length / 2 - Math.abs(length / 2 - i2)) / (length / 2);
                  const rating = fixQuality * 10 + precision * 20 + centered;
                  if (corrections[gpsKey].rating == null || rating > corrections[gpsKey].rating) {
                    corrections[gpsKey].rating = rating;
                    const scaling = d.STRM[i2].SCAL && d.STRM[i2].SCAL.length > 1 ? [d.STRM[i2].SCAL[0], d.STRM[i2].SCAL[1]] : [1, 1];
                    corrections[gpsKey].source = [
                      d.STRM[i2][gpsKey][0][0] / scaling[0],
                      d.STRM[i2][gpsKey][0][1] / scaling[1]
                    ];
                    foundCorrections[gpsKey] = true;
                  }
                }
              }
            }
          }
          let warnEgm;
          for (const k in corrections) {
            if (corrections[k].source) {
              if (egm96) {
                corrections[k].value = egm96.meanSeaLevel(
                  corrections[k].source[0],
                  corrections[k].source[1]
                );
              } else warnEgm = true;
            }
          }
          if (warnEgm) {
            console.warn(
              "Could not fix altitude. Install optional peer dependency `egm96-universal`"
            );
          }
        }
        (result.DEVC || []).forEach((d) => {
          ((d || {}).STRM || []).forEach((s) => {
            for (const k in corrections) {
              if (corrections[k].value != null) {
                if (s[k]) {
                  if (!ellipsoid) s.altitudeFix = corrections[k].value;
                  else s.geoidHeight = corrections[k].value;
                }
              }
            }
          });
        });
        return result;
      };
    }
  });

  // node_modules/gopro-telemetry/code/utils/getSpeed.js
  var require_getSpeed = __commonJS({
    "node_modules/gopro-telemetry/code/utils/getSpeed.js"(exports, module) {
      var degToRad = (d) => d * Math.PI / 180;
      var coordsToDist = (lat2, lon2, lat1, lon1) => {
        const earthRadius = 6378137;
        const dLat = degToRad(lat2 - lat1);
        const dLon = degToRad(lon2 - lon1);
        lat1 = degToRad(lat1);
        lat2 = degToRad(lat2);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
      };
      module.exports = (from, to) => {
        if (!from) return 0;
        const t1 = from.date / 1e3;
        const t2 = to.date / 1e3;
        if (!from.value || !to.value) return null;
        const [lat1, lon1, ele1] = from.value;
        const [lat2, lon2, ele2] = to.value;
        const duration = t2 - t1;
        const distance = coordsToDist(lat2, lon2, lat1, lon1);
        const vertDist = ele2 - ele1;
        const distance3d = Math.sqrt(vertDist ** 2 + distance ** 2);
        return distance3d / duration;
      };
    }
  });

  // node_modules/gopro-telemetry/code/filterWrongSpeed.js
  var require_filterWrongSpeed = __commonJS({
    "node_modules/gopro-telemetry/code/filterWrongSpeed.js"(exports, module) {
      var getSpeed = require_getSpeed();
      module.exports = (samples, maxSpeed) => {
        const tracks = [];
        for (const sample of samples) {
          let destination = { track: null, speed: maxSpeed };
          for (let i2 = 0; i2 < tracks.length; i2++) {
            const lastSample = tracks[i2][tracks[i2].length - 1];
            const speed = getSpeed(lastSample, sample);
            if (speed != null && speed < destination.speed) {
              destination = { track: i2, speed };
              break;
            }
          }
          if (destination.track == null) {
            if (tracks.length < 15) tracks.push([sample]);
          } else tracks[destination.track].push(sample);
          tracks.sort(
            (a, b) => !a[0].value || a[0].value[0] === 0 && a[0].value[1] === 0 ? Infinity : b.length - a.length
          );
        }
        return tracks[0] || [];
      };
    }
  });

  // node_modules/gopro-telemetry/code/data/presetsOptions.js
  var require_presetsOptions = __commonJS({
    "node_modules/gopro-telemetry/code/data/presetsOptions.js"(exports, module) {
      module.exports = {
        general: {
          mandatory: {
            deviceList: false,
            streamList: false,
            raw: false,
            repeatSticky: false,
            repeatHeaders: false
          },
          preferred: {}
        },
        //geoidheight saves the altitude offset when ellipsoid is enabled, for 3d party interpretation
        gpx: {
          mandatory: {
            dateStream: false,
            stream: "GPS",
            timeOut: null,
            geoidHeight: true
          },
          preferred: { ellipsoid: true }
        },
        virb: {
          mandatory: {
            dateStream: false,
            timeOut: null,
            geoidHeight: true
          },
          preferred: { ellipsoid: true, timeIn: "MP4", stream: "GPS" }
        },
        kml: {
          mandatory: { dateStream: false, stream: "GPS", timeOut: null },
          preferred: {}
        },
        geojson: {
          mandatory: {
            dateStream: false,
            stream: "GPS",
            timeOut: null,
            geoidHeight: true
          },
          preferred: { ellipsoid: true }
        },
        csv: { mandatory: { dateStream: false }, preferred: {} },
        mgjson: {
          mandatory: { dateStream: true, timeOut: null },
          preferred: {
            groupTimes: "frames",
            disableInterpolation: true,
            disableMerging: false
          }
        }
      };
    }
  });

  // node_modules/gopro-telemetry/code/presets/toGpx.js
  var require_toGpx = __commonJS({
    "node_modules/gopro-telemetry/code/presets/toGpx.js"(exports, module) {
      var breathe = require_breathe();
      var fixes = {
        0: "none",
        2: "2d",
        3: "3d"
      };
      async function getGPS5Data(data, comment) {
        let frameRate;
        let inner = "";
        let device = "";
        if (data["frames/second"] != null)
          frameRate = `${Math.round(data["frames/second"])} fps`;
        for (const key in data) {
          if (data[key]["device name"] != null) device = data[key]["device name"];
          if (data[key].streams) {
            for (const stream in data[key].streams) {
              await breathe();
              if ((stream === "GPS5" || stream === "GPS9") && data[key].streams[stream].samples) {
                let units;
                let name;
                if (data[key].streams[stream].name != null) {
                  name = data[key].streams[stream].name;
                }
                if (data[key].streams[stream].units != null) {
                  units = `[${data[key].streams[stream].units.toString()}]`;
                }
                let sticky = {};
                for (let i2 = 0; i2 < data[key].streams[stream].samples.length; i2++) {
                  const s = data[key].streams[stream].samples[i2];
                  if (s.value && s.value.length > 1) {
                    if (s.sticky) sticky = { ...sticky, ...s.sticky };
                    let commentParts = [];
                    let cmt = "";
                    let time = "";
                    let ele = "";
                    let fix = "";
                    let hdop = "";
                    let geoidHeight = "";
                    for (const key2 in sticky) {
                      if (key2 === "fix") {
                        if (stream === "GPS5") {
                          fix = `
              <fix>${fixes[sticky[key2]] || "none"}</fix>`;
                        }
                      } else if (key2 === "precision") {
                        if (stream === "GPS5") {
                          hdop = `
              <hdop>${sticky[key2] / 100}</hdop>`;
                        }
                      } else if (key2 === "geoidHeight") {
                        geoidHeight = `
              <geoidheight>${sticky[key2]}</geoidheight>`;
                      } else if (comment) {
                        commentParts.push(`${key2}: ${sticky[key2]}`);
                      }
                    }
                    if (stream === "GPS9") {
                      if (s.value.length > 7) {
                        hdop = `
              <hdop>${s.value[7]}</hdop>`;
                      }
                      if (s.value.length > 8) {
                        fix = `
              <fix>${s.value[8]}</fix>`;
                      }
                    }
                    if (comment) {
                      if (s.value.length > 3) {
                        commentParts.push(`2dSpeed: ${s.value[3]}`);
                      }
                      if (s.value.length > 4) {
                        commentParts.push(`3dSpeed: ${s.value[4]}`);
                      }
                      if (commentParts.length) {
                        cmt = `
              <cmt>${commentParts.join("; ")}</cmt>`;
                      }
                    }
                    if (s.value.length > 1) {
                      ele = `
              <ele>${s.value[2]}</ele>`;
                    }
                    if (s.date != null) {
                      if (typeof s.date != "object") s.date = new Date(s.date);
                      try {
                        time = `
              <time>${s.date.toISOString()}</time>`;
                      } catch (error) {
                        time = `
              <time>${s.date}</time>`;
                      }
                    }
                    const partial = `
          <trkpt lat="${s.value[0]}" lon="${s.value[1]}">
              ${(ele + time + fix + hdop + geoidHeight + cmt).trim()}
          </trkpt>`;
                    if (i2 === 0 && s.cts > 0) {
                      let firstDate;
                      try {
                        firstDate = new Date(s.date.getTime() - s.cts).toISOString();
                      } catch (e) {
                      }
                      const firstTime = `
              <time>${firstDate}</time>`;
                      const fakeFirst = `
          <trkpt lat="${s.value[0]}" lon="${s.value[1]}">
                ${(ele + firstTime + fix + hdop + geoidHeight + cmt).trim()}
          </trkpt>`;
                      inner += `${fakeFirst}`;
                    }
                    inner += `${partial}`;
                  }
                }
                const description = [frameRate, name, units].filter((e) => e != null).join(" - ");
                return { inner, description, device };
              }
            }
          }
        }
        return { inner, description: frameRate || "", device };
      }
      module.exports = async function(data, { name, comment }) {
        const converted = await getGPS5Data(data, comment);
        if (!converted) return void 0;
        let string = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="https://github.com/juanirache/gopro-telemetry">
    <trk>
        <name>${name}</name>
        <desc>${converted.description}</desc>
        <src>${converted.device}</src>
        <trkseg>
            ${converted.inner.trim()}
        </trkseg>
  </trk>
</gpx>`;
        return string;
      };
    }
  });

  // node_modules/gopro-telemetry/code/presets/toVirb.js
  var require_toVirb = __commonJS({
    "node_modules/gopro-telemetry/code/presets/toVirb.js"(exports, module) {
      var breathe = require_breathe();
      async function getGPSData(data) {
        let frameRate;
        let inner = "";
        let device = "";
        if (data["frames/second"] != null)
          frameRate = `${Math.round(data["frames/second"])} fps`;
        for (const key in data) {
          if (data[key]["device name"] != null) device = data[key]["device name"];
          if (data[key].streams) {
            for (const stream in data[key].streams) {
              await breathe();
              if ((stream === "GPS5" || stream === "GPS9") && data[key].streams[stream].samples) {
                let name;
                if (data[key].streams[stream].name != null)
                  name = data[key].streams[stream].name;
                let units;
                if (data[key].streams[stream].units != null)
                  units = `[${data[key].streams[stream].units.toString()}]`;
                let sticky = {};
                for (let i2 = 0; i2 < data[key].streams[stream].samples.length; i2++) {
                  const s = data[key].streams[stream].samples[i2];
                  if (s.value && s.value.length > 1) {
                    if (s.sticky) sticky = { ...sticky, ...s.sticky };
                    let time = "";
                    let ele = "";
                    let geoidHeight = "";
                    if (sticky.geoidHeight != null)
                      geoidHeight = `
                <geoidheight>${sticky.geoidHeight}</geoidheight>`;
                    if (s.value.length > 1)
                      ele = `
                <ele>${s.value[2]}</ele>`;
                    if (s.date != null) {
                      if (typeof s.date != "object") s.date = new Date(s.date);
                      try {
                        time = `
                <time>${s.date.toISOString().replace(/\.(\d{3})Z$/, "Z")}</time>`;
                      } catch (e) {
                        time = `
                <time>${s.date}</time>`;
                      }
                    }
                    const partial = `
            <trkpt lat="${s.value[0]}" lon="${s.value[1]}">
                ${(ele + time + geoidHeight).trim()}
            </trkpt>`;
                    if (i2 === 0 && s.cts > 0) {
                      let firstDate;
                      try {
                        firstDate = new Date(s.date.getTime() - s.cts).toISOString().replace(/\.(\d{3})Z$/, "Z");
                      } catch (e) {
                        firstDate = new Date(s.date - s.cts).toISOString().replace(/\.(\d{3})Z$/, "Z");
                      }
                      const firstTime = `
                <time>${firstDate}</time>`;
                      const fakeFirst = `
            <trkpt lat="${s.value[0]}" lon="${s.value[1]}">
                    ${(ele + firstTime + geoidHeight).trim()}
            </trkpt>`;
                      inner += `${fakeFirst}`;
                    }
                    inner += `${partial}`;
                  }
                }
                const description = [frameRate, name, units].filter((e) => e != null).join(" - ");
                return { inner, description, device };
              }
            }
          }
        }
        return { inner, description: frameRate || "", device };
      }
      async function getACCLData(data) {
        let frameRate;
        let inner = "";
        let device = "";
        if (data["frames/second"] != null)
          frameRate = `${Math.round(data["frames/second"])} fps`;
        for (const key in data) {
          if (data[key]["device name"] != null) device = data[key]["device name"];
          if (data[key].streams) {
            for (const stream in data[key].streams) {
              await breathe();
              if (stream === "ACCL" && data[key].streams.ACCL.samples) {
                let name;
                if (data[key].streams.ACCL.name != null)
                  name = data[key].streams.ACCL.name;
                let units = `[g]`;
                for (let i2 = 0; i2 < data[key].streams.ACCL.samples.length; i2++) {
                  const s = data[key].streams.ACCL.samples[i2];
                  if (s.value && s.value.length) {
                    let time = "";
                    let acceleration = "";
                    if (s.date != null) {
                      if (typeof s.date != "object") s.date = new Date(s.date);
                      try {
                        time = `
                  <time>${s.date.toISOString()}</time>`;
                      } catch (e) {
                        time = `
                  <time>${s.date}</time>`;
                      }
                    }
                    acceleration = `
                  <extensions>
                    <gpxacc:AccelerationExtension>
                      <gpxacc:accel offset="0" x="${s.value[1] / 9.80665}" y="${s.value[2] / 9.80665}" z="${s.value[0] / 9.80665}"/>
                      <gpxacc:accel offset="0" x="${s.value[1] / 9.80665}" y="${s.value[2] / 9.80665}" z="${s.value[0] / 9.80665}"/>
                    </gpxacc:AccelerationExtension>
                  </extensions>`;
                    const partial = `
              <trkpt lat="0" lon="0">
                  ${(time + acceleration).trim()}
              </trkpt>`;
                    if (i2 === 0 && s.cts > 0) {
                      let firstDate;
                      try {
                        firstDate = new Date(s.date.getTime() - s.cts).toISOString();
                      } catch (e) {
                        firstDate = new Date(s.date - s.cts).toISOString();
                      }
                      const firstTime = `
                <time>${firstDate}</time>`;
                      const firstAccel = `
                <extensions>
                  <gpxacc:AccelerationExtension>
                    <gpxacc:accel offset="0" x="0" y="0" z="0"/>
                    <gpxacc:accel offset="0" x="0" y="0" z="0"/>
                  </gpxacc:AccelerationExtension>
                </extensions>`;
                      const fakeFirst = `
                <trkpt lat="0" lon="0">
                  ${(firstTime + firstAccel).trim()}
              </trkpt>`;
                      inner += `${fakeFirst}`;
                    }
                    inner += `${partial}`;
                  }
                }
                const description = [frameRate, name, units].filter((e) => e != null).join(" - ");
                return { inner, description, device };
              }
            }
          }
        }
        return { inner, description: frameRate || "", device };
      }
      module.exports = async function(data, { name, stream }) {
        let converted;
        if (stream[0] === "GPS5" || stream[0] === "GPS9") {
          converted = await getGPSData(data);
        } else if (stream[0] === "ACCL") converted = await getACCLData(data);
        else return void 0;
        if (!converted) return void 0;
        let string = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1"
    xmlns:gpxacc="http://www.garmin.com/xmlschemas/AccelerationExtension/v1"
    version="1.1"
    creator="https://github.com/juanirache/gopro-telemetry">
    <trk>
        <name>${name}</name>
        <desc>${converted.description}</desc>
        <src>${converted.device}</src>
        <trkseg>
            ${converted.inner.trim()}
        </trkseg>
  </trk>
</gpx>`;
        return string;
      };
    }
  });

  // node_modules/gopro-telemetry/code/presets/toKml.js
  var require_toKml = __commonJS({
    "node_modules/gopro-telemetry/code/presets/toKml.js"(exports, module) {
      var breathe = require_breathe();
      async function getGPSData(data, comment) {
        let frameRate;
        let device;
        let inner = "";
        if (data["frames/second"] != null)
          frameRate = `${Math.round(data["frames/second"])} fps`;
        for (const key in data) {
          if (data[key]["device name"] != null) device = data[key]["device name"];
          if (data[key].streams) {
            for (const stream in data[key].streams) {
              await breathe();
              if ((stream === "GPS5" || stream === "GPS9") && data[key].streams[stream].samples) {
                let name;
                if (data[key].streams[stream].name != null) {
                  name = data[key].streams[stream].name;
                }
                let units;
                if (data[key].streams[stream].units != null) {
                  units = data[key].streams[stream].units.toString();
                }
                let sticky = {};
                for (let i2 = 0; i2 < data[key].streams[stream].samples.length; i2++) {
                  const s = data[key].streams[stream].samples[i2];
                  if (s.value && s.value.length > 1) {
                    if (s.sticky) sticky = { ...sticky, ...s.sticky };
                    let commentParts = [];
                    let cmt = "";
                    let time = "";
                    let altitudeMode = "";
                    if (comment) {
                      for (const key2 in sticky) {
                        if (key2 === "precision") {
                          if (stream === "GPS5") {
                            commentParts.push(`GPS DOP: ${sticky[key2] / 100}`);
                          }
                        } else if (key2 === "fix") {
                          if (stream === "GPS5") {
                            commentParts.push(`GPS Fix: ${sticky[key2]}`);
                          }
                        } else {
                          commentParts.push(`${key2}: ${sticky[key2]}`);
                        }
                      }
                      if (stream === "GPS9") {
                        if (s.value.length > 7) {
                          commentParts.push(`GPS DOP: ${s.value[7]}`);
                        }
                        if (s.value.length > 8) {
                          commentParts.push(`GPS Fix: ${s.value[8]}`);
                        }
                      }
                      if (s.value.length > 3) {
                        commentParts.push(`2D Speed: ${s.value[3]}`);
                      }
                      if (s.value.length > 4) {
                        commentParts.push(`3D Speed: ${s.value[4]}`);
                      }
                      if (commentParts.length) {
                        cmt = `
            <description>${commentParts.join("; ")}</description>`;
                      }
                    }
                    if (s.date != null) {
                      if (typeof s.date != "object") s.date = new Date(s.date);
                      try {
                        time = `
            <TimeStamp>
                <when>${s.date.toISOString()}</when>
            </TimeStamp>`;
                      } catch (e) {
                        time = `
            <TimeStamp>
                <when>${s.date}</when>
            </TimeStamp>`;
                      }
                    }
                    let coords = [s.value[1], s.value[0]];
                    if (s.value.length > 2) {
                      coords.push(s.value[2]);
                      altitudeMode = `
            <altitudeMode>absolute</altitudeMode>`;
                    }
                    const partial = `
        <Placemark>
            ${cmt.trim()}
            <Point>
                ${altitudeMode.trim()}
                <coordinates>${coords.join(",")}</coordinates>
            </Point>
            ${time.trim()}
        </Placemark>`;
                    inner += `${partial}`;
                  }
                }
                const description = [device, frameRate, name, units].filter((e) => e != null).join(". ");
                return { inner, description };
              }
            }
          }
        }
        return {
          inner,
          description: [device, frameRate].filter((e) => e != null).join(". ")
        };
      }
      module.exports = async function(data, { name, comment }) {
        const converted = await getGPSData(data, comment);
        let string = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
    <Document>
        <name>${name}</name>
        <atom:author>
            <atom:name>gopro-telemetry by Juan Irache</atom:name>
        </atom:author>
        <atom:link href="https://github.com/JuanIrache/gopro-telemetry"/>
        <description>${converted.description}</description>
        ${converted.inner.trim()}
    </Document>
</kml>`;
        return string;
      };
    }
  });

  // node_modules/gopro-telemetry/code/presets/toGeojson.js
  var require_toGeojson = __commonJS({
    "node_modules/gopro-telemetry/code/presets/toGeojson.js"(exports, module) {
      var breathe = require_breathe();
      async function getGPSData(data) {
        let properties = {};
        let coordinates = [];
        for (const key in data) {
          if (data[key]["device name"] != null)
            properties.device = data[key]["device name"];
          if (data[key].streams) {
            for (const stream in data[key].streams) {
              await breathe();
              if ((stream === "GPS5" || stream === "GPS9") && data[key].streams[stream].samples && data[key].streams[stream].samples.length) {
                if (data[key].streams[stream].samples[0].sticky && data[key].streams[stream].samples[0].sticky.geoidHeight) {
                  properties.geoidHeight = data[key].streams[stream].samples[0].sticky.geoidHeight;
                }
                properties.AbsoluteUtcMicroSec = [];
                properties.RelativeMicroSec = [];
                for (let i2 = 0; i2 < data[key].streams[stream].samples.length; i2++) {
                  const s = data[key].streams[stream].samples[i2];
                  if (s.value && s.value.length > 1) {
                    coordinates[i2] = [s.value[1], s.value[0]];
                    if (s.value.length > 1) coordinates[i2].push(s.value[2]);
                    if (s.date != null) {
                      if (typeof s.date != "object") s.date = new Date(s.date);
                      properties.AbsoluteUtcMicroSec[i2] = s.date.getTime();
                    }
                    if (s.cts != null) properties.RelativeMicroSec[i2] = s.cts;
                  }
                }
                return { coordinates, properties };
              }
            }
          }
        }
        return { coordinates, properties };
      }
      module.exports = async function(data, { name }) {
        const converted = await getGPSData(data);
        let result = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: converted.coordinates
          },
          properties: { name, ...converted.properties }
        };
        return result;
      };
    }
  });

  // node_modules/gopro-telemetry/code/presets/toCsv.js
  var require_toCsv = __commonJS({
    "node_modules/gopro-telemetry/code/presets/toCsv.js"(exports, module) {
      var deduceHeaders = require_deduceHeaders();
      var breathe = require_breathe();
      async function createCSV(data) {
        let files = {};
        for (const key in data) {
          let device = key;
          if (data[key]["device name"] != null) device = data[key]["device name"];
          if (data[key].streams) {
            for (const stream in data[key].streams) {
              await breathe();
              if (data[key].streams[stream].samples && data[key].streams[stream].samples.length) {
                let rows = [];
                let name = stream;
                if (data[key].streams[stream].name != null)
                  name = data[key].streams[stream].name;
                let units;
                if (data[key].streams[stream].units != null)
                  units = data[key].streams[stream].units;
                const headers = deduceHeaders({ name, units });
                let sticky = {};
                for (let i2 = 0; i2 < data[key].streams[stream].samples.length; i2++) {
                  const s = data[key].streams[stream].samples[i2];
                  if (s.value != null) {
                    if (!Array.isArray(s.value)) s.value = [s.value];
                    if (s.sticky) sticky = { ...sticky, ...s.sticky };
                    if (!rows.length) {
                      let firstRow = [];
                      if (s.cts != null) firstRow.push("cts");
                      if (s.date != null) firstRow.push("date");
                      for (let ii = 0; ii < s.value.length; ii++) {
                        firstRow.push(headers[ii] || ii);
                      }
                      firstRow.push(...Object.keys(sticky));
                      rows.push(
                        firstRow.map((e) => e.toString().replace(/,/g, "|")).join(",")
                      );
                    }
                    let row = [];
                    if (s.cts != null) row.push(s.cts);
                    if (s.date != null) {
                      let processedDate = s.date;
                      if (typeof s.date != "object") processedDate = new Date(s.date);
                      try {
                        row.push(processedDate.toISOString());
                      } catch (e) {
                        row.push(processedDate);
                      }
                      s.date = processedDate;
                    }
                    s.value.forEach((v) => {
                      if (typeof v === "number" || typeof v === "string") row.push(v);
                      else row.push(JSON.stringify(v));
                    });
                    for (const key2 in sticky) row.push(sticky[key2]);
                    rows.push(
                      row.map((e) => e.toString().replace(/,/g, "|")).join(",")
                    );
                  }
                }
                files[`${device}-${stream}`] = rows.join("\n");
              }
            }
          }
        }
        return files;
      }
      module.exports = createCSV;
    }
  });

  // node_modules/gopro-telemetry/code/utils/padStringNumber.js
  var require_padStringNumber = __commonJS({
    "node_modules/gopro-telemetry/code/utils/padStringNumber.js"(exports, module) {
      module.exports = function(val, int, dec) {
        let sign = "+";
        if (val[0] === "-") {
          sign = "-";
          val = val.slice(1);
        }
        let integer = val.match(/^(\d*)/);
        if (int) {
          if (!integer || !integer.length) integer = ["0", "0"];
          let padded = integer[1].padStart(int, "0");
          val = val.replace(/^(\d*)/, padded);
        }
        let decimal = val.match(/\.(\d*)$/);
        if (dec) {
          const missingDot = !decimal || !decimal.length;
          if (missingDot) decimal = ["0", "0"];
          let padded = decimal[1].padEnd(dec, "0");
          if (missingDot) val = `${val}.${padded}`;
          else val = val.replace(/(\d*)$/, padded);
        }
        return sign + val;
      };
    }
  });

  // node_modules/gopro-telemetry/code/utils/bigStr.js
  var require_bigStr = __commonJS({
    "node_modules/gopro-telemetry/code/utils/bigStr.js"(exports, module) {
      module.exports = function(num) {
        if (num != null) {
          let numStr = String(num);
          if (Math.abs(num) < 1) {
            let e = parseInt(num.toString().split("e-")[1]);
            if (e) {
              let negative = num < 0;
              if (negative) num *= -1;
              num *= Math.pow(10, e - 1);
              numStr = "0." + new Array(e).join("0") + num.toString().substring(2);
              if (negative) numStr = "-" + numStr;
            }
          } else {
            let e = parseInt(num.toString().split("+")[1]);
            if (e > 20) {
              e -= 20;
              num /= Math.pow(10, e);
              numStr = num.toString() + new Array(e + 1).join("0");
            }
          }
          return numStr;
        }
        return "";
      };
    }
  });

  // node_modules/gopro-telemetry/code/presets/toMgjson.js
  var require_toMgjson = __commonJS({
    "node_modules/gopro-telemetry/code/presets/toMgjson.js"(exports, module) {
      var deduceHeaders = require_deduceHeaders();
      var padStringNumber = require_padStringNumber();
      var bigStr = require_bigStr();
      var { mgjsonMaxArrs } = require_keys();
      var breathe = require_breathe();
      var largestMGJSONNum = 2147483648;
      async function createDataOutlineChildText(matchName, displayName, value) {
        if (typeof value != "string") value = value.toString();
        return {
          objectType: "dataStatic",
          displayName,
          dataType: {
            type: "string",
            paddedStringProperties: {
              maxLen: value.length,
              maxDigitsInStrLength: value.length.toString().length,
              eventMarkerB: false
            }
          },
          matchName,
          value
        };
      }
      async function createDataOutlineChildNumber(matchName, displayName, value) {
        if (isNaN(value)) value = 0;
        else value = +value;
        const digitsInteger = Math.max(bigStr(Math.floor(value)).length, 0);
        const digitsDecimal = Math.max(
          bigStr(value).replace(/^\d*\.?/, "").length,
          0
        );
        return {
          objectType: "dataStatic",
          displayName,
          dataType: {
            type: "number",
            numberStringProperties: {
              pattern: { isSigned: true, digitsInteger, digitsDecimal },
              range: {
                occuring: { min: value, max: value },
                legal: { min: -largestMGJSONNum, max: largestMGJSONNum }
              }
            }
          },
          matchName,
          value
        };
      }
      async function createDynamicDataOutline(matchName, displayName, units, sample, { inn, out } = {}, part, stream) {
        const type = await getDataOutlineType(
          Array.isArray(sample) ? sample.slice(inn, out) : sample
        );
        let result = {
          objectType: "dataDynamic",
          displayName,
          sampleSetID: matchName,
          dataType: { type },
          //We apply (linear) interpolation to numeric values only
          interpolation: type === "paddedString" ? "hold" : "linear",
          hasExpectedFrequecyB: false,
          //Some values will be set afterwards
          sampleCount: null,
          matchName
        };
        if (type === "numberString") {
          if (units && Array.isArray(sample)) {
            const unitsArr = units.split(",");
            result.displayName += ` [${unitsArr[unitsArr.length - 1]}]`;
          } else if (units) result.displayName += ` [${units}]`;
          if (stream && stream.length)
            result.displayName = stream + ": " + result.displayName;
          if (Array.isArray(sample) && part) {
            result.displayName += ` part ${part + 1}`;
          }
          result.dataType.numberStringProperties = {
            pattern: {
              //Will be calculated later
              digitsInteger: 0,
              digitsDecimal: 0,
              //Will use plus and minus signs always. Seems easier
              isSigned: true
            },
            range: {
              //We use the allowed extremes, will compare to actual data
              occuring: { min: largestMGJSONNum, max: -largestMGJSONNum },
              //Legal values could potentially be modified per stream type (for example, latitude within -+85, longitude -+180... but what's the benefit?)
              legal: { min: -largestMGJSONNum, max: largestMGJSONNum }
            }
          };
        } else if (type === "numberStringArray") {
          const partialName = deduceHeaders(
            { name: displayName, units },
            { inn, out }
          );
          if (partialName != result.displayName) result.displayName = partialName;
          else if (part) result.displayName += ` part ${part + 1}`;
          let deducedHeaders = deduceHeaders({ name: displayName, units });
          if (deducedHeaders.length != sample.length) {
            deducedHeaders = sample.map(
              (s, ii) => deducedHeaders[ii] || deducedHeaders[ii - 1] || deducedHeaders[0] || "undefined"
            );
          }
          deducedHeaders = deducedHeaders.slice(inn, out);
          if (stream && stream.length)
            result.displayName = stream + ": " + result.displayName;
          result.dataType.numberArrayProperties = {
            pattern: {
              isSigned: true,
              digitsInteger: 0,
              digitsDecimal: 0
            },
            //Limited to 3 axes, we split the rest to additional streams
            arraySize: sample.slice(inn, out).length,
            //Set tentative headers for each array. much like the repeatHeaders option
            arrayDisplayNames: deducedHeaders,
            arrayRanges: {
              ranges: sample.map((s) => ({
                occuring: { min: largestMGJSONNum, max: -largestMGJSONNum },
                legal: { min: -largestMGJSONNum, max: largestMGJSONNum }
              })).slice(inn, out)
            }
          };
        } else if (type === "paddedString") {
          if (units) result.displayName += `[${units}]`;
          if (stream && stream.length)
            result.displayName = stream + ": " + result.displayName;
          result.dataType.paddedStringProperties = {
            maxLen: 0,
            maxDigitsInStrLength: 0,
            eventMarkerB: false
          };
        }
        return result;
      }
      async function getDataOutlineType(value) {
        if (typeof value === "number" || Array.isArray(value) && value.length && value.length === 1)
          return "numberString";
        else if (Array.isArray(value) && value.length && typeof value[0] === "number")
          return "numberStringArray";
        else return "paddedString";
      }
      async function convertSamples(data) {
        let dataOutline = [];
        let dataDynamicSamples = [];
        for (const key in data) {
          if (data[key].streams) {
            let device = key;
            if (data[key]["device name"] != null) device = data[key]["device name"];
            dataOutline.push(
              await createDataOutlineChildText(`DEVC${key}`, "Device name", device)
            );
            for (const stream in data[key].streams) {
              await breathe();
              if (data[key].streams[stream].samples && data[key].streams[stream].samples.length) {
                let streamName = stream;
                if (data[key].streams[stream].name != null) {
                  streamName = data[key].streams[stream].name;
                  if (data[key].streams[stream].subStreamName != null) {
                    streamName += " " + data[key].streams[stream].subStreamName;
                  }
                }
                let units;
                if (data[key].streams[stream].units != null)
                  units = data[key].streams[stream].units;
                const getValidValue = async function(arr, key2) {
                  for (const s of arr) if (s[key2] != null) return s[key2];
                };
                let validSample = await getValidValue(
                  data[key].streams[stream].samples,
                  "value"
                );
                let inout;
                if (Array.isArray(validSample))
                  inout = {
                    inn: 0,
                    out: mgjsonMaxArrs[stream.slice(0, 4)] || 3,
                    total: validSample.length
                  };
                for (; ; ) {
                  const part = inout ? inout.inn / (inout.out - inout.inn) : 0;
                  const sampleSetID = `stream${key + "X" + stream + "X" + (part ? part + 1 : "")}`;
                  let sampleSet = {
                    sampleSetID,
                    samples: []
                  };
                  let dataOutlineChild = await createDynamicDataOutline(
                    sampleSetID,
                    streamName,
                    units,
                    validSample,
                    inout,
                    part,
                    stream
                  );
                  const type = await getDataOutlineType(
                    Array.isArray(validSample) ? validSample.slice(inout.inn, inout.out) : validSample
                  );
                  const setMaxMinPadStr = function(val, outline) {
                    outline.dataType.paddedStringProperties.maxLen = Math.max(
                      val.toString().length,
                      outline.dataType.paddedStringProperties.maxLen
                    );
                    outline.dataType.paddedStringProperties.maxDigitsInStrLength = Math.max(
                      val.length.toString().length,
                      outline.dataType.paddedStringProperties.maxDigitsInStrLength
                    );
                  };
                  for (let i2 = 0; i2 < data[key].streams[stream].samples.length; i2++) {
                    const s = data[key].streams[stream].samples[i2];
                    const setMaxMinPadNum = function(val, pattern, range) {
                      range.occuring.min = Math.min(val, range.occuring.min);
                      range.occuring.max = Math.max(val, range.occuring.max);
                      range.legal.min = range.occuring.min;
                      range.legal.max = range.occuring.max;
                      pattern.digitsInteger = Math.max(
                        bigStr(Math.floor(val)).length,
                        pattern.digitsInteger
                      );
                      pattern.digitsDecimal = Math.max(
                        bigStr(val).replace(/^\d*\.?/, "").length,
                        pattern.digitsDecimal
                      );
                    };
                    if (s.value != null) {
                      let sample = { time: new Date(s.cts) };
                      if (type === "numberString") {
                        let singleVal = s.value;
                        if (Array.isArray(s.value)) singleVal = s.value[inout.inn];
                        sample.value = bigStr(singleVal);
                        setMaxMinPadNum(
                          singleVal,
                          dataOutlineChild.dataType.numberStringProperties.pattern,
                          dataOutlineChild.dataType.numberStringProperties.range
                        );
                      } else if (type === "numberStringArray") {
                        sample.value = [];
                        s.value.slice(inout.inn, inout.out).forEach((v, ii) => {
                          sample.value[ii] = bigStr(v);
                          setMaxMinPadNum(
                            v,
                            dataOutlineChild.dataType.numberArrayProperties.pattern,
                            dataOutlineChild.dataType.numberArrayProperties.arrayRanges.ranges[ii]
                          );
                        });
                      } else if (type === "paddedString") {
                        if (stream === "dateStream") {
                          if (s.date != null) {
                            if (typeof s.date != "object") s.date = new Date(s.date);
                            if (!isNaN(s.date)) {
                              s.value = s.date.toISOString();
                            } else {
                              s.value = new Date(s.date).toISOString();
                            }
                          } else s.value = "undefined";
                        }
                        sample.value = {
                          length: s.value.length.toString(),
                          str: s.value
                        };
                        setMaxMinPadStr(s.value, dataOutlineChild);
                      }
                      sampleSet.samples.push(sample);
                    }
                  }
                  for (let i2 = 0; i2 < sampleSet.samples.length; i2++) {
                    const s = sampleSet.samples[i2];
                    if (type === "numberString") {
                      s.value = padStringNumber(
                        s.value,
                        dataOutlineChild.dataType.numberStringProperties.pattern.digitsInteger,
                        dataOutlineChild.dataType.numberStringProperties.pattern.digitsDecimal
                      );
                    } else if (type === "numberStringArray") {
                      s.value = s.value.map(
                        (v) => padStringNumber(
                          v,
                          dataOutlineChild.dataType.numberArrayProperties.pattern.digitsInteger,
                          dataOutlineChild.dataType.numberArrayProperties.pattern.digitsDecimal
                        )
                      );
                    } else if (type === "paddedString") {
                      s.value.str = s.value.str.padEnd(
                        dataOutlineChild.dataType.paddedStringProperties.maxLen,
                        " "
                      );
                      s.value.length = s.value.length.padStart(
                        dataOutlineChild.dataType.paddedStringProperties.maxDigitsInStrLength,
                        "0"
                      );
                    }
                  }
                  dataOutlineChild.sampleCount = sampleSet.samples.length;
                  dataOutline.push(dataOutlineChild);
                  dataDynamicSamples.push(sampleSet);
                  if (inout) {
                    if (inout.out >= inout.total) break;
                    const diff = inout.out - inout.inn;
                    inout.inn = inout.out;
                    inout.out += diff;
                  } else break;
                }
              }
            }
          }
        }
        return { dataOutline, dataDynamicSamples };
      }
      module.exports = async function(data, { name = "" }) {
        if (data["frames/second"] == null)
          throw new Error("After Effects needs frameRate");
        const converted = await convertSamples(data);
        let result = {
          version: "MGJSON2.0.0",
          creator: "https://github.com/JuanIrache/gopro-telemetry",
          dynamicSamplesPresentB: true,
          dynamicDataInfo: {
            useTimecodeB: false,
            utcInfo: {
              precisionLength: 3,
              isGMT: true
            }
          },
          //Create first data point with filename
          dataOutline: [
            await createDataOutlineChildText("filename", "File name", name),
            ...converted.dataOutline
          ],
          //And paste the converted data
          dataDynamicSamples: converted.dataDynamicSamples
        };
        if (data["frames/second"] != null) {
          result.dataOutline.push(
            await createDataOutlineChildNumber(
              "framerate",
              "Frame rate",
              data["frames/second"]
            )
          );
        }
        if (!result.dataDynamicSamples.length) {
          delete result.dataDynamicSamples;
          delete result.dynamicDataInfo;
          result.dynamicSamplesPresentB = false;
        }
        return result;
      };
    }
  });

  // node_modules/gopro-telemetry/code/mergeInterpretedSources.js
  var require_mergeInterpretedSources = __commonJS({
    "node_modules/gopro-telemetry/code/mergeInterpretedSources.js"(exports, module) {
      var breathe = require_breathe();
      module.exports = async (interpretedArr) => {
        const interpreted = interpretedArr[0];
        for (let i2 = 1; i2 < interpretedArr.length; i2++) {
          for (const device in interpretedArr[i2]) {
            if (!interpreted[device]) {
              interpreted[device] = interpretedArr[i2][device];
            } else {
              for (const stream in interpretedArr[i2][device].streams) {
                if (interpretedArr[i2][device].streams[stream]) {
                  await breathe();
                  if (!interpreted[device].streams[stream]) {
                    interpreted[device].streams[stream] = interpretedArr[i2][device].streams[stream];
                  } else if (interpretedArr[i2][device].streams[stream].samples) {
                    if (!interpreted[device].streams[stream].samples) {
                      interpreted[device].streams[stream].samples = [];
                    }
                    interpretedArr[i2][device].streams[stream].samples.forEach((s) => {
                      interpreted[device].streams[stream].samples.push(s);
                    });
                  }
                }
              }
            }
          }
        }
        return interpreted;
      };
    }
  });

  // node_modules/gopro-telemetry/code/utils/getOffset.js
  var require_getOffset = __commonJS({
    "node_modules/gopro-telemetry/code/utils/getOffset.js"(exports, module) {
      module.exports = ({ interpretedArr, i: i2, opts, timing }) => {
        let reachedTime = 0;
        let dev = Object.keys(interpretedArr[i2 - 1])[0];
        if (dev && interpretedArr[i2 - 1][dev].streams) {
          const streams = Object.keys(interpretedArr[i2 - 1][dev].streams);
          for (const stream of streams) {
            const samples = interpretedArr[i2 - 1][dev].streams[stream].samples;
            if (samples && samples.length) {
              const thisCts = samples[samples.length - 1].cts;
              reachedTime = Math.max(thisCts + 1, reachedTime);
            }
          }
        }
        let prevDuration = timing.slice(0, i2).reduce((acc, t) => acc + (1e3 * t.videoDuration || 0), 0);
        prevDuration = Math.max(reachedTime, prevDuration);
        if (opts.removeGaps) return prevDuration;
        else {
          const dateDiff = timing[i2].start - timing[0].start;
          return Math.max(dateDiff, prevDuration);
        }
      };
    }
  });

  // node_modules/gopro-telemetry/code/utils/findFirstTimes.js
  var require_findFirstTimes = __commonJS({
    "node_modules/gopro-telemetry/code/utils/findFirstTimes.js"(exports, module) {
      var readUInt8;
      var readUInt16BE;
      var readInt32BE;
      var readInt64BEasFloat;
      if (DataView) {
        readUInt8 = (buffer) => new DataView(buffer.buffer).getUint8(0);
        readUInt16BE = (buffer) => new DataView(buffer.buffer).getUint16(0);
        readInt32BE = (buffer) => new DataView(buffer.buffer).getInt32(0);
        readInt64BEasFloat = (buffer, offset) => Number(new DataView(buffer.buffer).getFloat64(offset));
      } else if (typeof Buffer !== "undefined" && ["readUInt8", "readUInt16BE", "readInt32BE", "readDoubleBE"].every(
        (fn) => Buffer.prototype[fn]
      )) {
        readUInt8 = (buffer) => buffer.readUInt8(0);
        readUInt16BE = (buffer) => buffer.readUInt16BE(0);
        readInt32BE = (buffer) => buffer.readInt32BE(0);
        readInt64BEasFloat = (buffer, offset) => buffer.readDoubleBE(offset);
      } else {
        throw new Error(
          "Please install a compatible `Buffer` or `DataView` polyfill"
        );
      }
      module.exports = (data, forceGPSSrc) => {
        let GPSU;
        let GPS9Time;
        let STMP;
        const checkGPS9 = forceGPSSrc !== "GPS5";
        const checkGPS5 = forceGPSSrc !== "GPS9";
        for (let i2 = 0; i2 < 1e5 && i2 + 4 < (data || []).length; i2 += 4) {
          if (checkGPS5 && "G" === String.fromCharCode(data[i2 + 0]) && "P" === String.fromCharCode(data[i2 + 1]) && "S" === String.fromCharCode(data[i2 + 2]) && "U" === String.fromCharCode(data[i2 + 3])) {
            const sizeIdx = i2 + 5;
            const repeatIdx = i2 + 6;
            const valIdx = i2 + 8;
            const size = readUInt8(data.slice(sizeIdx, sizeIdx + 1));
            const repeat = readUInt16BE(data.slice(repeatIdx, repeatIdx + 2));
            const value = data.slice(valIdx, valIdx + size * repeat);
            GPSU = +value.map((i3) => String.fromCharCode(i3)).join("");
          } else if (checkGPS9 && "G" === String.fromCharCode(data[i2 + 0]) && "P" === String.fromCharCode(data[i2 + 1]) && "S" === String.fromCharCode(data[i2 + 2]) && "9" === String.fromCharCode(data[i2 + 3])) {
            const valIdx = i2 + 8;
            const daysValue = data.slice(valIdx + 20, valIdx + 24);
            const secondsValue = data.slice(valIdx + 24, valIdx + 28);
            const days = readInt32BE(daysValue);
            const seconds = readInt32BE(secondsValue) / 1e3;
            GPS9Time = seconds + days * 86400;
          } else if ("S" === String.fromCharCode(data[i2 + 0]) && "T" === String.fromCharCode(data[i2 + 1]) && "M" === String.fromCharCode(data[i2 + 2]) && "P" === String.fromCharCode(data[i2 + 3])) {
            STMP = readInt64BEasFloat(data, i2 + 8);
          }
          if ((GPS9Time != null || !checkGPS9) && (GPSU != null || !checkGPS5) && STMP != null)
            break;
        }
        return { GPSU, STMP, GPS9Time };
      };
    }
  });

  // node_modules/gopro-telemetry/index.js
  var require_gopro_telemetry = __commonJS({
    "node_modules/gopro-telemetry/index.js"(exports, module) {
      var parseKLV = require_parseKLV();
      var groupDevices = require_groupDevices();
      var deviceList = require_deviceList();
      var streamList = require_streamList();
      var keys = require_keys();
      var timeKLV = require_timeKLV();
      var interpretKLV = require_interpretKLV();
      var mergeStream = require_mergeStream();
      var groupTimes = require_groupTimes();
      var smoothSamples = require_smoothSamples();
      var decimalPlaces = require_decimalPlaces();
      var processGPS = require_processGPS();
      var filterWrongSpeed = require_filterWrongSpeed();
      var presetsOpts = require_presetsOptions();
      var toGpx = require_toGpx();
      var toVirb = require_toVirb();
      var toKml = require_toKml();
      var toGeojson = require_toGeojson();
      var toCsv = require_toCsv();
      var toMgjson = require_toMgjson();
      var mergeInterpretedSources = require_mergeInterpretedSources();
      var breathe = require_breathe();
      var getOffset = require_getOffset();
      var findFirstTimes = require_findFirstTimes();
      async function parseOne({ rawData, parsedData }, opts, gpsTimeSrc) {
        if (parsedData) return parsedData;
        await breathe();
        const parsed = await parseKLV(rawData, opts, { gpsTimeSrc });
        if (!parsed.DEVC) {
          const error = new Error(
            "Invalid GPMF data. Root object must contain DEVC key"
          );
          if (opts.tolerant) {
            await breathe();
            console.error(error);
            return parsed;
          } else throw error;
        }
        return parsed;
      }
      async function interpretOne({ timing, parsed, opts, timeMeta, gpsTimeSrc }) {
        const grouped = await groupDevices(parsed);
        await breathe();
        if (!opts.ellipsoid || opts.geoidHeight || opts.GPSPrecision != null || opts.GPSFix != null) {
          for (const key in grouped)
            grouped[key] = await processGPS(grouped[key], opts, gpsTimeSrc);
        }
        let interpreted = {};
        for (const key in grouped) {
          await breathe();
          interpreted[key] = await interpretKLV(grouped[key], opts);
        }
        let timed = {};
        for (const key in interpreted) {
          await breathe();
          timed[key] = await timeKLV(interpreted[key], {
            timing,
            opts,
            timeMeta,
            gpsTimeSrc
          });
        }
        let merged = {};
        for (const key in timed) {
          await breathe();
          merged[key] = await mergeStream(timed[key], opts);
        }
        if (opts.WrongSpeed != null) {
          for (const key in merged) {
            if (merged[key].streams.GPS5) {
              merged[key].streams.GPS5.samples = filterWrongSpeed(
                merged[key].streams.GPS5.samples,
                opts.WrongSpeed
              );
            }
            if (merged[key].streams.GPS9) {
              merged[key].streams.GPS9.samples = filterWrongSpeed(
                merged[key].streams.GPS9.samples,
                opts.WrongSpeed
              );
            }
          }
        }
        return merged;
      }
      function progress(options, amount) {
        if (options.progress) options.progress(amount);
      }
      async function process(input, opts) {
        await breathe();
        if (presetsOpts[opts.preset]) {
          opts = {
            ...opts,
            ...presetsOpts.general.mandatory,
            ...presetsOpts[opts.preset].mandatory
          };
          for (const key in presetsOpts.general.preferred)
            if (opts[key] == null) opts[key] = presetsOpts.general.preferred[key];
          for (const key in presetsOpts[opts.preset].preferred)
            if (opts[key] == null)
              opts[key] = presetsOpts[opts.preset].preferred[key];
        }
        if (opts.device && !Array.isArray(opts.device)) opts.device = [opts.device];
        if (opts.stream && !Array.isArray(opts.stream)) opts.stream = [opts.stream];
        if (opts.GPSFix == null && opts.GPS5Fix != null) opts.GPSFix = opts.GPS5Fix;
        if (opts.GPSPrecision == null && opts.GPS5Precision != null) {
          opts.GPSPrecision = opts.GPS5Precision;
        }
        const userGPSChoices = ["GPS9", "GPS5"].filter(
          (k) => (opts.stream || []).includes(k)
        );
        const forceGPSSrc = userGPSChoices.length === 1 ? userGPSChoices[0] : null;
        if (!Array.isArray(input)) input = [input];
        const firstTimes = input.map((i2) => findFirstTimes(i2.rawData, forceGPSSrc));
        let bestGPSTimeSrc;
        if (firstTimes.every((t) => t.GPS9Time)) bestGPSTimeSrc = "GPS9";
        else if (firstTimes.every((t) => t.GPSU)) bestGPSTimeSrc = "GPS5";
        else if (firstTimes.some((t) => t.GPS9Time)) bestGPSTimeSrc = "GPS9";
        else {
          if (opts.timeIn === "GPS") delete opts.timeIn;
          bestGPSTimeSrc = "GPS5";
        }
        if ((opts.stream || []).includes("GPS")) {
          opts.stream = opts.stream.map((s) => s === "GPS" ? bestGPSTimeSrc : s);
        }
        let interpreted;
        let timing;
        progress(opts, 0.01);
        if (input.length === 1) input = input[0];
        if (!Array.isArray(input)) {
          if (input.timing) {
            timing = JSON.parse(JSON.stringify(input.timing));
            timing.start = new Date(timing.start);
          }
          await breathe();
          const gpsTimeSrc = bestGPSTimeSrc;
          const parsed = await parseOne(input, opts, gpsTimeSrc);
          progress(opts, 0.2);
          await breathe();
          if (opts.deviceList) return deviceList(parsed);
          if (opts.streamList) return streamList(parsed);
          if (opts.raw) return parsed;
          await breathe();
          interpreted = await interpretOne({ timing, parsed, opts, gpsTimeSrc });
          progress(opts, 0.4);
        } else {
          if (input.some((i2) => !i2.timing))
            throw new Error(
              "per-source timing is necessary in order to merge sources"
            );
          if (input.every(
            (i2) => i2.timing.start.getTime() === input[0].timing.start.getTime()
          )) {
            input.sort((a, b) => {
              const foundA = firstTimes[input.indexOf(a)];
              const foundB = firstTimes[input.indexOf(b)];
              if (foundA.GPS9Time && foundB.GPS9Time) {
                return foundA.GPS9Time - foundB.GPS9Time;
              }
              if (foundA.GPSU && foundB.GPSU) return foundA.GPSU - foundB.GPSU;
              if (foundA.STMP != null && foundB.STMP != null) {
                return foundA.STMP - foundB.STMP;
              }
              return 0;
            });
          }
          timing = input.map((i2) => JSON.parse(JSON.stringify(i2.timing)));
          timing = timing.map((t) => ({ ...t, start: new Date(t.start) }));
          const getGPSTimeSrc = (i2) => firstTimes[i2][bestGPSTimeSrc] ? bestGPSTimeSrc : firstTimes[i2].GPS9Time ? "GPS9" : "GPS5";
          const parsed = [];
          for (let i2 = 0; i2 < input.length; i2++) {
            const oneParsed = await parseOne(input[i2], opts, getGPSTimeSrc(i2));
            parsed.push(oneParsed);
          }
          progress(opts, 0.2);
          await breathe();
          if (opts.deviceList) return parsed.map((p) => deviceList(p));
          if (opts.streamList) return parsed.map((p) => streamList(p));
          if (opts.raw) return parsed;
          const interpretedArr = [];
          let gpsDate, mp4Date;
          for (let i2 = 0; i2 < parsed.length; i2++) {
            const p = parsed[i2];
            await breathe();
            let interpreted2;
            let offset = 0;
            if (i2 > 0) {
              offset = getOffset({ interpretedArr, i: i2, opts, timing });
            }
            const timeMeta = { gpsDate, mp4Date, offset };
            interpreted2 = await interpretOne({
              timing: timing[i2],
              parsed: p,
              opts,
              timeMeta,
              gpsTimeSrc: getGPSTimeSrc(i2)
            });
            if (!gpsDate && timeMeta.gpsDate) {
              gpsDate = timeMeta.gpsDate;
            }
            if (!mp4Date && timeMeta.mp4Date) {
              mp4Date = timeMeta.mp4Date;
            }
            interpretedArr.push(interpreted2);
          }
          progress(opts, 0.3);
          await breathe();
          interpreted = await mergeInterpretedSources(interpretedArr);
          progress(opts, 0.4);
          timing = timing[0];
        }
        await breathe();
        if (opts.stream && opts.stream.length) {
          for (const dev in interpreted) {
            for (const stream in interpreted[dev].streams) {
              if (!opts.stream.includes(stream) && !keys.computedStreams.includes(stream)) {
                delete interpreted[dev].streams[stream];
              }
            }
          }
        }
        if (opts.groupTimes === "frames") {
          if (timing && timing.frameDuration) {
            opts.groupTimes = timing.frameDuration * 1e3;
          } else throw new Error("Frame rate is needed for your current options");
        }
        await breathe();
        if (opts.smooth) interpreted = await smoothSamples(interpreted, opts);
        progress(opts, 0.6);
        await breathe();
        if (opts.decimalPlaces) interpreted = await decimalPlaces(interpreted, opts);
        if (opts.groupTimes) interpreted = await groupTimes(interpreted, opts);
        if (timing && timing.frameDuration != null)
          interpreted["frames/second"] = 1 / timing.frameDuration;
        progress(opts, 0.9);
        await breathe();
        if (opts.preset === "gpx") return await toGpx(interpreted, opts);
        if (opts.preset === "virb") return await toVirb(interpreted, opts);
        if (opts.preset === "kml") return await toKml(interpreted, opts);
        if (opts.preset === "geojson") return await toGeojson(interpreted, opts);
        if (opts.preset === "csv") return await toCsv(interpreted);
        if (opts.preset === "mgjson") return await toMgjson(interpreted, opts);
        progress(opts, 1);
        return interpreted;
      }
      async function GoProTelemetry(input, options = {}, callback) {
        const result = await process(input, options);
        if (!callback) return result;
        callback(result);
      }
      module.exports = GoProTelemetry;
      exports = module.exports;
      exports.GoProTelemetry = GoProTelemetry;
      exports.goProTelemetry = GoProTelemetry;
    }
  });

  // node_modules/mp4box/dist/mp4box.all.js
  var require_mp4box_all = __commonJS({
    "node_modules/mp4box/dist/mp4box.all.js"(exports) {
      var Log = /* @__PURE__ */ (function() {
        var start = /* @__PURE__ */ new Date();
        var LOG_LEVEL_ERROR = 4;
        var LOG_LEVEL_WARNING = 3;
        var LOG_LEVEL_INFO = 2;
        var LOG_LEVEL_DEBUG = 1;
        var log_level = LOG_LEVEL_ERROR;
        var logObject = {
          setLogLevel: function(level) {
            if (level == this.debug) log_level = LOG_LEVEL_DEBUG;
            else if (level == this.info) log_level = LOG_LEVEL_INFO;
            else if (level == this.warn) log_level = LOG_LEVEL_WARNING;
            else if (level == this.error) log_level = LOG_LEVEL_ERROR;
            else log_level = LOG_LEVEL_ERROR;
          },
          debug: function(module2, msg) {
            if (console.debug === void 0) {
              console.debug = console.log;
            }
            if (LOG_LEVEL_DEBUG >= log_level) {
              console.debug("[" + Log.getDurationString(/* @__PURE__ */ new Date() - start, 1e3) + "]", "[" + module2 + "]", msg);
            }
          },
          log: function(module2, msg) {
            this.debug(module2.msg);
          },
          info: function(module2, msg) {
            if (LOG_LEVEL_INFO >= log_level) {
              console.info("[" + Log.getDurationString(/* @__PURE__ */ new Date() - start, 1e3) + "]", "[" + module2 + "]", msg);
            }
          },
          warn: function(module2, msg) {
            if (LOG_LEVEL_WARNING >= log_level) {
              console.warn("[" + Log.getDurationString(/* @__PURE__ */ new Date() - start, 1e3) + "]", "[" + module2 + "]", msg);
            }
          },
          error: function(module2, msg) {
            if (LOG_LEVEL_ERROR >= log_level) {
              console.error("[" + Log.getDurationString(/* @__PURE__ */ new Date() - start, 1e3) + "]", "[" + module2 + "]", msg);
            }
          }
        };
        return logObject;
      })();
      Log.getDurationString = function(duration, _timescale) {
        var neg;
        function pad(number, length) {
          var str = "" + number;
          var a = str.split(".");
          while (a[0].length < length) {
            a[0] = "0" + a[0];
          }
          return a.join(".");
        }
        if (duration < 0) {
          neg = true;
          duration = -duration;
        } else {
          neg = false;
        }
        var timescale = _timescale || 1;
        var duration_sec = duration / timescale;
        var hours = Math.floor(duration_sec / 3600);
        duration_sec -= hours * 3600;
        var minutes = Math.floor(duration_sec / 60);
        duration_sec -= minutes * 60;
        var msec = duration_sec * 1e3;
        duration_sec = Math.floor(duration_sec);
        msec -= duration_sec * 1e3;
        msec = Math.floor(msec);
        return (neg ? "-" : "") + hours + ":" + pad(minutes, 2) + ":" + pad(duration_sec, 2) + "." + pad(msec, 3);
      };
      Log.printRanges = function(ranges) {
        var length = ranges.length;
        if (length > 0) {
          var str = "";
          for (var i2 = 0; i2 < length; i2++) {
            if (i2 > 0) str += ",";
            str += "[" + Log.getDurationString(ranges.start(i2)) + "," + Log.getDurationString(ranges.end(i2)) + "]";
          }
          return str;
        } else {
          return "(empty)";
        }
      };
      if (typeof exports !== "undefined") {
        exports.Log = Log;
      }
      var MP4BoxStream = function(arrayBuffer) {
        if (arrayBuffer instanceof ArrayBuffer) {
          this.buffer = arrayBuffer;
          this.dataview = new DataView(arrayBuffer);
        } else {
          throw "Needs an array buffer";
        }
        this.position = 0;
      };
      MP4BoxStream.prototype.getPosition = function() {
        return this.position;
      };
      MP4BoxStream.prototype.getEndPosition = function() {
        return this.buffer.byteLength;
      };
      MP4BoxStream.prototype.getLength = function() {
        return this.buffer.byteLength;
      };
      MP4BoxStream.prototype.seek = function(pos) {
        var npos = Math.max(0, Math.min(this.buffer.byteLength, pos));
        this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos;
        return true;
      };
      MP4BoxStream.prototype.isEos = function() {
        return this.getPosition() >= this.getEndPosition();
      };
      MP4BoxStream.prototype.readAnyInt = function(size, signed) {
        var res = 0;
        if (this.position + size <= this.buffer.byteLength) {
          switch (size) {
            case 1:
              if (signed) {
                res = this.dataview.getInt8(this.position);
              } else {
                res = this.dataview.getUint8(this.position);
              }
              break;
            case 2:
              if (signed) {
                res = this.dataview.getInt16(this.position);
              } else {
                res = this.dataview.getUint16(this.position);
              }
              break;
            case 3:
              if (signed) {
                throw "No method for reading signed 24 bits values";
              } else {
                res = this.dataview.getUint8(this.position) << 16;
                res |= this.dataview.getUint8(this.position + 1) << 8;
                res |= this.dataview.getUint8(this.position + 2);
              }
              break;
            case 4:
              if (signed) {
                res = this.dataview.getInt32(this.position);
              } else {
                res = this.dataview.getUint32(this.position);
              }
              break;
            case 8:
              if (signed) {
                throw "No method for reading signed 64 bits values";
              } else {
                res = this.dataview.getUint32(this.position) << 32;
                res |= this.dataview.getUint32(this.position + 4);
              }
              break;
            default:
              throw "readInt method not implemented for size: " + size;
          }
          this.position += size;
          return res;
        } else {
          throw "Not enough bytes in buffer";
        }
      };
      MP4BoxStream.prototype.readUint8 = function() {
        return this.readAnyInt(1, false);
      };
      MP4BoxStream.prototype.readUint16 = function() {
        return this.readAnyInt(2, false);
      };
      MP4BoxStream.prototype.readUint24 = function() {
        return this.readAnyInt(3, false);
      };
      MP4BoxStream.prototype.readUint32 = function() {
        return this.readAnyInt(4, false);
      };
      MP4BoxStream.prototype.readUint64 = function() {
        return this.readAnyInt(8, false);
      };
      MP4BoxStream.prototype.readString = function(length) {
        if (this.position + length <= this.buffer.byteLength) {
          var s = "";
          for (var i2 = 0; i2 < length; i2++) {
            s += String.fromCharCode(this.readUint8());
          }
          return s;
        } else {
          throw "Not enough bytes in buffer";
        }
      };
      MP4BoxStream.prototype.readCString = function() {
        var arr = [];
        while (true) {
          var b = this.readUint8();
          if (b !== 0) {
            arr.push(b);
          } else {
            break;
          }
        }
        return String.fromCharCode.apply(null, arr);
      };
      MP4BoxStream.prototype.readInt8 = function() {
        return this.readAnyInt(1, true);
      };
      MP4BoxStream.prototype.readInt16 = function() {
        return this.readAnyInt(2, true);
      };
      MP4BoxStream.prototype.readInt32 = function() {
        return this.readAnyInt(4, true);
      };
      MP4BoxStream.prototype.readInt64 = function() {
        return this.readAnyInt(8, false);
      };
      MP4BoxStream.prototype.readUint8Array = function(length) {
        var arr = new Uint8Array(length);
        for (var i2 = 0; i2 < length; i2++) {
          arr[i2] = this.readUint8();
        }
        return arr;
      };
      MP4BoxStream.prototype.readInt16Array = function(length) {
        var arr = new Int16Array(length);
        for (var i2 = 0; i2 < length; i2++) {
          arr[i2] = this.readInt16();
        }
        return arr;
      };
      MP4BoxStream.prototype.readUint16Array = function(length) {
        var arr = new Int16Array(length);
        for (var i2 = 0; i2 < length; i2++) {
          arr[i2] = this.readUint16();
        }
        return arr;
      };
      MP4BoxStream.prototype.readUint32Array = function(length) {
        var arr = new Uint32Array(length);
        for (var i2 = 0; i2 < length; i2++) {
          arr[i2] = this.readUint32();
        }
        return arr;
      };
      MP4BoxStream.prototype.readInt32Array = function(length) {
        var arr = new Int32Array(length);
        for (var i2 = 0; i2 < length; i2++) {
          arr[i2] = this.readInt32();
        }
        return arr;
      };
      if (typeof exports !== "undefined") {
        exports.MP4BoxStream = MP4BoxStream;
      }
      var DataStream = function(arrayBuffer, byteOffset, endianness) {
        this._byteOffset = byteOffset || 0;
        if (arrayBuffer instanceof ArrayBuffer) {
          this.buffer = arrayBuffer;
        } else if (typeof arrayBuffer == "object") {
          this.dataView = arrayBuffer;
          if (byteOffset) {
            this._byteOffset += byteOffset;
          }
        } else {
          this.buffer = new ArrayBuffer(arrayBuffer || 0);
        }
        this.position = 0;
        this.endianness = endianness == null ? DataStream.LITTLE_ENDIAN : endianness;
      };
      DataStream.prototype = {};
      DataStream.prototype.getPosition = function() {
        return this.position;
      };
      DataStream.prototype._realloc = function(extra) {
        if (!this._dynamicSize) {
          return;
        }
        var req = this._byteOffset + this.position + extra;
        var blen = this._buffer.byteLength;
        if (req <= blen) {
          if (req > this._byteLength) {
            this._byteLength = req;
          }
          return;
        }
        if (blen < 1) {
          blen = 1;
        }
        while (req > blen) {
          blen *= 2;
        }
        var buf = new ArrayBuffer(blen);
        var src = new Uint8Array(this._buffer);
        var dst = new Uint8Array(buf, 0, src.length);
        dst.set(src);
        this.buffer = buf;
        this._byteLength = req;
      };
      DataStream.prototype._trimAlloc = function() {
        if (this._byteLength == this._buffer.byteLength) {
          return;
        }
        var buf = new ArrayBuffer(this._byteLength);
        var dst = new Uint8Array(buf);
        var src = new Uint8Array(this._buffer, 0, dst.length);
        dst.set(src);
        this.buffer = buf;
      };
      DataStream.BIG_ENDIAN = false;
      DataStream.LITTLE_ENDIAN = true;
      DataStream.prototype._byteLength = 0;
      Object.defineProperty(
        DataStream.prototype,
        "byteLength",
        { get: function() {
          return this._byteLength - this._byteOffset;
        } }
      );
      Object.defineProperty(
        DataStream.prototype,
        "buffer",
        {
          get: function() {
            this._trimAlloc();
            return this._buffer;
          },
          set: function(v) {
            this._buffer = v;
            this._dataView = new DataView(this._buffer, this._byteOffset);
            this._byteLength = this._buffer.byteLength;
          }
        }
      );
      Object.defineProperty(
        DataStream.prototype,
        "byteOffset",
        {
          get: function() {
            return this._byteOffset;
          },
          set: function(v) {
            this._byteOffset = v;
            this._dataView = new DataView(this._buffer, this._byteOffset);
            this._byteLength = this._buffer.byteLength;
          }
        }
      );
      Object.defineProperty(
        DataStream.prototype,
        "dataView",
        {
          get: function() {
            return this._dataView;
          },
          set: function(v) {
            this._byteOffset = v.byteOffset;
            this._buffer = v.buffer;
            this._dataView = new DataView(this._buffer, this._byteOffset);
            this._byteLength = this._byteOffset + v.byteLength;
          }
        }
      );
      DataStream.prototype.seek = function(pos) {
        var npos = Math.max(0, Math.min(this.byteLength, pos));
        this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos;
      };
      DataStream.prototype.isEof = function() {
        return this.position >= this._byteLength;
      };
      DataStream.prototype.mapUint8Array = function(length) {
        this._realloc(length * 1);
        var arr = new Uint8Array(this._buffer, this.byteOffset + this.position, length);
        this.position += length * 1;
        return arr;
      };
      DataStream.prototype.readInt32Array = function(length, e) {
        length = length == null ? this.byteLength - this.position / 4 : length;
        var arr = new Int32Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readInt16Array = function(length, e) {
        length = length == null ? this.byteLength - this.position / 2 : length;
        var arr = new Int16Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readInt8Array = function(length) {
        length = length == null ? this.byteLength - this.position : length;
        var arr = new Int8Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readUint32Array = function(length, e) {
        length = length == null ? this.byteLength - this.position / 4 : length;
        var arr = new Uint32Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readUint16Array = function(length, e) {
        length = length == null ? this.byteLength - this.position / 2 : length;
        var arr = new Uint16Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readUint8Array = function(length) {
        length = length == null ? this.byteLength - this.position : length;
        var arr = new Uint8Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readFloat64Array = function(length, e) {
        length = length == null ? this.byteLength - this.position / 8 : length;
        var arr = new Float64Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readFloat32Array = function(length, e) {
        length = length == null ? this.byteLength - this.position / 4 : length;
        var arr = new Float32Array(length);
        DataStream.memcpy(
          arr.buffer,
          0,
          this.buffer,
          this.byteOffset + this.position,
          length * arr.BYTES_PER_ELEMENT
        );
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += arr.byteLength;
        return arr;
      };
      DataStream.prototype.readInt32 = function(e) {
        var v = this._dataView.getInt32(this.position, e == null ? this.endianness : e);
        this.position += 4;
        return v;
      };
      DataStream.prototype.readInt16 = function(e) {
        var v = this._dataView.getInt16(this.position, e == null ? this.endianness : e);
        this.position += 2;
        return v;
      };
      DataStream.prototype.readInt8 = function() {
        var v = this._dataView.getInt8(this.position);
        this.position += 1;
        return v;
      };
      DataStream.prototype.readUint32 = function(e) {
        var v = this._dataView.getUint32(this.position, e == null ? this.endianness : e);
        this.position += 4;
        return v;
      };
      DataStream.prototype.readUint16 = function(e) {
        var v = this._dataView.getUint16(this.position, e == null ? this.endianness : e);
        this.position += 2;
        return v;
      };
      DataStream.prototype.readUint8 = function() {
        var v = this._dataView.getUint8(this.position);
        this.position += 1;
        return v;
      };
      DataStream.prototype.readFloat32 = function(e) {
        var v = this._dataView.getFloat32(this.position, e == null ? this.endianness : e);
        this.position += 4;
        return v;
      };
      DataStream.prototype.readFloat64 = function(e) {
        var v = this._dataView.getFloat64(this.position, e == null ? this.endianness : e);
        this.position += 8;
        return v;
      };
      DataStream.endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;
      DataStream.memcpy = function(dst, dstOffset, src, srcOffset, byteLength) {
        var dstU8 = new Uint8Array(dst, dstOffset, byteLength);
        var srcU8 = new Uint8Array(src, srcOffset, byteLength);
        dstU8.set(srcU8);
      };
      DataStream.arrayToNative = function(array, arrayIsLittleEndian) {
        if (arrayIsLittleEndian == this.endianness) {
          return array;
        } else {
          return this.flipArrayEndianness(array);
        }
      };
      DataStream.nativeToEndian = function(array, littleEndian) {
        if (this.endianness == littleEndian) {
          return array;
        } else {
          return this.flipArrayEndianness(array);
        }
      };
      DataStream.flipArrayEndianness = function(array) {
        var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        for (var i2 = 0; i2 < array.byteLength; i2 += array.BYTES_PER_ELEMENT) {
          for (var j = i2 + array.BYTES_PER_ELEMENT - 1, k = i2; j > k; j--, k++) {
            var tmp = u8[k];
            u8[k] = u8[j];
            u8[j] = tmp;
          }
        }
        return array;
      };
      DataStream.prototype.failurePosition = 0;
      String.fromCharCodeUint8 = function(uint8arr) {
        var arr = [];
        for (var i2 = 0; i2 < uint8arr.length; i2++) {
          arr[i2] = uint8arr[i2];
        }
        return String.fromCharCode.apply(null, arr);
      };
      DataStream.prototype.readString = function(length, encoding) {
        if (encoding == null || encoding == "ASCII") {
          return String.fromCharCodeUint8.apply(null, [this.mapUint8Array(length == null ? this.byteLength - this.position : length)]);
        } else {
          return new TextDecoder(encoding).decode(this.mapUint8Array(length));
        }
      };
      DataStream.prototype.readCString = function(length) {
        var blen = this.byteLength - this.position;
        var u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
        var len = blen;
        if (length != null) {
          len = Math.min(length, blen);
        }
        for (var i2 = 0; i2 < len && u8[i2] !== 0; i2++) ;
        var s = String.fromCharCodeUint8.apply(null, [this.mapUint8Array(i2)]);
        if (length != null) {
          this.position += len - i2;
        } else if (i2 != blen) {
          this.position += 1;
        }
        return s;
      };
      var MAX_SIZE = Math.pow(2, 32);
      DataStream.prototype.readInt64 = function() {
        return this.readInt32() * MAX_SIZE + this.readUint32();
      };
      DataStream.prototype.readUint64 = function() {
        return this.readUint32() * MAX_SIZE + this.readUint32();
      };
      DataStream.prototype.readInt64 = function() {
        return this.readUint32() * MAX_SIZE + this.readUint32();
      };
      DataStream.prototype.readUint24 = function() {
        return (this.readUint8() << 16) + (this.readUint8() << 8) + this.readUint8();
      };
      if (typeof exports !== "undefined") {
        exports.DataStream = DataStream;
      }
      DataStream.prototype.save = function(filename) {
        var blob = new Blob([this.buffer]);
        if (window.URL && URL.createObjectURL) {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("href", url);
          a.setAttribute("download", filename);
          a.setAttribute("target", "_self");
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          throw "DataStream.save: Can't create object URL.";
        }
      };
      DataStream.prototype._dynamicSize = true;
      Object.defineProperty(
        DataStream.prototype,
        "dynamicSize",
        {
          get: function() {
            return this._dynamicSize;
          },
          set: function(v) {
            if (!v) {
              this._trimAlloc();
            }
            this._dynamicSize = v;
          }
        }
      );
      DataStream.prototype.shift = function(offset) {
        var buf = new ArrayBuffer(this._byteLength - offset);
        var dst = new Uint8Array(buf);
        var src = new Uint8Array(this._buffer, offset, dst.length);
        dst.set(src);
        this.buffer = buf;
        this.position -= offset;
      };
      DataStream.prototype.writeInt32Array = function(arr, e) {
        this._realloc(arr.length * 4);
        if (arr instanceof Int32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapInt32Array(arr.length, e);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeInt32(arr[i2], e);
          }
        }
      };
      DataStream.prototype.writeInt16Array = function(arr, e) {
        this._realloc(arr.length * 2);
        if (arr instanceof Int16Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapInt16Array(arr.length, e);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeInt16(arr[i2], e);
          }
        }
      };
      DataStream.prototype.writeInt8Array = function(arr) {
        this._realloc(arr.length * 1);
        if (arr instanceof Int8Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapInt8Array(arr.length);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeInt8(arr[i2]);
          }
        }
      };
      DataStream.prototype.writeUint32Array = function(arr, e) {
        this._realloc(arr.length * 4);
        if (arr instanceof Uint32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapUint32Array(arr.length, e);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeUint32(arr[i2], e);
          }
        }
      };
      DataStream.prototype.writeUint16Array = function(arr, e) {
        this._realloc(arr.length * 2);
        if (arr instanceof Uint16Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapUint16Array(arr.length, e);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeUint16(arr[i2], e);
          }
        }
      };
      DataStream.prototype.writeUint8Array = function(arr) {
        this._realloc(arr.length * 1);
        if (arr instanceof Uint8Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapUint8Array(arr.length);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeUint8(arr[i2]);
          }
        }
      };
      DataStream.prototype.writeFloat64Array = function(arr, e) {
        this._realloc(arr.length * 8);
        if (arr instanceof Float64Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapFloat64Array(arr.length, e);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeFloat64(arr[i2], e);
          }
        }
      };
      DataStream.prototype.writeFloat32Array = function(arr, e) {
        this._realloc(arr.length * 4);
        if (arr instanceof Float32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
          DataStream.memcpy(
            this._buffer,
            this.byteOffset + this.position,
            arr.buffer,
            0,
            arr.byteLength
          );
          this.mapFloat32Array(arr.length, e);
        } else {
          for (var i2 = 0; i2 < arr.length; i2++) {
            this.writeFloat32(arr[i2], e);
          }
        }
      };
      DataStream.prototype.writeInt32 = function(v, e) {
        this._realloc(4);
        this._dataView.setInt32(this.position, v, e == null ? this.endianness : e);
        this.position += 4;
      };
      DataStream.prototype.writeInt16 = function(v, e) {
        this._realloc(2);
        this._dataView.setInt16(this.position, v, e == null ? this.endianness : e);
        this.position += 2;
      };
      DataStream.prototype.writeInt8 = function(v) {
        this._realloc(1);
        this._dataView.setInt8(this.position, v);
        this.position += 1;
      };
      DataStream.prototype.writeUint32 = function(v, e) {
        this._realloc(4);
        this._dataView.setUint32(this.position, v, e == null ? this.endianness : e);
        this.position += 4;
      };
      DataStream.prototype.writeUint16 = function(v, e) {
        this._realloc(2);
        this._dataView.setUint16(this.position, v, e == null ? this.endianness : e);
        this.position += 2;
      };
      DataStream.prototype.writeUint8 = function(v) {
        this._realloc(1);
        this._dataView.setUint8(this.position, v);
        this.position += 1;
      };
      DataStream.prototype.writeFloat32 = function(v, e) {
        this._realloc(4);
        this._dataView.setFloat32(this.position, v, e == null ? this.endianness : e);
        this.position += 4;
      };
      DataStream.prototype.writeFloat64 = function(v, e) {
        this._realloc(8);
        this._dataView.setFloat64(this.position, v, e == null ? this.endianness : e);
        this.position += 8;
      };
      DataStream.prototype.writeUCS2String = function(str, endianness, lengthOverride) {
        if (lengthOverride == null) {
          lengthOverride = str.length;
        }
        for (var i2 = 0; i2 < str.length && i2 < lengthOverride; i2++) {
          this.writeUint16(str.charCodeAt(i2), endianness);
        }
        for (; i2 < lengthOverride; i2++) {
          this.writeUint16(0);
        }
      };
      DataStream.prototype.writeString = function(s, encoding, length) {
        var i2 = 0;
        if (encoding == null || encoding == "ASCII") {
          if (length != null) {
            var len = Math.min(s.length, length);
            for (i2 = 0; i2 < len; i2++) {
              this.writeUint8(s.charCodeAt(i2));
            }
            for (; i2 < length; i2++) {
              this.writeUint8(0);
            }
          } else {
            for (i2 = 0; i2 < s.length; i2++) {
              this.writeUint8(s.charCodeAt(i2));
            }
          }
        } else {
          this.writeUint8Array(new TextEncoder(encoding).encode(s.substring(0, length)));
        }
      };
      DataStream.prototype.writeCString = function(s, length) {
        var i2 = 0;
        if (length != null) {
          var len = Math.min(s.length, length);
          for (i2 = 0; i2 < len; i2++) {
            this.writeUint8(s.charCodeAt(i2));
          }
          for (; i2 < length; i2++) {
            this.writeUint8(0);
          }
        } else {
          for (i2 = 0; i2 < s.length; i2++) {
            this.writeUint8(s.charCodeAt(i2));
          }
          this.writeUint8(0);
        }
      };
      DataStream.prototype.writeStruct = function(structDefinition, struct) {
        for (var i2 = 0; i2 < structDefinition.length; i2 += 2) {
          var t = structDefinition[i2 + 1];
          this.writeType(t, struct[structDefinition[i2]], struct);
        }
      };
      DataStream.prototype.writeType = function(t, v, struct) {
        var tp;
        if (typeof t == "function") {
          return t(this, v);
        } else if (typeof t == "object" && !(t instanceof Array)) {
          return t.set(this, v, struct);
        }
        var lengthOverride = null;
        var charset = "ASCII";
        var pos = this.position;
        if (typeof t == "string" && /:/.test(t)) {
          tp = t.split(":");
          t = tp[0];
          lengthOverride = parseInt(tp[1]);
        }
        if (typeof t == "string" && /,/.test(t)) {
          tp = t.split(",");
          t = tp[0];
          charset = parseInt(tp[1]);
        }
        switch (t) {
          case "uint8":
            this.writeUint8(v);
            break;
          case "int8":
            this.writeInt8(v);
            break;
          case "uint16":
            this.writeUint16(v, this.endianness);
            break;
          case "int16":
            this.writeInt16(v, this.endianness);
            break;
          case "uint32":
            this.writeUint32(v, this.endianness);
            break;
          case "int32":
            this.writeInt32(v, this.endianness);
            break;
          case "float32":
            this.writeFloat32(v, this.endianness);
            break;
          case "float64":
            this.writeFloat64(v, this.endianness);
            break;
          case "uint16be":
            this.writeUint16(v, DataStream.BIG_ENDIAN);
            break;
          case "int16be":
            this.writeInt16(v, DataStream.BIG_ENDIAN);
            break;
          case "uint32be":
            this.writeUint32(v, DataStream.BIG_ENDIAN);
            break;
          case "int32be":
            this.writeInt32(v, DataStream.BIG_ENDIAN);
            break;
          case "float32be":
            this.writeFloat32(v, DataStream.BIG_ENDIAN);
            break;
          case "float64be":
            this.writeFloat64(v, DataStream.BIG_ENDIAN);
            break;
          case "uint16le":
            this.writeUint16(v, DataStream.LITTLE_ENDIAN);
            break;
          case "int16le":
            this.writeInt16(v, DataStream.LITTLE_ENDIAN);
            break;
          case "uint32le":
            this.writeUint32(v, DataStream.LITTLE_ENDIAN);
            break;
          case "int32le":
            this.writeInt32(v, DataStream.LITTLE_ENDIAN);
            break;
          case "float32le":
            this.writeFloat32(v, DataStream.LITTLE_ENDIAN);
            break;
          case "float64le":
            this.writeFloat64(v, DataStream.LITTLE_ENDIAN);
            break;
          case "cstring":
            this.writeCString(v, lengthOverride);
            break;
          case "string":
            this.writeString(v, charset, lengthOverride);
            break;
          case "u16string":
            this.writeUCS2String(v, this.endianness, lengthOverride);
            break;
          case "u16stringle":
            this.writeUCS2String(v, DataStream.LITTLE_ENDIAN, lengthOverride);
            break;
          case "u16stringbe":
            this.writeUCS2String(v, DataStream.BIG_ENDIAN, lengthOverride);
            break;
          default:
            if (t.length == 3) {
              var ta = t[1];
              for (var i2 = 0; i2 < v.length; i2++) {
                this.writeType(ta, v[i2]);
              }
              break;
            } else {
              this.writeStruct(t, v);
              break;
            }
        }
        if (lengthOverride != null) {
          this.position = pos;
          this._realloc(lengthOverride);
          this.position = pos + lengthOverride;
        }
      };
      DataStream.prototype.writeUint64 = function(v) {
        var h = Math.floor(v / MAX_SIZE);
        this.writeUint32(h);
        this.writeUint32(v & 4294967295);
      };
      DataStream.prototype.writeUint24 = function(v) {
        this.writeUint8((v & 16711680) >> 16);
        this.writeUint8((v & 65280) >> 8);
        this.writeUint8(v & 255);
      };
      DataStream.prototype.adjustUint32 = function(position, value) {
        var pos = this.position;
        this.seek(position);
        this.writeUint32(value);
        this.seek(pos);
      };
      DataStream.prototype.mapInt32Array = function(length, e) {
        this._realloc(length * 4);
        var arr = new Int32Array(this._buffer, this.byteOffset + this.position, length);
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += length * 4;
        return arr;
      };
      DataStream.prototype.mapInt16Array = function(length, e) {
        this._realloc(length * 2);
        var arr = new Int16Array(this._buffer, this.byteOffset + this.position, length);
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += length * 2;
        return arr;
      };
      DataStream.prototype.mapInt8Array = function(length) {
        this._realloc(length * 1);
        var arr = new Int8Array(this._buffer, this.byteOffset + this.position, length);
        this.position += length * 1;
        return arr;
      };
      DataStream.prototype.mapUint32Array = function(length, e) {
        this._realloc(length * 4);
        var arr = new Uint32Array(this._buffer, this.byteOffset + this.position, length);
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += length * 4;
        return arr;
      };
      DataStream.prototype.mapUint16Array = function(length, e) {
        this._realloc(length * 2);
        var arr = new Uint16Array(this._buffer, this.byteOffset + this.position, length);
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += length * 2;
        return arr;
      };
      DataStream.prototype.mapFloat64Array = function(length, e) {
        this._realloc(length * 8);
        var arr = new Float64Array(this._buffer, this.byteOffset + this.position, length);
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += length * 8;
        return arr;
      };
      DataStream.prototype.mapFloat32Array = function(length, e) {
        this._realloc(length * 4);
        var arr = new Float32Array(this._buffer, this.byteOffset + this.position, length);
        DataStream.arrayToNative(arr, e == null ? this.endianness : e);
        this.position += length * 4;
        return arr;
      };
      var MultiBufferStream = function(buffer) {
        this.buffers = [];
        this.bufferIndex = -1;
        if (buffer) {
          this.insertBuffer(buffer);
          this.bufferIndex = 0;
        }
      };
      MultiBufferStream.prototype = new DataStream(new ArrayBuffer(), 0, DataStream.BIG_ENDIAN);
      MultiBufferStream.prototype.initialized = function() {
        var firstBuffer;
        if (this.bufferIndex > -1) {
          return true;
        } else if (this.buffers.length > 0) {
          firstBuffer = this.buffers[0];
          if (firstBuffer.fileStart === 0) {
            this.buffer = firstBuffer;
            this.bufferIndex = 0;
            Log.debug("MultiBufferStream", "Stream ready for parsing");
            return true;
          } else {
            Log.warn("MultiBufferStream", "The first buffer should have a fileStart of 0");
            this.logBufferLevel();
            return false;
          }
        } else {
          Log.warn("MultiBufferStream", "No buffer to start parsing from");
          this.logBufferLevel();
          return false;
        }
      };
      ArrayBuffer.concat = function(buffer1, buffer2) {
        Log.debug("ArrayBuffer", "Trying to create a new buffer of size: " + (buffer1.byteLength + buffer2.byteLength));
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
      };
      MultiBufferStream.prototype.reduceBuffer = function(buffer, offset, newLength) {
        var smallB;
        smallB = new Uint8Array(newLength);
        smallB.set(new Uint8Array(buffer, offset, newLength));
        smallB.buffer.fileStart = buffer.fileStart + offset;
        smallB.buffer.usedBytes = 0;
        return smallB.buffer;
      };
      MultiBufferStream.prototype.insertBuffer = function(ab) {
        var to_add = true;
        for (var i2 = 0; i2 < this.buffers.length; i2++) {
          var b = this.buffers[i2];
          if (ab.fileStart <= b.fileStart) {
            if (ab.fileStart === b.fileStart) {
              if (ab.byteLength > b.byteLength) {
                this.buffers.splice(i2, 1);
                i2--;
                continue;
              } else {
                Log.warn("MultiBufferStream", "Buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ") already appended, ignoring");
              }
            } else {
              if (ab.fileStart + ab.byteLength <= b.fileStart) {
              } else {
                ab = this.reduceBuffer(ab, 0, b.fileStart - ab.fileStart);
              }
              Log.debug("MultiBufferStream", "Appending new buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ")");
              this.buffers.splice(i2, 0, ab);
              if (i2 === 0) {
                this.buffer = ab;
              }
            }
            to_add = false;
            break;
          } else if (ab.fileStart < b.fileStart + b.byteLength) {
            var offset = b.fileStart + b.byteLength - ab.fileStart;
            var newLength = ab.byteLength - offset;
            if (newLength > 0) {
              ab = this.reduceBuffer(ab, offset, newLength);
            } else {
              to_add = false;
              break;
            }
          }
        }
        if (to_add) {
          Log.debug("MultiBufferStream", "Appending new buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ")");
          this.buffers.push(ab);
          if (i2 === 0) {
            this.buffer = ab;
          }
        }
      };
      MultiBufferStream.prototype.logBufferLevel = function(info) {
        var i2;
        var buffer;
        var used, total;
        var ranges = [];
        var range;
        var bufferedString = "";
        used = 0;
        total = 0;
        for (i2 = 0; i2 < this.buffers.length; i2++) {
          buffer = this.buffers[i2];
          if (i2 === 0) {
            range = {};
            ranges.push(range);
            range.start = buffer.fileStart;
            range.end = buffer.fileStart + buffer.byteLength;
            bufferedString += "[" + range.start + "-";
          } else if (range.end === buffer.fileStart) {
            range.end = buffer.fileStart + buffer.byteLength;
          } else {
            range = {};
            range.start = buffer.fileStart;
            bufferedString += ranges[ranges.length - 1].end - 1 + "], [" + range.start + "-";
            range.end = buffer.fileStart + buffer.byteLength;
            ranges.push(range);
          }
          used += buffer.usedBytes;
          total += buffer.byteLength;
        }
        if (ranges.length > 0) {
          bufferedString += range.end - 1 + "]";
        }
        var log = info ? Log.info : Log.debug;
        if (this.buffers.length === 0) {
          log("MultiBufferStream", "No more buffer in memory");
        } else {
          log("MultiBufferStream", "" + this.buffers.length + " stored buffer(s) (" + used + "/" + total + " bytes), continuous ranges: " + bufferedString);
        }
      };
      MultiBufferStream.prototype.cleanBuffers = function() {
        var i2;
        var buffer;
        for (i2 = 0; i2 < this.buffers.length; i2++) {
          buffer = this.buffers[i2];
          if (buffer.usedBytes === buffer.byteLength) {
            Log.debug("MultiBufferStream", "Removing buffer #" + i2);
            this.buffers.splice(i2, 1);
            i2--;
          }
        }
      };
      MultiBufferStream.prototype.mergeNextBuffer = function() {
        var next_buffer;
        if (this.bufferIndex + 1 < this.buffers.length) {
          next_buffer = this.buffers[this.bufferIndex + 1];
          if (next_buffer.fileStart === this.buffer.fileStart + this.buffer.byteLength) {
            var oldLength = this.buffer.byteLength;
            var oldUsedBytes = this.buffer.usedBytes;
            var oldFileStart = this.buffer.fileStart;
            this.buffers[this.bufferIndex] = ArrayBuffer.concat(this.buffer, next_buffer);
            this.buffer = this.buffers[this.bufferIndex];
            this.buffers.splice(this.bufferIndex + 1, 1);
            this.buffer.usedBytes = oldUsedBytes;
            this.buffer.fileStart = oldFileStart;
            Log.debug("ISOFile", "Concatenating buffer for box parsing (length: " + oldLength + "->" + this.buffer.byteLength + ")");
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      MultiBufferStream.prototype.findPosition = function(fromStart, filePosition, markAsUsed) {
        var i2;
        var abuffer = null;
        var index = -1;
        if (fromStart === true) {
          i2 = 0;
        } else {
          i2 = this.bufferIndex;
        }
        while (i2 < this.buffers.length) {
          abuffer = this.buffers[i2];
          if (abuffer.fileStart <= filePosition) {
            index = i2;
            if (markAsUsed) {
              if (abuffer.fileStart + abuffer.byteLength <= filePosition) {
                abuffer.usedBytes = abuffer.byteLength;
              } else {
                abuffer.usedBytes = filePosition - abuffer.fileStart;
              }
              this.logBufferLevel();
            }
          } else {
            break;
          }
          i2++;
        }
        if (index !== -1) {
          abuffer = this.buffers[index];
          if (abuffer.fileStart + abuffer.byteLength >= filePosition) {
            Log.debug("MultiBufferStream", "Found position in existing buffer #" + index);
            return index;
          } else {
            return -1;
          }
        } else {
          return -1;
        }
      };
      MultiBufferStream.prototype.findEndContiguousBuf = function(inputindex) {
        var i2;
        var currentBuf;
        var nextBuf;
        var index = inputindex !== void 0 ? inputindex : this.bufferIndex;
        currentBuf = this.buffers[index];
        if (this.buffers.length > index + 1) {
          for (i2 = index + 1; i2 < this.buffers.length; i2++) {
            nextBuf = this.buffers[i2];
            if (nextBuf.fileStart === currentBuf.fileStart + currentBuf.byteLength) {
              currentBuf = nextBuf;
            } else {
              break;
            }
          }
        }
        return currentBuf.fileStart + currentBuf.byteLength;
      };
      MultiBufferStream.prototype.getEndFilePositionAfter = function(pos) {
        var index = this.findPosition(true, pos, false);
        if (index !== -1) {
          return this.findEndContiguousBuf(index);
        } else {
          return pos;
        }
      };
      MultiBufferStream.prototype.addUsedBytes = function(nbBytes) {
        this.buffer.usedBytes += nbBytes;
        this.logBufferLevel();
      };
      MultiBufferStream.prototype.setAllUsedBytes = function() {
        this.buffer.usedBytes = this.buffer.byteLength;
        this.logBufferLevel();
      };
      MultiBufferStream.prototype.seek = function(filePosition, fromStart, markAsUsed) {
        var index;
        index = this.findPosition(fromStart, filePosition, markAsUsed);
        if (index !== -1) {
          this.buffer = this.buffers[index];
          this.bufferIndex = index;
          this.position = filePosition - this.buffer.fileStart;
          Log.debug("MultiBufferStream", "Repositioning parser at buffer position: " + this.position);
          return true;
        } else {
          Log.debug("MultiBufferStream", "Position " + filePosition + " not found in buffered data");
          return false;
        }
      };
      MultiBufferStream.prototype.getPosition = function() {
        if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) {
          throw "Error accessing position in the MultiBufferStream";
        }
        return this.buffers[this.bufferIndex].fileStart + this.position;
      };
      MultiBufferStream.prototype.getLength = function() {
        return this.byteLength;
      };
      MultiBufferStream.prototype.getEndPosition = function() {
        if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) {
          throw "Error accessing position in the MultiBufferStream";
        }
        return this.buffers[this.bufferIndex].fileStart + this.byteLength;
      };
      if (typeof exports !== "undefined") {
        exports.MultiBufferStream = MultiBufferStream;
      }
      var MPEG4DescriptorParser = function() {
        var ES_DescrTag = 3;
        var DecoderConfigDescrTag = 4;
        var DecSpecificInfoTag = 5;
        var SLConfigDescrTag = 6;
        var descTagToName = [];
        descTagToName[ES_DescrTag] = "ES_Descriptor";
        descTagToName[DecoderConfigDescrTag] = "DecoderConfigDescriptor";
        descTagToName[DecSpecificInfoTag] = "DecoderSpecificInfo";
        descTagToName[SLConfigDescrTag] = "SLConfigDescriptor";
        this.getDescriptorName = function(tag) {
          return descTagToName[tag];
        };
        var that = this;
        var classes = {};
        this.parseOneDescriptor = function(stream) {
          var hdrSize = 0;
          var size = 0;
          var tag;
          var desc;
          var byteRead;
          tag = stream.readUint8();
          hdrSize++;
          byteRead = stream.readUint8();
          hdrSize++;
          while (byteRead & 128) {
            size = (size << 7) + (byteRead & 127);
            byteRead = stream.readUint8();
            hdrSize++;
          }
          size = (size << 7) + (byteRead & 127);
          Log.debug("MPEG4DescriptorParser", "Found " + (descTagToName[tag] || "Descriptor " + tag) + ", size " + size + " at position " + stream.getPosition());
          if (descTagToName[tag]) {
            desc = new classes[descTagToName[tag]](size);
          } else {
            desc = new classes.Descriptor(size);
          }
          desc.parse(stream);
          return desc;
        };
        classes.Descriptor = function(_tag, _size) {
          this.tag = _tag;
          this.size = _size;
          this.descs = [];
        };
        classes.Descriptor.prototype.parse = function(stream) {
          this.data = stream.readUint8Array(this.size);
        };
        classes.Descriptor.prototype.findDescriptor = function(tag) {
          for (var i2 = 0; i2 < this.descs.length; i2++) {
            if (this.descs[i2].tag == tag) {
              return this.descs[i2];
            }
          }
          return null;
        };
        classes.Descriptor.prototype.parseRemainingDescriptors = function(stream) {
          var start = stream.position;
          while (stream.position < start + this.size) {
            var desc = that.parseOneDescriptor(stream);
            this.descs.push(desc);
          }
        };
        classes.ES_Descriptor = function(size) {
          classes.Descriptor.call(this, ES_DescrTag, size);
        };
        classes.ES_Descriptor.prototype = new classes.Descriptor();
        classes.ES_Descriptor.prototype.parse = function(stream) {
          this.ES_ID = stream.readUint16();
          this.flags = stream.readUint8();
          this.size -= 3;
          if (this.flags & 128) {
            this.dependsOn_ES_ID = stream.readUint16();
            this.size -= 2;
          } else {
            this.dependsOn_ES_ID = 0;
          }
          if (this.flags & 64) {
            var l = stream.readUint8();
            this.URL = stream.readString(l);
            this.size -= l + 1;
          } else {
            this.URL = "";
          }
          if (this.flags & 32) {
            this.OCR_ES_ID = stream.readUint16();
            this.size -= 2;
          } else {
            this.OCR_ES_ID = 0;
          }
          this.parseRemainingDescriptors(stream);
        };
        classes.ES_Descriptor.prototype.getOTI = function(stream) {
          var dcd = this.findDescriptor(DecoderConfigDescrTag);
          if (dcd) {
            return dcd.oti;
          } else {
            return 0;
          }
        };
        classes.ES_Descriptor.prototype.getAudioConfig = function(stream) {
          var dcd = this.findDescriptor(DecoderConfigDescrTag);
          if (!dcd) return null;
          var dsi = dcd.findDescriptor(DecSpecificInfoTag);
          if (dsi && dsi.data) {
            var audioObjectType = (dsi.data[0] & 248) >> 3;
            if (audioObjectType === 31 && dsi.data.length >= 2) {
              audioObjectType = 32 + ((dsi.data[0] & 7) << 3) + ((dsi.data[1] & 224) >> 5);
            }
            return audioObjectType;
          } else {
            return null;
          }
        };
        classes.DecoderConfigDescriptor = function(size) {
          classes.Descriptor.call(this, DecoderConfigDescrTag, size);
        };
        classes.DecoderConfigDescriptor.prototype = new classes.Descriptor();
        classes.DecoderConfigDescriptor.prototype.parse = function(stream) {
          this.oti = stream.readUint8();
          this.streamType = stream.readUint8();
          this.upStream = (this.streamType >> 1 & 1) !== 0;
          this.streamType = this.streamType >>> 2;
          this.bufferSize = stream.readUint24();
          this.maxBitrate = stream.readUint32();
          this.avgBitrate = stream.readUint32();
          this.size -= 13;
          this.parseRemainingDescriptors(stream);
        };
        classes.DecoderSpecificInfo = function(size) {
          classes.Descriptor.call(this, DecSpecificInfoTag, size);
        };
        classes.DecoderSpecificInfo.prototype = new classes.Descriptor();
        classes.SLConfigDescriptor = function(size) {
          classes.Descriptor.call(this, SLConfigDescrTag, size);
        };
        classes.SLConfigDescriptor.prototype = new classes.Descriptor();
        return this;
      };
      if (typeof exports !== "undefined") {
        exports.MPEG4DescriptorParser = MPEG4DescriptorParser;
      }
      var BoxParser = {
        ERR_INVALID_DATA: -1,
        ERR_NOT_ENOUGH_DATA: 0,
        OK: 1,
        // Boxes to be created with default parsing
        BASIC_BOXES: [
          { type: "mdat", name: "MediaDataBox" },
          { type: "idat", name: "ItemDataBox" },
          { type: "free", name: "FreeSpaceBox" },
          { type: "skip", name: "FreeSpaceBox" },
          { type: "meco", name: "AdditionalMetadataContainerBox" },
          { type: "strk", name: "SubTrackBox" }
        ],
        FULL_BOXES: [
          { type: "hmhd", name: "HintMediaHeaderBox" },
          { type: "nmhd", name: "NullMediaHeaderBox" },
          { type: "iods", name: "ObjectDescriptorBox" },
          { type: "xml ", name: "XMLBox" },
          { type: "bxml", name: "BinaryXMLBox" },
          { type: "ipro", name: "ItemProtectionBox" },
          { type: "mere", name: "MetaboxRelationBox" }
        ],
        CONTAINER_BOXES: [
          [{ type: "moov", name: "CompressedMovieBox" }, ["trak", "pssh"]],
          [{ type: "trak", name: "TrackBox" }],
          [{ type: "edts", name: "EditBox" }],
          [{ type: "mdia", name: "MediaBox" }],
          [{ type: "minf", name: "MediaInformationBox" }],
          [{ type: "dinf", name: "DataInformationBox" }],
          [{ type: "stbl", name: "SampleTableBox" }, ["sgpd", "sbgp"]],
          [{ type: "mvex", name: "MovieExtendsBox" }, ["trex"]],
          [{ type: "moof", name: "CompressedMovieFragmentBox" }, ["traf"]],
          [{ type: "traf", name: "TrackFragmentBox" }, ["trun", "sgpd", "sbgp"]],
          [{ type: "vttc", name: "VTTCueBox" }],
          [{ type: "tref", name: "TrackReferenceBox" }],
          [{ type: "iref", name: "ItemReferenceBox" }],
          [{ type: "mfra", name: "MovieFragmentRandomAccessBox" }, ["tfra"]],
          [{ type: "meco", name: "AdditionalMetadataContainerBox" }],
          [{ type: "hnti", name: "trackhintinformation" }],
          [{ type: "hinf", name: "hintstatisticsbox" }],
          [{ type: "strk", name: "SubTrackBox" }],
          [{ type: "strd", name: "SubTrackDefinitionBox" }],
          [{ type: "sinf", name: "ProtectionSchemeInfoBox" }],
          [{ type: "rinf", name: "RestrictedSchemeInfoBox" }],
          [{ type: "schi", name: "SchemeInformationBox" }],
          [{ type: "trgr", name: "TrackGroupBox" }],
          [{ type: "udta", name: "UserDataBox" }, ["kind"]],
          [{ type: "iprp", name: "ItemPropertiesBox" }, ["ipma"]],
          [{ type: "ipco", name: "ItemPropertyContainerBox" }],
          [{ type: "grpl", name: "GroupsListBox" }],
          [{ type: "j2kH", name: "J2KHeaderInfoBox" }],
          [{ type: "etyp", name: "ExtendedTypeBox" }, ["tyco"]]
        ],
        // Boxes effectively created
        boxCodes: [],
        fullBoxCodes: [],
        containerBoxCodes: [],
        sampleEntryCodes: {},
        sampleGroupEntryCodes: [],
        trackGroupTypes: [],
        UUIDBoxes: {},
        UUIDs: [],
        initialize: function() {
          BoxParser.FullBox.prototype = new BoxParser.Box();
          BoxParser.ContainerBox.prototype = new BoxParser.Box();
          BoxParser.SampleEntry.prototype = new BoxParser.Box();
          BoxParser.TrackGroupTypeBox.prototype = new BoxParser.FullBox();
          BoxParser.BASIC_BOXES.forEach(function(box2) {
            BoxParser.createBoxCtor(box2.type, box2.name);
          });
          BoxParser.FULL_BOXES.forEach(function(box2) {
            BoxParser.createFullBoxCtor(box2.type, box2.name);
          });
          BoxParser.CONTAINER_BOXES.forEach(function(boxes) {
            BoxParser.createContainerBoxCtor(boxes[0].type, boxes[0].name, null, boxes[1]);
          });
        },
        Box: function(_type, _size, _name, _uuid) {
          this.type = _type;
          this.box_name = _name;
          this.size = _size;
          this.uuid = _uuid;
        },
        FullBox: function(type, size, name, uuid) {
          BoxParser.Box.call(this, type, size, name, uuid);
          this.flags = 0;
          this.version = 0;
        },
        ContainerBox: function(type, size, name, uuid) {
          BoxParser.Box.call(this, type, size, name, uuid);
          this.boxes = [];
        },
        SampleEntry: function(type, size, hdr_size, start) {
          BoxParser.ContainerBox.call(this, type, size);
          this.hdr_size = hdr_size;
          this.start = start;
        },
        SampleGroupEntry: function(type) {
          this.grouping_type = type;
        },
        TrackGroupTypeBox: function(type, size) {
          BoxParser.FullBox.call(this, type, size);
        },
        createBoxCtor: function(type, name, parseMethod) {
          BoxParser.boxCodes.push(type);
          BoxParser[type + "Box"] = function(size) {
            BoxParser.Box.call(this, type, size, name);
          };
          BoxParser[type + "Box"].prototype = new BoxParser.Box();
          if (parseMethod) BoxParser[type + "Box"].prototype.parse = parseMethod;
        },
        createFullBoxCtor: function(type, name, parseMethod) {
          BoxParser[type + "Box"] = function(size) {
            BoxParser.FullBox.call(this, type, size, name);
          };
          BoxParser[type + "Box"].prototype = new BoxParser.FullBox();
          BoxParser[type + "Box"].prototype.parse = function(stream) {
            this.parseFullHeader(stream);
            if (parseMethod) {
              parseMethod.call(this, stream);
            }
          };
        },
        addSubBoxArrays: function(subBoxNames) {
          if (subBoxNames) {
            this.subBoxNames = subBoxNames;
            var nbSubBoxes = subBoxNames.length;
            for (var k = 0; k < nbSubBoxes; k++) {
              this[subBoxNames[k] + "s"] = [];
            }
          }
        },
        createContainerBoxCtor: function(type, name, parseMethod, subBoxNames) {
          BoxParser[type + "Box"] = function(size) {
            BoxParser.ContainerBox.call(this, type, size, name);
            BoxParser.addSubBoxArrays.call(this, subBoxNames);
          };
          BoxParser[type + "Box"].prototype = new BoxParser.ContainerBox();
          if (parseMethod) BoxParser[type + "Box"].prototype.parse = parseMethod;
        },
        createMediaSampleEntryCtor: function(mediaType, parseMethod, subBoxNames) {
          BoxParser.sampleEntryCodes[mediaType] = [];
          BoxParser[mediaType + "SampleEntry"] = function(type, size) {
            BoxParser.SampleEntry.call(this, type, size);
            BoxParser.addSubBoxArrays.call(this, subBoxNames);
          };
          BoxParser[mediaType + "SampleEntry"].prototype = new BoxParser.SampleEntry();
          if (parseMethod) BoxParser[mediaType + "SampleEntry"].prototype.parse = parseMethod;
        },
        createSampleEntryCtor: function(mediaType, type, parseMethod, subBoxNames) {
          BoxParser.sampleEntryCodes[mediaType].push(type);
          BoxParser[type + "SampleEntry"] = function(size) {
            BoxParser[mediaType + "SampleEntry"].call(this, type, size);
            BoxParser.addSubBoxArrays.call(this, subBoxNames);
          };
          BoxParser[type + "SampleEntry"].prototype = new BoxParser[mediaType + "SampleEntry"]();
          if (parseMethod) BoxParser[type + "SampleEntry"].prototype.parse = parseMethod;
        },
        createEncryptedSampleEntryCtor: function(mediaType, type, parseMethod) {
          BoxParser.createSampleEntryCtor.call(this, mediaType, type, parseMethod, ["sinf"]);
        },
        createSampleGroupCtor: function(type, parseMethod) {
          BoxParser[type + "SampleGroupEntry"] = function(size) {
            BoxParser.SampleGroupEntry.call(this, type, size);
          };
          BoxParser[type + "SampleGroupEntry"].prototype = new BoxParser.SampleGroupEntry();
          if (parseMethod) BoxParser[type + "SampleGroupEntry"].prototype.parse = parseMethod;
        },
        createTrackGroupCtor: function(type, parseMethod) {
          BoxParser[type + "TrackGroupTypeBox"] = function(size) {
            BoxParser.TrackGroupTypeBox.call(this, type, size);
          };
          BoxParser[type + "TrackGroupTypeBox"].prototype = new BoxParser.TrackGroupTypeBox();
          if (parseMethod) BoxParser[type + "TrackGroupTypeBox"].prototype.parse = parseMethod;
        },
        createUUIDBox: function(uuid, name, isFullBox, isContainerBox, parseMethod) {
          BoxParser.UUIDs.push(uuid);
          BoxParser.UUIDBoxes[uuid] = function(size) {
            if (isFullBox) {
              BoxParser.FullBox.call(this, "uuid", size, name, uuid);
            } else {
              if (isContainerBox) {
                BoxParser.ContainerBox.call(this, "uuid", size, name, uuid);
              } else {
                BoxParser.Box.call(this, "uuid", size, name, uuid);
              }
            }
          };
          BoxParser.UUIDBoxes[uuid].prototype = isFullBox ? new BoxParser.FullBox() : isContainerBox ? new BoxParser.ContainerBox() : new BoxParser.Box();
          if (parseMethod) {
            if (isFullBox) {
              BoxParser.UUIDBoxes[uuid].prototype.parse = function(stream) {
                this.parseFullHeader(stream);
                if (parseMethod) {
                  parseMethod.call(this, stream);
                }
              };
            } else {
              BoxParser.UUIDBoxes[uuid].prototype.parse = parseMethod;
            }
          }
        }
      };
      BoxParser.initialize();
      BoxParser.TKHD_FLAG_ENABLED = 1;
      BoxParser.TKHD_FLAG_IN_MOVIE = 2;
      BoxParser.TKHD_FLAG_IN_PREVIEW = 4;
      BoxParser.TFHD_FLAG_BASE_DATA_OFFSET = 1;
      BoxParser.TFHD_FLAG_SAMPLE_DESC = 2;
      BoxParser.TFHD_FLAG_SAMPLE_DUR = 8;
      BoxParser.TFHD_FLAG_SAMPLE_SIZE = 16;
      BoxParser.TFHD_FLAG_SAMPLE_FLAGS = 32;
      BoxParser.TFHD_FLAG_DUR_EMPTY = 65536;
      BoxParser.TFHD_FLAG_DEFAULT_BASE_IS_MOOF = 131072;
      BoxParser.TRUN_FLAGS_DATA_OFFSET = 1;
      BoxParser.TRUN_FLAGS_FIRST_FLAG = 4;
      BoxParser.TRUN_FLAGS_DURATION = 256;
      BoxParser.TRUN_FLAGS_SIZE = 512;
      BoxParser.TRUN_FLAGS_FLAGS = 1024;
      BoxParser.TRUN_FLAGS_CTS_OFFSET = 2048;
      BoxParser.Box.prototype.add = function(name) {
        return this.addBox(new BoxParser[name + "Box"]());
      };
      BoxParser.Box.prototype.addBox = function(box2) {
        this.boxes.push(box2);
        if (this[box2.type + "s"]) {
          this[box2.type + "s"].push(box2);
        } else {
          this[box2.type] = box2;
        }
        return box2;
      };
      BoxParser.Box.prototype.set = function(prop, value) {
        this[prop] = value;
        return this;
      };
      BoxParser.Box.prototype.addEntry = function(value, _prop) {
        var prop = _prop || "entries";
        if (!this[prop]) {
          this[prop] = [];
        }
        this[prop].push(value);
        return this;
      };
      if (typeof exports !== "undefined") {
        exports.BoxParser = BoxParser;
      }
      BoxParser.parseUUID = function(stream) {
        return BoxParser.parseHex16(stream);
      };
      BoxParser.parseHex16 = function(stream) {
        var hex16 = "";
        for (var i2 = 0; i2 < 16; i2++) {
          var hex = stream.readUint8().toString(16);
          hex16 += hex.length === 1 ? "0" + hex : hex;
        }
        return hex16;
      };
      BoxParser.parseOneBox = function(stream, headerOnly, parentSize) {
        var box2;
        var start = stream.getPosition();
        var hdr_size = 0;
        var diff;
        var uuid;
        if (stream.getEndPosition() - start < 8) {
          Log.debug("BoxParser", "Not enough data in stream to parse the type and size of the box");
          return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
        }
        if (parentSize && parentSize < 8) {
          Log.debug("BoxParser", "Not enough bytes left in the parent box to parse a new box");
          return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
        }
        var size = stream.readUint32();
        var type = stream.readString(4);
        var box_type = type;
        Log.debug("BoxParser", "Found box of type '" + type + "' and size " + size + " at position " + start);
        hdr_size = 8;
        if (type == "uuid") {
          if (stream.getEndPosition() - stream.getPosition() < 16 || parentSize - hdr_size < 16) {
            stream.seek(start);
            Log.debug("BoxParser", "Not enough bytes left in the parent box to parse a UUID box");
            return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
          }
          uuid = BoxParser.parseUUID(stream);
          hdr_size += 16;
          box_type = uuid;
        }
        if (size == 1) {
          if (stream.getEndPosition() - stream.getPosition() < 8 || parentSize && parentSize - hdr_size < 8) {
            stream.seek(start);
            Log.warn("BoxParser", 'Not enough data in stream to parse the extended size of the "' + type + '" box');
            return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
          }
          size = stream.readUint64();
          hdr_size += 8;
        } else if (size === 0) {
          if (parentSize) {
            size = parentSize;
          } else {
            if (type !== "mdat") {
              Log.error("BoxParser", "Unlimited box size not supported for type: '" + type + "'");
              box2 = new BoxParser.Box(type, size);
              return { code: BoxParser.OK, box: box2, size: box2.size };
            }
          }
        }
        if (size !== 0 && size < hdr_size) {
          Log.error("BoxParser", "Box of type " + type + " has an invalid size " + size + " (too small to be a box)");
          return { code: BoxParser.ERR_NOT_ENOUGH_DATA, type, size, hdr_size, start };
        }
        if (size !== 0 && parentSize && size > parentSize) {
          Log.error("BoxParser", "Box of type '" + type + "' has a size " + size + " greater than its container size " + parentSize);
          return { code: BoxParser.ERR_NOT_ENOUGH_DATA, type, size, hdr_size, start };
        }
        if (size !== 0 && start + size > stream.getEndPosition()) {
          stream.seek(start);
          Log.info("BoxParser", "Not enough data in stream to parse the entire '" + type + "' box");
          return { code: BoxParser.ERR_NOT_ENOUGH_DATA, type, size, hdr_size, start };
        }
        if (headerOnly) {
          return { code: BoxParser.OK, type, size, hdr_size, start };
        } else {
          if (BoxParser[type + "Box"]) {
            box2 = new BoxParser[type + "Box"](size);
          } else {
            if (type !== "uuid") {
              Log.warn("BoxParser", "Unknown box type: '" + type + "'");
              box2 = new BoxParser.Box(type, size);
              box2.has_unparsed_data = true;
            } else {
              if (BoxParser.UUIDBoxes[uuid]) {
                box2 = new BoxParser.UUIDBoxes[uuid](size);
              } else {
                Log.warn("BoxParser", "Unknown uuid type: '" + uuid + "'");
                box2 = new BoxParser.Box(type, size);
                box2.uuid = uuid;
                box2.has_unparsed_data = true;
              }
            }
          }
        }
        box2.hdr_size = hdr_size;
        box2.start = start;
        if (box2.write === BoxParser.Box.prototype.write && box2.type !== "mdat") {
          Log.info("BoxParser", "'" + box_type + "' box writing not yet implemented, keeping unparsed data in memory for later write");
          box2.parseDataAndRewind(stream);
        }
        box2.parse(stream);
        diff = stream.getPosition() - (box2.start + box2.size);
        if (diff < 0) {
          Log.warn("BoxParser", "Parsing of box '" + box_type + "' did not read the entire indicated box data size (missing " + -diff + " bytes), seeking forward");
          stream.seek(box2.start + box2.size);
        } else if (diff > 0) {
          Log.error("BoxParser", "Parsing of box '" + box_type + "' read " + diff + " more bytes than the indicated box data size, seeking backwards");
          if (box2.size !== 0) stream.seek(box2.start + box2.size);
        }
        return { code: BoxParser.OK, box: box2, size: box2.size };
      };
      BoxParser.Box.prototype.parse = function(stream) {
        if (this.type != "mdat") {
          this.data = stream.readUint8Array(this.size - this.hdr_size);
        } else {
          if (this.size === 0) {
            stream.seek(stream.getEndPosition());
          } else {
            stream.seek(this.start + this.size);
          }
        }
      };
      BoxParser.Box.prototype.parseDataAndRewind = function(stream) {
        this.data = stream.readUint8Array(this.size - this.hdr_size);
        stream.position -= this.size - this.hdr_size;
      };
      BoxParser.FullBox.prototype.parseDataAndRewind = function(stream) {
        this.parseFullHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
        this.hdr_size -= 4;
        stream.position -= this.size - this.hdr_size;
      };
      BoxParser.FullBox.prototype.parseFullHeader = function(stream) {
        this.version = stream.readUint8();
        this.flags = stream.readUint24();
        this.hdr_size += 4;
      };
      BoxParser.FullBox.prototype.parse = function(stream) {
        this.parseFullHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
      };
      BoxParser.ContainerBox.prototype.parse = function(stream) {
        var ret2;
        var box2;
        while (stream.getPosition() < this.start + this.size) {
          ret2 = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret2.code === BoxParser.OK) {
            box2 = ret2.box;
            this.boxes.push(box2);
            if (this.subBoxNames && this.subBoxNames.indexOf(box2.type) != -1) {
              this[this.subBoxNames[this.subBoxNames.indexOf(box2.type)] + "s"].push(box2);
            } else {
              var box_type = box2.type !== "uuid" ? box2.type : box2.uuid;
              if (this[box_type]) {
                Log.warn("Box of type " + box_type + " already stored in field of this type");
              } else {
                this[box_type] = box2;
              }
            }
          } else {
            return;
          }
        }
      };
      BoxParser.Box.prototype.parseLanguage = function(stream) {
        this.language = stream.readUint16();
        var chars = [];
        chars[0] = this.language >> 10 & 31;
        chars[1] = this.language >> 5 & 31;
        chars[2] = this.language & 31;
        this.languageString = String.fromCharCode(chars[0] + 96, chars[1] + 96, chars[2] + 96);
      };
      BoxParser.SAMPLE_ENTRY_TYPE_VISUAL = "Visual";
      BoxParser.SAMPLE_ENTRY_TYPE_AUDIO = "Audio";
      BoxParser.SAMPLE_ENTRY_TYPE_HINT = "Hint";
      BoxParser.SAMPLE_ENTRY_TYPE_METADATA = "Metadata";
      BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE = "Subtitle";
      BoxParser.SAMPLE_ENTRY_TYPE_SYSTEM = "System";
      BoxParser.SAMPLE_ENTRY_TYPE_TEXT = "Text";
      BoxParser.SampleEntry.prototype.parseHeader = function(stream) {
        stream.readUint8Array(6);
        this.data_reference_index = stream.readUint16();
        this.hdr_size += 8;
      };
      BoxParser.SampleEntry.prototype.parse = function(stream) {
        this.parseHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
      };
      BoxParser.SampleEntry.prototype.parseDataAndRewind = function(stream) {
        this.parseHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
        this.hdr_size -= 8;
        stream.position -= this.size - this.hdr_size;
      };
      BoxParser.SampleEntry.prototype.parseFooter = function(stream) {
        BoxParser.ContainerBox.prototype.parse.call(this, stream);
      };
      BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_HINT);
      BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA);
      BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE);
      BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SYSTEM);
      BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_TEXT);
      BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, function(stream) {
        var compressorname_length;
        this.parseHeader(stream);
        stream.readUint16();
        stream.readUint16();
        stream.readUint32Array(3);
        this.width = stream.readUint16();
        this.height = stream.readUint16();
        this.horizresolution = stream.readUint32();
        this.vertresolution = stream.readUint32();
        stream.readUint32();
        this.frame_count = stream.readUint16();
        compressorname_length = Math.min(31, stream.readUint8());
        this.compressorname = stream.readString(compressorname_length);
        if (compressorname_length < 31) {
          stream.readString(31 - compressorname_length);
        }
        this.depth = stream.readUint16();
        stream.readUint16();
        this.parseFooter(stream);
      });
      BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, function(stream) {
        this.parseHeader(stream);
        stream.readUint32Array(2);
        this.channel_count = stream.readUint16();
        this.samplesize = stream.readUint16();
        stream.readUint16();
        stream.readUint16();
        this.samplerate = stream.readUint32() / (1 << 16);
        this.parseFooter(stream);
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc2");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc3");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc4");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "av01");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "dav1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "hvc1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "hev1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "hvt1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "lhe1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "dvh1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "dvhe");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvc1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvi1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvs1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvcN");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vp08");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vp09");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avs3");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "j2ki");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "mjp2");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "mjpg");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "uncv");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mp4a");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "ac-3");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "ac-4");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "ec-3");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "Opus");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mha1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mha2");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mhm1");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mhm2");
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "fLaC");
      BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "encv");
      BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "enca");
      BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "encu");
      BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SYSTEM, "encs");
      BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_TEXT, "enct");
      BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "encm");
      BoxParser.createBoxCtor("a1lx", "AV1LayeredImageIndexingProperty", function(stream) {
        var large_size = stream.readUint8() & 1;
        var FieldLength = ((large_size & 1) + 1) * 16;
        this.layer_size = [];
        for (var i2 = 0; i2 < 3; i2++) {
          if (FieldLength == 16) {
            this.layer_size[i2] = stream.readUint16();
          } else {
            this.layer_size[i2] = stream.readUint32();
          }
        }
      });
      BoxParser.createBoxCtor("a1op", "OperatingPointSelectorProperty", function(stream) {
        this.op_index = stream.readUint8();
      });
      BoxParser.createFullBoxCtor("auxC", "AuxiliaryTypeProperty", function(stream) {
        this.aux_type = stream.readCString();
        var aux_subtype_length = this.size - this.hdr_size - (this.aux_type.length + 1);
        this.aux_subtype = stream.readUint8Array(aux_subtype_length);
      });
      BoxParser.createBoxCtor("av1C", "AV1CodecConfigurationBox", function(stream) {
        var i2;
        var toparse;
        var tmp = stream.readUint8();
        if ((tmp >> 7 & 1) !== 1) {
          Log.error("av1C marker problem");
          return;
        }
        this.version = tmp & 127;
        if (this.version !== 1) {
          Log.error("av1C version " + this.version + " not supported");
          return;
        }
        tmp = stream.readUint8();
        this.seq_profile = tmp >> 5 & 7;
        this.seq_level_idx_0 = tmp & 31;
        tmp = stream.readUint8();
        this.seq_tier_0 = tmp >> 7 & 1;
        this.high_bitdepth = tmp >> 6 & 1;
        this.twelve_bit = tmp >> 5 & 1;
        this.monochrome = tmp >> 4 & 1;
        this.chroma_subsampling_x = tmp >> 3 & 1;
        this.chroma_subsampling_y = tmp >> 2 & 1;
        this.chroma_sample_position = tmp & 3;
        tmp = stream.readUint8();
        this.reserved_1 = tmp >> 5 & 7;
        if (this.reserved_1 !== 0) {
          Log.error("av1C reserved_1 parsing problem");
          return;
        }
        this.initial_presentation_delay_present = tmp >> 4 & 1;
        if (this.initial_presentation_delay_present === 1) {
          this.initial_presentation_delay_minus_one = tmp & 15;
        } else {
          this.reserved_2 = tmp & 15;
          if (this.reserved_2 !== 0) {
            Log.error("av1C reserved_2 parsing problem");
            return;
          }
        }
        var configOBUs_length = this.size - this.hdr_size - 4;
        this.configOBUs = stream.readUint8Array(configOBUs_length);
      });
      function printPS(ps) {
        var str = "<table class='inner-table'>";
        str += "<thead><tr><th>length</th><th>nalu_data</th></tr></thead>";
        str += "<tbody>";
        for (var i2 = 0; i2 < ps.length; i2++) {
          var nalu = ps[i2];
          str += "<tr>";
          str += "<td>" + nalu.length + "</td>";
          str += "<td>";
          str += nalu.nalu.reduce(function(str2, byte) {
            return str2 + byte.toString(16).padStart(2, "0");
          }, "0x");
          str += "</td></tr>";
        }
        str += "</tbody></table>";
        return str;
      }
      BoxParser.createBoxCtor("avcC", "AVCConfigurationBox", function(stream) {
        var i2;
        var toparse;
        this.configurationVersion = stream.readUint8();
        this.AVCProfileIndication = stream.readUint8();
        this.profile_compatibility = stream.readUint8();
        this.AVCLevelIndication = stream.readUint8();
        this.lengthSizeMinusOne = stream.readUint8() & 3;
        this.nb_SPS_nalus = stream.readUint8() & 31;
        toparse = this.size - this.hdr_size - 6;
        this.SPS = [];
        this.SPS.toString = function() {
          return printPS(this);
        };
        for (i2 = 0; i2 < this.nb_SPS_nalus; i2++) {
          this.SPS[i2] = {};
          this.SPS[i2].length = stream.readUint16();
          this.SPS[i2].nalu = stream.readUint8Array(this.SPS[i2].length);
          toparse -= 2 + this.SPS[i2].length;
        }
        this.nb_PPS_nalus = stream.readUint8();
        toparse--;
        this.PPS = [];
        this.PPS.toString = function() {
          return printPS(this);
        };
        for (i2 = 0; i2 < this.nb_PPS_nalus; i2++) {
          this.PPS[i2] = {};
          this.PPS[i2].length = stream.readUint16();
          this.PPS[i2].nalu = stream.readUint8Array(this.PPS[i2].length);
          toparse -= 2 + this.PPS[i2].length;
        }
        if (toparse > 0) {
          this.ext = stream.readUint8Array(toparse);
        }
      });
      BoxParser.createBoxCtor("btrt", "BitRateBox", function(stream) {
        this.bufferSizeDB = stream.readUint32();
        this.maxBitrate = stream.readUint32();
        this.avgBitrate = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("ccst", "CodingConstraintsBox", function(stream) {
        var flags = stream.readUint8();
        this.all_ref_pics_intra = (flags & 128) == 128;
        this.intra_pred_used = (flags & 64) == 64;
        this.max_ref_per_pic = (flags & 63) >> 2;
        stream.readUint24();
      });
      BoxParser.createBoxCtor("cdef", "ComponentDefinitionBox", function(stream) {
        var i2;
        this.channel_count = stream.readUint16();
        this.channel_indexes = [];
        this.channel_types = [];
        this.channel_associations = [];
        for (i2 = 0; i2 < this.channel_count; i2++) {
          this.channel_indexes.push(stream.readUint16());
          this.channel_types.push(stream.readUint16());
          this.channel_associations.push(stream.readUint16());
        }
      });
      BoxParser.createBoxCtor("clap", "CleanApertureBox", function(stream) {
        this.cleanApertureWidthN = stream.readUint32();
        this.cleanApertureWidthD = stream.readUint32();
        this.cleanApertureHeightN = stream.readUint32();
        this.cleanApertureHeightD = stream.readUint32();
        this.horizOffN = stream.readUint32();
        this.horizOffD = stream.readUint32();
        this.vertOffN = stream.readUint32();
        this.vertOffD = stream.readUint32();
      });
      BoxParser.createBoxCtor("clli", "ContentLightLevelBox", function(stream) {
        this.max_content_light_level = stream.readUint16();
        this.max_pic_average_light_level = stream.readUint16();
      });
      BoxParser.createFullBoxCtor("cmex", "CameraExtrinsicMatrixProperty", function(stream) {
        if (this.flags & 1) {
          this.pos_x = stream.readInt32();
        }
        if (this.flags & 2) {
          this.pos_y = stream.readInt32();
        }
        if (this.flags & 4) {
          this.pos_z = stream.readInt32();
        }
        if (this.flags & 8) {
          if (this.version == 0) {
            if (this.flags & 16) {
              this.quat_x = stream.readInt32();
              this.quat_y = stream.readInt32();
              this.quat_z = stream.readInt32();
            } else {
              this.quat_x = stream.readInt16();
              this.quat_y = stream.readInt16();
              this.quat_z = stream.readInt16();
            }
          } else if (this.version == 1) {
          }
        }
        if (this.flags & 32) {
          this.id = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("cmin", "CameraIntrinsicMatrixProperty", function(stream) {
        this.focal_length_x = stream.readInt32();
        this.principal_point_x = stream.readInt32();
        this.principal_point_y = stream.readInt32();
        if (this.flags & 1) {
          this.focal_length_y = stream.readInt32();
          this.skew_factor = stream.readInt32();
        }
      });
      BoxParser.createBoxCtor("cmpd", "ComponentDefinitionBox", function(stream) {
        this.component_count = stream.readUint32();
        this.component_types = [];
        this.component_type_urls = [];
        for (i = 0; i < this.component_count; i++) {
          var component_type = stream.readUint16();
          this.component_types.push(component_type);
          if (component_type >= 32768) {
            this.component_type_urls.push(stream.readCString());
          }
        }
      });
      BoxParser.createFullBoxCtor("co64", "ChunkLargeOffsetBox", function(stream) {
        var entry_count2;
        var i2;
        entry_count2 = stream.readUint32();
        this.chunk_offsets = [];
        if (this.version === 0) {
          for (i2 = 0; i2 < entry_count2; i2++) {
            this.chunk_offsets.push(stream.readUint64());
          }
        }
      });
      BoxParser.createFullBoxCtor("CoLL", "ContentLightLevelBox", function(stream) {
        this.maxCLL = stream.readUint16();
        this.maxFALL = stream.readUint16();
      });
      BoxParser.createBoxCtor("colr", "ColourInformationBox", function(stream) {
        this.colour_type = stream.readString(4);
        if (this.colour_type === "nclx") {
          this.colour_primaries = stream.readUint16();
          this.transfer_characteristics = stream.readUint16();
          this.matrix_coefficients = stream.readUint16();
          var tmp = stream.readUint8();
          this.full_range_flag = tmp >> 7;
        } else if (this.colour_type === "rICC") {
          this.ICC_profile = stream.readUint8Array(this.size - 4);
        } else if (this.colour_type === "prof") {
          this.ICC_profile = stream.readUint8Array(this.size - 4);
        }
      });
      BoxParser.createFullBoxCtor("cprt", "CopyrightBox", function(stream) {
        this.parseLanguage(stream);
        this.notice = stream.readCString();
      });
      BoxParser.createFullBoxCtor("cslg", "CompositionToDecodeBox", function(stream) {
        var entry_count2;
        if (this.version === 0) {
          this.compositionToDTSShift = stream.readInt32();
          this.leastDecodeToDisplayDelta = stream.readInt32();
          this.greatestDecodeToDisplayDelta = stream.readInt32();
          this.compositionStartTime = stream.readInt32();
          this.compositionEndTime = stream.readInt32();
        }
      });
      BoxParser.createFullBoxCtor("ctts", "CompositionOffsetBox", function(stream) {
        var entry_count2;
        var i2;
        entry_count2 = stream.readUint32();
        this.sample_counts = [];
        this.sample_offsets = [];
        if (this.version === 0) {
          for (i2 = 0; i2 < entry_count2; i2++) {
            this.sample_counts.push(stream.readUint32());
            var value = stream.readInt32();
            if (value < 0) {
              Log.warn("BoxParser", "ctts box uses negative values without using version 1");
            }
            this.sample_offsets.push(value);
          }
        } else if (this.version == 1) {
          for (i2 = 0; i2 < entry_count2; i2++) {
            this.sample_counts.push(stream.readUint32());
            this.sample_offsets.push(stream.readInt32());
          }
        }
      });
      BoxParser.createBoxCtor("dac3", "AC3SpecificBox", function(stream) {
        var tmp_byte1 = stream.readUint8();
        var tmp_byte2 = stream.readUint8();
        var tmp_byte3 = stream.readUint8();
        this.fscod = tmp_byte1 >> 6;
        this.bsid = tmp_byte1 >> 1 & 31;
        this.bsmod = (tmp_byte1 & 1) << 2 | tmp_byte2 >> 6 & 3;
        this.acmod = tmp_byte2 >> 3 & 7;
        this.lfeon = tmp_byte2 >> 2 & 1;
        this.bit_rate_code = tmp_byte2 & 3 | tmp_byte3 >> 5 & 7;
      });
      BoxParser.createBoxCtor("dec3", "EC3SpecificBox", function(stream) {
        var tmp_16 = stream.readUint16();
        this.data_rate = tmp_16 >> 3;
        this.num_ind_sub = tmp_16 & 7;
        this.ind_subs = [];
        for (var i2 = 0; i2 < this.num_ind_sub + 1; i2++) {
          var ind_sub = {};
          this.ind_subs.push(ind_sub);
          var tmp_byte1 = stream.readUint8();
          var tmp_byte2 = stream.readUint8();
          var tmp_byte3 = stream.readUint8();
          ind_sub.fscod = tmp_byte1 >> 6;
          ind_sub.bsid = tmp_byte1 >> 1 & 31;
          ind_sub.bsmod = (tmp_byte1 & 1) << 4 | tmp_byte2 >> 4 & 15;
          ind_sub.acmod = tmp_byte2 >> 1 & 7;
          ind_sub.lfeon = tmp_byte2 & 1;
          ind_sub.num_dep_sub = tmp_byte3 >> 1 & 15;
          if (ind_sub.num_dep_sub > 0) {
            ind_sub.chan_loc = (tmp_byte3 & 1) << 8 | stream.readUint8();
          }
        }
      });
      BoxParser.createFullBoxCtor("dfLa", "FLACSpecificBox", function(stream) {
        var BLOCKTYPE_MASK = 127;
        var LASTMETADATABLOCKFLAG_MASK = 128;
        var boxesFound = [];
        var knownBlockTypes = [
          "STREAMINFO",
          "PADDING",
          "APPLICATION",
          "SEEKTABLE",
          "VORBIS_COMMENT",
          "CUESHEET",
          "PICTURE",
          "RESERVED"
        ];
        do {
          var flagAndType = stream.readUint8();
          var type = Math.min(
            flagAndType & BLOCKTYPE_MASK,
            knownBlockTypes.length - 1
          );
          if (!type) {
            stream.readUint8Array(13);
            this.samplerate = stream.readUint32() >> 12;
            stream.readUint8Array(20);
          } else {
            stream.readUint8Array(stream.readUint24());
          }
          boxesFound.push(knownBlockTypes[type]);
          if (!!(flagAndType & LASTMETADATABLOCKFLAG_MASK)) {
            break;
          }
        } while (true);
        this.numMetadataBlocks = boxesFound.length + " (" + boxesFound.join(", ") + ")";
      });
      BoxParser.createBoxCtor("dimm", "hintimmediateBytesSent", function(stream) {
        this.bytessent = stream.readUint64();
      });
      BoxParser.createBoxCtor("dmax", "hintlongestpacket", function(stream) {
        this.time = stream.readUint32();
      });
      BoxParser.createBoxCtor("dmed", "hintmediaBytesSent", function(stream) {
        this.bytessent = stream.readUint64();
      });
      BoxParser.createBoxCtor("dOps", "OpusSpecificBox", function(stream) {
        this.Version = stream.readUint8();
        this.OutputChannelCount = stream.readUint8();
        this.PreSkip = stream.readUint16();
        this.InputSampleRate = stream.readUint32();
        this.OutputGain = stream.readInt16();
        this.ChannelMappingFamily = stream.readUint8();
        if (this.ChannelMappingFamily !== 0) {
          this.StreamCount = stream.readUint8();
          this.CoupledCount = stream.readUint8();
          this.ChannelMapping = [];
          for (var i2 = 0; i2 < this.OutputChannelCount; i2++) {
            this.ChannelMapping[i2] = stream.readUint8();
          }
        }
      });
      BoxParser.createFullBoxCtor("dref", "DataReferenceBox", function(stream) {
        var ret2;
        var box2;
        this.entries = [];
        var entry_count2 = stream.readUint32();
        for (var i2 = 0; i2 < entry_count2; i2++) {
          ret2 = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret2.code === BoxParser.OK) {
            box2 = ret2.box;
            this.entries.push(box2);
          } else {
            return;
          }
        }
      });
      BoxParser.createBoxCtor("drep", "hintrepeatedBytesSent", function(stream) {
        this.bytessent = stream.readUint64();
      });
      BoxParser.createFullBoxCtor("elng", "ExtendedLanguageBox", function(stream) {
        this.extended_language = stream.readString(this.size - this.hdr_size);
      });
      BoxParser.createFullBoxCtor("elst", "EditListBox", function(stream) {
        this.entries = [];
        var entry_count2 = stream.readUint32();
        for (var i2 = 0; i2 < entry_count2; i2++) {
          var entry = {};
          this.entries.push(entry);
          if (this.version === 1) {
            entry.segment_duration = stream.readUint64();
            entry.media_time = stream.readInt64();
          } else {
            entry.segment_duration = stream.readUint32();
            entry.media_time = stream.readInt32();
          }
          entry.media_rate_integer = stream.readInt16();
          entry.media_rate_fraction = stream.readInt16();
        }
      });
      BoxParser.createFullBoxCtor("emsg", "EventMessageBox", function(stream) {
        if (this.version == 1) {
          this.timescale = stream.readUint32();
          this.presentation_time = stream.readUint64();
          this.event_duration = stream.readUint32();
          this.id = stream.readUint32();
          this.scheme_id_uri = stream.readCString();
          this.value = stream.readCString();
        } else {
          this.scheme_id_uri = stream.readCString();
          this.value = stream.readCString();
          this.timescale = stream.readUint32();
          this.presentation_time_delta = stream.readUint32();
          this.event_duration = stream.readUint32();
          this.id = stream.readUint32();
        }
        var message_size = this.size - this.hdr_size - (4 * 4 + (this.scheme_id_uri.length + 1) + (this.value.length + 1));
        if (this.version == 1) {
          message_size -= 4;
        }
        this.message_data = stream.readUint8Array(message_size);
      });
      BoxParser.createEntityToGroupCtor = function(type, parseMethod) {
        BoxParser[type + "Box"] = function(size) {
          BoxParser.FullBox.call(this, type, size);
        };
        BoxParser[type + "Box"].prototype = new BoxParser.FullBox();
        BoxParser[type + "Box"].prototype.parse = function(stream) {
          this.parseFullHeader(stream);
          if (parseMethod) {
            parseMethod.call(this, stream);
          } else {
            this.group_id = stream.readUint32();
            this.num_entities_in_group = stream.readUint32();
            this.entity_ids = [];
            for (i = 0; i < this.num_entities_in_group; i++) {
              var entity_id = stream.readUint32();
              this.entity_ids.push(entity_id);
            }
          }
        };
      };
      BoxParser.createEntityToGroupCtor("aebr");
      BoxParser.createEntityToGroupCtor("afbr");
      BoxParser.createEntityToGroupCtor("albc");
      BoxParser.createEntityToGroupCtor("altr");
      BoxParser.createEntityToGroupCtor("brst");
      BoxParser.createEntityToGroupCtor("dobr");
      BoxParser.createEntityToGroupCtor("eqiv");
      BoxParser.createEntityToGroupCtor("favc");
      BoxParser.createEntityToGroupCtor("fobr");
      BoxParser.createEntityToGroupCtor("iaug");
      BoxParser.createEntityToGroupCtor("pano");
      BoxParser.createEntityToGroupCtor("slid");
      BoxParser.createEntityToGroupCtor("ster");
      BoxParser.createEntityToGroupCtor("tsyn");
      BoxParser.createEntityToGroupCtor("wbbr");
      BoxParser.createEntityToGroupCtor("prgr");
      BoxParser.createEntityToGroupCtor("pymd", function(stream) {
        this.group_id = stream.readUint32();
        this.num_entities_in_group = stream.readUint32();
        this.entity_ids = [];
        for (var i2 = 0; i2 < this.num_entities_in_group; i2++) {
          var entity_id = stream.readUint32();
          this.entity_ids.push(entity_id);
        }
        this.tile_size_x = stream.readUint16();
        this.tile_size_y = stream.readUint16();
        this.layer_binning = [];
        this.tiles_in_layer_column_minus1 = [];
        this.tiles_in_layer_row_minus1 = [];
        for (i2 = 0; i2 < this.num_entities_in_group; i2++) {
          this.layer_binning[i2] = stream.readUint16();
          this.tiles_in_layer_row_minus1[i2] = stream.readUint16();
          this.tiles_in_layer_column_minus1[i2] = stream.readUint16();
        }
      });
      BoxParser.createFullBoxCtor("esds", "ElementaryStreamDescriptorBox", function(stream) {
        var esd_data = stream.readUint8Array(this.size - this.hdr_size);
        if (typeof MPEG4DescriptorParser !== "undefined") {
          var esd_parser = new MPEG4DescriptorParser();
          this.esd = esd_parser.parseOneDescriptor(new DataStream(esd_data.buffer, 0, DataStream.BIG_ENDIAN));
        }
      });
      BoxParser.createBoxCtor("fiel", "FieldHandlingBox", function(stream) {
        this.fieldCount = stream.readUint8();
        this.fieldOrdering = stream.readUint8();
      });
      BoxParser.createBoxCtor("frma", "OriginalFormatBox", function(stream) {
        this.data_format = stream.readString(4);
      });
      BoxParser.createBoxCtor("ftyp", "FileTypeBox", function(stream) {
        var toparse = this.size - this.hdr_size;
        this.major_brand = stream.readString(4);
        this.minor_version = stream.readUint32();
        toparse -= 8;
        this.compatible_brands = [];
        var i2 = 0;
        while (toparse >= 4) {
          this.compatible_brands[i2] = stream.readString(4);
          toparse -= 4;
          i2++;
        }
      });
      BoxParser.createFullBoxCtor("hdlr", "HandlerBox", function(stream) {
        if (this.version === 0) {
          stream.readUint32();
          this.handler = stream.readString(4);
          stream.readUint32Array(3);
          this.name = stream.readString(this.size - this.hdr_size - 20);
          if (this.name[this.name.length - 1] === "\0") {
            this.name = this.name.slice(0, -1);
          }
        }
      });
      BoxParser.createBoxCtor("hvcC", "HEVCConfigurationBox", function(stream) {
        var i2, j;
        var nb_nalus;
        var length;
        var tmp_byte;
        this.configurationVersion = stream.readUint8();
        tmp_byte = stream.readUint8();
        this.general_profile_space = tmp_byte >> 6;
        this.general_tier_flag = (tmp_byte & 32) >> 5;
        this.general_profile_idc = tmp_byte & 31;
        this.general_profile_compatibility = stream.readUint32();
        this.general_constraint_indicator = stream.readUint8Array(6);
        this.general_level_idc = stream.readUint8();
        this.min_spatial_segmentation_idc = stream.readUint16() & 4095;
        this.parallelismType = stream.readUint8() & 3;
        this.chroma_format_idc = stream.readUint8() & 3;
        this.bit_depth_luma_minus8 = stream.readUint8() & 7;
        this.bit_depth_chroma_minus8 = stream.readUint8() & 7;
        this.avgFrameRate = stream.readUint16();
        tmp_byte = stream.readUint8();
        this.constantFrameRate = tmp_byte >> 6;
        this.numTemporalLayers = (tmp_byte & 13) >> 3;
        this.temporalIdNested = (tmp_byte & 4) >> 2;
        this.lengthSizeMinusOne = tmp_byte & 3;
        this.nalu_arrays = [];
        this.nalu_arrays.toString = function() {
          var str = "<table class='inner-table'>";
          str += "<thead><tr><th>completeness</th><th>nalu_type</th><th>nalu_data</th></tr></thead>";
          str += "<tbody>";
          for (var i3 = 0; i3 < this.length; i3++) {
            var nalu_array2 = this[i3];
            str += "<tr>";
            str += "<td rowspan='" + nalu_array2.length + "'>" + nalu_array2.completeness + "</td>";
            str += "<td rowspan='" + nalu_array2.length + "'>" + nalu_array2.nalu_type + "</td>";
            for (var j2 = 0; j2 < nalu_array2.length; j2++) {
              var nalu2 = nalu_array2[j2];
              if (j2 !== 0) str += "<tr>";
              str += "<td>";
              str += nalu2.data.reduce(function(str2, byte) {
                return str2 + byte.toString(16).padStart(2, "0");
              }, "0x");
              str += "</td></tr>";
            }
          }
          str += "</tbody></table>";
          return str;
        };
        var numOfArrays = stream.readUint8();
        for (i2 = 0; i2 < numOfArrays; i2++) {
          var nalu_array = [];
          this.nalu_arrays.push(nalu_array);
          tmp_byte = stream.readUint8();
          nalu_array.completeness = (tmp_byte & 128) >> 7;
          nalu_array.nalu_type = tmp_byte & 63;
          var numNalus = stream.readUint16();
          for (j = 0; j < numNalus; j++) {
            var nalu = {};
            nalu_array.push(nalu);
            length = stream.readUint16();
            nalu.data = stream.readUint8Array(length);
          }
        }
      });
      BoxParser.createFullBoxCtor("iinf", "ItemInfoBox", function(stream) {
        var ret2;
        if (this.version === 0) {
          this.entry_count = stream.readUint16();
        } else {
          this.entry_count = stream.readUint32();
        }
        this.item_infos = [];
        for (var i2 = 0; i2 < this.entry_count; i2++) {
          ret2 = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret2.code === BoxParser.OK) {
            if (ret2.box.type !== "infe") {
              Log.error("BoxParser", "Expected 'infe' box, got " + ret2.box.type);
            }
            this.item_infos[i2] = ret2.box;
          } else {
            return;
          }
        }
      });
      BoxParser.createFullBoxCtor("iloc", "ItemLocationBox", function(stream) {
        var byte;
        byte = stream.readUint8();
        this.offset_size = byte >> 4 & 15;
        this.length_size = byte & 15;
        byte = stream.readUint8();
        this.base_offset_size = byte >> 4 & 15;
        if (this.version === 1 || this.version === 2) {
          this.index_size = byte & 15;
        } else {
          this.index_size = 0;
        }
        this.items = [];
        var item_count = 0;
        if (this.version < 2) {
          item_count = stream.readUint16();
        } else if (this.version === 2) {
          item_count = stream.readUint32();
        } else {
          throw "version of iloc box not supported";
        }
        for (var i2 = 0; i2 < item_count; i2++) {
          var item = {};
          this.items.push(item);
          if (this.version < 2) {
            item.item_ID = stream.readUint16();
          } else if (this.version === 2) {
            item.item_ID = stream.readUint32();
          } else {
            throw "version of iloc box not supported";
          }
          if (this.version === 1 || this.version === 2) {
            item.construction_method = stream.readUint16() & 15;
          } else {
            item.construction_method = 0;
          }
          item.data_reference_index = stream.readUint16();
          switch (this.base_offset_size) {
            case 0:
              item.base_offset = 0;
              break;
            case 4:
              item.base_offset = stream.readUint32();
              break;
            case 8:
              item.base_offset = stream.readUint64();
              break;
            default:
              throw "Error reading base offset size";
          }
          var extent_count = stream.readUint16();
          item.extents = [];
          for (var j = 0; j < extent_count; j++) {
            var extent = {};
            item.extents.push(extent);
            if (this.version === 1 || this.version === 2) {
              switch (this.index_size) {
                case 0:
                  extent.extent_index = 0;
                  break;
                case 4:
                  extent.extent_index = stream.readUint32();
                  break;
                case 8:
                  extent.extent_index = stream.readUint64();
                  break;
                default:
                  throw "Error reading extent index";
              }
            }
            switch (this.offset_size) {
              case 0:
                extent.extent_offset = 0;
                break;
              case 4:
                extent.extent_offset = stream.readUint32();
                break;
              case 8:
                extent.extent_offset = stream.readUint64();
                break;
              default:
                throw "Error reading extent index";
            }
            switch (this.length_size) {
              case 0:
                extent.extent_length = 0;
                break;
              case 4:
                extent.extent_length = stream.readUint32();
                break;
              case 8:
                extent.extent_length = stream.readUint64();
                break;
              default:
                throw "Error reading extent index";
            }
          }
        }
      });
      BoxParser.createBoxCtor("imir", "ImageMirror", function(stream) {
        var tmp = stream.readUint8();
        this.reserved = tmp >> 7;
        this.axis = tmp & 1;
      });
      BoxParser.createFullBoxCtor("infe", "ItemInfoEntry", function(stream) {
        if (this.version === 0 || this.version === 1) {
          this.item_ID = stream.readUint16();
          this.item_protection_index = stream.readUint16();
          this.item_name = stream.readCString();
          this.content_type = stream.readCString();
          this.content_encoding = stream.readCString();
        }
        if (this.version === 1) {
          this.extension_type = stream.readString(4);
          Log.warn("BoxParser", "Cannot parse extension type");
          stream.seek(this.start + this.size);
          return;
        }
        if (this.version >= 2) {
          if (this.version === 2) {
            this.item_ID = stream.readUint16();
          } else if (this.version === 3) {
            this.item_ID = stream.readUint32();
          }
          this.item_protection_index = stream.readUint16();
          this.item_type = stream.readString(4);
          this.item_name = stream.readCString();
          if (this.item_type === "mime") {
            this.content_type = stream.readCString();
            this.content_encoding = stream.readCString();
          } else if (this.item_type === "uri ") {
            this.item_uri_type = stream.readCString();
          }
        }
      });
      BoxParser.createFullBoxCtor("ipma", "ItemPropertyAssociationBox", function(stream) {
        var i2, j;
        entry_count = stream.readUint32();
        this.associations = [];
        for (i2 = 0; i2 < entry_count; i2++) {
          var item_assoc = {};
          this.associations.push(item_assoc);
          if (this.version < 1) {
            item_assoc.id = stream.readUint16();
          } else {
            item_assoc.id = stream.readUint32();
          }
          var association_count = stream.readUint8();
          item_assoc.props = [];
          for (j = 0; j < association_count; j++) {
            var tmp = stream.readUint8();
            var p = {};
            item_assoc.props.push(p);
            p.essential = (tmp & 128) >> 7 === 1;
            if (this.flags & 1) {
              p.property_index = (tmp & 127) << 8 | stream.readUint8();
            } else {
              p.property_index = tmp & 127;
            }
          }
        }
      });
      BoxParser.createFullBoxCtor("iref", "ItemReferenceBox", function(stream) {
        var ret2;
        var entryCount;
        var box2;
        this.references = [];
        while (stream.getPosition() < this.start + this.size) {
          ret2 = BoxParser.parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
          if (ret2.code === BoxParser.OK) {
            if (this.version === 0) {
              box2 = new BoxParser.SingleItemTypeReferenceBox(ret2.type, ret2.size, ret2.hdr_size, ret2.start);
            } else {
              box2 = new BoxParser.SingleItemTypeReferenceBoxLarge(ret2.type, ret2.size, ret2.hdr_size, ret2.start);
            }
            if (box2.write === BoxParser.Box.prototype.write && box2.type !== "mdat") {
              Log.warn("BoxParser", box2.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
              box2.parseDataAndRewind(stream);
            }
            box2.parse(stream);
            this.references.push(box2);
          } else {
            return;
          }
        }
      });
      BoxParser.createBoxCtor("irot", "ImageRotation", function(stream) {
        this.angle = stream.readUint8() & 3;
      });
      BoxParser.createFullBoxCtor("ispe", "ImageSpatialExtentsProperty", function(stream) {
        this.image_width = stream.readUint32();
        this.image_height = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("kind", "KindBox", function(stream) {
        this.schemeURI = stream.readCString();
        this.value = stream.readCString();
      });
      BoxParser.createFullBoxCtor("leva", "LevelAssignmentBox", function(stream) {
        var count = stream.readUint8();
        this.levels = [];
        for (var i2 = 0; i2 < count; i2++) {
          var level = {};
          this.levels[i2] = level;
          level.track_ID = stream.readUint32();
          var tmp_byte = stream.readUint8();
          level.padding_flag = tmp_byte >> 7;
          level.assignment_type = tmp_byte & 127;
          switch (level.assignment_type) {
            case 0:
              level.grouping_type = stream.readString(4);
              break;
            case 1:
              level.grouping_type = stream.readString(4);
              level.grouping_type_parameter = stream.readUint32();
              break;
            case 2:
              break;
            case 3:
              break;
            case 4:
              level.sub_track_id = stream.readUint32();
              break;
            default:
              Log.warn("BoxParser", "Unknown leva assignement type");
          }
        }
      });
      BoxParser.createBoxCtor("lhvC", "LHEVCConfigurationBox", function(stream) {
        var i2, j;
        var tmp_byte;
        this.configurationVersion = stream.readUint8();
        this.min_spatial_segmentation_idc = stream.readUint16() & 4095;
        this.parallelismType = stream.readUint8() & 3;
        tmp_byte = stream.readUint8();
        this.numTemporalLayers = (tmp_byte & 13) >> 3;
        this.temporalIdNested = (tmp_byte & 4) >> 2;
        this.lengthSizeMinusOne = tmp_byte & 3;
        this.nalu_arrays = [];
        this.nalu_arrays.toString = function() {
          var str = "<table class='inner-table'>";
          str += "<thead><tr><th>completeness</th><th>nalu_type</th><th>nalu_data</th></tr></thead>";
          str += "<tbody>";
          for (var i3 = 0; i3 < this.length; i3++) {
            var nalu_array2 = this[i3];
            str += "<tr>";
            str += "<td rowspan='" + nalu_array2.length + "'>" + nalu_array2.completeness + "</td>";
            str += "<td rowspan='" + nalu_array2.length + "'>" + nalu_array2.nalu_type + "</td>";
            for (var j2 = 0; j2 < nalu_array2.length; j2++) {
              var nalu2 = nalu_array2[j2];
              if (j2 !== 0) str += "<tr>";
              str += "<td>";
              str += nalu2.data.reduce(function(str2, byte) {
                return str2 + byte.toString(16).padStart(2, "0");
              }, "0x");
              str += "</td></tr>";
            }
          }
          str += "</tbody></table>";
          return str;
        };
        var numOfArrays = stream.readUint8();
        for (i2 = 0; i2 < numOfArrays; i2++) {
          var nalu_array = [];
          this.nalu_arrays.push(nalu_array);
          tmp_byte = stream.readUint8();
          nalu_array.completeness = (tmp_byte & 128) >> 7;
          nalu_array.nalu_type = tmp_byte & 63;
          var numNalus = stream.readUint16();
          for (j = 0; j < numNalus; j++) {
            var nalu = {};
            nalu_array.push(nalu);
            var length = stream.readUint16();
            nalu.data = stream.readUint8Array(length);
          }
        }
      });
      BoxParser.createBoxCtor("lsel", "LayerSelectorProperty", function(stream) {
        this.layer_id = stream.readUint16();
      });
      BoxParser.createBoxCtor("maxr", "hintmaxrate", function(stream) {
        this.period = stream.readUint32();
        this.bytes = stream.readUint32();
      });
      function ColorPoint(x, y) {
        this.x = x;
        this.y = y;
      }
      ColorPoint.prototype.toString = function() {
        return "(" + this.x + "," + this.y + ")";
      };
      BoxParser.createBoxCtor("mdcv", "MasteringDisplayColourVolumeBox", function(stream) {
        this.display_primaries = [];
        this.display_primaries[0] = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.display_primaries[1] = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.display_primaries[2] = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.white_point = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.max_display_mastering_luminance = stream.readUint32();
        this.min_display_mastering_luminance = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("mdhd", "MediaHeaderBox", function(stream) {
        if (this.version == 1) {
          this.creation_time = stream.readUint64();
          this.modification_time = stream.readUint64();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint64();
        } else {
          this.creation_time = stream.readUint32();
          this.modification_time = stream.readUint32();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint32();
        }
        this.parseLanguage(stream);
        stream.readUint16();
      });
      BoxParser.createFullBoxCtor("mehd", "MovieExtendsHeaderBox", function(stream) {
        if (this.flags & 1) {
          Log.warn("BoxParser", "mehd box incorrectly uses flags set to 1, converting version to 1");
          this.version = 1;
        }
        if (this.version == 1) {
          this.fragment_duration = stream.readUint64();
        } else {
          this.fragment_duration = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("meta", "MetaBox", function(stream) {
        this.boxes = [];
        BoxParser.ContainerBox.prototype.parse.call(this, stream);
      });
      BoxParser.createFullBoxCtor("mfhd", "MovieFragmentHeaderBox", function(stream) {
        this.sequence_number = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("mfro", "MovieFragmentRandomAccessOffsetBox", function(stream) {
        this._size = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("mskC", "MaskConfigurationProperty", function(stream) {
        this.bits_per_pixel = stream.readUint8();
      });
      BoxParser.createFullBoxCtor("mvhd", "MovieHeaderBox", function(stream) {
        if (this.version == 1) {
          this.creation_time = stream.readUint64();
          this.modification_time = stream.readUint64();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint64();
        } else {
          this.creation_time = stream.readUint32();
          this.modification_time = stream.readUint32();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint32();
        }
        this.rate = stream.readUint32();
        this.volume = stream.readUint16() >> 8;
        stream.readUint16();
        stream.readUint32Array(2);
        this.matrix = stream.readUint32Array(9);
        stream.readUint32Array(6);
        this.next_track_id = stream.readUint32();
      });
      BoxParser.createBoxCtor("npck", "hintPacketsSent", function(stream) {
        this.packetssent = stream.readUint32();
      });
      BoxParser.createBoxCtor("nump", "hintPacketsSent", function(stream) {
        this.packetssent = stream.readUint64();
      });
      BoxParser.createFullBoxCtor("padb", "PaddingBitsBox", function(stream) {
        var sample_count = stream.readUint32();
        this.padbits = [];
        for (var i2 = 0; i2 < Math.floor((sample_count + 1) / 2); i2++) {
          this.padbits = stream.readUint8();
        }
      });
      BoxParser.createBoxCtor("pasp", "PixelAspectRatioBox", function(stream) {
        this.hSpacing = stream.readUint32();
        this.vSpacing = stream.readUint32();
      });
      BoxParser.createBoxCtor("payl", "CuePayloadBox", function(stream) {
        this.text = stream.readString(this.size - this.hdr_size);
      });
      BoxParser.createBoxCtor("payt", "hintpayloadID", function(stream) {
        this.payloadID = stream.readUint32();
        var count = stream.readUint8();
        this.rtpmap_string = stream.readString(count);
      });
      BoxParser.createFullBoxCtor("pdin", "ProgressiveDownloadInfoBox", function(stream) {
        var count = (this.size - this.hdr_size) / 8;
        this.rate = [];
        this.initial_delay = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.rate[i2] = stream.readUint32();
          this.initial_delay[i2] = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("pitm", "PrimaryItemBox", function(stream) {
        if (this.version === 0) {
          this.item_id = stream.readUint16();
        } else {
          this.item_id = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("pixi", "PixelInformationProperty", function(stream) {
        var i2;
        this.num_channels = stream.readUint8();
        this.bits_per_channels = [];
        for (i2 = 0; i2 < this.num_channels; i2++) {
          this.bits_per_channels[i2] = stream.readUint8();
        }
      });
      BoxParser.createBoxCtor("pmax", "hintlargestpacket", function(stream) {
        this.bytes = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("prdi", "ProgressiveDerivedImageItemInformationProperty", function(stream) {
        this.step_count = stream.readUint16();
        this.item_count = [];
        if (this.flags & 2) {
          for (var i2 = 0; i2 < this.step_count; i2++) {
            this.item_count[i2] = stream.readUint16();
          }
        }
      });
      BoxParser.createFullBoxCtor("prft", "ProducerReferenceTimeBox", function(stream) {
        this.ref_track_id = stream.readUint32();
        this.ntp_timestamp = stream.readUint64();
        if (this.version === 0) {
          this.media_time = stream.readUint32();
        } else {
          this.media_time = stream.readUint64();
        }
      });
      BoxParser.createFullBoxCtor("pssh", "ProtectionSystemSpecificHeaderBox", function(stream) {
        this.system_id = BoxParser.parseHex16(stream);
        if (this.version > 0) {
          var count = stream.readUint32();
          this.kid = [];
          for (var i2 = 0; i2 < count; i2++) {
            this.kid[i2] = BoxParser.parseHex16(stream);
          }
        }
        var datasize = stream.readUint32();
        if (datasize > 0) {
          this.data = stream.readUint8Array(datasize);
        }
      });
      BoxParser.createFullBoxCtor("clef", "TrackCleanApertureDimensionsBox", function(stream) {
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("enof", "TrackEncodedPixelsDimensionsBox", function(stream) {
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("prof", "TrackProductionApertureDimensionsBox", function(stream) {
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      });
      BoxParser.createContainerBoxCtor("tapt", "TrackApertureModeDimensionsBox", null, ["clef", "prof", "enof"]);
      BoxParser.createBoxCtor("rtp ", "rtpmoviehintinformation", function(stream) {
        this.descriptionformat = stream.readString(4);
        this.sdptext = stream.readString(this.size - this.hdr_size - 4);
      });
      BoxParser.createFullBoxCtor("saio", "SampleAuxiliaryInformationOffsetsBox", function(stream) {
        if (this.flags & 1) {
          this.aux_info_type = stream.readString(4);
          this.aux_info_type_parameter = stream.readUint32();
        }
        var count = stream.readUint32();
        this.offset = [];
        for (var i2 = 0; i2 < count; i2++) {
          if (this.version === 0) {
            this.offset[i2] = stream.readUint32();
          } else {
            this.offset[i2] = stream.readUint64();
          }
        }
      });
      BoxParser.createFullBoxCtor("saiz", "SampleAuxiliaryInformationSizesBox", function(stream) {
        if (this.flags & 1) {
          this.aux_info_type = stream.readString(4);
          this.aux_info_type_parameter = stream.readUint32();
        }
        this.default_sample_info_size = stream.readUint8();
        this.sample_count = stream.readUint32();
        this.sample_info_size = [];
        if (this.default_sample_info_size === 0) {
          for (var i2 = 0; i2 < this.sample_count; i2++) {
            this.sample_info_size[i2] = stream.readUint8();
          }
        }
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "mett", function(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.mime_format = stream.readCString();
        this.parseFooter(stream);
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "metx", function(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.namespace = stream.readCString();
        this.schema_location = stream.readCString();
        this.parseFooter(stream);
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "sbtt", function(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.mime_format = stream.readCString();
        this.parseFooter(stream);
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "stpp", function(stream) {
        this.parseHeader(stream);
        this.namespace = stream.readCString();
        this.schema_location = stream.readCString();
        this.auxiliary_mime_types = stream.readCString();
        this.parseFooter(stream);
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "stxt", function(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.mime_format = stream.readCString();
        this.parseFooter(stream);
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "tx3g", function(stream) {
        this.parseHeader(stream);
        this.displayFlags = stream.readUint32();
        this.horizontal_justification = stream.readInt8();
        this.vertical_justification = stream.readInt8();
        this.bg_color_rgba = stream.readUint8Array(4);
        this.box_record = stream.readInt16Array(4);
        this.style_record = stream.readUint8Array(12);
        this.parseFooter(stream);
      });
      BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "wvtt", function(stream) {
        this.parseHeader(stream);
        this.parseFooter(stream);
      });
      BoxParser.createSampleGroupCtor("alst", function(stream) {
        var i2;
        var roll_count = stream.readUint16();
        this.first_output_sample = stream.readUint16();
        this.sample_offset = [];
        for (i2 = 0; i2 < roll_count; i2++) {
          this.sample_offset[i2] = stream.readUint32();
        }
        var remaining = this.description_length - 4 - 4 * roll_count;
        this.num_output_samples = [];
        this.num_total_samples = [];
        for (i2 = 0; i2 < remaining / 4; i2++) {
          this.num_output_samples[i2] = stream.readUint16();
          this.num_total_samples[i2] = stream.readUint16();
        }
      });
      BoxParser.createSampleGroupCtor("avll", function(stream) {
        this.layerNumber = stream.readUint8();
        this.accurateStatisticsFlag = stream.readUint8();
        this.avgBitRate = stream.readUint16();
        this.avgFrameRate = stream.readUint16();
      });
      BoxParser.createSampleGroupCtor("avss", function(stream) {
        this.subSequenceIdentifier = stream.readUint16();
        this.layerNumber = stream.readUint8();
        var tmp_byte = stream.readUint8();
        this.durationFlag = tmp_byte >> 7;
        this.avgRateFlag = tmp_byte >> 6 & 1;
        if (this.durationFlag) {
          this.duration = stream.readUint32();
        }
        if (this.avgRateFlag) {
          this.accurateStatisticsFlag = stream.readUint8();
          this.avgBitRate = stream.readUint16();
          this.avgFrameRate = stream.readUint16();
        }
        this.dependency = [];
        var numReferences = stream.readUint8();
        for (var i2 = 0; i2 < numReferences; i2++) {
          var dependencyInfo = {};
          this.dependency.push(dependencyInfo);
          dependencyInfo.subSeqDirectionFlag = stream.readUint8();
          dependencyInfo.layerNumber = stream.readUint8();
          dependencyInfo.subSequenceIdentifier = stream.readUint16();
        }
      });
      BoxParser.createSampleGroupCtor("dtrt", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createSampleGroupCtor("mvif", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createSampleGroupCtor("prol", function(stream) {
        this.roll_distance = stream.readInt16();
      });
      BoxParser.createSampleGroupCtor("rap ", function(stream) {
        var tmp_byte = stream.readUint8();
        this.num_leading_samples_known = tmp_byte >> 7;
        this.num_leading_samples = tmp_byte & 127;
      });
      BoxParser.createSampleGroupCtor("rash", function(stream) {
        this.operation_point_count = stream.readUint16();
        if (this.description_length !== 2 + (this.operation_point_count === 1 ? 2 : this.operation_point_count * 6) + 9) {
          Log.warn("BoxParser", "Mismatch in " + this.grouping_type + " sample group length");
          this.data = stream.readUint8Array(this.description_length - 2);
        } else {
          if (this.operation_point_count === 1) {
            this.target_rate_share = stream.readUint16();
          } else {
            this.target_rate_share = [];
            this.available_bitrate = [];
            for (var i2 = 0; i2 < this.operation_point_count; i2++) {
              this.available_bitrate[i2] = stream.readUint32();
              this.target_rate_share[i2] = stream.readUint16();
            }
          }
          this.maximum_bitrate = stream.readUint32();
          this.minimum_bitrate = stream.readUint32();
          this.discard_priority = stream.readUint8();
        }
      });
      BoxParser.createSampleGroupCtor("roll", function(stream) {
        this.roll_distance = stream.readInt16();
      });
      BoxParser.SampleGroupEntry.prototype.parse = function(stream) {
        Log.warn("BoxParser", "Unknown Sample Group type: " + this.grouping_type);
        this.data = stream.readUint8Array(this.description_length);
      };
      BoxParser.createSampleGroupCtor("scif", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createSampleGroupCtor("scnm", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createSampleGroupCtor("seig", function(stream) {
        this.reserved = stream.readUint8();
        var tmp = stream.readUint8();
        this.crypt_byte_block = tmp >> 4;
        this.skip_byte_block = tmp & 15;
        this.isProtected = stream.readUint8();
        this.Per_Sample_IV_Size = stream.readUint8();
        this.KID = BoxParser.parseHex16(stream);
        this.constant_IV_size = 0;
        this.constant_IV = 0;
        if (this.isProtected === 1 && this.Per_Sample_IV_Size === 0) {
          this.constant_IV_size = stream.readUint8();
          this.constant_IV = stream.readUint8Array(this.constant_IV_size);
        }
      });
      BoxParser.createSampleGroupCtor("stsa", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createSampleGroupCtor("sync", function(stream) {
        var tmp_byte = stream.readUint8();
        this.NAL_unit_type = tmp_byte & 63;
      });
      BoxParser.createSampleGroupCtor("tele", function(stream) {
        var tmp_byte = stream.readUint8();
        this.level_independently_decodable = tmp_byte >> 7;
      });
      BoxParser.createSampleGroupCtor("tsas", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createSampleGroupCtor("tscl", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createSampleGroupCtor("vipr", function(stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      });
      BoxParser.createFullBoxCtor("sbgp", "SampleToGroupBox", function(stream) {
        this.grouping_type = stream.readString(4);
        if (this.version === 1) {
          this.grouping_type_parameter = stream.readUint32();
        } else {
          this.grouping_type_parameter = 0;
        }
        this.entries = [];
        var entry_count2 = stream.readUint32();
        for (var i2 = 0; i2 < entry_count2; i2++) {
          var entry = {};
          this.entries.push(entry);
          entry.sample_count = stream.readInt32();
          entry.group_description_index = stream.readInt32();
        }
      });
      function Pixel(row, col) {
        this.bad_pixel_row = row;
        this.bad_pixel_column = col;
      }
      Pixel.prototype.toString = function pixelToString() {
        return "[row: " + this.bad_pixel_row + ", column: " + this.bad_pixel_column + "]";
      };
      BoxParser.createFullBoxCtor("sbpm", "SensorBadPixelsMapBox", function(stream) {
        var i2;
        this.component_count = stream.readUint16();
        this.component_index = [];
        for (i2 = 0; i2 < this.component_count; i2++) {
          this.component_index.push(stream.readUint16());
        }
        var flags = stream.readUint8();
        this.correction_applied = 128 == (flags & 128);
        this.num_bad_rows = stream.readUint32();
        this.num_bad_cols = stream.readUint32();
        this.num_bad_pixels = stream.readUint32();
        this.bad_rows = [];
        this.bad_columns = [];
        this.bad_pixels = [];
        for (i2 = 0; i2 < this.num_bad_rows; i2++) {
          this.bad_rows.push(stream.readUint32());
        }
        for (i2 = 0; i2 < this.num_bad_cols; i2++) {
          this.bad_columns.push(stream.readUint32());
        }
        for (i2 = 0; i2 < this.num_bad_pixels; i2++) {
          var row = stream.readUint32();
          var col = stream.readUint32();
          this.bad_pixels.push(new Pixel(row, col));
        }
      });
      BoxParser.createFullBoxCtor("schm", "SchemeTypeBox", function(stream) {
        this.scheme_type = stream.readString(4);
        this.scheme_version = stream.readUint32();
        if (this.flags & 1) {
          this.scheme_uri = stream.readString(this.size - this.hdr_size - 8);
        }
      });
      BoxParser.createBoxCtor("sdp ", "rtptracksdphintinformation", function(stream) {
        this.sdptext = stream.readString(this.size - this.hdr_size);
      });
      BoxParser.createFullBoxCtor("sdtp", "SampleDependencyTypeBox", function(stream) {
        var tmp_byte;
        var count = this.size - this.hdr_size;
        this.is_leading = [];
        this.sample_depends_on = [];
        this.sample_is_depended_on = [];
        this.sample_has_redundancy = [];
        for (var i2 = 0; i2 < count; i2++) {
          tmp_byte = stream.readUint8();
          this.is_leading[i2] = tmp_byte >> 6;
          this.sample_depends_on[i2] = tmp_byte >> 4 & 3;
          this.sample_is_depended_on[i2] = tmp_byte >> 2 & 3;
          this.sample_has_redundancy[i2] = tmp_byte & 3;
        }
      });
      BoxParser.createFullBoxCtor(
        "senc",
        "SampleEncryptionBox"
        /*, function(stream) {
        	this.parseFullHeader(stream);
        	var sample_count = stream.readUint32();
        	this.samples = [];
        	for (var i = 0; i < sample_count; i++) {
        		var sample = {};
        		// tenc.default_Per_Sample_IV_Size or seig.Per_Sample_IV_Size
        		sample.InitializationVector = this.readUint8Array(Per_Sample_IV_Size*8);
        		if (this.flags & 0x2) {
        			sample.subsamples = [];
        			subsample_count = stream.readUint16();
        			for (var j = 0; j < subsample_count; j++) {
        				var subsample = {};
        				subsample.BytesOfClearData = stream.readUint16();
        				subsample.BytesOfProtectedData = stream.readUint32();
        				sample.subsamples.push(subsample);
        			}
        		}
        		// TODO
        		this.samples.push(sample);
        	}
        }*/
      );
      BoxParser.createFullBoxCtor("sgpd", "SampleGroupDescriptionBox", function(stream) {
        this.grouping_type = stream.readString(4);
        Log.debug("BoxParser", "Found Sample Groups of type " + this.grouping_type);
        if (this.version === 1) {
          this.default_length = stream.readUint32();
        } else {
          this.default_length = 0;
        }
        if (this.version >= 2) {
          this.default_group_description_index = stream.readUint32();
        }
        this.entries = [];
        var entry_count2 = stream.readUint32();
        for (var i2 = 0; i2 < entry_count2; i2++) {
          var entry;
          if (BoxParser[this.grouping_type + "SampleGroupEntry"]) {
            entry = new BoxParser[this.grouping_type + "SampleGroupEntry"](this.grouping_type);
          } else {
            entry = new BoxParser.SampleGroupEntry(this.grouping_type);
          }
          this.entries.push(entry);
          if (this.version === 1) {
            if (this.default_length === 0) {
              entry.description_length = stream.readUint32();
            } else {
              entry.description_length = this.default_length;
            }
          } else {
            entry.description_length = this.default_length;
          }
          if (entry.write === BoxParser.SampleGroupEntry.prototype.write) {
            Log.info("BoxParser", "SampleGroup for type " + this.grouping_type + " writing not yet implemented, keeping unparsed data in memory for later write");
            entry.data = stream.readUint8Array(entry.description_length);
            stream.position -= entry.description_length;
          }
          entry.parse(stream);
        }
      });
      BoxParser.createFullBoxCtor("sidx", "CompressedSegmentIndexBox", function(stream) {
        this.reference_ID = stream.readUint32();
        this.timescale = stream.readUint32();
        if (this.version === 0) {
          this.earliest_presentation_time = stream.readUint32();
          this.first_offset = stream.readUint32();
        } else {
          this.earliest_presentation_time = stream.readUint64();
          this.first_offset = stream.readUint64();
        }
        stream.readUint16();
        this.references = [];
        var count = stream.readUint16();
        for (var i2 = 0; i2 < count; i2++) {
          var ref = {};
          this.references.push(ref);
          var tmp_32 = stream.readUint32();
          ref.reference_type = tmp_32 >> 31 & 1;
          ref.referenced_size = tmp_32 & 2147483647;
          ref.subsegment_duration = stream.readUint32();
          tmp_32 = stream.readUint32();
          ref.starts_with_SAP = tmp_32 >> 31 & 1;
          ref.SAP_type = tmp_32 >> 28 & 7;
          ref.SAP_delta_time = tmp_32 & 268435455;
        }
      });
      BoxParser.SingleItemTypeReferenceBox = function(type, size, hdr_size, start) {
        BoxParser.Box.call(this, type, size);
        this.hdr_size = hdr_size;
        this.start = start;
      };
      BoxParser.SingleItemTypeReferenceBox.prototype = new BoxParser.Box();
      BoxParser.SingleItemTypeReferenceBox.prototype.parse = function(stream) {
        this.from_item_ID = stream.readUint16();
        var count = stream.readUint16();
        this.references = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.references[i2] = {};
          this.references[i2].to_item_ID = stream.readUint16();
        }
      };
      BoxParser.SingleItemTypeReferenceBoxLarge = function(type, size, hdr_size, start) {
        BoxParser.Box.call(this, type, size);
        this.hdr_size = hdr_size;
        this.start = start;
      };
      BoxParser.SingleItemTypeReferenceBoxLarge.prototype = new BoxParser.Box();
      BoxParser.SingleItemTypeReferenceBoxLarge.prototype.parse = function(stream) {
        this.from_item_ID = stream.readUint32();
        var count = stream.readUint16();
        this.references = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.references[i2] = {};
          this.references[i2].to_item_ID = stream.readUint32();
        }
      };
      BoxParser.createFullBoxCtor("SmDm", "SMPTE2086MasteringDisplayMetadataBox", function(stream) {
        this.primaryRChromaticity_x = stream.readUint16();
        this.primaryRChromaticity_y = stream.readUint16();
        this.primaryGChromaticity_x = stream.readUint16();
        this.primaryGChromaticity_y = stream.readUint16();
        this.primaryBChromaticity_x = stream.readUint16();
        this.primaryBChromaticity_y = stream.readUint16();
        this.whitePointChromaticity_x = stream.readUint16();
        this.whitePointChromaticity_y = stream.readUint16();
        this.luminanceMax = stream.readUint32();
        this.luminanceMin = stream.readUint32();
      });
      BoxParser.createFullBoxCtor("smhd", "SoundMediaHeaderBox", function(stream) {
        this.balance = stream.readUint16();
        stream.readUint16();
      });
      BoxParser.createFullBoxCtor("ssix", "CompressedSubsegmentIndexBox", function(stream) {
        this.subsegments = [];
        var subsegment_count = stream.readUint32();
        for (var i2 = 0; i2 < subsegment_count; i2++) {
          var subsegment = {};
          this.subsegments.push(subsegment);
          subsegment.ranges = [];
          var range_count = stream.readUint32();
          for (var j = 0; j < range_count; j++) {
            var range = {};
            subsegment.ranges.push(range);
            range.level = stream.readUint8();
            range.range_size = stream.readUint24();
          }
        }
      });
      BoxParser.createFullBoxCtor("stco", "ChunkOffsetBox", function(stream) {
        var entry_count2;
        entry_count2 = stream.readUint32();
        this.chunk_offsets = [];
        if (this.version === 0) {
          for (var i2 = 0; i2 < entry_count2; i2++) {
            this.chunk_offsets.push(stream.readUint32());
          }
        }
      });
      BoxParser.createFullBoxCtor("stdp", "DegradationPriorityBox", function(stream) {
        var count = (this.size - this.hdr_size) / 2;
        this.priority = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.priority[i2] = stream.readUint16();
        }
      });
      BoxParser.createFullBoxCtor("sthd", "SubtitleMediaHeaderBox");
      BoxParser.createFullBoxCtor("stri", "SubTrackInformationBox", function(stream) {
        this.switch_group = stream.readUint16();
        this.alternate_group = stream.readUint16();
        this.sub_track_id = stream.readUint32();
        var count = (this.size - this.hdr_size - 8) / 4;
        this.attribute_list = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.attribute_list[i2] = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("stsc", "SampleToChunkBox", function(stream) {
        var entry_count2;
        var i2;
        entry_count2 = stream.readUint32();
        this.first_chunk = [];
        this.samples_per_chunk = [];
        this.sample_description_index = [];
        if (this.version === 0) {
          for (i2 = 0; i2 < entry_count2; i2++) {
            this.first_chunk.push(stream.readUint32());
            this.samples_per_chunk.push(stream.readUint32());
            this.sample_description_index.push(stream.readUint32());
          }
        }
      });
      BoxParser.createFullBoxCtor("stsd", "SampleDescriptionBox", function(stream) {
        var i2;
        var ret2;
        var entryCount;
        var box2;
        this.entries = [];
        entryCount = stream.readUint32();
        for (i2 = 1; i2 <= entryCount; i2++) {
          ret2 = BoxParser.parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
          if (ret2.code === BoxParser.OK) {
            if (BoxParser[ret2.type + "SampleEntry"]) {
              box2 = new BoxParser[ret2.type + "SampleEntry"](ret2.size);
              box2.hdr_size = ret2.hdr_size;
              box2.start = ret2.start;
            } else {
              Log.warn("BoxParser", "Unknown sample entry type: " + ret2.type);
              box2 = new BoxParser.SampleEntry(ret2.type, ret2.size, ret2.hdr_size, ret2.start);
            }
            if (box2.write === BoxParser.SampleEntry.prototype.write) {
              Log.info("BoxParser", "SampleEntry " + box2.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
              box2.parseDataAndRewind(stream);
            }
            box2.parse(stream);
            this.entries.push(box2);
          } else {
            return;
          }
        }
      });
      BoxParser.createFullBoxCtor("stsg", "SubTrackSampleGroupBox", function(stream) {
        this.grouping_type = stream.readUint32();
        var count = stream.readUint16();
        this.group_description_index = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.group_description_index[i2] = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("stsh", "ShadowSyncSampleBox", function(stream) {
        var entry_count2;
        var i2;
        entry_count2 = stream.readUint32();
        this.shadowed_sample_numbers = [];
        this.sync_sample_numbers = [];
        if (this.version === 0) {
          for (i2 = 0; i2 < entry_count2; i2++) {
            this.shadowed_sample_numbers.push(stream.readUint32());
            this.sync_sample_numbers.push(stream.readUint32());
          }
        }
      });
      BoxParser.createFullBoxCtor("stss", "SyncSampleBox", function(stream) {
        var i2;
        var entry_count2;
        entry_count2 = stream.readUint32();
        if (this.version === 0) {
          this.sample_numbers = [];
          for (i2 = 0; i2 < entry_count2; i2++) {
            this.sample_numbers.push(stream.readUint32());
          }
        }
      });
      BoxParser.createFullBoxCtor("stsz", "SampleSizeBox", function(stream) {
        var i2;
        this.sample_sizes = [];
        if (this.version === 0) {
          this.sample_size = stream.readUint32();
          this.sample_count = stream.readUint32();
          for (i2 = 0; i2 < this.sample_count; i2++) {
            if (this.sample_size === 0) {
              this.sample_sizes.push(stream.readUint32());
            } else {
              this.sample_sizes[i2] = this.sample_size;
            }
          }
        }
      });
      BoxParser.createFullBoxCtor("stts", "TimeToSampleBox", function(stream) {
        var entry_count2;
        var i2;
        var delta;
        entry_count2 = stream.readUint32();
        this.sample_counts = [];
        this.sample_deltas = [];
        if (this.version === 0) {
          for (i2 = 0; i2 < entry_count2; i2++) {
            this.sample_counts.push(stream.readUint32());
            delta = stream.readInt32();
            if (delta < 0) {
              Log.warn("BoxParser", "File uses negative stts sample delta, using value 1 instead, sync may be lost!");
              delta = 1;
            }
            this.sample_deltas.push(delta);
          }
        }
      });
      BoxParser.createFullBoxCtor("stvi", "StereoVideoBox", function(stream) {
        var tmp32 = stream.readUint32();
        this.single_view_allowed = tmp32 & 3;
        this.stereo_scheme = stream.readUint32();
        var length = stream.readUint32();
        this.stereo_indication_type = stream.readString(length);
        var ret2;
        var box2;
        this.boxes = [];
        while (stream.getPosition() < this.start + this.size) {
          ret2 = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret2.code === BoxParser.OK) {
            box2 = ret2.box;
            this.boxes.push(box2);
            this[box2.type] = box2;
          } else {
            return;
          }
        }
      });
      BoxParser.createBoxCtor("styp", "SegmentTypeBox", function(stream) {
        BoxParser.ftypBox.prototype.parse.call(this, stream);
      });
      BoxParser.createFullBoxCtor("stz2", "CompactSampleSizeBox", function(stream) {
        var i2;
        var sample_size;
        var sample_count;
        this.sample_sizes = [];
        if (this.version === 0) {
          this.reserved = stream.readUint24();
          this.field_size = stream.readUint8();
          sample_count = stream.readUint32();
          if (this.field_size === 4) {
            for (i2 = 0; i2 < sample_count; i2 += 2) {
              var tmp = stream.readUint8();
              this.sample_sizes[i2] = tmp >> 4 & 15;
              this.sample_sizes[i2 + 1] = tmp & 15;
            }
          } else if (this.field_size === 8) {
            for (i2 = 0; i2 < sample_count; i2++) {
              this.sample_sizes[i2] = stream.readUint8();
            }
          } else if (this.field_size === 16) {
            for (i2 = 0; i2 < sample_count; i2++) {
              this.sample_sizes[i2] = stream.readUint16();
            }
          } else {
            Log.error("BoxParser", "Error in length field in stz2 box");
          }
        }
      });
      BoxParser.createFullBoxCtor("subs", "SubSampleInformationBox", function(stream) {
        var i2, j;
        var entry_count2;
        var subsample_count;
        entry_count2 = stream.readUint32();
        this.entries = [];
        for (i2 = 0; i2 < entry_count2; i2++) {
          var sampleInfo = {};
          this.entries[i2] = sampleInfo;
          sampleInfo.sample_delta = stream.readUint32();
          sampleInfo.subsamples = [];
          subsample_count = stream.readUint16();
          if (subsample_count > 0) {
            for (j = 0; j < subsample_count; j++) {
              var subsample = {};
              sampleInfo.subsamples.push(subsample);
              if (this.version == 1) {
                subsample.size = stream.readUint32();
              } else {
                subsample.size = stream.readUint16();
              }
              subsample.priority = stream.readUint8();
              subsample.discardable = stream.readUint8();
              subsample.codec_specific_parameters = stream.readUint32();
            }
          }
        }
      });
      BoxParser.createFullBoxCtor("tenc", "TrackEncryptionBox", function(stream) {
        stream.readUint8();
        if (this.version === 0) {
          stream.readUint8();
        } else {
          var tmp = stream.readUint8();
          this.default_crypt_byte_block = tmp >> 4 & 15;
          this.default_skip_byte_block = tmp & 15;
        }
        this.default_isProtected = stream.readUint8();
        this.default_Per_Sample_IV_Size = stream.readUint8();
        this.default_KID = BoxParser.parseHex16(stream);
        if (this.default_isProtected === 1 && this.default_Per_Sample_IV_Size === 0) {
          this.default_constant_IV_size = stream.readUint8();
          this.default_constant_IV = stream.readUint8Array(this.default_constant_IV_size);
        }
      });
      BoxParser.createFullBoxCtor("tfdt", "TrackFragmentBaseMediaDecodeTimeBox", function(stream) {
        if (this.version == 1) {
          this.baseMediaDecodeTime = stream.readUint64();
        } else {
          this.baseMediaDecodeTime = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("tfhd", "TrackFragmentHeaderBox", function(stream) {
        var readBytes = 0;
        this.track_id = stream.readUint32();
        if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET) {
          this.base_data_offset = stream.readUint64();
          readBytes += 8;
        } else {
          this.base_data_offset = 0;
        }
        if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
          this.default_sample_description_index = stream.readUint32();
          readBytes += 4;
        } else {
          this.default_sample_description_index = 0;
        }
        if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
          this.default_sample_duration = stream.readUint32();
          readBytes += 4;
        } else {
          this.default_sample_duration = 0;
        }
        if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
          this.default_sample_size = stream.readUint32();
          readBytes += 4;
        } else {
          this.default_sample_size = 0;
        }
        if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
          this.default_sample_flags = stream.readUint32();
          readBytes += 4;
        } else {
          this.default_sample_flags = 0;
        }
      });
      BoxParser.createFullBoxCtor("tfra", "TrackFragmentRandomAccessBox", function(stream) {
        this.track_ID = stream.readUint32();
        stream.readUint24();
        var tmp_byte = stream.readUint8();
        this.length_size_of_traf_num = tmp_byte >> 4 & 3;
        this.length_size_of_trun_num = tmp_byte >> 2 & 3;
        this.length_size_of_sample_num = tmp_byte & 3;
        this.entries = [];
        var number_of_entries = stream.readUint32();
        for (var i2 = 0; i2 < number_of_entries; i2++) {
          if (this.version === 1) {
            this.time = stream.readUint64();
            this.moof_offset = stream.readUint64();
          } else {
            this.time = stream.readUint32();
            this.moof_offset = stream.readUint32();
          }
          this.traf_number = stream["readUint" + 8 * (this.length_size_of_traf_num + 1)]();
          this.trun_number = stream["readUint" + 8 * (this.length_size_of_trun_num + 1)]();
          this.sample_number = stream["readUint" + 8 * (this.length_size_of_sample_num + 1)]();
        }
      });
      BoxParser.createFullBoxCtor("tkhd", "TrackHeaderBox", function(stream) {
        if (this.version == 1) {
          this.creation_time = stream.readUint64();
          this.modification_time = stream.readUint64();
          this.track_id = stream.readUint32();
          stream.readUint32();
          this.duration = stream.readUint64();
        } else {
          this.creation_time = stream.readUint32();
          this.modification_time = stream.readUint32();
          this.track_id = stream.readUint32();
          stream.readUint32();
          this.duration = stream.readUint32();
        }
        stream.readUint32Array(2);
        this.layer = stream.readInt16();
        this.alternate_group = stream.readInt16();
        this.volume = stream.readInt16() >> 8;
        stream.readUint16();
        this.matrix = stream.readInt32Array(9);
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      });
      BoxParser.createBoxCtor("tmax", "hintmaxrelativetime", function(stream) {
        this.time = stream.readUint32();
      });
      BoxParser.createBoxCtor("tmin", "hintminrelativetime", function(stream) {
        this.time = stream.readUint32();
      });
      BoxParser.createBoxCtor("totl", "hintBytesSent", function(stream) {
        this.bytessent = stream.readUint32();
      });
      BoxParser.createBoxCtor("tpay", "hintBytesSent", function(stream) {
        this.bytessent = stream.readUint32();
      });
      BoxParser.createBoxCtor("tpyl", "hintBytesSent", function(stream) {
        this.bytessent = stream.readUint64();
      });
      BoxParser.TrackGroupTypeBox.prototype.parse = function(stream) {
        this.parseFullHeader(stream);
        this.track_group_id = stream.readUint32();
      };
      BoxParser.createTrackGroupCtor("msrc");
      BoxParser.TrackReferenceTypeBox = function(type, size, hdr_size, start) {
        BoxParser.Box.call(this, type, size);
        this.hdr_size = hdr_size;
        this.start = start;
      };
      BoxParser.TrackReferenceTypeBox.prototype = new BoxParser.Box();
      BoxParser.TrackReferenceTypeBox.prototype.parse = function(stream) {
        this.track_ids = stream.readUint32Array((this.size - this.hdr_size) / 4);
      };
      BoxParser.trefBox.prototype.parse = function(stream) {
        var ret2;
        var box2;
        while (stream.getPosition() < this.start + this.size) {
          ret2 = BoxParser.parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
          if (ret2.code === BoxParser.OK) {
            box2 = new BoxParser.TrackReferenceTypeBox(ret2.type, ret2.size, ret2.hdr_size, ret2.start);
            if (box2.write === BoxParser.Box.prototype.write && box2.type !== "mdat") {
              Log.info("BoxParser", "TrackReference " + box2.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
              box2.parseDataAndRewind(stream);
            }
            box2.parse(stream);
            this.boxes.push(box2);
          } else {
            return;
          }
        }
      };
      BoxParser.createFullBoxCtor("trep", "TrackExtensionPropertiesBox", function(stream) {
        this.track_ID = stream.readUint32();
        this.boxes = [];
        while (stream.getPosition() < this.start + this.size) {
          ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret.code === BoxParser.OK) {
            box = ret.box;
            this.boxes.push(box);
          } else {
            return;
          }
        }
      });
      BoxParser.createFullBoxCtor("trex", "TrackExtendsBox", function(stream) {
        this.track_id = stream.readUint32();
        this.default_sample_description_index = stream.readUint32();
        this.default_sample_duration = stream.readUint32();
        this.default_sample_size = stream.readUint32();
        this.default_sample_flags = stream.readUint32();
      });
      BoxParser.createBoxCtor("trpy", "hintBytesSent", function(stream) {
        this.bytessent = stream.readUint64();
      });
      BoxParser.createFullBoxCtor("trun", "TrackRunBox", function(stream) {
        var readBytes = 0;
        this.sample_count = stream.readUint32();
        readBytes += 4;
        if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET) {
          this.data_offset = stream.readInt32();
          readBytes += 4;
        } else {
          this.data_offset = 0;
        }
        if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
          this.first_sample_flags = stream.readUint32();
          readBytes += 4;
        } else {
          this.first_sample_flags = 0;
        }
        this.sample_duration = [];
        this.sample_size = [];
        this.sample_flags = [];
        this.sample_composition_time_offset = [];
        if (this.size - this.hdr_size > readBytes) {
          for (var i2 = 0; i2 < this.sample_count; i2++) {
            if (this.flags & BoxParser.TRUN_FLAGS_DURATION) {
              this.sample_duration[i2] = stream.readUint32();
            }
            if (this.flags & BoxParser.TRUN_FLAGS_SIZE) {
              this.sample_size[i2] = stream.readUint32();
            }
            if (this.flags & BoxParser.TRUN_FLAGS_FLAGS) {
              this.sample_flags[i2] = stream.readUint32();
            }
            if (this.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
              if (this.version === 0) {
                this.sample_composition_time_offset[i2] = stream.readUint32();
              } else {
                this.sample_composition_time_offset[i2] = stream.readInt32();
              }
            }
          }
        }
      });
      BoxParser.createFullBoxCtor("tsel", "TrackSelectionBox", function(stream) {
        this.switch_group = stream.readUint32();
        var count = (this.size - this.hdr_size - 4) / 4;
        this.attribute_list = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.attribute_list[i2] = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("txtC", "TextConfigBox", function(stream) {
        this.config = stream.readCString();
      });
      BoxParser.createBoxCtor("tyco", "TypeCombinationBox", function(stream) {
        var count = (this.size - this.hdr_size) / 4;
        this.compatible_brands = [];
        for (var i2 = 0; i2 < count; i2++) {
          this.compatible_brands[i2] = stream.readString(4);
        }
      });
      BoxParser.createFullBoxCtor("udes", "UserDescriptionProperty", function(stream) {
        this.lang = stream.readCString();
        this.name = stream.readCString();
        this.description = stream.readCString();
        this.tags = stream.readCString();
      });
      BoxParser.createFullBoxCtor("uncC", "UncompressedFrameConfigBox", function(stream) {
        var i2;
        this.profile = stream.readString(4);
        if (this.version == 1) {
        } else if (this.version == 0) {
          this.component_count = stream.readUint32();
          this.component_index = [];
          this.component_bit_depth_minus_one = [];
          this.component_format = [];
          this.component_align_size = [];
          for (i2 = 0; i2 < this.component_count; i2++) {
            this.component_index.push(stream.readUint16());
            this.component_bit_depth_minus_one.push(stream.readUint8());
            this.component_format.push(stream.readUint8());
            this.component_align_size.push(stream.readUint8());
          }
          this.sampling_type = stream.readUint8();
          this.interleave_type = stream.readUint8();
          this.block_size = stream.readUint8();
          var flags = stream.readUint8();
          this.component_little_endian = flags >> 7 & 1;
          this.block_pad_lsb = flags >> 6 & 1;
          this.block_little_endian = flags >> 5 & 1;
          this.block_reversed = flags >> 4 & 1;
          this.pad_unknown = flags >> 3 & 1;
          this.pixel_size = stream.readUint32();
          this.row_align_size = stream.readUint32();
          this.tile_align_size = stream.readUint32();
          this.num_tile_cols_minus_one = stream.readUint32();
          this.num_tile_rows_minus_one = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("url ", "DataEntryUrlBox", function(stream) {
        if (this.flags !== 1) {
          this.location = stream.readCString();
        }
      });
      BoxParser.createFullBoxCtor("urn ", "DataEntryUrnBox", function(stream) {
        this.name = stream.readCString();
        if (this.size - this.hdr_size - this.name.length - 1 > 0) {
          this.location = stream.readCString();
        }
      });
      BoxParser.createUUIDBox("a5d40b30e81411ddba2f0800200c9a66", "LiveServerManifestBox", true, false, function(stream) {
        this.LiveServerManifest = stream.readString(this.size - this.hdr_size).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      });
      BoxParser.createUUIDBox("d08a4f1810f34a82b6c832d8aba183d3", "PiffProtectionSystemSpecificHeaderBox", true, false, function(stream) {
        this.system_id = BoxParser.parseHex16(stream);
        var datasize = stream.readUint32();
        if (datasize > 0) {
          this.data = stream.readUint8Array(datasize);
        }
      });
      BoxParser.createUUIDBox(
        "a2394f525a9b4f14a2446c427c648df4",
        "PiffSampleEncryptionBox",
        true,
        false
        /*, function(stream) {
        	if (this.flags & 0x1) {
        		this.AlgorithmID = stream.readUint24();
        		this.IV_size = stream.readUint8();
        		this.KID = BoxParser.parseHex16(stream);
        	}
        	var sample_count = stream.readUint32();
        	this.samples = [];
        	for (var i = 0; i < sample_count; i++) {
        		var sample = {};
        		sample.InitializationVector = this.readUint8Array(this.IV_size*8);
        		if (this.flags & 0x2) {
        			sample.subsamples = [];
        			sample.NumberOfEntries = stream.readUint16();
        			for (var j = 0; j < sample.NumberOfEntries; j++) {
        				var subsample = {};
        				subsample.BytesOfClearData = stream.readUint16();
        				subsample.BytesOfProtectedData = stream.readUint32();
        				sample.subsamples.push(subsample);
        			}
        		}
        		this.samples.push(sample);
        	}
        }*/
      );
      BoxParser.createUUIDBox("8974dbce7be74c5184f97148f9882554", "PiffTrackEncryptionBox", true, false, function(stream) {
        this.default_AlgorithmID = stream.readUint24();
        this.default_IV_size = stream.readUint8();
        this.default_KID = BoxParser.parseHex16(stream);
      });
      BoxParser.createUUIDBox("d4807ef2ca3946958e5426cb9e46a79f", "TfrfBox", true, false, function(stream) {
        this.fragment_count = stream.readUint8();
        this.entries = [];
        for (var i2 = 0; i2 < this.fragment_count; i2++) {
          var entry = {};
          var absolute_time = 0;
          var absolute_duration = 0;
          if (this.version === 1) {
            absolute_time = stream.readUint64();
            absolute_duration = stream.readUint64();
          } else {
            absolute_time = stream.readUint32();
            absolute_duration = stream.readUint32();
          }
          entry.absolute_time = absolute_time;
          entry.absolute_duration = absolute_duration;
          this.entries.push(entry);
        }
      });
      BoxParser.createUUIDBox("6d1d9b0542d544e680e2141daff757b2", "TfxdBox", true, false, function(stream) {
        if (this.version === 1) {
          this.absolute_time = stream.readUint64();
          this.duration = stream.readUint64();
        } else {
          this.absolute_time = stream.readUint32();
          this.duration = stream.readUint32();
        }
      });
      BoxParser.createFullBoxCtor("vmhd", "VideoMediaHeaderBox", function(stream) {
        this.graphicsmode = stream.readUint16();
        this.opcolor = stream.readUint16Array(3);
      });
      BoxParser.createFullBoxCtor("vpcC", "VPCodecConfigurationRecord", function(stream) {
        var tmp;
        if (this.version === 1) {
          this.profile = stream.readUint8();
          this.level = stream.readUint8();
          tmp = stream.readUint8();
          this.bitDepth = tmp >> 4;
          this.chromaSubsampling = tmp >> 1 & 7;
          this.videoFullRangeFlag = tmp & 1;
          this.colourPrimaries = stream.readUint8();
          this.transferCharacteristics = stream.readUint8();
          this.matrixCoefficients = stream.readUint8();
          this.codecIntializationDataSize = stream.readUint16();
          this.codecIntializationData = stream.readUint8Array(this.codecIntializationDataSize);
        } else {
          this.profile = stream.readUint8();
          this.level = stream.readUint8();
          tmp = stream.readUint8();
          this.bitDepth = tmp >> 4 & 15;
          this.colorSpace = tmp & 15;
          tmp = stream.readUint8();
          this.chromaSubsampling = tmp >> 4 & 15;
          this.transferFunction = tmp >> 1 & 7;
          this.videoFullRangeFlag = tmp & 1;
          this.codecIntializationDataSize = stream.readUint16();
          this.codecIntializationData = stream.readUint8Array(this.codecIntializationDataSize);
        }
      });
      BoxParser.createBoxCtor("vttC", "WebVTTConfigurationBox", function(stream) {
        this.text = stream.readString(this.size - this.hdr_size);
      });
      BoxParser.createFullBoxCtor("vvcC", "VvcConfigurationBox", function(stream) {
        var i2, j;
        var bitReader = {
          held_bits: void 0,
          num_held_bits: 0,
          stream_read_1_bytes: function(strm2) {
            this.held_bits = strm2.readUint8();
            this.num_held_bits = 1 * 8;
          },
          stream_read_2_bytes: function(strm2) {
            this.held_bits = strm2.readUint16();
            this.num_held_bits = 2 * 8;
          },
          extract_bits: function(num_bits) {
            var ret2 = this.held_bits >> this.num_held_bits - num_bits & (1 << num_bits) - 1;
            this.num_held_bits -= num_bits;
            return ret2;
          }
        };
        bitReader.stream_read_1_bytes(stream);
        bitReader.extract_bits(5);
        this.lengthSizeMinusOne = bitReader.extract_bits(2);
        this.ptl_present_flag = bitReader.extract_bits(1);
        if (this.ptl_present_flag) {
          bitReader.stream_read_2_bytes(stream);
          this.ols_idx = bitReader.extract_bits(9);
          this.num_sublayers = bitReader.extract_bits(3);
          this.constant_frame_rate = bitReader.extract_bits(2);
          this.chroma_format_idc = bitReader.extract_bits(2);
          bitReader.stream_read_1_bytes(stream);
          this.bit_depth_minus8 = bitReader.extract_bits(3);
          bitReader.extract_bits(5);
          {
            bitReader.stream_read_2_bytes(stream);
            bitReader.extract_bits(2);
            this.num_bytes_constraint_info = bitReader.extract_bits(6);
            this.general_profile_idc = bitReader.extract_bits(7);
            this.general_tier_flag = bitReader.extract_bits(1);
            this.general_level_idc = stream.readUint8();
            bitReader.stream_read_1_bytes(stream);
            this.ptl_frame_only_constraint_flag = bitReader.extract_bits(1);
            this.ptl_multilayer_enabled_flag = bitReader.extract_bits(1);
            this.general_constraint_info = new Uint8Array(this.num_bytes_constraint_info);
            if (this.num_bytes_constraint_info) {
              for (i2 = 0; i2 < this.num_bytes_constraint_info - 1; i2++) {
                var cnstr1 = bitReader.extract_bits(6);
                bitReader.stream_read_1_bytes(stream);
                var cnstr2 = bitReader.extract_bits(2);
                this.general_constraint_info[i2] = cnstr1 << 2 | cnstr2;
              }
              this.general_constraint_info[this.num_bytes_constraint_info - 1] = bitReader.extract_bits(6);
            } else {
              bitReader.extract_bits(6);
            }
            if (this.num_sublayers > 1) {
              bitReader.stream_read_1_bytes(stream);
              this.ptl_sublayer_present_mask = 0;
              for (j = this.num_sublayers - 2; j >= 0; --j) {
                var val = bitReader.extract_bits(1);
                this.ptl_sublayer_present_mask |= val << j;
              }
              for (j = this.num_sublayers; j <= 8 && this.num_sublayers > 1; ++j) {
                bitReader.extract_bits(1);
              }
              this.sublayer_level_idc = [];
              for (j = this.num_sublayers - 2; j >= 0; --j) {
                if (this.ptl_sublayer_present_mask & 1 << j) {
                  this.sublayer_level_idc[j] = stream.readUint8();
                }
              }
            }
            this.ptl_num_sub_profiles = stream.readUint8();
            this.general_sub_profile_idc = [];
            if (this.ptl_num_sub_profiles) {
              for (i2 = 0; i2 < this.ptl_num_sub_profiles; i2++) {
                this.general_sub_profile_idc.push(stream.readUint32());
              }
            }
          }
          this.max_picture_width = stream.readUint16();
          this.max_picture_height = stream.readUint16();
          this.avg_frame_rate = stream.readUint16();
        }
        var VVC_NALU_OPI = 12;
        var VVC_NALU_DEC_PARAM = 13;
        this.nalu_arrays = [];
        var num_of_arrays = stream.readUint8();
        for (i2 = 0; i2 < num_of_arrays; i2++) {
          var nalu_array = [];
          this.nalu_arrays.push(nalu_array);
          bitReader.stream_read_1_bytes(stream);
          nalu_array.completeness = bitReader.extract_bits(1);
          bitReader.extract_bits(2);
          nalu_array.nalu_type = bitReader.extract_bits(5);
          var numNalus = 1;
          if (nalu_array.nalu_type != VVC_NALU_DEC_PARAM && nalu_array.nalu_type != VVC_NALU_OPI) {
            numNalus = stream.readUint16();
          }
          for (j = 0; j < numNalus; j++) {
            var len = stream.readUint16();
            nalu_array.push({
              data: stream.readUint8Array(len),
              length: len
            });
          }
        }
      });
      BoxParser.createFullBoxCtor("vvnC", "VvcNALUConfigBox", function(stream) {
        var tmp = strm.readUint8();
        this.lengthSizeMinusOne = tmp & 3;
      });
      BoxParser.SampleEntry.prototype.isVideo = function() {
        return false;
      };
      BoxParser.SampleEntry.prototype.isAudio = function() {
        return false;
      };
      BoxParser.SampleEntry.prototype.isSubtitle = function() {
        return false;
      };
      BoxParser.SampleEntry.prototype.isMetadata = function() {
        return false;
      };
      BoxParser.SampleEntry.prototype.isHint = function() {
        return false;
      };
      BoxParser.SampleEntry.prototype.getCodec = function() {
        return this.type.replace(".", "");
      };
      BoxParser.SampleEntry.prototype.getWidth = function() {
        return "";
      };
      BoxParser.SampleEntry.prototype.getHeight = function() {
        return "";
      };
      BoxParser.SampleEntry.prototype.getChannelCount = function() {
        return "";
      };
      BoxParser.SampleEntry.prototype.getSampleRate = function() {
        return "";
      };
      BoxParser.SampleEntry.prototype.getSampleSize = function() {
        return "";
      };
      BoxParser.VisualSampleEntry.prototype.isVideo = function() {
        return true;
      };
      BoxParser.VisualSampleEntry.prototype.getWidth = function() {
        return this.width;
      };
      BoxParser.VisualSampleEntry.prototype.getHeight = function() {
        return this.height;
      };
      BoxParser.AudioSampleEntry.prototype.isAudio = function() {
        return true;
      };
      BoxParser.AudioSampleEntry.prototype.getChannelCount = function() {
        return this.channel_count;
      };
      BoxParser.AudioSampleEntry.prototype.getSampleRate = function() {
        return this.samplerate;
      };
      BoxParser.AudioSampleEntry.prototype.getSampleSize = function() {
        return this.samplesize;
      };
      BoxParser.SubtitleSampleEntry.prototype.isSubtitle = function() {
        return true;
      };
      BoxParser.MetadataSampleEntry.prototype.isMetadata = function() {
        return true;
      };
      BoxParser.decimalToHex = function(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof padding === "undefined" || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
          hex = "0" + hex;
        }
        return hex;
      };
      BoxParser.avc1SampleEntry.prototype.getCodec = BoxParser.avc2SampleEntry.prototype.getCodec = BoxParser.avc3SampleEntry.prototype.getCodec = BoxParser.avc4SampleEntry.prototype.getCodec = function() {
        var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
        if (this.avcC) {
          return baseCodec + "." + BoxParser.decimalToHex(this.avcC.AVCProfileIndication) + BoxParser.decimalToHex(this.avcC.profile_compatibility) + BoxParser.decimalToHex(this.avcC.AVCLevelIndication);
        } else {
          return baseCodec;
        }
      };
      BoxParser.hev1SampleEntry.prototype.getCodec = BoxParser.hvc1SampleEntry.prototype.getCodec = function() {
        var i2;
        var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
        if (this.hvcC) {
          baseCodec += ".";
          switch (this.hvcC.general_profile_space) {
            case 0:
              baseCodec += "";
              break;
            case 1:
              baseCodec += "A";
              break;
            case 2:
              baseCodec += "B";
              break;
            case 3:
              baseCodec += "C";
              break;
          }
          baseCodec += this.hvcC.general_profile_idc;
          baseCodec += ".";
          var val = this.hvcC.general_profile_compatibility;
          var reversed = 0;
          for (i2 = 0; i2 < 32; i2++) {
            reversed |= val & 1;
            if (i2 == 31) break;
            reversed <<= 1;
            val >>= 1;
          }
          baseCodec += BoxParser.decimalToHex(reversed, 0);
          baseCodec += ".";
          if (this.hvcC.general_tier_flag === 0) {
            baseCodec += "L";
          } else {
            baseCodec += "H";
          }
          baseCodec += this.hvcC.general_level_idc;
          var hasByte = false;
          var constraint_string = "";
          for (i2 = 5; i2 >= 0; i2--) {
            if (this.hvcC.general_constraint_indicator[i2] || hasByte) {
              constraint_string = "." + BoxParser.decimalToHex(this.hvcC.general_constraint_indicator[i2], 0) + constraint_string;
              hasByte = true;
            }
          }
          baseCodec += constraint_string;
        }
        return baseCodec;
      };
      BoxParser.vvc1SampleEntry.prototype.getCodec = BoxParser.vvi1SampleEntry.prototype.getCodec = function() {
        var i2;
        var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
        if (this.vvcC) {
          baseCodec += "." + this.vvcC.general_profile_idc;
          if (this.vvcC.general_tier_flag) {
            baseCodec += ".H";
          } else {
            baseCodec += ".L";
          }
          baseCodec += this.vvcC.general_level_idc;
          var constraint_string = "";
          if (this.vvcC.general_constraint_info) {
            var bytes = [];
            var byte = 0;
            byte |= this.vvcC.ptl_frame_only_constraint << 7;
            byte |= this.vvcC.ptl_multilayer_enabled << 6;
            var last_nonzero;
            for (i2 = 0; i2 < this.vvcC.general_constraint_info.length; ++i2) {
              byte |= this.vvcC.general_constraint_info[i2] >> 2 & 63;
              bytes.push(byte);
              if (byte) {
                last_nonzero = i2;
              }
              byte = this.vvcC.general_constraint_info[i2] >> 2 & 3;
            }
            if (last_nonzero === void 0) {
              constraint_string = ".CA";
            } else {
              constraint_string = ".C";
              var base32_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
              var held_bits = 0;
              var num_held_bits = 0;
              for (i2 = 0; i2 <= last_nonzero; ++i2) {
                held_bits = held_bits << 8 | bytes[i2];
                num_held_bits += 8;
                while (num_held_bits >= 5) {
                  var val = held_bits >> num_held_bits - 5 & 31;
                  constraint_string += base32_chars[val];
                  num_held_bits -= 5;
                  held_bits &= (1 << num_held_bits) - 1;
                }
              }
              if (num_held_bits) {
                held_bits <<= 5 - num_held_bits;
                constraint_string += base32_chars[held_bits & 31];
              }
            }
          }
          baseCodec += constraint_string;
        }
        return baseCodec;
      };
      BoxParser.mp4aSampleEntry.prototype.getCodec = function() {
        var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
        if (this.esds && this.esds.esd) {
          var oti = this.esds.esd.getOTI();
          var dsi = this.esds.esd.getAudioConfig();
          return baseCodec + "." + BoxParser.decimalToHex(oti) + (dsi ? "." + dsi : "");
        } else {
          return baseCodec;
        }
      };
      BoxParser.stxtSampleEntry.prototype.getCodec = function() {
        var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
        if (this.mime_format) {
          return baseCodec + "." + this.mime_format;
        } else {
          return baseCodec;
        }
      };
      BoxParser.vp08SampleEntry.prototype.getCodec = BoxParser.vp09SampleEntry.prototype.getCodec = function() {
        var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
        var level = this.vpcC.level;
        if (level == 0) {
          level = "00";
        }
        var bitDepth = this.vpcC.bitDepth;
        if (bitDepth == 8) {
          bitDepth = "08";
        }
        return baseCodec + ".0" + this.vpcC.profile + "." + level + "." + bitDepth;
      };
      BoxParser.av01SampleEntry.prototype.getCodec = function() {
        var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
        var level = this.av1C.seq_level_idx_0;
        if (level < 10) {
          level = "0" + level;
        }
        var bitdepth;
        if (this.av1C.seq_profile === 2 && this.av1C.high_bitdepth === 1) {
          bitdepth = this.av1C.twelve_bit === 1 ? "12" : "10";
        } else if (this.av1C.seq_profile <= 2) {
          bitdepth = this.av1C.high_bitdepth === 1 ? "10" : "08";
        }
        return baseCodec + "." + this.av1C.seq_profile + "." + level + (this.av1C.seq_tier_0 ? "H" : "M") + "." + bitdepth;
      };
      BoxParser.Box.prototype.writeHeader = function(stream, msg) {
        this.size += 8;
        if (this.size > MAX_SIZE) {
          this.size += 8;
        }
        if (this.type === "uuid") {
          this.size += 16;
        }
        Log.debug("BoxWriter", "Writing box " + this.type + " of size: " + this.size + " at position " + stream.getPosition() + (msg || ""));
        if (this.size > MAX_SIZE) {
          stream.writeUint32(1);
        } else {
          this.sizePosition = stream.getPosition();
          stream.writeUint32(this.size);
        }
        stream.writeString(this.type, null, 4);
        if (this.type === "uuid") {
          stream.writeUint8Array(this.uuid);
        }
        if (this.size > MAX_SIZE) {
          stream.writeUint64(this.size);
        }
      };
      BoxParser.FullBox.prototype.writeHeader = function(stream) {
        this.size += 4;
        BoxParser.Box.prototype.writeHeader.call(this, stream, " v=" + this.version + " f=" + this.flags);
        stream.writeUint8(this.version);
        stream.writeUint24(this.flags);
      };
      BoxParser.Box.prototype.write = function(stream) {
        if (this.type === "mdat") {
          if (this.data) {
            this.size = this.data.length;
            this.writeHeader(stream);
            stream.writeUint8Array(this.data);
          }
        } else {
          this.size = this.data ? this.data.length : 0;
          this.writeHeader(stream);
          if (this.data) {
            stream.writeUint8Array(this.data);
          }
        }
      };
      BoxParser.ContainerBox.prototype.write = function(stream) {
        this.size = 0;
        this.writeHeader(stream);
        for (var i2 = 0; i2 < this.boxes.length; i2++) {
          if (this.boxes[i2]) {
            this.boxes[i2].write(stream);
            this.size += this.boxes[i2].size;
          }
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      };
      BoxParser.TrackReferenceTypeBox.prototype.write = function(stream) {
        this.size = this.track_ids.length * 4;
        this.writeHeader(stream);
        stream.writeUint32Array(this.track_ids);
      };
      BoxParser.avcCBox.prototype.write = function(stream) {
        var i2;
        this.size = 7;
        for (i2 = 0; i2 < this.SPS.length; i2++) {
          this.size += 2 + this.SPS[i2].length;
        }
        for (i2 = 0; i2 < this.PPS.length; i2++) {
          this.size += 2 + this.PPS[i2].length;
        }
        if (this.ext) {
          this.size += this.ext.length;
        }
        this.writeHeader(stream);
        stream.writeUint8(this.configurationVersion);
        stream.writeUint8(this.AVCProfileIndication);
        stream.writeUint8(this.profile_compatibility);
        stream.writeUint8(this.AVCLevelIndication);
        stream.writeUint8(this.lengthSizeMinusOne + (63 << 2));
        stream.writeUint8(this.SPS.length + (7 << 5));
        for (i2 = 0; i2 < this.SPS.length; i2++) {
          stream.writeUint16(this.SPS[i2].length);
          stream.writeUint8Array(this.SPS[i2].nalu);
        }
        stream.writeUint8(this.PPS.length);
        for (i2 = 0; i2 < this.PPS.length; i2++) {
          stream.writeUint16(this.PPS[i2].length);
          stream.writeUint8Array(this.PPS[i2].nalu);
        }
        if (this.ext) {
          stream.writeUint8Array(this.ext);
        }
      };
      BoxParser.co64Box.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 8 * this.chunk_offsets.length;
        this.writeHeader(stream);
        stream.writeUint32(this.chunk_offsets.length);
        for (i2 = 0; i2 < this.chunk_offsets.length; i2++) {
          stream.writeUint64(this.chunk_offsets[i2]);
        }
      };
      BoxParser.cslgBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 0;
        this.size = 4 * 5;
        this.writeHeader(stream);
        stream.writeInt32(this.compositionToDTSShift);
        stream.writeInt32(this.leastDecodeToDisplayDelta);
        stream.writeInt32(this.greatestDecodeToDisplayDelta);
        stream.writeInt32(this.compositionStartTime);
        stream.writeInt32(this.compositionEndTime);
      };
      BoxParser.cttsBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 8 * this.sample_counts.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_counts.length);
        for (i2 = 0; i2 < this.sample_counts.length; i2++) {
          stream.writeUint32(this.sample_counts[i2]);
          if (this.version === 1) {
            stream.writeInt32(this.sample_offsets[i2]);
          } else {
            stream.writeUint32(this.sample_offsets[i2]);
          }
        }
      };
      BoxParser.drefBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4;
        this.writeHeader(stream);
        stream.writeUint32(this.entries.length);
        for (var i2 = 0; i2 < this.entries.length; i2++) {
          this.entries[i2].write(stream);
          this.size += this.entries[i2].size;
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      };
      BoxParser.elngBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = this.extended_language.length;
        this.writeHeader(stream);
        stream.writeString(this.extended_language);
      };
      BoxParser.elstBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 12 * this.entries.length;
        this.writeHeader(stream);
        stream.writeUint32(this.entries.length);
        for (var i2 = 0; i2 < this.entries.length; i2++) {
          var entry = this.entries[i2];
          stream.writeUint32(entry.segment_duration);
          stream.writeInt32(entry.media_time);
          stream.writeInt16(entry.media_rate_integer);
          stream.writeInt16(entry.media_rate_fraction);
        }
      };
      BoxParser.emsgBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 * 4 + this.message_data.length + (this.scheme_id_uri.length + 1) + (this.value.length + 1);
        this.writeHeader(stream);
        stream.writeCString(this.scheme_id_uri);
        stream.writeCString(this.value);
        stream.writeUint32(this.timescale);
        stream.writeUint32(this.presentation_time_delta);
        stream.writeUint32(this.event_duration);
        stream.writeUint32(this.id);
        stream.writeUint8Array(this.message_data);
      };
      BoxParser.ftypBox.prototype.write = function(stream) {
        this.size = 8 + 4 * this.compatible_brands.length;
        this.writeHeader(stream);
        stream.writeString(this.major_brand, null, 4);
        stream.writeUint32(this.minor_version);
        for (var i2 = 0; i2 < this.compatible_brands.length; i2++) {
          stream.writeString(this.compatible_brands[i2], null, 4);
        }
      };
      BoxParser.hdlrBox.prototype.write = function(stream) {
        this.size = 5 * 4 + this.name.length + 1;
        this.version = 0;
        this.flags = 0;
        this.writeHeader(stream);
        stream.writeUint32(0);
        stream.writeString(this.handler, null, 4);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeCString(this.name);
      };
      BoxParser.hvcCBox.prototype.write = function(stream) {
        var i2, j;
        this.size = 23;
        for (i2 = 0; i2 < this.nalu_arrays.length; i2++) {
          this.size += 3;
          for (j = 0; j < this.nalu_arrays[i2].length; j++) {
            this.size += 2 + this.nalu_arrays[i2][j].data.length;
          }
        }
        this.writeHeader(stream);
        stream.writeUint8(this.configurationVersion);
        stream.writeUint8((this.general_profile_space << 6) + (this.general_tier_flag << 5) + this.general_profile_idc);
        stream.writeUint32(this.general_profile_compatibility);
        stream.writeUint8Array(this.general_constraint_indicator);
        stream.writeUint8(this.general_level_idc);
        stream.writeUint16(this.min_spatial_segmentation_idc + (15 << 24));
        stream.writeUint8(this.parallelismType + (63 << 2));
        stream.writeUint8(this.chroma_format_idc + (63 << 2));
        stream.writeUint8(this.bit_depth_luma_minus8 + (31 << 3));
        stream.writeUint8(this.bit_depth_chroma_minus8 + (31 << 3));
        stream.writeUint16(this.avgFrameRate);
        stream.writeUint8((this.constantFrameRate << 6) + (this.numTemporalLayers << 3) + (this.temporalIdNested << 2) + this.lengthSizeMinusOne);
        stream.writeUint8(this.nalu_arrays.length);
        for (i2 = 0; i2 < this.nalu_arrays.length; i2++) {
          stream.writeUint8((this.nalu_arrays[i2].completeness << 7) + this.nalu_arrays[i2].nalu_type);
          stream.writeUint16(this.nalu_arrays[i2].length);
          for (j = 0; j < this.nalu_arrays[i2].length; j++) {
            stream.writeUint16(this.nalu_arrays[i2][j].data.length);
            stream.writeUint8Array(this.nalu_arrays[i2][j].data);
          }
        }
      };
      BoxParser.kindBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = this.schemeURI.length + 1 + (this.value.length + 1);
        this.writeHeader(stream);
        stream.writeCString(this.schemeURI);
        stream.writeCString(this.value);
      };
      BoxParser.mdhdBox.prototype.write = function(stream) {
        this.size = 4 * 4 + 2 * 2;
        this.flags = 0;
        this.version = 0;
        this.writeHeader(stream);
        stream.writeUint32(this.creation_time);
        stream.writeUint32(this.modification_time);
        stream.writeUint32(this.timescale);
        stream.writeUint32(this.duration);
        stream.writeUint16(this.language);
        stream.writeUint16(0);
      };
      BoxParser.mehdBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4;
        this.writeHeader(stream);
        stream.writeUint32(this.fragment_duration);
      };
      BoxParser.mfhdBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4;
        this.writeHeader(stream);
        stream.writeUint32(this.sequence_number);
      };
      BoxParser.mvhdBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 23 * 4 + 2 * 2;
        this.writeHeader(stream);
        stream.writeUint32(this.creation_time);
        stream.writeUint32(this.modification_time);
        stream.writeUint32(this.timescale);
        stream.writeUint32(this.duration);
        stream.writeUint32(this.rate);
        stream.writeUint16(this.volume << 8);
        stream.writeUint16(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32Array(this.matrix);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(this.next_track_id);
      };
      BoxParser.SampleEntry.prototype.writeHeader = function(stream) {
        this.size = 8;
        BoxParser.Box.prototype.writeHeader.call(this, stream);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint16(this.data_reference_index);
      };
      BoxParser.SampleEntry.prototype.writeFooter = function(stream) {
        for (var i2 = 0; i2 < this.boxes.length; i2++) {
          this.boxes[i2].write(stream);
          this.size += this.boxes[i2].size;
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      };
      BoxParser.SampleEntry.prototype.write = function(stream) {
        this.writeHeader(stream);
        stream.writeUint8Array(this.data);
        this.size += this.data.length;
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      };
      BoxParser.VisualSampleEntry.prototype.write = function(stream) {
        this.writeHeader(stream);
        this.size += 2 * 7 + 6 * 4 + 32;
        stream.writeUint16(0);
        stream.writeUint16(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint16(this.width);
        stream.writeUint16(this.height);
        stream.writeUint32(this.horizresolution);
        stream.writeUint32(this.vertresolution);
        stream.writeUint32(0);
        stream.writeUint16(this.frame_count);
        stream.writeUint8(Math.min(31, this.compressorname.length));
        stream.writeString(this.compressorname, null, 31);
        stream.writeUint16(this.depth);
        stream.writeInt16(-1);
        this.writeFooter(stream);
      };
      BoxParser.AudioSampleEntry.prototype.write = function(stream) {
        this.writeHeader(stream);
        this.size += 2 * 4 + 3 * 4;
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint16(this.channel_count);
        stream.writeUint16(this.samplesize);
        stream.writeUint16(0);
        stream.writeUint16(0);
        stream.writeUint32(this.samplerate << 16);
        this.writeFooter(stream);
      };
      BoxParser.stppSampleEntry.prototype.write = function(stream) {
        this.writeHeader(stream);
        this.size += this.namespace.length + 1 + this.schema_location.length + 1 + this.auxiliary_mime_types.length + 1;
        stream.writeCString(this.namespace);
        stream.writeCString(this.schema_location);
        stream.writeCString(this.auxiliary_mime_types);
        this.writeFooter(stream);
      };
      BoxParser.SampleGroupEntry.prototype.write = function(stream) {
        stream.writeUint8Array(this.data);
      };
      BoxParser.sbgpBox.prototype.write = function(stream) {
        this.version = 1;
        this.flags = 0;
        this.size = 12 + 8 * this.entries.length;
        this.writeHeader(stream);
        stream.writeString(this.grouping_type, null, 4);
        stream.writeUint32(this.grouping_type_parameter);
        stream.writeUint32(this.entries.length);
        for (var i2 = 0; i2 < this.entries.length; i2++) {
          var entry = this.entries[i2];
          stream.writeInt32(entry.sample_count);
          stream.writeInt32(entry.group_description_index);
        }
      };
      BoxParser.sgpdBox.prototype.write = function(stream) {
        var i2;
        var entry;
        this.flags = 0;
        this.size = 12;
        for (i2 = 0; i2 < this.entries.length; i2++) {
          entry = this.entries[i2];
          if (this.version === 1) {
            if (this.default_length === 0) {
              this.size += 4;
            }
            this.size += entry.data.length;
          }
        }
        this.writeHeader(stream);
        stream.writeString(this.grouping_type, null, 4);
        if (this.version === 1) {
          stream.writeUint32(this.default_length);
        }
        if (this.version >= 2) {
          stream.writeUint32(this.default_sample_description_index);
        }
        stream.writeUint32(this.entries.length);
        for (i2 = 0; i2 < this.entries.length; i2++) {
          entry = this.entries[i2];
          if (this.version === 1) {
            if (this.default_length === 0) {
              stream.writeUint32(entry.description_length);
            }
          }
          entry.write(stream);
        }
      };
      BoxParser.sidxBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 * 4 + 2 + 2 + 12 * this.references.length;
        this.writeHeader(stream);
        stream.writeUint32(this.reference_ID);
        stream.writeUint32(this.timescale);
        stream.writeUint32(this.earliest_presentation_time);
        stream.writeUint32(this.first_offset);
        stream.writeUint16(0);
        stream.writeUint16(this.references.length);
        for (var i2 = 0; i2 < this.references.length; i2++) {
          var ref = this.references[i2];
          stream.writeUint32(ref.reference_type << 31 | ref.referenced_size);
          stream.writeUint32(ref.subsegment_duration);
          stream.writeUint32(ref.starts_with_SAP << 31 | ref.SAP_type << 28 | ref.SAP_delta_time);
        }
      };
      BoxParser.smhdBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 1;
        this.size = 4;
        this.writeHeader(stream);
        stream.writeUint16(this.balance);
        stream.writeUint16(0);
      };
      BoxParser.stcoBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 4 * this.chunk_offsets.length;
        this.writeHeader(stream);
        stream.writeUint32(this.chunk_offsets.length);
        stream.writeUint32Array(this.chunk_offsets);
      };
      BoxParser.stscBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 12 * this.first_chunk.length;
        this.writeHeader(stream);
        stream.writeUint32(this.first_chunk.length);
        for (i2 = 0; i2 < this.first_chunk.length; i2++) {
          stream.writeUint32(this.first_chunk[i2]);
          stream.writeUint32(this.samples_per_chunk[i2]);
          stream.writeUint32(this.sample_description_index[i2]);
        }
      };
      BoxParser.stsdBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 0;
        this.size = 0;
        this.writeHeader(stream);
        stream.writeUint32(this.entries.length);
        this.size += 4;
        for (i2 = 0; i2 < this.entries.length; i2++) {
          this.entries[i2].write(stream);
          this.size += this.entries[i2].size;
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      };
      BoxParser.stshBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 8 * this.shadowed_sample_numbers.length;
        this.writeHeader(stream);
        stream.writeUint32(this.shadowed_sample_numbers.length);
        for (i2 = 0; i2 < this.shadowed_sample_numbers.length; i2++) {
          stream.writeUint32(this.shadowed_sample_numbers[i2]);
          stream.writeUint32(this.sync_sample_numbers[i2]);
        }
      };
      BoxParser.stssBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 4 * this.sample_numbers.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_numbers.length);
        stream.writeUint32Array(this.sample_numbers);
      };
      BoxParser.stszBox.prototype.write = function(stream) {
        var i2;
        var constant = true;
        this.version = 0;
        this.flags = 0;
        if (this.sample_sizes.length > 0) {
          i2 = 0;
          while (i2 + 1 < this.sample_sizes.length) {
            if (this.sample_sizes[i2 + 1] !== this.sample_sizes[0]) {
              constant = false;
              break;
            } else {
              i2++;
            }
          }
        } else {
          constant = false;
        }
        this.size = 8;
        if (!constant) {
          this.size += 4 * this.sample_sizes.length;
        }
        this.writeHeader(stream);
        if (!constant) {
          stream.writeUint32(0);
        } else {
          stream.writeUint32(this.sample_sizes[0]);
        }
        stream.writeUint32(this.sample_sizes.length);
        if (!constant) {
          stream.writeUint32Array(this.sample_sizes);
        }
      };
      BoxParser.sttsBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 8 * this.sample_counts.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_counts.length);
        for (i2 = 0; i2 < this.sample_counts.length; i2++) {
          stream.writeUint32(this.sample_counts[i2]);
          stream.writeUint32(this.sample_deltas[i2]);
        }
      };
      BoxParser.tfdtBox.prototype.write = function(stream) {
        var UINT32_MAX = Math.pow(2, 32) - 1;
        this.version = this.baseMediaDecodeTime > UINT32_MAX ? 1 : 0;
        this.flags = 0;
        this.size = 4;
        if (this.version === 1) {
          this.size += 4;
        }
        this.writeHeader(stream);
        if (this.version === 1) {
          stream.writeUint64(this.baseMediaDecodeTime);
        } else {
          stream.writeUint32(this.baseMediaDecodeTime);
        }
      };
      BoxParser.tfhdBox.prototype.write = function(stream) {
        this.version = 0;
        this.size = 4;
        if (this.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET) {
          this.size += 8;
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
          this.size += 4;
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
          this.size += 4;
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
          this.size += 4;
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
          this.size += 4;
        }
        this.writeHeader(stream);
        stream.writeUint32(this.track_id);
        if (this.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET) {
          stream.writeUint64(this.base_data_offset);
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
          stream.writeUint32(this.default_sample_description_index);
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
          stream.writeUint32(this.default_sample_duration);
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
          stream.writeUint32(this.default_sample_size);
        }
        if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
          stream.writeUint32(this.default_sample_flags);
        }
      };
      BoxParser.tkhdBox.prototype.write = function(stream) {
        this.version = 0;
        this.size = 4 * 18 + 2 * 4;
        this.writeHeader(stream);
        stream.writeUint32(this.creation_time);
        stream.writeUint32(this.modification_time);
        stream.writeUint32(this.track_id);
        stream.writeUint32(0);
        stream.writeUint32(this.duration);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeInt16(this.layer);
        stream.writeInt16(this.alternate_group);
        stream.writeInt16(this.volume << 8);
        stream.writeUint16(0);
        stream.writeInt32Array(this.matrix);
        stream.writeUint32(this.width);
        stream.writeUint32(this.height);
      };
      BoxParser.trexBox.prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 * 5;
        this.writeHeader(stream);
        stream.writeUint32(this.track_id);
        stream.writeUint32(this.default_sample_description_index);
        stream.writeUint32(this.default_sample_duration);
        stream.writeUint32(this.default_sample_size);
        stream.writeUint32(this.default_sample_flags);
      };
      BoxParser.trunBox.prototype.write = function(stream) {
        this.version = 0;
        this.size = 4;
        if (this.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET) {
          this.size += 4;
        }
        if (this.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
          this.size += 4;
        }
        if (this.flags & BoxParser.TRUN_FLAGS_DURATION) {
          this.size += 4 * this.sample_duration.length;
        }
        if (this.flags & BoxParser.TRUN_FLAGS_SIZE) {
          this.size += 4 * this.sample_size.length;
        }
        if (this.flags & BoxParser.TRUN_FLAGS_FLAGS) {
          this.size += 4 * this.sample_flags.length;
        }
        if (this.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
          this.size += 4 * this.sample_composition_time_offset.length;
        }
        this.writeHeader(stream);
        stream.writeUint32(this.sample_count);
        if (this.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET) {
          this.data_offset_position = stream.getPosition();
          stream.writeInt32(this.data_offset);
        }
        if (this.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
          stream.writeUint32(this.first_sample_flags);
        }
        for (var i2 = 0; i2 < this.sample_count; i2++) {
          if (this.flags & BoxParser.TRUN_FLAGS_DURATION) {
            stream.writeUint32(this.sample_duration[i2]);
          }
          if (this.flags & BoxParser.TRUN_FLAGS_SIZE) {
            stream.writeUint32(this.sample_size[i2]);
          }
          if (this.flags & BoxParser.TRUN_FLAGS_FLAGS) {
            stream.writeUint32(this.sample_flags[i2]);
          }
          if (this.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
            if (this.version === 0) {
              stream.writeUint32(this.sample_composition_time_offset[i2]);
            } else {
              stream.writeInt32(this.sample_composition_time_offset[i2]);
            }
          }
        }
      };
      BoxParser["url Box"].prototype.write = function(stream) {
        this.version = 0;
        if (this.location) {
          this.flags = 0;
          this.size = this.location.length + 1;
        } else {
          this.flags = 1;
          this.size = 0;
        }
        this.writeHeader(stream);
        if (this.location) {
          stream.writeCString(this.location);
        }
      };
      BoxParser["urn Box"].prototype.write = function(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = this.name.length + 1 + (this.location ? this.location.length + 1 : 0);
        this.writeHeader(stream);
        stream.writeCString(this.name);
        if (this.location) {
          stream.writeCString(this.location);
        }
      };
      BoxParser.vmhdBox.prototype.write = function(stream) {
        var i2;
        this.version = 0;
        this.flags = 1;
        this.size = 8;
        this.writeHeader(stream);
        stream.writeUint16(this.graphicsmode);
        stream.writeUint16Array(this.opcolor);
      };
      BoxParser.cttsBox.prototype.unpack = function(samples) {
        var i2, j, k;
        k = 0;
        for (i2 = 0; i2 < this.sample_counts.length; i2++) {
          for (j = 0; j < this.sample_counts[i2]; j++) {
            samples[k].pts = samples[k].dts + this.sample_offsets[i2];
            k++;
          }
        }
      };
      BoxParser.sttsBox.prototype.unpack = function(samples) {
        var i2, j, k;
        k = 0;
        for (i2 = 0; i2 < this.sample_counts.length; i2++) {
          for (j = 0; j < this.sample_counts[i2]; j++) {
            if (k === 0) {
              samples[k].dts = 0;
            } else {
              samples[k].dts = samples[k - 1].dts + this.sample_deltas[i2];
            }
            k++;
          }
        }
      };
      BoxParser.stcoBox.prototype.unpack = function(samples) {
        var i2;
        for (i2 = 0; i2 < this.chunk_offsets.length; i2++) {
          samples[i2].offset = this.chunk_offsets[i2];
        }
      };
      BoxParser.stscBox.prototype.unpack = function(samples) {
        var i2, j, k, l, m;
        l = 0;
        m = 0;
        for (i2 = 0; i2 < this.first_chunk.length; i2++) {
          for (j = 0; j < (i2 + 1 < this.first_chunk.length ? this.first_chunk[i2 + 1] : Infinity); j++) {
            m++;
            for (k = 0; k < this.samples_per_chunk[i2]; k++) {
              if (samples[l]) {
                samples[l].description_index = this.sample_description_index[i2];
                samples[l].chunk_index = m;
              } else {
                return;
              }
              l++;
            }
          }
        }
      };
      BoxParser.stszBox.prototype.unpack = function(samples) {
        var i2;
        for (i2 = 0; i2 < this.sample_sizes.length; i2++) {
          samples[i2].size = this.sample_sizes[i2];
        }
      };
      BoxParser.DIFF_BOXES_PROP_NAMES = [
        "boxes",
        "entries",
        "references",
        "subsamples",
        "items",
        "item_infos",
        "extents",
        "associations",
        "subsegments",
        "ranges",
        "seekLists",
        "seekPoints",
        "esd",
        "levels"
      ];
      BoxParser.DIFF_PRIMITIVE_ARRAY_PROP_NAMES = [
        "compatible_brands",
        "matrix",
        "opcolor",
        "sample_counts",
        "sample_deltas",
        "first_chunk",
        "samples_per_chunk",
        "sample_sizes",
        "chunk_offsets",
        "sample_offsets",
        "sample_description_index",
        "sample_duration"
      ];
      BoxParser.boxEqualFields = function(box_a, box_b) {
        if (box_a && !box_b) return false;
        var prop;
        for (prop in box_a) {
          if (BoxParser.DIFF_BOXES_PROP_NAMES.indexOf(prop) > -1) {
            continue;
          } else if (box_a[prop] instanceof BoxParser.Box || box_b[prop] instanceof BoxParser.Box) {
            continue;
          } else if (typeof box_a[prop] === "undefined" || typeof box_b[prop] === "undefined") {
            continue;
          } else if (typeof box_a[prop] === "function" || typeof box_b[prop] === "function") {
            continue;
          } else if (box_a.subBoxNames && box_a.subBoxNames.indexOf(prop.slice(0, 4)) > -1 || box_b.subBoxNames && box_b.subBoxNames.indexOf(prop.slice(0, 4)) > -1) {
            continue;
          } else {
            if (prop === "data" || prop === "start" || prop === "size" || prop === "creation_time" || prop === "modification_time") {
              continue;
            } else if (BoxParser.DIFF_PRIMITIVE_ARRAY_PROP_NAMES.indexOf(prop) > -1) {
              continue;
            } else {
              if (box_a[prop] !== box_b[prop]) {
                return false;
              }
            }
          }
        }
        return true;
      };
      BoxParser.boxEqual = function(box_a, box_b) {
        if (!BoxParser.boxEqualFields(box_a, box_b)) {
          return false;
        }
        for (var j = 0; j < BoxParser.DIFF_BOXES_PROP_NAMES.length; j++) {
          var name = BoxParser.DIFF_BOXES_PROP_NAMES[j];
          if (box_a[name] && box_b[name]) {
            if (!BoxParser.boxEqual(box_a[name], box_b[name])) {
              return false;
            }
          }
        }
        return true;
      };
      var VTTin4Parser = function() {
      };
      VTTin4Parser.prototype.parseSample = function(data) {
        var cues, cue;
        var stream = new MP4BoxStream(data.buffer);
        cues = [];
        while (!stream.isEos()) {
          cue = BoxParser.parseOneBox(stream, false);
          if (cue.code === BoxParser.OK && cue.box.type === "vttc") {
            cues.push(cue.box);
          }
        }
        return cues;
      };
      VTTin4Parser.prototype.getText = function(startTime, endTime, data) {
        function pad(n, width, z) {
          z = z || "0";
          n = n + "";
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
        function secToTimestamp(insec) {
          var h = Math.floor(insec / 3600);
          var m = Math.floor((insec - h * 3600) / 60);
          var s = Math.floor(insec - h * 3600 - m * 60);
          var ms = Math.floor((insec - h * 3600 - m * 60 - s) * 1e3);
          return "" + pad(h, 2) + ":" + pad(m, 2) + ":" + pad(s, 2) + "." + pad(ms, 3);
        }
        var cues = this.parseSample(data);
        var string = "";
        for (var i2 = 0; i2 < cues.length; i2++) {
          var cueIn4 = cues[i2];
          string += secToTimestamp(startTime) + " --> " + secToTimestamp(endTime) + "\r\n";
          string += cueIn4.payl.text;
        }
        return string;
      };
      var XMLSubtitlein4Parser = function() {
      };
      XMLSubtitlein4Parser.prototype.parseSample = function(sample) {
        var res = {};
        var i2;
        res.resources = [];
        var stream = new MP4BoxStream(sample.data.buffer);
        if (!sample.subsamples || sample.subsamples.length === 0) {
          res.documentString = stream.readString(sample.data.length);
        } else {
          res.documentString = stream.readString(sample.subsamples[0].size);
          if (sample.subsamples.length > 1) {
            for (i2 = 1; i2 < sample.subsamples.length; i2++) {
              res.resources[i2] = stream.readUint8Array(sample.subsamples[i2].size);
            }
          }
        }
        if (typeof DOMParser !== "undefined") {
          res.document = new DOMParser().parseFromString(res.documentString, "application/xml");
        }
        return res;
      };
      var Textin4Parser = function() {
      };
      Textin4Parser.prototype.parseSample = function(sample) {
        var textString;
        var stream = new MP4BoxStream(sample.data.buffer);
        textString = stream.readString(sample.data.length);
        return textString;
      };
      Textin4Parser.prototype.parseConfig = function(data) {
        var textString;
        var stream = new MP4BoxStream(data.buffer);
        stream.readUint32();
        textString = stream.readCString();
        return textString;
      };
      if (typeof exports !== "undefined") {
        exports.VTTin4Parser = VTTin4Parser;
        exports.XMLSubtitlein4Parser = XMLSubtitlein4Parser;
        exports.Textin4Parser = Textin4Parser;
      }
      var ISOFile = function(stream) {
        this.stream = stream || new MultiBufferStream();
        this.boxes = [];
        this.mdats = [];
        this.moofs = [];
        this.isProgressive = false;
        this.moovStartFound = false;
        this.onMoovStart = null;
        this.moovStartSent = false;
        this.onReady = null;
        this.readySent = false;
        this.onSegment = null;
        this.onSamples = null;
        this.onError = null;
        this.sampleListBuilt = false;
        this.fragmentedTracks = [];
        this.extractedTracks = [];
        this.isFragmentationInitialized = false;
        this.sampleProcessingStarted = false;
        this.nextMoofNumber = 0;
        this.itemListBuilt = false;
        this.items = [];
        this.entity_groups = [];
        this.onSidx = null;
        this.sidxSent = false;
      };
      ISOFile.prototype.setSegmentOptions = function(id, user, options) {
        var trak = this.getTrackById(id);
        if (trak) {
          var fragTrack = {};
          this.fragmentedTracks.push(fragTrack);
          fragTrack.id = id;
          fragTrack.user = user;
          fragTrack.trak = trak;
          trak.nextSample = 0;
          fragTrack.segmentStream = null;
          fragTrack.nb_samples = 1e3;
          fragTrack.rapAlignement = true;
          if (options) {
            if (options.nbSamples) fragTrack.nb_samples = options.nbSamples;
            if (options.rapAlignement) fragTrack.rapAlignement = options.rapAlignement;
          }
        }
      };
      ISOFile.prototype.unsetSegmentOptions = function(id) {
        var index = -1;
        for (var i2 = 0; i2 < this.fragmentedTracks.length; i2++) {
          var fragTrack = this.fragmentedTracks[i2];
          if (fragTrack.id == id) {
            index = i2;
          }
        }
        if (index > -1) {
          this.fragmentedTracks.splice(index, 1);
        }
      };
      ISOFile.prototype.setExtractionOptions = function(id, user, options) {
        var trak = this.getTrackById(id);
        if (trak) {
          var extractTrack = {};
          this.extractedTracks.push(extractTrack);
          extractTrack.id = id;
          extractTrack.user = user;
          extractTrack.trak = trak;
          trak.nextSample = 0;
          extractTrack.nb_samples = 1e3;
          extractTrack.samples = [];
          if (options) {
            if (options.nbSamples) extractTrack.nb_samples = options.nbSamples;
          }
        }
      };
      ISOFile.prototype.unsetExtractionOptions = function(id) {
        var index = -1;
        for (var i2 = 0; i2 < this.extractedTracks.length; i2++) {
          var extractTrack = this.extractedTracks[i2];
          if (extractTrack.id == id) {
            index = i2;
          }
        }
        if (index > -1) {
          this.extractedTracks.splice(index, 1);
        }
      };
      ISOFile.prototype.parse = function() {
        var found;
        var ret2;
        var box2;
        var parseBoxHeadersOnly = false;
        if (this.restoreParsePosition) {
          if (!this.restoreParsePosition()) {
            return;
          }
        }
        while (true) {
          if (this.hasIncompleteMdat && this.hasIncompleteMdat()) {
            if (this.processIncompleteMdat()) {
              continue;
            } else {
              return;
            }
          } else {
            if (this.saveParsePosition) {
              this.saveParsePosition();
            }
            ret2 = BoxParser.parseOneBox(this.stream, parseBoxHeadersOnly);
            if (ret2.code === BoxParser.ERR_NOT_ENOUGH_DATA) {
              if (this.processIncompleteBox) {
                if (this.processIncompleteBox(ret2)) {
                  continue;
                } else {
                  return;
                }
              } else {
                return;
              }
            } else {
              var box_type;
              box2 = ret2.box;
              box_type = box2.type !== "uuid" ? box2.type : box2.uuid;
              this.boxes.push(box2);
              switch (box_type) {
                case "mdat":
                  this.mdats.push(box2);
                  break;
                case "moof":
                  this.moofs.push(box2);
                  break;
                case "moov":
                  this.moovStartFound = true;
                  if (this.mdats.length === 0) {
                    this.isProgressive = true;
                  }
                /* no break */
                /* falls through */
                default:
                  if (this[box_type] !== void 0) {
                    Log.warn("ISOFile", "Duplicate Box of type: " + box_type + ", overriding previous occurrence");
                  }
                  this[box_type] = box2;
                  break;
              }
              if (this.updateUsedBytes) {
                this.updateUsedBytes(box2, ret2);
              }
            }
          }
        }
      };
      ISOFile.prototype.checkBuffer = function(ab) {
        if (ab === null || ab === void 0) {
          throw "Buffer must be defined and non empty";
        }
        if (ab.fileStart === void 0) {
          throw "Buffer must have a fileStart property";
        }
        if (ab.byteLength === 0) {
          Log.warn("ISOFile", "Ignoring empty buffer (fileStart: " + ab.fileStart + ")");
          this.stream.logBufferLevel();
          return false;
        }
        Log.info("ISOFile", "Processing buffer (fileStart: " + ab.fileStart + ")");
        ab.usedBytes = 0;
        this.stream.insertBuffer(ab);
        this.stream.logBufferLevel();
        if (!this.stream.initialized()) {
          Log.warn("ISOFile", "Not ready to start parsing");
          return false;
        }
        return true;
      };
      ISOFile.prototype.appendBuffer = function(ab, last) {
        var nextFileStart;
        if (!this.checkBuffer(ab)) {
          return;
        }
        this.parse();
        if (this.moovStartFound && !this.moovStartSent) {
          this.moovStartSent = true;
          if (this.onMoovStart) this.onMoovStart();
        }
        if (this.moov) {
          if (!this.sampleListBuilt) {
            this.buildSampleLists();
            this.sampleListBuilt = true;
          }
          this.updateSampleLists();
          if (this.onReady && !this.readySent) {
            this.readySent = true;
            this.onReady(this.getInfo());
          }
          this.processSamples(last);
          if (this.nextSeekPosition) {
            nextFileStart = this.nextSeekPosition;
            this.nextSeekPosition = void 0;
          } else {
            nextFileStart = this.nextParsePosition;
          }
          if (this.stream.getEndFilePositionAfter) {
            nextFileStart = this.stream.getEndFilePositionAfter(nextFileStart);
          }
        } else {
          if (this.nextParsePosition) {
            nextFileStart = this.nextParsePosition;
          } else {
            nextFileStart = 0;
          }
        }
        if (this.sidx) {
          if (this.onSidx && !this.sidxSent) {
            this.onSidx(this.sidx);
            this.sidxSent = true;
          }
        }
        if (this.meta) {
          if (this.flattenItemInfo && !this.itemListBuilt) {
            this.flattenItemInfo();
            this.itemListBuilt = true;
          }
          if (this.processItems) {
            this.processItems(this.onItem);
          }
        }
        if (this.stream.cleanBuffers) {
          Log.info("ISOFile", "Done processing buffer (fileStart: " + ab.fileStart + ") - next buffer to fetch should have a fileStart position of " + nextFileStart);
          this.stream.logBufferLevel();
          this.stream.cleanBuffers();
          this.stream.logBufferLevel(true);
          Log.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize());
        }
        return nextFileStart;
      };
      ISOFile.prototype.getInfo = function() {
        var i2, j;
        var movie = {};
        var trak;
        var track;
        var ref;
        var sample_desc;
        var _1904 = (/* @__PURE__ */ new Date("1904-01-01T00:00:00Z")).getTime();
        if (this.moov) {
          movie.hasMoov = true;
          movie.duration = this.moov.mvhd.duration;
          movie.timescale = this.moov.mvhd.timescale;
          movie.isFragmented = this.moov.mvex != null;
          if (movie.isFragmented && this.moov.mvex.mehd) {
            movie.fragment_duration = this.moov.mvex.mehd.fragment_duration;
          }
          movie.isProgressive = this.isProgressive;
          movie.hasIOD = this.moov.iods != null;
          movie.brands = [];
          movie.brands.push(this.ftyp.major_brand);
          movie.brands = movie.brands.concat(this.ftyp.compatible_brands);
          movie.created = new Date(_1904 + this.moov.mvhd.creation_time * 1e3);
          movie.modified = new Date(_1904 + this.moov.mvhd.modification_time * 1e3);
          movie.tracks = [];
          movie.audioTracks = [];
          movie.videoTracks = [];
          movie.subtitleTracks = [];
          movie.metadataTracks = [];
          movie.hintTracks = [];
          movie.otherTracks = [];
          for (i2 = 0; i2 < this.moov.traks.length; i2++) {
            trak = this.moov.traks[i2];
            sample_desc = trak.mdia.minf.stbl.stsd.entries[0];
            track = {};
            movie.tracks.push(track);
            track.id = trak.tkhd.track_id;
            track.name = trak.mdia.hdlr.name;
            track.references = [];
            if (trak.tref) {
              for (j = 0; j < trak.tref.boxes.length; j++) {
                ref = {};
                track.references.push(ref);
                ref.type = trak.tref.boxes[j].type;
                ref.track_ids = trak.tref.boxes[j].track_ids;
              }
            }
            if (trak.edts) {
              track.edits = trak.edts.elst.entries;
            }
            track.created = new Date(_1904 + trak.tkhd.creation_time * 1e3);
            track.modified = new Date(_1904 + trak.tkhd.modification_time * 1e3);
            track.movie_duration = trak.tkhd.duration;
            track.movie_timescale = movie.timescale;
            track.layer = trak.tkhd.layer;
            track.alternate_group = trak.tkhd.alternate_group;
            track.volume = trak.tkhd.volume;
            track.matrix = trak.tkhd.matrix;
            track.track_width = trak.tkhd.width / (1 << 16);
            track.track_height = trak.tkhd.height / (1 << 16);
            track.timescale = trak.mdia.mdhd.timescale;
            track.cts_shift = trak.mdia.minf.stbl.cslg;
            track.duration = trak.mdia.mdhd.duration;
            track.samples_duration = trak.samples_duration;
            track.codec = sample_desc.getCodec();
            track.kind = trak.udta && trak.udta.kinds.length ? trak.udta.kinds[0] : { schemeURI: "", value: "" };
            track.language = trak.mdia.elng ? trak.mdia.elng.extended_language : trak.mdia.mdhd.languageString;
            track.nb_samples = trak.samples.length;
            track.size = trak.samples_size;
            track.bitrate = track.size * 8 * track.timescale / track.samples_duration;
            if (sample_desc.isAudio()) {
              track.type = "audio";
              movie.audioTracks.push(track);
              track.audio = {};
              track.audio.sample_rate = sample_desc.getSampleRate();
              track.audio.channel_count = sample_desc.getChannelCount();
              track.audio.sample_size = sample_desc.getSampleSize();
            } else if (sample_desc.isVideo()) {
              track.type = "video";
              movie.videoTracks.push(track);
              track.video = {};
              track.video.width = sample_desc.getWidth();
              track.video.height = sample_desc.getHeight();
            } else if (sample_desc.isSubtitle()) {
              track.type = "subtitles";
              movie.subtitleTracks.push(track);
            } else if (sample_desc.isHint()) {
              track.type = "metadata";
              movie.hintTracks.push(track);
            } else if (sample_desc.isMetadata()) {
              track.type = "metadata";
              movie.metadataTracks.push(track);
            } else {
              track.type = "metadata";
              movie.otherTracks.push(track);
            }
          }
        } else {
          movie.hasMoov = false;
        }
        movie.mime = "";
        if (movie.hasMoov && movie.tracks) {
          if (movie.videoTracks && movie.videoTracks.length > 0) {
            movie.mime += 'video/mp4; codecs="';
          } else if (movie.audioTracks && movie.audioTracks.length > 0) {
            movie.mime += 'audio/mp4; codecs="';
          } else {
            movie.mime += 'application/mp4; codecs="';
          }
          for (i2 = 0; i2 < movie.tracks.length; i2++) {
            if (i2 !== 0) movie.mime += ",";
            movie.mime += movie.tracks[i2].codec;
          }
          movie.mime += '"; profiles="';
          movie.mime += this.ftyp.compatible_brands.join();
          movie.mime += '"';
        }
        return movie;
      };
      ISOFile.prototype.setNextSeekPositionFromSample = function(sample) {
        if (!sample) {
          return;
        }
        if (this.nextSeekPosition) {
          this.nextSeekPosition = Math.min(sample.offset + sample.alreadyRead, this.nextSeekPosition);
        } else {
          this.nextSeekPosition = sample.offset + sample.alreadyRead;
        }
      };
      ISOFile.prototype.processSamples = function(last) {
        var i2;
        var trak;
        if (!this.sampleProcessingStarted) return;
        if (this.isFragmentationInitialized && this.onSegment !== null) {
          for (i2 = 0; i2 < this.fragmentedTracks.length; i2++) {
            var fragTrak = this.fragmentedTracks[i2];
            trak = fragTrak.trak;
            while (trak.nextSample < trak.samples.length && this.sampleProcessingStarted) {
              Log.debug("ISOFile", "Creating media fragment on track #" + fragTrak.id + " for sample " + trak.nextSample);
              var result = this.createFragment(fragTrak.id, trak.nextSample, fragTrak.segmentStream);
              if (result) {
                fragTrak.segmentStream = result;
                trak.nextSample++;
              } else {
                break;
              }
              if (trak.nextSample % fragTrak.nb_samples === 0 || (last || trak.nextSample >= trak.samples.length)) {
                Log.info("ISOFile", "Sending fragmented data on track #" + fragTrak.id + " for samples [" + Math.max(0, trak.nextSample - fragTrak.nb_samples) + "," + (trak.nextSample - 1) + "]");
                Log.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize());
                if (this.onSegment) {
                  this.onSegment(fragTrak.id, fragTrak.user, fragTrak.segmentStream.buffer, trak.nextSample, last || trak.nextSample >= trak.samples.length);
                }
                fragTrak.segmentStream = null;
                if (fragTrak !== this.fragmentedTracks[i2]) {
                  break;
                }
              }
            }
          }
        }
        if (this.onSamples !== null) {
          for (i2 = 0; i2 < this.extractedTracks.length; i2++) {
            var extractTrak = this.extractedTracks[i2];
            trak = extractTrak.trak;
            while (trak.nextSample < trak.samples.length && this.sampleProcessingStarted) {
              Log.debug("ISOFile", "Exporting on track #" + extractTrak.id + " sample #" + trak.nextSample);
              var sample = this.getSample(trak, trak.nextSample);
              if (sample) {
                trak.nextSample++;
                extractTrak.samples.push(sample);
              } else {
                this.setNextSeekPositionFromSample(trak.samples[trak.nextSample]);
                break;
              }
              if (trak.nextSample % extractTrak.nb_samples === 0 || trak.nextSample >= trak.samples.length) {
                Log.debug("ISOFile", "Sending samples on track #" + extractTrak.id + " for sample " + trak.nextSample);
                if (this.onSamples) {
                  this.onSamples(extractTrak.id, extractTrak.user, extractTrak.samples);
                }
                extractTrak.samples = [];
                if (extractTrak !== this.extractedTracks[i2]) {
                  break;
                }
              }
            }
          }
        }
      };
      ISOFile.prototype.getBox = function(type) {
        var result = this.getBoxes(type, true);
        return result.length ? result[0] : null;
      };
      ISOFile.prototype.getBoxes = function(type, returnEarly) {
        var result = [];
        ISOFile._sweep.call(this, type, result, returnEarly);
        return result;
      };
      ISOFile._sweep = function(type, result, returnEarly) {
        if (this.type && this.type == type) result.push(this);
        for (var box2 in this.boxes) {
          if (result.length && returnEarly) return;
          ISOFile._sweep.call(this.boxes[box2], type, result, returnEarly);
        }
      };
      ISOFile.prototype.getTrackSamplesInfo = function(track_id) {
        var track = this.getTrackById(track_id);
        if (track) {
          return track.samples;
        } else {
          return;
        }
      };
      ISOFile.prototype.getTrackSample = function(track_id, number) {
        var track = this.getTrackById(track_id);
        var sample = this.getSample(track, number);
        return sample;
      };
      ISOFile.prototype.releaseUsedSamples = function(id, sampleNum) {
        var size = 0;
        var trak = this.getTrackById(id);
        if (!trak.lastValidSample) trak.lastValidSample = 0;
        for (var i2 = trak.lastValidSample; i2 < sampleNum; i2++) {
          size += this.releaseSample(trak, i2);
        }
        Log.info("ISOFile", "Track #" + id + " released samples up to " + sampleNum + " (released size: " + size + ", remaining: " + this.samplesDataSize + ")");
        trak.lastValidSample = sampleNum;
      };
      ISOFile.prototype.start = function() {
        this.sampleProcessingStarted = true;
        this.processSamples(false);
      };
      ISOFile.prototype.stop = function() {
        this.sampleProcessingStarted = false;
      };
      ISOFile.prototype.flush = function() {
        Log.info("ISOFile", "Flushing remaining samples");
        this.updateSampleLists();
        this.processSamples(true);
        this.stream.cleanBuffers();
        this.stream.logBufferLevel(true);
      };
      ISOFile.prototype.seekTrack = function(time, useRap, trak) {
        var j;
        var sample;
        var seek_offset = Infinity;
        var rap_seek_sample_num = 0;
        var seek_sample_num = 0;
        var timescale;
        if (trak.samples.length === 0) {
          Log.info("ISOFile", "No sample in track, cannot seek! Using time " + Log.getDurationString(0, 1) + " and offset: 0");
          return { offset: 0, time: 0 };
        }
        for (j = 0; j < trak.samples.length; j++) {
          sample = trak.samples[j];
          if (j === 0) {
            seek_sample_num = 0;
            timescale = sample.timescale;
          } else if (sample.cts > time * sample.timescale) {
            seek_sample_num = j - 1;
            break;
          }
          if (useRap && sample.is_sync) {
            rap_seek_sample_num = j;
          }
        }
        if (useRap) {
          seek_sample_num = rap_seek_sample_num;
        }
        time = trak.samples[seek_sample_num].cts;
        trak.nextSample = seek_sample_num;
        while (trak.samples[seek_sample_num].alreadyRead === trak.samples[seek_sample_num].size) {
          if (!trak.samples[seek_sample_num + 1]) {
            break;
          }
          seek_sample_num++;
        }
        seek_offset = trak.samples[seek_sample_num].offset + trak.samples[seek_sample_num].alreadyRead;
        Log.info("ISOFile", "Seeking to " + (useRap ? "RAP" : "") + " sample #" + trak.nextSample + " on track " + trak.tkhd.track_id + ", time " + Log.getDurationString(time, timescale) + " and offset: " + seek_offset);
        return { offset: seek_offset, time: time / timescale };
      };
      ISOFile.prototype.getTrackDuration = function(trak) {
        var sample;
        if (!trak.samples) {
          return Infinity;
        }
        sample = trak.samples[trak.samples.length - 1];
        return (sample.cts + sample.duration) / sample.timescale;
      };
      ISOFile.prototype.seek = function(time, useRap) {
        var moov = this.moov;
        var trak;
        var trak_seek_info;
        var i2;
        var seek_info = { offset: Infinity, time: Infinity };
        if (!this.moov) {
          throw "Cannot seek: moov not received!";
        } else {
          for (i2 = 0; i2 < moov.traks.length; i2++) {
            trak = moov.traks[i2];
            if (time > this.getTrackDuration(trak)) {
              continue;
            }
            trak_seek_info = this.seekTrack(time, useRap, trak);
            if (trak_seek_info.offset < seek_info.offset) {
              seek_info.offset = trak_seek_info.offset;
            }
            if (trak_seek_info.time < seek_info.time) {
              seek_info.time = trak_seek_info.time;
            }
          }
          Log.info("ISOFile", "Seeking at time " + Log.getDurationString(seek_info.time, 1) + " needs a buffer with a fileStart position of " + seek_info.offset);
          if (seek_info.offset === Infinity) {
            seek_info = { offset: this.nextParsePosition, time: 0 };
          } else {
            seek_info.offset = this.stream.getEndFilePositionAfter(seek_info.offset);
          }
          Log.info("ISOFile", "Adjusted seek position (after checking data already in buffer): " + seek_info.offset);
          return seek_info;
        }
      };
      ISOFile.prototype.equal = function(b) {
        var box_index = 0;
        while (box_index < this.boxes.length && box_index < b.boxes.length) {
          var a_box = this.boxes[box_index];
          var b_box = b.boxes[box_index];
          if (!BoxParser.boxEqual(a_box, b_box)) {
            return false;
          }
          box_index++;
        }
        return true;
      };
      if (typeof exports !== "undefined") {
        exports.ISOFile = ISOFile;
      }
      ISOFile.prototype.lastBoxStartPosition = 0;
      ISOFile.prototype.parsingMdat = null;
      ISOFile.prototype.nextParsePosition = 0;
      ISOFile.prototype.discardMdatData = false;
      ISOFile.prototype.processIncompleteBox = function(ret2) {
        var box2;
        var merged;
        var found;
        if (ret2.type === "mdat") {
          box2 = new BoxParser[ret2.type + "Box"](ret2.size);
          this.parsingMdat = box2;
          this.boxes.push(box2);
          this.mdats.push(box2);
          box2.start = ret2.start;
          box2.hdr_size = ret2.hdr_size;
          this.stream.addUsedBytes(box2.hdr_size);
          this.lastBoxStartPosition = box2.start + box2.size;
          found = this.stream.seek(box2.start + box2.size, false, this.discardMdatData);
          if (found) {
            this.parsingMdat = null;
            return true;
          } else {
            if (!this.moovStartFound) {
              this.nextParsePosition = box2.start + box2.size;
            } else {
              this.nextParsePosition = this.stream.findEndContiguousBuf();
            }
            return false;
          }
        } else {
          if (ret2.type === "moov") {
            this.moovStartFound = true;
            if (this.mdats.length === 0) {
              this.isProgressive = true;
            }
          }
          merged = this.stream.mergeNextBuffer ? this.stream.mergeNextBuffer() : false;
          if (merged) {
            this.nextParsePosition = this.stream.getEndPosition();
            return true;
          } else {
            if (!ret2.type) {
              this.nextParsePosition = this.stream.getEndPosition();
            } else {
              if (this.moovStartFound) {
                this.nextParsePosition = this.stream.getEndPosition();
              } else {
                this.nextParsePosition = this.stream.getPosition() + ret2.size;
              }
            }
            return false;
          }
        }
      };
      ISOFile.prototype.hasIncompleteMdat = function() {
        return this.parsingMdat !== null;
      };
      ISOFile.prototype.processIncompleteMdat = function() {
        var box2;
        var found;
        box2 = this.parsingMdat;
        found = this.stream.seek(box2.start + box2.size, false, this.discardMdatData);
        if (found) {
          Log.debug("ISOFile", "Found 'mdat' end in buffered data");
          this.parsingMdat = null;
          return true;
        } else {
          this.nextParsePosition = this.stream.findEndContiguousBuf();
          return false;
        }
      };
      ISOFile.prototype.restoreParsePosition = function() {
        return this.stream.seek(this.lastBoxStartPosition, true, this.discardMdatData);
      };
      ISOFile.prototype.saveParsePosition = function() {
        this.lastBoxStartPosition = this.stream.getPosition();
      };
      ISOFile.prototype.updateUsedBytes = function(box2, ret2) {
        if (this.stream.addUsedBytes) {
          if (box2.type === "mdat") {
            this.stream.addUsedBytes(box2.hdr_size);
            if (this.discardMdatData) {
              this.stream.addUsedBytes(box2.size - box2.hdr_size);
            }
          } else {
            this.stream.addUsedBytes(box2.size);
          }
        }
      };
      ISOFile.prototype.add = BoxParser.Box.prototype.add;
      ISOFile.prototype.addBox = BoxParser.Box.prototype.addBox;
      ISOFile.prototype.init = function(_options) {
        var options = _options || {};
        var ftyp = this.add("ftyp").set("major_brand", options.brands && options.brands[0] || "iso4").set("minor_version", 0).set("compatible_brands", options.brands || ["iso4"]);
        var moov = this.add("moov");
        moov.add("mvhd").set("timescale", options.timescale || 600).set("rate", options.rate || 1 << 16).set("creation_time", 0).set("modification_time", 0).set("duration", options.duration || 0).set("volume", options.width ? 0 : 256).set("matrix", [1 << 16, 0, 0, 0, 1 << 16, 0, 0, 0, 1073741824]).set("next_track_id", 1);
        moov.add("mvex");
        return this;
      };
      ISOFile.prototype.addTrack = function(_options) {
        if (!this.moov) {
          this.init(_options);
        }
        var options = _options || {};
        options.width = options.width || 320;
        options.height = options.height || 320;
        options.id = options.id || this.moov.mvhd.next_track_id;
        options.type = options.type || "avc1";
        var trak = this.moov.add("trak");
        this.moov.mvhd.next_track_id = options.id + 1;
        trak.add("tkhd").set("flags", BoxParser.TKHD_FLAG_ENABLED | BoxParser.TKHD_FLAG_IN_MOVIE | BoxParser.TKHD_FLAG_IN_PREVIEW).set("creation_time", 0).set("modification_time", 0).set("track_id", options.id).set("duration", options.duration || 0).set("layer", options.layer || 0).set("alternate_group", 0).set("volume", 1).set("matrix", [1 << 16, 0, 0, 0, 1 << 16, 0, 0, 0, 1073741824]).set("width", options.width << 16).set("height", options.height << 16);
        var mdia = trak.add("mdia");
        mdia.add("mdhd").set("creation_time", 0).set("modification_time", 0).set("timescale", options.timescale || 1).set("duration", options.media_duration || 0).set("language", options.language || "und");
        mdia.add("hdlr").set("handler", options.hdlr || "vide").set("name", options.name || "Track created with MP4Box.js");
        mdia.add("elng").set("extended_language", options.language || "fr-FR");
        var minf = mdia.add("minf");
        if (BoxParser[options.type + "SampleEntry"] === void 0) return;
        var sample_description_entry = new BoxParser[options.type + "SampleEntry"]();
        sample_description_entry.data_reference_index = 1;
        var media_type = "";
        for (var mediaType in BoxParser.sampleEntryCodes) {
          var codes = BoxParser.sampleEntryCodes[mediaType];
          for (var i2 = 0; i2 < codes.length; i2++) {
            if (codes.indexOf(options.type) > -1) {
              media_type = mediaType;
              break;
            }
          }
        }
        switch (media_type) {
          case "Visual":
            minf.add("vmhd").set("graphicsmode", 0).set("opcolor", [0, 0, 0]);
            sample_description_entry.set("width", options.width).set("height", options.height).set("horizresolution", 72 << 16).set("vertresolution", 72 << 16).set("frame_count", 1).set("compressorname", options.type + " Compressor").set("depth", 24);
            if (options.avcDecoderConfigRecord) {
              var avcC = new BoxParser.avcCBox();
              avcC.parse(new MP4BoxStream(options.avcDecoderConfigRecord));
              sample_description_entry.addBox(avcC);
            } else if (options.hevcDecoderConfigRecord) {
              var hvcC = new BoxParser.hvcCBox();
              hvcC.parse(new MP4BoxStream(options.hevcDecoderConfigRecord));
              sample_description_entry.addBox(hvcC);
            }
            break;
          case "Audio":
            minf.add("smhd").set("balance", options.balance || 0);
            sample_description_entry.set("channel_count", options.channel_count || 2).set("samplesize", options.samplesize || 16).set("samplerate", options.samplerate || 1 << 16);
            break;
          case "Hint":
            minf.add("hmhd");
            break;
          case "Subtitle":
            minf.add("sthd");
            switch (options.type) {
              case "stpp":
                sample_description_entry.set("namespace", options.namespace || "nonamespace").set("schema_location", options.schema_location || "").set("auxiliary_mime_types", options.auxiliary_mime_types || "");
                break;
            }
            break;
          case "Metadata":
            minf.add("nmhd");
            break;
          case "System":
            minf.add("nmhd");
            break;
          default:
            minf.add("nmhd");
            break;
        }
        if (options.description) {
          sample_description_entry.addBox(options.description);
        }
        if (options.description_boxes) {
          options.description_boxes.forEach(function(b) {
            sample_description_entry.addBox(b);
          });
        }
        minf.add("dinf").add("dref").addEntry(new BoxParser["url Box"]().set("flags", 1));
        var stbl = minf.add("stbl");
        stbl.add("stsd").addEntry(sample_description_entry);
        stbl.add("stts").set("sample_counts", []).set("sample_deltas", []);
        stbl.add("stsc").set("first_chunk", []).set("samples_per_chunk", []).set("sample_description_index", []);
        stbl.add("stco").set("chunk_offsets", []);
        stbl.add("stsz").set("sample_sizes", []);
        this.moov.mvex.add("trex").set("track_id", options.id).set("default_sample_description_index", options.default_sample_description_index || 1).set("default_sample_duration", options.default_sample_duration || 0).set("default_sample_size", options.default_sample_size || 0).set("default_sample_flags", options.default_sample_flags || 0);
        this.buildTrakSampleLists(trak);
        return options.id;
      };
      BoxParser.Box.prototype.computeSize = function(stream_) {
        var stream = stream_ || new DataStream();
        stream.endianness = DataStream.BIG_ENDIAN;
        this.write(stream);
      };
      ISOFile.prototype.addSample = function(track_id, data, _options) {
        var options = _options || {};
        var sample = {};
        var trak = this.getTrackById(track_id);
        if (trak === null) return;
        sample.number = trak.samples.length;
        sample.track_id = trak.tkhd.track_id;
        sample.timescale = trak.mdia.mdhd.timescale;
        sample.description_index = options.sample_description_index ? options.sample_description_index - 1 : 0;
        sample.description = trak.mdia.minf.stbl.stsd.entries[sample.description_index];
        sample.data = data;
        sample.size = data.byteLength;
        sample.alreadyRead = sample.size;
        sample.duration = options.duration || 1;
        sample.cts = options.cts || 0;
        sample.dts = options.dts || 0;
        sample.is_sync = options.is_sync || false;
        sample.is_leading = options.is_leading || 0;
        sample.depends_on = options.depends_on || 0;
        sample.is_depended_on = options.is_depended_on || 0;
        sample.has_redundancy = options.has_redundancy || 0;
        sample.degradation_priority = options.degradation_priority || 0;
        sample.offset = 0;
        sample.subsamples = options.subsamples;
        trak.samples.push(sample);
        trak.samples_size += sample.size;
        trak.samples_duration += sample.duration;
        if (trak.first_dts === void 0) {
          trak.first_dts = options.dts;
        }
        this.processSamples();
        var moof = this.createSingleSampleMoof(sample);
        this.addBox(moof);
        moof.computeSize();
        moof.trafs[0].truns[0].data_offset = moof.size + 8;
        this.add("mdat").data = new Uint8Array(data);
        return sample;
      };
      ISOFile.prototype.createSingleSampleMoof = function(sample) {
        var sample_flags = 0;
        if (sample.is_sync)
          sample_flags = 1 << 25;
        else
          sample_flags = 1 << 16;
        var moof = new BoxParser.moofBox();
        moof.add("mfhd").set("sequence_number", this.nextMoofNumber);
        this.nextMoofNumber++;
        var traf = moof.add("traf");
        var trak = this.getTrackById(sample.track_id);
        traf.add("tfhd").set("track_id", sample.track_id).set("flags", BoxParser.TFHD_FLAG_DEFAULT_BASE_IS_MOOF);
        traf.add("tfdt").set("baseMediaDecodeTime", sample.dts - (trak.first_dts || 0));
        traf.add("trun").set("flags", BoxParser.TRUN_FLAGS_DATA_OFFSET | BoxParser.TRUN_FLAGS_DURATION | BoxParser.TRUN_FLAGS_SIZE | BoxParser.TRUN_FLAGS_FLAGS | BoxParser.TRUN_FLAGS_CTS_OFFSET).set("data_offset", 0).set("first_sample_flags", 0).set("sample_count", 1).set("sample_duration", [sample.duration]).set("sample_size", [sample.size]).set("sample_flags", [sample_flags]).set("sample_composition_time_offset", [sample.cts - sample.dts]);
        return moof;
      };
      ISOFile.prototype.lastMoofIndex = 0;
      ISOFile.prototype.samplesDataSize = 0;
      ISOFile.prototype.resetTables = function() {
        var i2;
        var trak, stco, stsc, stsz, stts, ctts, stss;
        this.initial_duration = this.moov.mvhd.duration;
        this.moov.mvhd.duration = 0;
        for (i2 = 0; i2 < this.moov.traks.length; i2++) {
          trak = this.moov.traks[i2];
          trak.tkhd.duration = 0;
          trak.mdia.mdhd.duration = 0;
          stco = trak.mdia.minf.stbl.stco || trak.mdia.minf.stbl.co64;
          stco.chunk_offsets = [];
          stsc = trak.mdia.minf.stbl.stsc;
          stsc.first_chunk = [];
          stsc.samples_per_chunk = [];
          stsc.sample_description_index = [];
          stsz = trak.mdia.minf.stbl.stsz || trak.mdia.minf.stbl.stz2;
          stsz.sample_sizes = [];
          stts = trak.mdia.minf.stbl.stts;
          stts.sample_counts = [];
          stts.sample_deltas = [];
          ctts = trak.mdia.minf.stbl.ctts;
          if (ctts) {
            ctts.sample_counts = [];
            ctts.sample_offsets = [];
          }
          stss = trak.mdia.minf.stbl.stss;
          var k = trak.mdia.minf.stbl.boxes.indexOf(stss);
          if (k != -1) trak.mdia.minf.stbl.boxes[k] = null;
        }
      };
      ISOFile.initSampleGroups = function(trak, traf, sbgps, trak_sgpds, traf_sgpds) {
        var l;
        var k;
        var sample_groups_info;
        var sample_group_info;
        var sample_group_key;
        function SampleGroupInfo(_type, _parameter, _sbgp) {
          this.grouping_type = _type;
          this.grouping_type_parameter = _parameter;
          this.sbgp = _sbgp;
          this.last_sample_in_run = -1;
          this.entry_index = -1;
        }
        if (traf) {
          traf.sample_groups_info = [];
        }
        if (!trak.sample_groups_info) {
          trak.sample_groups_info = [];
        }
        for (k = 0; k < sbgps.length; k++) {
          sample_group_key = sbgps[k].grouping_type + "/" + sbgps[k].grouping_type_parameter;
          sample_group_info = new SampleGroupInfo(sbgps[k].grouping_type, sbgps[k].grouping_type_parameter, sbgps[k]);
          if (traf) {
            traf.sample_groups_info[sample_group_key] = sample_group_info;
          }
          if (!trak.sample_groups_info[sample_group_key]) {
            trak.sample_groups_info[sample_group_key] = sample_group_info;
          }
          for (l = 0; l < trak_sgpds.length; l++) {
            if (trak_sgpds[l].grouping_type === sbgps[k].grouping_type) {
              sample_group_info.description = trak_sgpds[l];
              sample_group_info.description.used = true;
            }
          }
          if (traf_sgpds) {
            for (l = 0; l < traf_sgpds.length; l++) {
              if (traf_sgpds[l].grouping_type === sbgps[k].grouping_type) {
                sample_group_info.fragment_description = traf_sgpds[l];
                sample_group_info.fragment_description.used = true;
                sample_group_info.is_fragment = true;
              }
            }
          }
        }
        if (!traf) {
          for (k = 0; k < trak_sgpds.length; k++) {
            if (!trak_sgpds[k].used && trak_sgpds[k].version >= 2) {
              sample_group_key = trak_sgpds[k].grouping_type + "/0";
              sample_group_info = new SampleGroupInfo(trak_sgpds[k].grouping_type, 0);
              if (!trak.sample_groups_info[sample_group_key]) {
                trak.sample_groups_info[sample_group_key] = sample_group_info;
              }
            }
          }
        } else {
          if (traf_sgpds) {
            for (k = 0; k < traf_sgpds.length; k++) {
              if (!traf_sgpds[k].used && traf_sgpds[k].version >= 2) {
                sample_group_key = traf_sgpds[k].grouping_type + "/0";
                sample_group_info = new SampleGroupInfo(traf_sgpds[k].grouping_type, 0);
                sample_group_info.is_fragment = true;
                if (!traf.sample_groups_info[sample_group_key]) {
                  traf.sample_groups_info[sample_group_key] = sample_group_info;
                }
              }
            }
          }
        }
      };
      ISOFile.setSampleGroupProperties = function(trak, sample, sample_number, sample_groups_info) {
        var k;
        var index;
        sample.sample_groups = [];
        for (k in sample_groups_info) {
          sample.sample_groups[k] = {};
          sample.sample_groups[k].grouping_type = sample_groups_info[k].grouping_type;
          sample.sample_groups[k].grouping_type_parameter = sample_groups_info[k].grouping_type_parameter;
          if (sample_number >= sample_groups_info[k].last_sample_in_run) {
            if (sample_groups_info[k].last_sample_in_run < 0) {
              sample_groups_info[k].last_sample_in_run = 0;
            }
            sample_groups_info[k].entry_index++;
            if (sample_groups_info[k].entry_index <= sample_groups_info[k].sbgp.entries.length - 1) {
              sample_groups_info[k].last_sample_in_run += sample_groups_info[k].sbgp.entries[sample_groups_info[k].entry_index].sample_count;
            }
          }
          if (sample_groups_info[k].entry_index <= sample_groups_info[k].sbgp.entries.length - 1) {
            sample.sample_groups[k].group_description_index = sample_groups_info[k].sbgp.entries[sample_groups_info[k].entry_index].group_description_index;
          } else {
            sample.sample_groups[k].group_description_index = -1;
          }
          if (sample.sample_groups[k].group_description_index !== 0) {
            var description;
            if (sample_groups_info[k].fragment_description) {
              description = sample_groups_info[k].fragment_description;
            } else {
              description = sample_groups_info[k].description;
            }
            if (sample.sample_groups[k].group_description_index > 0) {
              if (sample.sample_groups[k].group_description_index > 65535) {
                index = (sample.sample_groups[k].group_description_index >> 16) - 1;
              } else {
                index = sample.sample_groups[k].group_description_index - 1;
              }
              if (description && index >= 0) {
                sample.sample_groups[k].description = description.entries[index];
              }
            } else {
              if (description && description.version >= 2) {
                if (description.default_group_description_index > 0) {
                  sample.sample_groups[k].description = description.entries[description.default_group_description_index - 1];
                }
              }
            }
          }
        }
      };
      ISOFile.process_sdtp = function(sdtp, sample, number) {
        if (!sample) {
          return;
        }
        if (sdtp) {
          sample.is_leading = sdtp.is_leading[number];
          sample.depends_on = sdtp.sample_depends_on[number];
          sample.is_depended_on = sdtp.sample_is_depended_on[number];
          sample.has_redundancy = sdtp.sample_has_redundancy[number];
        } else {
          sample.is_leading = 0;
          sample.depends_on = 0;
          sample.is_depended_on = 0;
          sample.has_redundancy = 0;
        }
      };
      ISOFile.prototype.buildSampleLists = function() {
        var i2;
        var trak;
        for (i2 = 0; i2 < this.moov.traks.length; i2++) {
          trak = this.moov.traks[i2];
          this.buildTrakSampleLists(trak);
        }
      };
      ISOFile.prototype.buildTrakSampleLists = function(trak) {
        var j, k;
        var stco, stsc, stsz, stts, ctts, stss, stsd, subs, sbgps, sgpds, stdp;
        var chunk_run_index, chunk_index, last_chunk_in_run, offset_in_chunk, last_sample_in_chunk;
        var last_sample_in_stts_run, stts_run_index, last_sample_in_ctts_run, ctts_run_index, last_stss_index, last_subs_index, subs_entry_index, last_subs_sample_index;
        trak.samples = [];
        trak.samples_duration = 0;
        trak.samples_size = 0;
        stco = trak.mdia.minf.stbl.stco || trak.mdia.minf.stbl.co64;
        stsc = trak.mdia.minf.stbl.stsc;
        stsz = trak.mdia.minf.stbl.stsz || trak.mdia.minf.stbl.stz2;
        stts = trak.mdia.minf.stbl.stts;
        ctts = trak.mdia.minf.stbl.ctts;
        stss = trak.mdia.minf.stbl.stss;
        stsd = trak.mdia.minf.stbl.stsd;
        subs = trak.mdia.minf.stbl.subs;
        stdp = trak.mdia.minf.stbl.stdp;
        sbgps = trak.mdia.minf.stbl.sbgps;
        sgpds = trak.mdia.minf.stbl.sgpds;
        last_sample_in_stts_run = -1;
        stts_run_index = -1;
        last_sample_in_ctts_run = -1;
        ctts_run_index = -1;
        last_stss_index = 0;
        subs_entry_index = 0;
        last_subs_sample_index = 0;
        ISOFile.initSampleGroups(trak, null, sbgps, sgpds);
        if (typeof stsz === "undefined") {
          return;
        }
        for (j = 0; j < stsz.sample_sizes.length; j++) {
          var sample = {};
          sample.number = j;
          sample.track_id = trak.tkhd.track_id;
          sample.timescale = trak.mdia.mdhd.timescale;
          sample.alreadyRead = 0;
          trak.samples[j] = sample;
          sample.size = stsz.sample_sizes[j];
          trak.samples_size += sample.size;
          if (j === 0) {
            chunk_index = 1;
            chunk_run_index = 0;
            sample.chunk_index = chunk_index;
            sample.chunk_run_index = chunk_run_index;
            last_sample_in_chunk = stsc.samples_per_chunk[chunk_run_index];
            offset_in_chunk = 0;
            if (chunk_run_index + 1 < stsc.first_chunk.length) {
              last_chunk_in_run = stsc.first_chunk[chunk_run_index + 1] - 1;
            } else {
              last_chunk_in_run = Infinity;
            }
          } else {
            if (j < last_sample_in_chunk) {
              sample.chunk_index = chunk_index;
              sample.chunk_run_index = chunk_run_index;
            } else {
              chunk_index++;
              sample.chunk_index = chunk_index;
              offset_in_chunk = 0;
              if (chunk_index <= last_chunk_in_run) {
              } else {
                chunk_run_index++;
                if (chunk_run_index + 1 < stsc.first_chunk.length) {
                  last_chunk_in_run = stsc.first_chunk[chunk_run_index + 1] - 1;
                } else {
                  last_chunk_in_run = Infinity;
                }
              }
              sample.chunk_run_index = chunk_run_index;
              last_sample_in_chunk += stsc.samples_per_chunk[chunk_run_index];
            }
          }
          sample.description_index = stsc.sample_description_index[sample.chunk_run_index] - 1;
          sample.description = stsd.entries[sample.description_index];
          sample.offset = stco.chunk_offsets[sample.chunk_index - 1] + offset_in_chunk;
          offset_in_chunk += sample.size;
          if (j > last_sample_in_stts_run) {
            stts_run_index++;
            if (last_sample_in_stts_run < 0) {
              last_sample_in_stts_run = 0;
            }
            last_sample_in_stts_run += stts.sample_counts[stts_run_index];
          }
          if (j > 0) {
            trak.samples[j - 1].duration = stts.sample_deltas[stts_run_index];
            trak.samples_duration += trak.samples[j - 1].duration;
            sample.dts = trak.samples[j - 1].dts + trak.samples[j - 1].duration;
          } else {
            sample.dts = 0;
          }
          if (ctts) {
            if (j >= last_sample_in_ctts_run) {
              ctts_run_index++;
              if (last_sample_in_ctts_run < 0) {
                last_sample_in_ctts_run = 0;
              }
              last_sample_in_ctts_run += ctts.sample_counts[ctts_run_index];
            }
            sample.cts = trak.samples[j].dts + ctts.sample_offsets[ctts_run_index];
          } else {
            sample.cts = sample.dts;
          }
          if (stss) {
            if (j == stss.sample_numbers[last_stss_index] - 1) {
              sample.is_sync = true;
              last_stss_index++;
            } else {
              sample.is_sync = false;
              sample.degradation_priority = 0;
            }
            if (subs) {
              if (subs.entries[subs_entry_index].sample_delta + last_subs_sample_index == j + 1) {
                sample.subsamples = subs.entries[subs_entry_index].subsamples;
                last_subs_sample_index += subs.entries[subs_entry_index].sample_delta;
                subs_entry_index++;
              }
            }
          } else {
            sample.is_sync = true;
          }
          ISOFile.process_sdtp(trak.mdia.minf.stbl.sdtp, sample, sample.number);
          if (stdp) {
            sample.degradation_priority = stdp.priority[j];
          } else {
            sample.degradation_priority = 0;
          }
          if (subs) {
            if (subs.entries[subs_entry_index].sample_delta + last_subs_sample_index == j) {
              sample.subsamples = subs.entries[subs_entry_index].subsamples;
              last_subs_sample_index += subs.entries[subs_entry_index].sample_delta;
            }
          }
          if (sbgps.length > 0 || sgpds.length > 0) {
            ISOFile.setSampleGroupProperties(trak, sample, j, trak.sample_groups_info);
          }
        }
        if (j > 0) {
          trak.samples[j - 1].duration = Math.max(trak.mdia.mdhd.duration - trak.samples[j - 1].dts, 0);
          trak.samples_duration += trak.samples[j - 1].duration;
        }
      };
      ISOFile.prototype.updateSampleLists = function() {
        var i2, j, k;
        var default_sample_description_index, default_sample_duration, default_sample_size, default_sample_flags;
        var last_run_position;
        var box2, moof, traf, trak, trex;
        var sample;
        var sample_flags;
        if (this.moov === void 0) {
          return;
        }
        while (this.lastMoofIndex < this.moofs.length) {
          box2 = this.moofs[this.lastMoofIndex];
          this.lastMoofIndex++;
          if (box2.type == "moof") {
            moof = box2;
            for (i2 = 0; i2 < moof.trafs.length; i2++) {
              traf = moof.trafs[i2];
              trak = this.getTrackById(traf.tfhd.track_id);
              trex = this.getTrexById(traf.tfhd.track_id);
              if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
                default_sample_description_index = traf.tfhd.default_sample_description_index;
              } else {
                default_sample_description_index = trex ? trex.default_sample_description_index : 1;
              }
              if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
                default_sample_duration = traf.tfhd.default_sample_duration;
              } else {
                default_sample_duration = trex ? trex.default_sample_duration : 0;
              }
              if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
                default_sample_size = traf.tfhd.default_sample_size;
              } else {
                default_sample_size = trex ? trex.default_sample_size : 0;
              }
              if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
                default_sample_flags = traf.tfhd.default_sample_flags;
              } else {
                default_sample_flags = trex ? trex.default_sample_flags : 0;
              }
              traf.sample_number = 0;
              if (traf.sbgps.length > 0) {
                ISOFile.initSampleGroups(trak, traf, traf.sbgps, trak.mdia.minf.stbl.sgpds, traf.sgpds);
              }
              for (j = 0; j < traf.truns.length; j++) {
                var trun = traf.truns[j];
                for (k = 0; k < trun.sample_count; k++) {
                  sample = {};
                  sample.moof_number = this.lastMoofIndex;
                  sample.number_in_traf = traf.sample_number;
                  traf.sample_number++;
                  sample.number = trak.samples.length;
                  traf.first_sample_index = trak.samples.length;
                  trak.samples.push(sample);
                  sample.track_id = trak.tkhd.track_id;
                  sample.timescale = trak.mdia.mdhd.timescale;
                  sample.description_index = default_sample_description_index - 1;
                  sample.description = trak.mdia.minf.stbl.stsd.entries[sample.description_index];
                  sample.size = default_sample_size;
                  if (trun.flags & BoxParser.TRUN_FLAGS_SIZE) {
                    sample.size = trun.sample_size[k];
                  }
                  trak.samples_size += sample.size;
                  sample.duration = default_sample_duration;
                  if (trun.flags & BoxParser.TRUN_FLAGS_DURATION) {
                    sample.duration = trun.sample_duration[k];
                  }
                  trak.samples_duration += sample.duration;
                  if (trak.first_traf_merged || k > 0) {
                    sample.dts = trak.samples[trak.samples.length - 2].dts + trak.samples[trak.samples.length - 2].duration;
                  } else {
                    if (traf.tfdt) {
                      sample.dts = traf.tfdt.baseMediaDecodeTime;
                    } else {
                      sample.dts = 0;
                    }
                    trak.first_traf_merged = true;
                  }
                  sample.cts = sample.dts;
                  if (trun.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
                    sample.cts = sample.dts + trun.sample_composition_time_offset[k];
                  }
                  sample_flags = default_sample_flags;
                  if (trun.flags & BoxParser.TRUN_FLAGS_FLAGS) {
                    sample_flags = trun.sample_flags[k];
                  } else if (k === 0 && trun.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
                    sample_flags = trun.first_sample_flags;
                  }
                  sample.is_sync = sample_flags >> 16 & 1 ? false : true;
                  sample.is_leading = sample_flags >> 26 & 3;
                  sample.depends_on = sample_flags >> 24 & 3;
                  sample.is_depended_on = sample_flags >> 22 & 3;
                  sample.has_redundancy = sample_flags >> 20 & 3;
                  sample.degradation_priority = sample_flags & 65535;
                  var bdop = traf.tfhd.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET ? true : false;
                  var dbim = traf.tfhd.flags & BoxParser.TFHD_FLAG_DEFAULT_BASE_IS_MOOF ? true : false;
                  var dop = trun.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET ? true : false;
                  var bdo = 0;
                  if (!bdop) {
                    if (!dbim) {
                      if (j === 0) {
                        bdo = moof.start;
                      } else {
                        bdo = last_run_position;
                      }
                    } else {
                      bdo = moof.start;
                    }
                  } else {
                    bdo = traf.tfhd.base_data_offset;
                  }
                  if (j === 0 && k === 0) {
                    if (dop) {
                      sample.offset = bdo + trun.data_offset;
                    } else {
                      sample.offset = bdo;
                    }
                  } else {
                    sample.offset = last_run_position;
                  }
                  last_run_position = sample.offset + sample.size;
                  if (traf.sbgps.length > 0 || traf.sgpds.length > 0 || trak.mdia.minf.stbl.sbgps.length > 0 || trak.mdia.minf.stbl.sgpds.length > 0) {
                    ISOFile.setSampleGroupProperties(trak, sample, sample.number_in_traf, traf.sample_groups_info);
                  }
                }
              }
              if (traf.subs) {
                trak.has_fragment_subsamples = true;
                var sample_index = traf.first_sample_index;
                for (j = 0; j < traf.subs.entries.length; j++) {
                  sample_index += traf.subs.entries[j].sample_delta;
                  sample = trak.samples[sample_index - 1];
                  sample.subsamples = traf.subs.entries[j].subsamples;
                }
              }
            }
          }
        }
      };
      ISOFile.prototype.getSample = function(trak, sampleNum) {
        var buffer;
        var sample = trak.samples[sampleNum];
        if (!this.moov) {
          return null;
        }
        if (!sample.data) {
          sample.data = new Uint8Array(sample.size);
          sample.alreadyRead = 0;
          this.samplesDataSize += sample.size;
          Log.debug("ISOFile", "Allocating sample #" + sampleNum + " on track #" + trak.tkhd.track_id + " of size " + sample.size + " (total: " + this.samplesDataSize + ")");
        } else if (sample.alreadyRead == sample.size) {
          return sample;
        }
        while (true) {
          var index = this.stream.findPosition(true, sample.offset + sample.alreadyRead, false);
          if (index > -1) {
            buffer = this.stream.buffers[index];
            var lengthAfterStart = buffer.byteLength - (sample.offset + sample.alreadyRead - buffer.fileStart);
            if (sample.size - sample.alreadyRead <= lengthAfterStart) {
              Log.debug("ISOFile", "Getting sample #" + sampleNum + " data (alreadyRead: " + sample.alreadyRead + " offset: " + (sample.offset + sample.alreadyRead - buffer.fileStart) + " read size: " + (sample.size - sample.alreadyRead) + " full size: " + sample.size + ")");
              DataStream.memcpy(
                sample.data.buffer,
                sample.alreadyRead,
                buffer,
                sample.offset + sample.alreadyRead - buffer.fileStart,
                sample.size - sample.alreadyRead
              );
              buffer.usedBytes += sample.size - sample.alreadyRead;
              this.stream.logBufferLevel();
              sample.alreadyRead = sample.size;
              return sample;
            } else {
              if (lengthAfterStart === 0) return null;
              Log.debug("ISOFile", "Getting sample #" + sampleNum + " partial data (alreadyRead: " + sample.alreadyRead + " offset: " + (sample.offset + sample.alreadyRead - buffer.fileStart) + " read size: " + lengthAfterStart + " full size: " + sample.size + ")");
              DataStream.memcpy(
                sample.data.buffer,
                sample.alreadyRead,
                buffer,
                sample.offset + sample.alreadyRead - buffer.fileStart,
                lengthAfterStart
              );
              sample.alreadyRead += lengthAfterStart;
              buffer.usedBytes += lengthAfterStart;
              this.stream.logBufferLevel();
            }
          } else {
            return null;
          }
        }
      };
      ISOFile.prototype.releaseSample = function(trak, sampleNum) {
        var sample = trak.samples[sampleNum];
        if (sample.data) {
          this.samplesDataSize -= sample.size;
          sample.data = null;
          sample.alreadyRead = 0;
          return sample.size;
        } else {
          return 0;
        }
      };
      ISOFile.prototype.getAllocatedSampleDataSize = function() {
        return this.samplesDataSize;
      };
      ISOFile.prototype.getCodecs = function() {
        var i2;
        var codecs = "";
        for (i2 = 0; i2 < this.moov.traks.length; i2++) {
          var trak = this.moov.traks[i2];
          if (i2 > 0) {
            codecs += ",";
          }
          codecs += trak.mdia.minf.stbl.stsd.entries[0].getCodec();
        }
        return codecs;
      };
      ISOFile.prototype.getTrexById = function(id) {
        var i2;
        if (!this.moov || !this.moov.mvex) return null;
        for (i2 = 0; i2 < this.moov.mvex.trexs.length; i2++) {
          var trex = this.moov.mvex.trexs[i2];
          if (trex.track_id == id) return trex;
        }
        return null;
      };
      ISOFile.prototype.getTrackById = function(id) {
        if (this.moov === void 0) {
          return null;
        }
        for (var j = 0; j < this.moov.traks.length; j++) {
          var trak = this.moov.traks[j];
          if (trak.tkhd.track_id == id) return trak;
        }
        return null;
      };
      ISOFile.prototype.itemsDataSize = 0;
      ISOFile.prototype.flattenItemInfo = function() {
        var items = this.items;
        var entity_groups = this.entity_groups;
        var i2, j;
        var item;
        var meta = this.meta;
        if (meta === null || meta === void 0) return;
        if (meta.hdlr === void 0) return;
        if (meta.iinf === void 0) return;
        for (i2 = 0; i2 < meta.iinf.item_infos.length; i2++) {
          item = {};
          item.id = meta.iinf.item_infos[i2].item_ID;
          items[item.id] = item;
          item.ref_to = [];
          item.name = meta.iinf.item_infos[i2].item_name;
          if (meta.iinf.item_infos[i2].protection_index > 0) {
            item.protection = meta.ipro.protections[meta.iinf.item_infos[i2].protection_index - 1];
          }
          if (meta.iinf.item_infos[i2].item_type) {
            item.type = meta.iinf.item_infos[i2].item_type;
          } else {
            item.type = "mime";
          }
          item.content_type = meta.iinf.item_infos[i2].content_type;
          item.content_encoding = meta.iinf.item_infos[i2].content_encoding;
          item.item_uri_type = meta.iinf.item_infos[i2].item_uri_type;
        }
        if (meta.grpl) {
          for (i2 = 0; i2 < meta.grpl.boxes.length; i2++) {
            entity_group = {};
            entity_group.id = meta.grpl.boxes[i2].group_id;
            entity_group.entity_ids = meta.grpl.boxes[i2].entity_ids;
            entity_group.type = meta.grpl.boxes[i2].type;
            entity_groups[entity_group.id] = entity_group;
          }
        }
        if (meta.iloc) {
          for (i2 = 0; i2 < meta.iloc.items.length; i2++) {
            var offset;
            var itemloc = meta.iloc.items[i2];
            item = items[itemloc.item_ID];
            if (itemloc.data_reference_index !== 0) {
              Log.warn("Item storage with reference to other files: not supported");
              item.source = meta.dinf.boxes[itemloc.data_reference_index - 1];
            }
            switch (itemloc.construction_method) {
              case 0:
                break;
              case 1:
                break;
              case 2:
                Log.warn("Item storage with construction_method : not supported");
                break;
            }
            item.extents = [];
            item.size = 0;
            for (j = 0; j < itemloc.extents.length; j++) {
              item.extents[j] = {};
              item.extents[j].offset = itemloc.extents[j].extent_offset + itemloc.base_offset;
              if (itemloc.construction_method == 1) {
                item.extents[j].offset += meta.idat.start + meta.idat.hdr_size;
              }
              item.extents[j].length = itemloc.extents[j].extent_length;
              item.extents[j].alreadyRead = 0;
              item.size += item.extents[j].length;
            }
          }
        }
        if (meta.pitm) {
          items[meta.pitm.item_id].primary = true;
        }
        if (meta.iref) {
          for (i2 = 0; i2 < meta.iref.references.length; i2++) {
            var ref = meta.iref.references[i2];
            for (j = 0; j < ref.references.length; j++) {
              items[ref.from_item_ID].ref_to.push({ type: ref.type, id: ref.references[j] });
            }
          }
        }
        if (meta.iprp) {
          for (var k = 0; k < meta.iprp.ipmas.length; k++) {
            var ipma = meta.iprp.ipmas[k];
            for (i2 = 0; i2 < ipma.associations.length; i2++) {
              var association = ipma.associations[i2];
              item = items[association.id];
              if (!item) {
                item = entity_groups[association.id];
              }
              if (item) {
                if (item.properties === void 0) {
                  item.properties = {};
                  item.properties.boxes = [];
                }
                for (j = 0; j < association.props.length; j++) {
                  var propEntry = association.props[j];
                  if (propEntry.property_index > 0 && propEntry.property_index - 1 < meta.iprp.ipco.boxes.length) {
                    var propbox = meta.iprp.ipco.boxes[propEntry.property_index - 1];
                    item.properties[propbox.type] = propbox;
                    item.properties.boxes.push(propbox);
                  }
                }
              }
            }
          }
        }
      };
      ISOFile.prototype.getItem = function(item_id) {
        var buffer;
        var item;
        if (!this.meta) {
          return null;
        }
        item = this.items[item_id];
        if (!item.data && item.size) {
          item.data = new Uint8Array(item.size);
          item.alreadyRead = 0;
          this.itemsDataSize += item.size;
          Log.debug("ISOFile", "Allocating item #" + item_id + " of size " + item.size + " (total: " + this.itemsDataSize + ")");
        } else if (item.alreadyRead === item.size) {
          return item;
        }
        for (var i2 = 0; i2 < item.extents.length; i2++) {
          var extent = item.extents[i2];
          if (extent.alreadyRead === extent.length) {
            continue;
          } else {
            var index = this.stream.findPosition(true, extent.offset + extent.alreadyRead, false);
            if (index > -1) {
              buffer = this.stream.buffers[index];
              var lengthAfterStart = buffer.byteLength - (extent.offset + extent.alreadyRead - buffer.fileStart);
              if (extent.length - extent.alreadyRead <= lengthAfterStart) {
                Log.debug("ISOFile", "Getting item #" + item_id + " extent #" + i2 + " data (alreadyRead: " + extent.alreadyRead + " offset: " + (extent.offset + extent.alreadyRead - buffer.fileStart) + " read size: " + (extent.length - extent.alreadyRead) + " full extent size: " + extent.length + " full item size: " + item.size + ")");
                DataStream.memcpy(
                  item.data.buffer,
                  item.alreadyRead,
                  buffer,
                  extent.offset + extent.alreadyRead - buffer.fileStart,
                  extent.length - extent.alreadyRead
                );
                buffer.usedBytes += extent.length - extent.alreadyRead;
                this.stream.logBufferLevel();
                item.alreadyRead += extent.length - extent.alreadyRead;
                extent.alreadyRead = extent.length;
              } else {
                Log.debug("ISOFile", "Getting item #" + item_id + " extent #" + i2 + " partial data (alreadyRead: " + extent.alreadyRead + " offset: " + (extent.offset + extent.alreadyRead - buffer.fileStart) + " read size: " + lengthAfterStart + " full extent size: " + extent.length + " full item size: " + item.size + ")");
                DataStream.memcpy(
                  item.data.buffer,
                  item.alreadyRead,
                  buffer,
                  extent.offset + extent.alreadyRead - buffer.fileStart,
                  lengthAfterStart
                );
                extent.alreadyRead += lengthAfterStart;
                item.alreadyRead += lengthAfterStart;
                buffer.usedBytes += lengthAfterStart;
                this.stream.logBufferLevel();
                return null;
              }
            } else {
              return null;
            }
          }
        }
        if (item.alreadyRead === item.size) {
          return item;
        } else {
          return null;
        }
      };
      ISOFile.prototype.releaseItem = function(item_id) {
        var item = this.items[item_id];
        if (item.data) {
          this.itemsDataSize -= item.size;
          item.data = null;
          item.alreadyRead = 0;
          for (var i2 = 0; i2 < item.extents.length; i2++) {
            var extent = item.extents[i2];
            extent.alreadyRead = 0;
          }
          return item.size;
        } else {
          return 0;
        }
      };
      ISOFile.prototype.processItems = function(callback) {
        for (var i2 in this.items) {
          var item = this.items[i2];
          this.getItem(item.id);
          if (callback && !item.sent) {
            callback(item);
            item.sent = true;
            item.data = null;
          }
        }
      };
      ISOFile.prototype.hasItem = function(name) {
        for (var i2 in this.items) {
          var item = this.items[i2];
          if (item.name === name) {
            return item.id;
          }
        }
        return -1;
      };
      ISOFile.prototype.getMetaHandler = function() {
        if (!this.meta) {
          return null;
        } else {
          return this.meta.hdlr.handler;
        }
      };
      ISOFile.prototype.getPrimaryItem = function() {
        if (!this.meta || !this.meta.pitm) {
          return null;
        } else {
          return this.getItem(this.meta.pitm.item_id);
        }
      };
      ISOFile.prototype.itemToFragmentedTrackFile = function(_options) {
        var options = _options || {};
        var item = null;
        if (options.itemId) {
          item = this.getItem(options.itemId);
        } else {
          item = this.getPrimaryItem();
        }
        if (item == null) return null;
        var file = new ISOFile();
        file.discardMdatData = false;
        var trackOptions = { type: item.type, description_boxes: item.properties.boxes };
        if (item.properties.ispe) {
          trackOptions.width = item.properties.ispe.image_width;
          trackOptions.height = item.properties.ispe.image_height;
        }
        var trackId = file.addTrack(trackOptions);
        if (trackId) {
          file.addSample(trackId, item.data);
          return file;
        } else {
          return null;
        }
      };
      ISOFile.prototype.write = function(outstream) {
        for (var i2 = 0; i2 < this.boxes.length; i2++) {
          this.boxes[i2].write(outstream);
        }
      };
      ISOFile.prototype.createFragment = function(track_id, sampleNumber, stream_) {
        var trak = this.getTrackById(track_id);
        var sample = this.getSample(trak, sampleNumber);
        if (sample == null) {
          this.setNextSeekPositionFromSample(trak.samples[sampleNumber]);
          return null;
        }
        var stream = stream_ || new DataStream();
        stream.endianness = DataStream.BIG_ENDIAN;
        var moof = this.createSingleSampleMoof(sample);
        moof.write(stream);
        moof.trafs[0].truns[0].data_offset = moof.size + 8;
        Log.debug("MP4Box", "Adjusting data_offset with new value " + moof.trafs[0].truns[0].data_offset);
        stream.adjustUint32(moof.trafs[0].truns[0].data_offset_position, moof.trafs[0].truns[0].data_offset);
        var mdat = new BoxParser.mdatBox();
        mdat.data = sample.data;
        mdat.write(stream);
        return stream;
      };
      ISOFile.writeInitializationSegment = function(ftyp, moov, total_duration, sample_duration) {
        var i2;
        var index;
        var mehd;
        var trex;
        var box2;
        Log.debug("ISOFile", "Generating initialization segment");
        var stream = new DataStream();
        stream.endianness = DataStream.BIG_ENDIAN;
        ftyp.write(stream);
        var mvex = moov.add("mvex");
        if (total_duration) {
          mvex.add("mehd").set("fragment_duration", total_duration);
        }
        for (i2 = 0; i2 < moov.traks.length; i2++) {
          mvex.add("trex").set("track_id", moov.traks[i2].tkhd.track_id).set("default_sample_description_index", 1).set("default_sample_duration", sample_duration).set("default_sample_size", 0).set("default_sample_flags", 1 << 16);
        }
        moov.write(stream);
        return stream.buffer;
      };
      ISOFile.prototype.save = function(name) {
        var stream = new DataStream();
        stream.endianness = DataStream.BIG_ENDIAN;
        this.write(stream);
        stream.save(name);
      };
      ISOFile.prototype.getBuffer = function() {
        var stream = new DataStream();
        stream.endianness = DataStream.BIG_ENDIAN;
        this.write(stream);
        return stream.buffer;
      };
      ISOFile.prototype.initializeSegmentation = function() {
        var i2;
        var j;
        var box2;
        var initSegs;
        var trak;
        var seg;
        if (this.onSegment === null) {
          Log.warn("MP4Box", "No segmentation callback set!");
        }
        if (!this.isFragmentationInitialized) {
          this.isFragmentationInitialized = true;
          this.nextMoofNumber = 0;
          this.resetTables();
        }
        initSegs = [];
        for (i2 = 0; i2 < this.fragmentedTracks.length; i2++) {
          var moov = new BoxParser.moovBox();
          moov.mvhd = this.moov.mvhd;
          moov.boxes.push(moov.mvhd);
          trak = this.getTrackById(this.fragmentedTracks[i2].id);
          moov.boxes.push(trak);
          moov.traks.push(trak);
          seg = {};
          seg.id = trak.tkhd.track_id;
          seg.user = this.fragmentedTracks[i2].user;
          seg.buffer = ISOFile.writeInitializationSegment(this.ftyp, moov, this.moov.mvex && this.moov.mvex.mehd ? this.moov.mvex.mehd.fragment_duration : void 0, this.moov.traks[i2].samples.length > 0 ? this.moov.traks[i2].samples[0].duration : 0);
          initSegs.push(seg);
        }
        return initSegs;
      };
      BoxParser.Box.prototype.printHeader = function(output) {
        this.size += 8;
        if (this.size > MAX_SIZE) {
          this.size += 8;
        }
        if (this.type === "uuid") {
          this.size += 16;
        }
        output.log(output.indent + "size:" + this.size);
        output.log(output.indent + "type:" + this.type);
      };
      BoxParser.FullBox.prototype.printHeader = function(output) {
        this.size += 4;
        BoxParser.Box.prototype.printHeader.call(this, output);
        output.log(output.indent + "version:" + this.version);
        output.log(output.indent + "flags:" + this.flags);
      };
      BoxParser.Box.prototype.print = function(output) {
        this.printHeader(output);
      };
      BoxParser.ContainerBox.prototype.print = function(output) {
        this.printHeader(output);
        for (var i2 = 0; i2 < this.boxes.length; i2++) {
          if (this.boxes[i2]) {
            var prev_indent = output.indent;
            output.indent += " ";
            this.boxes[i2].print(output);
            output.indent = prev_indent;
          }
        }
      };
      ISOFile.prototype.print = function(output) {
        output.indent = "";
        for (var i2 = 0; i2 < this.boxes.length; i2++) {
          if (this.boxes[i2]) {
            this.boxes[i2].print(output);
          }
        }
      };
      BoxParser.mvhdBox.prototype.print = function(output) {
        BoxParser.FullBox.prototype.printHeader.call(this, output);
        output.log(output.indent + "creation_time: " + this.creation_time);
        output.log(output.indent + "modification_time: " + this.modification_time);
        output.log(output.indent + "timescale: " + this.timescale);
        output.log(output.indent + "duration: " + this.duration);
        output.log(output.indent + "rate: " + this.rate);
        output.log(output.indent + "volume: " + (this.volume >> 8));
        output.log(output.indent + "matrix: " + this.matrix.join(", "));
        output.log(output.indent + "next_track_id: " + this.next_track_id);
      };
      BoxParser.tkhdBox.prototype.print = function(output) {
        BoxParser.FullBox.prototype.printHeader.call(this, output);
        output.log(output.indent + "creation_time: " + this.creation_time);
        output.log(output.indent + "modification_time: " + this.modification_time);
        output.log(output.indent + "track_id: " + this.track_id);
        output.log(output.indent + "duration: " + this.duration);
        output.log(output.indent + "volume: " + (this.volume >> 8));
        output.log(output.indent + "matrix: " + this.matrix.join(", "));
        output.log(output.indent + "layer: " + this.layer);
        output.log(output.indent + "alternate_group: " + this.alternate_group);
        output.log(output.indent + "width: " + this.width);
        output.log(output.indent + "height: " + this.height);
      };
      var MP4Box = {};
      MP4Box.createFile = function(_keepMdatData, _stream) {
        var keepMdatData = _keepMdatData !== void 0 ? _keepMdatData : true;
        var file = new ISOFile(_stream);
        file.discardMdatData = keepMdatData ? false : true;
        return file;
      };
      if (typeof exports !== "undefined") {
        exports.createFile = MP4Box.createFile;
      }
    }
  });

  // scripts/gopro-gpmf-browser.js
  var require_gopro_gpmf_browser = __commonJS({
    "scripts/gopro-gpmf-browser.js"(exports, module) {
      "use strict";
      function appendBufferSlice(mp4boxFile, chunk, offset) {
        let buffer;
        if (chunk.byteOffset === 0 && chunk.byteLength === chunk.buffer.byteLength) {
          buffer = chunk.buffer;
        } else {
          buffer = chunk.buffer.slice(
            chunk.byteOffset,
            chunk.byteOffset + chunk.byteLength
          );
        }
        buffer.fileStart = offset;
        mp4boxFile.appendBuffer(buffer);
      }
      function findGpmdTrack(tracks) {
        if (!tracks?.length) return null;
        for (const track of tracks) {
          const codec = String(track.codec ?? "").toLowerCase();
          if (codec === "gpmd") return track;
        }
        for (const track of tracks) {
          const type = String(track.type ?? "").toLowerCase();
          const codec = String(track.codec ?? "").toLowerCase();
          if ((type === "metadata" || type === "meta" || codec.includes("gpmd")) && track.nb_samples > 0) {
            return track;
          }
        }
        for (const track of tracks) {
          const name = String(track.name ?? "").toLowerCase();
          if (name.includes("gopro") && name.includes("met") || name.includes("gpmd")) {
            return track;
          }
        }
        return null;
      }
      function readFileInChunks(file, mp4boxFile, progress) {
        const chunkSize = 4 * 1024 * 1024;
        let offset = 0;
        const fileSize = file.size;
        return file.stream().pipeTo(
          new WritableStream({
            write(chunk) {
              appendBufferSlice(mp4boxFile, chunk, offset);
              offset += chunk.byteLength;
              if (progress && fileSize > 0) {
                progress(Math.min(99, Math.round(offset / fileSize * 100)));
              }
            }
          })
        );
      }
      async function gpmfExtractBrowser2(file, { progress } = {}) {
        const MP4Box = require_mp4box_all();
        const LARGE_FILE_BYTES = 512 * 1024 * 1024;
        const useChunked = file.size > LARGE_FILE_BYTES;
        return new Promise((resolve, reject) => {
          const mp4boxFile = MP4Box.createFile();
          const timing = {};
          let settled = false;
          const fail = (err) => {
            if (settled) return;
            settled = true;
            reject(err instanceof Error ? err : new Error(String(err)));
          };
          const succeed = (payload) => {
            if (settled) return;
            settled = true;
            resolve(payload);
          };
          mp4boxFile.onError = (e) => fail(e);
          mp4boxFile.onReady = (videoData) => {
            const track = findGpmdTrack(videoData.tracks);
            if (!track) {
              const summary = (videoData.tracks || []).map(
                (t) => `${t.id}:${t.type ?? "?"}:${t.codec ?? "?"}:${t.name ?? ""}`
              ).join(" | ");
              fail(
                new Error(
                  `Track not found (gpmd). Trilhas no arquivo: ${summary || "nenhuma"}`
                )
              );
              return;
            }
            if (track.created) {
              timing.start = new Date(track.created);
              timing.start.setMinutes(
                timing.start.getMinutes() + timing.start.getTimezoneOffset()
              );
            }
            for (const t of videoData.tracks) {
              if (t.type === "video" && t.track_height > 0) {
                timing.videoDuration = t.movie_duration / t.movie_timescale;
                timing.frameDuration = timing.videoDuration / t.nb_samples;
                break;
              }
            }
            mp4boxFile.setExtractionOptions(track.id, null, {
              nbSamples: track.nb_samples
            });
            mp4boxFile.onSamples = (_id, _user, samples) => {
              const totalSize = samples.reduce((acc, s) => acc + s.size, 0);
              const rawData = new Uint8Array(totalSize);
              timing.samples = [];
              let offset = 0;
              for (const sample of samples) {
                timing.samples.push({
                  cts: sample.cts,
                  duration: sample.duration
                });
                rawData.set(sample.data, offset);
                offset += sample.size;
              }
              if (progress) progress(100);
              succeed({ rawData, timing });
            };
            mp4boxFile.start();
          };
          const run = async () => {
            try {
              if (useChunked) {
                await readFileInChunks(file, mp4boxFile, progress);
                mp4boxFile.flush();
              } else {
                if (progress) progress(5);
                const arrayBuffer = await file.arrayBuffer();
                arrayBuffer.fileStart = 0;
                mp4boxFile.appendBuffer(arrayBuffer);
                mp4boxFile.flush();
                if (progress) progress(99);
              }
            } catch (err) {
              fail(err);
            }
          };
          run();
        });
      }
      module.exports = { gpmfExtractBrowser: gpmfExtractBrowser2, findGpmdTrack };
    }
  });

  // scripts/gopro-gps-vendor-entry.js
  var goproTelemetry = require_gopro_telemetry();
  var { gpmfExtractBrowser } = require_gopro_gpmf_browser();
  globalThis.GoproGpsVendor = {
    gpmfExtract: gpmfExtractBrowser,
    goproTelemetry
  };
})();
