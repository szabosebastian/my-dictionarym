import { Injectable } from '@angular/core';
import { map, Observable, take, tap } from "rxjs";
import { Dictionary, Workbook } from "../model/workbook";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { setWorkbook } from "../../state/workbook/workbook.actions";
import { v4 as uuid } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  viewModel$?: Observable<Workbook>;

  constructor(
    private store: Store
  ) {
    this.viewModel$ = this.store.select(selectWorkbook);
  }

  addDictionary(newDictionary: Dictionary) {
    newDictionary.id = uuid();

    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithAddedDictionary(workbook, newDictionary)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithAddedDictionary(workbook: Workbook, newDictionary: Dictionary): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries, newDictionary],
    };
  }

  deleteDictionary(id: string) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithRemovedDictionary(workbook, id)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithRemovedDictionary(workbook: Workbook, dictionaryIdToDelete: string): Workbook {
    return {
      ...workbook,
      dictionaries: workbook.dictionaries.filter((dictionary) => dictionary.id !== dictionaryIdToDelete)
    };
  }
}
