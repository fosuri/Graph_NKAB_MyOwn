const connectToDB = require('./config/createtables')
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const userSchema = require("./schemas/userScheme");
const landmarkSchema = require("./schemas/landmarkScheme");
const photoSchema = require("./schemas/photoScheme");
const ratingSchema = require("./schemas/ratingScheme");
const app = express();
const { mergeSchemas } = require("@graphql-tools/schema");

require("dotenv").config();
const { authMiddleware } = require("./middleware/middleware");




const schema = mergeSchemas({
  schemas: [userSchema, landmarkSchema, photoSchema, ratingSchema],
  // schemas: [userSchema, landmarkSchema],
});


app.use(
  "/graphql",
  graphqlHTTP((req) => {
    const context = authMiddleware(req); 
    return {
      schema: schema,
      graphiql: {
        headerEditorEnabled: true,
      },
      context: context, 
    };
  })
);


app.listen(3000, () => {
  console.log("Server running");
  connectToDB();
});
//http://localhost:3000/graphql