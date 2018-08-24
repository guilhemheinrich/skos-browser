import { Component, OnInit, Output, Input, } from '@angular/core';
import { SparqlClientService } from '../../sparql-services/sparql-client.service';
import { SparqlParserService, GraphDefinition, QueryType } from '../../sparql-services/sparql-parser.service';
import { ThesaurusEntry, SkosIdentifier, addRootRestriction, findRoots, findAllRoots } from '../../common-classes/thesaurusEntry';
import { Observable, of } from 'rxjs';
import {UniqueIdentifier} from '../../common-classes/uniqueIdentifier';
import * as Ontology from '../../common-classes/ontology';

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
    })
  }

  ngOnChanges() {

    let result = this.searchUri(this.selectedUri);
    result.subscribe((response) => {
      this.parseResult(response);
    })

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
    console.log(finalQuery);
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;
    let result = this.sparqlClient.queryByUrlEncodedPost(finalQuery);
    // let result = of(1, 2, 3);
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
      let triple = new Ontology.DefaultTriple({subject: this.selectedUri, object: this.selectedUri});
      if (element.subject) {
        triple.subject = element.subject.value;
      }
      if (element.object) {
        triple.object = element.object.value;
      }
      triple.predicate = element.predicate.value;
      this.allTriples.push(triple)
    });
  }
}
