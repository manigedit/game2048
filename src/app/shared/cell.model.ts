import { EventEmitter } from '@angular/core';

export class Cell {
    wasMerged: boolean = false;
    success: EventEmitter<boolean> =  new EventEmitter<boolean>();
    _value: number = null;

    set value (value: number) {
        if (value === 2048) {
            this.success.emit(true);
        }
        this._value = value;
    }

    get value(): number {
        return this._value;
    }

    get isEmpty(): boolean {
        return this.value == null;
    }

    merge(cell: Cell): boolean {
        const val = cell.value;
    if (!val || this.wasMerged || cell.wasMerged) return false;
    if (this.value && this.value !== val) return false;
    if (this.value) {
      this.value += val;
      this.wasMerged = true;
    } else {
      this.value = val;
    }
    cell.value = null;
    return true;

    }

    resetMerged() {
        this.wasMerged = false;
    }

}
