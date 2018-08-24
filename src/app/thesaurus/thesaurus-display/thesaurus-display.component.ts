import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { SparqlClientService } from '../../sparql-services/sparql-client.service';
import { SparqlParserService, GraphDefinition, QueryType } from '../../sparql-services/sparql-parser.service';
import { ThesaurusEntry, SkosIdentifier, addRootRestriction, findRoots, findAllRoots } from '../../common-classes/thesaurusEntry';
import {UniqueIdentifier} from '../../common-classes/uniqueIdentifier';
import { Observable, of } from 'rxjs';

// import { Input } from '../../processus/processus';
// import { Output as pOutput } from '../../processus/processus';



@Component({
  selector: 'app-thesaurus-display',
  templateUrl: './thesaurus-display.component.html',
  styleUrls: ['./thesaurus-display.component.css']
})
export class ThesaurusDisplayComponent implements OnInit {

  searchField: string;

  @Input('sparqlEndpoint')
  sparqlEndpoint: string;

  @Input('rootRestrictions')
  rootRestrictions?: { uri: string, name: string }[]

  @ViewChild('searchInput')
  searchInput: ElementRef;
  @Output()
  result = new EventEmitter<UniqueIdentifier>();
  selectedIndex: number;


  mapThesaurusEntries: { [uri: string]: ThesaurusEntry } = {};
  thesaurusEntries: ThesaurusEntry[] = <ThesaurusEntry[]>[];
  thesaurusEntry: ThesaurusEntry;

  searchResultChips: Array<UniqueIdentifier> = [];

  @Input('height')
  height: string = "500px";

  // For the autocomplete delay, in millisecond
  typingTimer: any;
  typingTimeout: number = 500;

  constructor(
    private sparqlClient: SparqlClientService,
    private sparqlParser: SparqlParserService,
  ) {
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;

  }

  ngOnInit() {
  }
  
  ngOnChanges() {
    this.sparqlClient.sparqlEndpoint = this.sparqlEndpoint;

    this.delayedAutocomplete();
    /* Set the initial thesaurusEntry
    Only fit the first 'root' if there is more than one
    */
    if (this.rootRestrictions !== undefined) {
      var result = this.searchUri(this.rootRestrictions[0].uri);
      result.subscribe((response => {
        if (response['results']['bindings'] && response['results']['bindings'][0].ThesaurusEntry) {
          let toObjectify = <string>response['results']['bindings'][0].ThesaurusEntry.value;
          this.thesaurusEntry = new ThesaurusEntry(JSON.parse(toObjectify));
        }
      }));
    } else {
      let allRootsQuerry = findAllRoots();
      let rootsResults = this.sparqlClient.queryByUrlEncodedPost(allRootsQuerry);
      rootsResults.subscribe((response => {
        this.rootRestrictions = response['results']['bindings'].map((element) => {
          return {uri: element.firstBorn.value, name: element.label.value} ;
        })
      }));
      
    }
  }


  delayedAutocomplete() {

    if (this.typingTimer < this.typingTimeout) {
      window.clearTimeout(this.typingTimer);
    }
    if (this.searchField && this.searchField.length >= 3) {
      this.typingTimer = window.setTimeout(() => { this.autocomplete() }, this.typingTimeout);
    }
  }


  autocomplete() {
    var result = this.search(this.searchField);
    result.subscribe((response => {
      if (response['results']['bindings']) {
        this._parseSearch(response['results']['bindings']);
      }
    }));
  };

  onMatSelected($event: any) {
    console.log($event);
    if ($event.selected == true) {

    }
  }

  onMatClicked(id) {
    this.onClickIdentifier(id);
  }

  onClickIdentifier(identifier: UniqueIdentifier) {

    this.result.emit(identifier);
    var result = this.searchUri(identifier.uri);
    result.subscribe((response => {

      if (response['results']['bindings'] && response['results']['bindings'][0].ThesaurusEntry) {
        let toObjectify = <string>response['results']['bindings'][0].ThesaurusEntry.value;
        this.thesaurusEntry = new ThesaurusEntry(JSON.parse(toObjectify));
      }
    }));
    var roots = findRoots(identifier.uri);
    this.sparqlParser.clear();
    this.sparqlParser.queryType = QueryType.QUERY;
    this.sparqlParser.prefixes = roots.prefixes;
    this.sparqlParser.graphPattern = roots;
    console.log(this.sparqlParser.toString());
    let rootsResults = this.sparqlClient.queryByUrlEncodedPost(this.sparqlParser.toString());
    rootsResults.subscribe((response => {
      if (this.rootRestrictions !== undefined) {
        this.rootRestrictions.forEach((identifier) => {
          $(`.skosRoot[data-id="${identifier.uri}"`).removeClass('selected');
        })
      }
      response['results']['bindings'].forEach((element) => {
        $(`.skosRoot[data-id="${element.root.value}"`).addClass('selected');
      })
    }))
  }

  // Query the search filled for identifiers
  search(input: string) {


    this.sparqlParser.clear();
    this.sparqlParser.queryType = QueryType.QUERY;
    this.sparqlParser.prefixes = SkosIdentifier.requiredPrefixes;
    let emptySkosIdentifier = new SkosIdentifier();
    var query = emptySkosIdentifier.parseSkeleton();
    var gather = emptySkosIdentifier.parseGather(input, query);
    this.sparqlParser.graphPattern = gather;
    if (this.rootRestrictions !== undefined) {
      let uriRootRestrictions = this.rootRestrictions.map((identifier) => {
        return identifier.uri;
      });
      let subselect = SkosIdentifier.gatheringVariables.map((value) => {
        return emptySkosIdentifier.sparqlIdentifier(value);
    }).join(' ');
      let wrapedGraph = new GraphDefinition({triplesContent: [`
      {SELECT DISTINCT${subselect} WHERE
        ${gather.toString()}
      }
      `]});
      let graphRestriction = addRootRestriction(emptySkosIdentifier.sparqlIdentifier('uri'), uriRootRestrictions);
      wrapedGraph.merge(graphRestriction);
      this.sparqlParser.graphPattern = wrapedGraph;
    }
    this.sparqlParser.select[0] = ' DISTINCT ' + emptySkosIdentifier.makeBindings();
    console.log(this.sparqlParser.toString());

    let result = this.sparqlClient.queryByUrlEncodedPost(this.sparqlParser.toString());
    
    return result;
  }

  _parseSearch(bindings: Array<any>) {
    let allSkosIdentifier = bindings;
    this.searchResultChips = [];
    allSkosIdentifier.forEach((skosIdentifierJSON) => {
      let parsed_identifier = JSON.parse(skosIdentifierJSON.SkosIdentifier.value);
      let uniqueIdentifier = new UniqueIdentifier();
      uniqueIdentifier.uri = parsed_identifier.uri;
      uniqueIdentifier.name = parsed_identifier.name;
      this.searchResultChips.push(uniqueIdentifier);
    })
    console.log(this.searchResultChips);
  }

  searchUri(uri: string) {

    this.sparqlParser.clear();
    this.sparqlParser.queryType = QueryType.QUERY;
    this.sparqlParser.prefixes = ThesaurusEntry.requiredPrefixes;

    let thesaurusEntryQuerrier = new ThesaurusEntry();
    this.sparqlParser.graphPattern = thesaurusEntryQuerrier.parseSkeleton();
    this.sparqlParser.select[0] = thesaurusEntryQuerrier.makeBindings();
    this.sparqlParser.graphPattern.merge(thesaurusEntryQuerrier.id.parseRestricter("uri", [uri], thesaurusEntryQuerrier.sparqlIdentifier("id")));
    // this.sparqlParser.order = '?uriSibling';
    console.log(this.sparqlParser.toString());
    let result = this.sparqlClient.queryByUrlEncodedPost(this.sparqlParser.toString());
    // let result = of(1, 2, 3);
    return result;
  }



  // computeChipList() {
  //   this.currentIdentiferChip = Object.create({ id: this.thesaurusEntry.id, selected: true });
  //   this.thesaurusEntry.childs.forEach((child) => { });
  // }




}
