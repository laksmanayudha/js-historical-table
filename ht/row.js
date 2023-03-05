class Row {
    constructor(tableContext, data) {
        // initiate
        this.tableContext = tableContext;
        this.data = data;
        this.next = null;
        this.prev = null;

        // binding method
        this.insertNext = this.insertNext.bind(this);
        this.insertPrev = this.insertPrev.bind(this);
        this.remove = this.remove.bind(this);
        this.render = this.render.bind(this);
        this.createView = this.createView.bind(this);
        this.mapNext = this.mapNext.bind(this);
        this.mapPrev = this.mapPrev.bind(this);
        this.mapRemove = this.mapRemove.bind(this);
        this.recalculate = this.recalculate.bind(this);
        this.syncView = this.syncView.bind(this);
        this.syncData = this.syncData.bind(this);
        this.generateInputAttribute = this.generateInputAttribute.bind(this);
        this.beforeRender = this.beforeRender.bind(this);
        this.onChange = this.onChange.bind(this);

        // UI setting
        this.view = this.createView();
    }

    insertNext(newRow) {
        if (this.next == null) {
            this.next = newRow;
            newRow.prev = this;
            this.tableContext.tail = newRow;
        } else {
            let tempRow = this.next;
            this.next = newRow;
            newRow.next = tempRow;
            newRow.prev = this;
            tempRow.prev = newRow;
        }
        this.tableContext.draw();
    }

    insertPrev(newRow) {
        if (this.prev == null) {
            this.prev = newRow;
            newRow.next = this;
            this.tableContext.head = newRow;
        } else {
            let tempRow = this.prev;
            this.prev = newRow;
            newRow.prev = tempRow;
            newRow.next = this;
            tempRow.next = newRow;
        }
        this.tableContext.draw();
    }

    remove() {
        if (this.next == null && this.prev == null) {
            this.tableContext.head = null;
            this.tableContext.tail = null;
        } else if (this.next == null) {
            this.prev.next = null;
            this.tableContext.tail = this.prev;
        } else if (this.prev == null) {
            this.next.prev = null;
            this.tableContext.head = this.next;
        } else {
            let tempNext = this.next;
            let tempPrev = this.prev;
            tempNext.prev = tempPrev;
            tempPrev.next = tempNext;
        }
        this.tableContext.draw();
    }

    render() {
        this.tableContext.render(this);
    }

    createView() {
        const row = TableView.createRow();
        // delete button
        const delBtn = TableView.createButton('-', {
            class: 'btn btn-danger w-100',
            onclick: () => {
                this.mapRemove();
                this.remove();
            }
        });
        row.appendChild(TableView.createColumn(delBtn));
        this.tableContext.columnSettings.forEach(({ input, key }) => {
            let inputElement = null;
            if (input.type == 'select') {
                let options = input.options;
                let attr = {
                    ...this.generateInputAttribute(input, key), 
                    class: 'custom-select'
                };
                inputElement = TableView.createSelect(options, attr);
                inputElement = TableView.setDefaultValue(inputElement, this.data[key]);
            } else {
                let attr = {
                    ...this.generateInputAttribute(input, key), 
                    class: 'form-control'
                };
                inputElement = TableView.createInput(attr);
                inputElement = TableView.setDefaultValue(inputElement, this.data[key]);
            }
            const col = TableView.createColumn(inputElement);

            row.appendChild(col);
        });
        const addBtn = TableView.createButton('+', {
            class: 'btn btn-success w-100',
            onclick: () => {
                let newData = {
                    ...this.data,
                    ...this.mapPrev(), 
                    [this.tableContext.unique]: `[${this.tableContext.unique}]`
                };
                this.insertPrev(new Row(this.tableContext, newData));
            }
        });
        row.appendChild(TableView.createColumn(addBtn));
        return row;
    }

    mapRemove() {
        if (this.next && this.prev) {
            this.tableContext.relations.forEach(({ current, toNext }) => {
                this.next.data[toNext] = this.prev.data[current];
            });
        }
    }

    mapNext() {
        let newData = {};
        if (!this.next) {
            let prevData = this.data;
            this.tableContext.relations.forEach(({ current, toNext }) => {
                newData[toNext] = prevData[current];
            });
        } else {
            newData = { ...this.data };
            let prevData = this.data;
            let nextData = this.next.data;
            this.tableContext.relations.forEach(({ current, toNext }) => {
                newData[toNext] = prevData[current];
                newData[current] = nextData[toNext];
            });
        }
        return newData;
    }

    mapPrev() {
        let newData = {};
        if (!this.prev) {
            let nextData = this.data;
            this.tableContext.relations.forEach(({ current, toNext }) => {
                newData[current] = nextData[toNext];
            });
        } else {
            newData = { ...this.data };
            let nextData = this.data;
            let prevData = this.prev.data;
            this.tableContext.relations.forEach(({ current, toNext }) => {
                newData[toNext] = prevData[current];
                newData[current] = nextData[toNext];
            });
        }
        return newData;
    }

    recalculate() {
        const next = this.next;
        const cur = this;
        const prev = this.prev;
        this.tableContext.recalculate({prev, cur, next});
    }

    syncView() {
        this.view = this.createView();
    }

    syncData() {
        const next = this.next;
        const cur = this;
        const prev = this.prev;
        if (!this.tableContext.isFirstRender) {
            this.tableContext.relations.forEach(({ current, toNext }) => {
                if (prev !== null) {
                    // console.log(cur.data[toNext], '=>', prev.data[current]);
                    cur.data[toNext] = prev.data[current];
                }
            });
        }
    }

    generateInputAttribute(
        input,
        key,
        notInclude = [
            'options',
            'validation',
            'onchange',
            'dataType'
        ]
    ) {
        let attr = {};
        for (let prop in input) {
            if (notInclude.includes(prop)) continue;

            if (typeof input[prop] === 'function') {
                let func = input[prop];
                attr[prop] = func(this.data);
            } else {
                attr[prop] = input[prop];
            }
        }

        // insert inside custom attribute
        attr =  {
            ...attr, 
            'data-key': key,
            onchange: (e) => {
                if (input.onchange) input.onchange(e);
                this.onChange(e, input.validation, input.dataType)
            },
        }

        return attr;
    }

    beforeRender() {
        const first = this.tableContext.first();
        if (this === first) {
            this.tableContext.relations.forEach(({ current, toNext }) => {
                this.view.querySelector(`[data-key="${toNext}"]`).removeAttribute('readonly');
                this.view.querySelector(`[data-key="${toNext}"]`).removeAttribute('disabled');
            });
            return;
        }

        this.tableContext.relations.forEach(({ current, toNext }) => {
            let attr = this.tableContext.columnSettings.find((setting) => setting.key === toNext).input;
            if (attr.readonly) {
                this.view.querySelector(`[data-key="${toNext}"]`).setAttribute('readonly', '');
            }

            if (attr.disabled) {
                this.view.querySelector(`[data-key="${toNext}"]`).setAttribute('disabled', '');
            }
        });
    }

    onChange(e, validation, dataType) {
        const key = e.target.getAttribute('data-key');
        const next = this.next;
        const cur = this;
        const prev = this.prev;
        let targetValue = dataType === 'number' ? Number(e.target.value) : e.target.value;
        
        // update current data
        let newValue = validation !== undefined
                        ? validation({ targetValue, prev, cur, next, data: this.tableContext.histories }) 
                        : targetValue;
                        
        cur.data[key] = newValue;
        this.tableContext.draw();
    }
}