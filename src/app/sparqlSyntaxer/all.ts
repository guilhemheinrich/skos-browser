/*
    From <https://www.w3.org/TR/sparql11-query/#grammar>
    Intent to be as close as possible of the document
*/

namespace sparl_grammar {
    interface stringifiable {
        toString(): string;
    }

    class QueryUnit implements stringifiable {
        query: Query;
    }
    
    class Query implements stringifiable {
        prologue:Prologue;
        queryType: SelectQuery | ConstructQuery | DescribeQuery | AskQuery;
        valuesClause: ValuesClause;
    }
    
    class UpdateUnit implements stringifiable {
        update: Update;
    }
    
    class Prologue implements stringifiable {
        declarations?: Array< BaseDecl | PrefixDecl >
    }
    
    class BaseDecl implements stringifiable {
        iriref: IRIREF;
        toString() {
            return 'BASE ' + iriref;
        }
    }
    
    class PrefixDecl implements stringifiable {}
    
    class SelectQuery implements stringifiable {}
    
    class SubSelect implements stringifiable {}
    
    class SelectClause implements stringifiable {}
    
    class ConstructQuery implements stringifiable {}
    
    class DescribeQuery implements stringifiable {}
    
    class AskQuery implements stringifiable {}
    
    class DatasetClause implements stringifiable {}
    
    class DefaultGraphClause implements stringifiable {}
    
    class NamedGraphClause implements stringifiable {}
    
    class SourceSelector implements stringifiable {}
    
    class WhereClause implements stringifiable {}
    
    class SolutionModifier implements stringifiable {}
    
    class GroupClause implements stringifiable {}
    
    class GroupCondition implements stringifiable {}
    
    class HavingClause implements stringifiable {}
    
    class HavingCondition implements stringifiable {}
    
    class OrderClause implements stringifiable {}
    
    class OrderCondition implements stringifiable {}
    
    class LimitOffsetClauses implements stringifiable {}
    
    class LimitClause implements stringifiable {}
    
    class OffsetClause implements stringifiable {}
    
    class ValuesClause implements stringifiable {}
    
    class Update implements stringifiable {}
    
    class Update1 implements stringifiable {}
    
    class Load implements stringifiable {}
    
    class Clear implements stringifiable {}
    
    class Drop implements stringifiable {}
    
    class Create implements stringifiable {}
    
    class Add implements stringifiable {}
    
    class Move implements stringifiable {}
    
    class Copy implements stringifiable {}
    
    class InsertData implements stringifiable {}
    
    class DeleteData implements stringifiable {}
    
    class DeleteWhere implements stringifiable {}
    
    class Modify implements stringifiable {}
    
    class DeleteClause implements stringifiable {}
    
    class InsertClause implements stringifiable {}
    
    class UsingClause implements stringifiable {}
    
    class GraphOrDefault implements stringifiable {}
    
    class GraphRef implements stringifiable {}
    
    class GraphRefAll implements stringifiable {}
    
    class QuadPattern implements stringifiable {}
    
    class QuadData implements stringifiable {}
    
    class Quads implements stringifiable {}
    
    class QuadsNotTriples implements stringifiable {}
    
    class TriplesTemplate implements stringifiable {}
    
    class GroupGraphPattern implements stringifiable {}
    
    class GroupGraphPatternSub implements stringifiable {}
    
    class TriplesBlock implements stringifiable {}
    
    class GraphPatternNotTriples implements stringifiable {}
    
    class OptionalGraphPattern implements stringifiable {}
    
    class GraphGraphPattern implements stringifiable {}
    
    class ServiceGraphPattern implements stringifiable {}
    
    class Bind implements stringifiable {}
    
    class InlineData implements stringifiable {}
    
    class DataBlock implements stringifiable {}
    
    class InlineDataOneVar implements stringifiable {}
    
    class InlineDataFull implements stringifiable {}
    
    class DataBlockValue implements stringifiable {}
    
    class MinusGraphPattern implements stringifiable {}
    
    class GroupUnionGraphPattern implements stringifiable {}
    
    class Filter implements stringifiable {}
    
    class Constraint implements stringifiable {}
    
    class FunctionCall implements stringifiable {}
    
    class ArgList implements stringifiable {}
    
    class ExpressionList implements stringifiable {}
    
    class ConstructTemplate implements stringifiable {}
    
    class ConstructTriples implements stringifiable {}
    
    class TriplesSameSubject implements stringifiable {}
    
    class PropertyList implements stringifiable {}
    
    class PropertyListNotEmpty implements stringifiable {}
    
    class Verb implements stringifiable {}
    
    class ObjectList implements stringifiable {}
    
    class Object implements stringifiable {}
    
    class TriplesSameSubjectPath implements stringifiable {}
    
    class PropertyListPath implements stringifiable {}
    
    class PropertyListPathNotEmpty implements stringifiable {}

    class VerbPath implements stringifiable {}

    class VarbSimple implements stringifiable {}

    class ObjectListPath implements stringifiable {}

    class ObjectPath implements stringifiable {}

    class Path implements stringifiable {}

    class PathAlternative implements stringifiable {}

    class PathSequence implements stringifiable {}

    class PathElt implements stringifiable {}

    class PathEltOrInverse implements stringifiable {}

    class PathMod implements stringifiable {}

    class PathPrimary implements stringifiable {}

    class PathNegatedPropertySet implements stringifiable {}

    class PathOneInPropertySet implements stringifiable {}

    class Integer implements stringifiable {}

    class TriplesNode implements stringifiable {}

    class BlankNodePorpertyList implements stringifiable {}

    class TriplesNodePath implements stringifiable {}

    class BlankNodePropertyListPath  implements stringifiable {}

    class Collection implements stringifiable {}

    class CollectionPath implements stringifiable {}

    class GraphNode implements stringifiable {}

    class GraphNodePath implements stringifiable {}

    class VarOrTerm implements stringifiable {}

    class VarOrIri implements stringifiable {}

    class Var implements stringifiable {}

    class GraphTerm implements stringifiable {}

    class Expression implements stringifiable {}

    class ConditionalOrExpression implements stringifiable {}

    class ConditionalAndExpression implements stringifiable {}

    class ValueLogical implements stringifiable {}

    class RelationalExpression implements stringifiable {}

    class NumericExpression implements stringifiable {}

    class AdditiveExpression implements stringifiable {}

    class MultiplicativeExpression implements stringifiable {}

    class UnaryExpression implements stringifiable {}

    class PrimaryExpression implements stringifiable {}

    class BrackettedExpression implements stringifiable {}

    class BuiltInCall implements stringifiable {}

    class RegexExpression implements stringifiable {}

    class SubstringExpression implements stringifiable {}

    class StrReplaceExpression implements stringifiable {}

    class ExistsFunc implements stringifiable {}

    class NotExistsFunc implements stringifiable {}

    class Aggregate implements stringifiable {}

    class iriOrFunction implements stringifiable {}

    class RDFLiteral implements stringifiable {}

    class NumericLiteral implements stringifiable {}

    class NumericLiteralUnsigned implements stringifiable {}

    class NumericLiteralPositive implements stringifiable {}

    class NumericLiteralNegative implements stringifiable {}

    class BooleanLiteral implements stringifiable {}

    class String implements stringifiable {}

    class iri implements stringifiable {}

    class PrefixedName implements stringifiable {}

    class BlankNode implements stringifiable {}

    class IRIREF implements stringifiable {}

    class PNAME_NS implements stringifiable {}

    class PNAME_LN implements stringifiable {}

    class BLANK_NODE_LABEL implements stringifiable {}

    class VAR1 implements stringifiable {}

    class VAR2 implements stringifiable {}

    class LANGTAG implements stringifiable {}

    class INTEGER implements stringifiable {}

    class DECIMAL implements stringifiable {}

    class DOUBLE implements stringifiable {}

    class INTEGER_POSITIVE implements stringifiable {}

    class DECIMAL_POSITIVE implements stringifiable {}

    class DOUBLE_POSITIVE implements stringifiable {}

    class INTEGER_NEGATIVE implements stringifiable {}

    class DECIMAL_NEGATIVE implements stringifiable {}

    class DOUBLE_NEGATIVE implements stringifiable {}

    class EXPONENT implements stringifiable {}

    class STRING_LITERAL1 implements stringifiable {}

    class STRING_LITERAL2 implements stringifiable {}

    class STRING_LITERAL_LONG1 implements stringifiable {}

    class STRING_LITERAL_LONG2 implements stringifiable {}

    class ECHAR implements stringifiable {}

    class NIL implements stringifiable {}

    class WS implements stringifiable {}

    class ANON implements stringifiable {}

    class PN_CHARS_BASE implements stringifiable {}

    class PN_CHARS_U implements stringifiable {}

    class VARNAME implements stringifiable {}

    class PN_CHARS implements stringifiable {}

    class PN_PREFIX implements stringifiable {}

    class PN_LOCAL implements stringifiable {}

    class PLX implements stringifiable {}

    class PERCENT implements stringifiable {}

    class HEX implements stringifiable {}

    class PN_LOCAL_ESC implements stringifiable {}
}