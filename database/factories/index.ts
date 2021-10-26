import Factory from '@ioc:Adonis/Lucid/Factory';
import Customer from 'App/Models/Customer';
import Item from 'App/Models/Item';

export const CustomerFactory = Factory.define(Customer, ({ faker}) => {
  return {
    name: faker.name.firstName(),
    phone: faker.phone.phoneNumber(),
    user_id: 1
  }
}).build();

export const ItemFactory = Factory.define(Item, ({ faker}) => {
  return {
  name: faker.commerce.productName(),
  }
}).build();
