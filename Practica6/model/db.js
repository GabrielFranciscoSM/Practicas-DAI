import mongoose from "mongoose";

const url = `mongodb://${process.env.USER_DB}:${process.env.PASS}@localhost:27017/DAI?authSource=admin`
	
export default async function connectDB() {            // export default
	try {
		await mongoose.connect(url);                   // await siempre dentro de funciones async
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
	
	const dbConnection = mongoose.connection;
	dbConnection.once("open", (_) => {                  // callback, con función flecha
		console.log(`Database connected: ${url}`);
	});
			 
	dbConnection.on("error", (err) => {                 // callback, con función flecha
		console.error(`connection error: ${err}`);
	});
	return;
}