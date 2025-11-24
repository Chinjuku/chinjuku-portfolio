export const all_projects = [
    {
        id: 1,
        title: "TicketFlicks",
        description: "Movie Ticket Booking and Review System. Included a payment system for booking tickets and a feature for users to favorite and review movies. Designed and developed a user-friendly website utilizing NextJS for the frontend and Django for the backend. Used PostgreSQL as a Relational Database Management System.",
        role: "Fullstack Dev",
        tech: ["Next.js", "Django", "PostgreSQL"],
        color: "from-purple-500 to-indigo-600",
        repos: ["https://github.com/Chinjuku/TicketFlicks-Frontend", "https://github.com/Chinjuku/TicketFlicks-Backend"],
        web_url: "",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Calendoo Todolist",
        description: "Todolist and Project Task List Website. Managed a system that recorded to-do lists and projects to be completed each day. Leveraged a modern UI framework combination of ReactJS, TailwindCSS and DaisyUI to streamline development, enabling a 50% reduction in development time. Used Prisma as Database Services and Typescript as Back-end Services. Used MongoDB for database.",
        role: "Fullstack Dev",
        tech: ["React", "TailwindCSS", "Prisma", "MongoDB"],
        color: "from-blue-400 to-cyan-500",
        repos: "https://github.com/Chinjuku/Calendoo-Todolist",
        web_url: "",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "RestaurantEU",
        description: "Restaurant Management System. Developed a customer interface for browsing and ordering menu items, with a system to display dish statuses. Implemented an employee login system with access to features such as a dashboard, order preparation, serving, and cashier pages. Used Laravel Framework as the PHP framework that employs the MVC pattern and used MySQL for the database system.",
        role: "Fullstack Dev",
        tech: ["Laravel", "MySQL", "PHP"],
        color: "from-emerald-400 to-teal-600",
        repos: "https://github.com/Chinjuku/RestaurantEU",
        web_url: "",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Connextra",
        description: "Developed a real-time chat application entirely from scratch without frameworks to master the fundamentals of HTTP requests and database management.",
        role: "Fullstack Dev",
        tech: ["Typescript", "PostgreSQL", "Prisma", "React+Vite", "Nodejs", "Socket.io"],
        color: "from-orange-400 to-red-500",
        repos: ["https://github.com/Chinjuku/ConnextrA-Client", "https://github.com/Chinjuku/ConnextrA-Server"],
        web_url: "",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "HongsamutIT",
        description: "IT Reserve, a website for booking IT equipment. Developed using PHP, MySQL, HTML, CSS, and JavaScript.",
        role: "Fullstack Dev",
        tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
        color: "from-purple-500 to-indigo-600",
        repos: "https://github.com/Chinjuku/HongsamutIT",
        web_url: "",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "PSIT Place",
        description: "IT Products E-commerce. An e-commerce system for buying and selling IT equipment where managers can manage products. Developed a backend system using Flask Python and MySQL for database storage. Applied Python, JavaScript, HTML, and CSS for frontend development.",
        role: "Backend Dev",
        tech: ["Flask", "MySQL", "Python"],
        color: "from-orange-400 to-red-500",
        repos: "https://github.com/Chinjuku/PSCP-Project__PSIT-Place__",
        web_url: "",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
    },

];

export const projects = all_projects.filter((project) => project.id <= 4);