import { connect } from "mongoose";

// const URL: string = "mongodb://127.0.0.1:27017/pickDB";
// const URL: string =
//   "mongodb+srv://brighterdayscodelab:brighterdayscodelab@cluster0.upn8ipm.mongodb.net/pickDB?retryWrites=true&w=majority";
// const URL: string =
//   "mongodb+srv://brighterdayscodelab:brighterdayscodelab@cluster0.6d4tpug.mongodb.net/pickDB?retryWrites=true&w=majority";

const URL: string =
  "mongodb+srv://pickastudio_admin:OqtlK7mgkEBV0xc@pickastudio.pvw4h.mongodb.net/pickDB?retryWrites=true&w=majority&appName=Pickastudio";

export const dbConfig = async () => {
  try {
    await connect(URL).then(() => {
      console.log("Database is now connected...🚀🚀🚀");
    });
  } catch (error) {
    console.log(error);
  }
};
