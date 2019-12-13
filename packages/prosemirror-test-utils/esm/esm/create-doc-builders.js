var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { Node } from 'prosemirror-model';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isContent(content) {
    return (Boolean(content) &&
        (typeof content === 'string' || (content.node && content.node instanceof Node)));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAttribute(content) {
    return typeof content === 'object' && !isContent(content);
}
function getTagsFromTextNode(text, initialPos) {
    if (initialPos === void 0) { initialPos = 0; }
    var tags = [];
    var regex = /<(\w+)>/g;
    var pos = initialPos;
    var at = 0;
    var finalText = '';
    var match = regex.exec(text);
    while (match) {
        finalText += text.slice(at, match.index);
        pos += match.index - at;
        at = match.index + match[0].length;
        tags.push({
            pos: pos,
            name: match[1],
        });
        match = regex.exec(text);
    }
    finalText += text.slice(at);
    pos += text.length - at;
    return {
        tags: tags,
        pos: pos,
        text: finalText,
    };
}
function createNodeBuilder(nodeType, schema) {
    return function (maybeChild) {
        var e_1, _a;
        var _children = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _children[_i - 1] = arguments[_i];
        }
        var children = __spread(_children);
        var attrs = undefined;
        if (isContent(maybeChild)) {
            // Rethink this validation (Fails when all the attributes are optionalss)
            // Add at the beginning
            children.unshift(maybeChild);
        }
        else if (isAttribute(maybeChild)) {
            attrs = maybeChild;
        }
        var pos = 0;
        var tags = [];
        var content = [];
        try {
            for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                // When a child is a string we try to look for new tags
                if (typeof child === 'string') {
                    var _b = getTagsFromTextNode(child, pos), text = _b.text, newPos = _b.pos, newTags = _b.tags;
                    pos = newPos; // update with new pos
                    tags.push.apply(// update with new pos
                    tags, __spread(newTags));
                    if (text) {
                        content.push(schema.text(text));
                    }
                    continue;
                }
                // If not is because is already a node
                var node = child.node, childTags = child.tags;
                // Need to remap tags position based on current pos
                var updatedTags = childTags.map(function (tag) { return ({
                    name: tag.name,
                    pos: tag.pos + pos + 1,
                }); });
                tags.push.apply(tags, __spread(updatedTags));
                content.push(node);
                // Update position with current one.
                pos = pos + node.nodeSize;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            tags: tags,
            node: nodeType.create(attrs, content),
        };
    };
}
function getNodeBuilders(schema, aliases) {
    var result = {};
    for (var name_1 in schema.nodes) {
        if (schema.nodes[name_1]) {
            var nodeType = schema.nodes[name_1];
            result[name_1] = createNodeBuilder(nodeType, schema);
        }
    }
    if (aliases) {
        var _loop_1 = function (name_2) {
            if (aliases.hasOwnProperty(name_2)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                var _a = aliases[name_2], type = _a.type, attrs_1 = _a.attrs;
                var builder_1 = result[type];
                result[name_2] = function (maybeContent) {
                    var content = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        content[_i - 1] = arguments[_i];
                    }
                    if (attrs_1) {
                        if (isContent(maybeContent)) {
                            return builder_1.apply(void 0, __spread([attrs_1, maybeContent], content));
                        }
                        if (isAttribute(maybeContent)) {
                            return builder_1.apply(void 0, __spread([__assign(__assign({}, maybeContent), attrs_1)], content));
                        }
                        return builder_1.apply(void 0, __spread([attrs_1], content));
                    }
                    return builder_1.apply(void 0, __spread([maybeContent], content));
                };
            }
        };
        for (var name_2 in aliases) {
            _loop_1(name_2);
        }
    }
    return result;
}
function createMarkBuilder(markType, schema) {
    return function (maybeContent, content) {
        var realContent;
        var attrs = undefined;
        if (isContent(maybeContent)) {
            // Rethink this validation (Fails when all the attributes are optionalss)
            // if (markType.spec.attrs) {
            //   throw new Error(
            //     `The mark: ${markType.name} requires attributes, you might be passing a node as first argument instead`,
            //   );
            // }
            realContent = maybeContent;
        }
        else {
            if (isAttribute(maybeContent)) {
                attrs = maybeContent;
            }
            if (!isContent(content)) {
                throw new Error("The mark: " + markType.name + " requires content, you might be passing attributes as first argument but forgot to pass the content");
            }
            realContent = content;
        }
        var mark = markType.create(attrs);
        var node;
        var tags;
        if (typeof realContent === 'string') {
            var _a = getTagsFromTextNode(realContent), text = _a.text, newTags = _a.tags;
            if (!text) {
                throw new Error('You are trying to apply a mark to an string with only a tag');
            }
            tags = newTags;
            node = schema.text(realContent);
        }
        else {
            (node = realContent.node, tags = realContent.tags);
        }
        if (mark.type.isInSet(node.marks)) {
            return {
                tags: tags,
                node: node,
            };
        }
        return {
            tags: tags,
            node: node.mark(mark.addToSet(node.marks)),
        };
    };
}
function getMarkBuilders(schema, aliases) {
    var result = {};
    for (var name_3 in schema.marks) {
        if (schema.marks[name_3]) {
            var markType = schema.marks[name_3];
            result[name_3] = createMarkBuilder(markType, schema);
        }
    }
    if (aliases) {
        var _loop_2 = function (name_4) {
            if (aliases.hasOwnProperty(name_4)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                var _a = aliases[name_4], type = _a.type, attrs_2 = _a.attrs;
                var builder_2 = result[type];
                result[name_4] = function (maybeContent, content) {
                    if (attrs_2) {
                        if (isContent(maybeContent)) {
                            return builder_2(attrs_2, maybeContent);
                        }
                        if (isAttribute(maybeContent)) {
                            return builder_2(__assign(__assign({}, maybeContent), attrs_2), content);
                        }
                    }
                    return builder_2(maybeContent, content);
                };
            }
        };
        for (var name_4 in aliases) {
            _loop_2(name_4);
        }
    }
    return result;
}
export var createDocBuilders = function (schema, options) {
    return __assign(__assign({}, getNodeBuilders(schema, options && options.aliases && options.aliases.nodes ? options.aliases.nodes : undefined)), getMarkBuilders(schema, options && options.aliases && options.aliases.marks ? options.aliases.marks : undefined));
};
