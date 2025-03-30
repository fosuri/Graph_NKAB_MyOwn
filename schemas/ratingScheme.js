const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;
const sequelize = require("../config/database"); 
const RatingType = require("./TypeDefs/ratingType");
const LandmarkType = require("./TypeDefs/landmarkType");
const Rating = require("../models/rating");
const Landmark = require("../models/landmark");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    avgRating: {
      type: GraphQLString,
      args: { landmarkId: { type: GraphQLInt } },
      async resolve(parent, args) {
        const landmark = await Landmark.findByPk(args.landmarkId);
        if (!landmark) {
          throw new Error("No landmark with provided id");
        }

        const result = await Rating.findOne({
          attributes: [
            [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
          ],
          where: { landmarkId: args.landmarkId },
          raw: true,
        });

        const avgRating = result.avgRating
          ? parseFloat(result.avgRating).toFixed(2)
          : "0.00";

        return `Avg rating for ${landmark.name}: ${avgRating}`;
      },
    },

    landmarksAboveRating: {
      type: new GraphQLList(LandmarkType), 
      args: { minRating: { type: GraphQLInt } },
      async resolve(parent, args) {
        const results = await Landmark.findAll({
          attributes: [
            "id",
            "name",
            "description",
            "location",
            "country",
            "imageURL",
            "userId",
          ],
          include: [
            {
              model: Rating,
              as: "ratings",
              attributes: [],
            },
          ],
          group: ["Landmark.id"],
          having: sequelize.literal(`AVG(ratings.rating) > ${args.minRating}`),
          raw: true,
        });

        return results.map((landmark) => ({
          ...landmark,
          avgRating: parseFloat(landmark.avgRating).toFixed(2), 
        }));
      },
    },
  },
});






const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addRating: {
      type: RatingType,
      args: {
        rating: { type: GraphQLInt },
        userId: { type: GraphQLInt },
        landmarkId: { type: GraphQLInt },
      },
      resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        if (args.rating < 1 || args.rating > 5) {
          throw new Error("Rating must be between 1 and 5!");
        }

        return Rating.create({
          rating: args.rating,
          landmarkId: args.landmarkId,
          userId: context.userId,
        }).catch((err) => {
          throw new Error("ERROR while adding rating! " + err);
        });
      },
    },

    updateRating: {
      type: RatingType,
      args: {
        id: { type: GraphQLInt },
        rating: { type: GraphQLInt },
      },
      async resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        const rating = await Rating.findOne({ where: { id: args.id } });
        if (!rating) {
          throw new Error("Rating not found with the provided ID!");
        }

        if (rating.userId !== context.userId) {
          throw new Error("You can only modify your own ratings!");
        }

        await Rating.update(
          {
            rating: args.rating,
          },
          {
            where: { id: args.id },
          }
        ).catch((err) => {
          throw new Error("ERROR while updating rating! " + err);
        });

        return rating;
      },
    },

    deleteRating: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLInt },
      },

      async resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        const rating = await Rating.findOne({ where: { id: args.id } });
        if (!rating) {
          throw new Error("Rating not found with the provided ID!");
        }

        if (rating.userId !== context.userId) {
          throw new Error("You can only delete your own ratings!");
        }

        await Rating.destroy({
          where: { id: args.id },
        }).catch((err) => {
          throw new Error("ERROR while deleting rating! " + err);
        });

        return "Rating successfully deleted!";
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
