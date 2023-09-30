import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs/operators';
import { OrdersMap, Table } from '../models';
import { TablesApiService } from '../services/tables-api.service';
import { AddTableChoice, CancelReservation, LoadTables, RemoveTableChoice, ReserveTable } from './actions';
export interface TablesStateModel {
  items: Table[];
  orders: OrdersMap;
}

@State<TablesStateModel>({
  name: 'tables',
  defaults: {
    items: [],
    orders: {},
  },
})
@Injectable()
export class TablesState implements NgxsOnInit {
  constructor(private api: TablesApiService) {}

  ngxsOnInit(ctx?: StateContext<TablesStateModel>): void {
    ctx.dispatch(new LoadTables());
  }

  @Action(LoadTables)
  protected async loadTables(ctx: StateContext<TablesStateModel>, action: LoadTables) {
    return this.api.loadTables().pipe(tap(data => ctx.patchState({ items: data })));
  }

  @Action(ReserveTable)
  protected reserveTable(ctx: StateContext<TablesStateModel>, action: ReserveTable): void {
    const { tableName } = action;

    ctx.patchState({
      orders: {
        ...ctx.getState().orders,
        [tableName]: { tableName, choices: [] },
      },
    });
  }

  @Action(CancelReservation)
  protected cancelReservation(ctx: StateContext<TablesStateModel>, action: CancelReservation): void {
    const { tableName } = action;

    ctx.patchState({
      orders: {
        ...ctx.getState().orders,
        [tableName]: null,
      },
    });
  }

  @Action(AddTableChoice)
  protected addTableChoice(ctx: StateContext<TablesStateModel>, action: AddTableChoice): void {
    const { tableName, choice } = action;

    ctx.patchState({
      orders: {
        ...ctx.getState().orders,
        [tableName]: {
          ...ctx.getState().orders[tableName],
          choices: [...ctx.getState().orders[tableName].choices, choice],
        },
      },
    });
  }

  @Action(RemoveTableChoice)
  protected removeTableChoice(ctx: StateContext<TablesStateModel>, action: RemoveTableChoice): void {
    const { tableName, choice } = action;

    ctx.patchState({
      orders: {
        ...ctx.getState().orders,
        [tableName]: {
          ...ctx.getState().orders[tableName],
          choices: ctx.getState().orders[tableName].choices.filter(item => item !== choice),
        },
      },
    });
  }
}
