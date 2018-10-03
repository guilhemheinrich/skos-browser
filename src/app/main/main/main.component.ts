import { Component, OnInit } from '@angular/core';
import { SparqlClientService } from 'src/app/sparql-services/sparql-client.service';
import { SparqlParserService, QueryType } from 'src/app/sparql-services/sparql-parser.service';
import { SessionStorageService, SessionStorage } from 'ngx-webstorage';
import { UniqueIdentifier } from 'src/app/common-classes/uniqueIdentifier';
import * as Ontology from '../../common-classes/ontology';
import { GlobalVariables } from '../../configuration';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @SessionStorage('loadedOntology')
  loadedOntology: string;
  @SessionStorage('validEndpoint')
  validEndpoint: boolean = false;

  @SessionStorage('allGraphs')
  allGraphs: UniqueIdentifier[];
  @SessionStorage('selectedGraphs')
  selectedGraphs: UniqueIdentifier[];
  @SessionStorage('negativeRestriction')
  negativeRestriction: boolean;
  @SessionStorage('graphSelectorAllState')
  graphSelectorAllState: boolean;

  inheritanceFormat: string[];
  @SessionStorage('chosenInheritanceFormat')
  chosenInheritanceFormat: string;
  @SessionStorage('rootsElements')
  rootsElements: UniqueIdentifier[];
  @SessionStorage('selectedRoots')
  selectedRoots: UniqueIdentifier[];

  @SessionStorage('predicatesELements')
  predicatesElements: { predicateUri: string; cardinality: number }[];
  @SessionStorage('selectedPredicates')
  selectedPredicates: string[];

  lastClikedUri: string;
  constructor(
    private sparqlClient: SparqlClientService,
    private sparqlParser: SparqlParserService,
    private sessionSt: SessionStorageService,
    private messageService: MessageService
  ) {
    if (this.negativeRestriction === null) {
      this.negativeRestriction = false;
    }
    if (this.graphSelectorAllState === null) {
      this.graphSelectorAllState = false;
    }
    if (this.allGraphs === null) {
      this.allGraphs = [];
    }
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

  ngOnChanges() {
    this.selectedRoots.forEach((ui) => {
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    });
    this.selectedGraphs.forEach((ui) => {
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    });
    if (this.graphSelectorAllState === true) {
      $('#selUnselButton').addClass('active');
    }
    if (this.negativeRestriction === true) {
      $('#negRestrictButton').addClass('active');
    }
  }
  ngAfterViewInit() {
    this.selectedRoots.forEach((ui) => {
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    });
    this.selectedGraphs.forEach((ui) => {
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    });
    if (this.graphSelectorAllState === true) {
      $('#selUnselButton').addClass('active');
    }
    if (this.negativeRestriction === true) {
      $('#negRestrictButton').addClass('active');
    }
  }

  selectedRoot(ui: UniqueIdentifier) {
    let check = this.selectedRoots.some((element) => {
      // console.log(element.name);
      return element.name == ui.name && element.uri == ui.uri
    })
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
      tmp = this.selectedRoots.map((element) => { return element; });
      tmp.push(ui);
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    }
    // Force the reinstancisation
    this.selectedRoots = tmp.map((element) => { return element; });
  }

  toggleActiveState($event) {
    // Add active class <https://getbootstrap.com/docs/4.0/components/buttons/#active-state>
    if ($($event.target).hasClass('active')) {
      $($event.target).removeClass("active");
    } else {
      $($event.target).addClass("active");
    }
  }

  selectUnselectAllGraphWatcher() {
    console.log(this.graphSelectorAllState);
    if (this.selectedGraphs.length == this.allGraphs.length) {
      $('#selUnselButton').addClass('active');
      this.graphSelectorAllState = true;
    } else {
      $('#selUnselButton').removeClass('active');
      this.graphSelectorAllState = false;
    }
  }


  toggleSelectUnselectAll() {
    console.log(this.allGraphs);
    this.graphSelectorAllState = !this.graphSelectorAllState;
    if (this.allGraphs === null) return;
    this.allGraphs.forEach((uniqueIdentifier) => {
      if (this.graphSelectorAllState) {
        $(`.mainRoot[data-id="${uniqueIdentifier.uri}"]`).addClass('selected');
      } else {
        $(`.mainRoot[data-id="${uniqueIdentifier.uri}"]`).removeClass('selected');
      }
    });
    if (this.graphSelectorAllState) {
      $('#selUnselButton').addClass('active');
      // Force the reinstancisation
      this.selectedGraphs = this.allGraphs.map((element) => { return element; });
    }
    else {
      $('#selUnselButton').removeClass('active');
      // Force the reinstancisation
      this.selectedGraphs = [];
    }
  }

  toggleNegativeRestriction() {
    this.negativeRestriction = !this.negativeRestriction;
  }


  /*
    Toggle the clicked graph : add/remove select css class and add/remove it to the selectedGraphs array
  */
  selectedGraph(ui: UniqueIdentifier) {
    let check = this.selectedGraphs.some((element) => {
      return element.uri == ui.uri
    });

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
      tmp = this.selectedGraphs.map((element) => { return element; });
      tmp.push(ui);
      $(`.mainRoot[data-id="${ui.uri}"]`).addClass('selected');
    }
    // Force the reinstancisation
    this.selectedGraphs = tmp.map((element) => { return element; });
  }

  loadOntology() {
    this.rootsElements = [];
    this.selectedRoots = [];
    this.allGraphs = [];
    this.selectedGraphs = [];
    this.checkData();
    this.findAllNamedGraph();
    this.messageService.add({
      severity:'success',
       summary:'Load Endpoint',
       detail:'Endpoint successfully reached'
      });
    // this.findAllPredicates();
  }

  loadRootsElements() {
    this.findAllRootElements();
    // let predicatesResults = this.findAllPredicates();
    // predicatesResults.subscribe((response => {
    //   this.predicatesElements = response['results']['bindings'].map((element) => {
    //     return { predicateUri: element.predicate.value, number: element.count.value };
    //   });
    // }));
  }

  checkData() {
    let checkValid = `
    SELECT * WHERE { ?s ?p ?o } LIMIT 1
    ` 
    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let checksResults = this.sparqlClient.queryByUrlEncodedPost(checkValid);
    checksResults.subscribe((response) => {
      // console.log(response)
      this.validEndpoint = (response['results']['bindings'].length == 1);
    })
  }

  findAllNamedGraph() {
    let allNamedGraphQuery = `
    SELECT DISTINCT ?graph WHERE {
      GRAPH ?graph {?s ?p ?o}
    }`;
    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let graphResults = this.sparqlClient.queryByUrlEncodedPost(allNamedGraphQuery);
    console.log(allNamedGraphQuery)
    graphResults.subscribe((response => {
      this.allGraphs = response['results']['bindings'].map((element) => {
        return { uri: element.graph.value, name: element.graph.value };
      })
    }));
  }

  findAllRootElements() {
    let graphDefinition;

    switch (this.chosenInheritanceFormat) {
      case 'Raw':
        let anyPredicate = this.predicatesElements.map((element) => { return '<' + element.predicateUri + '>'; }).join('|');
        graphDefinition = `
      ?firstBorn rdf:type\\^rdf:type ?child .
      FILTER NOT EXISTS {?god rdf:type\\^rdf:type ?firstBorn}
      OPTIONAL {
        ?firstBorn skos:prefLabel ?label .
        FILTER  (lang(?label) = 'en')
      }
      `;
        break;
      case 'owl-rdf':
        graphDefinition = `
      ?individual a ?firstBorn
      OPTIONAL {
        ?firstBorn skos:prefLabel ?label .
        FILTER  (lang(?label) = 'en')
      }
      `
        break;
      case 'skos':
        graphDefinition = `  
      ?firstBorn skos:narrower ?child .
      OPTIONAL {
        ?firstBorn skos:prefLabel ?label .
        FILTER  (lang(?label) = 'en')
      }
      FILTER NOT EXISTS {?god skos:narrower ?firstBorn}
    }
      `
        break;

    }
    let allRootsQuery = `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    SELECT DISTINCT ?firstBorn ?label WHERE {
    ${Ontology.graphRestriction(this.selectedGraphs, graphDefinition, this.negativeRestriction)}
    } LIMIT 100
    `;
    console.log(allRootsQuery);
    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let rootsResults = this.sparqlClient.queryByUrlEncodedPost(allRootsQuery);
    rootsResults.subscribe((response => {
      this.rootsElements = response['results']['bindings'].map((element) => {
        if (element.label !== undefined) {
          return { uri: element.firstBorn.value, name: element.label.value };
        } else {
          return { uri: element.firstBorn.value, name: element.firstBorn.value };
        }
      })
    }));
  }

  findAllPredicates() {
    let graphDefinition = `
    ?subject ?predicate ?object
    `
    let allPredicatesAndCount = `
      SELECT DISTINCT ?predicate (COUNT(?predicate) AS ?count) WHERE {
        ${Ontology.graphRestriction(this.selectedGraphs, graphDefinition)}
      } GROUP BY (?predicate) ORDER BY DESC(?count)
    `;
    this.sparqlClient.sparqlEndpoint = this.loadedOntology;
    let predicatesResults = this.sparqlClient.queryByUrlEncodedPost(allPredicatesAndCount);
    return predicatesResults;

  }

  clear() {
    this.loadedOntology = '';
    this.rootsElements = [];
    this.selectedRoots = [];
    this.allGraphs = [];
    this.selectedGraphs = [];
    this.negativeRestriction = false;
    this.graphSelectorAllState = false;
    this.validEndpoint = true;
    $('#selUnselButton').removeClass('active');
    $('#negRestrictButton').removeClass('active');
  }
}
