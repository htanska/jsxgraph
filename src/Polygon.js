/*
    Copyright 2008,2009
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt

    This file is part of JSXGraph.

    JSXGraph is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXGraph.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Creates a new instance of Polygon.
 * @class Polygon stores all style and functional properties that are required
 * to draw a polygon on a board.
 * @param {JXG.Board} board Reference to the board the polygon is drawn on.
 * @param {Array} vertices Unique identifiers for the points defining the polygon.
 * Last point must be first point.
 * @param {Array} borders Unique identifiers for the derived borderlines of the polygon
 * @param {String} id Unique identifier for this object.  If null or an empty string is given,
 * an unique id will be generated by Board
 * @param {String} name Not necessarily unique name, displayed on the board.  If null or an
 * empty string is given, an unique name will be generated.
 * @see JXG.Board#addPolygon
 * @constructor
 * @extends JXG.GeometryElement
 */

JXG.Polygon = function (board, vertices, borders, id, name, withLines, withLabel, lineLabels) {
    /* Call the constructor of GeometryElement */
    this.constructor();
    /**
     * Sets type of GeometryElement, value is OBJECT_TYPE_POLYGON.
     * @final
     * @type int
     */ 
    this.type = JXG.OBJECT_TYPE_POLYGON;
    this.elementClass = JXG.OBJECT_CLASS_AREA;                
    
    this.init(board, id, name);
    
    if( (typeof withLines == 'undefined') || (withLines == null) ) {
        withLines = true;
    }
    if( (typeof lineLabels == 'undefined') || (lineLabels == null) ) {
        lineLabels = false;
    }    
        
    /**
     * Is the polygon bordered by lines?
     * @type bool
     */
    this.withLines = withLines;

    /**
     * References to the points defining the polygon.
     * Last vertex is the same as first vertex.
     * 
     * @type Array
     */    
    this.vertices = [];    
    for(var i=0; i<vertices.length; i++) {
       var vertex = JXG.GetReferenceFromParameter(this.board, vertices[i]);
       this.vertices[i] = vertex;
    }
    
    if((typeof borders == 'undefined') || (borders == null)) {
        borders = [];
        for(var i=0; i<vertices.length-1; i++) {
            borders[i] = {};
        }
    }
    
    if(this.vertices[this.vertices.length-1] != this.vertices[0]) {
        this.vertices.push(this.vertices[0]);
        borders.push({});
    }
    
    this.visProp['fillColor'] = this.board.options.polygon.fillColor;
    this.visProp['highlightFillColor'] = this.board.options.polygon.highlightFillColor;
    this.visProp['fillOpacity'] = this.board.options.polygon.fillOpacity;
    this.visProp['highlightFillOpacity'] = this.board.options.polygon.highlightFillOpacity;
    
    var l;
 
    /**
     * References to the borderlines of the polygon.
     * 
     * @type Array
     */  
    this.borders = [];
    if(withLines) {
        for(var i=0; i<this.vertices.length-1; i++) {
            /* create the borderlines */
            l = new JXG.Line(board, this.vertices[i], this.vertices[i+1], borders[i].id, borders[i].name, lineLabels); // keine Labels?
            l.setStraight(false,false); // Strecke
            this.borders[i] = l;
            l.parentPolygon = this;
        }
    }
    
    /* Add polygon as child to defining points */
    for(var i=0; i<this.vertices.length-1; i++) { // last vertex is first vertex
        var vertex = JXG.GetReferenceFromParameter(this.board, this.vertices[i]);
        vertex.addChild(this);
    }
    
    // create label 
    this.createLabel(withLabel);
    
    /* Register polygon at board */
    this.id = this.board.addPolygon(this);
};
JXG.Polygon.prototype = new JXG.GeometryElement;

/**
 * Checks whether (x,y) is near the polygon.
 * @param {int} x Coordinate in x direction, screen coordinates.
 * @param {int} y Coordinate in y direction, screen coordinates.
 * @return {bool} Always false, because the polygons interior shall not be highlighted
 */
JXG.Polygon.prototype.hasPoint = function (x,y) {
    return false;
};

/**
 * Uses the boards renderer to update the polygon.
 */
JXG.Polygon.prototype.updateRenderer = function () {
    if (this.needsUpdate) {
        this.board.renderer.updatePolygon(this);
        this.needsUpdate = false;
    }
    if(this.hasLabel && this.label.content.visProp['visible']) {
        //this.label.setCoordinates(this.coords);
        this.label.content.update();
        //this.board.renderer.updateLabel(this.label);
        this.board.renderer.updateText(this.label.content);
    }    
};

/**
 * return TextAnchor
 */
JXG.Polygon.prototype.getTextAnchor = function() {
    var a = 0;
    var b = 0;
    var x = 0;
    var y = 0;
    a = x = this.vertices[0].X();
    b = y = this.vertices[0].Y();
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].X() < a)
            a = this.vertices[i].X();
        if (this.vertices[i].X() > x)
            x = this.vertices[i].X();
        if (this.vertices[i].Y() > b)
            b = this.vertices[i].Y();
        if (this.vertices[i].Y() < y)
            y = this.vertices[i].Y();
    }
    return new JXG.Coords(JXG.COORDS_BY_USER, [(a + x)*0.5, (b + y)*0.5], this.board);
};

JXG.Polygon.prototype.getLabelAnchor = function() {
    var a = 0;
    var b = 0;
    var x = 0;
    var y = 0;
    a = x = this.vertices[0].X();
    b = y = this.vertices[0].Y();
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].X() < a)
            a = this.vertices[i].X();
        if (this.vertices[i].X() > x)
            x = this.vertices[i].X();
        if (this.vertices[i].Y() > b)
            b = this.vertices[i].Y();
        if (this.vertices[i].Y() < y)
            y = this.vertices[i].Y();
    }
    return new JXG.Coords(JXG.COORDS_BY_USER, [(a + x)*0.5, (b + y)*0.5], this.board);
}

/**
 * Copy the element to the background.
 */
JXG.Polygon.prototype.cloneToBackground = function(addToTrace) {
    var copy = {};
    copy.id = this.id + 'T' + this.numTraces;
    this.numTraces++;
    copy.vertices = this.vertices;
    copy.visProp = this.visProp;
    
    this.board.renderer.drawPolygon(copy);

    this.traces[copy.id] = $(copy.id);

    delete copy;
};

JXG.createPolygon = function(board, parents, atts) {
    var el;

    if (typeof atts['withLabel']=='undefined') {
        atts['withLabel'] = true;
    }    
    
    // Sind alles Punkte?
    for(var i=0; i<parents.length; i++) {
        parents[i] = JXG.GetReferenceFromParameter(board, parents[i]);
        if(!JXG.IsPoint(parents[i]))
            throw ("Can't create polygon with parent types other than 'point'.");
    }
    
    el = new JXG.Polygon(board, parents, atts["borders"], atts["id"], atts["name"], atts["withLines"],atts['withLabel']);

    return el;
};

JXG.JSXGraph.registerElement('polygon', JXG.createPolygon);

JXG.Polygon.prototype.hideElement = function() {
    this.visProp['visible'] = false;
    this.board.renderer.hide(this);

    if(this.withLines) {
        for(var i=0; i<this.borders.length; i++) {
            this.borders[i].hideElement();
        }
    }
    
    if (this.hasLabel && this.label!=null) {
        this.label.hiddenByParent = true;
        if(this.label.content.visProp['visible']) {
            this.board.renderer.hide(this.label.content);
        }
    }    
}

JXG.Polygon.prototype.showElement = function() {
    this.visProp['visible'] = true;
    this.board.renderer.show(this);

    if(this.withLines) {
        for(var i=0; i<this.borders.length; i++) {
            this.borders[i].showElement();
        }
    }
}
