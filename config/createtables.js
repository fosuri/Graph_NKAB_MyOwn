const sequelize = require("./database");
const { User, Landmark, Photo, Rating } = require("../models");

const connectToDB = async () => {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    console.log("База данных и таблицы созданы!");

    // // Добавление пользователей
    // const user1 = await User.create({
    //   username: "user1",
    //   email: "user1@example.com",
    //   password: "user1_123",
    // });
    // console.log(user1.toJSON()); // Проверка сохраненных данных

    // const user2 = await User.create({
    //   username: "user2",
    //   email: "user2@example.com",
    //   password: "user2_123",
    // });
    // console.log(user2.toJSON());

    // // Добавление достопримечательностей
    // const landmark1 = await Landmark.create({
    //   name: "Eiffel Tower",
    //   description:
    //     "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889.",
    //   location: "Paris",
    //   country: "France",
    //   imageURL:
    //     "https://pixabay.com/photos/eiffel-tower-france-paris-landscape-975004/",
    //   userId: user1.id,
    // });

    // // Добавление фотографий
    // const photo1 = await Photo.create({
    //   url: "https://pixabay.com/photos/eiffel-tower-paris-france-3349075/",
    //   description: "Beautiful view of Eiffel Tower.",
    //   userId: user1.id,
    //   landmarkId: landmark1.id,
    // });

    // // Добавление рейтингов
    // const rating1 = await Rating.create({
    //   rating: 5,
    //   userId: user1.id,
    //   landmarkId: landmark1.id,
    // });
  } catch (error) {
    console.error("Ошибка при создании базы данных:", error);
  }
};

module.exports = connectToDB;
