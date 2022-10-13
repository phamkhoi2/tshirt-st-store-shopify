FREE_RATES_FOR_PRODUCT = [
	{
	  product_selector_match_type: :include,
	  product_selector_type: :tag,
	  product_selectors: ["送料無料"],
	  rate_match_type: :exact,
	  rate_names: ["通常送料"],
	},
  ]
  
  class ProductSelector
	def initialize(match_type, selector_type, selectors)
	  @match_type = match_type
	  @comparator = match_type == :include ? 'any?' : 'none?'
	  @selector_type = selector_type
	  @selectors = selectors
	end
  
	def match?(line_item)
	  if self.respond_to?(@selector_type)
		self.send(@selector_type, line_item)
	  else
		raise RuntimeError.new('Invalid product selector type')
	  end
	end
  
	def tag(line_item)
	  product_tags = line_item.variant.product.tags.map { |tag| tag.downcase.strip }
	  @selectors = @selectors.map { |selector| selector.downcase.strip }
	  (@selectors & product_tags).send(@comparator)
	end

  end
  

  class FreeRatesForProductCampaign
	def initialize(campaigns)
	  @campaigns = campaigns
	end
  
	def run(cart, shipping_rates)
	  address = cart.shipping_address
  
	  return if address.nil?
  
	  @campaigns.each do |campaign|
		product_selector = ProductSelector.new(
		  campaign[:product_selector_match_type],
		  campaign[:product_selector_type],
		  campaign[:product_selectors],
		)
  
		product_match = cart.line_items.any? { |line_item| product_selector.match?(line_item) }
  
		next unless product_match 
   
		shipping_rates.each do |shipping_rate|
			shipping_rate.apply_discount(shipping_rate.price, message: "")
			next shipping_rate.name == '通常送料' ? shipping_rate.change_name('送料無料') : ''
		  break
		end
	  end
	end
  end
  
  CAMPAIGNS = [
	FreeRatesForProductCampaign.new(FREE_RATES_FOR_PRODUCT),
  ]
  
  CAMPAIGNS.each do |campaign|
	campaign.run(Input.cart, Input.shipping_rates)
  end
  
  Output.shipping_rates = Input.shipping_rates