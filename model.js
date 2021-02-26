class Vertex {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }
    get id() { return this._id; }
    set id(id) { this._id = id; }
    get name() { return this._name; }
    set name(name) { this._name = name; }
}
class Edge {
    constructor(src, dest) {
        this._src = src;
        this._dest = dest;
    }
    get src() { return this._src; }
    set src(src) { this._src = src; }
    get dest() { return this._dest; }
    set dest(dest) { this._dest = dest; }
}
class Graph {
    constructor() {
        this._vertices = new Map();
        this._edges = [];
    }
    addVertex(vertex) {
        this._vertices[vertex.id] = vertex;
    }
    addEdge(edge) {
        this._edges.push(edge);
    }
}
class Station extends Vertex {
    constructor(id, name) {
        super(id, name);
    }
}
class Rail extends Edge {
    constructor(src, dest, line) {
        super(src, dest);
        this._line = line;
    }
    get line() { return this._line; }
    set line(line) { this._line = line; }
}
class Multigraph extends Graph {
    constructor() {
        super();
    }
    getStations() {
        let stations = [];
        for (let id in this._vertices) {
            stations.push(this._vertices[id]);
        }
        return stations;
    }
    findRoute(src, dest) {
        let agenda = [src];
        let parents = new Map();
        let expansions = 0;
        while (agenda != []) {
            let current = agenda.pop();
            if (current == dest) {
                let path = this.reconstructPath(current, parents);
                return path.map(s => this._vertices[s]);
            }
            if (expansions++ < 50000) {
                let adjacent = this.adjacentStations(current);
                for (let a of adjacent) {
                    if (!parents.has(a) && a != src) {
                        agenda.push(a);
                        parents.set(a, current);
                    }
                }
            }
        }
        return [];
    }
    reconstructPath(current, parents) {
        let path = [current];
        while (parents.has(current)) {
            current = parents.get(current);
            path = [current, ...path];
        }
        return path;
    }
    adjacentStations(id) {
        let adjacentStations = [];
        this._edges
            .filter(e => e.src == id)
            .forEach(e => adjacentStations.push(e.dest));
        return adjacentStations;
    }
}
class Model {
    constructor() {
        this._multigraph = this.generateGraphFromFile();
    }
    generateGraphFromFile() {
        let multigraph = new Multigraph();
        let stations = [
            { id: 1, name: 'Oak Grove' },
            { id: 2, name: 'Malden' },
            { id: 3, name: 'Wonderland' },
            { id: 4, name: 'Revere Beach' },
            { id: 5, name: 'Wellington' },
            { id: 6, name: 'Beachmont' },
            { id: 7, name: 'Davis' },
            { id: 8, name: 'Alewife' },
            { id: 9, name: 'Suffolk Downs' },
            { id: 10, name: 'Porter' },
            { id: 11, name: 'Orient Heights' },
            { id: 12, name: 'Sullivan Square' },
            { id: 13, name: 'Wood Island' },
            { id: 14, name: 'Harvard' },
            { id: 15, name: 'Community College' },
            { id: 16, name: 'Airport' },
            { id: 17, name: 'Lechmere' },
            { id: 18, name: 'Maverick' },
            { id: 19, name: 'Science Park' },
            { id: 20, name: 'North Station' }
        ];
        let rails = [
            { src: 1, dest: 2, line: 'Orange' },
            { src: 2, dest: 1, line: 'Orange' },
            { src: 2, dest: 5, line: 'Orange' },
            { src: 3, dest: 4, line: 'Blue' },
            { src: 4, dest: 3, line: 'Blue' },
            { src: 4, dest: 6, line: 'Blue' },
            { src: 5, dest: 2, line: 'Orange' },
            { src: 5, dest: 12, line: 'Orange' },
            { src: 6, dest: 4, line: 'Blue' },
            { src: 6, dest: 9, line: 'Blue' },
            { src: 7, dest: 8, line: 'Red' },
            { src: 7, dest: 10, line: 'Red' },
            { src: 8, dest: 7, line: 'Red' },
            { src: 9, dest: 6, line: 'Blue' },
            { src: 9, dest: 11, line: 'Blue' },
            { src: 10, dest: 7, line: 'Red' },
            { src: 10, dest: 14, line: 'Red' },
            { src: 11, dest: 9, line: 'Blue' },
            { src: 11, dest: 13, line: 'Blue' },
            { src: 12, dest: 5, line: 'Orange' },
            { src: 12, dest: 15, line: 'Orange' },
            { src: 13, dest: 11, line: 'Blue' },
            { src: 13, dest: 16, line: 'Blue' },
            { src: 14, dest: 10, line: 'Red' },
            { src: 15, dest: 12, line: 'Orange' },
            { src: 15, dest: 20, line: 'Orange' },
            { src: 16, dest: 13, line: 'Blue' },
            { src: 16, dest: 18, line: 'Blue' },
            { src: 17, dest: 19, line: 'Green' },
            { src: 18, dest: 16, line: 'Blue' },
            { src: 19, dest: 17, line: 'Green' },
            { src: 19, dest: 20, line: 'Green' },
            { src: 20, dest: 19, line: 'Green' },
            { src: 20, dest: 15, line: 'Orange' }
        ];
        stations.forEach(s => multigraph.addVertex(new Station(s.id, s.name)));
        rails.forEach(r => multigraph.addEdge(new Rail(r.src, r.dest, r.line)));
        return multigraph;
    }
    findRoute(src, dest) {
        return this._multigraph.findRoute(src, dest);
    }
    getStations() {
        let stations = this._multigraph.getStations();
        return stations
    }
}
