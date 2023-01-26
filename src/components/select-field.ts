export type Option = {
    value:string,
    text:string,
};
type SelectFielProps = {
    options:Option[],
    onChange:(value:string)=> void;
};

class SelectField {
    private props: SelectFielProps;

    public htmlElement: HTMLSelectElement;

constructor(props: SelectFielProps) {
    this.htmlElement = document.createElement('select');
    this.props = props;
    this.initialize();
}

initialize = () => {
 this.htmlElement.className = 'form-select';
    this.htmlElement.innerHTML = this.props.options
    .map(({ value, text }) => `<option value="${value}">${text}</option>`)
    .join('');

    this.htmlElement.addEventListener('change',
     () => this.props.onChange(this.htmlElement.value));
};
}

export default SelectField;
