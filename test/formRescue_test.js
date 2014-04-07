(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */
/*
  module('jQuery#formRescue', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.formRescue(), this.elems, 'should be chainable');
  });

  test('is awesome', function() {
    expect(1);
    strictEqual(this.elems.formRescue().text(), 'awesome0awesome1awesome2', 'should be awesome');
  });

  module('jQuery.formRescue');

  test('is awesome', function() {
    expect(2);
    strictEqual($.formRescue(), 'awesome.', 'should be awesome');
    strictEqual($.formRescue({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  });

  module(':formRescue selector', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is awesome', function() {
    expect(1);
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':formRescue').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });*/

module('formRescue', {
  setup: function() {
    $.plugin('formRescue', FormRescue);
    $('#myForm').formRescue();
  },
  teardown: function() {
  }
});

  // test('contruct me', 1, function() {
  //   ok(r);

  // });
  test('dom', function() {
    ok( $('#myForm').length, 'dom');
  });


  test('init', function() {
    ok( $('#myForm').formRescue(), 'plugin registered');
  });

  test('check for fields', function() {
    var fieldObj = $('#myForm').data('formRescue').getFields();
    var len = $.map(fieldObj, function(n, i) { return i; }).length;
    ok( len >= 1 , 'has fields');
  });

  test('check for all inputs', 5, function() {
    var fieldObj = $('#myForm').data('formRescue').getFields();
    ok( fieldObj.hasOwnProperty('text'), 'found text field');
    ok( fieldObj.hasOwnProperty('radio'), 'found radio field');
    ok( fieldObj.hasOwnProperty('checkbox'), 'found checkbox field');
    ok( fieldObj.hasOwnProperty('textarea'), 'found textarea field');
    ok( fieldObj.hasOwnProperty('select') , 'found select field');
  });

  test('check for elements we dont want', 4, function() {
    var fieldObj = $('#myForm').data('formRescue').getFields();
    equal( fieldObj.hasOwnProperty('submit'), false, 'submit not found');
    equal( fieldObj.hasOwnProperty('cancel'), false, 'cancel not found');
    equal( fieldObj.hasOwnProperty('button'), false, 'button not found');
    equal( fieldObj.hasOwnProperty('reset'), false, 'reset not found');
  });

  test('compare object',2, function() {
    var sampleA = sampleB = {};
    sampleA, sampleB = { 'a': 'foo', 'b': 'bar', 'c': 'baz' };

    equal( $('#myForm').data('formRescue')._checkData(sampleA, sampleB), true, 'data A is equal to data B');

    sampleA = { 'a': 'foo', 'b': 'bar', 'c': 'buz', 'd': 'boo' };
    sampleB = { 'a': 'foo', 'b': 'bar', 'c': 'baz'};

    notEqual( $('#myForm').data('formRescue')._checkSize(sampleA, sampleB), true, 'size A is not equal to size B');
  });

  test('check compare controller', 2, function() {
    var spySize = this.spy($('#myForm').data('formRescue'), "_checkSize");
    var spyData = this.spy($('#myForm').data('formRescue'), "_checkData");
    //spy.withArgs( { 'a': 'foo'}, { 'a': 'foo'}  );

    $('#myForm').data('formRescue').compareFormStates({ 'a': 'foo'}, { 'a': 'foo'});
    
    //ok(spy.withArgs({ 'a': 'foo'}, { 'a': 'foo'}).calledOnce, "compar data function called");
    sinon.assert.calledOnce(spySize);
    sinon.assert.calledOnce(spyData);
  });

  test('unload event', function() {
    var foo = new Event('unloadBind');
    var elem = document.getElementById('myForm');
    elem.addEventListener('unloadBind', function(e) { }, false);

    var spyUnload = this.spy();
    var spyDisplay = this.spy($('#myForm').data('formRescue'), "displayWarning");

    $('#myForm').on('unloadBind', spyUnload);
    elem.dispatchEvent(foo);
    sinon.assert.calledOnce(spyUnload);
  });

   test('leave event', function() {
    //var foo = new Event('on');
    var elem = document.getElementById('leave');
   
    var spyDisplay = this.spy($('#myForm').data('formRescue'), "displayWarning");
    $('#myform').on('unloadBind', spyUnload);

    $('#leave').click();
    //$('#myForm').on('unloadBind', spyUnload);
    //elem.dispatchEvent(foo);
    sinon.assert.calledOnce(spyUnload);
  });

/*  test('unload event', function() {
    var spyUnload = this.spy($('#myForm').data('formRescue'), "displayWarning");
    $($('#myForm').data('formRescue')).trigger('unloadBind');
    sinon.assert.calledOnce(spyUnload);
  });*/


}(jQuery));