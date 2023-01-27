import getPropCount from '../helpers/get-prop-count';

type RowData = {
    [key: string]: string,
};

export type TableProps<Type extends RowData> = {
    title: string,
    columns: Type,
    rowsData: Type[],
    editedCarId: string | null,
    onDelete: (id: string) => void,
    onEdit: (id: string) => void,
};

class Table<Type extends RowData> {
    static propsAreValid = <T extends RowData>({ columns, rowsData }: TableProps<T>): boolean => {
        const colCount = getPropCount(columns);

        return rowsData.every((row) => getPropCount(row) === colCount);
    };

    private props: TableProps<Type>;

    private tbody: HTMLTableSectionElement;

    private thead: HTMLTableSectionElement;

    public htmlElement: HTMLTableElement;

    constructor(props: TableProps<Type>) {
        if (!Table.propsAreValid(props)) {
            throw new Error('TableProps are not compatible. Please check columns and rowsData');
        }
        this.props = props;

        this.htmlElement = document.createElement('table');
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.initialize();
        this.renderView();
    }

    private renderHead = () => {
        const { title, columns } = this.props;

        const thElementsString = Object.values(columns)
            .map((columnName) => `<th>${columnName}</th>`)
            .join('');

        const columnCount = thElementsString.length;

        this.thead.className = 'bg-primary text-white';
        this.thead.innerHTML = `
        <tr class="text-center h3">
        <th colspan="${columnCount}">${title}</th>
        </tr>
        <tr>
       ${thElementsString}
       <th></th>
        </tr>
        `;
    };

    private renderBody = () => {
        this.tbody.innerHTML = '';
        const rows = this.props.rowsData
            .map((rowData) => {
                const thisRowIsEdited = this.props.editedCarId === rowData.id;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger';
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', () => this.props.onDelete(rowData.id));

                const updateButton = document.createElement('button');
                updateButton.className = `btn btn-${thisRowIsEdited ? 'secondary' : 'warning'}`;
                updateButton.innerText = 'Update';
                updateButton.innerText = thisRowIsEdited ? 'Cancel' : 'Update';
                const buttonContainer = document.createElement('td');
                buttonContainer.className = 'd-flex justify-content-end gap-2';
                buttonContainer.append(updateButton, deleteButton);
                buttonContainer.addEventListener('click', () => this.props.onEdit(rowData.id));

                const td = document.createElement('td');
                td.append(buttonContainer);

                const tr = document.createElement('tr');
                if (thisRowIsEdited) tr.classList.add('row-active');
                tr.innerHTML = Object.keys(this.props.columns)
                    .map((key) => `<td>${rowData[key]}</td>`)
                    .join('');
                tr.append(td);

                return tr;
            });

        this.tbody.append(...rows);
    };

    private initialize() {
        this.htmlElement.className = 'table table-striped';

        this.htmlElement.append(
            this.tbody,
            this.thead,
        );
    }

    private renderView = () => {
        this.renderBody();
        this.renderHead();
    };

    public updateProps = (props: Partial<TableProps<Type>>) => {
        this.props = {
            ...this.props,
            ...props,
        };
        this.renderView();
    };
}

export default Table;
