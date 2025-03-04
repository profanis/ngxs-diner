import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialogModule,
} from '@angular/material/legacy-dialog';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AsyncPipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { AddTableChoice, RemoveTableChoice } from '../../state/actions';
import { OrderViewModel, OrderViewModelQueries } from '../../view-models/order-view-model.queries';

export interface TableViewDialogData {
  tableName: string;
}

@Component({
  selector: 'app-table-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatLegacyDialogModule, NgIf, MatLegacyTableModule, MatLegacyButtonModule, MatIconModule, AsyncPipe],
})
export class OrderViewComponent implements OnInit {
  tableOrder$: Observable<OrderViewModel>;

  constructor(
    private matDialogRef: MatDialogRef<TableViewDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: TableViewDialogData,
    private store: Store
  ) {}

  ngOnInit(): void {
    const { tableName } = this.data;
    this.tableOrder$ = this.store.select(OrderViewModelQueries.createOrderSelectorFor(tableName));
  }

  addChoice(recipeName: string): void {
    this.store.dispatch(new AddTableChoice(this.data.tableName, recipeName));
  }

  removeChoice(recipeName: string): void {
    this.store.dispatch(new RemoveTableChoice(this.data.tableName, recipeName));
  }
}
