(function($,window){

  var Grid = Backbone.Model.extend({

    
  });

  var GridSettingsForm = Backbone.View.extend({

    initialize: function(options){

      this.grid = options.grid;
    },

    events: {

      "input .column_width input": 'onColumnWidthChange',
      "input .gutter_width input": 'onGutterWidthChange',
      "input .column_number input": 'onColumnNumberChange',
      "submit": 'onSubmit'
    },

    render: function(){

      this.updateColumnWidth();
      this.updateGutterWidth();
      this.updateColumnNumber();
    },

    updateColumnWidth: function(){

      $('.column_width input').val(this.grid.get('columnWidth'));
    },

    updateGutterWidth: function(){

      $('.gutter_width input').val(this.grid.get('gutterWidth'));
    },

    updateColumnNumber: function(){
     
      $('.column_number input').val(this.grid.get('columnNumber')); 
    },

    onColumnWidthChange: function(event){

      this.grid.set('columnWidth',parseFloat($('.column_width input').val()));
      console.log('Gutter width updated');
    },

    onGutterWidthChange: function(event){

      this.grid.set('gutterWidth',parseFloat($('.gutter_width input').val()));
      console.log(this.grid);
    },

    onColumnNumberChange: function(event){

      this.grid.set('columnNumber',parseFloat($('.column_number input').val()));
      console.log(this.grid);
    },

    onSubmit: function(event){

      event.preventDefault();
    }

  });

  var GridDisplay = Backbone.View.extend({

    initialize: function(options){

      this.grid = options.grid;
      this.grid.on('change:columnNumber',_.bind(this.updateColumnNumber,this));
    },

    updateColumnNumber: function(){

      var columns = $('.column');
      var delta = columns.length - this.grid.get('columnNumber');
      console.log('Updating column number');
      console.log(columns);

      while(delta){

        if(delta > 0){

          console.log('Too many columns');
          $(columns[0]).remove();
          console.log(columns);
          columns.shift();
          delta--;
        }
        else{

          console.log('Too few columns');
          this.createColumn();
          delta++;
        }
      }

      console.log('');
      console.log('');
    },

    createColumn: function(){

      this.viewport.append($('<div class="column">'));
    },

    render: function(){


      if(!this.viewport){

        this.viewport = $('<div class="viewport">').appendTo(this.el);
        this.viewport.css('width','640px');
      }

      this.updateColumnNumber();

      new GridCSS({model: this.grid}).render();
    }
  });

  var GridCSS = Backbone.View.extend({

    initialize: function(options){
      this.el = $('<style>');
      this.model.on('change:columnWidth',_.bind(this.updateCSS,this));
      this.model.on('change:gutterWidth',_.bind(this.updateCSS,this));
    },

    events: {

      'change:columnWidth': 'onColWidthChange'
    },

    onColWidthChange: function(event){

      console.log('Column width changed');
    },

    updateCSS: function(){

      console.log('Updating CSS');
      var css = '.column{';

      css += 'margin: 0 '+this.model.get('gutterWidth')/2+'%;';
      css += 'width: '+this.model.get('columnWidth')+'%;';
      css += '}';

      this.el.html(css);
    },

    render: function(){


      console.log('Rendering grid');
      $('head').append(this.el);

      this.updateCSS();
    }
  });

  var MakeAGrid = Backbone.View.extend({

    initialize: function(options){

      this.grid = new Grid({
       columnWidth: 20,
       gutterWidth: 4,
       columnNumber: 2
      });

      this.render();
    },

    render: function(){

      new GridSettingsForm({
        el:$('.grid_settings'),
        grid: this.grid
      }).render();

      new GridDisplay({

        el:$('.grid'),
        grid: this.grid
      }).render();
    }
  });

  $(document).ready(function(){

    new MakeAGrid();
  });
})(jQuery,window);
