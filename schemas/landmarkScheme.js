const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;
const LandmarkType = require("./TypeDefs/landmarkType");
const Landmark = require("../models/landmark");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Landmarks: {
      type: new GraphQLList(LandmarkType),
      resolve(parent, args) {
        return Landmark.findAll();
      },
    },

    landmark: {
      type: LandmarkType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return Landmark.findOne({ where: { id: args.id } }).then((landmark) => {
          if (!landmark) {
            throw new Error(
              "Landmark not found with the provided ID!"
            );
          }
          return landmark;
        });
      },
    },

    landmarkByCountry: {
      type: LandmarkType,
      args: { country: { type: GraphQLString } },
      resolve(parent, args) {
        return Landmark.findOne({ where: { country: args.country } }).then(
          (landmark) => {
            if (!landmark) {
              throw new Error(
                "Landmark not found with the provided country - " + '[ '+ args.country +' ]!'
              );
            }
            return landmark;
          }
        );
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addLandmark: {
      type: LandmarkType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        location: { type: GraphQLString },
        country: { type: GraphQLString },
        imageURL: { type: GraphQLString },
      },
      resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        return Landmark.create({
          name: args.name,
          description: args.description,
          location: args.location,
          country: args.country,
          imageURL: args.imageURL,
          userId: context.userId,
        }).catch((err) => {
          throw new Error("ERROR while creating landmark! " + err);
        });
      },
    },


    updateLandmark: {
      type: LandmarkType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        location: { type: GraphQLString },
        country: { type: GraphQLString },
        imageURL: { type: GraphQLString },
      },
      async resolve(parent, args, context) {

        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        const landmark = await Landmark.findOne({ where: { id: args.id } });
        if (!landmark) {
          throw new Error("Landmark not found with the provided ID!");
        }

        if (landmark.userId !== context.userId) {
          throw new Error("You can only modify your own landmarks!");
        }

        await Landmark.update({
          name: args.name,
          description: args.description,
          location: args.location,
          country: args.country,
          imageURL: args.imageURL,
        }, {
          where: { id: args.id },
        }).catch((err) => {
          throw new Error("ERROR while updating landmark! " + err);
        })

        return landmark;
      },
    },


    deleteLandmark: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLInt },
      },

      async resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        const landmark = await Landmark.findOne({ where: { id: args.id } });
        if (!landmark) {
          throw new Error("Landmark not found with the provided ID!");
        }

        if (landmark.userId !== context.userId) {
          throw new Error("You can only delete your own landmarks!");
        }

        await Landmark.destroy({
          where: { id: args.id },
        }).catch((err) => {
          throw new Error("ERROR while deleting landmark! " + err);
        })

        return "Landmark successfully deleted!";
      }

    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
