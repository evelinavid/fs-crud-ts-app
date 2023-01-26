export type Option = {
    label: string,
    value: string
};

export type CheckboxGroupFieldProps = {
    labelText: string,
    name: string,
    options: Option[],
    selected?: Option[],
};
class CheckboxGroupField {
    private static count: number = 0;

    private id: string;

    private props: CheckboxGroupFieldProps;

    private label: HTMLLabelElement;

    private optionsContainer: HTMLDivElement;

    public htmlElement: HTMLDivElement;

    constructor(props: CheckboxGroupFieldProps) {
        CheckboxGroupField.count += 1;
        this.id = `CheckboxGroupField_${CheckboxGroupField.count}`;
        this.props = props;
        this.htmlElement = document.createElement('div');
        this.label = document.createElement('label');
        this.optionsContainer = document.createElement('div');

        this.initialize();
        this.renderView();
    }

    initialize = () => {
        this.label.htmlFor = this.id;
        this.label.className = 'form-label';

        this.htmlElement.append(
            this.label,
            this.optionsContainer,
        );
    };

    renderView = () => {
        this.label.innerText = this.props.labelText;

        this.optionsContainer.innerHTML = this.props.options
            .map(({ label, value }) => {
                const optionId = `${this.id}_${value}`;

                return `
        <div class="form-check">
        <input 
        type="checkbox"
         class="form-check-input"
          id="${optionId}"
           value="${value}"
            name="${this.props.name}"
            >
        <label class="form-check-label" for="${optionId}">${label}</label>
      </div>`;
            })
            .join(' ');
    };

    updateProps = (props: Partial<CheckboxGroupFieldProps>) => {
        this.props = {
            ...this.props,
            ...props,
        };
        this.renderView();
    };
}

export default CheckboxGroupField;
