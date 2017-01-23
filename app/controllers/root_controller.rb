class Nchapp::RootController < Nchapp::Application
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
  
  get '/experiment' do
    render 'experiment'
  end
  
  get '/nginxconf' do
    response.redirect '/nginxconf2016'
  end
  get '/nginxconf2016' do
    render 'nginxconf2016'
  end
    
  
  get '/redisconf' do
    response.redirect '/redisconf2016'
  end
  get '/redisconf2016' do
    render 'redisconf2016'
  end
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
  
end
