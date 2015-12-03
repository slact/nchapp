class Nchapp::DownloadController < Nchapp::ApplicationController
  get '/nginx-nchan-latest.deb' do
    found = nil
    Dir.chdir "gitdir/nchan/dev/package/pkgs/" do 
      found = Dir.glob("*.deb").first
    end
    if found
      response.redirect "/pkgs/#{found}"
    else
      response.status = 404
      render '404'
    end
  end
  
  #404
  any /.*/, [:get, :post, :put, :delete] do
    response.status = 404
    render '404'
  end
end
