export class DataStored<T> {
  constructor(
    private _data: T[],
    private _lastUpdate: Date | null,
  ) {}

  get data(): T[] {
    return this._data;
  }

  get lastUpdate(): Date | null {
    return this._lastUpdate;
  }

  set data(data: T[]) {
    this._data = data;
  }

  set lastUpdate(lastUpdate: Date | null) {
    this._lastUpdate = lastUpdate;
  }

  updateData(data: T[]) {
    this._data = data;
  }

  updateEntity(entity: T, id: number | string, fieldNameForLocation = 'id') {
    this._data.map((el: any) => {
      if (el[fieldNameForLocation] === id) el = entity;
    });
  }
}

export class ItemStored<T> {
  constructor(
    private _data: T,
    private _lastUpdate: Date | null,
  ) {}

  get data(): T {
    return this._data;
  }

  get lastUpdate(): Date | null {
    return this._lastUpdate;
  }

  set data(data: T) {
    this._data = data;
  }

  set lastUpdate(lastUpdate: Date | null) {
    this.lastUpdate = lastUpdate;
  }
}
