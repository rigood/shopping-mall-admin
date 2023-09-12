import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findById(req.query.id));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, category, images } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      category,
      images,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { _id, title, description, price, category, images } = req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, category, images }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
