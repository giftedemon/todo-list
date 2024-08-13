class Project {
    constructor({ title, id, selected = false }) {
        this.title = title;
        this.id = id;
        this.selected = selected;
    }
}

export default Project;
