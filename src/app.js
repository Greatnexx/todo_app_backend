import express from 'express';
import cors from 'cors';
import swaggerDocs from './utils/swagger/swagger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import  userRouters  from './routes/userRoute.js';
import todoRoutes  from './routes/todoRoute.js';
import AddressRoutes  from './routes/addressRoute.js';
import  CategoryRoutes  from './routes/categoryRoute.js';
import  MenuRoutes  from './routes/menuRoute.js';
import MenuOptionsRoutes  from './routes/menuOptionRoute.js';


const PORT = process.env.PORT  || 4000

const startServer =()=>{

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use(express.urlencoded({extended:true}))


    app.use(function (_req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      });

      app.get("/test", async (_req, res) => {
        return res.status(200).send("Welcome to The TODO API!");
      });

      app.use("/api/users",userRouters)
      app.use("/api/todos",todoRoutes)
      app.use("/api/addresses",AddressRoutes)
      app.use("/api/categories",CategoryRoutes)
      app.use("/api/menus",MenuRoutes)
      app.use("/api/menu-options",MenuOptionsRoutes)
      
      swaggerDocs(app,PORT); 
      app.use(notFound);
      app.use(errorHandler);

 return {app,PORT}


}
export default startServer;