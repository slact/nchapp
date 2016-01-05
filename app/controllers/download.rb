class Nchapp::DownloadController < Nchapp::ApplicationController
  def serve_pkg(path, name)
    pkg = CompiledPackage.find(name)
    if pkg
      response.redirect "#{path}/#{pkg.filename}"
    else
      response.status = 404
      render '404'
    end
  end
  
  get '/nginx-nchan-latest.deb' do
    serve_pkg '/pkgs', :debian
  end
  
  get '/nginx-nchan-latest.tar.gz' do
    serve_pkg '/pkgs', :tarball
  end
  
  get '/nginx-common.deb' do
    serve_pkg '/packages', :'nginx-common'
  end
  
  get '/nginx-extras.deb' do
    serve_pkg '/packages', :'nginx-extras'
  end
    
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
end
