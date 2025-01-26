const express = require('express');
const {UserRoutes} = require("./routes/userRoutes");

class App {
    constructor() {
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
    }

    setMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    setRoutes() {
        const userRoutes = new UserRoutes();
        this.app.use('/api/users', userRoutes.router);
    }

    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
}

module.exports = {App};