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
    serve_pkg '/packages', :'nginx-common.deb'
  end
  
  get '/nginx-extras.deb' do
    serve_pkg '/packages', :'nginx-extras.deb'
  end
  
  get '/nginx-common.ubuntu.deb' do
    serve_pkg '/packages', :'nginx-common.ubuntu.deb'
  end
  
  get '/nginx-extras.ubuntu.deb' do
    serve_pkg '/packages', :'nginx-extras.ubuntu.deb'
  end
    
  get '/nginx-nchan.x86-64.rpm' do
    serve_pkg '/packages', :'nginx-nchan.rpm'
  end
  
  get '/nginx-nchan.src.rpm' do
    serve_pkg '/packages', :'nginx-nchan.src.rpm'
  end
  
  get '/nginx-mod-nchan.x86-64.rpm' do
    serve_pkg '/packages', :'nginx-mod-nchan.rpm'
  end
  
  get '/nginx-mod-nchan.src.rpm' do
    serve_pkg '/packages', :'nginx-mod-nchan.src.rpm'
  end
  
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
end
