class Nchapp::RootController < Nchapp::ApplicationController
  get '/' do
    render 'README'
  end
  
  get '/readme' do
    #maybe_reload_templates 
    response.redirect '/'
  end
  
  get '/upgrade' do
    render 'upgrade'
  end
  
  get '/changelog' do
    #maybe_reload_templates 
    render 'changelog'
  end
  
  get '/details' do
    render 'details'
  end
  
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
  
end
