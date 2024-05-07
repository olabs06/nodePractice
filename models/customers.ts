import {HydratedDocument, Schema, model} from 'mongoose';

interface IOrder {
    description: string,
    amountInKobo?: number
}

interface ICustomer {
    name: string,
    industry?: string,
    orders?: IOrder[]

}

const customerSchema = new Schema<ICustomer>({
    name: {
        type: String,
        required: true
    },
    industry: String,
    orders: [
        {
            description: String,
            amountInKobo: Number
        }
    ]
});

const Customer = model('customers', customerSchema);

const c:HydratedDocument<ICustomer> = new Customer({
    name: 'test',
    industry: 'test',
});

console.log(c.name);

export default Customer