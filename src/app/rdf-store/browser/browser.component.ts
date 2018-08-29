import { Component, OnInit, Output, Input, } from '@angular/core';
import { SparqlClientService } from '../../sparql-services/sparql-client.service';
import { SparqlParserService, GraphDefinition, QueryType } from '../../sparql-services/sparql-parser.service';
import { ThesaurusEntry, SkosIdentifier, addRootRestriction, findRoots, findAllRoots } from '../../common-classes/thesaurusEntry';
import { Observable, of } from 'rxjs';
import {UniqueIdentifier} from '../../common-classes/uniqueIdentifier';
import * as Ontology from '../../common-classes/ontology';
// import {floatThead } from 'floatthead';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {

  @Input('sparqlEndpoint')
  sparqlEndpoint: string;

  @Input('rootRestrictions')
  rootRestrictions?: { uri: string, name: string }[]

  @Input('selectedUri')
  selectedUri : string;

  previousUri: string;

  filter = {
    subject :  undefined,
    predicate : undefined,
    object : undefined,
  }

  allTriples: Ontology.DefaultTriple[]
  constructor(
    private sparqlClient: SparqlClientService,
    private sparqlParser: SparqlParserService,
  ) { 
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;
  }

  ngOnInit() {
    let result = this.searchUri(this.selectedUri);
    result.subscribe((response) => {
      this.parseResult(response);
    });
    
  }

  ngAfterViewChecked() {
    // Object.defineProperty(, "floatThead");
    $('table').floatThead();
    $('thead').css('background', '#eee');
  }

  ngOnChanges() {

    let result = this.searchUri(this.selectedUri);
    result.subscribe((response) => {
      this.parseResult(response);
    });
    $('table').floatThead();
    $('thead').css('background', '#eee');
  }

  onClickTerm(uri:string) {
    this.previousUri = this.selectedUri;
    this.selectedUri = uri;
    this.ngOnChanges();
  }

  /*
  Done with <http://tools.medialab.sciences-po.fr/iwanthue/>
  */
  setColorStyle(rdfAndValue: Ontology.RDFValueAndType)
  {
    if (rdfAndValue.type === Ontology.RDFType.Literal || rdfAndValue.type === Ontology.RDFType.Typed_literal) {
      return '#4ce7fa';
    } else {
      if (rdfAndValue.value == this.selectedUri) {
        return '#fd9cba';
      } else {
        return '#d9e699';
      }
    }
  }
  
  searchUri(uri: string) {
    this.sparqlParser.clear();
    this.sparqlParser.queryType = QueryType.QUERY;
    let describeQuery = `
      {<${uri}> ?predicate ?object } 
      UNION {
        ?subject ?predicate <${uri}>
      }
    `;
    let finalQuery = `SELECT DISTINCT * WHERE { ${describeQuery} }`;
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;
    let result = this.sparqlClient.queryByUrlEncodedPost(finalQuery);
    return result;
  }

  parseResult(tripleMatch: Observable<any>) {
    console.log(tripleMatch);
    let content =[];
    if (tripleMatch['results']['bindings']) {
      content = tripleMatch['results']['bindings']
      this.allTriples = [];
    } else {
      return;
    }

    content.forEach(element => {
      console.log(element);
      let triple = new Ontology.DefaultTriple({
        subject: {value: this.selectedUri, type: Ontology.RDFType.IRI},
         object: { value: this.selectedUri, type: Ontology.RDFType.IRI}
        });
      if (element.subject) {
        triple.subject.value = element.subject.value;
        triple.subject.type = element.subject.type;
      }
      if (element.object) {
        triple.object.value = element.object.value;
        triple.object.type = element.object.type;
      }
      triple.predicate.value = element.predicate.value;
      triple.predicate.type = Ontology.RDFType.IRI;
      this.allTriples.push(triple)
    });
  }
}
