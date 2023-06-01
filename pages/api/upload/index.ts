import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { storage } from "@/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = async (
  req: NextApiRequest
): Promise<{
  fileName: string;
  buffer: Buffer;
  mimetype: string;
}> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files:any) => {
      if (err) reject(err);
      const buffer = await fs.readFileSync(files.file.filepath);
      const fileName = files.file.originalFilename;
      const mimetype = files.file.mimetype;
      resolve({ fileName, buffer, mimetype });
    });
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fileName, buffer, mimetype } = await readFile(req);

    const storageRef = ref(storage, `posts/${fileName}`);
    const metadata = {
      contentType: mimetype,
    };
    const task = uploadBytesResumable(storageRef, buffer, metadata);

    await task.on(
      "state_changed",
      null,
      (error) => {
        throw new Error(error.message);
      },
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        return res.status(200).json({
          errno: 0,
          data: {
            url: downloadURL,
            alt: fileName,
            href: downloadURL,
          },
        });
      }
    );
  } catch (error) {
    return res.status(400).json({ errno: 1, message: error });
  }
};
