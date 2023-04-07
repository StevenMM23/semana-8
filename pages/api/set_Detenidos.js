import Detenido from "@/Models/textModel";
import { connectMongoDB } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ msg: "Only post request are alloweded" });
    return;
  }
  const { delincuentes } = req.body;
  console.log(delincuentes);

  try {
    await connectMongoDB();
    Detenido.create(delincuentes).then((data) => {
      console.log(data);
      res.status(201).send(data);
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ msg: "Error sending Data" });
  }
}
