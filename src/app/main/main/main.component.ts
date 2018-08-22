import { Component, OnInit } from '@angular/core';
import {SparqlClientService} from 'src/app/sparql-services/sparql-client.service';
import {SparqlParserService, QueryType} from 'src/app/sparql-services/sparql-parser.service';

import {UniqueIdentifier} from 'src/app/common-classes/uniqueIdentifier';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  loadedOntology: string;
  rootsElements: UniqueIdentifier[];

  constructor(
    private sparqlClient: SparqlClientService,
    private sparqlParser: SparqlParserService,
  ) { }

  ngOnInit() {
  }

  loadOntology()
  {
    // this.loadedOntology.push();
  }

  findAllRootElements()
  {
    let allRootsQuery = `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    SELECT DISTINCT ?firstBorn ?label WHERE {
    ?firstBorn skos:narrower ?child .
    ?firstBorn skos:prefLabel ?label .
    FILTER NOT EXISTS {?god skos:narrower ?firstBorn}
    FILTER  (lang(?label) = 'en')
    }
    `;

    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let rootsResults = this.sparqlClient.queryByUrlEncodedPost(allRootsQuery);
    rootsResults.subscribe((response => {
      this.rootsElements = response['results']['bindings'].map((element) => {
        return {uri: element.firstBorn.value, name: element.label.value} ;
      })
    }));
  }
}
