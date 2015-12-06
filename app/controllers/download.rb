class Nchapp::DownloadController < Nchapp::ApplicationController
  def serve_pkg(name)
    pkg = CompiledPackage.find(name)
    if pkg
      response.redirect "/pkgs/#{pkg.filename}"
    else
      response.status = 404
      render '404'
    end
  end
  
  get '/nginx-nchan-latest.deb' do
    serve_pkg :debian
  end
  
  get '/nginx-nchan-latest.tar.gz' do
    serve_pkg :tarball
  end
  
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
end
