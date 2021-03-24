'use strict';

let model = new Model();
let view = new View(model.getStations());

view.setFindRouteBtnHandler(() => {
    let src = view.selectedSrcId(),
        dest = view.selectedDestId(),
        route = model.findRoute(src, dest);

    view.displayRoute(route);
});