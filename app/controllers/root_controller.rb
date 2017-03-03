class Nchapp::RootController < Nchapp::Application
  get '/' do
    show_announcements!
    render 'documentation'
  end
  
  get '/readme' do
    #maybe_reload_templates 
    response.redirect '/'
  end
  
  get '/upgrade' do
    set_title "Upgrade from Nginx HTTP Push Module"
    render 'upgrade'
  end
  
  get '/changelog' do
    set_title "Changelog"
    no_contents!
    render 'changelog'
  end
  
  get '/details' do
    response.redirect '/'
  end
  
  get '/support' do
    no_footer!
    no_contents!
    set_title "Professional Support"
    render 'support'
  end
  
  get '/experiment' do
    render 'experiment'
  end
  
  get '/nginxconf' do
    response.redirect '/nginxconf2016'
  end
  get '/nginxconf2016' do
    set_title "NGINX Conf 2016"
    render 'nginxconf2016'
  end
    
  
  get '/redisconf' do
    response.redirect '/redisconf2016'
  end
  get '/redisconf2016' do
    set_title "Redis Conf 2016"
    render 'redisconf2016'
  end
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
  
end
