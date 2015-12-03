class Nchapp::DownloadController < Nchapp::ApplicationController
  def serve_pkg(glob)
    found = nil
    Dir.chdir "gitdir/nchan/dev/package/pkgs/" do 
      found = Dir.glob(glob).first
    end
    if found
      response.redirect "/pkgs/#{found}"
    else
      response.status = 404
      render '404'
    end
  end
  
  get '/nginx-nchan-latest.deb' do
    serve_pkg "*.deb"
  end
  
  get '/nginx-nchan-latest.tar.gz' do
    serve_pkg "*.tar.gz"
  end
  
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
end
