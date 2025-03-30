const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt} = graphql;

const RatingType = new GraphQLObjectType({
  name: "Rating",
  fields: () => ({
    id: { type: GraphQLInt },
    rating: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    landmarkId: { type: GraphQLInt },
  }),
});

module.exports = RatingType;
