import { put, list } from "@vercel/blob";

export default async function handler(req, res) {

  const fileName = "students.json";

  // GET ALL STUDENTS
  if (req.method === "GET") {
    try {
      const blobs = await list();
      const file = blobs.blobs.find(b => b.pathname === fileName);

      if (!file) {
        return res.status(200).json([]);
      }

      const data = await fetch(file.url);
      const json = await data.json();

      return res.status(200).json(json);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST NEW STUDENT
  if (req.method === "POST") {
    try {
      const { name, post } = req.body;

      if (!name || !post) {
        return res.status(400).json({ message: "Name & post required" });
      }

      // Get existing data
      let students = [];

      const blobs = await list();
      const file = blobs.blobs.find(b => b.pathname === fileName);

      if (file) {
        const data = await fetch(file.url);
        students = await data.json();
      }

      // Add new
      const newStudent = {
        id: Date.now(),
        name,
        post
      };

      students.push(newStudent);

      // Save back to Blob
      const blob = await put(fileName, JSON.stringify(students), {
        access: "public",
        contentType: "application/json",
        overwrite: true
      });

      return res.status(200).json(newStudent);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
