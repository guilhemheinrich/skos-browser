import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { concatMap, timeout, catchError, delay } from 'rxjs/operators';

import {GlobalVariables} from 'src/app/configuration';
@Injectable({
  providedIn: 'root'
})
// Follow the https://www.w3.org/TR/sparql11-protocol/
// Format the result to json
export class SparqlClientService {

  public sparqlEndpoint: string;
  public timeout = GlobalVariables.HTTP_TIMEOUT;

  constructor(private http: HttpClient) {

  }

  queryByGet(
      query: string,
      defaultGraphUri?: string | string[], 
      namedGraphUri?: string| string[], 
      options?: {
        headers?: HttpHeaders | {
          [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
          [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      }): Observable<any> {      
      if (options) {
        let finalOptions = options;
        finalOptions["params"] = {
          "query": query,
          "format": 'json'
        };
      } else {
        let finalOptions = {
          "params": {
            "query": query,
            "format": 'json'
          }
      }
      if (defaultGraphUri) {
        finalOptions["params"]["default-graph-uri"] = defaultGraphUri;
      }
      if (namedGraphUri) {
        finalOptions["params"]["named-graph-uri"] = namedGraphUri;
      }
      let results = this.http.get(this.sparqlEndpoint, finalOptions)
      .pipe(timeout(this.timeout));
      return results;
      };
    }

  queryByUrlEncodedPost(
    query: string,
      defaultGraphUri?: string | string[], 
      namedGraphUri?: string| string[], 
      options?: {
        headers?: HttpHeaders | {
          [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
          [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      }): Observable<any> 
  {
    let body = new HttpParams()
    .set('query', query)
    let finalOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
    }
    if (defaultGraphUri) {
      body["default-graph-uri"] = defaultGraphUri;
    }
    if (namedGraphUri) {
      body["named-graph-uri"] = namedGraphUri;
    }

    let results = this.http.post(this.sparqlEndpoint,body.toString(), finalOptions)
    .pipe(timeout(this.timeout));
    return results;
  }

  queryByPost(
    query: string,
      defaultGraphUri?: string | string[], 
      namedGraphUri?: string| string[], 
      options?: {
        headers?: HttpHeaders | {
          [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
          [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      }): Observable<any> 
  {
    let body = new HttpParams()
    .set('query', query)
    let finalOptions = {
      "headers" : {
        "Content-Type" : "application/sparql-query",
        "Accept" : "application/json"
      },
      "params" : {}
    }
    if (defaultGraphUri) {
      finalOptions["params"]["default-graph-uri"] = defaultGraphUri;
    }
    if (namedGraphUri) {
      finalOptions["params"]["named-graph-uri"] = namedGraphUri;
    }
    let results = this.http.post(this.sparqlEndpoint, body.toString(), finalOptions)
    .pipe(timeout(this.timeout));
    return results;
  }
  
  updateByUrlEncodedPost(
    update: string,
    usingGraphUri?: string | string[], 
    usingNamedGraphUri?: string| string[], 
    options?: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe?: 'body';
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }): Observable<any> 
    {
      let body = new HttpParams()
    .set('update', update)

    let finalOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
    }
    
    let results = this.http.post(this.sparqlEndpoint,body.toString(), finalOptions)
    .pipe(timeout(this.timeout));
    return results;
    }
  
  
  
    getSomething(): Observable<any> {
    // let dbpediaUrl = 'https://api.github.com/users';
    let dbpediaUrl = 'http://dbpedia.org/sparql';
    let options = {
      "params": {
        "query": 'select distinct ?Concept where {[] a ?Concept} LIMIT 10',
        "default-graph-uri": 'http://dbpedia.org',
        "format": 'json'
      }
    };
    let results = this.http.get(dbpediaUrl, options)
    .pipe(timeout(this.timeout));
    // console.log(results);
    return results;

  }
}