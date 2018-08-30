import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datatable-test',
  templateUrl: './datatable-test.component.html',
  styleUrls: ['./datatable-test.component.css']
})
export class DatatableTestComponent {

  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
  constructor() { }

  ngOnInit() {

    this.loadDatatable();
  }


  loadDatatable() {
    // $('#dttest').DataTable({
    //   scrollY: '50vh',
    //   scrollCollapse: true,
    //   paging: false
    // });
  }
}
