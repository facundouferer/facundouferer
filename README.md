# <div align="center">👋 Hi! I'm Facundo Uferer</div>

<div align="center">
  <h2>Senior Software Developer 🧑‍💻</h2>
</div>

## 🚀 About Me

I am a **Full Stack Developer** specialized in the JavaScript ecosystem, with extensive experience building modern, scalable, and AI-driven solutions. I consider myself a professional committed to innovation, continuous learning, and crafting solutions that integrate technology, critical thinking, and creativity.

## 💻 Tech Stack

### Front-end
<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</div>

### Back-end
<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
</div>

### Cloud & DevOps
<div align="center">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</div>

## 🎓 Academic Experience

- **Programming Instructor** at the National Technological University (UTN)
- Training in web development fundamentals and best practices
- Focus on logical thinking and problem-solving

## 🎙️ Personal Projects

- **Podcast** on science and philosophy
- **Art and Writing**: Personal projects in drawing and creative writing
- **Tech Outreach**: Sharing knowledge and experience

## 📫 Contact

Want to get in touch with me?

You can find me on any of my social networks or listen to my podcast. I'm always open to new opportunities and collaborations.

If you have a project in mind or want to discuss ideas, don't hesitate to reach out.

<div align="center">
  <a href="https://github.com/facundouferer" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/facundouferer" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://www.instagram.com/facundouferer" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
  <a href="https://x.com/facundouferer" target="_blank">
    <img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X (Twitter)" />
  </a>
  <a href="https://open.spotify.com/show/2CiWuSGhYr70Nwlanpoqzx" target="_blank">
    <img src="https://img.shields.io/badge/Podcast-FF5E5B?style=for-the-badge&logo=spotify&logoColor=white" alt="Podcast Psicodelia Nerd" />
  </a>
</div>

---

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=facundouferer&show_icons=true&theme=radical" />
</div>

## 🔐 Autenticación (Nuevo)

Se agregó un sistema básico de autenticación con JWT + cookies HttpOnly.

Endpoints:
- POST `/api/auth/register` { email, password, name?, role? }
- POST `/api/auth/login` { email, password }
- POST `/api/auth/logout`
- GET `/api/auth/me`
- GET `/api/users` (Sólo admin)

Páginas:
- `/login` formulario de ingreso.
- `/admin` panel protegido (middleware redirige si no hay token válido).

Variables de entorno requeridas:
```
MONGODB_URI=...
JWT_SECRET=una_clave_segura_larga
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Notas:
- El primer usuario creado puede forzarse como admin enviando `role: "admin"` en register (controlar esto en producción manualmente).
- Middleware protege rutas que comienzan con `/admin`.
- Para hardening: rotar JWT_SECRET, agregar límite de intentos y CSRF para operaciones sensibles.
