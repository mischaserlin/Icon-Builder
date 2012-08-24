$(function(){
	var imageLayers	= []
		, selectedCategory;

	var imageCategories = {
		backgrounds: [{id: 0, name: "Red", opacity: 1, url: "images/backgrounds/red.png"}, {id: 1, name: "Orange", opacity: 1, url: "images/backgrounds/orange.png"}, {id: 2, name: "Yellow", opacity: 1, opacity: 1, url: "images/backgrounds/yellow.png"}, {id:3, name:"Green", opacity: 1, opacity: 1, url: "images/backgrounds/green.png"}, {id: 4, name: "Blue", opacity: 1, url: "images/backgrounds/blue.png"}, {id: 5, name: "Magenta", opacity: 1, url: "images/backgrounds/magenta.png"}, {id: 6, name: "Violet", opacity: 1, url: "images/backgrounds/violet.png"}, {id: 7, name: "White", opacity: 1, url: "images/backgrounds/white.png"}, {id: 8, name: "Grey", opacity: 1, url: "images/backgrounds/grey.png"}, {id: 9, name: "Black", opacity: 1, url: "images/backgrounds/black.png"}]
		, icons: [{id: 10, name: "Chart", opacity: 1, url: "images/icons/chart.png"}, {id: 11, name: "Chatbox", opacity: 1, url: "images/icons/chatbox.png"}, {id: 12, name: "Check", opacity: 1, url: "images/icons/check.png"}, {id: 13, name: "Cloud", opacity: 1, url: "images/icons/cloud.png"}, {id: 14, name: "Eye", opacity: 1, url: "images/icons/eye.png"}, {id: 15, name: "Music", opacity: 1, url: "images/icons/music.png"}, {id: 16, name: "Plane", opacity: 1, url: "images/icons/plane.png"}, {id: 17, name: "Play", opacity: 1, url: "images/icons/play.png"}, {id: 18, name: "Scissors", opacity: 1, url: "images/icons/scissors.png"}]
		, effects: [{id: 20, name: "Highlight", opacity: 1, url: "images/effects/lighting.png"}, {id: 21, name: "Round Edges", opacity: 1, url: "images/effects/rounded_edges.png"}]
	};

	var sourceLayers = $("#image_layer_template").html();
	var templateLayers = Handlebars.compile(sourceLayers);

	var sourcePreview = $("#icon_preview_template").html();
	var templatePreview = Handlebars.compile(sourcePreview);

	$('.dropdown').on('click', 'a', function(){
		var imageCategoryHTML = "";
		for(var key in imageCategories){
			imageCategoryHTML += '<li><a class="center" href="#">' + key + '</a></li>';
		}
		console.log(imageCategoryHTML);
		$('.dropdown-menu').html(imageCategoryHTML);
	});

	$('.dropdown-menu').on('click', 'a', function(){
		var categoryPicked = selectedCategory = $(this).html();
		console.log(categoryPicked);
		var categoryDisplayHTML = "";
		for(var i = 0; i < imageCategories[categoryPicked].length; i++){
			categoryDisplayHTML += '<li class="' + categoryPicked + '"><img data-id="' + imageCategories[categoryPicked][i].id + '" data-category="' + selectedCategory + '" src="' + imageCategories[categoryPicked][i].url + '"></img></li> ';
		}
		console.log(categoryDisplayHTML);
		$('#image_category').html(categoryDisplayHTML);
	});

	var outputImageLayers = function(e){
		var imageLayerHTML = "";
		for(var i = 0; i < imageLayers.length; i++){
			var html = templateLayers(imageLayers[i]);
			imageLayerHTML += html;
		}
		console.log(imageLayerHTML);
		$('#image_layers_list').html(imageLayerHTML);
	};

	var showPreview = function(e){
		$(".previewHolder").html("");
		var imagePreviewHTML = "";
		for(var i = 0; i < imageLayers.length; i++){
			var html = templatePreview(imageLayers[i]);
			imagePreviewHTML += html;
		}
		$(".previewHolder").html(imagePreviewHTML);
	};

	var select = function(e){
		var imageSelected_id = $(this).find('img').attr("data-id")
			, imageSelected;
		for(var i = 0; i < imageCategories[selectedCategory].length; i++){
			if(imageSelected_id == imageCategories[selectedCategory][i].id){
				imageSelected = imageCategories[selectedCategory][i];
				break;
			}
		}
		// imageSelected = {id: imageSelected_id, name: imageSelected_name, opacity: 1, url: imageSelected_url}

		$('#image_category li').removeClass('highlight');
		$(this).addClass("highlight");

		imageLayers.push(imageSelected);
		console.log(imageLayers);

		outputImageLayers();
		showPreview();
	};

	var removeLayer = function(e){
		var selectedImageLayer_id = $(this).attr("data-id");
		var layerImage_id;
		for(var i = 0; i < imageLayers.length; i++){
			if( selectedImageLayer_id == imageLayers[i].id ){
				layerImage_id = i;
				break;
			}
		}
		console.log(layerImage_id);

		imageLayers.splice(layerImage_id, 1);
		console.log(imageLayers);

		outputImageLayers();
		showPreview();
	};

	var changeOpacity = function(event){
		var setOpactiy;
		if(event.which != 13){
			return;
		}
		else if( $(this).val() < 0 || $(this).val() > 1) {
			alert("The opacity must be between 0 and 1");
			return;
		}
		setOpacity = $(this).val();
		
		console.log(setOpacity);

		var selectedImageLayer_id = $(this).attr("data-id");
		for(var i = 0; i < imageLayers.length; i++){
			if( selectedImageLayer_id == imageLayers[i].id ){
				imageLayers[i].opacity = setOpacity;
				break;
			}
		}
		// $('.imageopacity-field').val(setOpacity);

		showPreview();
	};

	$('#image_category').on('click', 'li', select);

	$('#image_layers_list').on('click', '.deletelayer', removeLayer);

	$('#image_layers_list').on('keydown', '.imageopacity-field', changeOpacity);

});