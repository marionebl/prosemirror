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
function isSelectionElement(type) {
    return ['select-text', 'cursor'].indexOf(type) !== -1;
}
function handleSelectionElement(type, _) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    switch (type) {
        case 'select-text': {
            if (children.length !== 1 || typeof children[0] !== 'string') {
                throw new Error("'select-text' expect a text child but it got " + children);
            }
            return "<start>" + children[0] + "<end>";
        }
        case 'cursor': {
            return '<cursor>';
        }
        default: {
            throw new Error("Missing type implementation " + type + " for selection");
        }
    }
}
export var createElementFactory = function (docBuilder) {
    return function (type, attrs) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        if (isSelectionElement(type)) {
            return handleSelectionElement.apply(void 0, __spread([type, attrs], children));
        }
        var builder = docBuilder[type];
        if (!builder) {
            throw new Error("Builder '" + type + "' doesnt exist. You might be using a wrong node.");
        }
        return builder.apply(void 0, __spread([attrs ? attrs : {}], children));
    };
};
