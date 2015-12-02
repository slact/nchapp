class Nchapp::RootController < Nchapp::ApplicationController
  get '/' do
    render 'README'
  end
  
  get '/pygments.css' do
    set_content_type "text/css"
    Pygments.css
  end
  
end
