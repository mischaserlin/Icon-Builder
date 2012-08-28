$(function(){
	Handlebars.registerHelper("key_value", function(obj, fn) {
	    var buffer = "",
	        key;

	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            buffer += fn({key: key, value: obj[key]});
	        }
	    }

	    return new Handlebars.SafeString(buffer);
	});

	function IconBuilder(){
		this.imageLayers = [];
		this.selectedCategory = [];
		this.imageCategories = { 
				backgrounds: [{id: 0, name: "Red", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/red.png"}, {id: 1, name: "Orange", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/orange.png"}, {id: 2, name: "Yellow", opacity: 1, opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/yellow.png"}, {id:3, name:"Green", opacity: 1, opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/green.png"}, {id: 4, name: "Blue", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/blue.png"}, {id: 5, name: "Magenta", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/magenta.png"}, {id: 6, name: "Violet", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/violet.png"}, {id: 7, name: "White", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/white.png"}, {id: 8, name: "Grey", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/grey.png"}, {id: 9, name: "Black", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/black.png"}]
				, icons: [{id: 10, name: "Chart", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/chart.png"}, {id: 11, name: "Chatbox", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/chatbox.png"}, {id: 12, name: "Check", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/check.png"}, {id: 13, name: "Cloud", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/cloud.png"}, {id: 14, name: "Eye", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/eye.png"}, {id: 15, name: "Music", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/music.png"}, {id: 16, name: "Plane", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/plane.png"}, {id: 17, name: "Play", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/play.png"}, {id: 18, name: "Scissors", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/scissors.png"}]
				,effects: [{id: 20, name: "Highlight", opacity: 1, size: 144, top: 0, left: 0, url: "images/effects/lighting.png"}]
			};
	};

	IconBuilder.prototype.init = function(){
		var self = this;

		this.templateLayers = Handlebars.compile($("#imageLayerTemplate").html());
		this.templatePreview = Handlebars.compile($("#iconPreviewTemplate").html());
		this.templateDropDownCategories = Handlebars.compile($('#dropdownImageCategories').html());
		this.templateShowImagesForCategory = Handlebars.compile($('#showImagesForCategory').html());

		$('.imageCategories select').html(this.templateDropDownCategories({categories: this.imageCategories}));
		$('.imageCategories').on('change', 'select', function(){
			self.showImagesForCategory($(this).val());
		});

		self.showImagesForCategory($('.imageCategories select').val());

		$('#imageCategory').on('click', 'li', function(){
			self.select.apply(self, arguments);
		});

		$('#imageLayersList').on('click', '.deletelayer', function(){
			self.removeLayer.apply(self, arguments);
		});

		$('#imageLayersList').on('keyup', '.imageOpacityField', function(){
			self.changeOpacity.apply(self, arguments);
		});

		$('#imageLayersList').on('keyup', '.imageSizeField', function(){
			self.changeSize.apply(self, arguments)
		});
		//later add ability to change width and height seperately with an option to link 
		//them to continue to change them proportionately.

		$('#imageLayersList').on('keyup', '.imageTopPositionField', function(){
			self.changeTopPosition.apply(self, arguments)
		});

		$('#imageLayersList').on('keyup', '.imageLeftPositionField', function(){
			self.changeLeftPosition.apply(self, arguments)
		});

		$('#imageLayersList').dragsort({ 
			dragSelector: ".imageLayerLeftSide"
			, scrollContainer: "#imageLayersList"
			, scrollSpeed: 10
			, dragEnd: function(){
				self.reorderImageLayersArray.apply(self,[this]);
			}
		});
	};


	IconBuilder.prototype.showImagesForCategory = function(category){
		this.selectedCategory = category;
		var categoryDisplayHTML = this.templateShowImagesForCategory({image: this.imageCategories[category]});
		$('#imageCategory').html(categoryDisplayHTML);
	};

	IconBuilder.prototype.outputImageLayers = function(){
		for(var i = 0; i < this.imageLayers.length; i++){
			this.imageLayers[i].position = i;
		}
		var imageLayerHTML = this.templateLayers({ image: this.imageLayers })
		$('#imageLayersList').html(imageLayerHTML);
	};

	IconBuilder.prototype.reorderImageLayersArray = function(dragSource){
		var removedLayerObject
			, self = this;
		for(var i = 0; i < this.imageLayers.length; i++){
			if($(dragSource).attr("data-layer-position") == this.imageLayers[i].position){
				removedLayerObject = this.imageLayers[i];
				this.imageLayers.splice(i,1);
				break;
			}
		}
		$("#imageLayersList li").each(function(index, element){
			if( $(element).attr("data-layer-position") == removedLayerObject.position){
				self.imageLayers.splice(index, 0, removedLayerObject);
			}
		});
		this.outputImageLayers();
		this.showPreview();
	};

	IconBuilder.prototype.showPreview = function(){
		$(".previewHolder").html("");
		var imagePreviewHTML = this.templatePreview({layers: this.imageLayers});
		$(".previewHolder").html(imagePreviewHTML);
	};

	IconBuilder.prototype.select = function(e){
		var element = $(e.currentTarget);
		var imageSelected_id = element.find('img').attr("data-id")
			, imageSelected;
		for(var i = 0; i < this.imageCategories[this.selectedCategory].length; i++){
			if(imageSelected_id == this.imageCategories[this.selectedCategory][i].id){
				imageSelected = this.imageCategories[this.selectedCategory][i];
				break;
			}
		}
		$('#imageCategory li').removeClass('highlight');
		element.addClass("highlight");
		this.imageLayers.push({
			id: imageSelected.id
			, opacity: imageSelected.opacity
			, name: imageSelected.name
			, size: 144
			, top: 0
			, left: 0
			, url: imageSelected.url
		});
		this.outputImageLayers();
		this.showPreview();		
	};

	IconBuilder.prototype.removeLayer = function(e){
		var element = $(e.currentTarget);
		var selectedImageLayerPosition = element.attr("data-position");
		this.imageLayers.splice(selectedImageLayerPosition, 1);
		this.outputImageLayers();
		this.showPreview();
	};

	IconBuilder.prototype.findAsset = function(input){
		var selectedImageLayerId = input.attr("data-id");
		for( var i = 0; i < this.imageLayers.length; i++ ){
			if( selectedImageLayerId == this.imageLayers[i].id ){
				return this.imageLayers[i];
			} 
		}
	};

	IconBuilder.prototype.propertyChangeCheck = function(e){
		var input = $(e.currentTarget);
		if( Number(input.val()) == NaN){
			alert("Please enter a valid number.")
			return false;
		}
		return true;		
	};

	IconBuilder.prototype.changeOpacity = function(e){
		var element = $(e.currentTarget);
		if(this.propertyChangeCheck(element)){
			var newOpacity = element.val();
			if(newOpacity < 0 || newOpacity > 1){
				alert('Opacity is a number between 0 and 1.')
				element.val(1);
			}else{
				this.findAsset(element).opacity = newOpacity;
				this.showPreview();
			}
		}		
	};

	IconBuilder.prototype.changeSize = function(e){
		var element = $(e.currentTarget);
		if(this.propertyChangeCheck(element)){
			this.findAsset(element).size = element.val();
			this.showPreview();
		}
	};

	IconBuilder.prototype.changeTopPosition = function(e){
		var element = $(e.currentTarget);
		if(this.propertyChangeCheck(element)){
			this.findAsset(element).top = element.val();
			this.showPreview();
		}		
	};

	IconBuilder.prototype.changeLeftPosition = function(e){
		var element = $(e.currentTarget);
		if(this.propertyChangeCheck(element)){
			this.findAsset(element).left = element.val();
			this.showPreview();
		}		
	};


	var iconBuilder = new IconBuilder();
	iconBuilder.init();

});