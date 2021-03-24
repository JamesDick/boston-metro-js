'use strict';

/**
 * Class responsible for manipulating the GUI of the app.
 */
class View {
    /**
     * Creates a new View instance and initialises the elements in the GUI.
     * @param {Station[]} stations The list of Stations which are able to be selected in the GUI.
     */
    constructor(stations) {
        this._srcLst = $('#src-lst');
        this._destLst = $('#dest-lst');

        this._routeDiv = $('#route-div');
        this._routeLst = $('#route-lst');
        this._findRouteBtn = $('#find-route-btn');

        this._helpDiv = $('#help-div');
        this._helpBtn = $('#help-btn');

        this._setSrcDestOptions(stations);
        this._setHelpBtnHandler();
    }

    /**
     * Gets the ID of the Station which has been selected in the Source list.
     * @returns The ID of the selected Source Station.
     */
    selectedSrcId() {
        return this._srcLst.val();
    }

    /**
     * Gets the ID of the Station which has been selected in the Destination list.
     * @returns The ID of the selected Destination Station.
     */
    selectedDestId() {
        return this._destLst.val();
    }

    /**
     * Displays a list of Stations as a route.
     * @param {Station[]} stations The list of Stations to be displayed.
     */
    displayRoute(stations) {
        this._routeDiv.css('display', 'block');
        this._routeLst.empty();
        for (let station of stations) {
            this._routeLst.append(
                $('<li/>').html(`<h5>${station.name}</h5>`)
                          .addClass("list-group-item")
            );
        }
    }

    /**
     * Adds the given handler to the Find Route Button.
     * @param {function} handler The handler to be applied.
     */
    setFindRouteBtnHandler(handler) {
        this._findRouteBtn.on('click', handler);
    }

    /**
     * Populates the Source and Destination selects with each of the given Stations.
     * @param {Station[]} stations The list of Stations to be used.
     */
    _setSrcDestOptions(stations) {
        for (let station of stations) {
            this._srcLst.append($('<option/>', { value : station.id }).text(station.name));
            this._destLst.append($('<option/>', { value : station.id }).text(station.name));
        }
    }

    /**
     * Sets the behaviour of the Help Button.
     * The button should toggle the display of the Help Div.
     */
    _setHelpBtnHandler() {
        const showHelp = () => {
            this._helpDiv.css('display', 'block');
            this._helpBtn.on('click', hideHelp);
        }

        const hideHelp = () => {
            this._helpDiv.css('display', 'none');
            this._helpBtn.on('click', showHelp);
        }

        this._helpBtn.on('click', showHelp);
    }
}