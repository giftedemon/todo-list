import Project from './project';

const ProjectsHandler = (function () {
    const addProject = (obj) => {
        const newProject = new Project(obj);
        let projects = localStorage.projects ? JSON.parse(localStorage.projects) : [];
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const getProjects = () => {
        return localStorage.projects ? JSON.parse(localStorage.projects) : [];
    };

    return { addProject, getProjects };
})();

export default ProjectsHandler;
