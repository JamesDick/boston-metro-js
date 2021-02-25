abstract class Vertex {
    private _id: number;
    private _name: string;

    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    public get id() { return this._id; }
    public set id(id: number) { this._id = id; }

    public get name() { return this._name; }
    public set name(name: string) { this._name = name; }
}

abstract class Edge {
    private _src: number;
    private _dest: number;

    constructor(src: number, dest: number) {
        this._src = src;
        this._dest = dest;
    }

    public get src() { return this._src; }
    public set src(src: number) { this._src = src; }

    public get dest() { return this._dest; }
    public set dest(dest: number) { this._dest = dest; }
}

abstract class Graph {
    protected _vertices: Map<number, Vertex>;
    protected _edges: Edge[];

    constructor() {
        this._vertices = new Map();
        this._edges = []
    }

    public addVertex(vertex: Vertex): void {
        this._vertices[vertex.id] = vertex;
    }

    public addEdge(edge: Edge): void {
        this._edges.push(edge);
    }
}

class Station extends Vertex {
    constructor(id: number, name: string) {
        super(id, name);
    }
}

class Rail extends Edge {
    private _line: string;

    constructor(src: number, dest: number, line: string) {
        super(src, dest);
        this._line = line;
    }
}

class Multigraph extends Graph {
    constructor() {
        super();
    }

    public getStations(): Vertex[] {
        return Array.from(this._vertices.values());
    }

    public findRoute(src: number, dest: number): Station[] {
        let agenda: number[] = [src];
        let parents: Map<number, number> = new Map();
        let expansions: number = 0;

        while (agenda != []) {
            let current = agenda.pop();
            if (current == dest) {
                return this.reconstructPath(current, parents).map(s => this._vertices.get(s));
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

    private reconstructPath(current: number, parents: Map<number, number>): number[] {
        let path = [current];
        while (parents.has(current)) {
            current = parents.get(current);
            path = [current, ...path];
        }
        return path;
    }

    private adjacentStations(id: number): number[] {
        let adjacentStations = [];

        for (let e of this._edges) {
            if (e.src == id) {
                adjacentStations.push(e.dest);
            }

            if (e.dest == id) {
                adjacentStations.push(e.src);
            }
        }

        return adjacentStations;
    }
}

interface IModel {
    findRoute(src: number, dest: number): Station[];
    getStations(): Station[];
}

class Model implements IModel {
    private _multigraph: Multigraph;

    constructor() {
        this._multigraph = this.generateGraphFromFile();
    }

    private generateGraphFromFile(): Multigraph {
        let multigraph = new Multigraph();
        
        /* do stuff */

        return multigraph;
    }

    public findRoute(src: number, dest: number): Station[] {
        return this._multigraph.findRoute(src, dest);
    }

    public getStations(): Station[] {
        return this._multigraph.getStations();
    }
}