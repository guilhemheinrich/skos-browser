import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datatable-test',
  templateUrl: './datatable-test.component.html',
  styleUrls: ['./datatable-test.component.css']
})
export class DatatableTestComponent {

  constructor() { }

  ngOnInit() {

    this.loadDatatable();
  }


  loadDatatable() {
    $(document).ready(function () {
      $('#example').DataTable({
        scrollY: '50vh',
        scrollCollapse: true,
        paging: false
      });
    });
  }
}
