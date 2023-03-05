class Historical {
    constructor({
        table = '',
        unique = '',
        histories = [],
        columnSettings = [],
        relations = [],
        recalculate = () => {},
        head = null,
        tail = null
    }) {
        // initiate
        this.table = document.querySelector(table);
        this.unique = unique;
        this.histories = histories.reverse();
        this.columnSettings = columnSettings;
        this.relations = relations;
        this.recalculate = recalculate;
        this.head = head;
        this.tail = tail;
        this.view = this.table;
        this.len = 0;
        this.isFirstRender = true;

        // binding method
        this.first = this.first.bind(this);
        this.last = this.last.bind(this);
        this.linked = this.linked.bind(this);
        this.increaseLen = this.increaseLen.bind(this);
        this.decreaseLen = this.decreaseLen.bind(this);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.appendHistory = this.appendHistory.bind(this);
        this.render = this.render.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.draw = this.draw.bind(this);
        this.afterDraw = this.afterDraw.bind(this);

        this.linked();
    }

    first() {
        return this.head;
    }

    last() {
        return this.tail;
    }

    increaseLen() {
        this.len += 1;
    }

    decreaseLen() {
        this.len -= 1;
    }

    linked() {
        this.histories.forEach((history) => {
            const row = new Row(this, history)
            this.appendHistory(row);
        });
    }

    setData(data) {
        this.histories = data;
    }

    getData() {
        return this.histories;
    }

    appendHistory(newRow) {
        let row = this.head;
        if (row == null) {
            this.head = newRow;
            this.tail = newRow;
            return;
        }

        row = this.tail;
        newRow.prev = row;
        row.next = newRow;
        this.tail = newRow;
    }

    render(row) {
        row.recalculate();
        if (row.next) row.next.syncData();
        row.syncView();
        row.beforeRender();
        this.table.prepend(row.view);
    }

    renderHeader() {
        const row = TableView.createRow();
        row.append(TableView.createColumn('Hapus', 'th'));
        this.columnSettings.forEach(({ title }) => {
            const header = TableView.createColumn(title, 'th');
            row.append(header);
        });
        row.append(TableView.createColumn('Tambah', 'th'));
        this.table.prepend(row);
    }

    renderTemplate() {
        const row = TableView.createRow();
        // delete button
        const delBtn = TableView.createButton('-', {
            class: 'btn btn-danger w-100',
        });
        row.append(TableView.createColumn(delBtn));
        this.columnSettings.forEach(({ input }) => {
            let inputElement = null;
            if (input.type == 'select') {
                let attr = { ...input, class: 'custom-select' };
                delete attr.options;
                inputElement = TableView.createSelect([], attr);
                inputElement = TableView.setDefaultValue(inputElement, '');
            } else {
                let attr = { ...input, class: 'form-control' };
                inputElement = TableView.createInput(attr);
                inputElement = TableView.setDefaultValue(inputElement, '');
            }
            const col = TableView.createColumn(inputElement);
            row.append(col);
        });
        const addBtn = TableView.createButton('+', {
            class: 'btn btn-success w-100',
            onclick: () => {
                let newData = {
                    ...this.tail.data,
                    ...this.tail.mapNext(), 
                    [this.unique]: `[${this.unique}]`
                }
                this.tail.insertNext(new Row(this, newData));
            }
        });
        row.append(TableView.createColumn(addBtn));
        this.table.prepend(row);
    }

    draw() {
        // reset view, new data, len
        let tempData = [];
        this.len = 0;
        this.table.innerHTML = '';


        if (this.tail == null && this.head == null) return;
        
        let row = this.head
        do { // recalculate, sync, rerender rows
            tempData = row.data ? [...tempData, row.data] : tempData;
            this.render(row);
            this.increaseLen();
            row = row.next;
        }while(row);

        // redraw header and template row
        this.renderTemplate();
        this.renderHeader();

        this.setData(tempData);
        this.afterDraw();

        if (this.isFirstRender) this.isFirstRender = false; // determine first render action
    }

    afterDraw() {
        console.log(this.getData());
    }
}