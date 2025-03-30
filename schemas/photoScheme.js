const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;
const PhotoType = require("./TypeDefs/photoType");
const Photo = require("../models/photo");
const Landmark = require("../models/landmark");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    photoByLandmark: {
      type: new GraphQLList(PhotoType),
      args: { landmarkId: { type: GraphQLInt } },
      async resolve(parent, args) {
        const landmark = await Landmark.findByPk(args.landmarkId);
        if (!landmark) {
          throw new Error("No landmark with provided id");
        }

        const photos = await Photo.findAll({
          where: { landmarkId: args.landmarkId },
        });

        return photos;
      },
    },
  },
});



const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPhoto: {
      type: PhotoType,
      args: {
        url: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLInt },
        landmarkId: { type: GraphQLInt },
      },
      resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        return Photo.create({
          url: args.url,
          description: args.description,
          landmarkId: args.landmarkId,
          userId: context.userId,
        }).catch((err) => {
          throw new Error("ERROR while adding photo! " + err);
        });
      },
    },

    updatePhoto: {
      type: PhotoType,
      args: {
        id: { type: GraphQLInt },
        url: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        const photo = await Photo.findOne({ where: { id: args.id } });
        if (!photo) {
          throw new Error("Photo not found with the provided ID!");
        }

        if (photo.userId !== context.userId) {
          throw new Error("You can only modify your own photos!");
        }

        await Photo.update(
          {
            url: args.url,
            description: args.description,
          },
          {
            where: { id: args.id },
          }
        ).catch((err) => {
          throw new Error("ERROR while updating photo! " + err);
        });

        return photo;
      },
    },

    deletePhoto: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLInt },
      },

      async resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        const photo = await Photo.findOne({ where: { id: args.id } });
        if (!photo) {
          throw new Error("Photo not found with the provided ID!");
        }

        if (photo.userId !== context.userId) {
          throw new Error("You can only delete your own photos!");
        }

        await Photo.destroy({
          where: { id: args.id },
        }).catch((err) => {
          throw new Error("ERROR while deleting photo! " + err);
        });

        return "Photo successfully deleted!";
      },
    },
  },
});



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
