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
      this.histories = histories;
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

  insertAt(index, newRow) {
      if (this.head == null) { // insert when empty linked list
          this.head = newRow;
          this.tail = newRow;
      } else {
          let row = this.head;
          if (index == 0) { // insert to the first, but not empty linked list
              newRow.next = row;
              row.prev = newRow;
              this.head = newRow;
          } else if (index == this.len) { // insert to last index
              newRow.prev = row;
              row.next = newRow;
              this.tail = newRow;
          } else { // insert in the middle
              while (--index) {
                  if (row.next != null) row = row.next;
                  else throw Error("Index Out of Bound");
              }
              let tempRow = row.next;
              row.next = newRow;
              newRow.next = tempRow;
              newRow.prev = row;
              tempRow.prev = newRow;
          }
      }
      this.draw();
  }

  removeAt(index) {
      let row = this.head;
      let tail = this.tail;
      if (index == 0) {
          if (row != null) {
              row = row.next;
              this.head = row;
              this.head.prev = null;
          } else throw Error("Index Out of Bound");
      } else if (index == this.len) {
          if (tail != null) {
              tail = tail.prev;
              this.tail = tail;
              this.tail.next = null;
          } else throw Error("Index Out of Bound");
      } else {
          while (--index) {
              if (row.next != null) row = row.next;
              else throw ("Index Out of Bound");
          }

          let tempRow = row.next.next;
          row.next = tempRow;
          tempRow.prev = row;
      }
      this.draw();
  }

  render(row) {
      row.recalculate();
      row.syncViewData();
      row.beforeRender();
      this.table.appendChild(row.view);
  }

  renderHeader() {
      const row = TableView.createRow();
      row.appendChild(TableView.createColumn('Hapus', 'th'));
      this.columnSettings.forEach(({ title }) => {
          const header = TableView.createColumn(title, 'th');
          row.appendChild(header);
      });
      row.appendChild(TableView.createColumn('Tambah', 'th'));
      this.table.appendChild(row);
  }

  renderTemplate() {
      const row = TableView.createRow();
      // delete button
      const delBtn = TableView.createButton('-', {
          class: 'btn btn-danger w-100',
      });
      row.appendChild(TableView.createColumn(delBtn));
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
          row.appendChild(col);
      });
      const addBtn = TableView.createButton('+', {
          class: 'btn btn-success w-100',
          onclick: () => {
              let newData = {[this.unique]: `[${this.unique}]`}
              if (this.head !== null) newData = { ...newData, ...this.head.mapPrev() };
              this.insertAt(0, new Row(this, newData));
          }
      });
      row.appendChild(TableView.createColumn(addBtn));
      this.table.appendChild(row);
  }

  draw() {
      // reset view, new data, len
      let tempData = [];
      this.len = 0;
      this.table.innerHTML = '';

      // draw or redraw header and template row
      this.renderHeader();
      this.renderTemplate();

      // draw or redraw histories data rows
      let row = this.head;
      if (row == null) return;
      do {
          tempData = row.data ? [...tempData, row.data] : tempData;
          this.render(row);
          this.increaseLen();
          row = row.next;
      } while (row);

      this.setData(tempData);
      this.afterDraw();

      // determine first render action
      if (this.isFirstRender) this.isFirstRender = false;
  }

  afterDraw() {
      // console.log(this.getData());
  }
}