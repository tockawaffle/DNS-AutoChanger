import { connect, ConnectOptions } from "mongoose";
export async function connectMongoDB(): Promise<void> {
    await connect(process.env.MONGODB_URI!, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions).then((connected) => {
        console.log(`[Mongoose] > Connected to db "${connected.connection.name}"`);
    }).catch((err) => {
        console.log(`[Mongoose] > Error while connecting to the db: ${err}`);
    })
}