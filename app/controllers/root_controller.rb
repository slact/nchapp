class Nchapp::RootController < Nchapp::ApplicationController
  get '/' do
    render 'README'
  end
end
