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

    private container: HTMLDivElement;

    private heading: HTMLHeadingElement;

    private submitButton: HTMLButtonElement;

    constructor(props: CarFormProps) {
        this.props = props;

        this.htmlElement = document.createElement('form');
        this.container = document.createElement('div');
        this.heading = document.createElement('h3');
        this.submitButton = document.createElement('button');

        this.fields = {
            brand: new SelectField({
                labelText: 'Markė',
                name: 'brand',
                options: brands.map(({ id, title }) => ({ title, value: id })),
            }),
            model: new SelectField({
                labelText: 'Modelis',
                name: 'model',
                options: models.map(({ id, title }) => ({ title, value: id })),
            }),
            price: new TextField({
                labelText: 'Kaina',
                name: 'price',
            }),
            year: new TextField({
                labelText: 'Metai',
                name: 'year',
            }),
        };

        this.initialize();
        this.renderView();
    }

    private initialize = () => {
        this.heading.className = 'text-center text-success';

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

    renderView = () => {
        const { title, values, submitBtnText } = this.props;

        this.heading.innerHTML = title;
        this.submitButton.innerHTML = submitBtnText;

        const valuesKeyValueArr = Object.entries(values) as [keyof Values, string][];
        valuesKeyValueArr.forEach(([fieldName, fieldValue]) => {
            const field = this.fields[fieldName];
            field.updateProps({
                value: fieldValue,
            });
        });
        this.htmlElement.addEventListener('submit', this.handleSubmit);
    };

    updateProps = (props: Partial<CarFormProps>) => {
        this.props = {
            ...this.props,
            ...props,
        };
        this.renderView();
    };
}

export default CarForm;
