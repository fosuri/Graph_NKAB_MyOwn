const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString} = graphql;


const LandmarkType = new GraphQLObjectType({
  name: "Landmark",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    location: { type: GraphQLString },
    country: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    userId: { type: GraphQLInt },
  }),
});

module.exports = LandmarkType;
