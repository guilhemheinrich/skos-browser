import { XRegExp, test } from 'xregexp';
import * as _ from './globals';
import * as pt from './primaryTerminals';


/*
    From <https://www.w3.org/TR/sparql11-query/#grammar>
    Intent to be as close as possible of the document
*/

namespace sparl_grammar {
    interface stringifiable {
        toString(): string;
    }

    // From <https://www.typescriptlang.org/docs/handbook/decorators.html>
    // And <https://gist.github.com/remojansen/16c661a7afd68e22ac6e>
    function _sparqlStructure(structure: Array<sparqlRule | string | null | Array<sparqlRule | string | null>>) {
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



    class sparqlRule {
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



    class QueryUnit extends sparqlRule {
        structure: [Query];
        structureO: { query: Query } | { notso: string };

        query: Query;

        skeleton() {
            return this.query.skeleton();
        }
    }

    class Query extends sparqlRule {
        structure: [Prologue, SelectQuery | ConstructQuery | DescribeQuery | AskQuery, ValuesClause];

        // prologue: Prologue;
        // queryType: SelectQuery | ConstructQuery | DescribeQuery | AskQuery;
        // valuesClause: ValuesClause;

        // skeleton() {
        //     let _tmp: string[];
        //     _tmp.push(this.prologue.skeleton());
        //     _tmp.push(this.queryType.skeleton());
        //     _tmp.push(this.valuesClause.skeleton());
        //     return _jws(_tmp);
        // }
    }

    class UpdateUnit extends sparqlRule {
        structure: [Update];
        // update: Update;

        // skeleton() {
        //     return this.update.skeleton();
        // }
    }

    class Prologue extends sparqlRule {
        structure: [BaseDecl | PrefixDecl];
        // declarations?: [BaseDecl | PrefixDecl
        // skeleton() {
        //     return _jws(this.declarations.map(dcl => 
        //         {
        //             return dcl.skeleton()
        //         }));
        // }
    }

    class BaseDecl extends sparqlRule {
        structure: ['BASE', IRIREF];
        // iriref: IRIREF;

        // skeleton() {
        //     let _tmp = ['BASE'];
        //     _tmp.push(this.iriref.skeleton());
        //     return _jws(_tmp);
        // }
    }

    class PrefixDecl extends sparqlRule {
        structure: [PNAME_NS, IRIREF];
        // pname_ns: PNAME_NS;
        // iriref: IRIREF;

        // skeleton() {
        //     let _tmp = ['PREFIX'];
        //     _tmp.push(this.pname_ns.skeleton());
        //     _tmp.push(this.iriref.skeleton());
        //     return _jws(_tmp);
        // }
    }

    class SelectQuery extends sparqlRule {
        structure: [SelectClause, DatasetClause[], WhereClause, SolutionModifier];
        // selectClause: SelectClause;
        // datasetClause?: DatasetClause[];
        // whereClause: WhereClause;
        // solutionModifier: SolutionModifier;

        // skeleton() {
        //     let _tmp = [];
        //     _tmp.push(this.selectClause.skeleton());
        //     _tmp.push(_jws(this.datasetClause
        //         .map(dts => {
        //         return dts.skeleton()})
        //     ));
        //     _tmp.push(this.whereClause.skeleton());
        //     _tmp.push(this.solutionModifier.skeleton());
        //     return _jws(_tmp);
        // }
    }

    class SubSelect extends sparqlRule {
        structure: [SelectClause, WhereClause, SolutionModifier, ValuesClause];
        // selectClause: SelectClause;
        // whereClause: WhereClause;
        // solutionModifier: SolutionModifier;
        // valuesClause: ValuesClause;

        // skeleton() {
        //     let _tmp = [];
        //     _tmp.push(this.selectClause.skeleton());
        //     _tmp.push(this.whereClause.skeleton());
        //     _tmp.push(this.solutionModifier.skeleton());
        //     _tmp.push(this.valuesClause.skeleton());
        //     return _jws(_tmp);
        // }
    }

    class SelectClause extends sparqlRule {
        structure: ['SELECT', 'DISTINCT' | 'REDUCED' | null, Array<Var | [Expression, 'AS', Var]> | '*'];
        // bindings: [Var | [Expression,Var]] | '*';
        // modifiers: 'DISTINCT' | 'REDUCED' | '';

        // private _computeVariables()
        // {
        //     let bindingsString = '';

        //     if (this.bindings && this.bindings instanceof Array) {
        //         bindingsString = _jws(this.bindings.map((varOrVarAExpr) => 
        //         {
        //             if (varOrVarAExpr instanceof Var) {
        //                 return varOrVarAExpr.skeleton();
        //             } else {
        //                 return varOrVarAExpr[0].skeleton() + ' AS ' + varOrVarAExpr[1].skeleton();
        //             }
        //         }));
        //     } else {
        //         bindingsString = '*';
        //     }
        //     return bindingsString;
        // }

        // skeleton() {
        //     let _tmp = ['SELECT'];
        //     _tmp.push(this.modifiers);
        //     _tmp.push(this._computeVariables());
        //     return _jws(_tmp);
        // }
    }

    class ConstructQuery extends sparqlRule {

        structure: ['CONSTRUCT',
            [ConstructTemplate, DatasetClause[], WhereClause, SolutionModifier] |
            // [ DatasetClause[], SolutionModifier ] |
            [DatasetClause[], TriplesTemplate | null, SolutionModifier]];


        // skeleton() {
        //     let _tmp = [];
        //     // Determine the pattern
        //     // case 1
        //     if (this.structure[0] instanceof ConstructTemplate) {
        //         let _structure = <[ ConstructTemplate, DatasetClause[], WhereClause, SolutionModifier ]> this.structure;
        //         _tmp.push('CONSTRUCT');
        //         _tmp.push(_structure[0].skeleton());
        //         _tmp.push(_jws(
        //             _structure[1].map(dtscl => {
        //             return dtscl.skeleton();
        //             }))
        //         );
        //         _tmp.push(_structure[2].skeleton());
        //         _tmp.push(_structure[3].skeleton());
        //     } else 
        //     // case 2
        //     if (this.structure[1] instanceof SolutionModifier)
        //     {
        //         let _structure = <[ DatasetClause[], SolutionModifier ]> this.structure;
        //         _tmp.push(_jws(
        //             _structure[0].map(dtscl => {
        //             return dtscl.skeleton();
        //             }))
        //         );
        //         _tmp.push('WHERE');
        //         _tmp.push(_structure[1].skeleton());
        //     }
        //     // case 3 
        //     else {
        //         let _structure = <[DatasetClause[], TriplesTemplate, SolutionModifier ]> this.structure;
        //         _tmp.push(_jws(
        //             _structure[0].map(dtscl => {
        //             return dtscl.skeleton();
        //             }))
        //         );
        //         _tmp.push('WHERE');
        //         _tmp.push(_structure[1].skeleton());
        //         _tmp.push(_structure[2].skeleton());
        //     }
        //     return _jws(_tmp);
        // }
    }

    class DescribeQuery extends sparqlRule {
        structure: ['DESCRIBE', VarOrIri[] | '*', DatasetClause[], WhereClause | null, SolutionModifier];
    }

    class AskQuery extends sparqlRule {
        structure: ['ASK', DatasetClause[], WhereClause, SolutionModifier];
    }

    class DatasetClause extends sparqlRule {
        structure: ['FROM', DefaultGraphClause | NamedGraphClause];
    }

    class DefaultGraphClause extends sparqlRule {
        structure: [SourceSelector];
    }

    class NamedGraphClause extends sparqlRule {
        structure: ['NAMED', SourceSelector];
    }

    class SourceSelector extends sparqlRule {
        structure: [iri]
    }

    class WhereClause extends sparqlRule {
        structure: ['WHERE' | null, GroupGraphPattern];
    }

    class SolutionModifier extends sparqlRule {
        structure: [GroupClause | null, HavingClause | null, OrderClause | null, LimitOffsetClauses | null];
    }

    class GroupClause extends sparqlRule {
        structure: ['GROUP', 'BY', GroupCondition[] | null];
    }

    class GroupCondition extends sparqlRule {
        structure: [BuiltInCall | FunctionCall | ['(', Expression, ['AS', Var] | null, ')'] | Var]
    }

    class HavingClause extends sparqlRule {
        structure: ['HAVING', HavingCondition | null]
    }

    class HavingCondition extends sparqlRule {
        structure: [Constraint]
    }

    class OrderClause extends sparqlRule {
        structure: ['OFFSET', INTEGER]
    }

    class OrderCondition extends sparqlRule {
        structure: ['ASC' | 'DESC', BrackettedExpression] | [Constraint | Var]

    }

    class LimitOffsetClauses extends sparqlRule {
        structure: [LimitClause, OffsetClause | null] | [OffsetClause, LimitClause | null]
    }

    class LimitClause extends sparqlRule {
        structure: ['LIMIT', INTEGER];
    }

    class OffsetClause extends sparqlRule {
        structure: ['OFFSET', INTEGER]
    }

    class ValuesClause extends sparqlRule {
        structure: ['VALUES', DataBlock] | null
    }

    class Update extends sparqlRule {
        structure: [Prologue, [Update1, [';', Update] | null] | null]
    }

    class Update1 extends sparqlRule {
        structure: [Load | Clear | Drop | Add | Move | Copy | Create | InsertData | DeleteData | DeleteWhere | Modify]
    }

    class Load extends sparqlRule {
        structure: ['LOAD', 'SILENT' | null, iri, [';', GraphRef] | null]
    }

    class Clear extends sparqlRule {
        structure: ['CLEAR', 'SILENT' | null, GraphRefAll];
    }

    class Drop extends sparqlRule {
        structure: ['DROP', 'SILENT' | null, GraphRefAll];
    }

    class Create extends sparqlRule {
        structure: ['CREATE', 'SILENT' | null, GraphRef];
    }

    class Add extends sparqlRule {
        structure: ['DROP', 'SILENT' | null, GraphOrDefault, 'TO', GraphOrDefault];

    }

    class Move extends sparqlRule {
        structure: ['MOVE', 'SILENT' | null, GraphOrDefault, 'TO', GraphOrDefault];

    }

    class Copy extends sparqlRule {
        structure: ['COPY', 'SILENT' | null, GraphOrDefault, 'TO', GraphOrDefault];

    }

    class InsertData extends sparqlRule {
        structure: ['INSERT', 'DATA', QuadData]
    }

    class DeleteData extends sparqlRule {
        structure: ['DELETE', 'DATA', QuadData]
    }

    class DeleteWhere extends sparqlRule {
        structure: ['DELETE', 'WHERE', QuadPattern]
    }

    class Modify extends sparqlRule {
        structure: [['WITH', iri] | null, [DeleteClause, InsertClause | null] | InsertClause, UsingClause[], 'WHERE', GroupGraphPattern]
    }

    class DeleteClause extends sparqlRule {
        structure: ['DELETE', QuadPattern]
    }

    class InsertClause extends sparqlRule {
        structure: ['INSERT', QuadPattern]

    }

    class UsingClause extends sparqlRule {
        structure: ['USING', iri | ['NAMED', iri]]

    }

    class GraphOrDefault extends sparqlRule {
        structure: ['DEFAULT' | ['GRAPH' | null, iri]]
    }

    class GraphRef extends sparqlRule {
        structure: ['GRAPH', iri]
    }

    class GraphRefAll extends sparqlRule {
        structure: [GraphRef | 'DEFAULT' | 'NAMED' | 'ALL']
    }

    class QuadPattern extends sparqlRule {
        structure: ['{', Quads, '}']
    }

    class QuadData extends sparqlRule {
        structure: ['{', Quads, '}']

    }

    class Quads extends sparqlRule {
        structure: [TriplesTemplate | null, Array<[QuadsNotTriples, '.' | null, TriplesTemplate | null]>]
    }

    class QuadsNotTriples extends sparqlRule {
        structure: ['GRAPH', VarOrIri, '{', TriplesTemplate | null, '}']
    }

    class TriplesTemplate extends sparqlRule {
        structure: [TriplesSameSubject, ['.', TriplesTemplate | null] | null]
    }

    class GroupGraphPattern extends sparqlRule {
        structure: ['{', SubSelect | GroupGraphPatternSub, '}']
    }

    class GroupGraphPatternSub extends sparqlRule {
        structure: [TriplesBlock | null, Array<[GraphPatternNotTriples, '.' | null, TriplesBlock | null]>]
    }

    class TriplesBlock extends sparqlRule {
        structure: [TriplesSameSubjectPath, ['.', TriplesBlock | null] | null]
    }

    class GraphPatternNotTriples extends sparqlRule {
        structure: [GroupOrUnionGraphPattern | OptionalGraphPattern | MinusGraphPattern | GraphGraphPattern | ServiceGraphPattern | Filter | Bind | InlineData]
    }

    class OptionalGraphPattern extends sparqlRule {
        structure: ['OPTIONAL', GroupGraphPattern]
    }

    class GraphGraphPattern extends sparqlRule {
        structure: ['GRAPH', VarOrIri, GroupGraphPattern]
    }

    class ServiceGraphPattern extends sparqlRule {
        structure: ['SERVICE', 'SILENT' | null, VarOrIri, GroupGraphPattern]
    }

    class Bind extends sparqlRule {
        structure: ['BIND', '(', Expression, 'AS', Var, ')']
    }

    class InlineData extends sparqlRule {
        structure: ['VALUES', DataBlock]
    }

    class DataBlock extends sparqlRule {
        structure: [InlineDataOneVar | InlineDataFull]
    }

    class InlineDataOneVar extends sparqlRule {
        structure: [Var, '{', DataBlockValue[], '}']
    }

    class InlineDataFull extends sparqlRule {
        structure: [[NIL | '(', Var[], ')'], '{', Array<['(', DataBlockValue[], ')' | NIL]>, '}']
    }

    class DataBlockValue extends sparqlRule {
        structure: [iri | RDFLiteral | NumericLiteral | BooleanLiteral | 'UNDEF']
    }

    class MinusGraphPattern extends sparqlRule {
        structure: ['MINUS', GroupGraphPattern]
    }

    class GroupOrUnionGraphPattern extends sparqlRule {
        structure: [GroupGraphPattern, Array<['UNION', GroupGraphPattern]>]
    }

    class Filter extends sparqlRule {
        structure: ['FILTER', Constraint]
    }

    class Constraint extends sparqlRule {
        structure: [BrackettedExpression | BuiltInCall | FunctionCall]
    }

    class FunctionCall extends sparqlRule {
        structure: [iri, ArgList]
    }

    class ArgList extends sparqlRule {
        structure: [NIL | ['(', 'DISTINCT' | null, Expression, Array<[',', Expression]>, ')']]
    }

    class ExpressionList extends sparqlRule {
        structure: [NIL | ['(', Expression, Array<[',', Expression]>, ')']]
    }

    class ConstructTemplate extends sparqlRule {
        structure: ['{', ConstructTriples | null, '}']
    }

    class ConstructTriples extends sparqlRule {
        structure: [TriplesSameSubject, ['.', ConstructTriples | null] | null]
    }

    class TriplesSameSubject extends sparqlRule {
        structure: [VarOrTerm, PropertyListNotEmpty] | [TriplesNode, PropertyList]
    }

    class PropertyList extends sparqlRule {
        structure: [PropertyListNotEmpty | null]
    }

    class PropertyListNotEmpty extends sparqlRule {
        structure: [Verb, ObjectList, Array<[';', [Verb, ObjectList] | null]>]
    }

    class Verb extends sparqlRule {
        structure: [VarOrIri | 'a']
    }

    class ObjectList extends sparqlRule {
        structure: [Object, Array<[',', Object]>]
    }

    class Object extends sparqlRule {
        structure: [GraphNode]
    }

    class TriplesSameSubjectPath extends sparqlRule {
        structure: [VarOrTerm, PropertyListNotEmpty] | [TriplesNodePath, PropertyListPath]
    }

    class PropertyListPath extends sparqlRule {
        structure: [PropertyListPathNotEmpty]
    }

    class PropertyListPathNotEmpty extends sparqlRule {
        structure: [[VerbPath | VerbSimple], ObjectListPath, Array<[';', [[VerbPath | VerbSimple], ObjectList] | null]>]
    }

    class VerbPath extends sparqlRule {
        structure: [Path]
    }

    class VerbSimple extends sparqlRule {
        structure: [Var]
    }

    class ObjectListPath extends sparqlRule {
        structure: [ObjectPath, Array<[',', ObjectPath]>]
    }

    class ObjectPath extends sparqlRule {
        structure: [GraphNodePath]
    }

    class Path extends sparqlRule {
        structure: [PathAlternative]
    }

    class PathAlternative extends sparqlRule {
        structure: [PathSequence, Array<['|', PathSequence]>]
    }

    class PathSequence extends sparqlRule {
        structure: [PathEltOrInverse, Array<['/', PathEltOrInverse]>]
    }

    class PathElt extends sparqlRule {
        structure: [PathPrimary, PathMod | null]
    }

    class PathEltOrInverse extends sparqlRule {
        structure: [PathElt] | ['^', PathElt]
    }

    class PathMod extends sparqlRule {
        structure: ['?', '*', '+']
    }

    class PathPrimary extends sparqlRule {
        structure: [iri | 'a' | ['!', PathNegatedPropertySet] | ['(', Path, ')']]
    }

    class PathNegatedPropertySet extends sparqlRule {
        structure: [PathOneInPropertySet] | ['(', [PathOneInPropertySet, Array<['|', PathOneInPropertySet]>] | null, ')']
    }

    class PathOneInPropertySet extends sparqlRule {
        structure: [iri | 'a' | ['^', iri | 'a']]
    }

    class Integer extends sparqlRule {
        structure: [INTEGER]
    }

    class TriplesNode extends sparqlRule {
        structure: [Collection | BlankNodePorpertyList]
    }

    class BlankNodePorpertyList extends sparqlRule {
        structure: ['[', PropertyListNotEmpty, ']']
    }

    class TriplesNodePath extends sparqlRule {
        structure: [CollectionPath | BlankNodePropertyListPath]
    }

    class BlankNodePropertyListPath extends sparqlRule {
        structure: ['[', PropertyListPathNotEmpty, ']']
    }

    class Collection extends sparqlRule {
        structure: ['(', GraphNode[], ')']
    }

    class CollectionPath extends sparqlRule {
        structure: ['(', GraphNodePath[], ')']
    }

    class GraphNode extends sparqlRule {
        structure: [VarOrTerm | TriplesNode]
    }

    class GraphNodePath extends sparqlRule {
        structure: [VarOrTerm | TriplesNodePath]
    }

    class VarOrTerm extends sparqlRule {
        structure: [Var | GraphTerm]
    }

    class VarOrIri extends sparqlRule {
        structure: [Var | iri]
    }

    class Var extends sparqlRule {
        structure: [VAR1 | VAR2]
    }

    class GraphTerm extends sparqlRule {
        structure: [iri | RDFLiteral | NumericLiteral | BooleanLiteral | BlankNode | NIL]
    }

    class Expression extends sparqlRule {
        structure: [ConditionalOrExpression]
    }

    class ConditionalOrExpression extends sparqlRule {
        structure: [ConditionalAndExpression, Array<['||', ConditionalAndExpression]>]
    }

    class ConditionalAndExpression extends sparqlRule {
        structure: [ValueLogical, Array<['&&', ValueLogical]>]
    }

    class ValueLogical extends sparqlRule {
        structure: [RelationalExpression]
    }

    class RelationalExpression extends sparqlRule {
        structure: [NumericExpression, [
            // ['=', NumericExpression] | ['!=', NumericExpression] | ['<', NumericExpression] |
            // ['>', NumericExpression] | ['<=', NumericExpression] | ['>=', NumericExpression] |
            // ['IN', ExpressionList] | ['NOT', 'IN', ExpressionList]
            ['=' | '!=' | '<' | '>' | '<=' | '>=', NumericExpression] |
            ['NOT' | null, 'IN', ExpressionList]
        ] | null]
    }

    class NumericExpression extends sparqlRule {
        structure: [AdditiveExpression]
    }

    class AdditiveExpression extends sparqlRule {
        structure: [MultiplicativeExpression, Array<[
            ['+' | '-', MultiplicativeExpression] |
            NumericLiteralPositive | NumericLiteralNegative |
            Array<['*' | '/', UnaryExpression]>
        ]>]
    }

    class MultiplicativeExpression extends sparqlRule {
        structure: [UnaryExpression, Array<['*' | '/', UnaryExpression]>]
    }

    class UnaryExpression extends sparqlRule {
        structure: ['!' | '+' | '-' | null, PrimaryExpression]
    }

    class PrimaryExpression extends sparqlRule {
        structure: [BrackettedExpression | BuiltInCall | iriOrFunction | RDFLiteral | NumericLiteral | BooleanLiteral | Var]
    }

    class BrackettedExpression extends sparqlRule {
        structure: ['(', Expression, ')']
    }

    class BuiltInCall extends sparqlRule {
        structure: [Aggregate
            | ['STR', '(', Expression, ')']
            | ['LANG', '(', Expression, ')']
            | ['LANGMATCH', '(', Expression, ',', Expression, ')']
            | ['DATATYPE', '(', Expression, ')']
            | ['BOUND', '(', Var, ')']
            | ['IRI', '(', Expression, ')']
            | ['URI', '(', Expression, ')']
            | ['BNODE', ['(', Expression, ')'] | NIL]
            | ['RAND', NIL]
            | ['ABS', '(', Expression, ')']
            | ['CEIL', '(', Expression, ')']
            | ['FLOOR', '(', Expression, ')']
            | ['ROUND', '(', Expression, ')']
            | ['CONCAT', ExpressionList]
            | SubstringExpression
            | ['STRLEN', '(', Expression, ')']
            | StrReplaceExpression
            | ['UCASE', '(', Expression, ')']
            | ['LCASE', '(', Expression, ')']
            | ['ENCODE_FOR_URI', '(', Expression, ')']
            | ['CONTAINS', '(', Expression, ',', Expression, ')']
            | ['STRSTARTS', '(', Expression, ',', Expression, ')']
            | ['STRENDS', '(', Expression, ',', Expression, ')']
            | ['STRBEFORE', '(', Expression, ',', Expression, ')']
            | ['STRAFTER', '(', Expression, ',', Expression, ')']
            | ['YEAR', '(', Expression, ')']
            | ['MONTH', '(', Expression, ')']
            | ['DAY', '(', Expression, ')']
            | ['HOURS', '(', Expression, ')']
            | ['MINUTES', '(', Expression, ')']
            | ['SECONDS', '(', Expression, ')']
            | ['TIMEZONE', '(', Expression, ')']
            | ['TZ', '(', Expression, ')']
            | ['NOW', NIL]
            | ['UUID', NIL]
            | ['STRUUID', NIL]
            | ['MD5', '(', Expression, ')']
            | ['SHA1', '(', Expression, ')']
            | ['SHA256', '(', Expression, ')']
            | ['SHA384', '(', Expression, ')']
            | ['SHA512', '(', Expression, ')']
            | ['COALESCE', ExpressionList]
            | ['IF', '(', Expression, ',', Expression, ',', Expression, ')']
            | ['STRLANG', '(', Expression, ',', Expression, ')']
            | ['STRDT', '(', Expression, ',', Expression, ')']
            | ['sameTerm', '(', Expression, ',', Expression, ')']
            | ['isIRI', '(', Expression, ')']
            | ['isUri', '(', Expression, ')']
            | ['isBLANK', '(', Expression, ')']
            | ['isLITERAL', '(', Expression, ')']
            | ['isNUMERIC', '(', Expression, ')']
            | RegexExpression
            | ExistsFunc
            | NotExistsFunc
        ]
    }

    class RegexExpression extends sparqlRule {
        structure: ['REGEX', '(', Expression, ',', Expression, [',', Expression] | null]
    }

    class SubstringExpression extends sparqlRule {
        structure: ['SUBSTR', '(', Expression, ',', Expression, [',', Expression] | null]
    }

    class StrReplaceExpression extends sparqlRule {
        structure: ['REPLACE', '(', Expression, ',', Expression, ',', Expression, [',', Expression] | null]
    }

    class ExistsFunc extends sparqlRule {
        structure: ['EXISTS', GroupGraphPattern]
    }

    class NotExistsFunc extends sparqlRule {
        structure: ['NOT', 'EXISTS', GroupGraphPattern]
    }

    class Aggregate extends sparqlRule {
        structure: [
            ['COUNT', '(', 'DISTINCT' | null, '*' | Expression, ')']
            | ['SUM', '(', 'DISTINCT' | null, Expression, ')']
            | ['MIN', '(', 'DISTINCT' | null, Expression, ')']
            | ['MAX', '(', 'DISTINCT' | null, Expression, ')']
            | ['AVG', '(', 'DISTINCT' | null, Expression, ')']
            | ['SAMPLE', '(', 'DISTINCT' | null, Expression, ')']
            | ['GROUP_CONCAT', '(', 'DISTINCT' | null, Expression, [';', 'SEPARATOR', '=', String] | null]
        ]
    }

    class iriOrFunction extends sparqlRule {
        structure: [iri, ArgList | null]
    }

    class RDFLiteral extends sparqlRule {
        structure: [String, [LANGTAG | ['^^', iri]] | null]
    }

    class NumericLiteral extends sparqlRule {
        structure: [NumericLiteralUnsigned | NumericLiteralPositive | NumericLiteralNegative]
    }

    class NumericLiteralUnsigned extends sparqlRule {
        structure: [INTEGER | DECIMAL | DOUBLE]
    }

    class NumericLiteralPositive extends sparqlRule {
        structure: [INTEGER_POSITIVE | DECIMAL_POSITIVE | DOUBLE_POSITIVE]
    }

    class NumericLiteralNegative extends sparqlRule {
        structure: [INTEGER_NEGATIVE | DECIMAL_NEGATIVE | DOUBLE_NEGATIVE]
    }

    class BooleanLiteral extends sparqlRule {
        structure: ['true' | 'false']
    }

    class String extends sparqlRule {
        structure: [STRING_LITERAL1 | STRING_LITERAL2 | STRING_LITERAL_LONG1 | STRING_LITERAL_LONG2]
    }

    class iri extends sparqlRule {
        structure: [IRIREF | PrefixedName]
    }

    class PrefixedName extends sparqlRule {
        structure: [PNAME_LN | PNAME_NS]
    }

    class BlankNode extends sparqlRule {
        structure: [BLANK_NODE_LABEL | ANON]
    }


    /*
    For checking sparqlLiteral, we could use custom typeGuard based on regex as in 
    <https://stackoverflow.com/questions/42678891/typescript-character-type>
    */

    function regexor(pattern: string, subs = {}) {
        return (function (target: Object, propertyKey: string | symbol) {
            target[propertyKey] = XRegExp.build(pattern, subs)
            // return target;
        })
    }

    function testor(target: Object, propertyKey: string | symbol) {

    }

    class Terminals extends sparqlRule {
        static regex: RegExp

        static check(terminal: string): boolean {
            if (this.regex) {
                return this.regex.test(terminal);
            } else {
                return true;
            }
        }
    }

    class IRIREF extends Terminals {
        structure: ['<', string, '>']
        static regex = /^<[^<>"{}|^`\\\u{0000}-\u{0020}]*>$/u
    }

    class PN_CHARS_BASE extends Terminals {
        // static regex = /^[A-Z]|[a-z]|[\u{00C0}-\u{00D6}]|[\u{00D8}-\u{00F6}]|[\u{00F8}-\u{02FF}]|[\u{0370}-\u{037D}]|[\u{037F}]$/u
        static regex = XRegExp(
            `^[A-Z]|[a-z]|[\\u{00C0}-\\u{00D6}]|[\\u{00D8}-\\u{00F6}]|[\\u{00F8}-\\u{02FF}]|[\\u{0370}-\\u{037D}]|[\\u{037F}-\\u{1FFF}]
            |[\\u{200C}-\\u{200D}]|[\\u{2070}-\\u{218F}]|[\\u{2C00}-\\u{2FEF}]|[\\u{3001}-\\u{D7FF}]|[\\u{F900}-\\u{FDCF}]|[\\u{FDF0}-\\u{FFFD}]
            |[\\u{10000}-\\u{EFFFF}]$`
            , 'u')
    }

    class PN_CHARS_U extends Terminals {
        static regex = XRegExp.build(`{{PN_CHARS_BASE}}|_`,
            {
                PN_CHARS_BASE: PN_CHARS_BASE.regex,
            }
            , 'u')
    }

    class PN_CHARS extends Terminals {
        static regex = XRegExp.build(`({{PN_CHARS_U}}|-|[0-9]|\\u{00B7}|[\\u{0300}-\\u{036F}]|[\\u{203F}-\\u{2040}])*`,
            {
                PN_CHARS_U: PN_CHARS_U.regex,
            }
            , 'u')
    }

    class PN_PREFIX extends Terminals {
        static regex = XRegExp.build(`^{{PN_CHARS_BASE}}(({{PN_CHARS}}|\.)*{{PN_CHARS}})?$`, {
            PN_PREFIX: PN_PREFIX.regex,
            PN_CHARS: PN_CHARS.regex,
        }
            , 'u')
    }

    class PNAME_NS extends Terminals {
        structure: [PN_PREFIX | null, ';']
        static regex = XRegExp.build(`^({{PN_PREFIX}})?:$`, {
            PN_PREFIX: PN_PREFIX.regex
        }
            , 'u')
    }

    class HEX extends Terminals {
        static regex = /[0-9]|[A-F]|[a-f]/u
    }

    class PERCENT extends Terminals {
        static regex = XRegExp.build(`%{{HEX}{{HEX}}`,
            {
                HEX: HEX.regex,
            }
            , 'u')
    }

    class PN_LOCAL_ESC extends Terminals {
        static regex = XRegExp(`\\\\(_|~|\\.|\\-|!|\\$|&|'|\\(|\\)|\\*|\\+|,|;|=|\\/|\\?|#|@|%)`
            , 'u')
    }

    class PLX extends Terminals {
        static regex = XRegExp.build(`{{PERCENT}}|{{PN_LOCAL_ESC}}`,
            {
                PERCENT: PERCENT.regex,
                PN_LOCAL_ESC: PN_LOCAL_ESC.regex,
            }
            , 'u')
    }

    class PN_LOCAL extends Terminals {
        static regex = XRegExp.build(`^({{PN_CHARS_U}}|:|[0-9]|{{PLX}})(({{PN_CHARS}}|\\.|:|{{PLX}})*({{PN_CHARS}}|:|{{PLX}})?$`, {
            PN_CHARS_U: PN_CHARS_U.regex,
            PLX: PLX.regex,
            PN_CHARS: PN_CHARS.regex,
        }
            , 'u')
    }


    class PNAME_LN extends Terminals {
        structure: [PNAME_NS, PN_LOCAL]
        static regex = XRegExp.build(`^{{PNAME_NS}}{{PN_LOCAL}}$`, {
            PNAME_NS: PNAME_NS.regex,
            PN_LOCAL: PN_LOCAL.regex
        }
            , 'u')
    }



    class BLANK_NODE_LABEL extends Terminals {

        structure: ['_:']


        static regex = XRegExp.build(`^_:({{PN_CHARS_U}}|[0-9])(({{PN_CHARS}}|\.)*{{PN_CHARS}})?$`, {
            PN_CHARS_U: PN_CHARS_U.regex,
            PN_CHARS: PN_CHARS.regex
        }
            , 'u')
    }


    class VARNAME extends Terminals {
        static regex = XRegExp.build(`^({{PN_CHARS_U}}|[0-9])({{PN_CHARS_U}}|[0-9]|\\u{00B7}|[\\u{0300}-\\u{036F}]|[\\u203F-\\u{2040}])*$`, {
            PNAME_NS: PN_CHARS_U.regex,
        }
            , 'u')
    }


    class VAR1 extends Terminals { 
        static regex = XRegExp.build(`^\\?{{VARNAME}}$`, {
            VARNAME: VARNAME.regex,
        }
            , 'u')
    }

    class VAR2 extends Terminals {
        static regex = XRegExp.build('^\\${{VARNAME}}$', {
            VARNAME: VARNAME.regex,
        }
            , 'u')
    }

    class LANGTAG extends Terminals {
        static regex = /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*$/
     }

    class EXPONENT extends Terminals { 
        static regex = /^[eE][\+\-]?[0-9]+$/        
    }

    class INTEGER extends Terminals { 
        static regex = /^[0-9]$/
    }

    class DECIMAL extends Terminals { 
        static regex = /^[0-9]\.[0-9]+$/

    }

    class DOUBLE extends Terminals { 
        static regex = XRegExp.build('^[0-9]+\\.[0-9]*{{EXPONENT}}|\\.[0-9]+{{EXPONENT}}|[0-9]+{{EXPONENT}}$', {
            EXPONENT: EXPONENT.regex,
        })
    }

    class INTEGER_POSITIVE extends Terminals { 
        static regex = XRegExp.build('^\\+{{INTEGER}}$', {
            INTEGER: INTEGER.regex,
        })
    }

    class DECIMAL_POSITIVE extends Terminals { 
        static regex = XRegExp.build('^\\+{{DECIMAL}}$', {
            DECIMAL: DECIMAL.regex,
        })
    }

    class DOUBLE_POSITIVE extends Terminals { 
        static regex = XRegExp.build('^\\+{{DOUBLE}}$', {
            DOUBLE: DOUBLE.regex,
        })
    }

    class INTEGER_NEGATIVE extends Terminals { 
        static regex = XRegExp.build('^\\-{{INTEGER}}$', {
            INTEGER: INTEGER.regex,
        })
    }

    class DECIMAL_NEGATIVE extends Terminals {
        static regex = XRegExp.build('^\\-{{DECIMAL}}$', {
            DECIMAL: DECIMAL.regex,
        })
     }

    class DOUBLE_NEGATIVE extends Terminals { 
        static regex = XRegExp.build('^\\-{{DOUBLE}}$', {
            DOUBLE: DOUBLE.regex,
        })
    }

    class ECHAR extends Terminals { 
        static regex = /\\[^\\"']/
    }

    class STRING_LITERAL1 extends Terminals { 
        static regex = XRegExp.build(`^'([\\u{0027}\\u{005C}\\u{000A}\\u{000D}]|{{ECHAR}})*'$`,{
            ECHAR: ECHAR.regex
        }, 'u')
    }

    class STRING_LITERAL2 extends Terminals {
        static regex = XRegExp.build(`^"([\\u{0027}\\u{005C}\\u{000A}\\u{000D}]|{{ECHAR}})*"$`,{
            ECHAR: ECHAR.regex
        }, 'u')

    }

    class STRING_LITERAL_LONG1 extends Terminals { 
        static regex = XRegExp.build(`^'''(('|'')?([^'\\/]|ECHAR))*'''$`,{
            ECHAR: ECHAR.regex
        })
    }

    class STRING_LITERAL_LONG2 extends Terminals {
        static regex = XRegExp.build(`^"""(("|"")?([^"\\/]|ECHAR))*"""$`,{
            ECHAR: ECHAR.regex
        })
     }

    class WS extends Terminals { 
        static regex = /\u{0020}|\u{0009}|\u{000D}|\u{000A}/u
    }

    class NIL extends Terminals { 
        static regex = XRegExp.build(`^\\({{WS}}*\\)$`,{
            WS: WS.regex
        })
    }

    

    class ANON extends Terminals {
        static regex = XRegExp.build(`^\\[{{WS}}*\\]$`,{
            WS: WS.regex
        })
     }
}