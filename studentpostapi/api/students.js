import { put, list } from "@vercel/blob";

const fileName = "students.json";

async function loadStudents() {
  const files = await list();

  const file = files.blobs.find(b => b.pathname === fileName);

  if (!file) return [];

  const res = await fetch(file.url);
  return await res.json();
}

export default async function handler(req, res) {

  // GET
  if (req.method === "GET") {
    const students = await loadStudents();
    return res.status(200).json(students);
  }

  // POST
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

      const { name, post } = body || {};

      if (!name || !post) {
        return res.status(400).json({
          message: "Name and post required"
        });
      }

      const students = await loadStudents();

      const newStudent = {
        id: Date.now(),
        name,
        post
      };

      students.push(newStudent);

      await put(fileName, JSON.stringify(students), {
        access: "public",
        contentType: "application/json",
        overwrite: true
      });

      return res.status(201).json(newStudent);

    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
