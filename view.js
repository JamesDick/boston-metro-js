class View {
    constructor(stations) {
        console.log(JSON.stringify(stations));

        this._srcLst = document.getElementById('srcLst');
        this._destLst = document.getElementById('destLst');
        this._routeLst = document.getElementById('routeLst');
        this._findRouteBtn = document.getElementById('findRouteBtn');

        for (let station of stations) {
            let option = document.createElement('option');
            option.value = station.id;
            option.text = station.name;
            this._srcLst.add(option);
            this._destLst.add(option.cloneNode(true));
        }
    }

    selectedSrcId() {
        return this._srcLst.value;
    }

    selectedDestId() {
        return this._destLst.value;
    }

    displayRoute(stations) {
        this.clearRoute();
        for (let station of stations) {
            let option = document.createElement('option');
            option.value = station.id;
            option.text = station.name;
            this._routeLst.add(option);
        }
    }

    clearRoute() {
        for (let i = this._routeLst.options.length - 1; i >= 0; i--) {
            this._routeLst.remove(i);
        }
    }

    setFindRouteBtnHandler(handler) {
        this._findRouteBtn.onclick = handler;
    }
}