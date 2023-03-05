class TableView {
    // elements
    static createRow(type = 'tr') {
        return document.createElement(type);
    }

    static createColumn(html = '', type = 'td') {
        let col = document.createElement(type);
        col = TableView.fill(col, html);
        return col;
    }

    static createInput(attributes = {}) {
        let input = document.createElement('input');
        input = TableView.setAttributes(input, attributes);
        return input;
    }

    static createSelect(options = [], attributes = {}) {
        // options, list of object, options =  [{ html, value }]
        let select = document.createElement('select');
        select = TableView.setAttributes(select, attributes);

        // options
        options.forEach(({ title, value }) => {
            let opt = document.createElement('option');
            opt = TableView.setAttributes(opt, { value });
            opt = TableView.fill(opt, title);
            select.appendChild(opt);
        });

        return select;
    }

    static createButton(html = '', attributes = {}) {
        let button = document.createElement('button');
        button = TableView.fill(button, html);
        button = TableView.setAttributes(button, attributes);
        return button;
    }

    static setAttributes(element, attributes) {
        for (let attr in attributes) {
            if (typeof attributes[attr] == 'boolean') {
                if (attributes[attr]) element.setAttribute(attr, attributes[attr]);
                continue;
            }
            if (typeof attributes[attr] == 'function') {
                element[attr] = attributes[attr];
                continue;
            }
            element.setAttribute(attr, attributes[attr]);
        }

        return element;
    }

    static fill(element, html) {
        if (typeof html === 'string') element.innerHTML = html;
        if (html instanceof HTMLElement) element.appendChild(html);
        return element;
    }

    static setDefaultValue(element, value) {
        if (element.tagName == 'SELECT') {
            for (let opt of element.options) {
                opt.selected = opt.value == value;
            }
        }
        if (element.tagName == 'INPUT') {
            if (element.type == 'datetime-local') {
                value = value !== undefined ? dayjs(value).format('YYYY-MM-DDTHH:mm:ss') : '';
            } else {
                value = value !== undefined ? value : '';
            }
            element.value = value;
        }
        return element;
    }

}