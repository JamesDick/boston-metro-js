class View {
    constructor(stations) {
        console.log(JSON.stringify(stations));

        this._srcLst = $('#srcLst');
        this._destLst = $('#destLst');
        this._routeLst = $('#routeLst');
        this._findRouteBtn = $('#findRouteBtn');

        for (let station of stations) {
            let option = $('<option/>', { value : station.id }).text(station.name);
            this._srcLst.append(option);
            this._destLst.append(option.clone());
        }
    }

    selectedSrcId() {
        return this._srcLst.val();
    }

    selectedDestId() {
        return this._destLst.val();
    }

    displayRoute(stations) {
        this.clearRoute();
        for (let station of stations) {
            this._routeLst.append(`<li>${station.name}</li>`);
        }
    }

    clearRoute() {
        this._routeLst.empty();
    }

    setFindRouteBtnHandler(handler) {
        this._findRouteBtn.on('click', handler);
    }
}