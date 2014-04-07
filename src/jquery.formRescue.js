/*
 * formRescue
 * https://github.com/cgonzales/jquery.formRescue
 *
 * Copyright (c) 2014 Christopher Gonzales
 * Licensed under the MIT license.

# USAGE:
#
# Intantiate the plugin:
#   $.plugin('formRescue', FormRescue);
#
# Many thanks to Alex Sexton for his tutorial
# http://alexsexton.com/blog/2010/02/using-inheritance-patterns-to-organize-large-jquery-applications/
#
*/

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {} // optionally move this outside the declaration and into a closure if you need more speed.
        F.prototype = o;
        return new F();
    };
}
/*
 * This was extracted and declared in jquery.factoryBridge.js
 * if not included uncomment the following:
 * 
 */


$.plugin = function(name, object) {
  $.fn[name] = function( options ) {
      return this.each(function() {
          if ( ! $.data(this, name) ) {
              $.data( this, name, Object.create( object ).init( options, this) );
          }
      });
  };
};

/*(function($) {

  // Collection method.
  $.fn.formRescue = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.formRescue = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.formRescue.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.formRescue.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].formRescue = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));*/

var FormRescue = {
  init: function( options, el ) {
  // Min in defaults with overrides
  this.options = $.extend( {}, this.options, options );

  this.$el = $(el);
  this.loadState= {};
  this._create();

  //this.$el.on( "unloadBind", this, this.displayWarning );

  return this;
  },

  options: {
    message: "gonna lose all the datas!"
  },
  _create: function() {
    this.loadState = this.getFields();
    this._registerUnload();
    //$(this).trigger("unloadBind", this ); // does work
    $(this).trigger('beforeunload');
  },

  getFields: function() {
      var formData = {};
      this.$el.find('input[type=text], select, textarea, :checkbox, :radio' ).each(function () {
          formData[ $(this).attr("name") ] = $(this).val();
      });
      return formData;
   },

   compareFormStates: function(objA, objB) {
      return this._checkData(objA, objB) === this._checkSize(objA, objB) ? true : false; 
   },

   displayWarning: function(event) {
    var formRescueObj = event.data;
    var currentState = formRescueObj.getFields();
    window.onbeforeunload = function(formRescueObj) {
      console.log('unloading');
      if ( formRescueObj.compareFormStates(formRescueObj.loadState, currentState) !== true ) {
        return "Warninig! You have unsaved data on the page. Any changes will be lost!";
      }
    }
   },

  _checkData: function(objA, objB) {
    var lengthObjA = $.map(objA, function(n, i) { return i; }).length;
    var keys = [];
      for (var k in objA) keys.push(k);

      for( var i = 0; i< lengthObjA; i++) {
        if( objA[keys[i]] !== objB[keys[i]]) {
           return false;
        }
    }
    return true;
  },

  _checkSize: function(objA, objB) {
    var lengthObjA = $.map(objA, function(n, i) { return i; }).length;
    var lengthObjB = $.map(objB, function(n, i) { return i; }).length;
    return lengthObjA === lengthObjB ? true : false;
  },

  _registerUnload: function() {
    _dirty = this;
    window.addEventListener("beforeunload", function(e, that) {
      ( e || window.event).returnValue = _dirty.options.message;
      return _dirty.options.message;
    });
  }

};