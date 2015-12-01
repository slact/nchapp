class Nchapp::RootController < Nchapp::ApplicationController
  get '/' do
    render 'index'
  end
end
