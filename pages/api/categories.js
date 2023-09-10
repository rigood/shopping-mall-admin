import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    console.log(req.body);

    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });

    res.json(categoryDoc);
  }

  if (method === "PUT") {
    console.log("🚀put", req.body);
    const { name, parentCategory, properties, _id } = req.body;

    const categoryDoc = await Category.updateOne(
      { _id },
      {
        $set: {
          name,
          parent: parentCategory || undefined,
          properties,
        },
      }
    );

    console.log("업데이트한 cate", categoryDoc);

    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
