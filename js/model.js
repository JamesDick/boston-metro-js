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
 * Represents a Rail in the Metro as an Arc in the Graph.
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
        return this._arcs.filter(e => e.src == id && e.dest != 0)
                         .map(e => e.dest)
    }
}

/**
 * Class responsible for the logic of the app.
 */
class Model {
    /**
     * Creates a new Model instance.
     */
    constructor() {
        this._metro = this._populateMetro();
    }

    /**
     * Creates a Metro instance and populates it with Stations and Rails.
     * @returns A populated Metro instance.
     */
    _populateMetro() {
        let metro = new Metro();

        let stations = [
            {
                "id": "1",
                "name": "Oak Grove"
            }, {
                "id": "2",
                "name": "Malden"
            }, {
                "id": "3",
                "name": "Wonderland"
            }, {
                "id": "4",
                "name": "Revere Beach"
            }, {
                "id": "5",
                "name": "Wellington"
            }, {
                "id": "6",
                "name": "Beachmont"
            }, {
                "id": "7",
                "name": "Davis"
            }, {
                "id": "8",
                "name": "Alewife"
            }, {
                "id": "9",
                "name": "Suffolk Downs"
            }, {
                "id": "10",
                "name": "Porter"
            }, {
                "id": "11",
                "name": "Orient Heights"
            }, {
                "id": "12",
                "name": "Sullivan Square"
            }, {
                "id": "13",
                "name": "Wood Island"
            }, {
                "id": "14",
                "name": "Harvard"
            }, {
                "id": "15",
                "name": "Community College"
            }, {
                "id": "16",
                "name": "Airport"
            }, {
                "id": "17",
                "name": "Lechmere"
            }, {
                "id": "18",
                "name": "Maverick"
            }, {
                "id": "19",
                "name": "Science Park"
            }, {
                "id": "20",
                "name": "North Station"
            }, {
                "id": "21",
                "name": "Central"
            }, {
                "id": "22",
                "name": "Haymarket"
            }, {
                "id": "23",
                "name": "Kendall"
            }, {
                "id": "24",
                "name": "Bowdoin"
            }, {
                "id": "25",
                "name": "Charles/MGH"
            }, {
                "id": "26",
                "name": "Aquarium"
            }, {
                "id": "27",
                "name": "Government Center"
            }, {
                "id": "28",
                "name": "State"
            }, {
                "id": "29",
                "name": "Park Street"
            }, {
                "id": "30",
                "name": "Downtown Crossing"
            }, {
                "id": "31",
                "name": "Boylston"
            }, {
                "id": "32",
                "name": "Chinatown"
            }, {
                "id": "33",
                "name": "South Station"
            }, {
                "id": "34",
                "name": "Arlington"
            }, {
                "id": "35",
                "name": "Babcock Street"
            }, {
                "id": "36",
                "name": "Brighton Avenue"
            }, {
                "id": "37",
                "name": "Pleasant Street"
            }, {
                "id": "38",
                "name": "St. Paul Street"
            }, {
                "id": "39",
                "name": "Boston University West"
            }, {
                "id": "40",
                "name": "Fordham Road"
            }, {
                "id": "41",
                "name": "Copley"
            }, {
                "id": "42",
                "name": "Harvard Avenue"
            }, {
                "id": "43",
                "name": "Boston University Central"
            }, {
                "id": "44",
                "name": "New England Medical Center"
            }, {
                "id": "45",
                "name": "Boston University East"
            }, {
                "id": "46",
                "name": "Blandford Street"
            }, {
                "id": "47",
                "name": "Kenmore"
            }, {
                "id": "48",
                "name": "Griggs Street / Longwood Avenue"
            }, {
                "id": "49",
                "name": "Warren Street"
            }, {
                "id": "50",
                "name": "Allston Street"
            }, {
                "id": "51",
                "name": "Hynes / ICA"
            }, {
                "id": "52",
                "name": "Back Bay / South End"
            }, {
                "id": "53",
                "name": "Prudential"
            }, {
                "id": "54",
                "name": "St. Mary's Street"
            }, {
                "id": "55",
                "name": "Summit Avenue"
            }, {
                "id": "56",
                "name": "Hawes Street"
            }, {
                "id": "57",
                "name": "Fenway"
            }, {
                "id": "58",
                "name": "Kent Street"
            }, {
                "id": "59",
                "name": "Washington Street"
            }, {
                "id": "60",
                "name": "Broadway"
            }, {
                "id": "61",
                "name": "St. Paul Street"
            }, {
                "id": "62",
                "name": "Symphony"
            }, {
                "id": "63",
                "name": "Coolidge Corner"
            }, {
                "id": "64",
                "name": "Massachusetts Avenue"
            }, {
                "id": "65",
                "name": "Longwood"
            }, {
                "id": "66",
                "name": "Mount Hood Road"
            }, {
                "id": "67",
                "name": "Sutherland Road"
            }, {
                "id": "68",
                "name": "Winchester Street / Summit Av."
            }, {
                "id": "69",
                "name": "Boston College"
            }, {
                "id": "70",
                "name": "Northeastern University"
            }, {
                "id": "71",
                "name": "Chiswick Road"
            }, {
                "id": "72",
                "name": "Greycliff Road"
            }, {
                "id": "73",
                "name": "Brandon Hall"
            }, {
                "id": "74",
                "name": "Fairbanks Street"
            }, {
                "id": "75",
                "name": "South Street"
            }, {
                "id": "76",
                "name": "Washington Square"
            }, {
                "id": "77",
                "name": "Tappan Street"
            }, {
                "id": "78",
                "name": "Chestnut Hill Avenue"
            }, {
                "id": "79",
                "name": "Museum of Fine Arts"
            }, {
                "id": "80",
                "name": "Dean Road"
            }, {
                "id": "81",
                "name": "Englewood Avenue"
            }, {
                "id": "82",
                "name": "Ruggles"
            }, {
                "id": "83",
                "name": "Cleveland Circle"
            }, {
                "id": "84",
                "name": "Longwood Medical Area"
            }, {
                "id": "85",
                "name": "Beaconsfield"
            }, {
                "id": "86",
                "name": "Reservoir"
            }, {
                "id": "87",
                "name": "Brigham Circle"
            }, {
                "id": "88",
                "name": "Fenwood Road"
            }, {
                "id": "89",
                "name": "Mission Park"
            }, {
                "id": "90",
                "name": "Brookline Village"
            }, {
                "id": "91",
                "name": "Brookline Hills"
            }, {
                "id": "92",
                "name": "Riverway"
            }, {
                "id": "93",
                "name": "Roxbury Crossing"
            }, {
                "id": "94",
                "name": "Andrew"
            }, {
                "id": "95",
                "name": "Back Of The Hill"
            }, {
                "id": "96",
                "name": "Heath Street"
            }, {
                "id": "97",
                "name": "Jackson Square"
            }, {
                "id": "98",
                "name": "JFK / UMass"
            }, {
                "id": "99",
                "name": "Stony Brook"
            }, {
                "id": "100",
                "name": "Savin Hill"
            }, {
                "id": "101",
                "name": "Green Street"
            }, {
                "id": "102",
                "name": "Forest Hills"
            }, {
                "id": "103",
                "name": "Fields Corner"
            }, { 
                "name": "Shawmut"
            }, {
                "id": "105",
                "name": "Ashmont"
            }, {
                "id": "106",
                "name": "Cedar Grove"
            }, {
                "id": "107",
                "name": "Butler Street"
            }, {
                "id": "108",
                "name": "Milton"
            }, {
                "id": "109",
                "name": "Central Avenue"
            }, {
                "id": "110",
                "name": "Valley Road"
            }, {
                "id": "111",
                "name": "Capen Street"
            }, {
                "id": "112",
                "name": "Mattapan"
            }, {
                "id": "113",
                "name": "Chesnut Hill"
            }, {
                "id": "114",
                "name": "Newton Center"
            }, {
                "id": "115",
                "name": "Newton Highlands"
            }, {
                "id": "116",
                "name": "Eliot"
            }, {
                "id": "117",
                "name": "Waban"
            }, {
                "id": "118",
                "name": "Woodland"
            }, {
                "id": "119",
                "name": "Riverside"
            }, {
                "id": "120",
                "name": "North Quincy"
            }, {
                "id": "121",
                "name": "Wollaston"
            }, {
                "id": "122",
                "name": "Quincy Center"
            }, {
                "id": "123",
                "name": "Quincy Adams"
            }, {
                "id": "124",
                "name": "Braintree"
        }];

        let rails = [
            {
                "line": "Orange",
                "src": "1",
                "dest": "0"
            }, {
                "line": "Orange",
                "src": "1",
                "dest": "2"
            }, {
                "line": "Orange",
                "src": "2",
                "dest": "1"
            }, {
                "line": "Orange",
                "src": "2",
                "dest": "5"
            }, {
                "line": "Blue",
                "src": "3",
                "dest": "0"
            }, {
                "line": "Blue",
                "src": "3",
                "dest": "4"
            }, {
                "line": "Blue",
                "src": "4",
                "dest": "3"
            }, {
                "line": "Blue",
                "src": "4",
                "dest": "6"
            }, {
                "line": "Orange",
                "src": "5",
                "dest": "2"
            }, {
                "line": "Orange",
                "src": "5",
                "dest": "12"
            }, {
                "line": "Blue",
                "src": "6",
                "dest": "4"
            }, {
                "line": "Blue",
                "src": "6",
                "dest": "9"
            }, {
                "line": "Red",
                "src": "7",
                "dest": "8"
            }, {
                "line": "Red",
                "src": "7",
                "dest": "10"
            }, {
                "line": "Red",
                "src": "8",
                "dest": "0"
            }, {
                "line": "Red",
                "src": "8",
                "dest": "7"
            }, {
                "line": "Blue",
                "src": "9",
                "dest": "6"
            }, {
                "line": "Blue",
                "src": "9",
                "dest": "11"
            }, {
                "line": "Red",
                "src": "10",
                "dest": "7"
            }, {
                "line": "Red",
                "src": "10",
                "dest": "14"
            }, {
                "line": "Blue",
                "src": "11",
                "dest": "9"
            }, {
                "line": "Blue",
                "src": "11",
                "dest": "13"
            }, {
                "line": "Orange",
                "src": "12",
                "dest": "5"
            }, {
                "line": "Orange",
                "src": "12",
                "dest": "15"
            }, {
                "line": "Blue",
                "src": "13",
                "dest": "11"
            }, {
                "line": "Blue",
                "src": "13",
                "dest": "16"
            }, {
                "line": "Red",
                "src": "14",
                "dest": "10"
            }, {
                "line": "Red",
                "src": "14",
                "dest": "21"
            }, {
                "line": "Orange",
                "src": "15",
                "dest": "12"
            }, {
                "line": "Orange",
                "src": "15",
                "dest": "20"
            }, {
                "line": "Blue",
                "src": "16",
                "dest": "13"
            }, {
                "line": "Blue",
                "src": "16",
                "dest": "18"
            }, {
                "line": "Green",
                "src": "17",
                "dest": "0"
            }, {
                "line": "Green",
                "src": "17",
                "dest": "19"
            }, {
                "line": "Blue",
                "src": "18",
                "dest": "16"
            }, {
                "line": "Blue",
                "src": "18",
                "dest": "26"
            }, {
                "line": "Green",
                "src": "19",
                "dest": "17"
            }, {
                "line": "Green",
                "src": "19",
                "dest": "20"
            }, {
                "line": "Green",
                "src": "20",
                "dest": "19"
            }, {
                "line": "Green",
                "src": "20",
                "dest": "22"
            }, {
                "line": "Orange",
                "src": "20",
                "dest": "15"
            }, {
                "line": "Orange",
                "src": "20",
                "dest": "22"
            }, {
                "line": "Red",
                "src": "21",
                "dest": "14"
            }, {
                "line": "Red",
                "src": "21",
                "dest": "23"
            }, {
                "line": "Green",
                "src": "22",
                "dest": "20"
            }, {
                "line": "Green",
                "src": "22",
                "dest": "27"
            }, {
                "line": "Orange",
                "src": "22",
                "dest": "20"
            }, {
                "line": "Orange",
                "src": "22",
                "dest": "28"
            }, {
                "line": "Red",
                "src": "23",
                "dest": "21"
            }, {
                "line": "Red",
                "src": "23",
                "dest": "25"
            }, {
                "line": "Blue",
                "src": "24",
                "dest": "0"
            }, {
                "line": "Blue",
                "src": "24",
                "dest": "27"
            }, {
                "line": "Red",
                "src": "25",
                "dest": "23"
            }, {
                "line": "Red",
                "src": "25",
                "dest": "29"
            }, {
                "line": "Blue",
                "src": "26",
                "dest": "18"
            }, {
                "line": "Blue",
                "src": "26",
                "dest": "28"
            }, {
                "line": "Green",
                "src": "27",
                "dest": "22"
            }, {
                "line": "Green",
                "src": "27",
                "dest": "29"
            }, {
                "line": "Blue",
                "src": "27",
                "dest": "24"
            }, {
                "line": "Blue",
                "src": "27",
                "dest": "28"
            }, {
                "line": "Blue",
                "src": "28",
                "dest": "26"
            }, {
                "line": "Blue",
                "src": "28",
                "dest": "27"
            }, {
                "line": "Orange",
                "src": "28",
                "dest": "22"
            }, {
                "line": "Orange",
                "src": "28",
                "dest": "30"
            }, {
                "line": "Red",
                "src": "29",
                "dest": "25"
            }, {
                "line": "Red",
                "src": "29",
                "dest": "30"
            }, {
                "line": "Green",
                "src": "29",
                "dest": "31"
            }, {
                "line": "Green",
                "src": "29",
                "dest": "27"
            }, {
                "line": "Red",
                "src": "30",
                "dest": "33"
            }, {
                "line": "Red",
                "src": "30",
                "dest": "29"
            }, {
                "line": "Orange",
                "src": "30",
                "dest": "32"
            }, {
                "line": "Orange",
                "src": "30",
                "dest": "28"
            }, {
                "line": "Green",
                "src": "31",
                "dest": "34"
            }, {
                "line": "Green",
                "src": "31",
                "dest": "29"
            }, {
                "line": "Orange",
                "src": "32",
                "dest": "44"
            }, {
                "line": "Orange",
                "src": "32",
                "dest": "30"
            }, {
                "line": "Red",
                "src": "33",
                "dest": "60"
            }, {
                "line": "Red",
                "src": "33",
                "dest": "30"
            }, {
                "line": "Green",
                "src": "34",
                "dest": "41"
            }, {
                "line": "Green",
                "src": "34",
                "dest": "31"
            }, {
                "line": "GreenB",
                "src": "35",
                "dest": "36"
            }, {
                "line": "GreenB",
                "src": "35",
                "dest": "37"
            }, {
                "line": "GreenB",
                "src": "36",
                "dest": "40"
            }, {
                "line": "GreenB",
                "src": "36",
                "dest": "35"
            }, {
                "line": "GreenB",
                "src": "37",
                "dest": "35"
            }, {
                "line": "GreenB",
                "src": "37",
                "dest": "38"
            }, {
                "line": "GreenB",
                "src": "38",
                "dest": "37"
            }, {
                "line": "GreenB",
                "src": "38",
                "dest": "39"
            }, {
                "line": "GreenB",
                "src": "39",
                "dest": "38"
            }, {
                "line": "GreenB",
                "src": "39",
                "dest": "43"
            }, {
                "line": "GreenB",
                "src": "40",
                "dest": "42"
            }, {
                "line": "GreenB",
                "src": "40",
                "dest": "36"
            }, {
                "line": "GreenB",
                "src": "41",
                "dest": "51"
            }, {
                "line": "GreenB",
                "src": "41",
                "dest": "34"
            }, {
                "line": "GreenC",
                "src": "41",
                "dest": "51"
            }, {
                "line": "GreenC",
                "src": "41",
                "dest": "34"
            }, {
                "line": "GreenD",
                "src": "41",
                "dest": "51"
            }, {
                "line": "GreenD",
                "src": "41",
                "dest": "34"
            }, {
                "line": "GreenE",
                "src": "41",
                "dest": "53"
            }, {
                "line": "GreenE",
                "src": "41",
                "dest": "34"
            }, {
                "line": "GreenB",
                "src": "42",
                "dest": "48"
            }, {
                "line": "GreenB",
                "src": "42",
                "dest": "40"
            }, {
                "line": "GreenB",
                "src": "43",
                "dest": "39"
            }, {
                "line": "GreenB",
                "src": "43",
                "dest": "45"
            }, {
                "line": "Orange",
                "src": "44",
                "dest": "52"
            }, {
                "line": "Orange",
                "src": "44",
                "dest": "32"
            }, {
                "line": "GreenB",
                "src": "45",
                "dest": "43"
            }, {
                "line": "GreenB",
                "src": "45",
                "dest": "46"
            }, {
                "line": "GreenB",
                "src": "46",
                "dest": "45"
            }, {
                "line": "GreenB",
                "src": "46",
                "dest": "47"
            }, {
                "line": "GreenB",
                "src": "47",
                "dest": "46"
            }, {
                "line": "GreenB",
                "src": "47",
                "dest": "51"
            }, {
                "line": "GreenC",
                "src": "47",
                "dest": "54"
            }, {
                "line": "GreenC",
                "src": "47",
                "dest": "51"
            }, {
                "line": "GreenD",
                "src": "47",
                "dest": "57"
            }, {
                "line": "GreenD",
                "src": "47",
                "dest": "51"
            }, {
                "line": "GreenB",
                "src": "48",
                "dest": "50"
            }, {
                "line": "GreenB",
                "src": "48",
                "dest": "42"
            }, {
                "line": "GreenB",
                "src": "49",
                "dest": "55"
            }, {
                "line": "GreenB",
                "src": "49",
                "dest": "50"
            }, {
                "line": "GreenB",
                "src": "50",
                "dest": "49"
            }, {
                "line": "GreenB",
                "src": "50",
                "dest": "48"
            }, {
                "line": "GreenB",
                "src": "51",
                "dest": "47"
            }, {
                "line": "GreenB",
                "src": "51",
                "dest": "41"
            }, {
                "line": "Orange",
                "src": "52",
                "dest": "64"
            }, {
                "line": "Orange",
                "src": "52",
                "dest": "44"
            }, {
                "line": "GreenE",
                "src": "53",
                "dest": "62"
            }, {
                "line": "GreenE",
                "src": "53",
                "dest": "41"
            }, {
                "line": "GreenC",
                "src": "54",
                "dest": "56"
            }, {
                "line": "GreenC",
                "src": "54",
                "dest": "47"
            }, {
                "line": "GreenB",
                "src": "55",
                "dest": "59"
            }, {
                "line": "GreenB",
                "src": "55",
                "dest": "49"
            }, {
                "line": "GreenC",
                "src": "56",
                "dest": "58"
            }, {
                "line": "GreenC",
                "src": "56",
                "dest": "54"
            }, {
                "line": "GreenD",
                "src": "57",
                "dest": "65"
            }, {
                "line": "GreenD",
                "src": "57",
                "dest": "47"
            }, {
                "line": "GreenC",
                "src": "58",
                "dest": "61"
            }, {
                "line": "GreenC",
                "src": "58",
                "dest": "56"
            }, {
                "line": "GreenB",
                "src": "59",
                "dest": "66"
            }, {
                "line": "GreenB",
                "src": "59",
                "dest": "55"
            }, {
                "line": "Red",
                "src": "60",
                "dest": "94"
            }, {
                "line": "Red",
                "src": "60",
                "dest": "33"
            }, {
                "line": "GreenC",
                "src": "61",
                "dest": "63"
            }, {
                "line": "GreenC",
                "src": "61",
                "dest": "58"
            }, {
                "line": "GreenE",
                "src": "62",
                "dest": "70"
            }, {
                "line": "GreenE",
                "src": "62",
                "dest": "53"
            }, {
                "line": "GreenC",
                "src": "63",
                "dest": "68"
            }, {
                "line": "GreenC",
                "src": "63",
                "dest": "61"
            }, {
                "line": "Orange",
                "src": "64",
                "dest": "82"
            }, {
                "line": "Orange",
                "src": "64",
                "dest": "52"
            }, {
                "line": "GreenD",
                "src": "65",
                "dest": "90"
            }, {
                "line": "GreenD",
                "src": "65",
                "dest": "57"
            }, {
                "line": "GreenB",
                "src": "66",
                "dest": "67"
            }, {
                "line": "GreenB",
                "src": "66",
                "dest": "59"
            }, {
                "line": "GreenB",
                "src": "67",
                "dest": "71"
            }, {
                "line": "GreenB",
                "src": "67",
                "dest": "66"
            }, {
                "line": "GreenC",
                "src": "68",
                "dest": "73"
            }, {
                "line": "GreenC",
                "src": "68",
                "dest": "63"
            }, {
                "line": "GreenB",
                "src": "69",
                "dest": "0"
            }, {
                "line": "GreenB",
                "src": "69",
                "dest": "72"
            }, {
                "line": "GreenE",
                "src": "70",
                "dest": "79"
            }, {
                "line": "GreenE",
                "src": "70",
                "dest": "62"
            }, {
                "line": "GreenB",
                "src": "71",
                "dest": "78"
            }, {
                "line": "GreenB",
                "src": "71",
                "dest": "67"
            }, {
                "line": "GreenB",
                "src": "72",
                "dest": "69"
            }, {
                "line": "GreenB",
                "src": "72",
                "dest": "75"
            }, {
                "line": "GreenC",
                "src": "73",
                "dest": "74"
            }, {
                "line": "GreenC",
                "src": "73",
                "dest": "68"
            }, {
                "line": "GreenC",
                "src": "74",
                "dest": "76"
            }, {
                "line": "GreenC",
                "src": "74",
                "dest": "73"
            }, {
                "line": "GreenB",
                "src": "75",
                "dest": "72"
            }, {
                "line": "GreenB",
                "src": "75",
                "dest": "78"
            }, {
                "line": "GreenC",
                "src": "76",
                "dest": "77"
            }, {
                "line": "GreenC",
                "src": "76",
                "dest": "74"
            }, {
                "line": "GreenC",
                "src": "77",
                "dest": "80"
            }, {
                "line": "GreenC",
                "src": "77",
                "dest": "76"
            }, {
                "line": "GreenB",
                "src": "78",
                "dest": "75"
            }, {
                "line": "GreenB",
                "src": "78",
                "dest": "71"
            }, {
                "line": "GreenE",
                "src": "79",
                "dest": "84"
            }, {
                "line": "GreenE",
                "src": "79",
                "dest": "70"
            }, {
                "line": "GreenC",
                "src": "80",
                "dest": "81"
            }, {
                "line": "GreenC",
                "src": "80",
                "dest": "77"
            }, {
                "line": "GreenC",
                "src": "81",
                "dest": "83"
            }, {
                "line": "GreenC",
                "src": "81",
                "dest": "80"
            }, {
                "line": "Orange",
                "src": "82",
                "dest": "93"
            }, {
                "line": "Orange",
                "src": "82",
                "dest": "64"
            }, {
                "line": "GreenC",
                "src": "83",
                "dest": "0"
            }, {
                "line": "GreenC",
                "src": "83",
                "dest": "81"
            }, {
                "line": "GreenE",
                "src": "84",
                "dest": "87"
            }, {
                "line": "GreenE",
                "src": "84",
                "dest": "79"
            }, {
                "line": "GreenD",
                "src": "85",
                "dest": "86"
            }, {
                "line": "GreenD",
                "src": "85",
                "dest": "91"
            }, {
                "line": "GreenD",
                "src": "86",
                "dest": "113"
            }, {
                "line": "GreenD",
                "src": "86",
                "dest": "85"
            }, {
                "line": "GreenE",
                "src": "87",
                "dest": "88"
            }, {
                "line": "GreenE",
                "src": "87",
                "dest": "84"
            }, {
                "line": "GreenE",
                "src": "88",
                "dest": "89"
            }, {
                "line": "GreenE",
                "src": "88",
                "dest": "87"
            }, {
                "line": "GreenE",
                "src": "89",
                "dest": "92"
            }, {
                "line": "GreenE",
                "src": "89",
                "dest": "88"
            }, {
                "line": "GreenD",
                "src": "90",
                "dest": "91"
            }, {
                "line": "GreenD",
                "src": "90",
                "dest": "65"
            }, {
                "line": "GreenD",
                "src": "91",
                "dest": "85"
            }, {
                "line": "GreenD",
                "src": "91",
                "dest": "90"
            }, {
                "line": "GreenE",
                "src": "92",
                "dest": "95"
            }, {
                "line": "GreenE",
                "src": "92",
                "dest": "89"
            }, {
                "line": "Orange",
                "src": "93",
                "dest": "97"
            }, {
                "line": "Orange",
                "src": "93",
                "dest": "82"
            }, {
                "line": "Red",
                "src": "94",
                "dest": "98"
            }, {
                "line": "Red",
                "src": "94",
                "dest": "60"
            }, {
                "line": "GreenE",
                "src": "95",
                "dest": "96"
            }, {
                "line": "GreenE",
                "src": "95",
                "dest": "92"
            }, {
                "line": "GreenE",
                "src": "96",
                "dest": "0"
            }, {
                "line": "GreenE",
                "src": "96",
                "dest": "95"
            }, {
                "line": "Orange",
                "src": "97",
                "dest": "99"
            }, {
                "line": "Orange",
                "src": "97",
                "dest": "93"
            }, {
                "line": "RedA",
                "src": "98",
                "dest": "100"
            }, {
                "line": "RedA",
                "src": "98",
                "dest": "94"
            }, {
                "line": "RedB",
                "src": "98",
                "dest": "120"
            }, {
                "line": "RedB",
                "src": "98",
                "dest": "94"
            }, {
                "line": "Orange",
                "src": "99",
                "dest": "101"
            }, {
                "line": "Orange",
                "src": "99",
                "dest": "97"
            }, {
                "line": "RedA",
                "src": "100",
                "dest": "103"
            }, {
                "line": "RedA",
                "src": "100",
                "dest": "98"
            }, {
                "line": "Orange",
                "src": "101",
                "dest": "102"
            }, {
                "line": "Orange",
                "src": "101",
                "dest": "99"
            }, {
                "line": "Orange",
                "src": "102",
                "dest": "0"
            }, {
                "line": "Orange",
                "src": "102",
                "dest": "101"
            }, {
                "line": "RedA",
                "src": "103",
                "dest": "104"
            }, {
                "line": "RedA",
                "src": "103",
                "dest": "100"
            }, {
                "line": "RedA",
                "src": "104",
                "dest": "105"
            }, {
                "line": "RedA",
                "src": "104",
                "dest": "103"
            }, {
                "line": "RedA",
                "src": "105",
                "dest": "0"
            }, {
                "line": "RedA",
                "src": "105",
                "dest": "104"
            }, {
                "line": "Mattapan",
                "src": "105",
                "dest": "106"
            }, {
                "line": "Mattapan",
                "src": "105",
                "dest": "0"
            }, {
                "line": "Mattapan",
                "src": "106",
                "dest": "107"
            }, {
                "line": "Mattapan",
                "src": "106",
                "dest": "105"
            }, {
                "line": "Mattapan",
                "src": "107",
                "dest": "108"
            }, {
                "line": "Mattapan",
                "src": "107",
                "dest": "106"
            }, {
                "line": "Mattapan",
                "src": "108",
                "dest": "109"
            }, {
                "line": "Mattapan",
                "src": "108",
                "dest": "107"
            }, {
                "line": "Mattapan",
                "src": "109",
                "dest": "110"
            }, {
                "line": "Mattapan",
                "src": "109",
                "dest": "108"
            }, {
                "line": "Mattapan",
                "src": "110",
                "dest": "111"
            }, {
                "line": "Mattapan",
                "src": "110",
                "dest": "109"
            }, {
                "line": "Mattapan",
                "src": "111",
                "dest": "112"
            }, {
                "line": "Mattapan",
                "src": "111",
                "dest": "110"
            }, {
                "line": "Mattapan",
                "src": "112",
                "dest": "0"
            }, {
                "line": "Mattapan",
                "src": "112",
                "dest": "111"
            }, {
                "line": "GreenD",
                "src": "113",
                "dest": "114"
            }, {
                "line": "GreenD",
                "src": "113",
                "dest": "86"
            }, {
                "line": "GreenD",
                "src": "114",
                "dest": "115"
            }, {
                "line": "GreenD",
                "src": "114",
                "dest": "113"
            }, {
                "line": "GreenD",
                "src": "115",
                "dest": "116"
            }, {
                "line": "GreenD",
                "src": "115",
                "dest": "114"
            }, {
                "line": "GreenD",
                "src": "116",
                "dest": "117"
            }, {
                "line": "GreenD",
                "src": "116",
                "dest": "115"
            }, {
                "line": "GreenD",
                "src": "117",
                "dest": "118"
            }, {
                "line": "GreenD",
                "src": "117",
                "dest": "116"
            }, {
                "line": "GreenD",
                "src": "118",
                "dest": "119"
            }, {
                "line": "GreenD",
                "src": "118",
                "dest": "117"
            }, {
                "line": "GreenD",
                "src": "119",
                "dest": "0"
            }, {
                "line": "GreenD",
                "src": "119",
                "dest": "118"
            }, {
                "line": "RedB",
                "src": "120",
                "dest": "121"
            }, {
                "line": "RedB",
                "src": "120",
                "dest": "98"
            }, {
                "line": "RedB",
                "src": "121",
                "dest": "122"
            }, {
                "line": "RedB",
                "src": "121",
                "dest": "120"
            }, {
                "line": "RedB",
                "src": "122",
                "dest": "123"
            }, {
                "line": "RedB",
                "src": "122",
                "dest": "121"
            }, {
                "line": "RedB",
                "src": "123",
                "dest": "124"
            }, {
                "line": "RedB",
                "src": "123",
                "dest": "122"
            }, {
                "line": "RedB",
                "src": "124",
                "dest": "0"
            }, {
                "line": "RedB",
                "src": "124",
                "dest": "123"
        }];

        stations.forEach(s => metro.addVertex(new Station(s.id, s.name)));
        rails.forEach(r => metro.addArc(new Rail(r.src, r.dest, r.line)));

        return metro;
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
