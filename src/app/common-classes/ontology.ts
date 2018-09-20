import { SparqlClass, Uri, SparqlObject, Collection, Litteral, GraphDefinition, } from "src/app/sparql-services/sparql-parser.service";
import { UniqueIdentifier } from "src/app/common-classes/uniqueIdentifier";
import { GlobalVariables } from "src/app/configuration";
import { isArray } from "util";

class SkosOntology extends SparqlClass {
    uri: string;
    // @SparqlObject(UniqueIdentifier)
    // @Collection
    rootElements: UniqueIdentifier[];


}

export function downer(ontologyType?: string) {
    if (Object.keys(GlobalVariables.HIERACHICAL_STRUCTURE).indexOf(ontologyType) != -1) {
        return GlobalVariables.HIERACHICAL_STRUCTURE[ontologyType].downer;
    } else {
        
        return GlobalVariables.HIERACHICAL_STRUCTURE['owl-rdf'].downer;
    }
}

export function upper(ontolgyTypes?: string[]) {
    let _ontologyTypes: string[] = [];
    if (ontolgyTypes === undefined) {
        _ontologyTypes = Object.keys(GlobalVariables.HIERACHICAL_STRUCTURE);
    } else {
        ontolgyTypes.forEach((type) => {
            if (Object.keys(GlobalVariables.HIERACHICAL_STRUCTURE).indexOf(type) != -1) {
                _ontologyTypes.push(type);
            }
        })
    }
    let uppersPredicatesParh = _ontologyTypes.map((type) => {
        return GlobalVariables.HIERACHICAL_STRUCTURE[type].upper
    }).join('|');
    return uppersPredicatesParh;
}


export function graphRestriction(graphsUri: UniqueIdentifier[], graphDefinition: string, negativeRestriction = false) {
    let newGraphDefinition = '';
    if (negativeRestriction) {
        newGraphDefinition = graphDefinition + ' FILTER NOT EXISTS { GRAPH ?graph {' + graphDefinition + '} VALUES ?graph {';
        newGraphDefinition += graphsUri.map((ui) => { return '<' + ui.uri + '>'; }).join(' ');
        newGraphDefinition += '} }';
    } else {
        newGraphDefinition = 'GRAPH ?graph {' + graphDefinition + '} VALUES ?graph {';
        newGraphDefinition += graphsUri.map((ui) => { return '<' + ui.uri + '>'; }).join(' ');
        newGraphDefinition += '}';
    } 
    return newGraphDefinition;
    // return graphDefinition;
}


export interface Triple {
    subject?: RDFValueAndType;
    predicate?: RDFValueAndType;
    object?: RDFValueAndType;
}



export enum RDFType {
    IRI = "uri",
    Literal = "literal",
    Typed_literal = 'typed-literal',
  }

export class RDFValueAndType
{
    value: string|number = '';
    type: RDFType = RDFType.IRI;
    lang: string;
    datatype: string;

    constructor(options? : {value?: string|number, type?: RDFType, lang?:string, datatype?: string}) {
        // if (options) {
        //     if (options.value) {
        //         this.value = options.value;
        //     }
        //     if (options.type) {
        //         this.type = options.type;
        //     }
        //     if (options.lang) {
        //         this.lang = options.lang;
        //     }
        //     if (options.type) {
        //         this.type = options.type;
        //     }
        // }
        if (options) {
            Object.getOwnPropertyNames(options).forEach((propertyName) => {
                this[propertyName] = options[propertyName];
            });
        }
    }
}
export class DefaultTriple implements Triple {
    subject: RDFValueAndType = new RDFValueAndType();
    predicate: RDFValueAndType = new RDFValueAndType();
    object: RDFValueAndType = new RDFValueAndType();

    constructor(triple?: Triple) {
        if (triple) {
            if (triple.subject) {
                this.subject = triple.subject;
            }
            if (triple.predicate) {
                this.predicate = triple.predicate;
            }
            if (triple.object) {
                this.object = triple.object;
            }
        }
    }
}














class _ValueUriPrefixes {
    value: string = '';
    uris: string[] = [];
    prefixes: _ValueUriPrefixes[] = [];
    constructor(options: { value?: string, uris?: string[], prefixes?: _ValueUriPrefixes[] } = {}) {
        if (options.value) {
            this.value = options.value
        } else {
            this.value = '';
        }
        if (options.uris) {
            this.uris = options.uris
        } else {
            this.uris = [];
        }
        if (options.prefixes) {
            this.prefixes = options.prefixes
        } else {
            this.prefixes = [];
        }

    }
}

/*
    Find the largest prefixes amongst a collection of syntaxic string.
    Commonly, these strings are Uri, and we simplify the syntax by limiting
    us to a collection of potential delimiters.
    With these hypothesis, a prefix is the largest part of the string, 
    ending by a potential delimiter, shared across at least two elements of
    the primary collection.
*/
export function findPrefixes(tabUri: string[], delimiter: string = '/') {
    let decomposedUri = tabUri.map((syntaxicString) => {
        return { key: syntaxicString, decomposition: syntaxicString.split(delimiter) };
    });
    let prefixesTree = new _ValueUriPrefixes();
    decomposedUri.forEach((keyXdecomposition) => {
        let currentBranch = prefixesTree;
        console.log('start')
        for (let index = 0; index < keyXdecomposition.decomposition.length; index++) {
            if (index != keyXdecomposition.decomposition.length - 1) {
                // Object.defineProperty(currentBranch, 'value', {value: keyXdecomposition.decomposition[index]})
                // Object.defineProperty(currentBranch, 'prefixes', {value: keyXdecomposition.decomposition[index]})
                // currentBranch.value = keyXdecomposition.decomposition[index];
                currentBranch.prefixes.push()
                console.log(keyXdecomposition.decomposition[index]);
                console.log(currentBranch);

            } else {
                console.log('uri')
                console.log(keyXdecomposition.key);
                // currentBranch.uris.push(keyXdecomposition.key);
            }
        }
        console.log('end')
        console.log(prefixesTree);
    })
    let prefixXstring = [];
    let allPrefixesMap = [];
    let tmpPrefixesMap = [];
    let keyPrefix = [];
    for (let looping = true, index = 0; looping; index++) {
        decomposedUri.forEach((keyXdecomposition) => {
            let mapping = _mappingFindPrefix(keyXdecomposition.key, keyXdecomposition.decomposition, index)
            tmpPrefixesMap[mapping.prefix] = keyXdecomposition;
            keyPrefix[keyXdecomposition.key] = mapping.prefix;
        }
        );
        decomposedUri.forEach((keyXdecomposition) => {
            return {}
        });
        // Check end loop

    }

}

/*
    Internal function which return { key, prefix, word } from {key, decomposition } and index
*/
function _mappingFindPrefix(key: string, decomposition: string[], index: number) {
    let prefix = decomposition.slice(0, index).join('/') + '/';
    let word = decomposition.slice(index).join('/');
    return { key: key, prefix: prefix, word: word };
}

function getPropertyThroughArrayPath(path: string[], object: Object) {
    let subObject = object;
    path.forEach((pathPart) => {
        subObject = subObject[pathPart];
    })
    return subObject;
}

// From <https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object>
function setPropertyThroughArrayPath(path: string[], object: Object, value: any) {
    var schema = object;  // a moving reference to internal objects within obj
    var len = path.length;
    for(var i = 0; i < len-1; i++) {
        var elem = path[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }
    schema[path[len-1]] = value;
}


function pushPropertyThroughArrayPath(path: string[], object: Object, value: any) {
    var schema = object;  // a moving reference to internal objects within obj
    var len = path.length;
    for(var i = 0; i < len-1; i++) {
        var elem = path[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }
    if (schema[path[len - 1]] === undefined || !Array.isArray(schema[path[len - 1]])) {
        schema[path[len - 1]] = [];
    }
    schema[path[len-1]].push(value);
}



