import { Server } from "socket.io";
import ProductManager from "../dao/mongoDb/productManager.mjs";

const productManager = new ProductManager();

const config = (serverHTTP) => {
    const serverIO = new Server(serverHTTP);

    serverIO.on("connection", (socket) => {
        const id = socket.client.id;
        console.log("Conexión establecida", id);

        socket.on("new_product_back", async (data) => {
            try {
                const { title, price, description, stock, category, code, thumbnails } = data;
                const newProduct = await productManager.addProduct(title, price, description, stock, category, code, thumbnails);
                serverIO.emit("stock_actualizado", {});
            } catch (error) {
                console.error("Error al agregar producto:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto un cliente");
        });

        socket.on("delete_product", async (id) => {
            const success = await productManager.deleteProduct(id);
            if (success) {
                console.log("Producto eliminado", id);
                serverIO.emit("stock_actualizado", {});
            }
        });
    });
};

export { config };