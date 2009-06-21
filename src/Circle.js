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
 * @fileoverview The geometry object Circle is defined in this file. Circle stores all
 * style and functional properties that are required to draw and move a circle on
 * a board.
 * @author graphjs
 * @version 0.1
 */

/**
 * Constructs a new Circle object.
 * @class This is the Cirlce class. 
 * It is derived from @see GeometryElement.
 * It stores all properties required
 * to move, draw a circle.
 * @constructor
 * @param {String,JXG.Board} board The board the new circle is drawn on.
 * @param {String} method Can be 
 * <ul><li> <b>'twoPoints'</b> which means the circle is defined by its midpoint and a point on the circle.</li>
//  * <li><b>'pointRadius'</b> which means the circle is defined by its midpoint and its radius in user units</li>
 * <li><b>'pointLine'</b> which means the circle is defined by its midpoint and its radius given by the distance from the startpoint and the endpoint of the line</li>
 * <li><b>'pointCircle'</b> which means the circle is defined by its midpoint and its radius given by the radius of another circle</li></ul>
 * The parameters p1, p2 and radius must be set according to this method parameter.
 * @param {JXG.Point} p1 Midpoint of the circle.
 * @param {JXG.Point,JXG.Line,JXG.Circle} p2 Can be
 *<ul><li>a point on the circle if method is 'twoPoints'</li>
 <li>a line if the method is 'pointLine'</li>
 <li>a circle if the method is 'pointCircle'</li></ul>
 * @param {float} radius Only used when method is set to 'pointRadius'. Must be a given radius in user units.
 * @param {String} id Unique identifier for this object. If null or an empty string is given,
 * an unique id will be generated by Board
 * @param {String} name Not necessarily unique name. If null or an
 * empty string is given, an unique name will be generated.
 * @see Board#generateName
 */            

JXG.Circle = function (board, method, par1, par2, id, name, withLabel) {
    /* Call the constructor of GeometryElement */
    this.constructor();

    /**
     * Sets type of GeometryElement, value is OBJECT_TYPE_CIRCLE.
     * @final
     * @type int
     */
    this.type = JXG.OBJECT_TYPE_CIRCLE;
    this.elementClass = JXG.OBJECT_CLASS_CIRCLE; 

    this.init(board, id, name);

    /**
     * Stores the given method.
     * Can be 
     * <ul><li><b>'twoPoints'</b> which means the circle is defined by its midpoint and a point on the circle.</li>
     * <li><b>'pointRadius'</b> which means the circle is defined by its midpoint and its radius given in user units or as term</li>
     * <li><b>'pointLine'</b> which means the circle is defined by its midpoint and its radius given by the distance from the startpoint and the endpoint of the line</li>
     * <li><b>'pointCircle'</b> which means the circle is defined by its midpoint and its radius given by the radius of another circle</li></ul>
     * @type string
     * @see #midpoint
     * @see #point2
     * @see #radius
     * @see #line
     * @see #circle
     */
    this.method = method;
    
    /**
     * The circles midpoint.
     * @type JXG.Point
     */    
    this.midpoint = JXG.GetReferenceFromParameter(this.board, par1); 
    this.midpoint.addChild(this);
    
    this.visProp['visible'] = true;
    
    this.visProp['fillColor'] = this.board.options.circle.fillColor;
    this.visProp['highlightFillColor'] = this.board.options.circle.highlightFillColor;
    this.visProp['strokeColor'] = this.board.options.circle.strokeColor;
    this.visProp['highlightStrokeColor'] = this.board.options.circle.highlightStrokeColor;       
    
    /** Point on the circle
     * only set if method is 'twoPoints'
     * @type JXG.Point
     * @see #method
     */
    this.point2 = null;
    
    /** Radius of the circle
     * only set if method is 'pointRadius'
     * @type JXG.Point
     * @see #method     
     */    
    this.radius = 0;
    
    /** Line defining the radius of the circle given by the distance from the startpoint and the endpoint of the line
     * only set if method is 'pointLine'
     * @type JXG.Line
     * @see #method     
     */    
    this.line = null;
    
    /** Circle defining the radius of the circle given by the radius of the other circle
     * only set if method is 'pointLine'
     * @type JXG.Circle
     * @see #method     
     */     
    this.circle = null;

    if(method == 'twoPoints') {
        this.point2 = JXG.GetReferenceFromParameter(board,par2);
        this.point2.addChild(this);
        this.radius = this.getRadius(); 
    }
    else if(method == 'pointRadius') {
        this.generateTerm(par2);  // Converts GEONExT syntax into JavaScript syntax
        this.updateRadius();                        // First evaluation of the graph  
    }
    else if(method == 'pointLine') {
        // dann ist p2 die Id eines Objekts vom Typ Line!
        this.line = JXG.GetReferenceFromParameter(board,par2);
        this.radius = this.line.point1.coords.distance(JXG.COORDS_BY_USER, this.line.point2.coords);    
    }
    else if(method == 'pointCircle') {
        // dann ist p2 die Id eines Objekts vom Typ Circle!
        this.circle = JXG.GetReferenceFromParameter(board,par2);
        this.radius = this.circle.getRadius();     
    } 
    
    // create Label
    this.createLabel(withLabel);
    
    if(method == 'twoPoints') {
        //this.point2 = JXG.GetReferenceFromParameter(board,par2);
        //this.point2.addChild(this);
        //this.radius = this.getRadius(); 
        this.id = this.board.addCircle(this);           
    }
    else if(method == 'pointRadius') {
        //this.generateTerm(par2);  // Converts GEONExT syntax into JavaScript syntax
        //this.updateRadius();                        // First evaluation of the graph
        this.id = this.board.addCircle(this);
        this.notifyParents(par2);      
    }
    else if(method == 'pointLine') {
        // dann ist p2 die Id eines Objekts vom Typ Line!
        //this.line = JXG.GetReferenceFromParameter(board,par2);
        //this.radius = this.line.point1.coords.distance(JXG.COORDS_BY_USER, this.line.point2.coords);
        this.line.addChild(this);
        this.id = this.board.addCircle(this);        
    }
    else if(method == 'pointCircle') {
        // dann ist p2 die Id eines Objekts vom Typ Circle!
        //this.circle = JXG.GetReferenceFromParameter(board,par2);
        //this.radius = this.circle.getRadius();
        this.circle.addChild(this);
        this.id = this.board.addCircle(this);        
    }    
};
JXG.Circle.prototype = new JXG.GeometryElement;

/**
 * Checks whether (x,y) is near the circle.
 * @param {int} x Coordinate in x direction, screen coordinates.
 * @param {int} y Coordinate in y direction, screen coordinates.
 * @return {bool} True if (x,y) is near the circle, False otherwise.
 */
JXG.Circle.prototype.hasPoint = function (x, y) {
    var genauigkeit = this.board.options.precision.hasPoint;
    genauigkeit = genauigkeit/(this.board.unitX*this.board.zoomX); 
    
    var checkPoint = new JXG.Coords(JXG.COORDS_BY_SCREEN, [x,y], this.board);
    var r = this.getRadius();
    
    var dist = Math.sqrt(Math.pow(this.midpoint.coords.usrCoords[1]-checkPoint.usrCoords[1],2) + 
                         Math.pow(this.midpoint.coords.usrCoords[2]-checkPoint.usrCoords[2],2));
   
    return (Math.abs(dist-r) < genauigkeit);
};

JXG.Circle.prototype.generatePolynomial = function (p) {
    /*
     * We have four methods to construct a circle:
     *   (a) Two points
     *   (b) Midpoint and radius
     *   (c) Midpoint and radius given by length of a segment
     *   (d) Midpoint and radius given by another circle
     *
     * In case (b) we have to distinguish two cases:
     *  (i)  radius is given as a number
     *  (ii) radius is given as a function
     * In the latter case there's no guarantee the radius depends on other geometry elements
     * in a polynomial way so this case has to be omitted.
     *
     * Another tricky case is case (d):
     * The radius depends on another circle so we have to cycle through the ancestors of each circle
     * until we reach one that's radius does not depend on another circles radius.
     *
     *
     * All cases (a) to (d) vary only in calculation of the radius. So the basic formulae for
     * a glider G (g1,g2) on a circle with midpoint M (m1,m2) and radius r is just:
     *
     *     (g1-m1)^2 + (g2-m2)^2 - r^2 = 0
     *
     * So the easiest case is (b) with a fixed radius given as a number. The other two cases (a)
     * and (c) are quite the same: Euclidean distance between two points A (a1,a2) and B (b1,b2),
     * squared:
     *
     *     r^2 = (a1-b1)^2 + (a2-b2)^2
     *
     * For case (d) we have to cycle recursively through all defining circles and finally return the
     * formulae for calculating r^2. For that we use JXG.Circle.symbolic.generateRadiusSquared().
     */

    var m1 = this.midpoint.symbolic.x;
    var m2 = this.midpoint.symbolic.y;
    var g1 = p.symbolic.x;
    var g2 = p.symbolic.y;

    var rsq = this.generateRadiusSquared();

    /* No radius can be calculated (Case b.ii) */
    if (rsq == '')
        return [];

    var poly = '(' + g1 + '-' + m1 + ')^2 + (' + g2 + '-' + m2 + ')^2 - (' + rsq + ')';
    return [poly];
}

/**
 * Generate symbolic radius calculation for loci determination with Groebner-Basis algorithm.
 * @type String
 * @return String containing symbolic calculation of the circle's radius or an empty string
 * if the radius can't be expressed in a polynomial equation.
 */
JXG.Circle.prototype.generateRadiusSquared = function () {
    /*
     * Four cases:
     *
     *   (a) Two points
     *   (b) Midpoint and radius
     *   (c) Midpoint and radius given by length of a segment
     *   (d) Midpoint and radius given by another circle
     */

    var rsq = '';

    if (this.method == "twoPoints") {
        var m1 = this.midpoint.symbolic.x;
        var m2 = this.midpoint.symbolic.y;
        var p1 = this.point2.symbolic.x;
        var p2 = this.point2.symbolic.y;

        rsq = '(' + p1 + '-' + m1 + ')^2 + (' + p2 + '-' + m2 + ')^2';
    } else if (this.method == "pointRadius") {
        if (typeof(this.radius) == 'number')
            rsq = '' + this.radius*this.radius;
    } else if (this.method == "pointLine") {
        var p1 = this.line.point1.symbolic.x;
        var p2 = this.line.point1.symbolic.y;

        var q1 = this.line.point2.symbolic.x;
        var q2 = this.line.point2.symbolic.y;

        rsq = '(' + p1 + '-' + q1 + ')^2 + (' + p2 + '-' + q2 + ')^2';
    } else if (this.method == "pointCircle") {
        rsq = this.circle.getRadius();
    }

    return rsq;
}

/**
 * Uses the boards renderer to update the arrow.
 */
JXG.Circle.prototype.update = function () {
    if(this.traced) {
        this.cloneToBackground(true);
    }
    
    if (this.needsUpdate) {
        if(this.method == 'pointLine') {
            this.radius = this.line.point1.coords.distance(JXG.COORDS_BY_USER, this.line.point2.coords); 
        }
        else if(this.method == 'pointCircle') {
            this.radius = this.circle.getRadius();
        }
        else if(this.method == 'pointRadius') {
            this.radius = this.updateRadius();
        }
        if (!this.board.geonextCompatibilityMode) {
            this.updateStdform();
        }
    }
};

JXG.Circle.prototype.updateStdform = function () {
    this.stdform[3] = 0.5;
    this.stdform[4] = this.getRadius();
    this.stdform[1] = -this.midpoint.coords.usrCoords[1];
    this.stdform[2] = -this.midpoint.coords.usrCoords[2];
    this.normalize();
};

/**
 * Uses the boards renderer to update the arrow.
 */
JXG.Circle.prototype.updateRenderer = function () {
/*
    if (this.needsUpdate) {
        this.board.renderer.updateCircle(this);
        this.needsUpdate = false;
    }
*/
    if (this.needsUpdate && this.visProp['visible']) {
        var wasReal = this.isReal;
        this.isReal = (isNaN(this.midpoint.coords.usrCoords[1]+this.midpoint.coords.usrCoords[2]+this.getRadius()))?false:true;
        if (this.isReal) {
            if (wasReal!=this.isReal) { 
                this.board.renderer.show(this); 
                if(this.hasLabel && this.label.content.visProp['visible']) this.board.renderer.show(this.label.content); 
            }
            this.board.renderer.updateCircle(this);
        } else {
            if (wasReal!=this.isReal) { 
                this.board.renderer.hide(this); 
                if(this.hasLabel && this.label.content.visProp['visible']) this.board.renderer.hide(this.label.content); 
            }
        }
        this.needsUpdate = false;
    }
    
    /* Update the label if visible. */
    if(this.hasLabel && this.label.content.visProp['visible'] && this.isReal) {
        //this.label.setCoordinates(this.coords);
        this.label.content.update();
        //this.board.renderer.updateLabel(this.label);
        this.board.renderer.updateText(this.label.content);
    }    
};

JXG.Circle.prototype.generateTerm = function (term) {
    if (typeof term=='string') {
         var elements = this.board.elementsByName;
         // Convert GEONExT syntax into  JavaScript syntax
         var newTerm = this.board.algebra.geonext2JS(term+'');
         this.updateRadius = new Function('return ' + newTerm + ';');
    } else if (typeof term=='number') {
        this.updateRadius = function() { return term; };
    } else { // function
        this.updateRadius = term;
    }
}    

JXG.Circle.prototype.notifyParents = function (contentStr) {
    var res = null;
    var elements = this.board.elementsByName;

    this.board.algebra.findDependencies(this,contentStr+'');
}

/**
 * Calculates the radius of the circle, independent from the used method.
 * @type float
 * @return The radius of the line
 */
JXG.Circle.prototype.getRadius = function() {
    if(this.method == 'twoPoints') {
        return(Math.sqrt(Math.pow(this.midpoint.coords.usrCoords[1]-this.point2.coords.usrCoords[1],2) + Math.pow(this.midpoint.coords.usrCoords[2]-this.point2.coords.usrCoords[2],2)));
    }
    else if(this.method == 'pointLine' || this.method == 'pointCircle') {
        return this.radius;
    }
    else if(this.method == 'pointRadius') {
        return this.updateRadius();
    }
}

/**
 * return TextAnchor
 */
JXG.Circle.prototype.getTextAnchor = function() {
    return this.midpoint.coords;
};

JXG.Circle.prototype.getLabelAnchor = function() {
    if(this.method == 'twoPoints') {
        var deltaX = this.midpoint.coords.usrCoords[1]-this.point2.coords.usrCoords[1];
        var deltaY = this.midpoint.coords.usrCoords[2]-this.point2.coords.usrCoords[2];
        return new JXG.Coords(JXG.COORDS_BY_USER, [this.midpoint.coords.usrCoords[1]+deltaX, this.midpoint.coords.usrCoords[2]+deltaY], this.board);
    }
    else if(this.method == 'pointLine' || this.method == 'pointCircle' || this.method == 'pointRadius') {
        return new JXG.Coords(JXG.COORDS_BY_USER, [this.midpoint.coords.usrCoords[1]-this.getRadius(),this.midpoint.coords.usrCoords[2]], this.board);
    }
};


/**
 * Copy the element to the background.
 */
JXG.Circle.prototype.cloneToBackground = function(addToTrace) {
    var copy = {};
    copy.id = this.id + 'T' + this.numTraces;
    this.numTraces++;
    copy.midpoint = {};
    copy.midpoint.coords = this.midpoint.coords;
    var r = this.getRadius();
    copy.getRadius = function() { return r; };
    copy.board = {};
    copy.board.unitX = this.board.unitX;
    copy.board.unitY = this.board.unitY;
    copy.board.zoomX = this.board.zoomX;
    copy.board.zoomY = this.board.zoomY;

    copy.visProp = this.visProp;
    
    this.board.renderer.drawCircle(copy);
    this.traces[copy.id] = document.getElementById(copy.id);

    delete copy;
};

JXG.Circle.prototype.addTransform = function (transform) {
    var list;
    if (JXG.IsArray(transform)) {
        list = transform;
    } else {
        list = [transform];
    }
    for (var i=0;i<list.length;i++) {
        this.midpoint.transformations.push(list[i]);
        if (this.method == 'twoPoints') {
            this.point2.transformations.push(list[i]);
        }
    }
};

JXG.Circle.prototype.setPosition = function (method, x, y) {
    //if(this.group.length != 0) {
    // AW: Do we need this for lines?
    //} else {
    var t = this.board.createElement('transform',[x,y],{type:'translate'});
    this.addTransform(t);
        //this.update();
    //}
};

/**
* Treat the circle as parametric curve:
* Return X(t)= radius*cos(t)+centerX
* t runs from 0 to 1
*/
JXG.Circle.prototype.X = function (t) {
    t *= 2.0*Math.PI;
    return this.getRadius()*Math.cos(t)+this.midpoint.coords.usrCoords[1];
}

/**
* Treat the circle as parametric curve:
* Return Y(t)= radius*cos(t)+centerX
* t runs from 0 to 1
*/
JXG.Circle.prototype.Y = function (t) {
    t *= 2.0*Math.PI;
    return this.getRadius()*Math.sin(t)+this.midpoint.coords.usrCoords[2];
}

/**
* Treat the circle as parametric curve:
* t runs from 0 to 1
**/
JXG.Circle.prototype.minX = function () {
    return 0.0;
}

/**
* Treat the circle as parametric curve:
* t runs from 0 to 1
**/
JXG.Circle.prototype.maxX = function () {
    return 1.0;
}

JXG.createCircle = function(board, parentArr, atts) {
    var el, p, i;
    if (atts==null) {
        atts={};
    }
    if (typeof atts['withLabel']=='undefined') {
        atts['withLabel'] = true;
    }
    
    p = [];
    for (i=0;i<parentArr.length;i++) {
        if (JXG.IsPoint(parentArr[i])) {
            p[i] = parentArr[i];              // Point
        } else if (parentArr[i].length>1) {
            p[i] = board.createElement('point', parentArr[i], {visible:false,fixed:true});  // Coordinates
        } else {
            p[i] = parentArr[i];              // Something else (number, function, string)
        }
    }
    if( parentArr.length==2 && JXG.IsPoint(p[0]) && JXG.IsPoint(p[1]) ) {
        // Point/Point
        el = new JXG.Circle(board, 'twoPoints', p[0], p[1], atts['id'], atts['name'],atts['withLabel']);
    } else if( ( JXG.IsNumber(p[0]) || JXG.IsFunction(p[0]) || JXG.IsString(p[0])) && JXG.IsPoint(p[1]) ) {
        // Number/Point
        el = new JXG.Circle(board, 'pointRadius', p[1], p[0], atts['id'], atts['name'],atts['withLabel']);
    } else if( ( JXG.IsNumber(p[1]) || JXG.IsFunction(p[1]) || JXG.IsString(p[1])) && JXG.IsPoint(p[0]) ) {
        // Point/Number
        el = new JXG.Circle(board, 'pointRadius', p[0], p[1], atts['id'], atts['name'],atts['withLabel']);
    } else if( (p[0].type == JXG.OBJECT_TYPE_CIRCLE) && JXG.IsPoint(p[1]) ) {
        // Circle/Point
        el = new JXG.Circle(board, 'pointCircle', p[1], p[0], atts['id'], atts['name'],atts['withLabel']);
    } else if( (p[1].type == JXG.OBJECT_TYPE_CIRCLE) && JXG.IsPoint(p[0])) {
        // Point/Circle
        el = new JXG.Circle(board, 'pointCircle', p[0], p[1], atts['id'], atts['name'],atts['withLabel']);
    } else if( (p[0].type == JXG.OBJECT_TYPE_LINE) && JXG.IsPoint(p[1])) {
        // Circle/Point
        el = new JXG.Circle(board, 'pointLine', p[1], p[0], atts['id'], atts['name'],atts['withLabel']);
    } else if( (p[1].type == JXG.OBJECT_TYPE_LINE) && JXG.IsPoint(p[0])) {
        // Point/Circle
        el = new JXG.Circle(board, 'pointLine', p[0], p[1], atts['id'], atts['name'],atts['withLabel']);
    } else if( parentArr.length==3 && JXG.IsPoint(p[0]) && JXG.IsPoint(p[1]) && JXG.IsPoint(p[2])) {
        // Circle through three points
        var arr = JXG.createCircumcircle(board, p, atts); // returns [center, circle]
        arr[0].setProperty({visible:false});
        return arr[1];
    } else
        throw ("Can't create circle with parent types '" + (typeof parentArr[0]) + "' and '" + (typeof parentArr[1]) + "'.");
    
    return el;
};

JXG.JSXGraph.registerElement('circle', JXG.createCircle);