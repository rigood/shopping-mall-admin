import multiparty from "multiparty";

export default async function handle(req, res) {
  const form = new multiparty.Form();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      console.log(files.file);
      return res.json("ok");
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
