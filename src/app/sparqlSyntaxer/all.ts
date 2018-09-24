import {XRegExp} from 'xregexp';

/*
    From <https://www.w3.org/TR/sparql11-query/#grammar>
    Intent to be as close as possible of the document
*/

namespace sparl_grammar {
    interface stringifiable {
        toString(): string;
    }


    
    enum _SwitchCase {
        'rule',
        'string',
        'array'
    }
    
    function _switchCase(element) {
        if (element instanceof sparqlRule) {
            return _SwitchCase.rule
        } else if (Array.isArray(element)){
            return _SwitchCase.array
        } else {
            return _SwitchCase.string
        }
    }

    function _jws(array: string[]) {
        return array.join(' ');
    }
    
// From <https://www.typescriptlang.org/docs/handbook/decorators.html>
// And <https://gist.github.com/remojansen/16c661a7afd68e22ac6e>
    function _sparqlStructure (structure: Array<sparqlRule | string | null | Array<sparqlRule | string | null> >) {
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
            // originalObject.name = (<{ when: { name: string } }>filter).when.name;
            return originalObject;
          }
      
          // copy prototype so intanceof operator still works
          f.prototype = original.prototype;
      
          // return new constructor (will override original)
          return f;
        }
      }


    class sparqlRule {
        // structure: Array<sparqlRule | string | Array<sparqlRule | string>>
        structure = [];
        
        private _skeleton(element) 
        {
            switch (_switchCase(element)) {
                case _SwitchCase.rule:
                return (<sparqlRule>element).skeleton();
                case _SwitchCase.string:
                return <string>element;
                case _SwitchCase.array:
                return _jws(element.map(ele => {element._skeleton(ele)}));
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
        structureO: {query: Query} | {notso: string};

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
            [ ConstructTemplate, DatasetClause[], WhereClause, SolutionModifier ] |
            // [ DatasetClause[], SolutionModifier ] |
            [ DatasetClause[], TriplesTemplate | null, SolutionModifier ] ];
 

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
        structure: [BuiltInCall | FunctionCall | ['(', Expression, ['AS', Var] | null, ')'] | Var ]
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
        // structure:
    }
    
    class Drop extends sparqlRule {}
    
    class Create extends sparqlRule {}
    
    class Add extends sparqlRule {}
    
    class Move extends sparqlRule {}
    
    class Copy extends sparqlRule {}
    
    class InsertData extends sparqlRule {}
    
    class DeleteData extends sparqlRule {}
    
    class DeleteWhere extends sparqlRule {}
    
    class Modify extends sparqlRule {}
    
    class DeleteClause extends sparqlRule {}
    
    class InsertClause extends sparqlRule {}
    
    class UsingClause extends sparqlRule {}
    
    class GraphOrDefault extends sparqlRule {}
    
    class GraphRef extends sparqlRule {}
    
    class GraphRefAll extends sparqlRule {}
    
    class QuadPattern extends sparqlRule {}
    
    class QuadData extends sparqlRule {}
    
    class Quads extends sparqlRule {}
    
    class QuadsNotTriples extends sparqlRule {}
    
    class TriplesTemplate extends sparqlRule {}
    
    class GroupGraphPattern extends sparqlRule {}
    
    class GroupGraphPatternSub extends sparqlRule {}
    
    class TriplesBlock extends sparqlRule {}
    
    class GraphPatternNotTriples extends sparqlRule {}
    
    class OptionalGraphPattern extends sparqlRule {}
    
    class GraphGraphPattern extends sparqlRule {}
    
    class ServiceGraphPattern extends sparqlRule {}
    
    class Bind extends sparqlRule {}
    
    class InlineData extends sparqlRule {}
    
    class DataBlock extends sparqlRule {}
    
    class InlineDataOneVar extends sparqlRule {}
    
    class InlineDataFull extends sparqlRule {}
    
    class DataBlockValue extends sparqlRule {}
    
    class MinusGraphPattern extends sparqlRule {}
    
    class GroupUnionGraphPattern extends sparqlRule {}
    
    class Filter extends sparqlRule {}
    
    class Constraint extends sparqlRule {}
    
    class FunctionCall extends sparqlRule {}
    
    class ArgList extends sparqlRule {}
    
    class ExpressionList extends sparqlRule {}
    
    class ConstructTemplate extends sparqlRule {}
    
    class ConstructTriples extends sparqlRule {}
    
    class TriplesSameSubject extends sparqlRule {}
    
    class PropertyList extends sparqlRule {}
    
    class PropertyListNotEmpty extends sparqlRule {}
    
    class Verb extends sparqlRule {}
    
    class ObjectList extends sparqlRule {}
    
    class Object extends sparqlRule {}
    
    class TriplesSameSubjectPath extends sparqlRule {}
    
    class PropertyListPath extends sparqlRule {}
    
    class PropertyListPathNotEmpty extends sparqlRule {}

    class VerbPath extends sparqlRule {}

    class VarbSimple extends sparqlRule {}

    class ObjectListPath extends sparqlRule {}

    class ObjectPath extends sparqlRule {}

    class Path extends sparqlRule {}

    class PathAlternative extends sparqlRule {}

    class PathSequence extends sparqlRule {}

    class PathElt extends sparqlRule {}

    class PathEltOrInverse extends sparqlRule {}

    class PathMod extends sparqlRule {}

    class PathPrimary extends sparqlRule {}

    class PathNegatedPropertySet extends sparqlRule {}

    class PathOneInPropertySet extends sparqlRule {}

    class Integer extends sparqlRule {}

    class TriplesNode extends sparqlRule {}

    class BlankNodePorpertyList extends sparqlRule {}

    class TriplesNodePath extends sparqlRule {}

    class BlankNodePropertyListPath  extends sparqlRule {}

    class Collection extends sparqlRule {}

    class CollectionPath extends sparqlRule {}

    class GraphNode extends sparqlRule {}

    class GraphNodePath extends sparqlRule {}

    class VarOrTerm extends sparqlRule {}

    class VarOrIri extends sparqlRule {}

    class Var extends sparqlRule {}

    class GraphTerm extends sparqlRule {}

    class Expression extends sparqlRule {}

    class ConditionalOrExpression extends sparqlRule {}

    class ConditionalAndExpression extends sparqlRule {}

    class ValueLogical extends sparqlRule {}

    class RelationalExpression extends sparqlRule {}

    class NumericExpression extends sparqlRule {}

    class AdditiveExpression extends sparqlRule {}

    class MultiplicativeExpression extends sparqlRule {}

    class UnaryExpression extends sparqlRule {}

    class PrimaryExpression extends sparqlRule {}

    class BrackettedExpression extends sparqlRule {}

    class BuiltInCall extends sparqlRule {}

    class RegexExpression extends sparqlRule {}

    class SubstringExpression extends sparqlRule {}

    class StrReplaceExpression extends sparqlRule {}

    class ExistsFunc extends sparqlRule {}

    class NotExistsFunc extends sparqlRule {}

    class Aggregate extends sparqlRule {}

    class iriOrFunction extends sparqlRule {}

    class RDFLiteral extends sparqlRule {}

    class NumericLiteral extends sparqlRule {}

    class NumericLiteralUnsigned extends sparqlRule {}

    class NumericLiteralPositive extends sparqlRule {}

    class NumericLiteralNegative extends sparqlRule {}

    class BooleanLiteral extends sparqlRule {}

    class String extends sparqlRule {}

    class iri extends sparqlRule {}

    class PrefixedName extends sparqlRule {}

    class BlankNode extends sparqlRule {}

    class IRIREF extends sparqlRule {}

    class PNAME_NS extends sparqlRule {}

    class PNAME_LN extends sparqlRule {}

    class BLANK_NODE_LABEL extends sparqlRule {}

    class VAR1 extends sparqlRule {}

    class VAR2 extends sparqlRule {}

    class LANGTAG extends sparqlRule {}

    class INTEGER extends sparqlRule {}

    class DECIMAL extends sparqlRule {}

    class DOUBLE extends sparqlRule {}

    class INTEGER_POSITIVE extends sparqlRule {}

    class DECIMAL_POSITIVE extends sparqlRule {}

    class DOUBLE_POSITIVE extends sparqlRule {}

    class INTEGER_NEGATIVE extends sparqlRule {}

    class DECIMAL_NEGATIVE extends sparqlRule {}

    class DOUBLE_NEGATIVE extends sparqlRule {}

    class EXPONENT extends sparqlRule {}

    class STRING_LITERAL1 extends sparqlRule {}

    class STRING_LITERAL2 extends sparqlRule {}

    class STRING_LITERAL_LONG1 extends sparqlRule {}

    class STRING_LITERAL_LONG2 extends sparqlRule {}

    class ECHAR extends sparqlRule {}

    class NIL extends sparqlRule {}

    class WS extends sparqlRule {}

    class ANON extends sparqlRule {}

    class PN_CHARS_BASE extends sparqlRule {}

    class PN_CHARS_U extends sparqlRule {}

    class VARNAME extends sparqlRule {}

    class PN_CHARS extends sparqlRule {}

    class PN_PREFIX extends sparqlRule {}

    class PN_LOCAL extends sparqlRule {}

    class PLX extends sparqlRule {}

    class PERCENT extends sparqlRule {}

    class HEX extends sparqlRule {}

    class PN_LOCAL_ESC extends sparqlRule {}
}