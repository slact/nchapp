module Nchapp
  class Application < Hobbit::Base
    use Rack::MethodOverride
    
    #autoload controllers, mapping them to basic routes by name
    ApplicationController.descendants.each do |ctrl|
      name=ctrl.name.match(".*?::(.*)Controller")[1].downcase!
      if name == "root"
        url="/"
      else
        url="/#{name}"
      end
      
      #puts "map #{url} to #{ctrl.name}"
      map(url) do
        run ctrl.new
      end
    end
  end
end
