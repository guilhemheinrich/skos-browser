import { SparqlClass, Uri, SparqlObject, Collection, Litteral, GraphDefinition, } from "src/app/sparql-services/sparql-parser.service";
import { UniqueIdentifier} from "src/app/common-classes/uniqueIdentifier";

class SkosOntology extends SparqlClass
{
    uri: string;
    // @SparqlObject(UniqueIdentifier)
    // @Collection
    rootElements: UniqueIdentifier[];


}