require("dotenv").config();
const express = require("express");
const { Sequelize, Model, DataTypes } = require("Sequelize");


const app = express();

app.use((req, res, next) => {
    console.log();
    next();
});
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});


class Blog extends Model { };
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: 'blog'

    }
);


app.get("/api/blogs", async (request, response) => {
    try {
        const blogs = await Blog.findAll();

        response.status(200).json(blogs);
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
});


app.post("/api/blogs", async (request, response) => {
    try {
        const newBlog = await Blog.create(request.body);

        response.status(200).json(newBlog);
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            response.status(400).json(error);
        }
        else response.status(500).json(error);
    }
});


app.delete("/api/blogs/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const blog = await Blog.findByPk(id);

        if (blog) {
            const deletedBlog = await blog.destroy();
            response.status(204).json(deletedBlog);
        }
        else {
            response
                .status(404)
                .send("The blog is either already deleted or doesn't exist");
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
});


app.listen(5000, () => {
    console.log("Server listening on PORT 5000.");
})
