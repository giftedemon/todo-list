class Task {
    constructor({ title, description, dueDate, priority, project, id, projectId }) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.id = id;
        this.project = project;
        this.projectId = projectId;
        this.completed = false;
    }
}

export default Task;
