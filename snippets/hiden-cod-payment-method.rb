HIDE_GATEWAY_FOR_PRODUCT = [
	{
	  product_selector_match_type: :include,
	  product_selector_type: :tag,
	  product_selectors: ["送料無料"],
	  gateway_match_type: :exact,
	  gateway_names: ["Cash on Delivery (COD)","銀行振込"]
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
  
  
  class GatewayNameSelector
	def initialize(match_type, gateway_names)
	  @comparator = match_type == :exact ? '==' : 'include?'
	  @gateway_names = gateway_names.map { |name| name.downcase.strip }
	end
  
	def match?(payment_gateway)
	  @gateway_names.any? { |name| payment_gateway.name.downcase.strip.send(@comparator, name) }
	end
  end
  
  
  class HideGatewayForProductCampaign
	def initialize(campaigns)
	  @campaigns = campaigns
	end
  
	def run(cart, payment_gateways)
	  @campaigns.each do |campaign|
		product_selector = ProductSelector.new(
		  campaign[:product_selector_match_type],
		  campaign[:product_selector_type],
		  campaign[:product_selectors],
		)
  
		next unless cart.line_items.any? { |line_item| product_selector.match?(line_item) }
  
		gateway_name_selector = GatewayNameSelector.new(
		  campaign[:gateway_match_type],
		  campaign[:gateway_names],
		)
  
		payment_gateways.delete_if do |payment_gateway|
		  gateway_name_selector.match?(payment_gateway)
		end
	  end
	end
  end
  
  CAMPAIGNS = [
	HideGatewayForProductCampaign.new(HIDE_GATEWAY_FOR_PRODUCT),
  ]
  
  CAMPAIGNS.each do |campaign|
	campaign.run(Input.cart, Input.payment_gateways)
  end
  
  Output.payment_gateways = Input.payment_gateways