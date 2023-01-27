 type Option = {
    value: string,
    title: string,
};
export type SelectFielProps = {
    name?: string,
    labelText: string,
    options: Option[],
    onChange?: (value: string) => void;
    value?: string,
};

class SelectField {
    private static count = 0;

    private props: SelectFielProps;

    private select: HTMLSelectElement;

    private label: HTMLLabelElement;

    public htmlElement: HTMLDivElement;

    constructor(props: SelectFielProps) {
        SelectField.count += 1;
        this.htmlElement = document.createElement('div');
        this.select = document.createElement('select');
        this.label = document.createElement('label');
        this.props = props;

        this.initialize();
        this.renderView();
    }

    private initialize = () => {
        const elementId = `select-${SelectField.count}`;
        this.label.htmlFor = elementId;
        this.select.className = 'form-select';
        this.select.id = elementId;

        this.htmlElement.className = 'form-group';

        this.htmlElement.append(
            this.select,
            this.label,
        );

        // this.htmlElement.innerHTML = this.props.options
        //     .map(({ value, text }) => `<option value="${value}">${text}</option>`)
        //     .join('');
    };

    private renderSelectOptionsView = () => {
        const { options, value } = this.props;

        const optionsHtmlElements = options
        .map((option) => {
            const element = document.createElement('option');
            element.innerHTML = option.title;
            element.value = option.value;
            element.selected = option.value === value;

            return element;
        });
        this.select.innerHTML = '';
        this.select.append(...optionsHtmlElements);
    };

    private renderView = () => {
        const { labelText, onChange, name } = this.props;

        this.label.innerHTML = labelText;
        if (onChange) {
            this.select.addEventListener(
                'change',
                () => onChange(this.select.value),
            );
        }
        if (name) {
            this.select.name = name;
        }
        this.renderSelectOptionsView();
    };

    public updateProps = (props:Partial<SelectFielProps>) => {
        this.props = {
            ...this.props,
            ...props,
        };
        this.renderView();
    };
}

export default SelectField;
