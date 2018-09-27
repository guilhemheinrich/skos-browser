import { Component, OnInit, Output, Input, ViewChild, TemplateRef } from '@angular/core';
import { SparqlClientService } from '../../sparql-services/sparql-client.service';
import { SparqlParserService, GraphDefinition, QueryType } from '../../sparql-services/sparql-parser.service';
import { ThesaurusEntry, SkosIdentifier, addRootRestriction, findRoots, findAllRoots } from '../../common-classes/thesaurusEntry';
import { Observable, of } from 'rxjs';
import { UniqueIdentifier } from '../../common-classes/uniqueIdentifier';
import * as Ontology from '../../common-classes/ontology';
import { ShortenUriPipe } from 'src/app/shorten-uri.pipe';
// import {floatThead } from 'floatthead';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {

  @Input('sparqlEndpoint')
  sparqlEndpoint: string;

  @Input('graphRestrictions')
  graphRestrictions: UniqueIdentifier[];

  @Input('rootRestrictions')
  rootRestrictions?: { uri: string, name: string }[]
  @Input('complementaryGraph')
  complementaryGraph = false;

  @Input('selectedUri')
  selectedUri: string;

  previousUri: string;
  searchField: string;
  filter = {
    "subject": "",
    "predicate": "",
    "object": ""
  }



  allTriples: Ontology.DefaultTriple[];
  allLangs: Array<{ label: string, value: string }>;
  allDatatypes: Array<{ label: string, value: string }>;
  // datatable stuff
  columns = [
    { field: "subject" },
    { field: "predicate" },
    { field: "object" },

  ];


  constructor(
    private sparqlClient: SparqlClientService,
    private sparqlParser: SparqlParserService,
    private shortenUriPipe: ShortenUriPipe,
  ) {
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;
  }

  ngOnInit() {
    let result = this.searchUri(this.selectedUri);
    result.subscribe((response) => {
      this.parseResult(response);
    });
  }


  ngOnChanges() {

    let result = this.searchUri(this.selectedUri);
    result.subscribe((response) => {
      this.parseResult(response);
    });

  }

  onClickTerm(uri: string) {
    this.previousUri = this.selectedUri;
    this.selectedUri = uri;
    this.ngOnChanges();
  }


  /*
  Done with <http://tools.medialab.sciences-po.fr/iwanthue/>
  */
  setColorStyle(rdfAndValue: Ontology.RDFValueAndType) {
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

  skeleton(uri: string) {
    this.sparqlParser.graphPattern.subPatterns
    // Better version : UNROLLED value
      // SELECT DISTINCT * WHERE { 
      //   { SELECT ?subject ?predicate ?object WHERE {
      //    GRAPH ?graph { ?subject ?predicate ?object  VALUES (?subject) {( <http://lod.nal.usda.gov/nalt/127293>)} } VALUES ?graph {<http://ECPP_models/processus_added/set/> <http://www.example.com/my-graph>}
      //   } }UNION 
      //   { SELECT ?subject ?predicate ?object WHERE {
      //    GRAPH ?graph { ?subject ?predicate ?object  VALUES (?predicate) {( <http://lod.nal.usda.gov/nalt/127293>)} } VALUES ?graph {<http://ECPP_models/processus_added/set/> <http://www.example.com/my-graph>}
      //   } } UNION 
      //   { SELECT ?subject ?predicate ?object WHERE {
      //    GRAPH ?graph { ?subject ?predicate ?object  VALUES (?object) {( <http://lod.nal.usda.gov/nalt/127293>)} } VALUES ?graph {<http://ECPP_models/processus_added/set/> <http://www.example.com/my-graph>}
      //   } }
      //   }

// Problem : wraping it in a graph is need to work with the actual filter clause ... but it will not work with the graph restriction then

    let describeQuery = `
    ?subject ?predicate ?object
    VALUES (?subject ?predicate ?object) {( <${uri}> UNDEF UNDEF )
      (UNDEF <${uri}> UNDEF )
      (UNDEF UNDEF <${uri}> ) }
        `; 
    return describeQuery;
  }

  /*
    Such as defined in <https://www.w3.org/TR/xpath-functions/#regex-syntax>,
    with '!' added as a negative match
  */
  filterOperation() {
    let filterAddOn = "";
    Object.keys(this.filter).forEach((key) => {
      if (this.filter[key] !== "") {
        if (this.filter[key][0] !== '!') {
          filterAddOn += `
          FILTER regex(STR(?${key}),"${this.filter[key]}","i") 
          `;
        } else {
          filterAddOn += `
          FILTER NOT EXISTS { 
            ?subject ?predicate ?object .
            FILTER regex(STR(?${key}),"${this.filter[key].substring(1)}","i") }
          `;
        }
      }
    });
    return filterAddOn;
  }

  searchUri(uri: string) {
    let finalQuery = `SELECT DISTINCT * WHERE { ${Ontology.graphRestriction(this.graphRestrictions, this.skeleton(uri), this.complementaryGraph)} }`;
    console.log(finalQuery);
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;
    let result = this.sparqlClient.queryByUrlEncodedPost(finalQuery);
    return result;
  }

  parseResult(tripleMatch: Observable<any>) {

    let content = [];
    let tmpSetAllLangs = new Set<string>();
    let tmpSetAllDatatypes = new Set<string>();
    if (tripleMatch['results']['bindings']) {
      content = tripleMatch['results']['bindings']
      this.allTriples = [];
    } else {
      return;
    }

    content.forEach(element => {
      let triple = new Ontology.DefaultTriple({
        subject: new Ontology.RDFValueAndType({ value: this.selectedUri, type: Ontology.RDFType.IRI }),
        predicate: new Ontology.RDFValueAndType({ value: this.selectedUri, type: Ontology.RDFType.IRI }),
        object: new Ontology.RDFValueAndType({ value: this.selectedUri, type: Ontology.RDFType.IRI })
      });
      if (element.subject) {
        triple.subject.value = element.subject.value;
        triple.subject.type = element.subject.type;
      }
      if (element.object) {
        triple.object.value = element.object.value;
        triple.object.type = element.object.type;
        if (element.object['xml:lang']) {
          console.log(element);
          triple.object.lang = element.object['xml:lang'];
          tmpSetAllLangs.add(element.object['xml:lang']);
        }
        if (element.object.datatype) {
          triple.object.datatype = element.object.datatype;
          tmpSetAllDatatypes.add(element.object.datatype);
        }
      }
      if (element.predicate) {
        triple.predicate.value = element.predicate.value;
        triple.predicate.type = element.predicate.type;
      }
      this.allTriples.push(triple)
    });
    this.allLangs = [];
    tmpSetAllLangs.forEach((lang) => {
      this.allLangs.push({ label: lang, value: lang });
    })
    this.allDatatypes = [];
    tmpSetAllDatatypes.forEach((dataset) => {
      this.allDatatypes.push({ label: this.shortenUriPipe.transform(dataset), value: dataset });
    })
  }

  onChangeFilter() {
    let tmpQuery = `${this.skeleton(this.selectedUri)} ${this.filterOperation()}`
    let finalQuery = `SELECT DISTINCT * WHERE { 
      ${Ontology.graphRestriction(this.graphRestrictions, tmpQuery, this.complementaryGraph)}
    }`;

    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;
    console.log(finalQuery);
    let result = this.sparqlClient.queryByUrlEncodedPost(finalQuery);
    result.subscribe((response) => {
      this.parseResult(response);
    });
  }

  browse() {
    let tmpQuery = `
    { SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object .  FILTER regex(STR(?subject),"${this.searchField}","i") } }
    UNION { SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object .  FILTER regex(STR(?predicate),"${this.searchField}","i") } }
    UNION  { SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object .  FILTER regex(STR(?object),"${this.searchField}","i") } }
    `;
    let finalQuery = "";
    if (this.searchField) {
      finalQuery = `
      SELECT DISTINCT ?subject ?predicate ?object WHERE {
        ${Ontology.graphRestriction(this.graphRestrictions, tmpQuery, this.complementaryGraph)} }
        }
      `;
    }
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;
    let result = this.sparqlClient.queryByUrlEncodedPost(finalQuery);
    result.subscribe((response) => {
      /* not robust : we assume that the outputs are "?subject", "?predicate" and "?object"
      in order to parse them
      */
      this.parseResult(response);
    });
  }
}
