import Project from './project';

const ProjectsHandler = (function () {
    const addProject = (obj) => {
        const newProject = new Project(obj);
        let projects = localStorage.projects ? JSON.parse(localStorage.projects) : [];
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const deleteProject = (id) => {
        let projects = JSON.parse(localStorage.projects);
        projects = projects.filter((element) => element.id != id);
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const editSelectedProject = (id) => {
        let projects = JSON.parse(localStorage.projects);
        projects.map((element) => {
            if (element.id == id) {
                element.selected = true;
            } else if (element.selected === true) {
                element.selected = false;
            }
        });
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const getProjects = () => {
        return localStorage.projects ? JSON.parse(localStorage.projects) : [];
    };

    return { addProject, deleteProject, getProjects, editSelectedProject };
})();

export default ProjectsHandler;
