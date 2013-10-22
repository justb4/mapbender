(function($) {
    OpenLayers.ProxyHost = Mapbender.configuration.application.urls.proxy + '?url=';
    $.widget("mapbender.mbMap", {
        options: {
            poiIcon: {
                image: 'bundles/mapbendercore/image/marker_fett.gif',
                width: 60,
                height: 60,
                xoffset: -32,
                yoffset: -32
            }
        },
        model: null,
        map: null,
        readyState: false,
        readyCallbacks: [],

        /**
         * Creates the map widget
         */
        _create: function() {
            // @TODO: This works around the fake layerset for now
            if(this.options.layerset === null) {
                var layersetIds = [];
                $.each(Mapbender.configuration.layersets, function(key, val) {
                    layersetIds.push(key);
                });
                this.option('layerset', layersetIds[0]);
            }
            var self = this,
            me = $(this.element);
            this.model = Mapbender.Model;
            this.model.init(this);

            this.options = {
                layerDefs: []
            }; // romove all options
            this.map = me.data('mapQuery');
            self._trigger('ready');
            this._ready();
        },
        /**
         * DEPRECATED
         */
        "goto": function(options) {
            this.map.center(options);
        },

        setExtent: function(extent){
            this.model.extent = extent;
        },
        setMaxExtent: function(extent, projection){
            if(typeof projection === "string")
                this.model.mapMaxExtent = {
                    projection: this.model.getProj(projection),
                    extent: extent
                };
            else
                this.model.mapMaxExtent = {
                    projection: projection,
                    extent: extent
                };
        },
        /**
         *
         */
        getMapState: function(){
            return this.model.getMapState();
        },

        sourceById: function(idObject){
            return this.model.getSource(idObject);
        },

        mqLayerBySourceId: function(idObject){
            var source = this.sourceById(idObject);
            return this.map.layersList[source.mqlid];
        },

        /**
         *
         */
        addSource: function(sourceDef){
            this.model.addSource({add: {sourceDef: sourceDef, before: null, after: null}});
        },
        /**
         *
         */
        removeSource: function(toChangeObj){
//            if(toChangeObj && toChangeObj.source && toChangeObj.type){
//                this.model.removeSource(toChangeObj);
//            }
//            {remove: {sourceIdx: {id: source.id}}}
            if(toChangeObj && toChangeObj.remove && toChangeObj.remove.sourceIdx){
                this.model.removeSource(toChangeObj);
            }
        },

        /**
         *
         */
        removeAllSources: function(withBaseSource){
            if(typeof withBaseSource === 'undefined'){
                withBaseSource = true;
            }
            var toRemoveArr = [];
            for(var i = 0; i < this.model.sourceTree.length; i++){
                var source = this.model.sourceTree[i];
                if(!source.configuration.isBaseSource || (source.configuration.isBaseSource && withBaseSource)){
//                    var toremove = this.model.createToChangeObj(source);
//                    toRemoveArr.push(toremove);
                    toRemoveArr.push({remove: {sourceIdx: {id: source.id}}});
                }
            }
            for(var i = 0; i < toRemoveArr.length; i++){
                this.removeSource(toRemoveArr[i]);
            }
        },

        /**
         *
         */
        changeSource: function(toChangeObj){
            if(toChangeObj && toChangeObj.source && toChangeObj.type){
                this.model.changeSource(toChangeObj);
            }
        },
        /**
         * Triggers an event from the model.
         * options.name - name of the event,
         * options.value - parameter in the form of:
         * options.value.mapquerylayer - for a MapQuery.Layer,
         * options.value.source - for a source from the model.sourceTree,
         * options.value.tochange - for a "tochange" object
         * (see model.createToChangeObj(id)),
         * options.value.changed -  for a "changed" object
         * (see model.createChangedObj(id)).
         */
        fireModelEvent: function(options){
//            window.console && console.log(options.name, options.value);
            this._trigger(options.name, null, options.value);
        },
        /**
         * Returns a sourceTree from model.
         **/
        getSourceTree: function() {
            return this.model.sourceTree;
        },
        /**
         * Reterns the generated source id from model
         */
        genereateSourceId: function() {
            return this.model.generateSourceId();
        },
        /**
         * Returns all defined srs
         */
        getAllSrs: function(){
            return this.model.getAllSrs();
        },
        /**
         * Reterns the model
         */
        getModel: function(){
            return this.model;
        },

        getCenterOptions: function(){
            return {center: this.map.olMap.getCenter(), zoom: this.map.olMap.getZoom()};
        },

        setCenter: function(options){
            if(typeof options.box !== 'undefined' && typeof options.position !== 'undefined' && typeof options.zoom !== 'undefined')
                this.map.center(options);
            else if(typeof options.center !== 'undefined' && typeof options.zoom !== 'undefined'){
                this.map.olMap.updateSize();
                this.map.olMap.setCenter(options.center, options.zoom);
            }
        },

        /*
         * Changes the map's projection.
         */
        changeProjection: function(srs){
            if(typeof srs === "string")
                this.model.changeProjection({projection: this.model.getProj(srs)});
            else
                this.model.changeProjection({projection: srs});
        },
        /**
         * Zooms the map in
         */
        zoomIn: function() {
            // TODO: MapQuery?
            this.map.olMap.zoomIn();
        },
        /**
         * Zooms the map out
         */
        zoomOut: function() {
            // TODO: MapQuery?
            this.map.olMap.zoomOut();
        },
        /**
         * Zooms the map to max extent
         */
        zoomToFullExtent: function() {
            // TODO: MapQuery?
            this.map.olMap.zoomToMaxExtent();
        },
        /**
         * Zooms the map to extent
         */
        zoomToExtent: function(extent, scale) {
            //TODO: MapQuery?
            this.map.olMap.zoomToExtent(extent);
            if(scale) {
                this.map.olMap.zoomToScale(scale, true);
            }
        },
        /**
         * Zooms the map to scale
         */
        zoomToScale: function(scale) {
            this.map.olMap.zoomToScale(scale, true);
        },
        /**
         *
         */
        panMode: function() {
            this.map.mode('pan');
        },
        /**
         * Adds the popup
         */
        addPopup: function(popup) {
            //TODO: MapQuery
            this.map.olMap.addPopup(popup);
        },
        /**
         * Removes the popup
         */
        removePopup: function(popup) {
            //TODO: MapQuery
            this.map.olMap.removePopup(popup);
        },
        /**
         * Returns the scale list
         */
        scales: function() {
            var scales = [];
            for(var i = 0; i < this.map.olMap.getNumZoomLevels(); ++i) {
                var res = this.map.olMap.getResolutionForZoom(i);
                scales.push(OpenLayers.Util.getScaleFromResolution(res, this.map.olMap.units));
            }
            return scales;
        },
        /**
         *
         */
        ready: function(callback) {
            if(this.readyState === true) {
                callback();
            } else {
                this.readyCallbacks.push(callback);
            }
        },
        /**
         *
         */
        _ready: function() {
            for(callback in this.readyCallbacks) {
                callback();
                delete(this.readyCallbacks[callback]);
            }
            this.readyState = true;
        },
        /**
         * Turns on the highlight layer at map
         */
        highlightOn: function(features, options) {
            this.model.highlightOn(features, options);
        },
        /**
         * Turns off the highlight layer at map
         */
        highlightOff: function() {
            this.model.highlightOff();
        }
    });

})(jQuery);

$('body').delegate(':input', 'keydown', function(event) {
    event.stopPropagation();
});