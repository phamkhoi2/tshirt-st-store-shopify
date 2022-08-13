var productCardMarkup = `
<ul id="swym-item-grid" class="wishlist-items">
	{{#products}}
	<li class="wishlist-item">
		<div class="wishlist-item-card">
			<a class="link" href="{{du}}">
				<figure class="image-wrap">
					<img class="image" src="{{iu}}">
				</figure>
				<h4 class="title" aria-hidden="true">{{dt}} - {{variantinfo}}</h4>
			</a>
			<p class="price" data-price="">{{cu}}{{pr}}</p>
			<p class="variant">
              <span class="size">カラー サイズ：{{vi}}</span>
			</p>
			{{#isInCart}}
                <button data-product-id="{{empi}}" data-url="{{du}}" data-variant-id="{{epi}}" class="add-to-cart in-cart">
                	カートに追加済み
                </button>
			{{/isInCart}}
			{{^isInCart}}
                <button data-product-id="{{empi}}" data-url="{{du}}" data-variant-id="{{epi}}" class="add-to-cart">
					カートに入れる
                </button>
			{{/isInCart}}
			<div class="swym-remove">
				<a val-epi="{{epi}}" val-empi="{{empi}}" val-du="{{du}}" val-iu="{{iu}}" val-pr="{{pr}}" val-stk="{{stk}}" val-variants="{{variants}}" class="close" href="#"></a>
			</div>
		</div>
	</li>
	{{/products}}
</ul>
`;

function getVariantInfo(variants){
  try {
    let variantKeys = ((variants && variants != "[]") ? Object.keys(JSON.parse(variants)[0]) : []) , variantinfo;
    if(variantKeys.length > 0){
      variantinfo = variantKeys[0];
      if(variantinfo == "Default Title"){
        variantinfo = "";
      }
    } else {
      variantinfo = "";
    }
    return variantinfo;
  } catch(err){
    return variants;
  }
}

function swymCallbackFn(){
  // gets called once Swym is ready
  var wishlistContentsContainer = document.getElementById("wishlist-items-container");
  _swat.fetchWrtEventTypeET(
    function(products) {
      // Get wishlist items
      var formattedWishlistedProducts = products.map(function(p){
        p = SwymUtils.formatProductPrice(p);    // formats product price and adds currency to product Object
        p.isInCart = _swat.platform.isInDeviceCart(p.epi) || (p.et == _swat.EventTypes.addToCart);
        p.variantinfo = (p.variants ? getVariantInfo(p.variants) : "");
        console.log(p)
        if(p.variantinfo.match(" / ")){
          p.colorinfo = p.variantinfo.split(" / ")[0];
          p.sizeinfo = p.variantinfo.split(" / ")[1];
        } else {
          p.colorinfo = "";
          p.sizeinfo = "";
        }
        p.pr = Math.floor(p.pr);
        return p;
      });
      
      var productCardsMarkup = SwymUtils.renderTemplateString(productCardMarkup, {products: formattedWishlistedProducts});
      wishlistContentsContainer.innerHTML = productCardsMarkup;
      
      attachClickListeners();
      
    },
    window._swat.EventTypes.addToWishList
  );
}
if(!window.SwymCallbacks){
  window.SwymCallbacks = [];
}

window.SwymCallbacks.push(swymCallbackFn);


function onAddToCartClick(e){
  e.preventDefault();
  var productId = e.target.getAttribute("data-product-id");
  var variantId = e.target.getAttribute("data-variant-id");
  var du = e.target.getAttribute("data-url");
  e.target.innerHTML = "追加中";
  window._swat.replayAddToCart(
   {empi: productId, du: du},
   variantId,
   function() {
     e.target.innerHTML = "カートに追加";
     window.location.reload();
     console.log("カートに商品を追加しました。");
   },
   function(e) {
     console.log(e);
   }
  );
}

function onRemoveFromWishlistClick(e){
  e.preventDefault();
  var epi = e.target.getAttribute("val-epi");
  var du = e.target.getAttribute("val-du");
  var empi = e.target.getAttribute("val-empi");
  var iu = e.target.getAttribute("val-iu");
  var pr = e.target.getAttribute("val-pr");
  var stk = e.target.getAttribute("val-stk");
  var variants = e.target.getAttribute("val-variants");
  
  console.log(epi);
  console.log(du);
  console.log(empi);
  
  window._swat.removeFromWishList(
    {
      "epi": epi,
      "du": du,
      "empi": empi,
      "iu" : iu,
      "pr": pr,
      "stk": stk,
      "variants": variants
    },
    function() {
      window.location.reload();
      console.log('Removed to wishlist');
    }
  );
}

function attachClickListeners(){
  var addToCartButtons = document.getElementsByClassName("add-to-cart");
  for (var i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener('click', onAddToCartClick, false);
  }
  
  var removeFromWishlistButtons = document.getElementsByClassName("swym-remove");
  for (var i = 0; i < removeFromWishlistButtons.length; i++) {
    removeFromWishlistButtons[i].addEventListener('click', onRemoveFromWishlistClick, false);
  }
}