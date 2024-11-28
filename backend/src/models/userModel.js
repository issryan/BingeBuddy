const dynamoDb = require('../utils/db');

const User = {
    register: async (user) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Item: user,
        };
        await dynamoDb.put(params).promise();
        return user;
    },

    findByEmail: async (email) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email },
        };

        // Debugging: Log the params to confirm correctness
        console.log("DynamoDB Query Params:", params);

        const result = await dynamoDb.get(params).promise();

        // Debugging: Log the result to see if a user is found
        console.log("DynamoDB Query Result:", result);

        return result.Item; // If no user is found, this will be undefined
    },
};

module.exports = User;