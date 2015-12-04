class Nchapp::RootController < Nchapp::ApplicationController
  get '/' do
    response.redirect '/readme'
  end
  
  get '/readme' do
    render 'README'
  end
  
  get '/upgrade' do
    render 'upgrade'
  end
  
  get '/changelog' do
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
