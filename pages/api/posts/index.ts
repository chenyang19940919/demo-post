import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const posts = await prismadb.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(posts);
    }

    if (req.method === "POST") {
      const { title, category, thumbnail, content, status } = req.body;

      const newPost = await prismadb.post.create({
        data: { title, category, thumbnail, content, status },
      });
      return res.status(200).json(newPost);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
