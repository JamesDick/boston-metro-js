class View {
    constructor(stations) {
        this.setSrcDestOptions(stations);
        this.setHelpBtnHandler();
    }

    selectedSrcId() {
        return $('#srcLst').val();
    }

    selectedDestId() {
        return $('#destLst').val();
    }

    displayRoute(stations) {
        $('#routeLst').empty();
        for (let station of stations) {
            $('#routeLst').append($('<li/>').text(station.name).addClass("list-group-item"));
        }
    }

    setSrcDestOptions(stations) {
        for (let station of stations) {
            $('#srcLst').append($('<option/>', { value : station.id }).text(station.name));
            $('#destLst').append($('<option/>', { value : station.id }).text(station.name));
        }
    }

    setFindRouteBtnHandler(handler) {
        $('#findRouteBtn').on('click', handler);
    }

    setHelpBtnHandler() {
        function showHelp() {
            $('#helpDiv').css('display', 'block');
            $('#helpBtn').on('click', hideHelp);
        }

        function hideHelp() {
            $('#helpDiv').css('display', 'none');
            $('#helpBtn').on('click', showHelp);
        }

        $('#helpBtn').on('click', showHelp);
    }
}