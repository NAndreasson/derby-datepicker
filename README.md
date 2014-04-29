derby-datepicker
================

Datepicker component for derby.js

Please note that this project is inspired by [Bootstrap-datepicker](https://github.com/eternicode/bootstrap-datepicker), and makes use of a css-file from that project.


Example usage
=====

First of make sure to install derby-datepicker through npm `npm install derby-datepicker`.


Including
--------
    
    app.component(require('derby-datepicker'));
        
In template
-------
   
    <Body:>
      <datepicker active="{{post.date}}"></datepicker>
      
Retrieve data
--------

    var pickedDate = model.get('post.date');
