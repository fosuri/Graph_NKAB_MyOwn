const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;

const PhotoType = new GraphQLObjectType({
  name: "Photo",
  fields: () => ({
    id: { type: GraphQLInt },
    url: { type: GraphQLString },
    description: { type: GraphQLString },
    userId: { type: GraphQLInt },
    landmarkId: { type: GraphQLInt },
  }),
});

module.exports = PhotoType;
