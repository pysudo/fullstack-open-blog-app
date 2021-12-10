require("dotenv").config();
const { Sequelize, QueryTypes } = require("Sequelize");


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});


// class Blog extends Model { };
// Blog.init({
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     author: {
//         type: DataTypes.STRING,
//     },
//     url: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     likes: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     }
// },
//     {
//         sequelize,
//         underscored: true,
//         timestamps: false,
//         modelName: 'blog'

//     }
// );


async function main() {
    try {
        const blogs = await sequelize
            .query("SELECT * FROM blogs", { type: QueryTypes.SELECT });
        blogs.forEach(blog => {
            console.log(`${blog.author}: ` +
                `'${blog.title}', ` +
                `${blog.likes} likes`);
        });
    }
    catch (error) {
        console.log(error);
    }
}


main();