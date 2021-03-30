'use strict';

/**
 * Represents a Vertex in a Graph.
 */
class Vertex {
    /**
     * Creates a new Vertex.
     * @param {number} id The ID for this Vertex. 
     */
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }

    get id() { return this._id; }
    set id(id) { this._id = id; }
}

/**
 * Represents an Arc between two Vertices in a Graph.
 */
class Arc {
    /**
     * Creates a new Arc from the Vertex indicated 
     * by src to the Vertex identified by dest.
     * @param {number} src The ID of the Node at which this Arc begins.
     * @param {number} dest The ID of the Node at which this Arc ends.
     */
    constructor(src, dest) {
        this._src = src;
        this._dest = dest;
    }

    get src() { return this._src; }
    set src(src) { this._src = src; }

    get dest() { return this._dest; }
    set dest(dest) { this._dest = dest; }
}

/**
 * Represents a Graph containing Vertices and Arcs.
 */
class Graph {
    /**
     * Creates a new empty Graph.
     */
    constructor() {
        this._vertices = new Map();
        this._arcs = [];
    }

    /**
     * Adds a unique Vertex to the Graph.
     * @param {Vertex} vertex The Vertex to be added.
     * @returns true if the Vertex was added to the Graph, else false.
     */
    addVertex(vertex) {
        if (vertex.id in this._vertices) {
            return false;
        }

        this._vertices[vertex.id] = vertex;
        return true;
    }

    /**
     * Adds an Arc to the Graph.
     * @param {Arc} arc The Arc to be added.
     * @returns true if the Arc was added to the Graph, else false.
     */
    addArc(arc) {
        if (!(arc.src in this._vertices) || !(arc.dest in this._vertices)) {
            return false;
        }

        this._arcs.push(arc);
        return true;
    }
}

/**
 * Represents a Station in the Metro as a Vertex in a Graph.
 */
class Station extends Vertex {
    /**
     * Creates a new Station in the Metro.
     * @param {number} id The ID of this Station.
     * @param {string} name The name of this Station.
     */
    constructor(id, name) {
        super(id);
        this._name = name;
    }

    get name() { return this._name; }
    set name(name) { this._name = name; }
}

/**
 * Represents a Rail in the Metro as an Arc in a Graph.
 */
class Rail extends Arc {
    /**
     * Creates a new Rail in the Metro.
     * @param {number} src The ID of the Station at which this Rail begins.
     * @param {number} dest The ID of the Station at which this Rail ends.
     * @param {string} line The name of the line that this Rail is on.
     */
    constructor(src, dest, line) {
        super(src, dest);
        this._line = line;
    }

    get line() { return this._line; }
    set line(line) { this._line = line; }
}

/**
 * Represents a Metro system as a Graph.
 */
class Metro extends Graph {
    /**
     * Creates a new Metro.
     */
    constructor() {
        super();
    }

    /**
     * Gets a list of all Stations in the Metro.
     * @returns A list of all Stations in the Metro.
     */
    getStations() {
        let stations = [];
        for (let id in this._vertices) {
            stations.push(this._vertices[id]);
        }
        return stations;
    }

    /**
     * Finds the shortest route between two Stations in the Metro.
     * @param {number} src The ID of the Station at which the route begins.
     * @param {number} dest The ID of the Station at which the route should end.
     * @returns A list of Stations comprising the route between the src and dest Stations.
     */
    findRoute(src, dest) {
        let agenda = [src],
            parents = new Map(),
            expansions = 0;

        while (agenda != []) {

            let current = agenda.pop()
            if (current == dest) {
                let path = this._reconstructPath(current, parents);
                return path.map(s => this._vertices[s]);
            }

            if (expansions++ < 150) {
                let adjacent = this._adjacentStations(current);
                for (let a of adjacent) {
                    if (!parents.has(a) && a != src) {
                        agenda = [a, ...agenda];
                        parents.set(a, current);
                    }
                }
            }
        }
        return [];
    }

    /**
     * Reconstructs a path from a given station to the one at which the search started.
     * @param {number} current 
     * @param {Object} parents 
     * @returns A list of Station IDs connecting the given station to the one at which the search started. 
     */
    _reconstructPath(current, parents) {
        let path = [current];
        while (parents.has(current)) {
            current = parents.get(current);
            path = [current, ...path];
        }
        return path;
    }

    /**
     * Gets a list of IDs for Stations which are able to be 
     * immediately reached from the specified Station.
     * @param {number} id The ID of the Station for which we want to find adjacent Stations.
     * @returns A list of IDs for Stations adjacent to the specified Station.
     */
    _adjacentStations(id) {
        return this._arcs.filter(a => a.src == id && a.dest != 0)
                         .map(a => a.dest)
    }
}

/**
 * Class responsible for the logic of the app.
 */
class Model {
    /**
     * Creates a Metro instance and populates it with Stations and Rails.
     * @returns A populated Metro instance.
     */
    async populateMetro() {
        if (this._metro) {
            return;
        }

        let metro = new Metro();
        let data = await fetch('metro.json');
        let metroData = await data.json();
        metroData.stations.forEach(s => metro.addVertex(new Station(s.id, s.name)));
        metroData.rails.forEach(r => metro.addArc(new Rail(r.src, r.dest, r.line)));
        this._metro = metro;
    }

    /**
     * Gets a list of all Stations in the Metro.
     * @returns A list of all Stations in the Metro.
     */
    getStations() {
        return this._metro.getStations();
    }

    /**
     * Finds the shortest route between two Stations in the Metro.
     * @param {number} src The ID of the Station at which the route begins.
     * @param {number} dest The ID of the Station at which the route should end.
     * @returns A list of Stations comprising the route between the src and dest Stations.
     */
    findRoute(src, dest) {
        return this._metro.findRoute(src, dest);
    }
}
