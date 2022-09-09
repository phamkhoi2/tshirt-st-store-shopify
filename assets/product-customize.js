$(document).ready( () => {
	let button_add_cart = $('.product-single__add-btn');
	let form_add_cart = $('.product-single__form');

	button_add_cart.on('click', (e) => { 
		e.preventDefault();
		if(CART.cartEmptyStatus === 'false'){
			if(CART.cartFreeshipStatus === 'false' && PRODUCT.productFreeshipStatus === 'false'){
				form_add_cart.submit();
			}else if((CART.cartFreeshipStatus === 'true' && PRODUCT.productFreeshipStatus === 'false')
					|| (CART.cartFreeshipStatus === 'false' && PRODUCT.productFreeshipStatus === 'true')){
				$('.warning-same-cart').hasClass('hide') ? $('.warning-same-cart').removeClass('hide') : '';
				$('html').css({'overflow': 'hidden'});
			}else if(CART.cartFreeshipStatus === 'true' && PRODUCT.productFreeshipStatus === 'true'){
				form_add_cart.submit();
			}
		}else{
			form_add_cart.submit();
		}
	})
	
	if($('.warning-same-cart')){
		$('.warning-same-cart button').click((e) =>{
			console.log("heloo");
			!$('.warning-same-cart').hasClass('hide') ? $('.warning-same-cart').addClass('hide') : '';
			$('html').css({'overflow': ''});
		});
	}

	let setTimeHandleButtonFunction = setTimeout(() => {
		
		if($('.td-handle').length > 0){

			fetch('/cart.json')
				.then((response) => response.json())
				.then((data) => {

					

					if(data.items.length > 0){
						for(let i = 0; i < data.items.length; i++) {

							let handle = data.items[i].handle;

                            fetch(`/products/${handle}.json`)
							.then((response) => response.json())
							.then((data) => {
								console.log(data);
								console.log(data.product.tags);

								let hasFreeShippingTag = "false";

								if(data.product.tags.includes('送料無料')){
									hasFreeShippingTag = "true";
								}

								if( hasFreeShippingTag == "true" ){
									$('input[data-free-shipping="false"]').attr('readonly','readonly');
									$('input[data-free-shipping="false"]').css({"opacity": '0.3'});
								}else{
									$('input[data-free-shipping="true"]').attr('readonly','readonly');
									$('input[data-free-shipping="true"]').css({"opacity": '0.3'});
								}
							})
							
							
						}
					}
					
					

			});

			$('input.bulk-qty').on('click', (e) => {

				if(e.target.hasAttribute('readonly')){
					$('.warning-same-cart').hasClass('hide') ? $('.warning-same-cart').removeClass('hide') : '';
					$('html').css({'overflow': 'hidden'});
				}
			})
		}
	}, 2900);


})