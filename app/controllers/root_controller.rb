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
  
  get '/pygments.css' do
    set_content_type "text/css"
    Pygments.css
  end
  
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
  
end
