import Factory from '@ioc:Adonis/Lucid/Factory';
import Customer from 'App/Models/Customer';

export const CustomerFactory = Factory.define(Customer, ({ faker}) => {
  return {
    name: faker.name.firstName(),
    phone: faker.phone.phoneNumber(),
    user_id: 1
  }
}).build();
