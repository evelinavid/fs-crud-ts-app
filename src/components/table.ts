import getPropCount from '../helpers/get-prop-count';

type RowData = {
    [key: string]: string,
};

export type TableProps<Type extends RowData> = {
    title: string,
    columns: Type,
    rowsData: Type[],
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
        console.log(this.props);
    }

    initializeHead = () => {
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
        </tr>
        `;
    };

    initializeBody = () => {
        const trsHtmlStr = this.props.rowsData
            .map((rowData) => {
                const tdsHtmlString = Object.keys(this.props.columns)
                    .map((key) => `<td>${rowData[key]}</td>`)
                    .join('');

                return `<tr>${tdsHtmlString}</tr>`;
            })
            .join('');

        this.tbody.innerHTML = trsHtmlStr;
    };

    initialize() {
        this.initializeBody();
        this.initializeHead();

        this.htmlElement.className = 'table table-striped';

        this.htmlElement.append(
            this.tbody,
            this.thead,
        );
    }
}

export default Table;
