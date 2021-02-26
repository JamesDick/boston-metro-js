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
        if (!this._vertices.has(vertex.id)) {
            this._vertices[vertex.id] = vertex;
        }
    }

    public addEdge(edge: Edge): void {
        if (this._vertices.has(edge.src) && this._vertices.has(edge.dest)) {
            this._edges.push(edge);
        }
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

    public get line() { return this._line; }
    public set line(line: string) { this._line = line; }
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
            let current: number = agenda.pop();
            if (current == dest) {
                return this.reconstructPath(current, parents).map(s => this._vertices.get(s));
            }

            if (expansions++ < 50000) {
                let adjacent: number[] = this.adjacentStations(current);
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
        let path: number[] = [current];
        while (parents.has(current)) {
            current = parents.get(current);
            path = [current, ...path];
        }
        return path;
    }

    private adjacentStations(id: number): number[] {
        let adjacentStations: number[] = [];

        this._edges
            .filter(e => e.src == id)
            .forEach(e => adjacentStations.push(e.dest))

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
        
        let stations = [
            {id: 1, name: 'Oak Grove'},
            {id: 2, name: 'Malden'},
            {id: 3, name: 'Wonderland'},
            {id: 4, name: 'Revere Beach'},
            {id: 5, name: 'Wellington'},
            {id: 6, name: 'Beachmont'},
            {id: 7, name: 'Davis'},
            {id: 8, name: 'Alewife'},
            {id: 9, name: 'Suffolk Downs'},
            {id: 10, name: 'Porter'},
            {id: 11, name: 'Orient Heights'},
            {id: 12, name: 'Sullivan Square'},
            {id: 13, name: 'Wood Island'},
            {id: 14, name: 'Harvard'},
            {id: 15, name: 'Community College'},
            {id: 16, name: 'Airport'},
            {id: 17, name: 'Lechmere'},
            {id: 18, name: 'Maverick'},
            {id: 19, name: 'Science Park'},
            {id: 20, name: 'North Station'}
        ];

        let rails = [
            {src: 1, dest: 2, line: 'Orange'},
            {src: 2, dest: 1, line: 'Orange'},
            {src: 2, dest: 5, line: 'Orange'},
            {src: 3, dest: 4, line: 'Blue'},
            {src: 4, dest: 3, line: 'Blue'},
            {src: 4, dest: 6, line: 'Blue'},
            {src: 5, dest: 2, line: 'Orange'},
            {src: 5, dest: 12, line: 'Orange'},
            {src: 6, dest: 4, line: 'Blue'},
            {src: 6, dest: 9, line: 'Blue'},
            {src: 7, dest: 8, line: 'Red'},
            {src: 7, dest: 10, line: 'Red'},
            {src: 8, dest: 7, line: 'Red'},
            {src: 9, dest: 6, line: 'Blue'},
            {src: 9, dest: 11, line: 'Blue'},
            {src: 10, dest: 7, line: 'Red'},
            {src: 10, dest: 14, line: 'Red'},
            {src: 11, dest: 9, line: 'Blue'},
            {src: 11, dest: 13, line: 'Blue'},
            {src: 12, dest: 5, line: 'Orange'},
            {src: 12, dest: 15, line: 'Orange'},
            {src: 13, dest: 11, line: 'Blue'},
            {src: 13, dest: 16, line: 'Blue'},
            {src: 14, dest: 10, line: 'Red'},
            {src: 15, dest: 12, line: 'Orange'},
            {src: 15, dest: 20, line: 'Orange'},
            {src: 16, dest: 13, line: 'Blue'},
            {src: 16, dest: 18, line: 'Blue'},
            {src: 17, dest: 19, line: 'Green'},
            {src: 18, dest: 16, line: 'Blue'},
            {src: 19, dest: 17, line: 'Green'},
            {src: 19, dest: 20, line: 'Green'},
            {src: 20, dest: 19, line: 'Green'},
            {src: 20, dest: 15, line: 'Orange'}
        ];

        stations.forEach(s => multigraph.addVertex(new Station(s.id, s.name)));
        rails.forEach(r => multigraph.addEdge(new Rail(r.src, r.dest, r.line)));

        return multigraph;
    }

    public findRoute(src: number, dest: number): Station[] {
        return this._multigraph.findRoute(src, dest);
    }

    public getStations(): Station[] {
        return this._multigraph.getStations();
    }
}