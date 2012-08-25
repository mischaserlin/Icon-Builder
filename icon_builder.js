$(function(){
	var imageLayers	= []
		, selectedCategory;

	var imageCategories = {
		backgrounds: [{id: 0, name: "Red", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/red.png"}, {id: 1, name: "Orange", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/orange.png"}, {id: 2, name: "Yellow", opacity: 1, opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/yellow.png"}, {id:3, name:"Green", opacity: 1, opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/green.png"}, {id: 4, name: "Blue", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/blue.png"}, {id: 5, name: "Magenta", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/magenta.png"}, {id: 6, name: "Violet", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/violet.png"}, {id: 7, name: "White", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/white.png"}, {id: 8, name: "Grey", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/grey.png"}, {id: 9, name: "Black", opacity: 1, size: 144, top: 0, left: 0, url: "images/backgrounds/black.png"}]
		, icons: [{id: 10, name: "Chart", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/chart.png"}, {id: 11, name: "Chatbox", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/chatbox.png"}, {id: 12, name: "Check", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/check.png"}, {id: 13, name: "Cloud", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/cloud.png"}, {id: 14, name: "Eye", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/eye.png"}, {id: 15, name: "Music", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/music.png"}, {id: 16, name: "Plane", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/plane.png"}, {id: 17, name: "Play", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/play.png"}, {id: 18, name: "Scissors", opacity: 1, size: 144, top: 0, left: 0, url: "images/icons/scissors.png"}]
		, effects: [{id: 20, name: "Highlight", opacity: 1, size: 144, top: 0, left: 0, url: "images/effects/lighting.png"}, {id: 21, name: "Round Edges", opacity: 1, size: 144, top: 0, left: 0, url: "images/effects/rounded_edges.png"}]
	};

	var sourceLayers = $("#imageLayerTemplate").html();
	var templateLayers = Handlebars.compile(sourceLayers);

	var sourcePreview = $("#iconPreviewTemplate").html();
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
		$('#imageCategory').html(categoryDisplayHTML);
	});

	var outputImageLayers = function(e){
		var imageLayerHTML = "";
		for(var i = 0; i < imageLayers.length; i++){
			imageLayers[i].position = i;
			var html = templateLayers(imageLayers[i]);
			imageLayerHTML += html;
		}
		console.log(imageLayerHTML);
		console.log("check position", imageLayers);
		$('#imageLayersList').html(imageLayerHTML);
	};

	var reorderImageLayersArray = function(){
		console.log('BILBO', this);
		var removedLayerObject;

		for(var i = 0; i < imageLayers.length; i++){
			console.log('WILL IT BLEND?', $(this).attr("data-layer-position"), imageLayers[i].position);
			if($(this).attr("data-layer-position") == imageLayers[i].position){
				console.log("ITEMSSDFS", imageLayers[i]);
				removedLayerObject = imageLayers[i];
				imageLayers.splice(i,1);
				break;
			}
		}
		console.log("CHECKITEM", removedLayerObject);
		console.log(imageLayers);

		$("#imageLayersList li").each(function(index, element){
			if( $(element).attr("data-layer-position") == removedLayerObject.position){
				imageLayers.splice(index, 0, removedLayerObject);
			}
		});


		outputImageLayers();
		showPreview();
	};

	var showPreview = function(e){
		$(".previewHolder").html("");
		var imagePreviewHTML = templatePreview({layers: imageLayers});
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
		// imageSelected = {id: imageSelected_id, name: imageSelected_name, opacity: 1, size: 144, top: 0, left: 0, url: imageSelected_url}

		$('#imageCategory li').removeClass('highlight');
		$(this).addClass("highlight");

		imageLayers.push({
			id: imageSelected.id
			, opacity: imageSelected.opacity
			, name: imageSelected.name
			, size: 144, top: 0, left: 0, url: imageSelected.url
		});
		console.log(imageLayers);

		outputImageLayers();
		showPreview();
	};

	var removeLayer = function(e){
		var selectedImageLayerId = $(this).attr("data-id");
		var layerImagePosition;
		for(var i = 0; i < imageLayers.length; i++){
			if( selectedImageLayerId == imageLayers[i].id ){
				layerImagePosition = i;
				break;
			}
		}
		console.log(layerImagePosition);

		imageLayers.splice(layerImagePosition, 1);
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

		var selectedImageLayerId = $(this).attr("data-id");
		for(var i = 0; i < imageLayers.length; i++){
			if( selectedImageLayerId == imageLayers[i].id ){
				imageLayers[i].opacity = setOpacity;
				break;
			}
		}
		// $('.imageOpacityField').val(setOpacity);

		showPreview();
	};

	var changeSize = function(e){
		var setSize;
		
		if(Number($(this).val()) == NaN){
			alert("Please enter a valid number.")
			return;
		}
			
		setSize = $(this).val();

		console.log(setSize);

		var selectedImageLayerId = $(this).attr("data-id");
		for(var i = 0; i < imageLayers.length; i++){
			if( selectedImageLayerId == imageLayers[i].id ){
				imageLayers[i].size = setSize;
				break;
			}
		}

		showPreview();
	};

	var changeTopPosition = function(e){
		var setTopPosition;
		
		if(Number($(this).val()) == NaN){
			alert("Please enter a valid number.")
			return;
		}
			
		setTopPosition = $(this).val();

		console.log(setTopPosition);

		var selectedImageLayerId = $(this).attr("data-id");
		for(var i = 0; i < imageLayers.length; i++){
			if( selectedImageLayerId == imageLayers[i].id ){
				imageLayers[i].top = setTopPosition;
				break;
			}
		}

		showPreview();
	};

	var changeLeftPostion = function(e){
		var setLeftPosition;
		
		if(Number($(this).val()) == NaN){
			alert("Please enter a valid number.")
			return;
		}
			
		setLeftPosition = $(this).val();

		console.log(setLeftPosition);

		var selectedImageLayerId = $(this).attr("data-id");
		for(var i = 0; i < imageLayers.length; i++){
			if( selectedImageLayerId == imageLayers[i].id ){
				imageLayers[i].left = setLeftPosition;
				break;
			}
		}

		showPreview();
	};

	$('#imageCategory').on('click', 'li', select);

	$('#imageLayersList').on('click', '.deletelayer', removeLayer);

	$('#imageLayersList').on('keydown', '.imageOpacityField', changeOpacity);

	$('#imageLayersList').on('keyup', '.imageSizeField', changeSize);
	//later add ability to change width and height seperately with an option to link 
	//them to continue to change them proportionately.

	$('#imageLayersList').on('keyup', '.imageTopPositionField', changeTopPosition);

	$('#imageLayersList').on('keyup', '.imageLeftPositionField', changeLeftPostion);

	$('#imageLayersList').dragsort({ 
		dragSelector: ".movelayer"
		, dragEnd: reorderImageLayersArray
	});

	//$('#iconBuilder').on('click', 'button.approve', doSomeMagicalShit);
	/* The functions (doSomeMagicalShit) for this selector for the approve button 
	   should probably return you the imageLayers array because that contains the 
	   image layers and each images properties.
	*/


});