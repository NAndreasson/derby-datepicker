derby-datepicker
================

Datepicker component for derby.js.

At the time being there is only an inline version. If you have any suggestions or improvements, open an issue or send a pull request!


![https://github.com/NAndreasson/derby-datepicker/blob/gh-pages/images/datepicker.png](https://github.com/NAndreasson/derby-datepicker/blob/gh-pages/images/datepicker.png)

Please note that this project is inspired by [Bootstrap-datepicker](https://github.com/eternicode/bootstrap-datepicker), and makes use of a css-file from that project.

Format
=====
Dates set by datepicker will be in the format `YYYY-MM-DD` (2014-04-16). 


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
