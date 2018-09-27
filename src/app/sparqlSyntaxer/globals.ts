

// From <https://www.typescriptlang.org/docs/handbook/decorators.html>
// And <https://gist.github.com/remojansen/16c661a7afd68e22ac6e>
export function _sparqlStructure(structure: Array<sparqlRule | string | null | Array<sparqlRule | string | null>>) {
    return (target: typeof sparqlRule) => {

        // save a reference to the original constructor
        var original = target;

        // a utility function to generate instances of a class
        function construct(constructor, args) {
            var c: any = function () {
                return constructor.apply(this, args);
            }
            c.prototype = constructor.prototype;
            return new c();
        }

        // the new constructor behaviour
        var f: any = function (...args) {

            let originalObject = construct(original, args);
            originalObject.structure = structure;
            // originalObject.name = (<{ when: { name: string } }>filter).when.name;
            return originalObject;
        }

        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;
    }
}


enum _SwitchCase {
    'rule',
    'string',
    'array'
}

function _switchCase(element) {
    if (element instanceof sparqlRule) {
        return _SwitchCase.rule
    } else if (Array.isArray(element)) {
        return _SwitchCase.array
    } else {
        return _SwitchCase.string
    }
}

function _jws(array: string[]) {
    return array.join(' ');
}



export class sparqlRule {
    // structure: Array<sparqlRule | string | Array<sparqlRule | string>>
    structure = [];

    private _skeleton(element) {
        switch (_switchCase(element)) {
            case _SwitchCase.rule:
                return (<sparqlRule>element).skeleton();
            case _SwitchCase.string:
                return <string>element;
            case _SwitchCase.array:
                return _jws(element.map(ele => { element._skeleton(ele) }));
        }
    }

    skeleton() {
        return _jws(this.structure.map(element => {
            return this._skeleton(element);
        }));
    }
}

export class Terminals extends sparqlRule {
    static regex: RegExp

    static check(terminal: string): boolean {
        if (this.regex) {
            return this.regex.test(terminal);
        } else {
            return true;
        }
    }
}
