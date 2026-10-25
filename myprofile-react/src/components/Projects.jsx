
import { useEffect, useState } from "react";

function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/projects")
            .then(response => response.json())
            .then(data => setProjects(data))
            .catch(error => console.error("Error loading projects:", error));
    }, []);

    return (
        <section>
            <h1>My Projects</h1>

            {projects.map(project => (
                <article key={project._id}>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <p>Technology: {project.technology}</p>
                </article>
            ))}
        </section>
    );
}

export default Projects;
