import Detenido from "@/Models/textModel";
import { connectMongoDB } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send({ msg: "Only post request are alloweded" });
    return;
  }
  try {
    await connectMongoDB();
    Detenido.find({}).then((data) => {
      console.log(data);
      res.status(201).send(data);
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ msg: "Error sending Data" });
  }
}
