const { buildSchema,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean } = require('graphql')

const axios = require('axios')

// PART: Harcoded data
const fakeCustomer = [
    { id: '1', name: 'Kretek Filters', email: 'kretek@gmail.com', age: 15 },
    { id: '2', name: 'Deka Crepers', email: 'deka@gmail.com', age: 23 },
    { id: '3', name: 'Pendidikan Jasmani', email: 'jasmani@gmail.com', age: 21 },
]

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
})

const todoType = new GraphQLObjectType({
    name: 'Todo',
    fields: () => ({
        userId: { type: GraphQLInt },
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        completed: { type: GraphQLBoolean }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        website: { type: GraphQLString },
        todos: {
            type: new GraphQLList(todoType),
            resolve(parentValue, args) {
                return axios.get(`https://jsonplaceholder.typicode.com/todos?userId=` + parentValue.id)
                    .then(res => res.data)
            }
        }
    })
})

// PART: Root Query
const rootQuery = new GraphQLObjectType({
    name: 'rootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                for (let i = 0; i < fakeCustomer.length; i++) {
                    if (fakeCustomer[i].id == args.id) {
                        return fakeCustomer[i]
                    }
                }
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return fakeCustomer
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get('https://jsonplaceholder.typicode.com/users').then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: rootQuery
})