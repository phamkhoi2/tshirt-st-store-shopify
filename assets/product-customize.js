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
				setTimeout(() => { 
					!$('.warning-same-cart').hasClass('hide') ? $('.warning-same-cart').addClass('hide') : '';
				}, 2000);
			}else if(CART.cartFreeshipStatus === 'true' && PRODUCT.productFreeshipStatus === 'true'){
				form_add_cart.submit();
			}
		}else{
			form_add_cart.submit();
		}
	})
})