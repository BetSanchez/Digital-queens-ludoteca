/**
 * Datos de ejemplo para probar la aplicación.
 * Uso: npm run seed        (agrega los registros si la tabla está vacía)
 *      npm run seed -- --force  (borra todo y vuelve a insertar)
 */
import db from './db.js';

const force = process.argv.includes('--force');

const recursos = [
  {
    nombre: 'CS50: Introducción a las Ciencias de la Computación',
    participante: 'Ana Martínez',
    tipo: 'Curso',
    categoria: 'Programación',
    idioma: 'Inglés',
    enlace: 'https://cs50.harvard.edu/x/',
    descubrimiento: 'Una compañera del programa lo compartió en el grupo de estudio.',
    contribucion: 'Me dio las bases de lógica y algoritmos que necesitaba para empezar a programar sin miedo.',
    recomendacion: 'Es gratuito, muy estructurado y no asume conocimientos previos.',
    fecha: '2026-01-14 10:20:00',
  },
  {
    nombre: 'Figma para principiantes',
    participante: 'Lucía Ramírez',
    tipo: 'Video',
    categoria: 'Diseño',
    idioma: 'Español',
    enlace: 'https://www.youtube.com/results?search_query=figma+para+principiantes',
    descubrimiento: 'Buscando tutoriales para hacer mi primer prototipo.',
    contribucion: 'Aprendí a presentar mis ideas visualmente antes de escribir una sola línea de código.',
    recomendacion: 'En pocas horas puedes tener un prototipo presentable para un proyecto real.',
    fecha: '2026-02-03 16:45:00',
  },
  {
    nombre: 'Kaggle Learn: Python y Pandas',
    participante: 'Ana Martínez',
    tipo: 'Curso',
    categoria: 'Datos e IA',
    idioma: 'Inglés',
    enlace: 'https://www.kaggle.com/learn',
    descubrimiento: 'Lo encontré mientras buscaba datasets para un ejercicio de clase.',
    contribucion: 'Pasé de leer sobre datos a analizarlos de verdad con ejercicios prácticos.',
    recomendacion: 'Son módulos cortos con cuadernos interactivos, ideal si tienes poco tiempo.',
    fecha: '2026-02-20 09:05:00',
  },
  {
    nombre: 'Hacking Ético desde Cero',
    participante: 'Daniela Ortiz',
    tipo: 'Curso',
    categoria: 'Ciberseguridad',
    idioma: 'Español',
    enlace: 'https://tryhackme.com/',
    descubrimiento: 'En una charla de seguridad informática del programa Mujer Digital.',
    contribucion: 'Me ayudó a entender cómo proteger la información de mi propio emprendimiento.',
    recomendacion: 'Explica conceptos complejos con laboratorios guiados y sin tecnicismos innecesarios.',
    fecha: '2026-03-08 12:00:00',
  },
  {
    nombre: 'Guía práctica de Excel para negocios',
    participante: 'Carmen Solís',
    tipo: 'Libro',
    categoria: 'Ofimática',
    idioma: 'Español',
    descubrimiento: 'Me la recomendó mi mentora del programa.',
    contribucion: 'Automaticé el control de inventario de mi tienda y ahorro varias horas cada semana.',
    recomendacion: 'Va directo a los casos que realmente se usan en un negocio pequeño.',
    fecha: '2026-03-25 18:30:00',
  },
  {
    nombre: 'Marketing digital para emprendedoras',
    participante: 'Lucía Ramírez',
    tipo: 'Podcast',
    categoria: 'Marketing Digital',
    idioma: 'Español',
    enlace: 'https://open.spotify.com/',
    descubrimiento: 'Escuchando recomendaciones en Spotify mientras trabajaba.',
    contribucion: 'Entendí cómo construir una marca personal sin invertir en publicidad pagada.',
    recomendacion: 'Cada episodio dura menos de 30 minutos y deja tareas concretas.',
    fecha: '2026-04-11 08:15:00',
  },
  {
    nombre: 'freeCodeCamp: Diseño Web Responsivo',
    participante: 'Sofía Herrera',
    tipo: 'Curso',
    categoria: 'Programación',
    idioma: 'Español',
    enlace: 'https://www.freecodecamp.org/espanol/',
    descubrimiento: 'Un buscador me lo mostró cuando quería aprender HTML y CSS.',
    contribucion: 'Construí mi primer portafolio y con él conseguí mi primera entrevista técnica.',
    recomendacion: 'Es gratuito, en español y entrega certificados al terminar cada ruta.',
    fecha: '2026-04-29 20:40:00',
  },
  {
    nombre: 'Canva: plantillas para redes sociales',
    participante: 'Carmen Solís',
    tipo: 'Herramienta',
    categoria: 'Diseño',
    idioma: 'Español',
    enlace: 'https://www.canva.com/',
    descubrimiento: 'Una participante la usó para presentar su proyecto final.',
    contribucion: 'Ahora publico contenido con imagen profesional sin contratar a nadie.',
    recomendacion: 'Es la forma más rápida de tener diseños consistentes sin saber diseñar.',
    fecha: '2026-05-16 11:10:00',
  },
  {
    nombre: 'Finanzas personales para mujeres',
    participante: 'Daniela Ortiz',
    tipo: 'Libro',
    categoria: 'Finanzas',
    idioma: 'Español',
    descubrimiento: 'Lo vi en la biblioteca del centro comunitario.',
    contribucion: 'Aprendí a separar las finanzas del negocio de las personales y a hacer un presupuesto real.',
    recomendacion: 'Habla de situaciones cotidianas y no da por hecho que ya sabes de inversiones.',
    fecha: '2026-06-02 14:25:00',
  },
  {
    nombre: 'Comunidad Mujeres en Tecnología',
    participante: 'Sofía Herrera',
    tipo: 'Comunidad',
    categoria: 'Liderazgo',
    idioma: 'Español',
    enlace: 'https://discord.com/',
    descubrimiento: 'Me invitaron durante un hackathon.',
    contribucion: 'Encontré mentoras y una red de apoyo para resolver dudas y buscar oportunidades.',
    recomendacion: 'Estar acompañada hace la diferencia cuando estás empezando en tecnología.',
    fecha: '2026-06-21 17:55:00',
  },
  {
    nombre: 'Prompt Engineering en la práctica',
    participante: 'Valeria Cruz',
    tipo: 'Artículo',
    categoria: 'Datos e IA',
    idioma: 'Inglés',
    enlace: 'https://docs.claude.com/',
    descubrimiento: 'Investigando cómo usar asistentes de IA en mi trabajo diario.',
    contribucion: 'Reduje a la mitad el tiempo que dedicaba a redactar reportes y correos.',
    recomendacion: 'Da ejemplos aplicables desde el primer día, sin necesidad de programar.',
    fecha: '2026-07-07 09:30:00',
  },
  {
    nombre: 'Duolingo',
    participante: 'Valeria Cruz',
    tipo: 'Aplicación',
    categoria: 'Idiomas',
    idioma: 'Inglés',
    enlace: 'https://www.duolingo.com/',
    descubrimiento: 'Una amiga la usaba todos los días y me contagió el hábito.',
    contribucion: 'Mejoré mi inglés lo suficiente para seguir documentación técnica sin traductor.',
    recomendacion: 'Con 10 minutos diarios se avanza, y eso cualquiera lo puede sostener.',
    fecha: '2026-07-19 21:05:00',
  },
];

const insert = db.prepare(`
  INSERT INTO resources
    (nombre, participante, tipo, categoria, idioma, enlace, archivo, imagen,
     descubrimiento, contribucion, recomendacion, fecha)
  VALUES
    (@nombre, @participante, @tipo, @categoria, @idioma, @enlace, @archivo, @imagen,
     @descubrimiento, @contribucion, @recomendacion, @fecha)
`);

const insertMany = db.transaction((filas) => {
  for (const fila of filas) {
    insert.run({
      idioma: null,
      enlace: null,
      archivo: null,
      imagen: null,
      ...fila,
    });
  }
});

const { total } = db.prepare('SELECT COUNT(*) AS total FROM resources').get();

if (total > 0 && !force) {
  console.log(`La base de datos ya tiene ${total} recursos. Usa "npm run seed -- --force" para reiniciarla.`);
  process.exit(0);
}

if (force) {
  db.exec('DELETE FROM resources; DELETE FROM sqlite_sequence WHERE name = "resources";');
}

insertMany(recursos);
console.log(`✅ Se insertaron ${recursos.length} recursos de ejemplo.`);
