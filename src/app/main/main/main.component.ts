import { Component, OnInit } from '@angular/core';
import { SparqlClientService } from 'src/app/sparql-services/sparql-client.service';
import { SparqlParserService, QueryType } from 'src/app/sparql-services/sparql-parser.service';
import { SessionStorageService, SessionStorage } from 'ngx-webstorage';
import { UniqueIdentifier } from 'src/app/common-classes/uniqueIdentifier';
import * as Ontology from '../../common-classes/ontology';
import { GlobalVariables } from '../../configuration';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @SessionStorage('loadedOntology')
  loadedOntology: string;

  @SessionStorage('allGraphs')
  allGraphs: UniqueIdentifier[];
  @SessionStorage('selectedGraphs')
  selectedGraphs: UniqueIdentifier[];

  inheritanceFormat: string[];
  @SessionStorage('chosenInheritanceFormat')
  chosenInheritanceFormat: string;
  @SessionStorage('rootsElements')
  rootsElements: UniqueIdentifier[];
  @SessionStorage('selectedRoots')
  selectedRoots: UniqueIdentifier[];

  @SessionStorage('predicatesELements')
  predicatesElements: {predicateUri: string; cardinality: number}[];
  @SessionStorage('selectedPredicates')
  selectedPredicates: string[];

  lastClikedUri: string;
  constructor(
    private sparqlClient: SparqlClientService,
    private sparqlParser: SparqlParserService,
    private sessionSt: SessionStorageService,
  ) {
    if (this.selectedRoots === null) {
      this.selectedRoots = [];
    }
    if (this.selectedGraphs === null) {
      this.selectedGraphs = [];
    }
    this.inheritanceFormat = Object.keys(GlobalVariables.HIERACHICAL_STRUCTURE);
    this.inheritanceFormat.push('Raw');
    console.log(this.selectedRoots);
  }

  ngOnInit() {
  }
  
  
  ngAfterViewInit()
  {
    console.log(this.selectedRoots)
    this.selectedRoots.forEach((ui) => {
        $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
      });
    this.selectedGraphs.forEach((ui) => {
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    }); 
  }

  selectedRoot(ui: UniqueIdentifier) {
    let check = this.selectedRoots.some((element) => {
        // console.log(element.name);
      return element.name == ui.name && element.uri == ui.uri})
      this.lastClikedUri = ui.uri;
      let tmp;
      if (check) {
        tmp = [];
        this.selectedRoots.forEach((element) => {
          if (element.uri != ui.uri) {
            tmp.push(element);
          }
        })
        $(`.mainRoot[data-id="${ui.uri}"]`).removeClass('selected');
      } else {
      tmp = this.selectedRoots.map((element) => {return element;});
      tmp.push(ui);
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    }
    // Force the reinstancisation
    this.selectedRoots = tmp.map((element) => {return element;});
  }

  selectedGraph(ui: UniqueIdentifier) {
    let check = this.selectedGraphs.some((element) => {
      return element.uri == ui.uri});

      let tmp;
      if (check) {
        tmp = [];
        this.selectedGraphs.forEach((element) => {
          if (element.uri != ui.uri) {
            tmp.push(element);
          }
        })
        $(`.mainRoot[data-id="${ui.uri}"]`).removeClass('selected');
      } else {
      tmp = this.selectedGraphs.map((element) => {return element;});
      tmp.push(ui);
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    }
    // Force the reinstancisation
    this.selectedGraphs = tmp.map((element) => {return element;});
  }

  loadOntology () {
    this.rootsElements = [];
    this.selectedRoots = [];
    this.allGraphs = [];
    this.selectedGraphs = [];
    this.findAllNamedGraph();
    this.findAllPredicates();
  }
  
  loadRootsElements()
  {
    this.findAllPredicates();
    this.findAllRootElements();
  }

  findAllNamedGraph() {
    let allNamedGraphQuery = `
    SELECT DISTINCT ?graph WHERE {
      GRAPH ?graph {?s ?p ?o}
    }`;
    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let graphResults = this.sparqlClient.queryByUrlEncodedPost(allNamedGraphQuery);
    graphResults.subscribe((response => {
      console.log(response);
      this.allGraphs = response['results']['bindings'].map((element) => {
        return { uri: element.graph.value, name: element.graph.value };
      })
    }));
  }

  findAllRootElements() {
    let graphDefinition;
    if (this.chosenInheritanceFormat === 'Raw') {
      let anyPredicate = this.predicatesElements.map((element) => 
      {return '<' + element.predicateUri + '>';}).join('|');
      graphDefinition = `
      ?firstBorn (${anyPredicate}) ?child .
      OPTIONAL {
        ?firstBorn skos:prefLabel ?label .
        FILTER  (lang(?label) = 'en')
      }
      FILTER NOT EXISTS {?god ${anyPredicate} ?firstBorn}
      `;
    } else {
      graphDefinition = `
      
      ?firstBorn ${Ontology.downer(this.chosenInheritanceFormat)} ?child .
      OPTIONAL {
        ?firstBorn skos:prefLabel ?label .
        FILTER  (lang(?label) = 'en')
      }
      FILTER NOT EXISTS {?god ${Ontology.downer(this.chosenInheritanceFormat)} ?firstBorn}
      `
    }
    let allRootsQuery = `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    SELECT DISTINCT ?firstBorn ?label WHERE {
    ${Ontology.graphRestriction(this.selectedGraphs, graphDefinition)}
    }
    `;
    console.log(allRootsQuery);
    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let rootsResults = this.sparqlClient.queryByUrlEncodedPost(allRootsQuery);
    rootsResults.subscribe((response => {
      this.rootsElements = response['results']['bindings'].map((element) => {
        if (element.label !== undefined) {
          return { uri: element.firstBorn.value, name: element.label.value };
        } else {
          return { uri: element.firstBorn.value, name: element.firstBorn.value};
        }
      })
    }));
  }

  findAllPredicates() {
    let graphDefinition = `
    ?subject ?predicate ?object
    `
    let allPredicatesAndCount =`
      SELECT DISTINCT ?predicate (COUNT(?predicate) AS ?count) WHERE {
        ${Ontology.graphRestriction(this.selectedGraphs, graphDefinition)}
      } GROUP BY (?predicate) ORDER BY DESC(?count)
    `;
    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let predicatesResults = this.sparqlClient.queryByUrlEncodedPost(allPredicatesAndCount);
    predicatesResults.subscribe((response => {
      this.predicatesElements = response['results']['bindings'].map((element) => {
        return { predicateUri: element.predicate.value, number: element.count.value };
      })
    }));
    console.log(this.predicatesElements);
  }

  clear() {
    this.loadedOntology = '';
    this.rootsElements = [];
    this.selectedRoots = [];
    this.allGraphs = [];
    this.selectedGraphs = [];

  }
}
