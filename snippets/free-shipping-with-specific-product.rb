HIDE_RATES_FOR_PRODUCT_AND_COUNTRY = [
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
  

  class RateNameSelector
	def initialize(match_type, rate_names)
	  @match_type = match_type
	  @comparator = match_type == :exact ? '==' : 'include?'
	  @rate_names = rate_names&.map { |rate_name| rate_name.downcase.strip }
	end
  
	def match?(shipping_rate)
	  if @match_type == :all
		true
	  else
		next if shipping_rate.price == Money.zero
		shipping_rate.apply_discount(shipping_rate.price, message: "Free Shipping Item(s)!")
	  end
	end
  end
  

  class HideRatesForProductCountryCampaign
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
  
		rate_name_selector = RateNameSelector.new(
		  campaign[:rate_match_type],
		  campaign[:rate_names],
		)
  
		shipping_rates.each do |shipping_rate|
			rate_name_selector.match?(shipping_rate)
		  break
		end
	  end
	end
  end
  
  CAMPAIGNS = [
	HideRatesForProductCountryCampaign.new(HIDE_RATES_FOR_PRODUCT_AND_COUNTRY),
  ]
  
  CAMPAIGNS.each do |campaign|
	campaign.run(Input.cart, Input.shipping_rates)
  end
  
  Output.shipping_rates = Input.shipping_rates