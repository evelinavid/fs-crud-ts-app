import SelectField from './select-field';
import TextField from './text-field';
import brands from '../data/brands';
import models from '../data/models';

export type Values = {
    brand: string,
    model: string,
    price: string,
    year: string,
};
type CarFormProps = {
    values: Values,
    title: string,
    submitBtnText: string,
    onSubmit: (value: Values) => void,
    status: 'create' | 'update',
};
type Fields = {
    brand: SelectField,
    model: SelectField,
    price: TextField,
    year: TextField,
};

class CarForm {
    public htmlElement: HTMLFormElement;

    private props: CarFormProps;

    private fields: Fields;

    private heading: HTMLHeadingElement;

    private container: HTMLDivElement;

    private submitButton: HTMLButtonElement;

    constructor(props: CarFormProps) {
        this.props = props;

        this.htmlElement = document.createElement('form');
        this.container = document.createElement('div');
        this.heading = document.createElement('h3');
        this.submitButton = document.createElement('button');

        this.fields = {
            brand: new SelectField({
                name: 'brand',
                labelText: 'Markė',
                options: brands.map(({ id, title }) => ({ title, value: id })),
            }),
            model: new SelectField({
                name: 'model',
                labelText: 'Modelis',
                options: models.map(({ id, title }) => ({ title, value: id })),
            }),
            price: new TextField({
                name: 'price',
                labelText: 'Kaina',
            }),
            year: new TextField({
                name: 'year',
                labelText: 'Metai',
            }),
        };

        this.initialize();
        this.renderView();
    }

    private initialize = () => {
        this.heading.className = 'text-center';

        const fieldsArr = Object.values(this.fields);
        this.container.className = 'd-flex flex-column gap-2';
        this.container.append(...fieldsArr.map((field) => field.htmlElement));

        this.submitButton.className = 'btn btn-success';
        this.submitButton.type = 'submit';

        this.htmlElement.className = 'card d-flex flex-column gap-3 p-3';

        this.htmlElement.append(
            this.heading,
            this.container,
            this.submitButton,
        );
    };

    private handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const { onSubmit } = this.props;
        const formData = new FormData(this.htmlElement);

        const brand = formData.get('brand') as string | null;
        const model = formData.get('model') as string | null;
        const price = formData.get('price') as string | null;
        const year = formData.get('year') as string | null;

        if (!(brand && model && price && year)) {
            throw new Error('blogi formos duomenys');
        }

        const formValues: Values = {
            brand,
            model,
            price,
            year,
        };

        onSubmit(formValues);
    };

    private applyStatusStyles = () => {
        if (this.props.status === 'create') {
            this.heading.classList.remove('text-warning');
            this.submitButton.classList.remove('btn-warning');
            this.htmlElement.classList.remove('border-warning');

            this.heading.classList.add('text-success');
            this.submitButton.classList.add('btn-success');
            this.htmlElement.classList.add('border-success');
        } else {
            this.heading.classList.remove('text-success');
            this.submitButton.classList.remove('btn-success');
            this.htmlElement.classList.remove('border-success');

            this.heading.classList.add('text-warning');
            this.submitButton.classList.add('btn-warning');
            this.htmlElement.classList.add('border-warning');
        }
    };

    private renderView = () => {
        const { title, values, submitBtnText } = this.props;

        this.heading.innerHTML = title;
        this.submitButton.innerHTML = submitBtnText;
        this.applyStatusStyles();

        const valuesKeyValueArr = Object.entries(values) as [keyof Values, string][];
        valuesKeyValueArr.forEach(([fieldName, fieldValue]) => {
            const field = this.fields[fieldName];
            field.updateProps({
                value: fieldValue,
            });
        });
        this.htmlElement.addEventListener('submit', this.handleSubmit);
    };

    public updateProps = (props: Partial<CarFormProps>) => {
        this.props = {
            ...this.props,
            ...props,
        };
        this.renderView();
    };
}

export default CarForm;
